# tool-governance

Harness adapter: **codex**

Use the canonical method at `methods/tool-governance/METHOD.md` and its `contract.yaml` as the source of truth.

## Adapter rule

Translate canonical phases into capabilities available in codex; do not duplicate, redefine, or weaken method invariants here.

## Execution

- Read the canonical method and contract before acting.
- Compose with router-selected prerequisite methods when applicable.
- Use only tools needed for the current task and risk surface.
- Capture evidence required by the method.
- Report unknowns/blockers explicitly rather than fabricating completion.

## Controllability

Assess the canonical controllability dimensions before depending on a tool, and keep
`AGENT_USABLE` honest: installed is not capability proof, and an unproven capability stays
`UNKNOWN`. Assemble a controlled path from `router/tool-capability-model.yaml`; reject
alternatives are recorded, never forced.
