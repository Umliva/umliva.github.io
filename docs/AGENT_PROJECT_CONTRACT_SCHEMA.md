# Agent project contract schema

Schema version: `1.0.0` — applies to `config/agent-project-contract.json` of this repository.

- Contract: `config/agent-project-contract.json`
- Validator: `node tools/verify-agent-project-contract.mjs`
- Fixtures: `node tools/run-agent-project-contract-fixtures.mjs`
- Host audit: `bash tools/audit-agent-project-contract-host.sh`
- Policy owner: `AGENTS.md` (this schema only defines the machine-readable subset)

The contract declares the identity, layout, mutation boundaries and skill-isolation policy of
this repository in a machine-readable form. The validator is deterministic and offline: it reads
git metadata, the contract and the file tree, and it never writes inside the validated root except
for the explicit host-local binding file (`--binding` with `--bind`).

## Scope

- Checked: contract presence, contract schema, root identity, canonical remote identity,
  `projectId` consistency, declared paths, write-target resolution, nested project roots,
  configuration shadowing, in-repository cross-project instruction leakage, repository rebind.
- Not checked: whether a harness actually loads `AGENTS.md`, whether a skill is activated, and any
  workstation other than the one running the check. See "What the validator cannot enforce".

## Top-level fields

| Field | Type | Required | Meaning |
| --- | --- | --- | --- |
| `contractVersion` | string `MAJOR.MINOR.PATCH` | yes | Schema/contract revision. The validator accepts any valid semver string and reports it. |
| `contractId` | string | yes | Stable identifier of this contract document. |
| `projectId` | string `[A-Za-z0-9._-]+` | yes | Repository identity. Must equal the final path segment of the normalized canonical remote. |
| `projectName` | string | yes | Human-readable name used in reports. |
| `canonicalRemote` | object | yes | Canonical remote identity and its accepted equivalent forms. See below. |
| `defaultBranch` | string | yes | Branch that GitHub Pages publishes from. Informational; the validator does not contact a remote. |
| `hostLocalScope` | object | yes | States that host-specific data stays outside the repository. |
| `rootMarkers` | array of objects | yes | Files/directories that must exist at the resolved root for the root to be accepted. |
| `pathMap` | array of objects | yes | Declared repository-relative layout (site root, published pages, verifier scripts, evidence directory and tooling). |
| `mutationBoundaries` | object | yes | Write boundary: root containment, denied prefixes, donor/read-only policy. |
| `instructionAuthority` | object | yes | Which instruction file owns project authority and which file names shadow it. |
| `skillIsolation` | object | yes | `NO_CROSS_PROJECT_SKILL_LEAKAGE` policy and the markers that indicate foreign project content. |
| `declaredBoundaries` | object | yes | Declared legitimate modules, vendored examples, submodules, worktree layouts and fork policy. |
| `discovery` | object | yes | Paths excluded from directory scanning, each with a reason. |
| `enforcement` | object | yes | Per-requirement enforcement classification and host-audit semantics. |

### `canonicalRemote`

| Field | Type | Required | Meaning |
| --- | --- | --- | --- |
| `url` | string | yes | Canonical remote URL, in the preferred HTTPS form. |
| `normalizedIdentity` | string | yes | Normalized identity; must equal `normalizeRemoteIdentity(url)`. |
| `acceptedForms` | array of strings | yes | Equivalent HTTPS/SSH forms. Every entry must normalize to `normalizedIdentity`. |
| `approvedForkIdentities` | array of strings | yes | Normalized identities of explicitly approved forks. An identity that is neither canonical nor listed here fails. |
| `normalization` | object of booleans | yes | `dropScheme`, `dropUserInfo`, `lowercaseHost`, `stripGitSuffix`, `stripTrailingSlash`, `preservePathCase`. All must be `true`. |
| `repositoryRole` | string | yes | `canonical` for this repository. |

Normalization maps all of these to the identity `github.com/Umliva/umliva.github.io`:

```
https://github.com/Umliva/umliva.github.io.git
https://github.com/Umliva/umliva.github.io
git@github.com:Umliva/umliva.github.io.git
ssh://git@github.com/Umliva/umliva.github.io.git
https://github.com/Umliva/umliva.github.io/      (trailing slash)
https://GITHUB.com/Umliva/umliva.github.io       (host case)
```

Documented order: strip the scheme, drop user info, lowercase the host, strip leading and trailing
slashes, strip a trailing `.git`, strip trailing slashes again. The path keeps its case.

### `hostLocalScope`

