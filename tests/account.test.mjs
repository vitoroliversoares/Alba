import test from 'node:test';
import assert from 'node:assert/strict';
import { accountErrorMessage, createAccountService, validateAppConfig } from '../public/assets/account-service.js';

const config = { supabaseUrl: 'https://testproject.supabase.co', supabasePublishableKey: 'sb_publishable_test_only' };
const session = { access_token: 'test-access', refresh_token: 'discard-this', expires_in: 3600, user: { id: 'user-a', email: 'student@example.test', user_metadata: { display_name: 'Student' } } };
const ok = data => new Response(JSON.stringify(data), { status: 200 });

test('connection settings reject secret keys and insecure endpoints', () => {
  assert.equal(validateAppConfig(config).authEnabled, true);
  for (const value of [null, {}, { ...config, supabasePublishableKey: 'sb_secret_private' }, { ...config, supabaseUrl: 'http://testproject.supabase.co' }, { ...config, supabaseUrl: 'https://testproject.supabase.co.attacker.test' }, { ...config, supabaseUrl: 'https://user:pass@testproject.supabase.co' }]) assert.equal(validateAppConfig(value).authEnabled, false);
});

test('unconfigured account creation sends no credentials anywhere', async () => {
  let requested = false;
  const client = createAccountService({}, { fetcher: async () => { requested = true; return ok({}); } });
  await assert.rejects(client.signIn({ email: 'student@example.test', password: 'password-test' }), error => error.code === 'not_configured');
  assert.equal(requested, false);
});

test('signup uses managed Auth and sends a private name, not a public password row', async () => {
  let request;
  const client = createAccountService(config, { fetcher: async (url, init) => { request = { url, init }; return ok({ id: 'pending-user' }); } });
  const result = await client.signUp({ email: ' student@example.test ', password: 'test-password', name: ' Student ', redirectTo: 'https://alba.example.test/auth-callback.html' });
  assert.equal(result.signedIn, false);
  const url = new URL(request.url);
  assert.equal(url.pathname, '/auth/v1/signup');
  assert.equal(url.searchParams.get('redirect_to'), 'https://alba.example.test/auth-callback.html');
  assert.deepEqual(JSON.parse(request.init.body), { email: 'student@example.test', password: 'test-password', data: { display_name: 'Student' } });
  assert.equal(request.init.credentials, 'omit');
  assert.equal(request.init.referrerPolicy, 'no-referrer');
  assert.equal(client.getUser(), null, 'A confirmation email is not an authenticated session');
});

test('login and local logout keep a session in memory and request server revocation', async () => {
  const calls = [];
  const client = createAccountService(config, { fetcher: async (url, init) => { calls.push({ url, init }); return url.includes('/logout') ? new Response(null, { status: 204 }) : ok(session); } });
  const observed = [];
  const unsubscribe = client.subscribe(user => observed.push(user?.id ?? null));
  assert.equal((await client.signIn({ email: 'student@example.test', password: 'test-password' })).id, 'user-a');
  assert.equal(new URL(calls[0].url).searchParams.get('grant_type'), 'password');
  await client.signOut();
  assert.equal(new URL(calls[1].url).searchParams.get('scope'), 'local');
  assert.equal(calls[1].init.headers.Authorization, 'Bearer test-access');
  assert.deepEqual(observed, ['user-a', null]);
  assert.equal(client.getUser(), null);
  unsubscribe();
});

test('expired sessions are removed and failed server logout still removes local credentials', async () => {
  let clock = 0;
  let fail = false;
  const client = createAccountService(config, { now: () => clock, fetcher: async () => fail ? new Response('{}', { status: 500 }) : ok({ ...session, expires_in: 1 }) });
  await client.signIn({ email: 'a@example.test', password: 'test-password' });
  clock = 1001;
  assert.equal(client.getUser(), null);
  await client.signIn({ email: 'a@example.test', password: 'test-password' });
  fail = true;
  await assert.rejects(client.signOut());
  assert.equal(client.getUser(), null);
});

test('recovery and password updates use provider verification before changing a password', async () => {
  const calls = [];
  const client = createAccountService(config, { fetcher: async (url, init) => { calls.push({ url, init }); return ok({ id: 'user-a' }); } });
  await client.recover({ email: ' student@example.test ', redirectTo: 'https://alba.example.test/auth-callback.html' });
  assert.deepEqual(JSON.parse(calls[0].init.body), { email: 'student@example.test' });
  const result = await client.resetPassword({ token: 'verified-token', password: 'new-test-password' });
  assert.equal(calls[1].init.method, 'GET');
  assert.equal(calls[2].init.method, 'PUT');
  assert.equal(calls[2].init.headers.Authorization, 'Bearer verified-token');
  assert.deepEqual(JSON.parse(calls[2].init.body), { password: 'new-test-password' });
  assert.equal(result.serverSignedOut, true);
});

test('a rejected recovery token never reaches a password update', async () => {
  const calls = [];
  const client = createAccountService(config, { fetcher: async (url, init) => { calls.push(init.method); return new Response('{}', { status: 401 }); } });
  await assert.rejects(client.resetPassword({ token: 'expired-token', password: 'new-test-password' }));
  assert.deepEqual(calls, ['GET']);
});

test('rate limits and transport errors give safe messages without returning server details', async () => {
  const limited = createAccountService(config, { fetcher: async () => new Response(JSON.stringify({ msg: 'private server detail' }), { status: 429 }) });
  await assert.rejects(limited.signIn({ email: 'a@example.test', password: 'test-password' }), error => error.code === 'rate_limit' && !accountErrorMessage(error).includes('private'));
  const offline = createAccountService(config, { fetcher: async () => { throw new TypeError('internal URL and detail'); } });
  await assert.rejects(offline.signIn({ email: 'a@example.test', password: 'test-password' }), error => error.code === 'network');
});
