# German Wiki navigation qualification — 2026-10-15

Public repository: `Umliva/umliva.github.io`  
PR #10 source/evidence head when checked: `4c6d75db44d8018011524331e0f207887920d185`

Wiki source head: `Umliva/umliva.github.io.wiki` master `4e4fac4a5e8c344106eb0363c317eddc0479ecf6`

Translation artifact: `WIKI-GERMAN-PATCH.patch`, SHA-256 `920b753a3ea59789d4b803fb710bab993d5ba491ac29bd1f94007e793925ca45`.

The patch changes all eight existing tracked Wiki Markdown pages, with 49 insertions and 49 deletions, and adds a German `_Sidebar.md` custom sidebar. It replaces all seven Home-page English navigation labels with German labels and explicit links to the existing English page slugs. The page slugs stay stable so existing Wiki URLs continue to work. The deployed Wiki has not been changed.

GitHub's official Wiki instructions document Markdown links as `[Link Text](full-URL-of-wiki-page)`: <https://docs.github.com/en/communities/documenting-your-project-with-wikis/editing-wiki-content>. They support a custom sidebar from `_Sidebar.md`: <https://docs.github.com/en/communities/documenting-your-project-with-wikis/creating-a-footer-or-sidebar-for-your-wiki>.

Extracted all Markdown destinations from the eight translated local pages and proposed custom sidebar: exactly nine unique targets (Wiki home, seven Wiki pages, and `https://umliva.github.io/`). All nine returned HTTP 200 on 2026-10-15. The Wiki clone remained local with eight modified pages and an untracked `_Sidebar.md`; it was not committed or pushed.

Site gates rerun at the PR #10 worktree before evidence commit:

- `node verify-site.mjs` — PASS (14 HTML files, 18 required assets/pages).
- `node verify-sanitization.mjs` — PASS (2 pages, 6 prohibited-data patterns).
- `node tools/verify-german.mjs` — PASS (16 files, 41 terms, 0 hits).
- `node tools/verify-german-fixtures.mjs` — PASS (visible English safety wording rejected; German wording accepted).
- `node tools/verify-agent-project-contract.mjs` — PASS (14 checks).
- `node tools/run-agent-project-contract-fixtures.mjs` — PASS (29 cases, 38 steps, 0 mismatches).
- `bash tools/audit-agent-project-contract-host.sh` — exit 0, 7 PASS, 0 FAIL, 4 NOT_VERIFIED (host-scope/tool gaps).
- `git diff --check` — PASS.

The German navigation patch is prepared for review only. Publishing it requires the authorized Wiki workflow; PR #10 remains unreviewed and unmerged.

## Fresh readback at PR #10 head `88e931938b9515be9b2cf015ca06dfe048f3a35a`

On 2026-10-15 the Wiki remote `master` was read again and remained at
`4e4fac4a5e8c344106eb0363c317eddc0479ecf6`, the exact base of the local
translation worktree. `git diff --check` passed. `git diff --binary` hashes to
`920b753a3ea59789d4b803fb710bab993d5ba491ac29bd1f94007e793925ca45`, exactly
matching the patch stored in this PR. The eight page translations plus
`_Sidebar.md` are unchanged; no direct Wiki write occurred.

At this exact site PR head, fresh runs passed:

- `node verify-site.mjs` — 14 HTML files and 18 required assets/pages.
- `node verify-sanitization.mjs` — 2 pages, 6 prohibited-data patterns.
- `node tools/verify-german.mjs` — 16 files, 41 terms, 0 hits.
- `node tools/verify-german-fixtures.mjs` — visible English safety wording rejected; German wording accepted.
- `node tools/verify-agent-project-contract.mjs` — 14 checks.
- `node tools/run-agent-project-contract-fixtures.mjs` — 29 cases, 38 steps, 0 mismatches.
- `bash tools/audit-agent-project-contract-host.sh` — exit 0, 7 PASS, 0 FAIL, 4 NOT_VERIFIED.

Responsive geometry evidence remains the earlier code-bound run at 1366, 390,
and 320 CSS pixels, with no horizontal overflow and the hero heading kept
whole; see `PR10-HEAD-QUALIFICATION-4c6d75d.md`. A controllable headed browser
was unavailable for a fresh screenshot/visible inspection. Geometry checks are
not a substitute for that visual gate. Site PR #10 is still open and unreviewed;
the live Pages main was not changed.
