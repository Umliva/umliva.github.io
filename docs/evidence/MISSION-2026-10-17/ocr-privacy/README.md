# Privacy notice and missing OCR — 2026-10-17

The privacy page described local document extraction generally, while the V1
release has no OCR engine and does not read image/scan documents.

Change: the “Lokale Verarbeitung” section now states that automatic OCR for
image and scan documents is not included in this V1 version and such documents
are not read. This matches the app's OCR-unavailable message, the public
`#v1-umfang` boundary and the release artifact.

No OCR capability, accuracy or engine claim is added.

## Verification

```text
node verify-site.mjs                         PASS
node verify-sanitization.mjs                 PASS
node tools/verify-german.mjs                 PASS
node tools/verify-agent-project-contract.mjs PASS
git diff --check                             PASS
```

Headed Chrome at 1366×900, 390×844 and 320×844: HTTP 200, sentence present,
no horizontal overflow, no console errors. Screenshots and `headed-check.json`
are in this directory. Deployment follows the reviewed merge.
