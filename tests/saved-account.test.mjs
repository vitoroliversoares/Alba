import test from 'node:test';
import assert from 'node:assert/strict';
import { createAccountService } from '../public/assets/account-service.js';
import { createAccountCollection } from '../src/account-collection.js';

const config = { supabaseUrl: 'https://testproject.supabase.co', supabasePublishableKey: 'sb_publishable_test_only' };
const user = { id: 'user-a', email: 'student@example.test' };
const session = { access_token: 'test-access', expires_in: 3600, user };
const ok = value => new Response(JSON.stringify(value), { status: 200 });
const login = client => client.signIn({ email: user.email, password: 'test-only' });
const tick = () => new Promise(resolve => setImmediate(resolve));
function fakeAccount() {
  let current = null;
  const listeners = new Set();
  const data = { favorites: ['github'], savedTopics: ['estudo'], routineMoments: null };
  return {
    data,
    getUser: () => current,
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
    setUser(value) { current = value; for (const listener of listeners) listener(value); },
    async loadSavedData() { return structuredClone(data); },
    async saveFavorite(id, saved) { data.favorites = saved ? [...data.favorites, id] : data.favorites.filter(value => value !== id); },
    async savePreferences(patch) { Object.assign(data, patch); return { savedTopics: [...data.savedTopics], routineMoments: data.routineMoments }; },
  };
}

test('guests cannot load, favorite or save preferences and send no data requests', async () => {
  let calls = 0;
  const client = createAccountService(config, { fetcher: async () => { ++calls; return ok([]); } });
  for (const action of [() => client.loadSavedData(), () => client.saveFavorite('github', true), () => client.savePreferences({ savedTopics: ['estudo'] })]) await assert.rejects(action(), { code: 'session_expired' });
  assert.equal(calls, 0);
});

test('saved data requests use the session token, explicit owner filters and permitted columns', async () => {
  const calls = [];
  const client = createAccountService(config, { fetcher: async (url, init) => {
    calls.push({ url: new URL(url), init });
    if (url.includes('/auth/')) return ok(session);
    if (url.includes('/user_preferences')) return ok([{ saved_topics: ['estudo'], routine_moments: [] }]);
    return ok([{ service_id: 'github' }]);
  } });
  await login(client);
  assert.deepEqual(await client.loadSavedData(), { favorites: ['github'], savedTopics: ['estudo'], routineMoments: [] });
  await client.saveFavorite('github', true);
  await client.saveFavorite('github', false);
  await client.savePreferences({ savedTopics: ['estudo'], routineMoments: [] });
  for (const call of calls.slice(1)) {
    assert.equal(call.init.headers.Authorization, 'Bearer test-access');
    assert.equal(call.init.headers.apikey, config.supabasePublishableKey);
    assert.equal(call.init.credentials, 'omit');
    if (call.init.method !== 'POST') assert.equal(call.url.searchParams.get('user_id'), 'eq.user-a');
  }
  assert.deepEqual(JSON.parse(calls[3].init.body), { user_id: 'user-a', service_id: 'github' });
  assert.deepEqual(JSON.parse(calls[5].init.body), { saved_topics: ['estudo'], routine_moments: [] });
});

test('a zero-row preference response cannot be reported as a successful save', async () => {
  const client = createAccountService(config, { fetcher: async url => ok(url.includes('/auth/') ? session : []) });
  await login(client);
  await assert.rejects(client.savePreferences({ savedTopics: ['estudo'] }), { code: 'request_failed' });
});

test('expired or anonymous sessions cannot access saved account data', async () => {
  let clock = 0;
  let calls = 0;
  const client = createAccountService(config, { now: () => clock, fetcher: async () => { ++calls; return ok({ ...session, expires_in: 1 }); } });
  await login(client);
  clock = 1001;
  await assert.rejects(client.saveFavorite('github', true), { code: 'session_expired' });
  assert.equal(calls, 1);
  const anonymous = createAccountService(config, { fetcher: async () => ok({ ...session, user: { ...user, is_anonymous: true } }) });
  await login(anonymous);
  await assert.rejects(anonymous.loadSavedData(), { code: 'session_expired' });
});

