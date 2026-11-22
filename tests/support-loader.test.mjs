import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../public/assets/support-loader.js', import.meta.url), 'utf8');

function setup({ reduced = false, decode = () => Promise.resolve() } = {}) {
  let now = 0;
  let nextTimer = 0;
  const timers = new Map();
  const listeners = new Map();
  const makeElement = () => {
    const classes = new Set();
    const attributes = new Map();
    return {
      inert: false,
      focusCalls: [],
      classList: { add: name => classes.add(name), remove: name => classes.delete(name), contains: name => classes.has(name) },
      setAttribute: (name, value) => attributes.set(name, value),
      removeAttribute: name => attributes.delete(name),
      hasAttribute: name => attributes.has(name),
      focus(options) { this.focusCalls.push(options); },
    };
  };
  const root = makeElement();
  const content = makeElement();
  const loader = makeElement();
  const heading = makeElement();
  content.querySelector = () => ({ decode });
  const elements = { 'support-page-content': content, 'support-page-loader': loader, 'coffee-title': heading };
  vm.runInNewContext(source, {
    document: { documentElement: root, readyState: 'complete', getElementById: id => elements[id] },
    window: { matchMedia: () => ({ matches: reduced }), addEventListener: (name, callback) => listeners.set(name, callback) },
    performance: { now: () => now },
    setTimeout: (callback, delay) => { const id = ++nextTimer; timers.set(id, { at: now + delay, callback }); return id; },
    clearTimeout: id => timers.delete(id),
  });
  async function flush() { for (let i = 0; i < 5; i++) await Promise.resolve(); }
  async function advance(ms) {
    await flush();
    const until = now + ms;
    while (true) {
      const next = [...timers].filter(([, timer]) => timer.at <= until).sort((a, b) => a[1].at - b[1].at)[0];
      if (!next) break;
      const [id, timer] = next;
      timers.delete(id);
      now = timer.at;
      timer.callback();
      await flush();
    }
    now = until;
    await flush();
  }
  return { root, content, loader, heading, advance, restore: () => listeners.get('pageshow')({ persisted: true }) };
}

test('support page waits one second and fades before releasing interaction and focus', async () => {
  const page = setup();
  assert.equal(page.content.inert, true);
  assert(page.content.hasAttribute('aria-hidden'));
  await page.advance(999);
  assert(!page.loader.classList.contains('is-exiting'));
  await page.advance(1);
  assert(page.loader.classList.contains('is-exiting'));
  assert.equal(page.content.inert, true);
  await page.advance(240);
  assert.equal(page.content.inert, false);
  assert(!page.content.hasAttribute('aria-hidden'));
  assert(page.loader.hasAttribute('hidden'));
  assert.equal(page.heading.focusCalls.length, 1);
  assert.equal(page.heading.focusCalls[0].preventScroll, true);
});

test('reduced motion keeps the minimum wait and skips the fade delay', async () => {
  const page = setup({ reduced: true });
  await page.advance(999);
  assert.equal(page.content.inert, true);
  await page.advance(1);
  assert.equal(page.content.inert, false);
});

test('a failed image does not trap the support page behind its loader', async () => {
  const page = setup({ decode: () => Promise.reject(new Error('image failed')) });
  await page.advance(1240);
  assert.equal(page.content.inert, false);
  assert(!page.root.classList.contains('support-is-loading'));
});

test('a stalled image is released by the safety timeout and cannot restart an old cycle', async () => {
  let resolveImage;
  const page = setup({ decode: () => new Promise(resolve => { resolveImage = resolve; }) });
  await page.advance(4999);
  assert.equal(page.content.inert, true);
  await page.advance(1);
  assert.equal(page.content.inert, false);
  resolveImage();
  await page.advance(2000);
  assert(!page.root.classList.contains('support-is-loading'));
  assert.equal(page.heading.focusCalls.length, 1);
});

test('history restoration repeats the loading screen and releases the page again', async () => {
  const page = setup();
  await page.advance(1240);
  page.restore();
  assert.equal(page.content.inert, true);
  assert(!page.loader.hasAttribute('hidden'));
  assert(!page.loader.classList.contains('is-exiting'));
  await page.advance(1240);
  assert.equal(page.content.inert, false);
  assert.equal(page.heading.focusCalls.length, 2);
});
