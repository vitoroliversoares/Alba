import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import { get } from 'node:http';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { validateAppConfig } from '../public/assets/account-service.js';
const require = createRequire(import.meta.url);
const React = require('react');
const { renderToString, renderToPipeableStream } = require('react-dom/server');
const { PassThrough } = require('node:stream');
const { App, Catalog, OfferDetails, CampusWorkbench, EditorialFaq, SavedPathsDialog, RoutineBuilder, TOPICS, SERVICES, LoadingScreen, LoadingExperience } = require('./app-ssr.cjs');
const html = renderToString(React.createElement(App));
const allCategorySelected = markup => /class="category active"[^>]*aria-pressed="true">Todos<\/button>/.test(markup);
const defaultCatalog = renderToString(React.createElement(Catalog, { onBack() {} }));
assert(allCategorySelected(defaultCatalog), 'The catalog default must be Todos');
assert.equal((defaultCatalog.match(/name="catalog-services"/g) || []).length, SERVICES.length);
const previousWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
try {
  Object.defineProperty(globalThis, 'window', { configurable: true, value: { location: { hash: '#catalogo' } } });
  const directCatalog = await new Promise((resolve, reject) => {
    const output = new PassThrough();
    let markup = '';
    output.on('data', chunk => { markup += chunk; });
    output.on('end', () => resolve(markup));
    output.on('error', reject);
    const renderer = renderToPipeableStream(React.createElement(App), {
      onAllReady() { renderer.pipe(output); },
      onError: reject,
    });
  });
  assert(allCategorySelected(directCatalog), 'Opening or reloading #catalogo must initialize Todos through App');
  assert.equal((directCatalog.match(/name="catalog-services"/g) || []).length, SERVICES.length);
} finally {
  if (previousWindow) Object.defineProperty(globalThis, 'window', previousWindow);
  else delete globalThis.window;
}
assert(html.includes('Boas descobertas'));
assert(html.includes('Alba') && !html.includes('Revista'), 'The main interface must use the approved Alba name');
assert(!html.includes('role="search"'), 'The landing must introduce the product before the catalog');
assert(!html.includes('Atlas Cursos'), 'No offer listing on the landing');
assert(!html.includes('prévia da interface futura'), 'The FAQ must describe the connected account flow');
assert(html.includes('src="/assets/sol-e-livro-cutout.png"'));
assert.equal((html.match(/class="topic-story"/g) || []).length, 3);
assert(html.includes('<section class="routine-builder" id="rotina"'));
assert(!html.includes('routine-disclosure') && !html.includes('spell-check-card'), 'The routine guide must be visible and use the editorial layout');
assert(!html.includes('coffee-motion-toggle') && !html.includes('spell-marquee'));
assert(html.includes('href="/quem-somos.html"') && html.includes('href="/privacidade.html"'), 'The landing footer must expose both institutional pages');
assert(html.includes('class="login-link"'), 'The landing must retain account access');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
assert.equal(ids.length, new Set(ids).size, 'No duplicate IDs');
const accountHeader = renderToString(React.createElement(Catalog, { initialCategory: 'todos', onBack() {}, onAccount() {} }));
assert(accountHeader.includes('class="text-button catalog-account-link"'), 'The catalog must retain account access');
const catalogSource = await fs.readFile(new URL('../src/Catalog.jsx', import.meta.url), 'utf8');
const realCatalogSource = await fs.readFile(new URL('../src/data/catalog.js', import.meta.url), 'utf8');
assert(realCatalogSource.includes("'revista-campus:prototype:favorites:v1'"));
const dataSource = await fs.readFile(new URL('../src/data/editorialData.js', import.meta.url), 'utf8');
assert(dataSource.includes("'revista-campus:prototype:paths:v1'"));
const discoveryChecks = [];
for (const topic of TOPICS) {
  const markup = renderToString(React.createElement(CampusWorkbench, { savedTopics: [topic.id], onToggleTopic() {}, onExplore() {} }));
  assert.equal((markup.match(/aria-pressed="true"/g) || []).length, 1);
  assert(markup.includes(`/assets/${topic.image}`));
  discoveryChecks.push({ topic: topic.id, initialRender: 'passed' });
}
const questions = renderToString(React.createElement(EditorialFaq));
assert.equal((questions.match(/class="faq-trigger"/g) || []).length, 5);
const routineChecks = [];
const routineStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
try {
  for (const [name, stored, selected, image] of [
    ['initial', null, 1, 'campus.png'],
    ['empty selection', '[]', 0, null],
    ['creative project', '["portfolio"]', 1, 'category-creative.png'],
    ['pauses', '["ritmo-foco"]', 1, 'category-wellbeing-v2.png'],
    ['all moments', '["provas-tcc","portfolio","idiomas-codigo","ritmo-foco"]', 4, 'campus.png'],
    ['corrupt storage', '{invalid', 1, 'campus.png'],
  ]) {
    Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: { getItem: () => stored } });
    const markup = renderToString(React.createElement(RoutineBuilder, { savedTopics: [], onSaveManyTopics() {}, onExplore() {} }));
    assert.equal((markup.match(/type="checkbox"/g) || []).length, 4, name);
    assert.equal((markup.match(/checked=""/g) || []).length, selected, name);
    assert(markup.includes('role="status"') && markup.includes('<legend>'), name);
    if (image) assert(markup.includes(`/assets/${image}`), name);
    else assert(markup.includes('Explorar todos os benefícios') && !markup.includes('routine-illustration'), name);
    routineChecks.push({ state: name, checked: selected, initialRender: 'passed' });
  }
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: { getItem: () => '["portfolio"]' } });
  const saved = renderToString(React.createElement(RoutineBuilder, { savedTopics: ['criatividade'], onSaveManyTopics() {}, onExplore() {} }));
  assert(saved.includes('disabled=""') && saved.includes('Editorias guardadas'));
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, get() { throw new Error('blocked'); } });
  assert(renderToString(React.createElement(RoutineBuilder, { savedTopics: [], onSaveManyTopics() {}, onExplore() {} })).includes('/assets/campus.png'));
} finally {
  if (routineStorage) Object.defineProperty(globalThis, 'localStorage', routineStorage);
  else delete globalThis.localStorage;
}
for (const savedTopics of [[], ['bem-estar'], TOPICS.map(t => t.id)]) {
  const markup = renderToString(React.createElement(SavedPathsDialog, { dialogRef: { current: null }, savedTopics, storageUnavailable: false, onToggleTopic() {}, onExplore() {} }));
  assert.equal((markup.match(/class="saved-benefit"/g) || []).length, savedTopics.length);
}
const catalogChecks=[];
for (const [category, title, brand] of [['estudo','GitHub','github'],['criatividade','Canva','canva'],['bem-estar','Notion','notion']]) {
  const catalog=renderToString(React.createElement(Catalog,{initialCategory:category,onBack:()=>{}}));
  assert(catalog.includes(title) && catalog.includes(`/assets/brands/${brand}.svg`));
  assert(catalog.includes('role="search"') && catalog.includes('Fontes oficiais'));
  assert(catalog.includes('Voltar à apresentação da Alba'));
  assert(catalog.includes('href="/quem-somos.html"') && catalog.includes('href="/privacidade.html"'));
  assert(catalog.includes('/assets/sol-e-livro-logo.png'));
  assert(!catalog.includes('class="hero"') && !catalog.includes('sol-e-livro-cutout.png'), 'Catalog uses the compact book and sun instead of the landing banner');
  catalogChecks.push({category,title,brand,initialRender:'passed'});
}
const offerChecks = [];
for (const service of SERVICES) {
  for (const offer of service.offers) {
    const markup = renderToString(React.createElement(OfferDetails, { service: { ...service, offers: [offer] } }));
    assert(markup.includes(offer.title) && markup.includes(offer.officialUrl.replaceAll('&', '&amp;')));
    assert(markup.includes('target="_blank"') && markup.includes('rel="noopener noreferrer"'));
    assert(markup.includes(`dateTime="${offer.verifiedAt}"`));
    assert(markup.includes(`src="/assets/${service.image}"`), 'Expanded offer must show its category illustration');
    assert(!markup.includes('/assets/brands/'), 'Expanded offer must keep the large logo out of the illustration area');
    offerChecks.push({ id: offer.id, initialRender: 'passed' });
  }
}
const collapsed = renderToString(React.createElement(Catalog, { initialCategory: 'todos', onBack() {} }));
assert.equal((collapsed.match(/name="catalog-services"/g) || []).length, SERVICES.length);
assert(!/<details[^>]*\bopen(?:=|>)/.test(collapsed), 'Brand items start collapsed');
for (const service of SERVICES) assert(collapsed.includes(`/assets/brands/${service.id}.svg`));
const previousStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
const favoriteIconChecks = [];
try {
  for (const savedIds of [[], SERVICES.map(service => service.id)]) {
    Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: { getItem: () => JSON.stringify(savedIds) } });
    const markup = renderToString(React.createElement(Catalog, { initialCategory: 'todos', onBack() {} }));
    const buttons = [...markup.matchAll(/<button\b[^>]*aria-label="(?:Salvar|Remover) [^"]+ favoritos"[^>]*>[\s\S]*?<\/button>/g)].map(match => match[0]);
    assert(buttons.length >= 3, 'Each offer has a labeled favorite control');
    for (const button of buttons) {
      const saved = button.includes('aria-pressed="true"');
      assert.equal(saved, savedIds.length > 0);
      assert(button.includes(`/assets/icons/iconoir/${saved ? 'bookmark-solid' : 'bookmark'}.svg`), 'The saved state must change the actual icon silhouette');
    }
    favoriteIconChecks.push({ saved: savedIds.length, controlsChecked: buttons.length, state: 'passed' });
  }
} finally {
  if (previousStorage) Object.defineProperty(globalThis, 'localStorage', previousStorage);
  else delete globalThis.localStorage;
}
const filledBookmark = await fs.readFile(new URL('../public/assets/icons/iconoir/bookmark-solid.svg', import.meta.url), 'utf8');
assert(filledBookmark.includes('fill="currentColor"'));
const documentHead = await fs.readFile(new URL('../index.html', import.meta.url), 'utf8');
assert(documentHead.includes('<title>Alba') && !documentHead.includes('Revista'), 'Startup shell and metadata must use Alba');
assert(documentHead.includes('href="/favicon-sol-e-livro.ico"') && documentHead.includes('href="/favicon-sol-e-livro.png"'));
assert(documentHead.includes('href="/assets/brand-loader.css"'));
assert(documentHead.includes('class="brand-loader"') && documentHead.includes('<noscript>'), 'Startup shell must show a loader and handle disabled JavaScript');
const loadingMarkup = renderToString(React.createElement(LoadingScreen));
assert(loadingMarkup.includes('/assets/sol-e-livro-logo.png') && loadingMarkup.includes('role="status"'));
assert(loadingMarkup.includes('aria-busy="true"'));
const startupMarkup = renderToString(React.createElement(LoadingExperience));
assert(startupMarkup.includes('inert=""') && startupMarkup.includes('class="brand-loader"'), 'The startup content must remain non-interactive behind the loader');
const glbBytes=await fs.readFile(new URL('../public/assets/models/copo-cafe.glb',import.meta.url));
const gltf=await new GLTFLoader().parseAsync(glbBytes.buffer.slice(glbBytes.byteOffset,glbBytes.byteOffset+glbBytes.byteLength),'');
const meshNames=[];
gltf.scene.traverse(object=>{if(object.isMesh)meshNames.push(object.name);});
assert.deepEqual(meshNames.sort(),['Cafe_Corpo','Cafe_Faixa_Pessego','Cafe_Tampa']);
const resources = ['/','/assets/brand-loader.css','/favicon-sol-e-livro.ico','/favicon-sol-e-livro.png','/favicon.ico','/favicon-16.png','/favicon-32.png','/favicon-48.png','/apple-touch-icon.png','/assets/sol-e-livro-logo.png','/assets/icons/iconoir/bookmark-solid.svg','/assets/main.js','/assets/main.css','/assets/campus.png','/assets/sol-e-livro-cutout.png','/assets/hero-paper.png',
  '/assets/category-creative.png','/assets/category-wellbeing-v2.png','/assets/coffee-poster.png','/assets/models/copo-cafe.glb',
  '/assets/fonts/fraunces-variable.ttf','/assets/fonts/dm-sans-variable.ttf',
  ...SERVICES.map(s=>`/assets/brands/${s.id}.svg`),
  ...['bookmark-simple','magnifying-glass','list','funnel-simple','arrow-up-right','laptop','headphones','x','check','book-open'].map(n=>`/assets/icons/${n}.svg`),
  ...['book','bookmark','check','nav-arrow-right','nav-arrow-down','palette','coffee-cup','xmark','menu','search','filter','open-new-window','arrow-left','laptop','info-circle','headset'].map(n=>`/assets/icons/iconoir/${n}.svg`)];
