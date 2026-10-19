# Live readback — Impressum 320-px repair

Date: 2026-10-19 (Europe/Berlin)
Website `main`: `e9ee950e8737e013691e0aa978f7c1b982140def` (merge of PR #28)
Pages deployment: workflow run `39288423659`, status `completed`, conclusion
`success`, head SHA `e9ee950e8737e013691e0aa978f7c1b982140def`.

## Measured

- `/impressum.html` at 1366×900: `scrollWidth=1351`, `clientWidth=1351`.
- `/impressum.html` at 390×844: `scrollWidth=375`, `clientWidth=375`.
- `/impressum.html` at 320×844: `scrollWidth=305`, `clientWidth=305`.
- All 16 published pages × 3 widths (48 combinations): 0 overflow, 0 broken
  images, 0 console errors, 0 failed requests.
- 199 internal links returned HTTP 200; 0 broken.
- 23 fragment links found their element ID; 0 missing.
- First Tab focused `.skip-link`; Enter moved focus to `#main-content`.

The deployed CSS contains `table-layout: fixed` and `overflow-wrap: anywhere`;
the live page therefore serves the repaired stylesheet, not a cached pre-fix
copy. A fresh browser profile was used for the readback.

## Evidence

- `live/headed-live.json` — full 48-combination records.
- `live/links-live.json` — live link and fragment results.
- `live/live-320x844-impressum.png` — live 320-px screenshot.

## Boundary

This proves the public static page on the deployment above. It does not turn
the still-open operator-identity or legal-review items into a PASS.
