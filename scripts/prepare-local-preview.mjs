// Prepare the normal React client bundle when nested compiler processes are
// unavailable in a restricted Windows shell. Run esbuild.exe before this file.
import { cpSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'dist/client');
mkdirSync(output, { recursive: true });
cpSync(path.join(root, 'public'), output, { recursive: true });
const html = readFileSync(path.join(root, 'index.html'), 'utf8')
  .replace('src="/src/main.jsx"', 'src="/assets/main.js"')
  .replace('</head>', '  <link rel="stylesheet" href="/assets/main.css" />\n  </head>');
writeFileSync(path.join(output, 'index.html'), html);
console.log('React client and local assets prepared in dist/client.');