test('an API 401 clears the session and notifies the interface', async () => {
  const client = createAccountService(config, { fetcher: async url => url.includes('/auth/') ? ok(session) : new Response('{}', { status: 401 }) });
  await login(client);
  let observed = user;
  client.subscribe(value => { observed = value; });
  await assert.rejects(client.saveFavorite('github', true), { code: 'session_expired' });
  assert.equal(observed, null);
  assert.equal(client.getUser(), null);
});

test('invalid service IDs and unknown preference IDs never reach the Data API', async () => {
  let calls = 0;
  const client = createAccountService(config, { fetcher: async () => { ++calls; return ok(session); } });
  await login(client);
  await assert.rejects(client.saveFavorite('github&user_id=eq.other', true), { code: 'invalid_request' });
  await assert.rejects(client.savePreferences({ savedTopics: ['unknown'] }), { code: 'invalid_request' });
  assert.equal(calls, 1);
});

test('the collection restores database choices after login and removes them from view on logout', async () => {
  const account = fakeAccount();
  const collection = createAccountCollection(account);
  assert.equal(collection.getState().status, 'guest');
  await assert.rejects(collection.toggleFavorite('notion'), { code: 'session_expired' });
  account.setUser(user); await tick();
  await collection.toggleFavorite('notion');
  assert.deepEqual(collection.getState().favorites, ['github', 'notion']);
  account.setUser(null);
  assert.deepEqual(collection.getState().favorites, []);
  account.setUser(user); await tick();
  assert.deepEqual(collection.getState().favorites, ['github', 'notion']);
  collection.destroy();
});

test('a failed write preserves the last confirmed state and releases busy status', async () => {
  const account = fakeAccount(); account.setUser(user);
  const collection = createAccountCollection(account); await tick();
  account.saveFavorite = async () => { throw new Error('offline'); };
  await assert.rejects(collection.toggleFavorite('github'));
  assert.deepEqual(collection.getState().favorites, ['github']);
  assert.equal(collection.getState().busy, false);
  collection.destroy();
});

test('a failed load blocks changes until the user retries successfully', async () => {
  const account = fakeAccount(); account.setUser(user);
  account.loadSavedData = async () => { throw new Error('offline'); };
  const collection = createAccountCollection(account); await tick();
  assert.equal(collection.getState().status, 'error');
  await assert.rejects(collection.toggleTopic('criatividade'), { code: 'data_unavailable' });
  account.loadSavedData = async () => structuredClone(account.data);
  await collection.reload();
  assert.equal(collection.getState().status, 'ready');
  collection.destroy();
});

test('late loads cannot reveal the previous user collection after logout', async () => {
  const account = fakeAccount(); account.setUser(user);
  let finish;
  account.loadSavedData = () => new Promise(resolve => { finish = resolve; });
  const collection = createAccountCollection(account);
  account.setUser(null);
  finish(structuredClone(account.data)); await tick();
  assert.equal(collection.getState().user, null);
  assert.deepEqual(collection.getState().favorites, []);
  collection.destroy();
});

test('concurrent clicks are serialized and a late save cannot populate another session', async () => {
  const account = fakeAccount(); account.setUser(user);
  const collection = createAccountCollection(account); await tick();
  let finish;
  account.saveFavorite = () => new Promise(resolve => { finish = resolve; });
  const first = collection.toggleFavorite('notion');
  await assert.rejects(collection.toggleFavorite('canva'), { code: 'save_busy' });
  account.setUser({ id: 'user-b' }); await tick();
  finish(); await assert.rejects(first, { code: 'session_expired' });
  assert.equal(collection.getState().user.id, 'user-b');
  assert.deepEqual(collection.getState().favorites, ['github']);
  collection.destroy();
});

test('authenticated choices work with browser storage unavailable and never import legacy favorites', async () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  const account = fakeAccount(); account.setUser(user);
  let collection;
  try {
    Object.defineProperty(globalThis, 'localStorage', { configurable: true, get() { throw new Error('must not read browser data'); } });
    collection = createAccountCollection(account); await tick();
    await collection.saveTopics(['criatividade'], ['portfolio']);
    assert.deepEqual(collection.getState().savedTopics, ['estudo', 'criatividade']);
    assert.deepEqual(collection.getState().routineMoments, ['portfolio']);
  } finally {
    collection?.destroy();
    if (original) Object.defineProperty(globalThis, 'localStorage', original);
    else delete globalThis.localStorage;
  }
});
