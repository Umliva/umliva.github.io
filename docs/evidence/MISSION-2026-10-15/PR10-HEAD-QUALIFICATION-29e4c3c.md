# PR #10 exact-head qualification — 2026-10-15

Repository: `Umliva/umliva.github.io`  
Branch: `codex/site-german-copy-20261015`  
Exact source head: `29e4c3c586386ffdfb48e162e320790f0ac15188`  
Runtime: Node.js v22.22.0; headed Chrome 153.0.8010.36 was used for the previously recorded screenshots; curl 8.5.0 for destination audit.

The exact-head rerun after the Wiki destination audit passed:

- `node verify-site.mjs` — PASS, 14 HTML files and 18 required assets/pages.
- `node verify-sanitization.mjs` — PASS, 2 pages and 6 prohibited-data patterns.
- `node tools/verify-german.mjs` — PASS, 16 files, 41 forbidden terms, 0 hits.
- `node tools/verify-german-fixtures.mjs` — PASS; visible English safety wording rejected and German wording accepted.
- `node tools/verify-agent-project-contract.mjs` — PASS, 14 checks.
- `node tools/run-agent-project-contract-fixtures.mjs` — PASS, 29 cases, 38 steps, 0 mismatches.
- `bash tools/audit-agent-project-contract-host.sh` — exit 0, 7 PASS, 0 FAIL, 4 NOT_VERIFIED (host-scope/tool gaps).
- `git diff --check` — PASS.

The site and Wiki destination results are in `DESTINATION-AUDIT.md`. Responsive screenshots at 1366×900, 390×844, and 320×844 and their SHA-256 values are in `WEBSITE.md`; those were captured and inspected against the unchanged PR implementation commit `2aa44fe48e8470873154fb5775ff34a4fcfccf08`. The current deployed Pages main remains `3943d3cd435abb5faf84e1acd462c7dbc18b3354`.

Review state at qualification: PR #10 open, independent reviews 0, commit status checks 0. Merge and Wiki publication have not occurred.