const checks = [];
resources.push('/quem-somos.html', '/privacidade.html', '/assets/information.css', '/assets/privacy-controls.js');
resources.push('/app-config.json', '/auth-callback.html', '/assets/account-service.js', '/assets/auth-callback.js');
const appConfig = validateAppConfig(JSON.parse(await fs.readFile(new URL('../public/app-config.json', import.meta.url), 'utf8')));
if (process.env.ALBA_EXPECT_CONNECTED === '1') assert(appConfig.authEnabled, 'Main must retain a valid account connection');
else assert(appConfig.authEnabled || !appConfig.supabaseUrl, 'Use valid public settings or the disconnected example');
const callbackPage = await fs.readFile(new URL('../public/auth-callback.html', import.meta.url), 'utf8');
assert(callbackPage.includes('name="referrer" content="no-referrer"') && callbackPage.includes('id="reset-password-form"'));
const institutionalPages = [];
for (const [file, title] of [['quem-somos.html', 'Quem somos'], ['privacidade.html', 'Privacidade e LGPD']]) {
  const page = await fs.readFile(new URL(`../public/${file}`, import.meta.url), 'utf8');
  assert(page.includes('lang="pt-BR"') && page.includes(`<title>${title} — Alba</title>`));
  assert.equal((page.match(/<h1\b/g) || []).length, 1);
  assert(page.includes('href="/assets/information.css"'));
  assert(page.includes('href="/quem-somos.html"') && page.includes('href="/privacidade.html"'));
  const ids = [...page.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(ids.length, new Set(ids).size);
  if (file === 'privacidade.html') {
    assert(page.includes('id="clear-alba-data" hidden') && page.includes('role="status"'));
    assert(page.includes('/assets/privacy-controls.js') && page.includes('<noscript>'));
  }
  institutionalPages.push({ file, structure: 'passed' });
}
const visited = new Set();
for (const pathname of resources) {
  if (visited.has(pathname)) continue;
  visited.add(pathname);
  const info = await new Promise((resolve,reject)=>get('http://127.0.0.1:4174'+pathname, response=>{
    const chunks=[]; response.on('data',chunk=>chunks.push(chunk));
    response.on('end',()=>resolve({status:response.statusCode,type:response.headers['content-type'],data:Buffer.concat(chunks)}));
  }).on('error',reject));
  assert.equal(info.status,200,pathname);
  assert(info.data.length>0,pathname);
  if (pathname === '/') assert(info.data.toString().includes('href="/favicon-sol-e-livro.png"'), 'Served HTML must reference the new favicon URL');
  if (pathname.startsWith('/favicon-sol-e-livro')) assert.deepEqual(info.data, await fs.readFile(new URL('../public'+pathname, import.meta.url)), 'Served favicon must match the complete book-and-sun export');
  if (pathname.endsWith('.ttf')) assert.equal(info.data.subarray(0,4).toString('hex'),'00010000');
  if (pathname.endsWith('.svg')) assert(info.data.toString().includes('<svg'));
  if (pathname.endsWith('.png')) assert.equal(info.data.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
  if (pathname.endsWith('.ico')) assert.equal(info.data.subarray(0,6).toString('hex'),'000001000300');
  if (pathname.endsWith('.js')) {
    assert(/javascript/.test(info.type),pathname);
    const moduleImports=/(?:from\s*|import\s*\()\s*["'](\.[^"']+\.js)["']/g;
    for (const match of info.data.toString().matchAll(moduleImports)) resources.push(new URL(match[1],'http://127.0.0.1:4174'+pathname).pathname);
  }
  checks.push({path:pathname,status:info.status,contentType:info.type,bytes:info.data.length});
}
function luminance(hex) {
  const rgb=hex.match(/\w\w/g).map(c=>parseInt(c,16)/255).map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4);
  return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;
}
const contrast=[];
for (const [name,foreground,background] of [['ink-paper','222621','F7F2E9'],['green-paper','16483B','F7F2E9'],['ink-ochre','222621','F2D38B'],['muted-paper','64685E','F7F2E9'],['secondary-paper','53604F','F7F2E9'],['green-raised-paper','16483B','FCF9F3'],['control-paper','788473','F7F2E9']]) {
  const [a,b]=[luminance(foreground),luminance(background)].sort((x,y)=>y-x);
  const ratio=(a+.05)/(b+.05);
  assert(ratio >= (name.startsWith('control-') ? 3 : 4.5),name);
  contrast.push({pair:name,ratio:Number(ratio.toFixed(2))});
}
const report={initialReactRender:'passed',landingPurpose:'product introduction; catalog is a separate view',discoveryChecks,routineChecks,institutionalPages,savedPathsViews:'empty, one, and three saved themes passed initial render',faq:'five expandable questions',catalogChecks,offerChecks,favoriteIconChecks,catalogBranding:'compact book and sun, no hero banner; PNG and ICO favicon links verified',coffeeModel:{parsedBy:'Three.js GLTFLoader',meshes:meshNames},staticResources:'passed',checked:checks,contrast,visualQA:'blocked',browserInteractions:'not verified'};
report.catalogDefault = 'Todos verified for Catalog default and App direct #catalogo render';
await fs.writeFile(new URL('./build-checks.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
console.log(`Real catalog, ${offerChecks.length} individual-access offer details, ${SERVICES.length} collapsed brand items, saved-topic states, and 3 category views passed initial React render; main favorites namespace retained; GLB parsed; ${checks.length} resources HTTP 200; ${contrast.length} contrast pairs passed. Browser QA remains blocked.`);
