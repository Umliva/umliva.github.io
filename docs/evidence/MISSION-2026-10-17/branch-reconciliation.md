# Website remote branch reconciliation — 2026-10-17

Canonical `main`: `d76f5912fc211a5423acf4c1bcb5185fb7599dae`.
Open PRs: none. Open issue: governance #5 only (permanent).

Every surviving topic branch is merged or content-identical to a merged branch.
Each tip equals its pull-request head (`SAME`) where a PR exists.

| Branch | Tip | PR | State | Decision |
|---|---|---|---|---|
| `codex/billing-privacy-live-readback-20261017` | `30dc151445` | #16 | MERGED | DELETE |
| `codex/legal-live-readback-20261017` | `03f348fce4` | #12 | MERGED | DELETE |
| `codex/legal-publication-20261017` | `3ade9386eb` | #11 | MERGED | DELETE |
| `codex/privacy-billing-permission-20261017` | `8a98176f57` | #15 | MERGED | DELETE |
| `codex/reconcile-website-status-20261013` | `ea148ae351` | #9 | MERGED | DELETE |
| `codex/site-german-copy-20261015` | `cba9559e80` | #10 | MERGED | DELETE |
| `codex/v1-promise-boundary-20261017` | `b7f7e9ebb6` | #13 | MERGED | DELETE |
| `codex/v1-scope-live-readback-20261017` | `fcd5c2dfed` | #14 | MERGED | DELETE |
| `design/umliva-pruefwerkzeug-20261007` | `c11f9fb4fd` | #8 | MERGED | DELETE |
| `docs/agent-contract-issue-3-main` | `c59112d4ac` | #6 | MERGED | DELETE |
| `feat/legal-partner-golden-case` | `20f6131594` | #4 | MERGED | DELETE |
| `skill/website-bauen-anwendung-20261010` | `c11f9fb4fd` | — | content-identical to merged PR #8 | DELETE |
| `ux/persona-ux-fixes-20261007` | `d261bf91d4` | #7 | MERGED | DELETE |

No force push, reset or history rewrite is used. Commit SHAs remain recoverable
from the canonical history and pull requests.
