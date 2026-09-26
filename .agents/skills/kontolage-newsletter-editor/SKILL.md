---
name: kontolage-newsletter-editor
description: Wandelt ein versioniertes Evidence-Bundle in eine Kontolage-Ausgabe (Newsletter-Artikel) um. Erzeugt Stichhaltige, quellenbelegte Finanzbildungsinhalte für das öffentliche SEO-Archiv unter /newsletter oder für exklusive Abo-Ausgaben im Kabinett. Trennt Fakten, Modellrechnungen und Szenarien, erzwingt Quellen mit Stichtag und Jurisdiktion, klassifiziert die Materialitätsklasse nach WpHG/MAR und gibt niemals selbst frei. Auslieferung ausschließlich über /newsletter bzw. die Edge Function "newsletter"; kein E-Mail-Versand.
---

# Kontolage Newsletter-Editor v1.0

## Zweck

Eine Ausgabe ist kein Artikel: Sie ist eine **Datenlieferung mit Stichtag**. Ziel ist ein Text,
den ein Leser heute nachrechnen und in zwölf Monaten als veraltet erkennen kann.

Freie Ausgaben (`tier: free`) liegen in `content/newsletter.json` und sind Teil des öffentlichen
SEO-Archivs. Gesperrte Ausgaben (`pro` / `executive`) gehören **ausschließlich** in die
Tabelle `newsletter_issues` — niemals ins Repository, sonst läge der bezahlte Text im Bundle.

## 1. Eingangsvoraussetzungen

Verarbeitet wird nur ein vollständiges Bundle:

```json
{
  "research_status": "complete",
  "facts": [{ "fact_id": "...", "claim": "...", "as_of": "YYYY-MM-DD", "jurisdiction": "DE", "source_ids": ["..."] }],
  "contradictions": [],
  "evidence_status": "green|yellow|red"
}
```

Fehlt ein Feld, wird nicht geschrieben. Es wird nachgeliefert.

## 2. Ausgabestruktur

1. Titel als Suchintention (Steuerbegriff + Zahl + Jahr), 50–60 Zeichen
2. Teaser für Kartenansicht, 120–160 Zeichen
3. Meta-Description, 80–165 Zeichen, mit Nutzen und ohne Werbesprache
4. Einleitung: was ist neu, seit wann, für wen relevant — ohne Zahlen ohne Quelle
5. Zwei bis fünf Abschnitte: je Aussage **eine** Zahl, **eine** Quelle, **ein** Stichtag
6. Quellenblock: Label, URL (https), Jurisdiktion, `asOf`
7. Rechner-Deep-Link (`/rechner?c=<slug>` oder `/holding`), wenn ein Rechner existiert
8. Keywords (3–8), Kategorie, Lesezeit

## 3. Stufen und Freischaltung

| tier | Sichtbarkeit | Ablage |
|---|---|---|
| `free` | öffentlich, indexierbar | `content/newsletter.json` + Eintrag in `content/routes.json` |
| `pro` | nur mit aktivem Abo `pro` | `newsletter_issues` (tier pro) |
| `executive` | nur mit aktivem Abo `executive` | `newsletter_issues` (tier executive) |

## 4. Betriebsblock (Hermes-Konvention)

- **Zweck**: Aus einem Evidence-Bundle eine prüfbare Ausgabe mit Quellen, Stichtag und belegter Freischaltungsstufe erzeugen.
- **Trigger**: neue Rechts- oder Marktlage mit Publikationsrelevanz, abgelaufene Ausgabe (Freshness `low`), oder eine belegte Suchintention mit commercial intent.
- **Ablauf**: 1) Bundle prüfen (`research_status: complete`, keine offenen Widersprüche) 2) Titel/Teaser/Description entwerfen 3) Abschnitte schreiben, je Zahl mit `fact_id` 4) Stufe festlegen (free = allgemeinbildend, pro/executive = vertieftes Rechner-/Unternehmenswissen) 5) Quellen mit Jurisdiktion und Stichtag 6) JSON-Schema aus Abschnitt 5 schreiben 7) `newsletter-lint.mjs` ausführen 8) bei `tier: pro|executive` Insert-Skript übergeben, bei `free` zusätzlich in `content/routes.json` eintragen 9) Freigabe über `kontolage-wphg-guardrails`, Publish über `kontenlage-publish-gate`.
- **Check**: Jede Zahl hat `fact_id`, Quelle und `as_of`; `asOf` ist nicht in der Zukunft; Description 80–165 Zeichen; Description und Teaser frei von Empfehlungssprache; `rechnerHref` zeigt auf eine existierende Route; bei `free` existiert der Pfad `/newsletter/<slug>` in `content/routes.json`; bei `pro|executive` steht der Text **nicht** in `content/newsletter.json`.
- **Ausgabe**: Das JSON-Schema aus Abschnitt 5 mit `publish_status: pending_gate`.
- **Fail-Verhalten**: `evidence_status: red`, offener Widerspruch, fehlende `as_of`-Angabe oder Klasse E/F ⇒ **keine Ausgabe**, sondern Ablehnung mit Begründung. Nie eine Zahl ohne Stichtag, nie eine Prognose als Tatsache, nie ein gesperrter Text im Repository. Versand per E-Mail findet nicht statt.
- **Ticket-Kopplung**: P2-03 (Ausgaben-Archiv), P1-14 (Content-Registry), P1-06 (Quellen-/Datumsangaben), P0-03 (Rechts-Gate).

## 5. Ausgabe-Schema

```json
{
  "slug": "holding-struktur-ab-welgem-depotvolumen",
  "category": "Unternehmen",
  "title": "…",
  "teaser": "…",
  "description": "…",
  "h1": "…",
  "published": "2026-09-25",
  "asOf": "2026-09-25",
  "readTime": "5 Min.",
  "tier": "free",
  "keywords": ["Holding Kosten vs Nutzen", "§ 8b KStG Schachtelprivileg"],
  "rechnerHref": "/holding",
  "sections": [{ "heading": "…", "body": "…" }],
  "sources": [
    { "label": "KStG § 8b Abs. 1 und 2", "url": "https://www.gesetze-im-internet.de/kstg/", "jurisdiction": "DE", "asOf": "2026-09-25" }
  ]
}
```

Gesperrte Ausgaben nutzen dieselbe Struktur, werden aber mit `tier: "pro"|"executive"` in
`newsletter_issues` geschrieben (`body` als JSON-Array, `status: "published"`).

## 6. Erneuerung statt Wachstum

`asOf` älter als 180 Tage ⇒ `next_review_due` setzen und die Ausgabe neu recherchieren
(Freshness-Decay, siehe `kontenlage-source-evaluator` §5). Eine Ausgabe ohne
Aktualisierungsdatum ist ein Rückschritt: Sie konkurriert dann gegen die Gesetzeslage, nicht gegen
andere Beiträge.

## 7. Abgrenzung

- Erfindet keine Rechtslage, keinen Stichtag, keine Quelle.
- Verschickt keine E-Mails und sammelt keine Adressen (Entscheid des Owners vom 2026-09-25).
- Keine Autorenangabe „Hermes“ als Verantwortlicher — `producer` muss eine reale Person sein
  (siehe `kontenlage-wphg-guardrails` §8.1).
