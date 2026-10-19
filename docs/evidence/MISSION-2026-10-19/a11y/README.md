# WCAG A/AA axe audit — 2026-10-19

Status: **PASS on the local static candidate.** This is automated WCAG A/AA
checking in a headed browser, not a formal accessibility certification.

## Tool and scope

- axe-core `4.10.2`, rules `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`.
- 16 published HTML pages, viewport 1366×900 and 390×844.
- Headed Google Chrome; no headless-only claim.
- Script: `axe-audit.py`; raw results: `axe-before.json`, `axe-after.json`.

## Before

4 serious violations in 2 pages × 2 widths:

| Page | Rule | Nodes |
|---|---|---|
| `golden-case.html` | `link-in-text-block` | footer links `Startseite`, `Fachpartner` |
| `index.html` | `scrollable-region-focusable` | both scrollable Mermaid `<pre>` regions |

The footer links relied on colour alone and had no underline. The Mermaid
regions were scrollable but had no keyboard focus target.

## Fix

- `styles.css`: all `footer a` are now underlined with a 1-px underline and
  2-px offset, in addition to the existing colour.
- `index.html`: both Mermaid `<pre>` elements now have `tabindex="0"`,
  `role="img"` and a German `aria-label`; the existing global
  `:focus-visible` outline applies.
- No content, navigation or claim changed.

## After

```text
16 pages × 2 widths: 0 violations
Mermaid focus: PRE, tabIndex=0, role=img,
  "Bildschirmablauf als Diagramm" / "Datenfluss als Diagramm"
ArrowRight while focused: scrollLeft 0 -> 599.5
Footer link decoration: underline
48 page/viewport combinations (1366/390/320): 0 horizontal overflow
```

## Reproduction

```bash
python3 -m http.server 8766 --bind 127.0.0.1   # repository root
python3 docs/evidence/MISSION-2026-10-19/a11y/axe-audit.py \
  http://127.0.0.1:8766 /tmp/axe-after.json
```

The axe script loads axe-core from cdnjs, so the audit itself needs network
access. The site does not load axe.

## Limits

Automated rules cannot prove WCAG conformance, screen-reader behaviour, or
cognitive accessibility. No such claim is made. Manual keyboard and visual
observations are limited to the checks recorded above.
