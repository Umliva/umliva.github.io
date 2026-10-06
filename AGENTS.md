# AGENTS.md — Umliva public website contract

## Identity

- Canonical repository: `Umliva/umliva.github.io`
- Deployment: static GitHub Pages, published from `main`
- Public URL: `https://umliva.github.io`
- Git root = repository root (this directory).

## Root / layout

Static site, no build step, no backend:

- Root: `index.html`, `golden-case.html`, `partner.html`, `sitemap.xml`, `robots.txt`, `favicon.svg`, `styles.css`, `guide.css`, `.nojekyll`
- `ratgeber/`: bounded German-language guide pages (`index.html` + topic pages)
- `diagrams/`: Mermaid sources (`screen-flow.mmd`, `data-flow.mmd`), rendered client-side on `index.html`
- Verification scripts: `verify-site.mjs`, `verify-sanitization.mjs`

## Public / private boundary

- This is a **public** repository. Only sanitized, non-personal content may be committed.
- Real case data, original documents, personal bills, names, addresses, account identifiers, contact details, credentials and signing material stay private and must never be committed.
- No secrets or private case data, ever.

## Static verification

Run before merge (all local):

```bash
node verify-site.mjs
node verify-sanitization.mjs
# local serve check:
python3 -m http.server 8000   # then open http://localhost:8000
```

## Sanitization rules

- Allowed: synthetic structure tokens only (`P-01`, `S-A`, `S-B`, `D-01`, `R-01`, `F-001` … `F-004`, `C-001`).
- Forbidden: currency amounts, calendar dates, email addresses, phone numbers, IBANs, account/case identifiers, real names, addresses, contract parties.
- No legal outcome claims. The site describes a deterministic billing checker, not individualized legal advice.
- Human-in-the-loop: attorney responsibility remains with a human; no automatic legal guarantee or success forecast.

## Mutation scope

- Allowed: static HTML/CSS, diagrams, Markdown, and the verification scripts in this repository.
- No backend, no runtime, no generated-site framework. Keep it a static GitHub Pages site.

## Hard rules

- `NO_NESTED_PROJECT_ROOT`: do not create or use a nested/shadow copy of this repository inside itself.
- **Merge First governance**: changes reach `main` only via a reviewed PR merge; GitHub Pages publishes from `main`. No direct pushes to `main`, no force-push, no unreviewed merge.
- **Headed visual verification**: before merge, visually verify the changed pages in a real browser at desktop and mobile widths (responsive breakpoints) and record the observation.
