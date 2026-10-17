# Tool Governance

## Purpose
Select, install, and use external tools/MCPs/connectors with the smallest capability and privilege set that materially improves the task.

## Controllability invariant

**An autonomous agent may depend only on tools whose relevant execution path is actually agent-controllable.**

Controllability invariant id: `an_autonomous_agent_may_depend_only_on_tools_whose_relevant_execution_path_is_agent_controllable`.

Being technically suitable, installed, configured, launchable, or "opening a GUI" is **not** capability proof. The applicable dimensions are declared in
`router/tool-capability-model.yaml`:

`CAN_INVOKE`, `CAN_OBSERVE`, `CAN_BOUND_RESOURCES`, `CAN_TERMINATE`, `CAN_CLEANUP`, `CAN_RECOVER`, `SIDE_EFFECTS_KNOWN_AND_BOUNDED`, `NO_UNCONTROLLED_REQUIRED_CHILDREN`.

An assessment yields `AGENT_USABLE = YES | NO | PARTIAL | UNKNOWN` plus reasons and
evidence. `YES` always requires a smoke test whose report is bound to project bytes:
an unverified `PASS` is at most `UNKNOWN`. A recorded dimension value is
authoritative and is never overwritten; `resource_heavy` only supplies a default for
the resource-bound dimensions (`CAN_BOUND_RESOURCES`, `CAN_TERMINATE`, `CAN_CLEANUP`,
`CAN_RECOVER`) when they are not recorded, and an essential dimension is always
applicable. If a tool the task depends on fails a material controllability gate, the
agent must select a controllable alternative or report a blocker; it must not force
the workflow through the unsuitable tool. Uncontrolled GUI side effects and
resource-heavy helpers (emulators, containers, local model servers, renderers,
browsers) may not become hidden dependencies of autonomous execution, and must not
be spawned merely because a project type suggests them. Installation success is not
capability proof; an unproven capability stays `UNKNOWN`.

## Procedure
1. Inspect the project/task before adding tooling.
2. Define the missing capability in concrete terms.
3. Reuse an already available trusted tool when it satisfies the capability.
4. For a new tool, verify source/maintainer, scope, permissions, data flow, network access, and write/destructive capabilities.
5. Prefer read-only access first; escalate permissions only for an explicit required action.
6. Decide placement: truly universal tools may be global; project/domain-specific tools belong project-locally.
7. Assess agent controllability across the conformance dimensions for the tool's actual execution path; record each dimension, its evidence, and every `NO`/`UNKNOWN`.
8. Select the controlled execution path, recording rejected alternatives and why each was rejected.
9. Run a minimal capability smoke test where the task depends on the capability, and bind the report to project bytes; a declared pass without bound evidence stays unverified.
10. Document configuration, secrets boundary, rollback/removal, and failure mode.
11. Periodically remove unused or superseded tooling.

## Invariants
- More tools is not better.
- No project-specific global installation without a documented reason.
- Do not request broad credentials/scopes for a narrow task.
- Installation success is not capability proof.
- Destructive/write actions require explicit task need and appropriate governance.
- A tool with an unproven or negative required dimension is not agent-usable.
- A resource-heavy or process-spawning helper is not enabled without a demonstrated lifecycle and resource bound.

## Example, not an exception

A conventional IDE may be the right tool for a human while remaining
`AGENT_USABLE = NO` (GUI-only observation, uncontrolled required child processes).
The general rule then selects a controllable alternative, for example Gradle/SDK
command-line tooling plus `adb` against a real device, and leaves the IDE optional
and supervised. This is an application of the general controllability rule, not an
Android-specific exemption; no project type may make an uncontrolled tool
mandatory for autonomous execution.
