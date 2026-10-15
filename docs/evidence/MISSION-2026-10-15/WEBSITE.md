# Website copy and static checks — 2026-10-15

Repository: `Umliva/umliva.github.io`  
Branch: `codex/site-german-copy-20261015`  
Code commit checked: `7102325e59b79808b30fd3520639a879efdf204d`  
Node: `v22.22.0`

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

The live deployment still points to the existing main commit and therefore does not contain this branch's German badge or layout change. A Playwright browser opened a local static preview. Layout inspection returned no horizontal page overflow at 1366 px (`clientWidth=1351`, `scrollWidth=1351`), 390 px (`375/375`), and 320 px (`305/305`). At 1366 px the hero heading measured about 790 × 181 CSS px with normal word wrapping; at 390 px it measured 335 × 138 px; at 320 px it measured 273 × 173 px and used `overflow-wrap:anywhere`. These are browser geometry checks, not screenshots.

The CUA headed browser remained unavailable. Playwright screenshot output was also `NOT_RUN`: the browser tool only allowed writing under the protected canonical owner checkout, and no safe screenshot destination was available without mutating it. A human reviewer must still inspect desktop/mobile rendering and record screenshots before merge.

The linked Wiki pages were cloned read-only at `4e4fac4a5e8c344106eb0363c317eddc0479ecf6`. A German translation patch for all eight public Markdown pages is included beside this file as `WIKI-GERMAN-PATCH.patch`. GitHub Wiki has no normal pull-request target; the patch is prepared for independent review and an authorized Wiki edit, and has not been published.
