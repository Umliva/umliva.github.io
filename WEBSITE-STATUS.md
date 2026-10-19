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

## Legalfläche — Kandidat 2026-10-17

- `impressum.html` und `datenschutz.html` sind als vollständige Seiten angelegt und aus allen Fußzeilen verlinkt. Der rohe Platzhalter `LEGAL_DISCLOSURE_OWNER_DATA_REQUIRED` ist damit aus den veröffentlichten Seiten entfernt.
- Die Betreiber- und Verantwortlichenangaben fehlen weiterhin. Sie sind im Impressum als offene Pflichtfelder markiert und wurden nicht erfunden; die Datenschutzseite benennt die verantwortliche Stelle entsprechend allgemein. Das bleibt ein Release-Blocker für die rechtliche Veröffentlichung.
- Die Datenschutzseite beschreibt den tatsächlichen Stand: GitHub-Pages-Hosting, jsDelivr für Mermaid, keine Analyse/Werbung/Formulare, lokale App-Verarbeitung, verschlüsselte Speicherung, deaktivierte Cloud-Sicherung, kein aktiver Telemetrie-Kanal und der bedingte Google-Play-Kaufpfad.
- Lokale Gates und sichtbare Prüfung im headed Chrome (1366×900, 390×844, 320×844) sind bestanden. Evidence: `docs/evidence/MISSION-2026-10-17/legal-pages/`.
- Deployment: PR #11 wurde als `7e60bc712e80fba3289e72f62ac0a393d0fee98f` auf `main` gemergt; der Pages-Build meldet `built` für exakt diesen Commit. `/impressum.html` und `/datenschutz.html` antworten live mit `200`.

## Live-Readback Legalfläche — 2026-10-17

