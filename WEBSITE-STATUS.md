# Website-Status

Diese Datei hält fest, wo das Projekt steht. Der Skill `website-bauen` liest sie bei jedem Aufruf und macht dort weiter.

Status: ✅ erledigt · 🔄 läuft · ⬜ offen

Hinweis: Umliva ist eine **bestehende** statische GitHub-Pages-Seite (kein Neubau). Der Skill wurde am 2026-10-10 projektlokal installiert und als Audit- und Verbesserungslauf auf die bestehende Seite angewendet. Die Phasen 0–5 beschreiben diesen historischen Inhalts- und Gestaltungsstand; Live-, Sicht- und Prüfangaben unten sind auf den 2026-10-17 datiert.

## Aktueller Live-Readback — 2026-10-17

- Zeitgebundener Readback vom 2026-10-17, 08:22–08:27 UTC: Öffentlicher `main` stand bei `8d22485f6d1314c4a3d2cec9285cfba46191676c`, dem Merge-Commit von PR #10 (Eltern: `3943d3cd435abb5faf84e1acd462c7dbc18b3354` und `cba9559e803a1cc6c72ddb158ff9ab9ed9cd23bb`).
- GitHub-Pages-Workflow [39017085117](https://github.com/Umliva/umliva.github.io/actions/runs/39017085117) und Pages-Deployment `7136981367` für exakt diesen Commit: `success`, Umgebung `https://umliva.github.io/`.
- HTTP-Readback: `/`, `/golden-case.html`, `/partner.html` und `/PRIVACY.md` antworten mit `200`; `/impressum.html` und `/datenschutz.html` antworten mit `404`.
- Sichtprüfung `PASS`: sichtbares, headed Playwright-MCP-Chrome `153.0.8010.36` prüfte die drei Seiten bei 1366×900 und 390×844 sowie die Startseite zusätzlich bei 320×844. Die Überschrift hält „Nebenkostenabrechnung“ zusammen; die Dokumentbreiten stimmen überein; das deutsche Sicherheitslabel im Referenzfall und die menschliche Verantwortung auf der Partnerseite sind sichtbar. Messungen, URLs und Screenshots stehen in `docs/evidence/MISSION-2026-10-17/PR10-DEPLOYMENT-READBACK.md`.
- Das bestehende Browserprofil hielt nach dem Deploy noch eine vorher geladene, unversionierte CSS-Datei mit `max-age=600` im Cache. Ein Commit-Query bestätigte unmittelbar den aktualisierten CSS-Inhalt und seinen SHA-256. Nach Ablauf des Cache-Eintrags wurden die kanonischen URLs ohne Query erneut geöffnet; sie zeigten dieselbe aktuelle Überschrift und das deutsche Sicherheitslabel. Die dokumentierten Screenshots stammen aus diesem Readback.
- Die Fußzeilen behalten `LEGAL_DISCLOSURE_OWNER_DATA_REQUIRED`; Anbieter- und Verantwortlichendaten fehlen weiterhin. Es wurden keine Angaben erfunden. Datenschutz-Grundsätze und Datenschutz-Modell sind getrennte Inhalte.
- Die veröffentlichten Seiten kennzeichnen Umliva als in Entwicklung. Dieser Readback behauptet weder V1-Freigabe noch Produktionsverfügbarkeit.
- Am PR-#10-Head `cba9559e803a1cc6c72ddb158ff9ab9ed9cd23bb` bestanden die lokalen Site-, Sanitization-, Deutsch-, Fixture- und Contract-Gates; GitHub Actions lief für exakt diesen Head erfolgreich. Der Host-Audit endete mit `PASS=7`, `FAIL=0`, `NOT_VERIFIED=4`.
- Dieser Readback identifiziert den veröffentlichten Seiteninhalt mit PR #10. PR #9 ändert nur Status- und Evidence-Dokumentation; seine spätere Änderung des Main-SHA ist daher kein neuer Website-Inhalt. Für einen späteren Pages-Lauf zu einem Dokumentations-Merge wird hier keine Deployment-ID behauptet.
| Phase | Name | Status | Datum |
|---|---|---|---|
| 0 | Einrichten | ✅ (Skill projektlokal installiert) | 2026-10-10 |
| 1 | Fundament | ✅ (bestehend; Marke dokumentiert in `docs/design/UMLIVA_MARKENBILD.md`) | 2026-10-10 |
| 2 | Recherche | ⬜ (optionale Suchworttiefe nicht erhoben; kein kostenpflichtiger DataForSEO-Dienst eingerichtet) | 2026-10-13 |
| 3 | Texte | ✅ (Audit gegen `.agents/skills/website-bauen/schreibregeln.md`: Gedankenstriche, Duzen-Ausreißer, Zählfehler behoben) | 2026-10-10 |
| 4 | Design-Richtung | ✅ (bestehendes Markensystem, gemessen mit `werkzeuge/marke_auslesen.py`, kein Drift) | 2026-10-10 |
| 5 | Bauen | ✅ (OG-Vorschaubild + Tags, JSON-LD, llms.txt, Diagramm-Präsentation) | 2026-10-10 |
| 6 | Prüfen und Feinschliff | ✅ (historische Prüfung plus aktueller headed Readback; siehe Evidence vom 2026-10-17) | 2026-10-17 |
| 7 | Livegang | ✅ (PR #10 auf Pages deployed; HTTP- und headed Readback am 2026-10-17) | 2026-10-17 |
| 8 | Danach | ⬜ (optionale Suchprofile nicht eingerichtet; Betreiberangaben und Rechtsprüfung stehen aus) | 2026-10-17 |

## Ausgangslage

- Bestehende Website oder Marke: https://umliva.github.io (statisch, GitHub Pages, veröffentlicht aus `main`)
- Hauptziel der Seite: Nebenkosten- und Heizkostenabrechnungen prüfen; deterministischer Prüfungsansatz nachvollziehbar erklären; Ratgeber für Suchanfragen
- Hosting: GitHub Pages (`Umliva/umliva.github.io`), kein Build-Schritt
- Werkzeuge: impeccable ⬜ (nicht verfügbar) · Playwright ✅ · DataForSEO ⬜ · Hosting-MCP ⬜ (nicht nötig, GitHub Pages) · Formular-Ziel ⬜ (keine Formulare auf der Seite)

## Marke

Gemessen (Startseite, `werkzeuge/marke_auslesen.py`, 2026-10-10) — deckungsgleich mit `docs/design/UMLIVA_MARKENBILD.md`:

| Rolle | Wert |
|---|---|
| Hauptfarbe | `#003B46` (Petrol dunkel), Flächen/Schaltflächen `#005B6B` |
| Akzent | `#8A3B1F` (warm, Pfeile/Nummern/Fokus) |
| helle Fläche | `#FAF7F1` (Seite), `#FFFFFF` (Karten) |
| Text | `#14201E`, Sekundär `#3D5450` |
| Überschriften | Inter 700/800 |
| Fließtext | Inter 400, 17–18 px |
| Merkmale | Drei Ergebnisstufen mit Zeichen + Wort („!“/„?“/„○“), kaum Schatten, klare Linien |

## Entscheidungen

- 2026-10-10: Die damalige Arbeitsbasis war der Branch `design/umliva-pruefwerkzeug-20261007`; PR #8 wurde am 2026-10-10 in `main` integriert. Diese Angabe beschreibt den damaligen Lauf, nicht eine noch ausstehende Veröffentlichung.
- 2026-10-10: Skill nur projektlokal (`.agents/skills/website-bauen`), im Vertrag unter `skillIsolation.repoSkillRoots` deklariert; `/.agents/` ist keine veröffentlichte Fläche (verify-site-Ausschluss, robots-Disallow).
- 2026-10-10: Strukturierte Daten nur mit belegbaren Angaben (keine Autorinnen, Daten, Bewertungen); Impressum bleibt der ehrliche Platzhalter `LEGAL_DISCLOSURE_OWNER_DATA_REQUIRED`.
- 2026-10-13: Öffentlichen Quellstand, Pages-Deployment und HTTP-Antworten erneut gelesen. Das belegt Erreichbarkeit, aber keine aktuelle visuelle Prüfung.

## Offene Fragen an die Person

- Verifizierte Anbieter- und Verantwortlichendaten für Impressum und Datenschutz sowie die erforderliche rechtliche Prüfung bereitstellen. Der Fußzeilenplatzhalter `LEGAL_DISCLOSURE_OWNER_DATA_REQUIRED` bleibt bestehen, bis diese Angaben vorliegen.
- Suchwortanalyse und Suchprofile sind optional und bleiben ohne kostenpflichtige Dienste aufgeschoben.
## Update-Ablauf nach dem Livegang

1. Änderung im Repo (statische Dateien, kein Build-Schritt)
2. Verifizierung: `node verify-site.mjs && node verify-sanitization.mjs && node tools/verify-german.mjs && node tools/verify-agent-project-contract.mjs`
3. Visuell: `.agents/skills/website-bauen/werkzeuge/pruefen.py http://127.0.0.1:8000/` (lokal servieren mit `python3 -m http.server 8000`)
4. Merge nur per reviewtem PR; GitHub Pages veröffentlicht aus `main`
