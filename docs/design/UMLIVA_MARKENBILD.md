# Umliva-Markenbild — ein System für App und Website

Stand: 2026-10-07. Diese Datei ist die dauerhafte Ablage des Markenbilds im
Website-Repository. Die Werte gelten für die öffentliche Website
(`styles.css`, `guide.css`) und sind mit der Android-App verwandt, aber nicht
identisch kopiert: App und Website ergeben zusammen ein erkennbares System.

## Leitidee

Ein ruhiges, seriöses Prüfwerkzeug. Dunkle Hauptfarbe, warmer heller Grund,
genau ein warmer Akzent. Wenig Schatten, klare Linien, große lesbare Schrift.
Sicher und unsicher sehen klar verschieden aus — nicht nur durch Farbe.

## Farben

| Rolle | Wert | Warum |
|---|---|---|
| Hauptfarbe | Petrol dunkel `#003B46` für Text auf hellem Grund und dunkle Flächen; App-Blau `#005B6B` für Flächen und Schaltflächen | Vertrauen und Ruhe; kommt aus der App (`UmlivaBlue`). |
| Nebenfarbe | Petrol-Mitte `#2D6B74` für Untertitel und Linienbeschriftung | Lesbarkeit auf hellem Grund. |
| Akzentfarbe (genau eine) | Warm `#8A3B1F` für kleine Zeichen (Pfeile, Nummern, Fokus-Ring) | Wiedererkennung aus dem App-Warm, dunkel genug für Kontrast 4,5:1. |
| Hintergrund hell | Warm-Weiß `#FAF7F1` für die Seite; Karten-Weiß `#FFFFFF` | Warm und ruhig, gute Lesbarkeit. |
| Hintergrund dunkel | Gleiches Petrol `#003B46`, Text darauf immer Weiß | Eine Marke statt zwei Welten. |
| Text | Fast-Schwarz `#14201E`; Sekundärtext `#3D5450` (mindestens 4,5:1 bei 16 px) | Hohe Lesbarkeit. |
| Nachgewiesener Fehler | Tiefrot `#8A1616` auf hellem Grund, fette linke Kante, Zeichen „!“, Wort „Fehler“ | Sicher heißt sicher. Nicht nur Farbe. |
| Auffälligkeit | Dunkles Bernstein `#6B4A00` auf Hellgelb `#FFF6DB`, Zeichen „?“, Wort „Auffälligkeit“ | Klarer Unterschied zu Fehler und zu „nicht prüfbar“. |
| Nicht prüfbar | Grau-Blau `#3D5450` auf Hellgrau `#EEF1F0`, Zeichen „leerer Kreis“, Wort „Nicht prüfbar“ | Ruhig statt Alarm. |
| Fokus-Ring | 3 px durchgehend Warm-Dunkel `#8A3B1F` | Tastatur-Nutzer sehen den Fokus immer. |

Alle drei Ergebnis-Stufen nutzen Farbe plus Zeichen plus Wort plus Form (Kante,
Füllung, Umriss). So geht keine Information nur über Farbe verloren.

## Schrift

- Systemschrift (`Inter, system-ui, sans-serif`), Fließtext 17–18 px,
  Zeilenabstand 1,6, Zeilenlänge höchstens 65 Zeichen.
- Überschriften groß und ruhig (H1 40–56 px am Desktop, 32 px am Handy),
  wenig Versalien.
- Ein Gedanke je Satz. Ein Fachwort nur mit Erklärung direkt dahinter.

## Abstände, Ecken, Linien, Symbole

- Abstände: Grundraster 8 px; Abschnitt 96 px (Desktop) / 64 px (Handy);
  Karten-Innenabstand 24–30 px.
- Ecken: 10 px bei Karten und Schaltflächen. Keine Pillen-Flut; nur die
  Hauptschaltfläche wirkt vollrund.
- Linien: 1 px `#D8E0DC` zwischen Bereichen; Ergebnis-Karten mit 3 px
  linker Kante in der Stufenfarbe.
- Symbole: nur drei geometrische Zeichen („!“ im Kreis, „?“ im Kreis, leerer
  Kreis). Keine Hammer-, Waage-, Säulen- oder Geld-Bilder, keine verspielten
  Icons, keine Neonfarben, keine Verläufe als Schmuck, kein Blinken.
- Schatten: fast keine. Nur Karten mit sehr weichem Schatten
  (`0 8px 24px rgba(0,59,70,.08)`).

## So sieht ein Prüfergebnis aus

Jedes Ergebnis zeigt in dieser Reihenfolge: Titel in Alltagssprache; Stufe
(Nachgewiesener Fehler / Auffälligkeit / Nicht prüfbar) mit Zeichen; Grundlage
(Regel in einem Satz); Fundstelle (Seite und Stelle im Original); Berechnung
(Zahlenweg); fehlende Angaben („Es fehlen noch Angaben: …“). Kein Ergebnis ohne
Grundlage. Bei Unklarheit gibt Umliva kein falsches Ergebnis aus.

## Zusammenspiel mit der Android-App

Die Website nutzt die gleichen Stufen, Zeichen und Worte wie die App
(`StatusColors.kt`: `ProvenError`, `Conditional`, `PlausibilityWarning`,
`NotCheckable` → Deutsch: „Nachgewiesener Fehler“, „Auffälligkeit“, „Hinweis“,
„Nicht prüfbar“). Hauptfarbe und warme Flächen sind verwandt, nicht gleich
kopiert: App bei `#005B6B` / `#F5FAFB`, Website bei `#003B46` / `#FAF7F1`.