- `main` = `7e60bc712e80fba3289e72f62ac0a393d0fee98f` (Merge PR #11). Pages-Build `39047929876` Status `built`, Commit identisch.
- HTTP: `/`, `/impressum.html`, `/datenschutz.html`, `/sitemap.xml` = `200`; beide neuen Seiten sind im Sitemap enthalten. Der frühere Rohplatzhalter `LEGAL_DISCLOSURE_OWNER_DATA_REQUIRED` kommt in keiner veröffentlichten HTML-Seite mehr vor.
- Sichtprüfung im headed Chrome gegen die Live-Domain mit Deploy-Query: 18/18 Seite/Viewport-Kombinationen, 55/55 interne Links, kein waagerechter Überlauf, keine Konsolenfehler, keine fehlgeschlagenen Requests. Screenshots und JSON unter `docs/evidence/MISSION-2026-10-17/legal-pages/live/`.
- Betreiberdaten fehlen weiterhin. Das Impressum markiert Name, Anschrift, Kontakt, Vertretung/Register/USt-IdNr., Verantwortliche Person nach § 18 MStV und Streitbeilegungsstatus als offen. Das ist ein irreduzibler Blocker für die rechtliche Endveröffentlichung, kein erledigter Punkt.

## V1-Versprechensgrenze — 2026-10-17

- Der kanonische App-Prüfumfang (`Umliva/Umliva` `docs/V1_COVERAGE_SCOPE.md`, `main` `0f4dca4452…`) ist auf die Website übertragen: Titel, Meta/OG/JSON-LD und Hero nennen jetzt ausdrücklich den geprüften Rechenweg und die nicht geprüften Bereiche.
- Neue Sektion `#v1-umfang` (`data-v1-scope="declared"`) listet die geprüften Punkte und elf ausdrücklich nicht geprüfte Familien. `llms.txt` trägt dieselbe Grenze. Bild- und Scan-Dokumente ohne eingebetteten Text sind ausdrücklich als nicht automatisch ausgelesen genannt.
- `verify-site.mjs` erzwingt die Sektion und die Nicht-Abdeckungsformulierung, damit die Zusage nicht still zurück auf vollständige Abdeckung driftet.
- Lokale Gates und headed Chrome (1366×900, 390×844, 320×844) sind bestanden; Evidence unter `docs/evidence/MISSION-2026-10-17/v1-scope/`.
- Deployment: PR #13 wurde als `243644ed3e43b4d8fe1d77b44d5ad5623ad5bdf6` auf `main` gemergt; Pages meldet `built` für exakt diesen Commit. Live enthält `/` die neue Sektion, den neuen Titel und die Nicht-Abdeckungsliste (`200`, 16.025 Bytes).

## Live-Readback V1-Versprechensgrenze — 2026-10-17

- Live `main` = `243644ed3e43b4d8fe1d77b44d5ad5623ad5bdf6`; Pages-Build `built`; `/` und `/sitemap.xml` antworten `200`.
- Sichtprüfung im headed Chrome gegen die Live-Domain: 18/18 Seite/Viewport-Kombinationen, 55/55 interne Links, kein Überlauf, keine Konsolenfehler. Die neue Sektion `#v1-umfang` ist sichtbar und nennt die Heizkosten-/CO₂-Lücke.
- Evidence: `docs/evidence/MISSION-2026-10-17/v1-scope/live/`.

## Datenschutz: Billing-Netzwerkberechtigungen — 2026-10-17

- `datenschutz.html` nennt jetzt die Android-Berechtigungen `INTERNET` und `ACCESS_NETWORK_STATE`, die über Google Play Billing in das Release-Manifest gelangen. Kernprüfung, Import, lokale Speicherung und Exporte führen weiterhin keine Netzwerkanfrage aus.
- PR #15 wurde als `8ac5b64afbc85667d9b751cc3c3ecf10a5e62430` gemergt; Pages meldet `built`. Live `200`, 9.348 Bytes, Satz vorhanden. Evidence: `docs/evidence/MISSION-2026-10-17/billing-privacy/live-readback.md`.

## Live-Readback OCR-Grenze — 2026-10-17

- `main` = `09975bf0ad1b6727bf4faf627fde423a3fc83d0c` (PR #19). Pages meldet `built`; `/` antwortet `200` und enthält die OCR-Grenze in `#v1-umfang`.
- Sichtprüfung im headed Chrome bei 1366×900, 390×844 und 320×844: 3/3 bestanden, 16 Listeneinträge, kein Überlauf, keine Konsolenfehler. Evidence: `docs/evidence/MISSION-2026-10-17/ocr-boundary/live-readback.md`.

## Mobile Navigation — 2026-10-17

- `styles.css` und `guide.css` versteckten bei ≤800 px alle Kopfzeilen-Links. Die Navigation bricht jetzt unter der Marke um und bleibt auf 390 px und 320 px erreichbar; kein Skript, kein Overlay, unveränderte Linkziele.
- Sichtprüfung im headed Chrome über sechs Seiten und drei Breiten: 18/18 bestanden, alle Navigationslinks sichtbar, kein waagerechter Überlauf, keine Konsolenfehler. Evidence: `docs/evidence/MISSION-2026-10-17/mobile-nav/`.
- Deployment: PR #21 wurde als `912fd05d8ed1896798d2865336ccb9a1b1693d72` gemergt; Pages meldet `built`. Live-Check bei 390/320 px: 6/6 bestanden, alle Kopfzeilen-Links sichtbar. Evidence: `docs/evidence/MISSION-2026-10-17/mobile-nav/live-readback.md`.

## Datenschutz und fehlende OCR — 2026-10-17

- Die Datenschutzseite stellt klar, dass die automatische Texterkennung für Bild- und Scan-Dokumente in dieser V1-Version nicht enthalten ist und solche Dokumente nicht ausgelesen werden. Das entspricht der App-Meldung, der öffentlichen V1-Grenze und dem Release-Artefakt.
- Sichtprüfung im headed Chrome bei 1366/390/320 px: 3/3 bestanden, kein Überlauf, keine Konsolenfehler. Evidence: `docs/evidence/MISSION-2026-10-17/ocr-privacy/`.
- Deployment: PR #23 wurde als `23573fbf487dbf372d8c1b696d51a681fabfdea2` gemergt; Pages meldet `built`. Live `datenschutz.html` 200/9.494 Bytes mit der OCR-Abgrenzung. Evidence: `docs/evidence/MISSION-2026-10-17/ocr-privacy/live-readback.md`.

## Tastaturfokus und Skip-Link — 2026-10-17

- Alle 16 veröffentlichten HTML-Seiten haben jetzt `<main id="main-content" tabindex="-1">`, damit der Skip-Link den Tastaturfokus tatsächlich auf den Inhalt setzt.
- Sichtprüfung im headed Chrome bei 1366×900 und 390×844 über sieben Seiten: 14/14 bestanden; erster Tab fokussiert den Skip-Link, Enter setzt den Fokus auf `#main-content`. Evidence: `docs/evidence/MISSION-2026-10-17/keyboard-focus/`.
- Deployment: PR #25 wurde als `24be49ce6acda2e2355130c67d351538a2c37d01` gemergt; Pages meldet `built`. Live-Check bei 390/320 px: 6/6 bestanden, Skip-Link setzt den Fokus auf `#main-content`. Evidence: `docs/evidence/MISSION-2026-10-17/keyboard-focus/live-readback.md`.

## Impressum: 320-px-Überlauf — 2026-10-19

- Die sichtbare Prüfung im headed Chrome über alle 16 HTML-Seiten bei 1366×900, 390×844 und 320×844 fand genau einen Überlauf: `/impressum.html` hatte bei 320 px `scrollWidth=317` gegenüber `clientWidth=305`.
- Ursache war die Tabelle ohne Umbruchregel; `Umsatzsteuer-Identifikationsnummer` erzwang eine Mindestbreite von 301,38 px.
- Die minimale CSS-Änderung setzt `table-layout: fixed`, `width: 100%` und `overflow-wrap: anywhere`. Danach sind 48/48 Seite/Viewport-Kombinationen ohne Überlauf; 199 interne Links antworten mit 200, 23 Fragmentziele existieren.
- Evidenz: `docs/evidence/MISSION-2026-10-19/impressum-320/`.
- Deployment: PR #28 wurde als `e9ee950e8737e013691e0aa978f7c1b982140def` auf `main` gemergt; Pages-Run `39288423659` ist `success`. Live-Readback im headed Chrome: 48/48 Kombinationen ohne Überlauf, 199 interne Links mit `200`, 23/23 Fragmentziele vorhanden. Live `/impressum.html` bei 320 px: `scrollWidth=305`, `clientWidth=305`.
- Der Live-Readback belegt die statische Seite; die fehlenden Betreiberangaben und die Rechtsprüfung bleiben offen.

## Barrierefreiheit: axe WCAG A/AA — 2026-10-19

- Die headed Prüfung mit axe-core `4.10.2` über 16 Seiten bei 1366×900 und 390×844 fand vier ernste Befunde: nicht unterstrichene Footer-Links in `golden-case.html` (`link-in-text-block`) und zwei scrollbare Mermaid-Bereiche ohne Tastaturfokus (`scrollable-region-focusable`).
- Die Footer-Links sind jetzt unterstrichen; beide Mermaid-Bereiche haben `tabindex="0"`, `role="img"` und ein deutsches `aria-label`. Der bestehende Fokus-Ring gilt dadurch auch für sie; `ArrowRight` scrollt das fokussierte Diagramm.
- Nach der Korrektur: 16 Seiten × 2 Breiten mit 0 Verstößen; 48/48 Kombinationen bei 1366/390/320 px ohne Überlauf. Evidenz: `docs/evidence/MISSION-2026-10-19/a11y/`.
- Das ist automatisierte WCAG-A/AA-Prüfung, keine Zertifizierung und kein Screenreader-Nachweis.

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
