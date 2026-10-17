# Website copy and static checks — 2026-10-15

Repository: `Umliva/umliva.github.io`
Branch: `codex/site-german-copy-20261015`
Code commit checked: `2aa44fe48e8470873154fb5775ff34a4fcfccf08`
Evidence/check commit: `8a1d93d95ab78718989c51dcab9e19eeb5050833`
Node: `v22.22.0`
Browser: Playwright-controlled visible Chrome `153.0.8010.36`

## Local checks

All commands exited 0 on the code commit above:

| Command | Result |
| --- | --- |
| `node verify-site.mjs` | PASS; 14 HTML files, 18 required assets/pages |
| `node verify-sanitization.mjs` | PASS; 2 pages, 6 prohibited-data patterns |
| `node tools/verify-german.mjs` | PASS; 16 files, 41 forbidden terms, 0 hits |
| `node tools/verify-german-fixtures.mjs` | PASS; English safety badge rejected and German safety text accepted |
| `node tools/verify-agent-project-contract.mjs` | PASS; 14 checks |
| `node tools/run-agent-project-contract-fixtures.mjs` | PASS; 29 cases, 38 steps, 0 mismatches, 1 idempotency check |
| `bash tools/audit-agent-project-contract-host.sh` | PASS; 7 PASS, 0 FAIL, 4 NOT_VERIFIED (host-only limits) |
| `git diff --check` | PASS |

## External destinations and visual proof

HTTP readback on 2026-10-15 returned 200 for the homepage, golden-case page, partner page, guide index and linked Wiki pages. The legal URLs `/impressum.html` and `/datenschutz.html` return 404. The footer retains its owner-data placeholder; no legal or provider information was invented.

The live deployment still points to the existing main commit and therefore does not contain this branch's German badge or layout change. A visible Playwright-controlled Chrome 153 browser opened the local static preview at the exact code commit above. The page was inspected at 1366×900, 390×844 and 320×844 CSS pixels. No horizontal page overflow appeared (`clientWidth=1351, scrollWidth=1351`; `375/375`; `305/305`), and the full `Nebenkostenabrechnung` word occupied one line at all three widths. The desktop and both mobile renderings were visually inspected.

Screenshots captured from that exact commit are committed beside this record:

| Viewport | Screenshot | SHA-256 |
| --- | --- | --- |
| 1366×900 | `desktop-1366.jpg` | `cf07fbbc196da43fe6f1944efdf89befe400746b1ff5d9a804ef4ce063354776` |
| 390×844 | `mobile-390.jpg` | `d3ccc598b7f5fdb8efb001ea14ea69ece2c3e3ee841f727df5a8e18ef7e67147` |
| 320×844 | `mobile-320.jpg` | `c4a77e6d675524aa39ed7e7de4410a2aa0292f5fe8830fa57527deee2bcce878` |

The linked Wiki pages were cloned read-only at `4e4fac4a5e8c344106eb0363c317eddc0479ecf6`. A German translation patch for all eight public Markdown pages is included beside this file as `WIKI-GERMAN-PATCH.patch`. GitHub Wiki has no normal pull-request target; the patch is prepared for independent review and an authorized Wiki edit, and has not been published.
