# Agent project contract fixtures

Deterministic, offline fixtures for `tools/verify-agent-project-contract.mjs`.
Run them with `node tools/run-agent-project-contract-fixtures.mjs`.

## Model

- `base-tree/` is one minimal, schema-valid project-root copy used by almost every case: synthetic
  root markers (`fixture-site-marker.txt`, `fixture-contract-marker.txt`), a synthetic `AGENTS.md`
  and a fixture contract at `config/agent-project-contract.json`. It contains no site page, so the
  site gates of this repository are unaffected.
- `cases/<case-id>.json` is one fixture case:
  - `trees` maps a tree name to `{ from, git, setup }`. `from` is `base` (copy of `base-tree`) or
    `own` (a `tree/` directory next to the case file). `git` declares the git metadata written at
    test time: `primary` (`.git/config`), `linked-worktree` (`.git` gitfile plus a `commondir` and a
    config in a sibling common directory) or `none`.
  - `setup` is an ordered list of operations applied to the tree root (or to the case workspace with
    `"at": "workspace"`): `mkdir`, `write`, `copy`, `symlink`, `remove`, `patchJson` (`null` deletes
    the key, objects merge deeply).
  - `steps` are validator invocations with placeholders `{ROOT}`, other tree names and `{STATE}`,
    each with the expected reason code and exit code. `snapshotBinding` and `assertBindingUnchanged`
    prove that rebinding is byte-idempotent.
- Everything that cannot be committed is created at run time: `.git` metadata, symlinks and the
  binding state file. Cases are materialized into a fresh temporary directory and removed before the
  runner exits; the runner output contains no absolute paths.

## Cases

| Case | Steps | Expected reason code | Description |
| --- | --- | --- | --- |
| `fail-configuration-shadowing-duplicate-contract` | 1 | FAIL_CONFIGURATION_SHADOWING | A second contract configuration at a non-canonical path is rejected |
| `fail-configuration-shadowing-nested-identity` | 1 | FAIL_CONFIGURATION_SHADOWING | A nested instruction file that redeclares the project identity is rejected |
| `fail-configuration-shadowing-override` | 1 | FAIL_CONFIGURATION_SHADOWING | A declared shadowing instruction file is rejected |
| `fail-contract-schema-enum` | 1 | FAIL_CONTRACT_SCHEMA | An enforcement classification value outside the enum is rejected |
| `fail-contract-schema-missing-field` | 1 | FAIL_CONTRACT_SCHEMA | A required top-level contract field is missing |
| `fail-cross-project-skill-leakage` | 1 | FAIL_CROSS_PROJECT_SKILL_LEAKAGE | Instruction content that carries foreign project identity markers is rejected |
| `fail-layout-not-allowed` | 1 | FAIL_WRONG_ROOT | A checkout layout that the contract does not declare is rejected |
| `fail-missing-contract` | 1 | FAIL_MISSING_CONTRACT | The contract file is missing at the resolved root |
| `fail-nested-root-undeclared` | 1 | FAIL_NESTED_PROJECT_ROOT | An undeclared nested project root is rejected |
| `fail-nested-same-project-declared` | 1 | FAIL_NESTED_PROJECT_ROOT | A second copy of this project inside the root fails even when declared |
| `fail-project-id-mismatch` | 1 | FAIL_PROJECT_ID_MISMATCH | A projectId that does not match the repository identity is rejected |
| `fail-remote-mismatch` | 1 | FAIL_REMOTE_MISMATCH | An undeclared remote identity is rejected |
| `fail-remote-unresolved` | 1 | FAIL_REMOTE_UNRESOLVED | A root without git metadata cannot prove its remote identity |
| `fail-submodule-declared-but-clone` | 1 | FAIL_NESTED_PROJECT_ROOT | A declared submodule path that holds a full clone instead of a gitlink is rejected |
| `fail-symlink-escape` | 3 | FAIL_SYMLINK_ESCAPE | Write targets that resolve outside the real root fail, including not-yet-existing parents; the symlink is created at test time |
| `fail-write-target-denied` | 1 | FAIL_WRITE_TARGET_DENIED | A write target under a denied prefix is rejected |
| `fail-wrong-root` | 1 | FAIL_WRONG_ROOT | A required root marker is missing |
| `ok-baseline` | 1 | OK | Valid root, canonical remote, primary git layout |
| `ok-declared-module-same-name` | 1 | OK | A declared module that carries the project name and a foreign contract is accepted |
| `ok-declared-submodule` | 1 | OK | A declared submodule with a .git gitlink and a foreign contract is accepted |
| `ok-linked-worktree` | 1 | OK | A declared linked worktree layout with the canonical remote is accepted |
| `ok-remote-approved-fork` | 1 | OK | An explicitly approved fork identity is accepted |
| `ok-remote-https-git-suffix` | 1 | OK | HTTPS form with .git suffix is the same identity |
| `ok-remote-ssh-scm` | 1 | OK | scp-style SSH remote is the same identity |
| `ok-remote-ssh-url` | 1 | OK | ssh:// remote is the same identity |
| `ok-remote-trailing-slash` | 1 | OK | Trailing slash is normalized away |
| `ok-remote-uppercase-host` | 1 | OK | Host comparison is case-insensitive |
| `ok-write-target-inside-root` | 2 | OK | Write targets inside the root, including not-yet-existing parents, are accepted |
| `rebind-required` | 7 | OK, then FAIL_REBIND_REQUIRED | Repository switch invalidates old write authority; rebinding is explicit and byte-idempotent |

Versioned fixtures: the case manifests are part of the contract revision reported in
`docs/evidence/U3/`. Adding a case means adding a manifest, not editing the runner.
