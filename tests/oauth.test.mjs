import test from 'node:test';
import assert from 'node:assert/strict';
import { createOAuthFlow, OAUTH_TRANSACTION_KEY, readOAuthRedirect } from '../public/assets/oauth-flow.js';
import { createAccountService } from '../public/assets/account-service.js';

const config = { supabaseUrl: 'https://testproject.supabase.co', supabasePublishableKey: 'sb_publishable_test_only' };
const origin = 'http://127.0.0.1:4181';
const redirectTo = origin + '/oauth-callback.html';
const ok = data => new Response(JSON.stringify(data), { status: 200 });
const options = { provider: 'google', supabaseUrl: config.supabaseUrl, origin, redirectTo };
function storage() {
  const values = new Map();
  return { values, getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) };
}

test('OAuth creates random S256 proof with basic scopes and no token or secret in the URL', async () => {
  const memory = storage();
  const flow = createOAuthFlow({ storage: () => memory });
  const url = new URL(await flow.begin(options));
  assert.equal(url.origin, config.supabaseUrl);
  assert.equal(url.pathname, '/auth/v1/authorize');
  assert.equal(url.searchParams.get('code_challenge_method'), 's256');
  assert.equal(url.searchParams.get('redirect_to'), redirectTo);
  assert.equal(url.searchParams.get('scopes'), 'openid email profile');
  const record = JSON.parse(memory.getItem(OAUTH_TRANSACTION_KEY));
  assert.match(record.verifier, /^[A-Za-z0-9_-]{43}$/);
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(record.verifier));
  assert.equal(url.searchParams.get('code_challenge'), Buffer.from(digest).toString('base64url'));
  assert(!url.href.includes(record.verifier));
  assert(!/client_secret|access_token|refresh_token|apikey/.test(url.href));
  const next = new URL(await flow.begin(options));
  assert.notEqual(next.searchParams.get('code_challenge'), url.searchParams.get('code_challenge'));
});

test('OAuth never redirects to an untrusted origin, path or protocol', async () => {
  const flow = createOAuthFlow({ storage: () => storage() });
  for (const destination of ['https://other.test/oauth-callback.html', origin + '/other', origin + '/oauth-callback.html?next=evil', origin + '/oauth-callback.html#token', 'javascript:alert(1)']) await assert.rejects(flow.begin({ ...options, redirectTo: destination }));
  await assert.rejects(flow.begin({ ...options, provider: 'untrusted' }), { code: 'invalid_provider' });
  await assert.rejects(flow.begin({ ...options, provider: 'github' }), { code: 'invalid_provider' });
});

test('a blocked temporary storage prevents OAuth before leaving the Alba', async () => {
  const flow = createOAuthFlow({ storage() { throw Error('blocked'); } });
  await assert.rejects(flow.begin(options), { code: 'oauth_storage' });
});

test('the PKCE record is single-use, origin-bound, project-bound and short-lived', async () => {
  let clock = 1000;
  const memory = storage();
  const flow = createOAuthFlow({ storage: () => memory, now: () => clock });
  await flow.begin(options);
  const value = memory.getItem(OAUTH_TRANSACTION_KEY);
  assert(flow.consume({ code: 'test-code', origin, supabaseUrl: config.supabaseUrl }).verifier);
  assert.equal(memory.getItem(OAUTH_TRANSACTION_KEY), null);
  assert.throws(() => flow.consume({ code: 'test-code', origin, supabaseUrl: config.supabaseUrl }), { code: 'oauth_expired' });
  for (const patch of [{ origin: 'https://other.test' }, { supabaseUrl: 'https://other.supabase.co' }, { code: '' }]) {
    memory.setItem(OAUTH_TRANSACTION_KEY, value);
    assert.throws(() => flow.consume({ code: 'test-code', origin, supabaseUrl: config.supabaseUrl, ...patch }), { code: 'oauth_expired' });
  }
  memory.setItem(OAUTH_TRANSACTION_KEY, value);
  clock += 16 * 60 * 1000;
  assert.throws(() => flow.consume({ code: 'test-code', origin, supabaseUrl: config.supabaseUrl }), { code: 'oauth_expired' });
});

test('callback codes and untrusted provider error text are stripped from browser history', () => {
  const changes = [];
  const history = { replaceState: (...args) => changes.push(args[2]) };
  const callback = readOAuthRedirect(new URL(redirectTo + '?code=test-code'), history);
  assert.deepEqual(callback, { code: 'test-code', failed: false });
  const failure = readOAuthRedirect(new URL(redirectTo + '?error=access_denied&error_description=untrusted'), history);
  assert.equal(failure.failed, true);
  assert(!JSON.stringify(failure).includes('untrusted'));
  assert.deepEqual(changes, ['/#catalogo', '/#catalogo']);
  assert.equal(readOAuthRedirect(new URL(origin + '/other?code=unrelated'), history), null);
  const rootCallback = readOAuthRedirect(new URL('https://alba-hub.vercel.app/?code=production-code'), history);
  assert.deepEqual(rootCallback, { code: 'production-code', failed: false });
  assert.equal(readOAuthRedirect(new URL('https://alba-hub.vercel.app/'), history), null);
});

