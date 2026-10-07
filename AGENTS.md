# AGENTS.md — Umliva public website contract

## Identity

- Canonical repository: `Umliva/umliva.github.io`
- Deployment: static GitHub Pages, published from `main`
- Public URL: `https://umliva.github.io`
- Git root = repository root (this directory).

## Root / layout

Static site, no build step, no backend:

- Root: `index.html`, `golden-case.html`, `partner.html`, `sitemap.xml`, `robots.txt`, `favicon.svg`, `styles.css`, `guide.css`, `.nojekyll`
- `ratgeber/`: bounded German-language guide pages (`index.html` + topic pages)
- `diagrams/`: Mermaid sources (`screen-flow.mmd`, `data-flow.mmd`), rendered client-side on `index.html`
- Verification scripts: `verify-site.mjs`, `verify-sanitization.mjs`

## Public / private boundary

- This is a **public** repository. Only sanitized, non-personal content may be committed.
- Real case data, original documents, personal bills, names, addresses, account identifiers, contact details, credentials and signing material stay private and must never be committed.
- No secrets or private case data, ever.

## Static verification

Run before merge (all local):

```bash
node verify-site.mjs
node verify-sanitization.mjs
# local serve check:
python3 -m http.server 8000   # then open http://localhost:8000
```

## Sanitization rules

- Allowed: synthetic structure tokens only (`P-01`, `S-A`, `S-B`, `D-01`, `R-01`, `F-001` … `F-004`, `C-001`).
- Forbidden: currency amounts, calendar dates, email addresses, phone numbers, IBANs, account/case identifiers, real names, addresses, contract parties.
- No legal outcome claims. The site describes a deterministic billing checker, not individualized legal advice.
- Human-in-the-loop: attorney responsibility remains with a human; no automatic legal guarantee or success forecast.

## Machine-readable contract

- Contract: `config/agent-project-contract.json` (`contractVersion` 1.0.0). Identity, canonical remote
  and its accepted HTTPS/SSH forms, default branch, root markers, path map, mutation boundaries,
  skill-isolation policy and the per-requirement enforcement classification.
- Schema: `docs/AGENT_PROJECT_CONTRACT_SCHEMA.md`. Every field with type and meaning, the stable
  reason codes, the check order and an explicit statement of what the validator cannot enforce.
- Validator: `node tools/verify-agent-project-contract.mjs` — deterministic, offline, zero
  dependency. Flags: `--root`, `--contract`, `--target` (repeatable), `--binding` with `--bind`,
  `--json`, `--show-paths`. Prints `PASS`/`FAIL` plus a stable reason code on stdout.
- Fixtures: `node tools/run-agent-project-contract-fixtures.mjs` — one base tree plus one manifest
  per case under `tools/fixtures/agent-project-contract/`. Cases are materialized at run time
  (git metadata and symlinks are created there, never committed), each step asserts the exact
  expected reason code, and all temporary state is removed.
- Host audit: `bash tools/audit-agent-project-contract-host.sh` — prints `PASS`, `FAIL` or
  `NOT_VERIFIED` per audited item for this workstation, with counts only and no host paths.
- Rebinding: `--binding` with `--bind` records the write authority of the resolved root. A different
  root, `projectId`, remote identity or contract content then fails with `FAIL_REBIND_REQUIRED`
  until the project rules are reloaded and the binding refreshed explicitly.

Run before merge (all local):

```bash
node tools/verify-agent-project-contract.mjs
node tools/run-agent-project-contract-fixtures.mjs
bash tools/audit-agent-project-contract-host.sh
```

Optional path entries (`golden-case.html`, `partner.html`, `verify-sanitization.mjs`) are delivered by
a separate change set: the contract marks them `required: false` and their commands apply only once
they are present.

## Enforcement classification

Truthful classification for this repository. `DOCUMENT_ONLY` = prose only, `VALIDATOR_AVAILABLE` = a
deterministic check exists that must be run by the operator, `HOOK_ENFORCED` / `BROKER_ENFORCED` = a
harness mechanism can block the action, `TOOL_GAP` = no such mechanism is available here.

