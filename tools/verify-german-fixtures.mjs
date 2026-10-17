#!/usr/bin/env node
import { findForbiddenVisibleCopy } from "./verify-german.mjs";

const english = '<span class="badge">SYNTHETIC STRUCTURE · NO ORIGINAL CASE DATA · NO LEGAL OUTCOME CLAIM</span>';
const german = '<span class="badge">Synthetischer Strukturfall · keine Originalfalldaten · keine Aussage zum Rechtsergebnis</span>';
const englishHits = findForbiddenVisibleCopy(`<body>${english}</body>`);
const germanHits = findForbiddenVisibleCopy(`<body>${german}</body>`);
if (!englishHits.some(hit => hit.term === "synthetic structure") ||
    !englishHits.some(hit => hit.term === "original case data") ||
    !englishHits.some(hit => hit.term === "legal outcome claim")) {
  throw new Error("visible English safety wording was not rejected by the German copy check");
}
if (germanHits.length) throw new Error(`accepted German safety wording was rejected: ${JSON.stringify(germanHits)}`);
console.log("PASS verify-german-fixtures visible-English=rejected German-safety-wording=accepted");
