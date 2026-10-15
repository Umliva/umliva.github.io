# PR #10 exact-head qualification — 2026-10-15

Repository: `Umliva/umliva.github.io`  
Branch: `codex/site-german-copy-20261015`  
Exact source/evidence head: `4c6d75db44d8018011524331e0f207887920d185`  
Site implementation commit: `2aa44fe48e8470873154fb5775ff34a4fcfccf08`  
Runtime: Node.js v22.22.0; visible Chrome 153.0.8010.36; curl 8.5.0.

Checks rerun on the exact head, all exit 0:

- `node verify-site.mjs` — PASS (14 HTML files, 18 required assets/pages).
- `node verify-sanitization.mjs` — PASS (2 pages, 6 prohibited-data patterns).
- `node tools/verify-german.mjs` — PASS (16 files, 41 forbidden terms, 0 hits).
- `node tools/verify-german-fixtures.mjs` — PASS; visible English safety wording rejected and German wording accepted.
- `node tools/verify-agent-project-contract.mjs` — PASS (14 checks).
- `node tools/run-agent-project-contract-fixtures.mjs` — PASS (29 cases, 38 steps, 0 mismatches).
- `bash tools/audit-agent-project-contract-host.sh` — 7 PASS, 0 FAIL, 4 NOT_VERIFIED (host-scope/tool gaps).
- `git diff --check` — PASS.

Responsive screenshots at 1366×900, 390×844 and 320×844 and browser geometry measurements are recorded in `WEBSITE.md`; they were captured and inspected against the unchanged site implementation commit above. The localized Wiki text/navigation patch, custom sidebar, and all nine destination readbacks are recorded in `WIKI-GERMAN-PATCH.patch`, `WIKI-GERMAN-LINKS-QUALIFICATION.md`, and `DESTINATION-AUDIT.md`. The Wiki remains unpublished and Pages `main` remains `3943d3cd435abb5faf84e1acd462c7dbc18b3354`.

Review state at this head: PR #10 open, independent reviews 0, commit statuses 0. No merge or Wiki publication occurred.
