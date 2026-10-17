#!/usr/bin/env node
/**
 * verify-german.mjs — sichtbare Sprache der öffentlichen Umliva-Seite.
 *
 * Prüft, dass in sichtbaren Nutzertexten keine unnötigen englischen Produkt- oder
 * Fachbegriffe stehen. Geprüft wird:
 *   - sichtbarer Textkörper (aus <body>, ohne <script>, <style>, <pre>, <code> Inhalte)
 *   - für Hilfstechnik sichtbare Attribute: alt, aria-label, title, placeholder
 *
 * Ausgenommen sind:
 *   - echte Eigennamen (GitHub, Google Play, Android, Kotlin, Mermaid, Wiki, …)
 *   - ausdrücklich technische Dateinamen und Endungen (.mmd, .mjs, .svg)
 *   - Blöcke, die ausdrücklich als technische Entwicklerdokumentation markiert sind
 *     (Elemente mit data-technical-doc oder Klasse .technical-doc)
 *
 * Aufruf: node verify-german.mjs
 * Exit 0 = PASS, Exit 1 = FAIL mit Fundliste.
 */
import { readFile, readdir } from "node:fs/promises";
import { join, relative } from "node:path";

// Der Wurzelordner ist der Repository-Wurzelordner: liegt dieses Skript in
// tools/, ist die Wurzel der Elternordner. Sonst der eigene Ordner.
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
const here = dirname(new URL(".", import.meta.url).pathname.replace(/\/$/, ""));
const root = (here.split("/").pop() === "tools" ? here.replace(/\/tools$/, "") : here) + "/";

// Verbotene sichtbare Begriffe (Groß-/Kleinschreibung egal, Wortgrenzen beachtet).
const FORBIDDEN = [
  "synthetic structure", "original case data", "legal outcome claim",
  "local-first", "local first", "fail-closed", "fail closed",
  "evidence chain", "evidence package", "evidence request", "evidence",
  "finding", "findings",
  "golden case", "legal handoff", "human-in-the-loop", "human in the loop",
  "roadmap", "verification", "workflow", "privacy", "download", "report",
  "call to action", "best practice", "onboarding", "offboarding", "dashboard",
  "checkout", "screenshot", "mockup", "roadmap", "changelog", "backlog",
  "usability", "stakeholder", "compliance", "audit trail", "release notes",
  "source of truth", "proof of concept",
];
// Echte Eigennamen und technisch unvermeidbare Bezeichnungen.
const ALLOWED = [
  "GitHub", "GitHub Pages", "Google Play", "Google Play Store", "Android", "Kotlin",
  "Jetpack Compose", "Material 3", "Mermaid", "Wiki", "SHA-256", "PDF", "OCR",
  "DSGVO", "TMG", "DDG", "ISO", "WCAG", "ARIA", "CC BY", "Apache", "MIT",
];
// Technische Dateinamen/Endungen, die im sichtbaren Text erscheinen dürfen.
// Ohne /g-Flag: .test() ist damit zustandslos (mit /g wandert lastIndex zwischen
// Aufrufen und die Prüfung fällt intermittierend falsch aus).
const TECH_FILE = /[\w./-]+\.(mmd|mjs|svg|css|html|json|kt|sh|md|ico|png)\b/;

async function walk(dir, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules" || entry.name === "tools") continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) await walk(path, out);
    else out.push(path);
  }
  return out;
}

function visibleText(html) {
  let s = html;
  // ausdrücklich technische Abschnitte ausnehmen
  s = s.replace(/<[^>]*data-technical-doc[^>]*>[\s\S]*?<\/[a-z]+>/gi, " ");
  s = s.replace(/class="[^"]*\btechnical-doc\b[^"]*"[\s\S]*?<\/[a-z]+>/gi, " ");
  s = s.replace(/<script[\s\S]*?<\/script>/gi, " ");
  s = s.replace(/<style[\s\S]*?<\/style>/gi, " ");
  s = s.replace(/<pre[\s\S]*?<\/pre>/gi, " ");
  s = s.replace(/<code[\s\S]*?<\/code>/gi, " ");
  s = s.replace(/<!--[\s\S]*?-->/g, " ");
  const m = s.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  const body = m ? m[1] : s;
  return body.replace(/<[^>]+>/g, " ").replace(/&[a-z]+;/gi, " ").replace(/\s+/g, " ").trim();
}

function visibleAttrs(html) {
  const out = [];
  for (const m of html.matchAll(/\b(alt|aria-label|title|placeholder)="([^"]*)"/gi)) {
    if (m[2].trim()) out.push(m[2]);
  }
  return out.join(" ");
}

export function findForbiddenVisibleCopy(html) {
  const text = visibleText(html) + " " + visibleAttrs(html);
  const found = [];
  for (const term of FORBIDDEN) {
    const esc = term.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    const re = new RegExp("(^|[^A-Za-z0-9_-])" + esc + "([^A-Za-z0-9_-]|$)", "gi");
    for (const m of text.matchAll(re)) {
      const hit = m[0].trim();
      if (ALLOWED.some(a => hit.toLowerCase().includes(a.toLowerCase()))) continue;
      if (TECH_FILE.test(hit)) continue;
      found.push({ term, context: text.slice(Math.max(0, (m.index ?? 0) - 60), (m.index ?? 0) + 60).replace(/\s+/g, " ") });
    }
  }
  return found;
}

export async function verifyGermanSite() {
  const problems = [];
  const files = (await walk(root)).filter(f => f.endsWith(".html"));
  for (const file of files) {
    const html = await readFile(file, "utf8");
    for (const problem of findForbiddenVisibleCopy(html)) problems.push({ file: relative(root, file), ...problem });
  }
  if (problems.length) {
    console.log(`FAIL verify-german files=${files.length} hits=${problems.length}`);
    for (const p of problems.slice(0, 40)) console.log(`  ${p.file}: "${p.term}"  … ${p.context} …`);
    return false;
  }
  console.log(`PASS verify-german files=${files.length} forbidden-terms=${FORBIDDEN.length} hits=0`);
  return true;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  if (!(await verifyGermanSite())) process.exit(1);
}