| Field | Type | Required | Meaning |
| --- | --- | --- | --- |
| `location` | string | yes | Must be `host-local`. Absolute checkout locations, worktree registrations and audit observations are host data. |
| `committedPaths` | array | yes | Must be empty. The validator rejects a contract that commits host paths. |
| `note` | string | no | Free-text explanation. |
| `auditResultScope` | string | no | Where audit results are valid. |

### `rootMarkers` entries

| Field | Type | Required | Meaning |
| --- | --- | --- | --- |
| `path` | string | yes | Repository-relative path. Absolute paths, `..` and backslashes are schema violations. |
| `kind` | `file` \| `dir` | yes | Expected type. |
| `required` | boolean | yes | `true`: absence fails with `FAIL_WRONG_ROOT`. `false`: informative only. |

### `pathMap` entries

| Field | Type | Required | Meaning |
| --- | --- | --- | --- |
| `role` | string | yes | One of `siteRoot`, `contract`, `schemaDoc`, `validator`, `fixtureRunner`, `fixtures`, `hostAudit`, `evidenceDir`, `publishedPage`, `publishedPageOptional`, `verifierScript`, `verifierScriptOptional`, `contentDir`. A `pathMap` must declare exactly one `siteRoot` and its `contract` entry must match the validated contract path. |
| `path` | string | yes | Repository-relative path. |
| `kind` | `file` \| `dir` | yes | Expected type. |
| `required` | boolean | yes | `true`: absence fails with `FAIL_WRONG_ROOT`. `false`: validated only when present (entries delivered by a separate change set). |
| `note` | string | no | Why the entry is optional or what it contains. |

### `mutationBoundaries`

| Field | Type | Required | Meaning |
| --- | --- | --- | --- |
| `rootIsWriteBoundary` | boolean | yes | `true`: all writes must stay inside the resolved root. |
| `outsideRootPolicy` | `DENY` \| `ALLOW_DECLARED` | yes | `DENY`: targets outside the root always fail. |
| `symlinkTraversalPolicy` | `DENY` | yes | Must be `DENY`; symlink traversal out of the root fails. |
| `unresolvedParentPolicy` | string | yes | `RESOLVE_THEN_CHECK`: the deepest existing ancestor is resolved, remaining segments are appended and checked. |
| `deniedPrefixes` | array of strings | yes | Repository-relative prefixes that are never a valid write target (for example `.git`). |
| `donorProjects` | string | yes | `READ_ONLY`: navigation into donor/reference projects grants no write permission. |
| `navigationGrantsWrite` | boolean | yes | Must be `false`. |
| `publishedSurfaces` | array of strings | no | Paths whose changes require headed visual verification before merge. |
| `publishedSurfaceReview` | string | no | Human-readable review requirement. |

### `instructionAuthority`

| Field | Type | Required | Meaning |
| --- | --- | --- | --- |
| `projectInstructionFile` | string | yes | `AGENTS.md`: the only project authority file. |
| `shadowingFileNames` | array of strings | yes | File names that shadow project authority if they appear anywhere in the tree (here: `AGENTS.override.md`). Their presence fails with `FAIL_CONFIGURATION_SHADOWING`. |
| `nestedInstructionPolicy` | string | yes | Must be `identity-redeclaration-forbidden`: a nested `AGENTS.md` must not redeclare project identity. |
| `claimsToOverrideHigherPriorityInstructions` | boolean | yes | Must be `false`. The validator rejects a contract that claims local rules override higher-priority system or user instructions. |

### `skillIsolation`

| Field | Type | Required | Meaning |
| --- | --- | --- | --- |
| `policy` | string | yes | Must be `NO_CROSS_PROJECT_SKILL_LEAKAGE`. |
| `repoSkillRoots` | array of strings | yes | Repository-relative skill roots. `SKILL.md` below them is scanned for foreign markers. Empty when the repository declares no local skills. |
| `instructionFileNames` | array of strings | yes | File names scanned for foreign project markers anywhere in the tree. |
| `globalScope` | object | yes | `location` must be `host-local`; `committedPaths` must be empty. |
| `foreignProjectMarkers` | array of strings | yes | Identity markers of sibling projects. A match inside a scanned instruction or skill file fails with `FAIL_CROSS_PROJECT_SKILL_LEAKAGE`. Marker values live in the JSON contract, not here. |
| `activationVerification` | enforcement value | yes | How skill activation is verified. `TOOL_GAP`: offline checks can read advertised metadata only. |

### `declaredBoundaries`

