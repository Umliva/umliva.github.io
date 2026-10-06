import { readFile, readdir, stat } from 'node:fs/promises';
import { join, relative } from 'node:path';

const root = new URL('.', import.meta.url).pathname;
const required = [
  'index.html', 'golden-case.html', 'partner.html', 'ratgeber/index.html',
  'ratgeber/nebenkostenabrechnung-pruefen.html', 'ratgeber/betriebskostenabrechnung-pruefen.html',
  'ratgeber/heizkostenabrechnung-pruefen.html', 'ratgeber/nebenkostenabrechnung-zu-hoch.html',
  'ratgeber/co2-kosten-mieter-vermieter.html', 'ratgeber/abrechnungsfrist-nebenkosten.html',
  'ratgeber/umlageschluessel-pruefen.html', 'ratgeber/umlagefaehige-nebenkosten.html',
  'ratgeber/fehler-nebenkostenabrechnung.html', 'ratgeber/nebenkosten-widerspruch.html',
  'robots.txt', 'sitemap.xml'
];
const files = new Set();
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name === '.git') continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) await walk(path);
    else files.add(relative(root, path));
  }
}
await walk(root);
for (const path of required) if (!files.has(path)) throw new Error(`missing ${path}`);

const htmlFiles = [...files].filter((path) => path.endsWith('.html'));
const localTargets = new Set();
for (const path of htmlFiles) {
  const html = await readFile(join(root, path), 'utf8');
  for (const [name, pattern] of [
    ['title', /<title>[^<]+<\/title>/i],
    ['description', /<meta name="description" content="[^"]+">/i],
    ['canonical', /<link rel="canonical" href="https:\/\/umliva\.github\.io\/[^">]*">/i],
    ['h1', /<h1[^>]*>/i]
  ]) if (!pattern.test(html)) throw new Error(`${path}: missing ${name}`);
  if (path.startsWith('ratgeber/') && (!html.includes('PLANNED') || !html.includes('keine individuelle Rechtsberatung'))) throw new Error(`${path}: missing bounded status/disclaimer`);
  for (const href of html.matchAll(/href="([^"]+)"/g)) {
    const target = href[1];
    if (target.startsWith('http') || target.startsWith('#') || target === '/') continue;
    localTargets.add(join(root, path.replace(/[^/]+$/, ''), target.split('#')[0]));
  }
}
for (const target of localTargets) {
  try { const info = await stat(target); if (!info.isFile() && !info.isDirectory()) throw new Error(); } catch { throw new Error(`broken local link ${relative(root, target)}`); }
}
const sitemap = await readFile(join(root, 'sitemap.xml'), 'utf8');
for (const path of required.filter((p) => p.endsWith('.html'))) {
  const url = `https://umliva.github.io/${path}`.replace(/index\.html$/, '');
  if (!sitemap.includes(`<loc>${url}</loc>`)) throw new Error(`sitemap missing ${url}`);
}
const robots = await readFile(join(root, 'robots.txt'), 'utf8');
if (!robots.includes('Allow: /') || !robots.includes('Sitemap: https://umliva.github.io/sitemap.xml')) throw new Error('robots policy incomplete');
const home = await readFile(join(root, 'index.html'), 'utf8');
for (const marker of ['href="golden-case.html"', 'href="partner.html"', 'data-diagram-src="diagrams/screen-flow.mmd"', 'data-diagram-src="diagrams/data-flow.mmd"']) {
  if (!home.includes(marker)) throw new Error(`homepage regression: ${marker}`);
}
const golden = await readFile(join(root, 'golden-case.html'), 'utf8');
if (!golden.includes('SYNTHETIC STRUCTURE') || !golden.includes('NO ORIGINAL CASE DATA') || !golden.includes('NO LEGAL OUTCOME CLAIM') || !golden.includes('F-001') || !golden.includes('F-004')) throw new Error('golden case safety/evidence markers missing');
const partner = await readFile(join(root, 'partner.html'), 'utf8');
if (!partner.includes('Human-in-the-loop') || !partner.includes('anwaltliche Verantwortung')) throw new Error('partner boundary markers missing');
console.log(`PASS site-static-check html=${htmlFiles.length} required=${required.length}`);
