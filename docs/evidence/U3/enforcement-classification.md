# Enforcement classification — website issue #3 (agent project contract)

Run date: 2026-10-07. Branch: `docs/agent-contract-issue-3-main`, working tree based on `3bd6f53`.
Classification values: `DOCUMENT_ONLY`, `VALIDATOR_AVAILABLE`, `HOOK_ENFORCED`, `BROKER_ENFORCED`,
`TOOL_GAP`. `VALIDATOR_AVAILABLE` means a deterministic check exists and must be run by the operator;
it does not mean that a write can be blocked.

## Per acceptance-checklist row

| # | Acceptance row (verbatim) | Classification | What actually exists | Caveat |
| --- | --- | --- | --- | --- |
| 1 | Existing AGENTS.md and project behavior preserved; missing contract fields added with schema validation. | VALIDATOR_AVAILABLE | `AGENTS.md` keeps all existing sections; `config/agent-project-contract.json` adds the machine-readable contract; the validator enforces the schema and that the schema document still documents every required field and reason code. | Content and page behaviour are unchanged; `node verify-site.mjs` still passes. |
| 2 | Identity, canonical remote, actual root and relative paths validated. | VALIDATOR_AVAILABLE | Root markers, `pathMap` entries, normalized remote identity, `projectId` and checkout layout are checked. Real-run result: `reasonCode=OK`, `layout=linked-worktree`, `identity=canonical`. | The validator reads git metadata; it does not contact the remote. |
| 3 | Wrong root, mismatched remote/project ID, missing contract, symlink escape and undeclared duplicate project root fail with actionable reason codes. | VALIDATOR_AVAILABLE | Fixtures `fail-wrong-root`, `fail-remote-mismatch`, `fail-project-id-mismatch`, `fail-missing-contract`, `fail-symlink-escape`, `fail-nested-root-undeclared` assert the exact codes; each failure names the offending path or identity. | Actions still depend on the operator running the check before a write. |
| 4 | Declared legitimate modules, forks, worktrees and submodules are handled correctly. | VALIDATOR_AVAILABLE | Declarations are honoured for identity evidence only: `ok-declared-module-same-name` (module literally named like the project), `ok-declared-submodule` (gitlink), `ok-linked-worktree`, `ok-remote-approved-fork`; a declared submodule that holds a full clone still fails (`fail-submodule-declared-but-clone`). | Directories are never rejected by name, and a declaration never licenses a second copy of this project. |
| 5 | Repository-switch scenario invalidates old write authority and reloads correct rules. | VALIDATOR_AVAILABLE | `rebind-required` fixture: binding root A, validating root B fails with `FAIL_REBIND_REQUIRED`, explicit `--bind` rebinds, reverting to the stale root fails again, and an identity change (approved fork) fails too. | The binding is a state file consumed by the validator; it is not a harness event hook, so it cannot intercept a write. |
| 6 | Global/project conflicts and project-specific global skills detected; fixtures exercise failures. | VALIDATOR_AVAILABLE | In-repository detection: `fail-configuration-shadowing-*` (override file, duplicate contract, nested identity redeclaration) and `fail-cross-project-skill-leakage`. Host detection: `tools/audit-agent-project-contract-host.sh` audits a documented candidate set of global instruction and skill locations and reports counts only. | Skill *activation* is `TOOL_GAP`: only advertised metadata is readable offline. Unknown harness locations are `global-config-coverage=NOT_VERIFIED`. |
| 7 | Real host audit distinguishes PASS, FAIL and NOT_VERIFIED with safe evidence; repository CI must not claim to inspect a user's host. | VALIDATOR_AVAILABLE (host-local) | `tools/audit-agent-project-contract-host.sh` prints `PASS=7 FAIL=0 NOT_VERIFIED=4` on this workstation, `negative-control` proves the FAIL path is reachable, and it prints `ci-host-inspection=NOT_POSSIBLE`. No home path, secret or global configuration content is printed or committed. | This repository has no CI workflow at all; the audit is local-only and cannot be run against another host. |
| 8 | Re-running the migration is idempotent; no second configuration or repeated destructive cleanup. | VALIDATOR_AVAILABLE | `docs/evidence/U3/idempotency.txt`: two consecutive full gate runs are byte-identical, the worktree state hash is unchanged and no temporary fixture state remains. The rebind fixture asserts a byte-identical binding file after a repeated rebind. | There is no migration script; the contract is added once and extended in place. |
| 9 | Relevant existing checks and new meaningful contract tests pass. | VALIDATOR_AVAILABLE | `node verify-site.mjs` → `PASS site-static-check html=12 required=14`; validator → `reasonCode=OK`; fixtures → `cases=29 steps=38 mismatches=0`. | Fixtures test the validator, not this repository's product behaviour. |
| 10 | Reviewed PR follows this repository's normal workflow; no direct main writes, force push or unreviewed merge. | DOCUMENT_ONLY | The rule exists in `AGENTS.md` (Merge First governance). Nothing in this change set can enforce it: review, merge and branch protection are GitHub-side and require a human reviewer. | Not satisfiable by tooling in this repository and not claimed here; the reviewer/merge step is external and still open. |
| 11 | Final evidence links bind validator results and review to exact commit SHA; issue closes only for demonstrated scope. | DOCUMENT_ONLY | Results are bound to `3bd6f53` plus `docs/evidence/U3/content-hashes.txt` (per-file SHA-256), because this change set must stay uncommitted in the working tree. | The PR head SHA and the review link must be appended after the branch is committed and reviewed; the issue must not close before that. |

## Mechanism classification (summary of the contract block)

| Mechanism | Classification |
| --- | --- |
| Contract prose and policy rules | DOCUMENT_ONLY |
| Root, remote, `projectId`, path map, layout checks | VALIDATOR_AVAILABLE |
| Contract schema and schema-document consistency | VALIDATOR_AVAILABLE |
| Write-target resolution (`--target`) | VALIDATOR_AVAILABLE |
| Nested project root and declared boundaries | VALIDATOR_AVAILABLE |
| Configuration shadowing | VALIDATOR_AVAILABLE |
| Repository rebind (`--binding`/`--bind`) | VALIDATOR_AVAILABLE |
| In-repository instruction and skill isolation | VALIDATOR_AVAILABLE |
| Host global instruction and skill scope (diagnosis) | VALIDATOR_AVAILABLE, host-local |
| Write interception by hooks or brokers | TOOL_GAP |
| Skill activation verification | TOOL_GAP |
| Host global configuration repair | DOCUMENT_ONLY |

Host-level enforcement status: `NOT_VERIFIED`. The audit reports one workstation; other workstations
are explicit follow-up work, and an unavailable host is never `PASS`.
