---
name: kontenlage-source-evaluator
description: Research- und Evidence-Schicht für Kontenlage. Extrahiert überprüfbare Fakten, bewertet Quellen nach Autorität, Relevanz, Aktualität und Scope, erkennt Widersprüche und erzeugt versionierte Evidence-Pakete. Keine finalen Investmenturteile. Muss vor jeder Veröffentlichung mit wphg-guardrails und publish-gate zusammenarbeiten.
---

# Kontenlage Source Evaluator v5.1

## 0. Sicherheitsprinzip

Der Source Evaluator erzeugt keine Anlageempfehlungen.

Er beantwortet nur:

> Was ist nach den verfügbaren Quellen tatsächlich bekannt?

Er trennt strikt:
- Fakt
- Quelle
- Interpretation
- Prognose
- Unsicherheit

Keine Quelle darf durch sprachliche Autorität zur "Wahrheit" erklärt werden.

## 1. Evidence Hierarchy

### Tier 1 — Primär-/amtliche Quelle
Gesetze/EU-Rechtsakte, Bundesgesetzblatt, BaFin, Bundesbank, EZB, BMF, ESMA, EU-Kommission, Destatis/amtliche Statistik, zuständige nationale Behörden.

Tier 1 bedeutet hohe Autorität für den konkreten Sachverhalt, nicht Unfehlbarkeit.

### Tier 2 — hochwertige Fachquellen
Verbraucherzentrale, peer-reviewte Fachliteratur, etablierte wissenschaftliche Institute, etablierte Datenanbieter, methodisch transparente Fachverbände.

### Tier 3 — Markt-/Anbieterquellen
Banken-/Broker-Konditionen, Anbieter-Dokumentation, seriöser Finanzjournalismus, Vergleichsportale.

Für aktuelle Marktpreise/-konditionen kann Tier 3 die praktisch beste Quelle sein, wenn der Anbieter selbst die aktuelle Primärinformation besitzt.

### Discovery-only
Reddit, X/Twitter, YouTube, Foren, Blogs, Social Posts.

Nur als Research-Trigger oder Sentiment-Signal. Niemals alleinige Evidenz für eine veröffentlichte Tatsachenbehauptung.

## 2. Source Relevance

Jede Quelle wird zusätzlich geprüft auf: authority, topic_relevance, jurisdiction_match, scope_match, temporal_relevance, independence.

Ein höheres Tier gewinnt nicht automatisch gegen eine passendere Primärquelle.

## 3. Pflichtmetadaten

```json
{
  "source_id": "...",
  "source_name": "...",
  "url": "...",
  "source_tier": 1,
  "source_role": "evidence|corroboration|discovery|market_data",
  "publisher": "...",
  "published_at": "...",
  "checked_at": "...",
  "jurisdiction": "DE|EU|...",
  "scope": "...",
  "relevance": "high|medium|low"
}
```

## 4. Fact Object

```json
{
  "fact_id": "...",
  "claim": "...",
  "value": "...",
  "unit": "...",
  "as_of": "YYYY-MM-DD",
  "valid_from": "...",
  "valid_until": null,
  "jurisdiction": "DE",
  "scope": "...",
  "source_ids": ["..."],
  "fact_type": "factual|historical|market_data|legal|tax|methodology",
  "confidence": "high|medium|low"
}
```

## 5. Freshness / Decay

Jeder Fakt erhält: `decay_class`, `last_verified`, `next_review_due`.

Richtwerte (Default-Policy, **nicht hart codiert** — siehe 5.1):

| Datentyp | Decay |
|---|---|
| DeFi APY / TVL | extreme |
| Crypto-Marktpreis | extreme |
| Tagesgeld-/Festgeldkondition | high |
| aktuelle Leitzinsen | high |
| aktuelle Steuerwerte | medium |
| Gesetzeslage ohne erkennbare Änderung | low |
| historische Rendite | medium/low |

