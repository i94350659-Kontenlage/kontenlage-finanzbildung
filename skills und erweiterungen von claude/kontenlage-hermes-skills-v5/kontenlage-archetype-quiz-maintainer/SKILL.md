---
name: kontenlage-archetype-quiz-maintainer
description: Pflegt 4–6 feste, redaktionell definierte Archetypen und deterministische Quiz-Zuordnung. Verhindert offene KI-Eignungsinferenz und individuelle Portfolioempfehlungen. Alle Ergebnisse durch wphg-guardrails und publish-gate.
---

# Kontenlage Archetype Quiz Maintainer v5

## Zweck

Das Tool klassifiziert ein Antwortmuster in einen vorab definierten Bildungs-Archetyp.

Es ist kein Robo-Advisor.

## 1. Archetypen

Phase 1:
1. Sicherheitsorientiert
2. Langfristig indexorientiert
3. Zins-/Cashflow-orientiert
4. Spekulativ orientierter Beimischer

Maximal 6.

Alle Texte sind vorab redaktionell definiert.

## 2. Deterministische Logik

```text
Antwort
→ feste Gewichte
→ Aggregation
→ Archetype ID
```

Kein LLM darf aus Freitext eine individuelle Eignung ableiten.

## 3. Ergebnis

Bevorzugt:
> "Das Antwortmuster entspricht am stärksten dem Archetyp X."

Nicht:
> "Dieser Archetyp passt zu dir."

Dann:
- Beschreibung des Archetyps
- Kategorien, mit denen er sich häufig beschäftigt
- vollständige Übersicht aller Archetypen
- Methodik-Hinweis
- Disclaimer

## 4. Datenminimierung

Generative Modelle erhalten nicht:
- Kontostand
- Einkommen
- exakte Vermögenswerte
- persönliche Detaildaten

wenn diese für die Zuordnung nicht erforderlich sind.

## 5. Keine Portfolioausgabe

Verboten:
- individuelle Allokation
- konkrete Sparrate
- konkrete ISIN
- "optimal"
- "beste Wahl"

## 6. Governance

Änderungen an:
- Archetypen
- Gewichtungen
- Fragen
- Grenzwerten

sind Methodology Changes.

→ Version erhöhen
→ Change Log
→ Compliance Review
→ Regression Test
→ erst danach Publish.

## 7. Output

```json
{
  "archetype_id": "...",
  "archetype_name": "...",
  "logic_version": "v5.1",
  "all_archetypes_visible": true,
  "personalized_recommendation": false,
  "proposed_class": "C",
  "publish_status": "pending_gate"
}
```
