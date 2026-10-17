# Public PR #10 headed visual and solo review — 2026-10-17

Repository: `Umliva/umliva.github.io`
PR: [#10](https://github.com/Umliva/umliva.github.io/pull/10)
Base/main SHA: `3943d3cd435abb5faf84e1acd462c7dbc18b3354`
Exact code source SHA inspected: `cd38cbde233942f90bab8af8fe306ec1d042ee67`
Candidate parent: `4721d3691e8a7d5a82dfe8bbbec397a5ceb5b801`
The candidate is based on the stated main (`git merge-base` = base SHA); 16 commits ahead, 0 behind.

Browser: Playwright MCP, headed visible Chrome `153.0.8010.36` (UA `Chrome/153.0.8010.36`); `document.visibilityState=visible`.
Local preview: Python `3.12.3` static server at `http://127.0.0.1:8000`, serving the isolated PR worktree at the exact code source SHA above.
Node: `v22.22.0`.

## Visual results

All screenshots below are viewport captures in CSS pixels and were visually inspected. The public live screenshots are the pre-merge deployment at main SHA `3943d3cd435abb5faf84e1acd462c7dbc18b3354`; local screenshots are the exact PR #10 source SHA `cd38cbde233942f90bab8af8fe306ec1d042ee67`.

Before merge, the live site showed the defect being fixed: the homepage heading split “Nebenkostenabrechnung” at 1366×900 and 390×844; at 320×844 the word split and `scrollWidth=319` versus `clientWidth=305` (14 CSS px overflow). The live golden-case badge still used English. These are baseline observations, not claims about the candidate or deployed result.

On the local candidate:

- Homepage heading word occupied one rendered line at 1366×900, 390×844, and 320×844.
- Homepage, golden-case, and partner page document widths matched at 1366×900 (`1351/1351`) and 390×844 (`375/375`); the 320×844 homepage matched (`305/305`).
- The visible golden-case badge reads “Synthetischer Strukturfall · keine Originalfalldaten · keine Aussage zum Rechtsergebnis.”
- The partner page visibly says individual legal advice and representation remain with a human. The homepage retains “Keine Garantie” and the human-decision boundary.
- Desktop header links and mobile CTAs were clicked through homepage → golden case → partner page on both the live site (pre-merge) and local preview. Destinations and page headings matched. At mobile widths, header navigation links are hidden by the existing responsive CSS; the page CTAs and footer links remain available.
- The legal/provider placeholder remains visible as `LEGAL_DISCLOSURE_OWNER_DATA_REQUIRED`. Direct live requests returned 404 for `/impressum.html` and `/datenschutz.html`; `/PRIVACY.md` returned 200. No legal or provider data was invented.

### Screenshot index and SHA-256

| Page / source | Viewport | Screenshot | SHA-256 |
| --- | --- | --- | --- |
| Live main / | 1366×900 | `pr10-live-pre-home-1366x900.png` | `61458e176096e9e75bd68e7d773a364a37bdbba92089edcf2ead5ff8c50438ce` |
| Live main / | 390×844 | `pr10-live-pre-home-390x844.png` | `ebfd21aa105f6fd85e62f13477466237ad0187463c02dbd6ba8991187a01559d` |
| Live main / | 320×844 | `pr10-live-pre-home-320x844.png` | `e55a4bf7fad412abcaf302c52b61a91bfa08aaa259245edb2bd8813d7660adfd` |
| Live main /golden-case.html | 1366×900 | `pr10-live-pre-golden-1366x900.png` | `16bdfdfd964856877b5dbd71f1c01546ac9c9e0861cd2610fbe104683e118f6b` |
| Live main /golden-case.html | 390×844 | `pr10-live-pre-golden-390x844.png` | `20a09821ccc167c5ba8de6b3dcc3d2ac57722ee2036c1106f3aa54ca288b5d42` |
| Live main /partner.html | 1366×900 | `pr10-live-pre-partner-1366x900.png` | `80eb647bd76ad5b1d8f91bd5b67a2b6069d2407222cf029a49fcae5e4820e9e1` |
| Live main /partner.html | 390×844 | `pr10-live-pre-partner-390x844.png` | `0e90c765d1c048508f8e0532917cbaf6274c44bc7a9679db326a03f1dde10e16` |
| PR #10 / | 1366×900 | `pr10-local-home-1366x900.png` | `29476d54f56209d0a099e388a150c6321974df7d20e35161e76d87483723b11b` |
| PR #10 / | 390×844 | `pr10-local-home-390x844.png` | `4c6e73fea41cff9a4cb2c71f6b1dc4a26200929a73b499049ae0bd4ef40f2629` |
| PR #10 / | 320×844 | `pr10-local-home-320x844.png` | `ccff4982b3519756a2bf4802a5ee1222da48b2a956f8340a892c4d9dd2011fe9` |
| PR #10 /golden-case.html | 1366×900 | `pr10-local-golden-1366x900.png` | `1aa9d59a98cf18fb63aed4490182a0a3f1dd205b4719b94cbaac311001aa8326` |
| PR #10 /golden-case.html | 390×844 | `pr10-local-golden-390x844.png` | `95b265fb3905079b6cc9aaefa36c08e85c7dbda38ac828543ec4d856ef4f7f97` |
| PR #10 /partner.html | 1366×900 | `pr10-local-partner-1366x900.png` | `80eb647bd76ad5b1d8f91bd5b67a2b6069d2407222cf029a49fcae5e4820e9e1` |
| PR #10 /partner.html | 390×844 | `pr10-local-partner-390x844.png` | `0e90c765d1c048508f8e0532917cbaf6274c44bc7a9679db326a03f1dde10e16` |

The partner pages are unchanged by PR #10, so their pre-merge live and exact-tree local screenshot hashes match.

## Local and remote checks

Fresh local runs at the exact code source SHA `cd38cbde233942f90bab8af8fe306ec1d042ee67`:

- `node verify-site.mjs` — PASS (14 HTML files, 18 required assets/pages).
- `node verify-sanitization.mjs` — PASS (2 pages, 6 prohibited-data patterns).
- `node tools/verify-german.mjs` — PASS (16 files, 41 terms, 0 hits).
- `node tools/verify-german-fixtures.mjs` — PASS (English badge rejected; German wording accepted).
- `node tools/verify-agent-project-contract.mjs` — PASS (14 checks).
- `node tools/run-agent-project-contract-fixtures.mjs` — PASS (29 cases, 38 steps, 0 mismatches).
- `bash tools/audit-agent-project-contract-host.sh` — PASS; 7 PASS, 0 FAIL, 4 NOT_VERIFIED (host-only scope/tooling limits).
- `git diff --check` — PASS for the run's evidence changes. Earlier evidence hard-breaks and context lines in the embedded Wiki diff were normalized; the Wiki artifact remains semantically identical and applies with `git apply --unidiff-zero` to its recorded source SHA. The full PR-range check is rerun after this evidence commit.

GitHub Actions did run for the original exact PR code SHA: [Website PR checks run 38822931634](https://github.com/Umliva/umliva.github.io/actions/runs/38822931634), SUCCESS. It ran site structure/links, sanitization, German-language rules and fixture, project-contract validator, and project-contract fixtures. The workflow is pull-request-only with `contents: read`; it does not deploy Pages or perform headed visual, host audit, or legal review.

## Solo maintainer adversarial review

Classification: `SOLO_MAINTAINER_AI_REVIEW` — PASS. This was a fresh adversarial review by the solo maintainer AI; it is not independent and no GitHub self-review was submitted. No peer reviewer was available.

The complete PR diff, workflow permissions/action pins, HTML wording, responsive CSS, German-copy rules/fixture, safety/sanitization checks, evidence, and Wiki artifact were reviewed against the requested scope. No concrete P0/P1 finding remains. The targeted copy is localized; the example remains synthetic and disclaims original case data and legal outcome; the mobile and desktop heading fix is visible; no horizontal page overflow remains in the exact-tree viewports; and the PR does not add or publish legal/provider disclosures. The Pages source remains main, so the Wiki patch is only an artifact and is not published by this PR.

The legal/provider disclosures remain unresolved; this review does not claim legal approval or Umliva V1 release readiness.
