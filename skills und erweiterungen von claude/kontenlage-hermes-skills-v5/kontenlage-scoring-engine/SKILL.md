---
name: kontenlage-scoring-engine
description: Erzeugt qualitative Risk-, Opportunity-, Evidence- und Freshness-Bewertungen aus versionierten Evidence-Bundles. Jeder Score besitzt vollständige Provenance, Methodenversion und Unsicherheitsstatus. Keine individuelle Eignungsbewertung. Finales Publishing nur über publish-gate und wphg-guardrails.
---

# Kontenlage Scoring Engine v5

## 0. Grundsatz

Ein Score ist ein abgeleitetes Modell, kein Fakt.

Deshalb muss jeder Score nachvollziehbar sein:

```text
score
→ methodology_version
→ input_fact_ids
→ source_ids
→ calculation_rules
→ as_of
```

## 1. Vier unabhängige Achsen

### Risk
- Kapitalverlustrisiko
- Volatilität
- Gegenpartei-/Ausfallrisiko
- Liquiditätsrisiko

Optional:
- Technologie-/Smart-Contract-Risiko
- Währungsrisiko
- Regulierungsrisiko
- Konzentrationsrisiko

### Opportunity
- Renditepotenzial
- Planbarkeit
- Diversifikationsbeitrag

### Evidence
- Quellenqualität
- Quellenbreite
- Unabhängigkeit
- Konsistenz
- Methodentransparenz

### Freshness
- Datenalter
- Decay
- Review-Fälligkeit
- Markt-/Rechtsaktualität

## 2. Keine Fake-Präzision

Standard:
- niedrig
- mittel
- hoch
- sehr hoch / sehr niedrig, nur wenn Methodik dies eindeutig begründet

Keine 8,4/10 oder 73/100 ohne reproduzierbare, kalibrierte Metrik.

Reale Marktdaten dürfen natürlich Zahlen enthalten.

## 3. Score Bands

Jedes Band benötigt:
- rationale
- evidence references
- confidence
- as_of
- methodology_version

## 4. Methodology Versioning

Jede Score-Generation bekommt:
```json
{
  "methodology_version": "v5.1",
  "generated_at": "...",
  "valid_from": "...",
  "input_hash": "...",
  "methodology_hash": "..."
}
```

Wenn die Methodik geändert wird:
→ keine stille Überschreibung alter Ergebnisse
→ neuer Score-Snapshot
→ Change Log
→ Governance Event.

## 5. Score Lineage

```json
{
  "score_id": "...",
  "axis": "risk",
  "dimension": "liquidity",
  "band": "medium",
  "confidence": "high",
  "methodology_version": "v5.1",
  "fact_ids": ["..."],
  "source_ids": ["..."],
  "as_of": "2026-08-22",
  "status": "green"
}
```

## 6. Green/Yellow/Red Data Gate

### GREEN
Fakt oder Score mit:
- ausreichender Evidenz
- passender Freshness
- keinem relevanten Widerspruch
- vollständiger Provenance

### YELLOW
- etablierte Methode
- Änderung innerhalb erwarteter Schwankungsbreite
- gute Konfidenz
- noch veröffentlichbar
- Audit Log zwingend

### RED
- Konflikt
- fehlende Provenance
- veraltete Daten
- neue Methodik
- neue Anlageklasse ohne Research-Quorum
- unklare Jurisdiktion
- fehlende notwendige Quellen

→ neuer Wert nicht veröffentlichen.

## 7. Conservative Staleness Rule

Wenn ein Datenpunkt die definierte `next_review_due` überschritten hat:
→ Freshness mindestens `low`
→ abhängige Scores dürfen nicht automatisch auf "fresh/high confidence" bleiben.

Bei extrem schnell alternden Daten:
→ automatische Sperre nach Ablauf der TTL.

## 8. No Recommendation Score

Nicht erzeugen:
- Suitability Score
- Best Investment Score
- Buy Score
- Sell Score
- Personal Portfolio Score

Erlaubt:
- Risk Band
- Opportunity Band
- Evidence Band
- Freshness Band
- Complexity Level
- Liquidity Level

## 9. DeFi

DeFi-Scores müssen zusätzlich offenlegen, soweit relevant:
- smart_contract
- oracle
- bridge
- stablecoin
- liquidity
- governance
- admin_key / upgradeability
- protocol history

Keine konkrete Allokationsentscheidung.

## 10. Output

```json
{
  "anlageklasse": "...",
  "risk": {},
  "opportunity": {},
  "evidence": {},
  "freshness": {},
  "methodology_version": "...",
  "provenance_complete": true,
  "data_status": "green|yellow|red",
  "proposed_compliance_class": "A|B|C|D|E|F"
}
```

`proposed_compliance_class` ist nur ein Vorschlag.

Final entscheidet die deterministische Compliance-/Publish-Schicht.
