# Feature: Steuerabsetzungs-Datenbank (Kontolage)

## Problem
Selbständige und Arbeitnehmer wissen oft nicht, was sie steuerlich absetzen können. Excel-Tabellen und 2-minütige Recherche reichen nicht für komplexe Entscheidungen (PC-Erneuerung, Homeoffice, Rürup, etc.).

## Lösung
Eine durchsuchbare Datenbank aller absetzbaren Posten mit:
- Was kann man absetzen?
- Mit was im Zusammenhang?
- Wie viel Euro (Freibeträge, Sätze, Höchstbeträge)?
- Wann lohnt es sich am meisten?
- Wie oft kann man das erneuern?
- Konkrete Beispiele mit Euro-Beträgen

## Datenquellen
- `src/data/steuerabsetzungen-selbststaendig.js` — 12 Posten (Selbständige/GmbH)
- `src/data/steuerabsetzungen-arbeitnehmer.js` — 10 Posten (Arbeitnehmer)
- `src/data/steuerabsetzungen-faq.js` — 7 FAQ + 5 Strategie-Tipps
- `src/data/steuerabsetzungen.js` — Haupt-Export mit Suchfunktion

## Zielgruppen
1. **Selbständige / Freiberufler / GmbH-GF** — Betriebsausgaben mindern den Gewinn
2. **Arbeitnehmer** — Werbungskosten mindern das zu versteuernde Einkommen (Pauschale 1.230 €)

## Strategische Empfehlung (Bezahl-Feature)
Dieses Feature ist ein idealer **Lead-Magnet für Pro/Executive**:
- **Kostenlos**: 5 Artikel, Basis-Pauschbeträge, FAQ
- **Pro (9 €/Monat)**: Vollständige Datenbank, PDF-Export, Strategie-Rechner (PC-Erneuerungs-Timing, Rürup-Berechnung)
- **Executive (29 €/Monat)**: Persönliche Steuer-Szenarien, Excel-Export, ELSTER-Vorlagen, Holding-Strukturierung

## Umsetzung
- React-Komponente `/steuerabsetzen` mit Suche und Filter nach Kategorie/Zielgruppe
- PDF-Export der individuellen Auswahl
- CSV/Excel-Export für Steuerberater