| Field | Type | Required | Meaning |
| --- | --- | --- | --- |
| `modulesAllowlist` | array of strings | yes | Directories allowed to contain a nested project contract for a *different* `projectId`. Declarations never license nested git metadata or a second copy of this project. |
| `vendoredExamples` | array of strings | yes | Same tolerance as `modulesAllowlist` for vendored or example material. |
| `submodules` | array of `{ path, required }` | yes | Declared submodule paths. A submodule must use a `.git` gitlink file; a full `.git` directory at a declared submodule path still fails. |
| `worktrees.allowedLayouts` | array | yes | Subset of `primary`, `linked-worktree`, `gitfile`. The detected layout must be listed. |
| `worktrees.nestedInsideRoot` | string | yes | Must be `FORBIDDEN`: a linked worktree of this project inside the root is a nested project root. |
| `worktrees.registration` | string | yes | Must be `host-local-only`. |
| `forkPolicy` | string | no | Human-readable fork policy; enforcement is by `canonicalRemote.approvedForkIdentities`. |

Directories are never rejected by name. A nested project root is only ever reported from identity
evidence: a `.git` entry, or a project contract file inside that directory.

### `discovery`

| Field | Type | Required | Meaning |
| --- | --- | --- | --- |
| `exclusions` | array of `{ path, reason }` | yes | Subtrees skipped by the directory scans. Entries need a non-empty reason; repository-relative paths only; `.` is rejected so the root itself can never be excluded. |

### `enforcement`

| Field | Type | Required | Meaning |
| --- | --- | --- | --- |
| `classification` | object | yes | Maps a requirement key to exactly one of `DOCUMENT_ONLY`, `VALIDATOR_AVAILABLE`, `HOOK_ENFORCED`, `BROKER_ENFORCED`, `TOOL_GAP`. No other value is accepted, so a claim must be classified. |
| `toolGaps` | array of `{ gap, classification, note }` | no | Known gaps with an honest classification. |
| `hostAuditSemantics.values` | array | yes | Must be exactly `PASS`, `FAIL`, `NOT_VERIFIED`. |
| `hostAuditSemantics.unavailableHost` | string | yes | Must be `NOT_VERIFIED`. An unavailable host is never `PASS`. |
| `hostAuditSemantics.ciHostInspection` | string | yes | Must be `NOT_POSSIBLE`. Repository CI cannot inspect a user's host. |

## Checks and reason codes

Checks run in this deterministic order; the first check with a violation determines the reported
reason code.

| Order | Check | Failure codes |
| --- | --- | --- |
| 1 | root resolution | `FAIL_WRONG_ROOT` |
| 2 | contract presence | `FAIL_MISSING_CONTRACT` |
| 3 | contract schema (and schema-document consistency) | `FAIL_CONTRACT_SCHEMA` |
| 4 | root markers | `FAIL_WRONG_ROOT` |
| 5 | declared paths (`pathMap`) | `FAIL_WRONG_ROOT` |
| 6 | checkout layout against `declaredBoundaries.worktrees.allowedLayouts` | `FAIL_WRONG_ROOT` |
| 7 | remote resolution | `FAIL_REMOTE_UNRESOLVED` |
| 8 | remote identity | `FAIL_REMOTE_MISMATCH` |
| 9 | `projectId` consistency | `FAIL_PROJECT_ID_MISMATCH` |
| 10 | repository rebind (`--binding`) | `FAIL_REBIND_REQUIRED` |
| 11 | write targets (`--target`) | `FAIL_SYMLINK_ESCAPE`, `FAIL_WRITE_TARGET_DENIED` |
| 12 | nested project roots | `FAIL_NESTED_PROJECT_ROOT` |
| 13 | configuration shadowing | `FAIL_CONFIGURATION_SHADOWING` |
| 14 | skill isolation | `FAIL_CROSS_PROJECT_SKILL_LEAKAGE` |

Stable reason codes (`OK` and every `FAIL_*`) and their meaning:

