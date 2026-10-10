# Website-Status

Diese Datei hält fest, wo das Projekt steht. Der Skill `website-bauen` liest sie bei jedem Aufruf und macht dort weiter.

Status: ✅ erledigt · 🔄 läuft · ⬜ offen

Hinweis: Umliva ist eine **bestehende** statische GitHub-Pages-Seite (kein Neubau). Der Skill wurde am 2026-10-10 projektlokal installiert und als Audit- und Verbesserungslauf auf die bestehende Seite angewendet. Die Phasen 0–4 gelten als durch die bestehende Marke und Inhalte abgedeckt; die Tabelle spiegelt den Stand dieses Laufs.

| Phase | Name | Status | Datum |
|---|---|---|---|
| 0 | Einrichten | ✅ (Skill projektlokal installiert) | 2026-10-10 |
| 1 | Fundament | ✅ (bestehend; Marke dokumentiert in `docs/design/UMLIVA_MARKENBILD.md`) | 2026-10-10 |
| 2 | Recherche | ⬜ (DataForSEO nicht eingerichtet; Keyword-Tiefe fehlt) | |
| 3 | Texte | ✅ (Audit gegen `.agents/skills/website-bauen/schreibregeln.md`: Gedankenstriche, Duzen-Ausreißer, Zählfehler behoben) | 2026-10-10 |
| 4 | Design-Richtung | ✅ (bestehendes Markensystem, gemessen mit `werkzeuge/marke_auslesen.py`, kein Drift) | 2026-10-10 |
| 5 | Bauen | ✅ (OG-Vorschaubild + Tags, JSON-LD, llms.txt, Diagramm-Präsentation) | 2026-10-10 |
| 6 | Prüfen und Feinschliff | ✅ (4 visuelle Prüfdurchgänge, alle Befunde behoben, Endstand pass) | 2026-10-10 |
| 7 | Livegang | ⬜ (Merge auf `main` und Veröffentlichung liegen beim Menschen) | |
| 8 | Danach | ⬜ (Search Console/Profile nach dem Merge) | |

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

- 2026-10-10: Arbeitsbasis des Laufs ist der Branch `design/umliva-pruefwerkzeug-20261007` (direkter Nachfolger von `main`, fast-forward-fähig), damit die bestehende Gestaltungsarbeit konvergiert; dieser Lauf liegt auf `skill/website-bauen-anwendung-20261010`.
- 2026-10-10: Skill nur projektlokal (`.agents/skills/website-bauen`), im Vertrag unter `skillIsolation.repoSkillRoots` deklariert; `/.agents/` ist keine veröffentlichte Fläche (verify-site-Ausschluss, robots-Disallow).
- 2026-10-10: Strukturierte Daten nur mit belegbaren Angaben (keine Autorinnen, Daten, Bewertungen); Impressum bleibt der ehrliche Platzhalter `LEGAL_DISCLOSURE_OWNER_DATA_REQUIRED`.

## Offene Fragen an die Person

- Impressum: Trägerdaten fehlen und dürfen nicht erfunden werden (`LEGAL_DISCLOSURE_OWNER_DATA_REQUIRED` in den Fußzeilen). Wer ist der Anbieter im Sinne von § 5 DDG?
- DataForSEO-Konto für Phase 2 (Suchvolumen/Wettbewerber) einrichten? Aktuell ca. 1 $ Projektbudget nötig.
- Branch `skill/website-bauen-anwendung-20261010` per PR nach `main` bringen (Merge und Veröffentlichung waren in diesem Lauf ausdrücklich ausgeschlossen).

## Update-Ablauf nach dem Livegang

1. Änderung im Repo (statische Dateien, kein Build-Schritt)
2. Verifizierung: `node verify-site.mjs && node verify-sanitization.mjs && node tools/verify-german.mjs && node tools/verify-agent-project-contract.mjs`
3. Visuell: `.agents/skills/website-bauen/werkzeuge/pruefen.py http://127.0.0.1:8000/` (lokal servieren mit `python3 -m http.server 8000`)
4. Merge nur per reviewtem PR; GitHub Pages veröffentlicht aus `main`
