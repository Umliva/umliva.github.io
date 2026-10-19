# Reality Repair

## Goal

Repair an observed defect with the smallest sufficient change and prove the behavior through the real affected path.

## Procedure

1. Observe the defect.
2. Reproduce it deterministically when possible.
3. Establish root cause before editing.
4. Determine the dependency radius and affected consumers.
5. Apply the smallest sufficient patch.
6. Run targeted regression tests.
7. Run integration validation.
8. Run a vertical behavioral test across the actual affected layers.
9. Produce visible/runtime evidence when the product has a visible/runtime surface.
10. Report claim/evidence pairs and remaining uncertainty.

## Invariants

- Issue state is not implementation evidence.
- Do not weaken tests to obtain green status without proving the old test is wrong.
- No unrelated refactor while repairing the defect.
- No self-validation as the sole release proof when independent review is required.
- Prefer minimal change over architecture churn.

## Audited repair gate (M04)

For an explicit `audited_defect` task, install this method together with `claim-reality-audit`, `workspace-preflight`, and `vertical-reality-qa`. The project-local `tools/check_repair.py` accepts a versioned repair ledger under an authorized evidence root. It reuses M01's evidence-root path guard, then reads each artifact once and checks its digest, report status, and binding from those same bytes. The gate requires one named case, a baseline failing regression test, a later passing regression test, a passing consumer runtime report, matching regression-test source digests before and after, and a declared attempt count within a positive budget. Both test report JSON files must include matching `case_id` and `test_source_sha256`; the runtime report must include matching `case_id`. It returns a machine-readable `PASS` or `FAIL` with reasons.

The test-source comparison and report binding prevent an unchanged-test claim when supplied snapshots differ or reports identify another case/source. They cannot prove that a passing report truly executed that source, that reports came from independent producers, that the repair is causally minimal, or that a self-declared attempt count is complete. Record the commands, environment, exact revision, root-cause argument, affected consumers, and any independent review separately. Keep a failed/unknown gate unresolved; do not relabel it as success. A justified correction to a wrong test requires explicit review and a fresh baseline, not a silent digest change.

The existing `defect` route remains a guidance-only path for installations without M01. The audited gate is selected only by explicit `audited_defect` intent. It is not a general-purpose executor or an automatic natural-language classifier.
