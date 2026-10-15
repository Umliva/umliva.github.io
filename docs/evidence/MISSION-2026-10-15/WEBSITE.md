# Website copy and static checks — 2026-10-15

Repository: `Umliva/umliva.github.io`  
Branch: `codex/site-german-copy-20261015`  
Code commit checked: `1e69b94c7ab0b2b5c75f31355cc6c5d5d90996d1`  
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

The live deployment still points to the existing main commit and therefore does not contain this branch's German badge or layout change. A headed browser was unavailable in this session, so desktop/mobile visual inspection and screenshots are `NOT_RUN`. The requested 1366-pixel desktop view and narrow mobile widths require review in a controllable headed browser before merge.
