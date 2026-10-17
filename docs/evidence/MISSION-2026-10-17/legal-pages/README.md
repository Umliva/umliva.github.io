# Legal publication surface — candidate evidence

Date: 2026-10-17
Repository: `Umliva/umliva.github.io`
Base `main`: `5c981b3` (Merge PR #9)
Candidate: the legal-pages branch created from that base.

## What changed

- Added `impressum.html` with the complete page structure required by § 5 DDG
  and § 18 Abs. 2 MStV.
- Added `datenschutz.html` describing the actual processing of the static site
  and the current local-first app behavior.
- Replaced the raw footer token `LEGAL_DISCLOSURE_OWNER_DATA_REQUIRED` on all
  published pages with links to the two new pages. The missing owner identity
  remains visible as “Betreiberangaben ausstehend”.
- Added both pages to `sitemap.xml` and to the required-page list in
  `verify-site.mjs`.

## Missing owner data — irreducible blocker

The repository contains no verified operator identity. The following fields are
therefore intentionally not invented and remain marked as open in
`impressum.html`:

1. legal name of the operator,
2. postal address,
3. contact email address (and optional phone),
4. legal form and authorised representative, if applicable,
5. register entry and register court, if applicable,
6. VAT identification number, if applicable,
7. responsible person under § 18 Abs. 2 MStV, if editorial responsibility applies,
8. participation status in consumer dispute resolution.

`datenschutz.html` likewise names the controller only generically and states
that the verified identity will be added before publication. No name, address,
email, phone number or register data was invented.

## Verification executed

All commands run in the website repository root.

```text
node verify-site.mjs
PASS site-static-check html=16 required=20

node verify-sanitization.mjs
PASS site-privacy-sanitization pages=2 forbidden-patterns=6

node tools/verify-german.mjs
PASS verify-german files=18 forbidden-terms=41 hits=0

node tools/verify-agent-project-contract.mjs --target impressum.html --target datenschutz.html
PASS agent-project-contract reasonCode=OK checks=14

node tools/run-agent-project-contract-fixtures.mjs
PASS agent-project-contract-fixtures reasonCode=OK cases=29 steps=38 mismatches=0

bash tools/audit-agent-project-contract-host.sh
PASS agent-project-contract-host-audit reasonCode=OK
summary PASS=7 FAIL=0 NOT_VERIFIED=4 (config coverage, skill activation,
write enforcement, host coverage stay NOT_VERIFIED by design)

git diff --check
PASS
```

## Headed visual verification

A real Chrome window (`google-chrome`, Playwright headed, `DISPLAY=:0`) loaded
the locally served candidate from `http://127.0.0.1:8765`. It checked 18
page/viewport combinations:

- pages: `/`, `/impressum.html`, `/datenschutz.html`, `/partner.html`,
  `/golden-case.html`, `/ratgeber/`;
- viewports: 1366×900, 390×844, 320×844.

Observed: 18/18 pages HTTP 200, 55/55 internal links resolved, no horizontal
overflow, no console errors, no failed requests, exactly one `h1` per page,
title/description/canonical present, skip link targets `#main-content`, footer
legal links present.

Machine-readable result: `headed-verification.json`.
Screenshots: one full-page PNG per page and viewport in this directory.
The focused skip link is visible in the screenshots because the script focused
it to verify keyboard reachability; the normal load state hides it.

## Privacy alignment

`datenschutz.html` discloses the two actual third-party network contacts of the
site: GitHub Pages for hosting and jsDelivr for the Mermaid library used by the
homepage diagrams. It states that no analytics, advertising, social plugins or
forms are used. For the app it records local-first processing, encrypted local
storage, disabled cloud backup, optional app lock, no configured sign-in, no
active telemetry sink, local deletion and the conditional Google Play purchase
path. It does not claim an OCR engine, accuracy figure or production release.

## Deployment state

`DEPLOYMENT=PENDING_AFTER_REVIEWED_MERGE`. The live URLs
`https://umliva.github.io/impressum.html` and
`https://umliva.github.io/datenschutz.html` still return 404 until the reviewed
candidate is merged to `main` and GitHub Pages publishes it. Live readback is
recorded separately after deployment.
