# Live readback — keyboard focus target

Date: 2026-10-17
Canonical `main`: `24be49ce6acda2e2355130c67d351538a2c37d01` (merge of PR #25).
Pages build: `built` for exactly that commit.

Headed Chrome against the live site at 390×844 and 320×844 for `/`,
`/ratgeber/` and `/datenschutz.html`: first Tab focuses `a.skip-link`; Enter
moves `document.activeElement` to `#main-content`. 6/6 checks pass, no console
errors.

No visual design, route or content change.
