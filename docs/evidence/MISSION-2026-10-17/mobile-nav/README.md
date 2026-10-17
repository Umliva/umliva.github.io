# Mobile navigation reachability — 2026-10-17

Base `main`: `96d202bd627123be8d7d3fcd871f09bf2aae8e7c`.

## Problem

At ≤800 px, both `styles.css` and `guide.css` hid every header navigation link
(`display: none`). Phone users saw only the brand; the main routes were reachable
only through the footer.

## Fix

The header now wraps its navigation under the brand on phones instead of hiding
it. No script, off-canvas overlay or new route is introduced; the established
visual system and link set are unchanged. `guide.css` mirrors `styles.css` so
Ratgeber pages behave the same.

## Verification

```text
node verify-site.mjs                         PASS
node tools/verify-german.mjs                 PASS
node tools/verify-agent-project-contract.mjs PASS
git diff --check                             PASS
```

Headed Chrome at 1366×900, 390×844 and 320×844 across `/`, `/impressum.html`,
`/datenschutz.html`, `/partner.html`, `/golden-case.html` and `/ratgeber/`:

```text
pages=18 problems=0
```

Every page reports its full navigation link count as visible, exactly one `h1`,
no horizontal overflow and no console errors. Screenshots: `home-mobile.png`,
`home-narrow.png`; machine result: `headed-check.json`.

Deployment follows the reviewed merge and Pages build.
