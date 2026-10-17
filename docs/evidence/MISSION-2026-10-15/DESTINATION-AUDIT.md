# Public destination audit — 2026-10-15

Repository: `Umliva/umliva.github.io` · PR #10 branch `codex/site-german-copy-20261015` · exact source/evidence head at audit start: `d8b688b4e5e214ed8f748a619af543242a7c11e2`.

The local HTML link inventory was extracted from all published `.html` files at that exact PR tree. It found **21 unique site-local destinations** (`href`, `src`, and `data-diagram-src`) and **18 unique absolute destinations**. Each destination was fetched with `curl 8.5.0` using `curl -LsS --max-time 25 -o /dev/null -w '%{http_code} %{url_effective}' URL`. The fetched deployment was public `main` `3943d3cd435abb5faf84e1acd462c7dbc18b3354`; all listed destinations returned HTTP `200`.

## Site-local destinations — 21/21 returned 200

```text
/
/PRIVACY.md
/diagrams/data-flow.mmd
/diagrams/screen-flow.mmd
/favicon.svg
/golden-case.html
/guide.css
/partner.html
/ratgeber/
/ratgeber/abrechnungsfrist-nebenkosten.html
/ratgeber/betriebskostenabrechnung-pruefen.html
/ratgeber/co2-kosten-mieter-vermieter.html
/ratgeber/fehler-nebenkostenabrechnung.html
/ratgeber/heizkostenabrechnung-pruefen.html
/ratgeber/index.html
/ratgeber/nebenkosten-widerspruch.html
/ratgeber/nebenkostenabrechnung-pruefen.html
/ratgeber/nebenkostenabrechnung-zu-hoch.html
/ratgeber/umlagefaehige-nebenkosten.html
/ratgeber/umlageschluessel-pruefen.html
/styles.css
```

## Absolute destinations — 18/18 returned 200

```text
https://github.com/Umliva/umliva.github.io
https://github.com/Umliva/umliva.github.io/wiki
https://github.com/Umliva/umliva.github.io/wiki/Privacy-Model
https://umliva.github.io/
https://umliva.github.io/assets/img/og-image.png
https://umliva.github.io/golden-case.html
https://umliva.github.io/partner.html
https://umliva.github.io/ratgeber/
https://umliva.github.io/ratgeber/abrechnungsfrist-nebenkosten.html
https://umliva.github.io/ratgeber/betriebskostenabrechnung-pruefen.html
https://umliva.github.io/ratgeber/co2-kosten-mieter-vermieter.html
https://umliva.github.io/ratgeber/fehler-nebenkostenabrechnung.html
https://umliva.github.io/ratgeber/heizkostenabrechnung-pruefen.html
https://umliva.github.io/ratgeber/nebenkosten-widerspruch.html
https://umliva.github.io/ratgeber/nebenkostenabrechnung-pruefen.html
https://umliva.github.io/ratgeber/nebenkostenabrechnung-zu-hoch.html
https://umliva.github.io/ratgeber/umlagefaehige-nebenkosten.html
https://umliva.github.io/ratgeber/umlageschluessel-pruefen.html
```

## Deliberate disclosure boundary

The site does not link to `impressum.html` or `datenschutz.html` as completed legal pages. Direct GET requests to `https://umliva.github.io/impressum.html` and `https://umliva.github.io/datenschutz.html` returned `404`; the footer continues to show `LEGAL_DISCLOSURE_OWNER_DATA_REQUIRED`. The linked `PRIVACY.md` (200) contains privacy principles, not completed provider/privacy disclosures. The linked Wiki destinations return 200, but the deployed Wiki is still English; PR #10's German patch is not published.

The PR #10 source tree has no broken internal or external link destinations. This destination audit does not claim that its unmerged German/layout changes are deployed; public main remains at the SHA above.

## Linked Wiki destination audit

The public Wiki was read directly from `Umliva/umliva.github.io.wiki` on 2026-10-15. `git ls-remote origin HEAD refs/heads/master` returned `4e4fac4a5e8c344106eb0363c317eddc0479ecf6` for both refs. The PR #10 translation patch modifies all eight existing tracked Wiki pages (`Architecture.md`, `FAQ.md`, `Home.md`, `Privacy-Model.md`, `Product-Principles.md`, `Release-Philosophy.md`, `Roadmap.md`, and `Verification-Model.md`), with 49 insertions and 49 deletions, and adds a German `_Sidebar.md`; the patch remains unpublished. The Home page and custom sidebar use German link text with explicit Wiki destinations. GitHub documents this Markdown link form as `[Link Text](full-URL-of-wiki-page)` ([GitHub Wiki link documentation](https://docs.github.com/en/communities/documenting-your-project-with-wikis/editing-wiki-content)); a custom `_Sidebar.md` supplies the Wiki sidebar ([GitHub sidebar documentation](https://docs.github.com/en/communities/documenting-your-project-with-wikis/creating-a-footer-or-sidebar-for-your-wiki)).

Patch artifact SHA-256: `d31c444b0de8f2df9f48c98119a8e7b58d6d3cf2fd41f8b7e9082df1e56731b4` (`WIKI-GERMAN-PATCH.patch`).

Extracting Markdown links from all eight current Wiki pages, their local translated versions, and the proposed sidebar found nine unique destinations: the Wiki home, seven linked Wiki pages, and the Umliva site root. All nine returned HTTP 200 on 2026-10-15. This verifies destination availability only; it does not treat the currently deployed English Wiki as localized or publish the pending translation.
