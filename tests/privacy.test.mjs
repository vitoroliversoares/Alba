import test from 'node:test';
import assert from 'node:assert/strict';
import { ALBA_PREFERENCE_KEYS, clearAlbaPreferences } from '../public/assets/privacy-controls.js';
import { FAVORITES_KEY } from '../src/data/catalog.js';
import { SAVED_TOPICS_KEY, MOMENTS_STORAGE_KEY } from '../src/data/editorialData.js';

test('privacy removal covers current Alba preferences and preserves unrelated origin data', () => {
  assert.deepEqual(ALBA_PREFERENCE_KEYS, [FAVORITES_KEY, SAVED_TOPICS_KEY, MOMENTS_STORAGE_KEY]);
  const values = new Map([...ALBA_PREFERENCE_KEYS.map(key => [key, '["saved"]']), ['another-app', 'keep']]);
  assert.equal(clearAlbaPreferences({ removeItem: key => values.delete(key) }), true);
  assert.deepEqual([...values], [['another-app', 'keep']]);
});

test('a partially blocked removal reports failure instead of claiming all preferences were cleared', () => {
  const values = new Map(ALBA_PREFERENCE_KEYS.map(key => [key, '["saved"]']));
  const result = clearAlbaPreferences({ removeItem(key) {
    if (key === SAVED_TOPICS_KEY) throw new Error('SecurityError');
    values.delete(key);
  } });
  assert.equal(result, false);
  assert(values.has(SAVED_TOPICS_KEY));
});

test('privacy controls handle an inaccessible localStorage getter', () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  try {
    Object.defineProperty(globalThis, 'localStorage', { configurable: true, get() { throw new Error('SecurityError'); } });
    assert.equal(clearAlbaPreferences(), false);
  } finally {
    if (original) Object.defineProperty(globalThis, 'localStorage', original);
    else delete globalThis.localStorage;
  }
});
