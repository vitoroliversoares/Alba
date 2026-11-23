import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

test('production build includes the bundled entry and linked local resources', async () => {
  const output = new URL('../dist/client/', import.meta.url);
  const html = await readFile(new URL('index.html', output), 'utf8');
  assert(!html.includes('/src/main.jsx'), 'The production entry must be compiled');
  const resources = [...html.matchAll(/(?:src|href)="(\/(?!\/)[^"]+)"/g)].map(match => match[1]);
  assert(resources.some(file => file.endsWith('.js')), 'The app needs a client entry');
  for (const file of [...resources, '/quem-somos.html', '/privacidade.html', '/auth-callback.html', '/oauth-callback.html', '/assets/oauth-flow.js']) {
    await access(new URL(file.slice(1), output));
  }
});
