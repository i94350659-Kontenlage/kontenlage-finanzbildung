---
name: kontenlage-programmatic-tax-seo
description: Programmatic SEO & Free-Tool-Strategie für hunderte deutsche Steuer- & Anlagebegriffe (EStG, KStG, Rürup, Holding, VV-GmbH, Abfindung). Skaliert organischen Traffic über exakt berechnete Szenarien-Seiten.
---

# Kontolage Programmatic Tax SEO Engine

## 1. Strategie: Free-Tool & Suchintentions-Clustering
Nutzer suchen bei steuerlichen Fragestellungen nach konkreten Zahlen und schnellen Antworten (z.B. *„Grenzsteuersatz 80.000 € Single“*, *„Holding Kosten vs Nutzen Rechner“*, *„Fünftelregelung Rechner Abfindung 50.000 €“*).

## 2. Programmatic Landingpage-Struktur
Jede programmatische Seite folgt einer standardisierten, hocheffektiven Struktur:
1. **Sofort-Ergebnis (Above-the-Fold)**: Dynamischer Rechner mit vorab ausgefüllten Werten der Suchanfrage.
2. **Mathematische Formel & Rechenweg**: Transparente Aufschlüsselung nach EStG/KStG.
3. **Benchmark-Tabelle**: Vergleich mit Nachbar-Einkommensstufen (z.B. 60k vs. 80k vs. 100k).
4. **WpHG / BaFin Disclaimer**: Neutralitätshinweis ohne Verkaufs- oder Beratungsabsicht.
5. **Call-to-Action**: „Kostenloses Kabinett anlegen“ oder „Pro-Rechenmodelle freischalten“.

## Betriebsblock (Hermes-Konvention)

- **Zweck**: Suchintentions-Clustering in exakt berechenbare Szenario-Seiten überführen, statt manuell Artikel zu schreiben.
- **Trigger**: Neue belegte Suchintention vorhanden (Suchkonsole, Kontaktanfrage, Support-Frage) oder Änderung an Steuersätzen/Kostenstellen.
- **Ablauf**: 1) Suchintention festlegen (Steuerbegriff + Zahl + Jahr) 2) Route in `content/routes.json` anlegen 3) Rechner mit vorbelegten Parametern verknüpfen (`?c=<slug>`, Werte in der URL) 4) Formel und Benchmark-Tabelle belegen 5) Sitemap/Prerender neu bauen 6) in der Rechner-Deep-Link-Liste verankern.
- **Check**: Jede Seite hat Titel 50–60 Zeichen, Description 145–155 Zeichen, Canonical auf sich selbst, Disclaimer nach § 2 Abs. 8 Nr. 10 WpHG und eine belegte Rechenformel. Keine Dublette zu bestehenden Artikeln, keine dünnen Inhalte.
- **Ausgabe**: `routes.json`-Eintrag mit `path`, `title`, `description`, `canonical`, `rechner`, `parameter`, `quelle` plus Kurzbegründung der Suchintention.
- **Fail-Verhalten**: Ohne belegte Rechts- oder Marktdatenquelle (Jurisdiktion + Stichtag) wird die Seite **nicht** erzeugt. Werte, die eine Prognose oder eine individuelle Eignung implizieren, sind blockiert (Klasse D–F).
- **Ticket-Kopplung**: P1-15 (Rechner-Deep-Links), P0-01 (Prerender/Canonical), P1-06 (JSON-LD).
