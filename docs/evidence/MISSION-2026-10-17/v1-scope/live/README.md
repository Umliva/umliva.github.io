# Live readback — V1 promise boundary

Date: 2026-10-17
Canonical `main`: `243644ed3e43b4d8fe1d77b44d5ad5623ad5bdf6` (merge of PR #13)
Pages build: status `built` for exactly that commit.
URL: `https://umliva.github.io` with a deploy query on every request.

## HTTP readback

- `/` returned 200 with 16,025 bytes (previous deployed page: 13,826 bytes).
- The live page contains `In V1 ausdrücklich nicht geprüft`,
  `Heizkosten- und CO₂-Verteilung`, the new `Betriebskostenabrechnung prüfen`
  title and the `#v1-umfang` section.
- `/sitemap.xml` returned 200.

## Headed browser readback

Real Chrome window (Playwright headed, `DISPLAY=:0`) at 1366×900, 390×844 and
320×844 across `/`, `/impressum.html`, `/datenschutz.html`, `/partner.html`,
`/golden-case.html` and `/ratgeber/`:

```text
pages_checked=18
internal_links_checked=55
problems=0
```

Checks: HTTP 200, one `h1`, title/description present, no horizontal overflow,
no console errors, no failed requests, all internal links resolve, the scope
section exists with at least ten excluded items and names the heating/CO₂ gap.

Machine result: `headed-verification.json`; screenshots for the homepage at all
three viewports.

## Closure state

The public website now matches the canonical V1 coverage scope and no longer
promises heating-cost or complete legal checking. The missing operator identity
for Impressum/Datenschutz remains a separate irreducible release blocker.
