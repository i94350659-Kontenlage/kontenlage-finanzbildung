---
name: kontenlage-archetype-quiz-maintainer
description: Pflegt 4–6 feste, redaktionell definierte Archetypen und deterministische Quiz-Zuordnung. Verhindert offene KI-Eignungsinferenz und individuelle Portfolioempfehlungen. Alle Ergebnisse durch wphg-guardrails und publish-gate.
---

# Kontolage Archetype Quiz Maintainer v5.1

## Zweck

Das Tool klassifiziert ein Antwortmuster in einen vorab definierten Bildungs-Archetyp. Es ist kein Robo-Advisor.

## 1. Archetypen (Phase 1)

1. Sicherheitsorientiert
2. Langfristig indexorientiert
3. Zins-/Cashflow-orientiert
4. Spekulativ orientierter Beimischer

Maximal 6. Alle Texte sind vorab redaktionell definiert.

## 2. Deterministische Logik

```text
Antwort → feste Gewichte → Aggregation → Archetype ID
```

Kein LLM darf aus Freitext eine individuelle Eignung ableiten.

## 3. Ergebnis

Bevorzugt: "Das Antwortmuster entspricht am stärksten dem Archetyp X."
Nicht: "Dieser Archetyp passt zu dir."

Dann: Beschreibung des Archetyps, Kategorien, mit denen er sich häufig beschäftigt, vollständige Übersicht aller Archetypen, Methodik-Hinweis, Disclaimer.

## 4. Datenminimierung

Generative Modelle erhalten nicht: Kontostand, Einkommen, exakte Vermögenswerte, persönliche Detaildaten — wenn diese für die Zuordnung nicht erforderlich sind.

## 5. Keine Portfolioausgabe

Verboten: individuelle Allokation, konkrete Sparrate, konkrete ISIN, "optimal", "beste Wahl".

## 6. Governance

Änderungen an Archetypen, Gewichtungen, Fragen, Grenzwerten sind Methodology Changes → Version erhöhen → Change Log → Compliance Review → Regression Test → erst danach Publish.

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

## Betriebsblock (Hermes-Konvention)

- **Zweck**: Ein Antwortmuster deterministisch einem von maximal 6 redaktionell fixierten Bildungs-Archetypen zuordnen — ohne Eignungsinferenz.
- **Trigger**: Nutzer schließt den Quiz-Lauf ab (alle Pflichtfragen beantwortet) oder Gewichte/Fragen sollen geändert werden.
- **Ablauf**: 1) Eingaben validieren (vollständig, Wertebereich) 2) feste Gewichte anwenden 3) aggregieren 4) Archetyp-ID bestimmen 5) Ergebnisformulierung + Übersicht aller Archetypen + Methodik-Hinweis + Disclaimer ausgeben.
- **Check**: Zuordnung ist reproduzierbar (gleiche Eingabe → gleiches Ergebnis), `logic_version` ist gesetzt, `personalized_recommendation` bleibt `false`, `all_archetypes_visible` ist `true`.
- **Ausgabe**: Das JSON-Schema aus Abschnitt 7 (`proposed_class` = C, `publish_status` = `pending_gate`).
- **Fail-Verhalten**: Unvollständige Eingaben, unbekannte Gewichte oder fehlende `logic_version` → **kein** Archetyp, sondern Rückfrage/Abbruch. Freitext-Auswertung durch ein LLM zu individueller Eignung ist verboten und wird als Policy-Verstoß protokolliert.
- **Ticket-Kopplung**: P2-07 (Quiz-Funktion), Governance über `kontenlage-wphg-guardrails` und `kontenlage-publish-gate`.
