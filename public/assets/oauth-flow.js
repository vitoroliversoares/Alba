// Temporary PKCE proof only. Access/refresh/provider tokens are never stored here.
export const OAUTH_TRANSACTION_KEY = 'alba:oauth:pkce:v1';
const PROVIDERS = ['google'];
const MAX_AGE_MS = 15 * 60 * 1000;
const base64url = bytes => btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

export class OAuthFlowError extends Error {
  constructor(code) { super(code); this.name = 'OAuthFlowError'; this.code = code; }
}

export function readOAuthRedirect(location, history) {
  if (!location) return null;
  const url = new URL(location.href);
  const fragment = new URLSearchParams(url.hash.slice(1));
  const rootReturn = url.pathname === '/' && (url.searchParams.has('code') || url.searchParams.has('error') || url.searchParams.has('error_code') || fragment.has('error') || fragment.has('error_code') || fragment.has('access_token'));
  if (url.pathname !== '/oauth-callback.html' && !rootReturn) return null;
  const result = { code: url.searchParams.get('code'), failed: url.searchParams.has('error') || url.searchParams.has('error_code') || Boolean(url.hash && url.hash !== '#catalogo') };
  // Drop the single-use code and any provider error text before loading the app.
  history.replaceState(null, '', '/#catalogo');
  return result;
}

export function createOAuthFlow({ storage = () => globalThis.sessionStorage, crypto = globalThis.crypto, now = Date.now } = {}) {
  function takeTransaction() {
    try {
      const target = storage();
      const value = target.getItem(OAUTH_TRANSACTION_KEY);
      target.removeItem(OAUTH_TRANSACTION_KEY);
      return value ? JSON.parse(value) : null;
    } catch { throw new OAuthFlowError('oauth_storage'); }
  }
  return {
    async begin({ provider, supabaseUrl, origin, redirectTo }) {
      if (!PROVIDERS.includes(provider)) throw new OAuthFlowError('invalid_provider');
      const destination = new URL(redirectTo);
      if (destination.origin !== origin || !['/', '/oauth-callback.html'].includes(destination.pathname) || destination.search || destination.hash || destination.username || destination.password || !(destination.protocol === 'https:' || (destination.protocol === 'http:' && ['127.0.0.1', 'localhost'].includes(destination.hostname)))) throw new OAuthFlowError('invalid_redirect');
      if (!crypto?.getRandomValues || !crypto?.subtle) throw new OAuthFlowError('oauth_unavailable');
      const verifier = base64url(crypto.getRandomValues(new Uint8Array(32)));
      const challenge = base64url(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier)));
      const record = { verifier, provider, supabaseUrl, origin, createdAt: now() };
      try {
        const target = storage();
        const serialized = JSON.stringify(record);
        target.setItem(OAUTH_TRANSACTION_KEY, serialized);
        if (target.getItem(OAUTH_TRANSACTION_KEY) !== serialized) throw new Error('Storage unavailable');
      } catch { throw new OAuthFlowError('oauth_storage'); }
      const url = new URL(`${supabaseUrl}/auth/v1/authorize`);
      url.searchParams.set('provider', provider);
      url.searchParams.set('redirect_to', destination.href);
      url.searchParams.set('code_challenge', challenge);
      url.searchParams.set('code_challenge_method', 's256');
      // Basic identity only; no repository, Drive, Gmail or offline access scopes.
      url.searchParams.set('scopes', 'openid email profile');
      return url.href;
    },
    consume({ code, failed, origin, supabaseUrl }) {
      const record = takeTransaction();
      if (failed) throw new OAuthFlowError('oauth_cancelled');
      if (!record || typeof code !== 'string' || !code || code.length > 2048 || !/^[A-Za-z0-9_-]{43}$/.test(record.verifier) || !PROVIDERS.includes(record.provider) || record.origin !== origin || record.supabaseUrl !== supabaseUrl || !Number.isFinite(record.createdAt) || now() < record.createdAt || now() - record.createdAt > MAX_AGE_MS) throw new OAuthFlowError('oauth_expired');
      return { code, verifier: record.verifier };
    },
  };
}
