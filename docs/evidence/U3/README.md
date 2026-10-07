# Evidence U3 — agent project contract (website repository)

- Issue: `[agent-project-contract] Projektlokale AGENTS.md, Root-Schutz und Skill-Isolation`
  (`Umliva/umliva.github.io` issue #3).
- Run date: 2026-10-07.
- Branch: `docs/agent-contract-issue-3-main`; working tree based on `3bd6f53`.
- Scope of this evidence: the repository-side portion of the issue. Host-only facts are marked
  `NOT_VERIFIED` where they cannot be observed with the available tooling.

Evidence is an inspection artifact, not a replacement for the issue or the implementation. No real
case data, no personal data, no secret and no host-specific absolute path appears in this directory.
Absolute paths are hidden by the validator by default.

## Files

| File | Content |
| --- | --- |
| `verifier-runs.txt` | Verbatim transcript: `verify-site.mjs`, the contract validator on the real root, and a scratch root that must fail. |
| `fixture-runs.txt` | Verbatim transcript: all 29 fixture cases (38 steps), the rebind case alone, and a negative control proving the runner fails a wrong expectation. |
| `host-audit.txt` | Verbatim transcript of the host audit with `PASS`/`FAIL`/`NOT_VERIFIED` rows and the measured host facts. |
| `idempotency.txt` | Two consecutive full gate runs, byte comparison, sha256 comparison, worktree-state hash before/after and leftover-temp check. |
| `enforcement-classification.md` | Enforcement classification per acceptance-checklist row and per mechanism. |
| `content-hashes.txt` | SHA-256 of every file this change set adds or changes, so results bind to exact content while the change set is uncommitted. |

## Exact commands

```bash
node verify-site.mjs
node tools/verify-agent-project-contract.mjs
node tools/run-agent-project-contract-fixtures.mjs
bash tools/audit-agent-project-contract-host.sh
```

Optional flags used in this evidence:

```bash
node tools/verify-agent-project-contract.mjs --json          # machine-readable verdict
node tools/verify-agent-project-contract.mjs --target <path> # write-target check
node tools/run-agent-project-contract-fixtures.mjs --case <id>
bash tools/audit-agent-project-contract-host.sh              # local host audit; never CI
```

## Observed results

- `node verify-site.mjs` → `PASS site-static-check html=12 required=14` (unchanged page behaviour).
- `node tools/verify-agent-project-contract.mjs` → `PASS agent-project-contract reasonCode=OK checks=14 contractVersion=1.0.0 projectId=umliva.github.io layout=linked-worktree identity=canonical`.
- `node tools/run-agent-project-contract-fixtures.mjs` → `PASS agent-project-contract-fixtures reasonCode=OK cases=29 steps=38 mismatches=0 bindingIdempotencyChecks=1`.
- `bash tools/audit-agent-project-contract-host.sh` → `summary PASS=7 FAIL=0 NOT_VERIFIED=4`,
  `ci-host-inspection=NOT_POSSIBLE`.
- Idempotency: run 1 and run 2 byte-identical, `repository state unchanged: yes`,
  `temporary fixture state removed: yes`.

## Interpretation decisions (declared, reviewable)

The issue leaves room for interpretation. These decisions are implemented and documented in
`docs/AGENT_PROJECT_CONTRACT_SCHEMA.md`:

1. Nested project roots are detected only from identity evidence: a `.git` entry or a project
   contract file. Directory names never cause a rejection.
2. `modulesAllowlist` and `vendoredExamples` tolerate a nested contract with a *different*
   `projectId`; they never tolerate nested git metadata, and no declaration licenses a second copy of
   this project (`ok-declared-module-same-name`, `fail-nested-same-project-declared`).
3. Submodules must use a `.git` gitlink; a declared submodule that holds a full `.git` directory
   fails (`fail-submodule-declared-but-clone`).
4. A linked worktree is legitimate when the contract declares the layout
   (`declaredBoundaries.worktrees.allowedLayouts`) and the resolved remote identity matches;
   `nestedInsideRoot: FORBIDDEN` keeps a worktree of this project out of the root.
5. `FAIL_REBIND_REQUIRED` fires without `--bind` when the recorded root, `projectId`, remote identity
   or contract content changed; `--bind` is the explicit rebind and refuses to bind a root that does
   not validate.
6. A write target is resolved segment by segment without pre-normalizing `..`, so a traversal that
   runs through a symlink is detected; unresolved parents are appended and checked, and `.git` is a
   denied prefix.
7. Optional path entries (`golden-case.html`, `partner.html`, `verify-sanitization.mjs`) belong to a
   separate change set and are declared `required: false`; they are validated once present.

## Scope limits / not satisfied here

- Host enforcement is `NOT_VERIFIED`: no hook or broker is configured, the audit is local-only, and
  the existing rule that CI must not claim host inspection is stated as
  `ci-host-inspection=NOT_POSSIBLE`.
- Skill activation is `TOOL_GAP`; only advertised metadata is readable offline.
- Review, merge and branch-protection rules are `DOCUMENT_ONLY` here: they are GitHub-side actions for
  a human reviewer.
- The results are bound to `3bd6f53` plus `content-hashes.txt`; the PR head SHA must be appended after
  the branch is committed and reviewed.
