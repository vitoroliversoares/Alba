import { createOAuthFlow, readOAuthRedirect } from './oauth-flow.js';

// Only public connection settings belong in app-config.json. Never add a secret key.
export function validateAppConfig(value = {}) {
  if (!value || typeof value !== 'object') value = {};
  let supabaseUrl = null;
  try {
    const url = new URL(value.supabaseUrl);
    if (url.protocol === 'https:' && /^[a-z0-9]+\.supabase\.co$/.test(url.hostname) && !url.username && !url.password && !url.port) supabaseUrl = url.origin;
  } catch { /* Unconfigured until an Alba project is connected. */ }
  const key = typeof value.supabasePublishableKey === 'string' && /^sb_publishable_[A-Za-z0-9_-]+$/.test(value.supabasePublishableKey) ? value.supabasePublishableKey : null;
  return { supabaseUrl, supabasePublishableKey: key, authEnabled: Boolean(supabaseUrl && key) };
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
  if (error?.code === 'save_busy') return 'Aguarde a conclusão da alteração anterior.';
  if (error?.code === 'data_unavailable') return 'Não foi possível carregar suas escolhas. Tente novamente antes de salvar.';
  if (error?.code === 'weak_password') return 'Escolha uma senha mais forte, com pelo menos 8 caracteres.';
  if (error?.code === 'email_not_confirmed') return 'Confira seu e-mail e confirme o cadastro antes de entrar.';
  if (error?.code === 'provider_unavailable') return 'Esta opção de acesso ainda está sendo configurada. Você pode usar e-mail e senha.';
  if (error?.code === 'oauth_storage') return 'Permita o armazenamento temporário desta aba para entrar com Google, ou use e-mail e senha.';
  if (error?.code === 'oauth_cancelled') return 'O acesso não foi concluído. Você pode tentar novamente quando quiser.';
  if (error?.code === 'oauth_expired') return 'Este acesso expirou ou foi iniciado em outra aba. Tente entrar novamente.';
  if (error?.code === 'oauth_unavailable') return 'Não foi possível iniciar o acesso neste navegador. Tente uma versão atualizada ou use e-mail e senha.';
  return 'Não foi possível concluir. Confira os dados e tente novamente.';
}

