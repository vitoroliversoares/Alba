import test from 'node:test';
import assert from 'node:assert/strict';
import { allModes, filterServices, offerStatus, readFavoriteIds, SERVICES, VERIFIED_AT } from '../src/data/catalog.js';

test('every real offer has official evidence, eligibility, renewal and a verification date', () => {
  assert.deepEqual(SERVICES.map(s => s.id), ['github', 'google', 'notion', 'canva', 'spotify', 'apple-music', 'microsoft', 'autodesk', 'adobe', 'youtube', 'jetbrains', 'figma']);
  const domains = {
    github: ['education.github.com', 'docs.github.com'],
    google: ['one.google.com', 'gemini.google', 'support.google.com'],
    notion: ['www.notion.com'], canva: ['www.canva.com'],
    spotify: ['www.spotify.com', 'support.spotify.com'],
    'apple-music': ['www.apple.com', 'music.apple.com', 'support.apple.com'],
    microsoft: ['www.microsoft.com'], autodesk: ['www.autodesk.com'],
    adobe: ['www.adobe.com'], youtube: ['www.youtube.com', 'support.google.com'],
    jetbrains: ['www.jetbrains.com', 'sales.jetbrains.com'],
    figma: ['www.figma.com', 'help.figma.com', 'forum.figma.com', 'www.rnpmais.rnp.br'],
  };
  const ids = new Set();
  for (const service of SERVICES) {
    for (const offer of service.offers) {
      assert(!ids.has(offer.id)); ids.add(offer.id);
      for (const field of ['title', 'summary', 'price', 'eligibility', 'renewal']) assert(offer[field]?.length > 8, `${offer.id}: ${field}`);
      assert.match(offer.verifiedAt, /^\d{4}-\d{2}-\d{2}$/);
      assert(offer.verifiedAt <= VERIFIED_AT);
      assert(offer.steps.length >= 2 && offer.sources.length >= 1);
      for (const url of [offer.officialUrl, ...offer.sources.map(s => s.url)]) {
        const parsed = new URL(url);
        assert.equal(parsed.protocol, 'https:');
        assert(domains[service.id].includes(parsed.hostname), url);
      }
    }
  }
  assert.equal(ids.size, 15);
});

test('opening without a category includes every service and preserves explicit category choices', () => {
  assert.deepEqual(filterServices().map(service => service.id), SERVICES.map(service => service.id));
  assert.equal(filterServices({ category: 'bem-estar' }).some(service => service.id === 'github'), false);
  assert.deepEqual(filterServices({ query: 'YouTube' }).map(service => service.id), ['google', 'youtube']);
});

test('search, category and modality combine and keep only matching plans', () => {
  const youtube = filterServices({ category: 'estudo', query: 'YouTube', modes: { ...allModes(), trial: false } });
  assert.equal(youtube.length, 1);
  assert.equal(youtube[0].id, 'google');
  assert.deepEqual(youtube[0].offers.map(o => o.id), ['google-ai-pro-youtube-student']);
  assert.equal(filterServices({ category: 'criatividade', query: 'Notion' }).length, 0);
  assert.equal(filterServices({ query: 'programacao' })[0].id, 'github');
  assert.equal(filterServices({ modes: Object.fromEntries(Object.keys(allModes()).map(k => [k, false])) }).length, 0);
});

test('student access keeps free benefits and trials distinct and excludes institutional plans', () => {
  const free = filterServices({ category: 'estudo', modes: { free: true } });
  assert.deepEqual(free.map(s => s.id), ['github', 'notion', 'autodesk', 'jetbrains', 'figma']);
  assert(free.every(s => s.offers.every(o => o.kind === 'free')));
  const canva = SERVICES.find(s => s.id === 'canva');
  assert.equal(canva.offers[0].kind, 'trial');
  assert.equal(canva.offers[0].scope, 'general');
  assert.equal(canva.offers.length, 1);
  assert(SERVICES.every(service => service.offers.every(offer => offer.kind !== 'institutional' && !offer.officialUrl.includes('/higher-education'))));
  const google = SERVICES.find(s => s.id === 'google');
  assert.deepEqual(google.offers.map(o => o.kind), ['trial', 'discount', 'discount']);
  assert.equal(google.offers[0].renewalPrice.amount, 24.99);
  assert.equal(google.offers[1].renewalPrice, undefined, 'An unconfirmed price must not become zero');
});

test('new student plans keep music, productivity and educational licenses in their relevant categories', () => {
  const music = filterServices({ category: 'bem-estar', modes: { discount: true } });
  assert.deepEqual(music.map(s => s.id), ['spotify', 'apple-music', 'youtube']);
  assert.deepEqual(filterServices({ category: 'todos', query: 'Word' }).map(s => s.id), ['microsoft']);
  assert.deepEqual(filterServices({ category: 'criatividade', query: 'AutoCAD', modes: { free: true } }).map(s => s.id), ['autodesk']);
  for (const service of music.filter(service => service.id !== 'youtube')) {
    assert.equal(service.offers[0].renewalPrice.amount, 12.9);
    assert.equal(service.offers[0].kind, 'discount', 'An introductory trial does not make the recurring student plan free');
  }
  const microsoft = SERVICES.find(s => s.id === 'microsoft').offers[0];
  assert.equal(microsoft.renewalPrice, undefined, 'R$ 25 was not confirmed in a current provider price');
  assert(!/R\$\s*25/.test(`${microsoft.price} ${microsoft.renewal}`));
  assert(microsoft.price.includes('consultar'));
  assert(SERVICES.find(s => s.id === 'autodesk').offers[0].renewal.includes('comercial'));
});

