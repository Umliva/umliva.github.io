# Live readback — legal publication surface

Date: 2026-10-17
Canonical `main`: `7e60bc712e80fba3289e72f62ac0a393d0fee98f` (merge of PR #11)
Pages build: `39047929876`, status `built`, commit `7e60bc7…`
URL examined: `https://umliva.github.io` with `?deploy=7e60bc712e80…` on every request.

## HTTP readback

| URL | Status | Bytes |
|---|---|---|
| `/` | 200 | 13826 |
| `/impressum.html` | 200 | 5331 |
| `/datenschutz.html` | 200 | 9150 |
| `/sitemap.xml` | 200 | 1390 |

Both new pages are present in `sitemap.xml`. The token
`LEGAL_DISCLOSURE_OWNER_DATA_REQUIRED` no longer appears in any published HTML
page.

## Headed browser readback

A real Chrome window (Playwright headed, `DISPLAY=:0`) loaded the live site at
1366×900, 390×844 and 320×844 for `/`, `/impressum.html`,
`/datenschutz.html`, `/partner.html`, `/golden-case.html` and `/ratgeber/`.

```text
pages_checked=18
internal_links_checked=55
problems=0
```

Checks: HTTP 200, exactly one `h1`, title/description/canonical present,
no horizontal overflow, no console errors, no failed requests, skip-link target
present, footer legal links present, every internal target resolves.

Machine-readable result: `headed-verification-live.json`.
Screenshots: one full-page PNG per page and viewport.

## Remaining blocker

The Impressum is structurally complete but not a legally complete provider
identification. The verified operator identity is still missing and is marked
as open in the page. No identity data was invented.
