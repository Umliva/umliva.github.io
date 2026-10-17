# Workspace Preflight

## Goal

Establish the actual repository/workspace state before making changes.

## Procedure

1. Identify canonical project root and repository remote.
2. Read project-local instructions and detect conflicting global/project-specific instructions.
3. Record branch, HEAD, working-tree state, remotes, and relevant open PRs/issues.
4. Determine whether existing work should be converged before new work begins.
5. Inventory required tools/capabilities and verify that required integrations actually work.
6. State blockers as blockers; do not infer readiness from configuration alone.

## Invariants

- No nested-project-root ambiguity.
- No new development before material existing work is reconciled.
- Tool capability must be demonstrated, not assumed.
- Project-local rules override project-specific global rules.
