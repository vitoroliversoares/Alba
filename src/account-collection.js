import { AccountError } from '../public/assets/account-service.js';

export const EMPTY_COLLECTION = { user: null, status: 'guest', favorites: [], savedTopics: [], routineMoments: null, busy: false };

// A new login replaces the entire collection. No browser data is imported and
// late responses from another session cannot repopulate the current account.
export function createAccountCollection(account) {
  let state = { ...EMPTY_COLLECTION };
  let generation = 0;
  const listeners = new Set();
  const publish = patch => { state = { ...state, ...patch }; for (const listener of listeners) listener(state); };
  async function reload() {
    const current = ++generation;
    const user = account.getUser();
    publish({ ...EMPTY_COLLECTION, user, status: user ? 'loading' : 'guest' });
    if (!user) return;
    try {
      const data = await account.loadSavedData();
      if (current === generation) publish({ ...data, status: 'ready' });
    } catch {
      if (current === generation) publish({ status: 'error' });
    }
  }
  function requireReady() {
    const user = account.getUser();
    if (!user || user.is_anonymous || user.id !== state.user?.id) throw new AccountError('session_expired');
    if (state.status !== 'ready') throw new AccountError('data_unavailable');
    if (state.busy) throw new AccountError('save_busy');
  }
  async function change(action) {
    requireReady();
    const current = generation;
    publish({ busy: true });
    try {
      const patch = await action();
      if (current !== generation || !account.getUser()) throw new AccountError('session_expired');
      publish(patch);
    } finally { if (current === generation) publish({ busy: false }); }
  }
  const unsubscribe = account.subscribe(() => { void reload(); });
  void reload();
  return {
    getState: () => state,
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
    reload,
    destroy() { ++generation; unsubscribe(); listeners.clear(); },
    toggleFavorite(id) {
      return change(async () => {
        const saved = !state.favorites.includes(id);
        await account.saveFavorite(id, saved);
        return { favorites: saved ? [...state.favorites, id] : state.favorites.filter(value => value !== id) };
      });
    },
    toggleTopic(id) {
      return change(async () => account.savePreferences({ savedTopics: state.savedTopics.includes(id) ? state.savedTopics.filter(value => value !== id) : [...state.savedTopics, id] }));
    },
    saveTopics(ids, routineMoments) {
      return change(async () => account.savePreferences({ savedTopics: [...new Set([...state.savedTopics, ...ids])], ...(routineMoments !== undefined ? { routineMoments } : {}) }));
    },
  };
}