| Requirement | Classification | Evidence |
| --- | --- | --- |
| Root, remote identity, `projectId`, path map, checkout layout | VALIDATOR_AVAILABLE | validator, reason codes `FAIL_WRONG_ROOT`, `FAIL_REMOTE_MISMATCH`, `FAIL_REMOTE_UNRESOLVED`, `FAIL_PROJECT_ID_MISMATCH` |
| Contract presence and schema, schema-document consistency | VALIDATOR_AVAILABLE | validator, `FAIL_MISSING_CONTRACT`, `FAIL_CONTRACT_SCHEMA` |
| Write-target resolution (symlink escapes, traversal, unresolved parents) | VALIDATOR_AVAILABLE | validator `--target`, `FAIL_SYMLINK_ESCAPE`, `FAIL_WRITE_TARGET_DENIED`; it checks a target, it does not intercept a write |
| Nested project root and declared boundaries | VALIDATOR_AVAILABLE | validator `FAIL_NESTED_PROJECT_ROOT` against `declaredBoundaries` |
| Configuration shadowing | VALIDATOR_AVAILABLE | validator `FAIL_CONFIGURATION_SHADOWING` |
| Repository rebind | VALIDATOR_AVAILABLE | validator `--binding`/`--bind`, `FAIL_REBIND_REQUIRED`; a state file, not a harness event hook |
| In-repository skill and instruction isolation | VALIDATOR_AVAILABLE | validator `FAIL_CROSS_PROJECT_SKILL_LEAKAGE` |
| Host global instructions and skill scope | VALIDATOR_AVAILABLE | `tools/audit-agent-project-contract-host.sh`, host-local result |
| Write interception | TOOL_GAP | no hook or broker is configured for this repository |
| Hook or broker enforcement | TOOL_GAP | none available in this harness for this repository |
| Skill activation | TOOL_GAP | only advertised skill metadata is readable offline |
| Host global configuration repair | DOCUMENT_ONLY | the audit diagnoses; repairs stay manual and host-local |
| Prose rules in this file | DOCUMENT_ONLY | a rule or a standalone validator is not enforcement by itself |

Host-level enforcement status is `NOT_VERIFIED`: the audit covers the workstation that runs it, an
unavailable host is `NOT_VERIFIED` and never `PASS`, and no CI job in this repository inspects a
user's host. Evidence for the current run: `docs/evidence/U3/`.

## Mutation scope

- Allowed: static HTML/CSS, diagrams, Markdown, and the verification scripts in this repository.
- No backend, no runtime, no generated-site framework. Keep it a static GitHub Pages site.

## Hard rules

- `NO_NESTED_PROJECT_ROOT`: do not create or use a nested/shadow copy of this repository inside itself. The validator reports this as `FAIL_NESTED_PROJECT_ROOT`.
- `NO_CONFIGURATION_SHADOWING`: one authority per project. No `AGENTS.override.md`, no second
  contract file at a non-canonical path and no nested instruction file that redeclares the project
  identity; those cases fail with `FAIL_CONFIGURATION_SHADOWING`.
- `NO_CROSS_PROJECT_SKILL_LEAKAGE`: repository-local instructions and skills stay project-local.
  Global configuration owns generic cross-project policy only; instruction or skill content carrying
  another project's identity markers fails with `FAIL_CROSS_PROJECT_SKILL_LEAKAGE`.
- Navigation, discovery and donor/reference repositories grant no write permission. Declared modules,
  submodules, vendored examples and approved worktrees are never rejected by directory name, only by
  identity evidence.
- **Merge First governance**: changes reach `main` only via a reviewed PR merge; GitHub Pages publishes from `main`. No direct pushes to `main`, no force-push, no unreviewed merge.
- **Headed visual verification**: before merge, visually verify the changed pages in a real browser at desktop and mobile widths (responsive breakpoints) and record the observation.
