# Live accessibility readback — 2026-10-19

Website `main`: `18d2c484a9c8230be26284ae93b9f3c89a799829` (merge of PR #30).
Pages deployment run `39293842608`: status `completed`, conclusion `success`,
head SHA `18d2c484a9c8230be26284ae93b9f3c89a799829`.

## Measured on the deployed site

- axe-core `4.10.2`, WCAG A/AA tags, 16 pages at 1366×900 and 390×844:
  **0 violations**.
- Focused Mermaid region: `PRE`, `tabIndex=0`, label
  `Bildschirmablauf als Diagramm`.
- Golden-case footer link decoration: `underline`.
- 320×844 width: `/`, `/golden-case.html` and `/impressum.html` all report
  `scrollWidth=305`, `clientWidth=305`.

## Evidence

- `live/axe-live.json` — full live result.
- `live/live-focused-diagram-390.png` — focused diagram on the deployed site.

## Boundary

This is automated WCAG A/AA checking in a headed browser, not a certification
and not a screen-reader test. The legal identity and review blockers remain
open.