| Reason code | Meaning |
| --- | --- |
| `OK` | Every check passed. |
| `FAIL_WRONG_ROOT` | The root is missing, not a directory, or a required root marker / declared path is absent or has the wrong type. |
| `FAIL_REMOTE_MISMATCH` | The resolved origin identity is neither the canonical identity nor a declared approved fork. |
| `FAIL_PROJECT_ID_MISMATCH` | `projectId` does not match the repository identity derived from the canonical remote. |
| `FAIL_MISSING_CONTRACT` | The contract file does not exist at the resolved root. |
| `FAIL_CONTRACT_SCHEMA` | The contract is unparseable, misses a required field, has a wrong type or enum value, or the schema document no longer documents every required field and reason code. |
| `FAIL_SYMLINK_ESCAPE` | A write target resolves outside the real root, whether by symlink, `..` traversal or a not-yet-existing parent chain that crosses a symlink. |
| `FAIL_NESTED_PROJECT_ROOT` | A directory below the root carries project-root identity evidence (`.git` entry or project contract) without a valid declaration, or is a second copy of this project. |
| `FAIL_CONFIGURATION_SHADOWING` | A shadowing instruction file exists, a second contract configuration exists at a non-canonical path, or a nested instruction file redeclares project identity. |
| `FAIL_REBIND_REQUIRED` | The recorded binding (root, `projectId`, remote identity or contract content) no longer matches this root: old write authority is invalid. |
| `FAIL_REMOTE_UNRESOLVED` | No usable git metadata or origin remote could be resolved for the root. |
| `FAIL_WRITE_TARGET_DENIED` | The write target resolves inside the root but under a denied prefix (`mutationBoundaries.deniedPrefixes`). |
| `FAIL_CROSS_PROJECT_SKILL_LEAKAGE` | A scanned instruction or skill file carries identity markers of another project. |

Usage errors exit `2` with a message on stderr and are not contract verdicts.

## Write-target resolution

`--target` may be relative to the root or absolute. Resolution walks the path segment by segment:
existing segments are resolved through symlinks, not-yet-existing segments stop the walk, the
deepest existing ancestor is realpath-resolved and the remaining segments are appended. The result
must stay inside the real root and must not be under `mutationBoundaries.deniedPrefixes`, otherwise
the run fails with `FAIL_SYMLINK_ESCAPE` or `FAIL_WRITE_TARGET_DENIED`.

## Repository rebind

`--binding <file>` names a host-local or temporary state file. `--bind` records
`{ contractVersion, projectId, normalizedRemote, realRoot, contractHash }` for the current root,
but only when the root validates. Any later run against a root whose path, `projectId`, remote
identity or contract content differs from the recorded binding fails with `FAIL_REBIND_REQUIRED`:
the old write authority is invalid until project rules are reloaded and the operator rebinds
explicitly with `--bind`. A missing binding file means no prior authority is recorded. Rebinding the
same root is byte-idempotent: the file is rewritten only when its content would change, and
`tools/run-agent-project-contract-fixtures.mjs` asserts that byte-identity.

## Host audit semantics

`tools/audit-agent-project-contract-host.sh` audits the local workstation and prints one row per
item with `PASS`, `FAIL` or `NOT_VERIFIED`. `NOT_VERIFIED` covers an unavailable or non-inspectable
fact; it is never a `PASS`. The audit prints counts and labels only: no home paths, no secrets and no
global configuration contents. Host audit results are host-local evidence. No repository CI job can
inspect a user's host (`ciHostInspection: NOT_POSSIBLE`).

## What the validator cannot enforce

- It cannot block a write. It is a check to run before a write, not a hook or a broker.
- It cannot prove that a harness loads `AGENTS.md`, that a nested instruction file is ignored, or
  that a skill is activated; it reads advertised metadata only.
- It cannot audit another workstation or the CI runner's environment.
- It cannot detect a nested project root that leaves no identity evidence (no `.git`, no contract
  file) — for example a copied tree with git metadata stripped.
- It cannot verify that a branch was reviewed; review discipline stays a human/PR gate.

These limits are the reason the enforcement classification distinguishes `DOCUMENT_ONLY`,
`VALIDATOR_AVAILABLE`, `HOOK_ENFORCED`, `BROKER_ENFORCED` and `TOOL_GAP` instead of claiming
enforcement.

## Fixture model

`tools/fixtures/agent-project-contract/` holds one base tree plus one manifest per case:

- `base-tree/` is a minimal, schema-valid project root copy (synthetic markers, no site pages).
- `cases/<case-id>.json` declares `trees` (each tree is a copy of the base tree or of a local
  `tree/` directory plus ordered `setup` operations) and `steps` (validator invocations with
  expected reason codes).
- Setup operations create git metadata, symlinks, files and JSON patches at test time, so no broken
  symlink and no committed `.git` directory is ever stored in the repository.
- `tools/run-agent-project-contract-fixtures.mjs` materializes every case into a temporary directory,
  asserts the exact expected reason code and cleans up. Temp state is never committed.

## Documented example: validated contract

`config/agent-project-contract.json` is the versioned contract of this repository and the reference
instance of this schema. Validating the real repository root must print
`PASS agent-project-contract reasonCode=OK`.