// Supabase Auth owns auth.users, password hashing and verification. This client
// uses its documented HTTPS API; it does not create a public password table.
// Session tokens stay in memory and are never persisted to localStorage.
export function createAccountService(config, { fetcher = globalThis.fetch, now = Date.now, oauthFlow = createOAuthFlow({ now }) } = {}) {
  const settings = validateAppConfig(config);
  let session = null;
  let expiryTimer;
  let authNotice = '';
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
  async function request(path, { body, token, method = 'POST', query = '', dataApi = false } = {}) {
    if (!settings.authEnabled) throw new AccountError('not_configured');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetcher(`${settings.supabaseUrl}/${dataApi ? 'rest' : 'auth'}/v1${path}${query}`, {
        method, headers: { apikey: settings.supabasePublishableKey, 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(dataApi ? { Prefer: 'return=representation' } : {}) },
        credentials: 'omit', cache: 'no-store', referrerPolicy: 'no-referrer', signal: controller.signal,
        ...(body ? { body: JSON.stringify(body) } : {}),
      });
      const data = response.status === 204 ? {} : await response.json().catch(() => ({}));
      if (!response.ok) {
        if (dataApi && response.status === 401) {
          if (session?.token === token) { session = null; clearTimeout(expiryTimer); notify(); }
          throw new AccountError('session_expired');
        }
        const code = response.status === 429 ? 'rate_limit' : ['weak_password', 'email_not_confirmed'].includes(data.error_code) ? data.error_code : 'request_failed';
        throw new AccountError(code);
      }
      return data;
    } catch (error) {
      if (error instanceof AccountError) throw error;
      throw new AccountError('network');
    } finally { clearTimeout(timeout); }
  }
  function requireSession() {
    const user = getUser();
    if (!user || user.is_anonymous) throw new AccountError('session_expired');
    return { userId: user.id, token: session.token };
  }
  async function savedRequest(path, options = {}) {
    const current = requireSession();
    const data = await request(path, { ...options, token: current.token, dataApi: true });
    if (session?.token !== current.token || !getUser()) throw new AccountError('session_expired');
    return data;
  }
  return {
    enabled: settings.authEnabled,
    getUser,
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
    consumeAuthNotice() { const value = authNotice; authNotice = ''; return value; },
    async getProviders() {
      const data = await request('/settings', { method: 'GET' });
      return { google: data.external?.google === true };
    },
    async getOAuthUrl(provider, { origin, redirectTo }) {
      if (provider !== 'google') throw new AccountError('invalid_provider');
      const providers = await this.getProviders();
      if (!providers[provider]) throw new AccountError('provider_unavailable');
      return oauthFlow.begin({ provider, supabaseUrl: settings.supabaseUrl, origin, redirectTo });
    },
    async completeOAuthRedirect(callback, origin) {
      try {
        const proof = oauthFlow.consume({ ...callback, origin, supabaseUrl: settings.supabaseUrl });
        const data = await request('/token', { query: '?grant_type=pkce', body: { auth_code: proof.code, code_verifier: proof.verifier } });
        if (!data.access_token || !data.user?.id || !(data.expires_in > 0)) throw new AccountError('invalid_response');
        const verified = await request('/user', { method: 'GET', token: data.access_token });
        if (verified.id !== data.user.id || verified.is_anonymous) throw new AccountError('invalid_response');
        acceptSession({ ...data, user: verified });
        authNotice = 'Você entrou na Alba. Suas descobertas estão por aqui.';
        return true;
      } catch (error) { authNotice = accountErrorMessage(error); return false; }
    },
    async loadSavedData() {
      const { userId } = requireSession();
      const owner = `user_id=eq.${encodeURIComponent(userId)}`;
      const [favorites, preferences] = await Promise.all([
        savedRequest('/user_favorites', { method: 'GET', query: `?${owner}&select=service_id&order=created_at.asc` }),
        savedRequest('/user_preferences', { method: 'GET', query: `?${owner}&select=saved_topics,routine_moments` }),
      ]);
      if (!Array.isArray(favorites) || !Array.isArray(preferences) || preferences.length !== 1 || !Array.isArray(preferences[0].saved_topics) || !(preferences[0].routine_moments === null || Array.isArray(preferences[0].routine_moments))) throw new AccountError('data_unavailable');
      return { favorites: [...new Set(favorites.map(row => row.service_id).filter(id => typeof id === 'string'))], savedTopics: preferences[0].saved_topics, routineMoments: preferences[0].routine_moments };
    },
    async saveFavorite(serviceId, saved) {
      const { userId } = requireSession();
      if (typeof serviceId !== 'string' || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(serviceId) || serviceId.length > 80) throw new AccountError('invalid_request');
      const result = await savedRequest('/user_favorites', saved
        ? { body: { user_id: userId, service_id: serviceId } }
        : { method: 'DELETE', query: `?user_id=eq.${encodeURIComponent(userId)}&service_id=eq.${encodeURIComponent(serviceId)}` });
      if (!Array.isArray(result) || (saved && !result.some(row => row.service_id === serviceId))) throw new AccountError('request_failed');
    },
    async savePreferences({ savedTopics, routineMoments } = {}) {
      const { userId } = requireSession();
      const body = {};
      const valid = (items, allowed) => Array.isArray(items) && items.length <= allowed.length && items.every(id => allowed.includes(id));
      if (savedTopics !== undefined) {
        if (!valid(savedTopics, ['estudo', 'criatividade', 'bem-estar'])) throw new AccountError('invalid_request');
        body.saved_topics = [...new Set(savedTopics)];
      }
      if (routineMoments !== undefined) {
        if (!valid(routineMoments, ['provas-tcc', 'portfolio', 'idiomas-codigo', 'ritmo-foco'])) throw new AccountError('invalid_request');
        body.routine_moments = [...new Set(routineMoments)];
      }
      if (!Object.keys(body).length) throw new AccountError('invalid_request');
      const rows = await savedRequest('/user_preferences', { method: 'PATCH', query: `?user_id=eq.${encodeURIComponent(userId)}&select=saved_topics,routine_moments`, body });
      if (!Array.isArray(rows) || rows.length !== 1) throw new AccountError('request_failed');
      return { savedTopics: rows[0].saved_topics, routineMoments: rows[0].routine_moments };
    },
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
  accountPromise ??= (async () => {
    const origin = globalThis.location?.origin;
    const callback = readOAuthRedirect(globalThis.location, globalThis.history);
    const client = createAccountService(await loadAppConfig());
    if (callback) await client.completeOAuthRedirect(callback, origin);
    return client;
  })();
  return accountPromise;
}
