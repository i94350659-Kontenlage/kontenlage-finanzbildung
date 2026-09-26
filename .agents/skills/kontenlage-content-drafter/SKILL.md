---
name: kontenlage-content-drafter
description: Wandelt versionierte Evidence- und Score-Pakete in neutrale, quellenbasierte Finanzbildungsinhalte um. Trennt Fakten, Modelle, Szenarien und Einschätzungen. Nutzt keine personalisierte Empfehlungssprache. Finales Publishing nur über wphg-guardrails und publish-gate.
---

# Kontolage Content Drafter v5.1

## 0. Content Contract

Jeder Text muss wissen: welche Fakten verwendet wurden, welche Scores verwendet wurden, welcher Datenstand gilt, welche Methodikversion gilt, welche Jurisdiktion gilt, ob es Modellannahmen gibt.

## 1. Standardstruktur

1. Definition
2. Funktionsweise
3. Rendite/Opportunity
4. Risiken
5. Liquidität
6. Kosten
7. steuerliche Einordnung, falls relevant
8. Evidence
9. Freshness
10. neutrale Zusammenfassung

## 2. Fakten vs. Modelle

Kennzeichne: Fakt, historische Beobachtung, Modellannahme, Prognose, Szenario. Nie vermischen.

Beispiel: "Historisch lag ..." — nicht: "Es wird ... liegen."

## 3. Score-Sprache

Qualitative Bänder: niedrig / mittel / hoch. Jeder Score: rationale, provenance, as_of, methodology_version.

## 4. Sprache

Bevorzugt: "weist auf", "historisch", "laut Quelle", "unter diesen Annahmen", "kann", "ist abhängig von".

Vermeiden: "sicher", "garantiert", "beste", "optimal", "für dich geeignet", "du solltest", "jetzt kaufen", "jetzt handeln".

## 5. Prognosen

Wenn Forecast vorhanden: Kennzeichnung als Prognose, Annahmen, Datenstand, Unsicherheiten, keine Garantie.

## 6. Quellen

Bei aktuellen oder rechtlich relevanten Behauptungen: Inline-/UI-Quelle, Datum/Stichtag, Jurisdiktion, Scope.

## 7. Compliance

Vor Output → `wphg-guardrails`. Vor Veröffentlichung → `publish-gate`. Der Drafter darf keine Compliance-Freigabe selbst erteilen.

## 8. Output

```json
{
  "content_id": "...",
  "title": "...",
  "content_markdown": "...",
  "fact_ids": [],
  "source_ids": [],
  "as_of": "...",
  "methodology_version": "...",
  "proposed_class": "B",
  "publish_status": "pending_gate"
}
```

## Betriebsblock (Hermes-Konvention)

- **Zweck**: Aus einem versionierten Evidence- und Score-Paket einen neutralen, quellenbasierten Bildungsinhalt erzeugen.
- **Trigger**: Freigegebenes Research-Bundle liegt vor und ein Inhalt wird angefordert.
- **Ablauf**: 1) Eingabepaket prüfen (Evidence, Scores, Datenstand, Methodikversion, Jurisdiktion) 2) Standardstruktur 1–10 ausfüllen 3) Fakten/Modelle/Prognosen/Szenarien kennzeichnen 4) Evidenz verlinken 5) an `wphg-guardrails` übergeben 6) erst nach `publish-gate` veröffentlichen.
- **Check**: Jede Zahl hat Quelle und Stichtag; Score-Bänder sind qualitativ mit `rationale`; keine verbotene Sprache („sicher“, „garantiert“, „optimal“, „für dich geeignet“); `fact_ids`/`source_ids` sind gefüllt, `as_of` gesetzt.
- **Ausgabe**: Das JSON-Schema aus Abschnitt 8 (`publish_status` bleibt `pending_gate`).
- **Fail-Verhalten**: Fehlende Provenance, `data_status: red` oder Klasse E/F → **kein** Text, sondern Ablehnung mit Begründung. Der Drafter darf keine Compliance-Freigabe selbst erteilen.
- **Ticket-Kopplung**: P1-14 (Content-Registry), P1-06 (Artikel-JSON-LD), P2-03 (Newsletter-Teaser).
