# Live readback — OCR promise boundary

Date: 2026-10-17
Canonical `main`: `09975bf0ad1b6727bf4faf627fde423a3fc83d0c` (merge of PR #19).
Pages build: `built` for exactly that commit.

- `GET https://umliva.github.io/` returned `200` with 16,101 bytes.
- The live page contains “automatische Texterkennung für Bild- und
  Scan-Dokumente” inside `#v1-umfang`.
- Headed Chrome at 1366×900, 390×844 and 320×844: 3/3 PASS, 16 scope list
  items, no horizontal overflow, no console errors.