test('new plans preserve regional uncertainty, distinct bundles and educational restrictions', () => {
  const youtube = filterServices({ category: 'todos', query: 'YouTube', modes: { ...allModes(), trial: false } });
  assert.deepEqual(youtube.map(service => service.id), ['google', 'youtube']);
  const standalone = youtube.find(service => service.id === 'youtube');
  assert.deepEqual(standalone.offers.map(offer => offer.id), ['youtube-premium-student', 'youtube-music-premium-student']);
  assert(standalone.description.includes('não precisa assinar ambos'));
  assert(standalone.offers.every(offer => offer.kind === 'discount' && offer.renewalPrice === undefined && offer.price.includes('consultar')));
  const jetbrains = SERVICES.find(service => service.id === 'jetbrains').offers[0];
  assert(jetbrains.renewal.includes('não comercial') && jetbrains.eligibility.includes('bootcamps'));
  assert(jetbrains.summary.includes('avaliação limitada'));
  assert.equal(SERVICES.some(service => service.id === 'obsidian'), false, 'Unresolved regional candidates stay unpublished');
  for (const service of SERVICES) {
    const expectedDate = ['adobe', 'youtube', 'jetbrains', 'figma'].includes(service.id) ? '2026-11-22' : '2026-11-20';
    assert(service.offers.every(offer => offer.verifiedAt === expectedDate), 'Adding plans must not redate old evidence');
  }
});

test('Figma remains conditional student access with regional evidence and honest renewal limits', () => {
  const offer = SERVICES.find(service => service.id === 'figma').offers[0];
  assert.equal(offer.kind, 'free');
  assert.equal(offer.scope, 'student');
  assert.equal(offer.officialUrl, 'https://www.figma.com/education/apply');
  assert(offer.sources.some(source => new URL(source.url).hostname === 'www.rnpmais.rnp.br'));
  assert(offer.summary.includes('não comercial'));
  assert(offer.renewal.includes('reverificação') && offer.renewal.includes('Starter'));
  assert(!offer.renewal.includes('dois anos garantidos'));
  assert(offer.renewal.includes('não é ilimitada'));
  assert.equal(offer.renewalPrice, undefined, 'A free education plan must not invent a paid renewal price');
  assert.deepEqual(filterServices({ category: 'criatividade', query: 'Figma', modes: { free: true } }).map(service => service.id), ['figma']);
});

test('Adobe promotional price expires after the Brazilian deadline and discloses annual commitment', () => {
  const offer = SERVICES.find(service => service.id === 'adobe').offers[0];
  assert(offer.price.includes('27,50') && offer.price.includes('anual'));
  assert(offer.renewal.includes('12 meses') && offer.renewal.includes('139'));
  assert.equal(offer.renewalPrice.amount, 139);
  assert.equal(offerStatus(offer, new Date('2026-11-28T02:59:59Z')), 'active');
  assert.equal(offerStatus(offer, new Date('2026-11-28T03:00:00Z')), 'expired');
});

test('Google trial closes after the official redemption deadline, not on its last day', () => {
  const offer = SERVICES[1].offers[0];
  assert.equal(offerStatus(offer, new Date('2026-12-31T23:59:59Z')), 'active');
  assert.equal(offerStatus(offer, new Date('2027-01-01T02:59:59Z')), 'active');
  assert.equal(offerStatus(offer, new Date('2027-01-01T03:00:00Z')), 'expired');
  assert.equal(offerStatus(SERVICES[0].offers[0], new Date('2027-01-01T00:00:00Z')), 'active');
});

test('favorites survive duplicate data and preserve legacy IDs without relabeling them', () => {
  assert.deepEqual(readFavoriteIds({ getItem: () => '["github","github","atlas-cursos",3]' }), ['github', 'atlas-cursos']);
  assert.deepEqual(readFavoriteIds({ getItem: () => '{bad' }), []);
  assert.deepEqual(readFavoriteIds({ getItem: () => '{"github":true}' }), []);
  assert.deepEqual(readFavoriteIds({ getItem() { throw new Error('blocked'); } }), []);
});

test('a blocked localStorage getter does not crash catalog rendering', () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  try {
    Object.defineProperty(globalThis, 'localStorage', { configurable: true, get() { throw new Error('SecurityError'); } });
    assert.deepEqual(readFavoriteIds(), []);
  } finally {
    if (original) Object.defineProperty(globalThis, 'localStorage', original);
    else delete globalThis.localStorage;
  }
});