test('production OAuth returns to the same public site root with a bound PKCE transaction', async () => {
  const memory = storage();
  const flow = createOAuthFlow({ storage: () => memory });
  const productionOrigin = 'https://alba-hub.vercel.app';
  const url = new URL(await flow.begin({ ...options, origin: productionOrigin, redirectTo: productionOrigin + '/' }));
  assert.equal(url.searchParams.get('redirect_to'), productionOrigin + '/');
  assert.equal(JSON.parse(memory.getItem(OAUTH_TRANSACTION_KEY)).origin, productionOrigin);
  const proof = flow.consume({ code: 'production-code', origin: productionOrigin, supabaseUrl: config.supabaseUrl });
  assert.equal(proof.code, 'production-code');
  assert.equal(memory.getItem(OAUTH_TRANSACTION_KEY), null);
});

test('OAuth failure fragments at the public root are handled and scrubbed without reflecting provider text', () => {
  let cleaned;
  const history = { replaceState: (_state, _title, url) => { cleaned = url; } };
  const failure = readOAuthRedirect(new URL('https://alba-hub.vercel.app/#error=access_denied&error_description=untrusted'), history);
  assert.deepEqual(failure, { code: null, failed: true });
  assert.equal(cleaned, '/#catalogo');
  assert.equal(readOAuthRedirect(new URL('https://alba-hub.vercel.app/#inicio'), history), null);
});

test('a disabled provider never starts OAuth or creates a transaction', async () => {
  let began = false;
  const client = createAccountService(config, { fetcher: async () => ok({ external: { google: false, github: false } }), oauthFlow: { begin() { began = true; } } });
  await assert.rejects(client.getOAuthUrl('google', { origin, redirectTo }), { code: 'provider_unavailable' });
  assert.equal(began, false);
});

test('enabled provider starts only the configured Supabase OAuth flow', async () => {
  let received;
  const client = createAccountService(config, { fetcher: async () => ok({ external: { google: true, github: false } }), oauthFlow: { begin(data) { received = data; return 'https://testproject.supabase.co/auth/v1/authorize'; } } });
  assert.equal(await client.getOAuthUrl('google', { origin, redirectTo }), 'https://testproject.supabase.co/auth/v1/authorize');
  assert.deepEqual(received, options);
});

test('GitHub sign-in is rejected even if remotely enabled and before any network request', async () => {
  let requested = false;
  const client = createAccountService(config, { fetcher: async () => { requested = true; return ok({ external: { google: true, github: true } }); } });
  await assert.rejects(client.getOAuthUrl('github', { origin, redirectTo }), { code: 'invalid_provider' });
  assert.equal(requested, false);
});

test('code exchange verifies the user before opening a session and discards provider tokens', async () => {
  const memory = storage();
  const flow = createOAuthFlow({ storage: () => memory });
  await flow.begin(options);
  const calls = [];
  const verified = { id: 'verified-user', email: 'student@example.test' };
  const client = createAccountService(config, { oauthFlow: flow, fetcher: async (url, init) => {
    calls.push({ url, init });
    return ok(url.includes('/token') ? { access_token: 'verified-access', refresh_token: 'discard-refresh', provider_token: 'discard-provider', user: verified, expires_in: 3600 } : verified);
  } });
  assert.equal(await client.completeOAuthRedirect({ code: 'test-code', failed: false }, origin), true);
  assert.equal(client.getUser().id, verified.id);
  assert.equal(new URL(calls[0].url).searchParams.get('grant_type'), 'pkce');
  const body = JSON.parse(calls[0].init.body);
  assert.equal(body.auth_code, 'test-code');
  assert.match(body.code_verifier, /^[A-Za-z0-9_-]{43}$/);
  assert.equal(calls[1].init.headers.Authorization, 'Bearer verified-access');
  assert.equal(memory.values.size, 0);
  assert(!JSON.stringify(client.getUser()).includes('discard-'));
  assert(client.consumeAuthNotice().includes('Você entrou'));
  assert.equal(client.consumeAuthNotice(), '');
});

test('rejected proof or mismatched verified identity cannot open a session', async () => {
  let calls = 0;
  const client = createAccountService(config, { oauthFlow: { consume() { throw Object.assign(Error(), { code: 'oauth_expired' }); } }, fetcher: async () => { ++calls; return ok({}); } });
  assert.equal(await client.completeOAuthRedirect({ code: 'bad' }, origin), false);
  assert.equal(calls, 0);
  assert.equal(client.getUser(), null);
  const mismatched = createAccountService(config, { oauthFlow: { consume: () => ({ code: 'test', verifier: 'test' }) }, fetcher: async url => ok(url.includes('/token') ? { access_token: 'test-access', user: { id: 'a' }, expires_in: 3600 } : { id: 'b' }) });
  assert.equal(await mismatched.completeOAuthRedirect({ code: 'test' }, origin), false);
  assert.equal(mismatched.getUser(), null);
});
