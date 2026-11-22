import assert from 'node:assert/strict';
import { PATHS_KEY, readPaths, writePaths, togglePath } from '../src/saved-paths.js';

const values = new Map();
const storage = { getItem: key => values.get(key), setItem: (key, value) => values.set(key, value) };
assert.deepEqual(readPaths(storage), []);
values.set(PATHS_KEY, '["estudo","estudo","unknown",null,"bem-estar"]');
assert.deepEqual(readPaths(storage), ['estudo', 'bem-estar']);
for (const invalid of ['{broken', '{}', 'null', '42']) {
  values.set(PATHS_KEY, invalid);
  assert.deepEqual(readPaths(storage), []);
}
let saved = togglePath([], 'criatividade');
assert.deepEqual(saved, ['criatividade']);
assert(writePaths(storage, saved));
assert.deepEqual(readPaths(storage), saved);
saved = togglePath(saved, 'criatividade');
assert.deepEqual(saved, []);
assert.deepEqual(togglePath(saved, 'unknown'), []);
const blocked = { getItem() { throw new Error('Storage blocked'); }, setItem() { throw new Error('Quota exceeded'); } };
assert.deepEqual(readPaths(blocked), []);
assert.equal(writePaths(blocked, ['estudo']), false);
assert.equal(PATHS_KEY, 'revista-campus:prototype:paths:v1');
console.log('Saved paths: validated storage, corruption recovery, deduplication, add/remove, and blocked-storage fallback passed.');
