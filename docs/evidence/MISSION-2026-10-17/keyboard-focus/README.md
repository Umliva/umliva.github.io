# Skip-link focus target — 2026-10-17

Base `main`: `a28acc921b9687380fd5fcac661fb1ff7598a7d5`.

## Problem

Every page had a skip link to `#main-content`, but `<main>` was not focusable.
Activating the link scrolled the page while keyboard focus stayed on the link.

## Fix

All 16 published HTML pages now use `<main id="main-content" tabindex="-1" …>`.
No visual design, route or content changes.

## Verification

```text
node verify-site.mjs                         PASS
node tools/verify-german.mjs                 PASS
node tools/verify-agent-project-contract.mjs PASS
git diff --check                             PASS
```

Headed Chrome at 1366×900 and 390×844 over `/`, `/impressum.html`,
`/datenschutz.html`, `/partner.html`, `/golden-case.html`, `/ratgeber/` and a
guide page:

- first `Tab` focuses `a.skip-link`;
- `Enter` moves `document.activeElement` to `#main-content`;
- 14/14 checks pass, no console errors.

Result: `headed-check.json`; screenshot: `focus-mobile.png`. Deployment follows
the reviewed merge.
