# Billing network permission in the privacy notice — 2026-10-17

The app release manifest contains `INTERNET` and `ACCESS_NETWORK_STATE` through
Play Billing 8.0.0 (`transport-backend-cct`). The privacy page already described
the optional Play purchase, but did not name the permissions.

Change: the “Kauf einer Vollversion” section now states that the app holds
`INTERNET` and `ACCESS_NETWORK_STATE` for the optional purchase path, while core
checking, import, local storage and exports perform no network request.

No other promise changed. The page still says the app is not in Play, no tracking
is used on the site, and no complete-coverage or accuracy claim is made.

## Verification

```text
node verify-site.mjs                  PASS
node verify-sanitization.mjs          PASS
node tools/verify-german.mjs          PASS
node tools/verify-agent-project-contract.mjs --target datenschutz.html PASS
git diff --check                      PASS
```

Headed Chrome (Playwright, `DISPLAY=:0`) on the local candidate at 1366×900,
390×844 and 320×844: HTTP 200, one `h1`, no horizontal overflow, no console
errors, and the permission sentence present. Results: `headed-check.json`;
screenshots `datenschutz-desktop.png`, `datenschutz-mobile.png`,
`datenschutz-narrow.png`.

Deployment follows the reviewed merge and Pages build.
