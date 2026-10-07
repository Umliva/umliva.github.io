import { readFile } from 'node:fs/promises';

const pages = ['golden-case.html', 'partner.html'];
const sources = await Promise.all(pages.map(async (page) => [page, await readFile(new URL(page, import.meta.url), 'utf8')]));
const forbidden = [
  ['currency amount', /\b\d[\d.]*,\d{2}\s*(?:€|EUR)\b/iu],
  ['calendar date', /\b\d{1,2}[./]\d{1,2}[./]\d{2,4}\b/u],
  ['email address', /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/iu],
  ['phone number', /(?<!\d)(?:\+49|0)[\s./-]?\d{2,4}[\s./-]?\d{3,}(?!\d)/u],
  ['IBAN', /\bDE\d{20}\b/iu],
  ['case/account identifier', /\b(?:aktenzeichen|kundennummer|vertragsnummer|kontonummer|iban)\b/iu],
];
for (const [page, html] of sources) {
  for (const [label, pattern] of forbidden) {
    if (pattern.test(html)) throw new Error(`${page}: prohibited ${label}`);
  }
}
const golden = Object.fromEntries(sources)['golden-case.html'];
for (const marker of [
  'SYNTHETIC STRUCTURE',
  'NO ORIGINAL CASE DATA',
  'P-01',
  'S-A',
  'S-B',
  'D-01',
  'R-01',
]) if (!golden.includes(marker)) throw new Error(`golden-case.html: missing sanitization marker ${marker}`);
console.log(`PASS site-privacy-sanitization pages=${pages.length} forbidden-patterns=${forbidden.length}`);
