# Vertical Reality QA

## Goal

Select validation by risk and prove the user-visible behavior through the actual affected system layers.

## Procedure

1. Classify the changed surface and risks.
2. Select the smallest sufficient validation matrix.
3. Run targeted unit/component/regression tests.
4. Run integration validation for affected components.
5. Run a vertical behavioral test through the real path.
6. Add visible/runtime/device proof where applicable.
7. Add resilience/failure-recovery validation where risk warrants it.
8. Record evidence, gaps, and release blockers.

## Example risk dimensions

- UI/visual
- accessibility
- device/hardware
- network
- persistence
- security/privacy
- migration
- performance
- concurrency
- failure recovery
- clean install/update

## Invariants

- No fixed 50-role ceremony.
- Validation depth follows risk.
- Green unit tests alone do not prove product behavior.
