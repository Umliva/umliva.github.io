# V1 promise-boundary alignment — 2026-10-17

Applies the canonical application scope
(`Umliva/Umliva` `docs/V1_COVERAGE_SCOPE.md`, main `0f4dca4452…`) to the public
website.

## Changed copy

- Page title and meta/OG/JSON-LD description now say Umliva checks the structure
  and calculation path of a **Betriebskostenabrechnung**; heating, CO₂,
  apportionability and deadlines are explicitly named as not checked.
- Hero lead now limits the current V1 claim to confirmed positions, sums, area
  reference and shares, and names the open areas.
- New section `#v1-umfang` (`data-v1-scope="declared"`) lists what V1 checks and
  ten excluded families:
  administration/repair/maintenance apportionability, maintenance reserve,
  insurance components, caretaker/mixed services, cable TV after 2024, other
  operating costs and contractual agreements, vacancy/commercial units, heating
  and CO₂ allocation, § 556 BGB deadlines, and economic/legal consequences.
- `llms.txt` carries the same boundary.
- `verify-site.mjs` now requires the scope section, the declared marker, the
  “In V1 ausdrücklich nicht geprüft” wording and the heating/CO₂ exclusion, so
  the promise cannot silently drift back to complete coverage.

No accuracy percentage, legal-success claim, “verified OCR” claim or complete
coverage claim is published.

## Verification

```text
node verify-site.mjs                  PASS (16 html, 20 required)
node verify-sanitization.mjs          PASS
node tools/verify-german.mjs          PASS (18 files, 0 hits)
node tools/verify-agent-project-contract.mjs  PASS
node tools/run-agent-project-contract-fixtures.mjs PASS (29 cases)
bash tools/audit-agent-project-contract-host.sh PASS=7 FAIL=0 NOT_VERIFIED=4
git diff --check                      PASS
```

Headed Chrome (Playwright, `DISPLAY=:0`) against the local candidate:

```text
pages_checked=18 (6 pages × 3 viewports)
internal_links_checked=55
problems=0
```

Viewports 1366×900, 390×844 and 320×844. The new section has no horizontal
overflow; at 320 px the cards stack and the German text wraps without clipping.
Screenshots: `scope-desktop.png`, `scope-mobile.png`, `scope-narrow.png`;
machine result: `headed-verification.json`.

## Deployment

`DEPLOYMENT=PENDING_AFTER_REVIEWED_MERGE`. Live readback follows the Pages build
for the merged commit.
