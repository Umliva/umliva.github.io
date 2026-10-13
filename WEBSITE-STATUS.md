# Website-Status

Diese Datei hält fest, wo das Projekt steht. Der Skill `website-bauen` liest sie bei jedem Aufruf und macht dort weiter.

Status: ✅ erledigt · 🔄 läuft · ⬜ offen

Hinweis: Umliva ist eine **bestehende** statische GitHub-Pages-Seite (kein Neubau). Der Skill wurde am 2026-10-10 projektlokal installiert und als Audit- und Verbesserungslauf auf die bestehende Seite angewendet. Die Phasen 0–5 beschreiben diesen historischen Inhalts- und Gestaltungsstand; die Live- und Prüfangaben darunter wurden am 2026-10-13 erneut gelesen.

## Aktueller Live-Readback — 2026-10-13

- Öffentlicher Quellstand: `main` bei `3943d3cd435abb5faf84e1acd462c7dbc18b3354`.
- GitHub-Pages-Deployment `6982852365` für diesen Stand: `success`, veröffentlicht unter `https://umliva.github.io/`.
- HTTP-Readback: Startseite, `golden-case.html` und `partner.html` antworten mit `200`.
- Aktuelle sichtbare Desktop-/Mobilprüfung: `NOT_RUN`; in dieser Umgebung war keine steuerbare Browseroberfläche verfügbar. Frühere Sichtprüfungen vom 2026-10-10 bleiben historische Belege.
- `impressum.html` und `datenschutz.html` antworten mit `404`. Die Fußzeilen nennen den Impressumsplatzhalter `LEGAL_DISCLOSURE_OWNER_DATA_REQUIRED`; Anbieter- und Verantwortlichendaten fehlen weiterhin. Die vorhandenen Datenschutz-Grundsätze und das Datenschutz-Modell sind davon getrennte Inhalte.
- Die veröffentlichten Seiten kennzeichnen Umliva weiterhin als in Entwicklung. Es gibt keinen Release- oder Produktionsverfügbarkeitsanspruch.
- Am Quellstand `3943d3cd435abb5faf84e1acd462c7dbc18b3354` bestanden `node verify-site.mjs`, `node verify-sanitization.mjs`, `node tools/verify-german.mjs`, `node tools/verify-agent-project-contract.mjs`, die Contract-Fixtures und der Host-Audit. Der Host-Audit endete mit `PASS=7`, `FAIL=0`, `NOT_VERIFIED=4`.

| Phase | Name | Status | Datum |
|---|---|---|---|
| 0 | Einrichten | ✅ (Skill projektlokal installiert) | 2026-10-10 |
| 1 | Fundament | ✅ (bestehend; Marke dokumentiert in `docs/design/UMLIVA_MARKENBILD.md`) | 2026-10-10 |
| 2 | Recherche | ⬜ (optionale Suchworttiefe nicht erhoben; kein kostenpflichtiger DataForSEO-Dienst eingerichtet) | 2026-10-13 |
| 3 | Texte | ✅ (Audit gegen `.agents/skills/website-bauen/schreibregeln.md`: Gedankenstriche, Duzen-Ausreißer, Zählfehler behoben) | 2026-10-10 |
| 4 | Design-Richtung | ✅ (bestehendes Markensystem, gemessen mit `werkzeuge/marke_auslesen.py`, kein Drift) | 2026-10-10 |
| 5 | Bauen | ✅ (OG-Vorschaubild + Tags, JSON-LD, llms.txt, Diagramm-Präsentation) | 2026-10-10 |
| 6 | Prüfen und Feinschliff | ✅ (historische visuelle Prüfdurchgänge vom 2026-10-10; kein aktueller Sichtnachweis) | 2026-10-10 |
| 7 | Livegang | ✅ (GitHub-Pages-Deployment erfolgreich; HTTP-Readback für die drei geprüften Seiten am 2026-10-13) | 2026-10-13 |
| 8 | Danach | ⬜ (optionale Suchprofile nicht eingerichtet; aktuelle Sichtprüfung und Betreiberangaben stehen aus) | 2026-10-13 |

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
- Eine aktuelle Desktop- und Mobilansicht mit einer steuerbaren Browseroberfläche prüfen und den Sichtnachweis dokumentieren.
- Suchwortanalyse und Suchprofile sind optional und bleiben ohne kostenpflichtige Dienste aufgeschoben.

## Update-Ablauf nach dem Livegang

1. Änderung im Repo (statische Dateien, kein Build-Schritt)
2. Verifizierung: `node verify-site.mjs && node verify-sanitization.mjs && node tools/verify-german.mjs && node tools/verify-agent-project-contract.mjs`
3. Visuell: `.agents/skills/website-bauen/werkzeuge/pruefen.py http://127.0.0.1:8000/` (lokal servieren mit `python3 -m http.server 8000`)
4. Merge nur per reviewtem PR; GitHub Pages veröffentlicht aus `main`
