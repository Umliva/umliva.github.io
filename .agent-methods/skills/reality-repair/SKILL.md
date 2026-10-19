# reality-repair

Harness adapter: **codex**

Use the canonical method at `methods/reality-repair/METHOD.md` and its `contract.yaml` as the source of truth.

## Adapter rule

Translate the canonical phases into the capabilities available in codex; do not redefine or weaken the method invariants here.

## Execution

- Read the canonical method before acting.
- Use only tools required for the current task.
- Capture evidence required by the method.
- For explicit `audited_defect` work, compose with the installed M01 method and use bundled `tools/check_repair.py` against a project-local evidence root. A checker pass still needs independent review where required.
- Surface blockers rather than fabricating completion.
