# OCR promise boundary on the website — 2026-10-17

The release artifact has no OCR engine and fails closed for image-only/scanned
documents. The website's V1 scope section did not name that limitation.

Change: the `#v1-umfang` excluded list now includes “automatische Texterkennung
für Bild- und Scan-Dokumente”; `llms.txt` carries the same sentence and
`verify-site.mjs` requires it, so the boundary cannot silently disappear.

No OCR capability, accuracy, engine choice or release claim is added.

## Verification

```text
node verify-site.mjs          PASS
node tools/verify-german.mjs  PASS
node tools/verify-agent-project-contract.mjs PASS
git diff --check              PASS
```

Headed Chrome at 1366×900, 390×844 and 320×844: HTTP 200, 16 scope list items,
the OCR sentence present, no horizontal overflow and no console errors.
Evidence: `headed-check.json`, `scope-desktop.png`, `scope-mobile.png`,
`scope-narrow.png`.

Deployment follows the reviewed merge and Pages build.