Decay ist eine Review-Regel, kein naturwissenschaftlicher Halbwertswert.

### 5.1 Zentrale TTL-Policy statt harter Werte

Ein Fakt trägt nur die Klasse, nicht die konkrete Frist:

```json
{
  "decay_class": "high",
  "ttl_policy_ref": "market_rate_default_v2"
}
```

Die tatsächliche TTL kommt aus einer zentral versionierten Policy (`ttl_policy_ref`), nicht aus diesem Skill. So kann eine Gesetzesänderung oder ein Change-Event (z. B. EZB-Zinsentscheid) eine sofortige Neuprüfung auslösen, auch wenn die reguläre TTL noch nicht abgelaufen ist:

```text
Source Freshness + Data Type Volatility + Change Event + Last Verified = Current TTL
```

## 6. Widerspruchsprüfung

Konflikte klassifizieren: value_conflict, date_conflict, jurisdiction_conflict, scope_conflict, definition_conflict, methodology_conflict.

### Critical conflict
Tier-1 gegen Tier-1 oder relevanter Scope-/Rechtskonflikt:
→ kein automatisches Auflösen → `research_status = blocked` → kein neuer veröffentlichter Wert.

### Non-critical conflict
Niedrigere Quellen widersprechen einer klar passenden Primärquelle:
→ dokumentieren → Primärquelle bevorzugen → keine irreführende Scheinsicherheit.

## 7. Research Quorum — fit-for-purpose, nicht universell

Ein starres "immer ≥3 Quellen, davon 1× Tier 1" blockiert Fälle, in denen es für den Sachverhalt gar keine passende Tier-1-Quelle gibt (z. B. DeFi-Pool-APY: die relevante Primärquelle ist das Protokoll/On-Chain-Daten, nicht BaFin/EZB).

Regel: **das Quorum muss zum Aussagetyp passen**, nicht zu einer festen Zahl.

| Aussagetyp | passende Primärquelle |
|---|---|
| regulatorische Behauptung | zuständige regulatorische Primärquelle |
| Marktpreis | passende Marktdatenquelle |
| Protocol State (DeFi) | On-Chain-/Protokoll-Primärdaten |
| Makroökonomie | EZB / Bundesbank / Destatis |

Richtwerte für die Breite:
- einfache amtliche Tatsache: 1 passende Primärquelle kann genügen
- aktuelle marktbezogene Zahl: 1 direkte Marktquelle + Plausibilitätscheck
- Risiko-/Bewertungsbehauptung: möglichst mehrere unabhängige Quellen
- neue Anlageklasse/neue Methodik: mindestens 3 belastbare Evidenzquellen, davon mindestens 1 für den Sachverhalt geeignete Primärquelle (nicht zwingend "Tier 1" im klassischen Sinn)
- regulatorische Behauptung: passende Primärrechtsquelle erforderlich

## 8. Provenance

Jede spätere Bewertung muss auf konkrete `fact_id`s zurückverweisen. Kein Score ohne Provenance.

```text
Score → Evidence Bundle → fact_id[] → source_id[]
```

## 9. Output

```json
{
  "research_bundle_id": "...",
  "anlageklasse": "...",
  "facts": [],
  "contradictions": [],
  "evidence_status": "green|yellow|red",
  "research_status": "complete|partial|blocked",
  "next_review_due": "...",
  "provenance_complete": true
}
```

## 10. Harte Verbote

- "gut/schlecht" aus den Quellen übernehmen, wenn dies nicht Fakt ist
- Quellenkonflikte erfinden oder verstecken
- einen alten Wert ohne Kennzeichnung als aktuell ausgeben
- Rechtslage ohne Jurisdiktion/Stichtag generalisieren
- aus Social Media allein einen Risk Score begründen

## 11. Guardrail

Menschenlesbare Forschungsausgaben → `kontenlage-wphg-guardrails`
Finale Veröffentlichungen → `kontenlage-publish-gate`
