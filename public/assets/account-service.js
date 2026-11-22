// Only public connection settings belong in app-config.json. Never add a secret key.
export function validateAppConfig(value = {}) {
  if (!value || typeof value !== 'object') value = {};
  let supabaseUrl = null;
  try {
    const url = new URL(value.supabaseUrl);
    if (url.protocol === 'https:' && /^[a-z0-9]+\.supabase\.co$/.test(url.hostname) && !url.username && !url.password && !url.port) supabaseUrl = url.origin;
  } catch { /* Unconfigured until an Alba project is connected. */ }
  const key = typeof value.supabasePublishableKey === 'string' && /^sb_publishable_[A-Za-z0-9_-]+$/.test(value.supabasePublishableKey) ? value.supabasePublishableKey : null;
  let supportUrl = null;
  try {
    const url = new URL(value.supportUrl);
    if (url.protocol === 'https:' && !url.username && !url.password) supportUrl = url.href;
  } catch { /* No payment recipient has been configured. */ }
  return { supabaseUrl, supabasePublishableKey: key, supportUrl, authEnabled: Boolean(supabaseUrl && key) };
}

let configPromise;
export function loadAppConfig() {
  configPromise ??= fetch('/app-config.json', { cache: 'no-store', credentials: 'same-origin' })
    .then(response => { if (!response.ok) throw new Error('config'); return response.json(); })
    .then(validateAppConfig).catch(() => validateAppConfig());
  return configPromise;
}

export class AccountError extends Error {
  constructor(code) { super(code); this.name = 'AccountError'; this.code = code; }
}

export function accountErrorMessage(error) {
  if (error?.code === 'not_configured') return 'O cadastro está em preparação. Você já pode explorar todos os benefícios sem conta.';
  if (error?.code === 'rate_limit') return 'Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente novamente.';
  if (error?.code === 'network') return 'Não foi possível conectar. Confira sua conexão e tente novamente.';
  if (error?.code === 'session_expired') return 'Sua sessão terminou. Entre novamente para continuar.';
  if (error?.code === 'weak_password') return 'Escolha uma senha mais forte, com pelo menos 8 caracteres.';
  if (error?.code === 'email_not_confirmed') return 'Confira seu e-mail e confirme o cadastro antes de entrar.';
  return 'Não foi possível concluir. Confira os dados e tente novamente.';
}

// Supabase Auth owns auth.users, password hashing and verification. This client
// uses its documented HTTPS API; it does not create a public password table.
// Session tokens stay in memory and are never persisted to localStorage.
export function createAccountService(config, { fetcher = globalThis.fetch, now = Date.now } = {}) {
  const settings = validateAppConfig(config);
  let session = null;
  let expiryTimer;
  const listeners = new Set();
  function notify() { for (const listener of listeners) listener(getUser()); }
  function getUser() {
    if (session && session.expiresAt <= now()) session = null;
    return session?.user ?? null;
  }
  function acceptSession(data) {
    if (!data.access_token || !data.user?.id || !(data.expires_in > 0)) throw new AccountError('invalid_response');
    session = { token: data.access_token, user: data.user, expiresAt: now() + Math.min(data.expires_in, 3600) * 1000 };
    clearTimeout(expiryTimer);
    expiryTimer = setTimeout(() => { session = null; notify(); }, session.expiresAt - now());
    expiryTimer.unref?.();
    // Refresh tokens are deliberately not retained: log in again after expiry.
    notify();
  }
  async function request(path, { body, token, method = 'POST', query = '' } = {}) {
    if (!settings.authEnabled) throw new AccountError('not_configured');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetcher(`${settings.supabaseUrl}/auth/v1${path}${query}`, {
        method, headers: { apikey: settings.supabasePublishableKey, 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        credentials: 'omit', cache: 'no-store', referrerPolicy: 'no-referrer', signal: controller.signal,
        ...(body ? { body: JSON.stringify(body) } : {}),
      });
      const data = response.status === 204 ? {} : await response.json().catch(() => ({}));
      if (!response.ok) {
        const code = response.status === 429 ? 'rate_limit' : ['weak_password', 'email_not_confirmed'].includes(data.error_code) ? data.error_code : 'request_failed';
        throw new AccountError(code);
      }
      return data;
    } catch (error) {
      if (error instanceof AccountError) throw error;
      throw new AccountError('network');
    } finally { clearTimeout(timeout); }
  }
  return {
    enabled: settings.authEnabled,
    getUser,
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
    async signUp({ email, password, name, redirectTo }) {
      const data = await request('/signup', { body: { email: email.trim(), password, data: { display_name: name.trim() } }, query: `?redirect_to=${encodeURIComponent(redirectTo)}` });
      if (data.access_token) { acceptSession(data); return { signedIn: true }; }
      // Do not distinguish duplicate registrations from new pending accounts.
      return { signedIn: false };
    },
    async signIn({ email, password }) {
      const data = await request('/token', { body: { email: email.trim(), password }, query: '?grant_type=password' });
      acceptSession(data);
      return getUser();
    },
    async signOut() {
      const token = session?.token;
      clearTimeout(expiryTimer);
      session = null;
      notify();
      if (token) await request('/logout', { token, query: '?scope=local' });
    },
    async recover({ email, redirectTo }) {
      await request('/recover', { body: { email: email.trim() }, query: `?redirect_to=${encodeURIComponent(redirectTo)}` });
    },
    async verifyCallback(token) {
      const user = await request('/user', { method: 'GET', token });
      if (!user.id) throw new AccountError('invalid_response');
      return user;
    },
    async resetPassword({ token, password }) {
      // Verify the provider-issued access token before changing this user's password.
      await request('/user', { method: 'GET', token });
      await request('/user', { method: 'PUT', token, body: { password } });
      // The password is already changed even if the following revocation fails.
      try { await request('/logout', { token, query: '?scope=local' }); return { serverSignedOut: true }; }
      catch { return { serverSignedOut: false }; }
    },
  };
}

let accountPromise;
export function getAccountService() {
  accountPromise ??= loadAppConfig().then(config => createAccountService(config));
  return accountPromise;
}
