# PR #10 Pages deployment and headed readback — 2026-10-17

Repository: `Umliva/umliva.github.io`
PR #10 head merged: `cba9559e803a1cc6c72ddb158ff9ab9ed9cd23bb`
Pages source / merge commit: `8d22485f6d1314c4a3d2cec9285cfba46191676c`
Merge parents: `3943d3cd435abb5faf84e1acd462c7dbc18b3354`, `cba9559e803a1cc6c72ddb158ff9ab9ed9cd23bb`
Merged: 2026-10-17 08:21:56 UTC by the repository owner using GitHub's normal merge operation.
Pages workflow: [run 39017085117](https://github.com/Umliva/umliva.github.io/actions/runs/39017085117) — SUCCESS on the exact merge SHA.
GitHub Pages deployment: `7136981367` — SUCCESS, environment `https://umliva.github.io/`, source `main` at the merge SHA.

## Visible readback

Browser: configured Playwright MCP in headed mode, visible Chrome `153.0.8010.36` on Linux; `document.visibilityState=visible`.
The first immediate read used a deployment-SHA query to bypass the existing browser cache. After the 600-second cache entry expired, the browser reopened and visually inspected the canonical URLs without query parameters:

- `https://umliva.github.io/`
- `https://umliva.github.io/golden-case.html`
- `https://umliva.github.io/partner.html`

The homepage was checked at 1366×900, 390×844, and 320×844 CSS pixels. Golden-case and partner pages were checked at 1366×900 and 390×844.

- Homepage: “Nebenkostenabrechnung” is a single rendered word at all three widths. Document widths matched: 1351/1351 at desktop, 375/375 at 390 px, and 305/305 at 320 px.
- Golden case: the visible German badge says “Synthetischer Strukturfall · keine Originalfalldaten · keine Aussage zum Rechtsergebnis”; document widths matched at desktop and mobile.
- Partner page: the lead visibly keeps individual legal advice and representation with a human; document widths matched at desktop and mobile.
- The homepage retains “Keine Garantie” and the human decision boundary. All three pages retain the owner-data placeholder.
- Direct HTTP readback returned 200 for the three pages and `/PRIVACY.md`; `/impressum.html` and `/datenschutz.html` remain 404.

### Browser cache diagnosis

The first post-deployment read in the already-used browser profile reused its prior unversioned HTML/CSS cache, so it still showed the old heading and English badge. A direct request for the CSS with the merge-SHA query returned the updated asset, and its bytes matched `git show 8d22485f6d1314c4a3d2cec9285cfba46191676c:styles.css` exactly (SHA-256 `b919017b0551a7bc1f2eae782c7047ac7e4c637d1aa002175c7d529a6696200f`). The response had `last-modified: 2026-10-17 08:22:15 UTC`, `x-proxy-cache: MISS`, and `cache-control: max-age=600`. After the cache entry expired, the headed browser reopened the canonical URLs without a query parameter. The original routes then showed the current heading and German badge, with the same no-overflow measurements; the screenshots below are from those canonical URLs. No Pages source correction was needed.

### Post-deployment screenshots and SHA-256

These are viewport captures from the canonical URLs after the matching deployment completed and the old browser cache expired. Screenshots were visually inspected.

| Page | Viewport | Screenshot | SHA-256 |
| --- | --- | --- | --- |
| / | 1366×900 | `pr10-live-post-home-1366x900.png` | `29476d54f56209d0a099e388a150c6321974df7d20e35161e76d87483723b11b` |
| / | 390×844 | `pr10-live-post-home-390x844.png` | `4c6e73fea41cff9a4cb2c71f6b1dc4a26200929a73b499049ae0bd4ef40f2629` |
| / | 320×844 | `pr10-live-post-home-320x844.png` | `ccff4982b3519756a2bf4802a5ee1222da48b2a956f8340a892c4d9dd2011fe9` |
| /golden-case.html | 1366×900 | `pr10-live-post-golden-1366x900.png` | `1aa9d59a98cf18fb63aed4490182a0a3f1dd205b4719b94cbaac311001aa8326` |
| /golden-case.html | 390×844 | `pr10-live-post-golden-390x844.png` | `95b265fb3905079b6cc9aaefa36c08e85c7dbda38ac828543ec4d856ef4f7f97` |
| /partner.html | 1366×900 | `pr10-live-post-partner-1366x900.png` | `80eb647bd76ad5b1d8f91bd5b67a2b6069d2407222cf029a49fcae5e4820e9e1` |
| /partner.html | 390×844 | `pr10-live-post-partner-390x844.png` | `0e90c765d1c048508f8e0532917cbaf6274c44bc7a9679db326a03f1dde10e16` |

This readback confirms the PR #10 page files are deployed. The Wiki translation remains an unpublished artifact. Legal/provider disclosures remain unresolved, and this is not a V1 release-readiness claim.
