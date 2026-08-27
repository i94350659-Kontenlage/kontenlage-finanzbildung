---
name: kontenlage-wphg-guardrails
description: Zentrale materielle Compliance-Klassifikation für Kontenlage. Prüft Anlageberatung nach WpHG/MiFID-II, öffentliche Investment Recommendations nach MAR, Personalisierung, konkrete Instrumente, Strategie- und Handlungssprache. Das LLM darf die endgültige Compliance-Entscheidung nicht selbst freigeben.
---

# Kontenlage WpHG / MiFID-II / MAR Guardrails v5.1

## 0. Status

Dieser Skill ist technische Governance, keine Rechtsberatung. Er behauptet niemals "rechtssicher", "lizenzfrei" oder "automatisch ausgenommen". Die konkrete Produkt-/User-Journey muss juristisch geprüft werden, bevor ein Grenzbereich live geht.

## 1. Orthogonale Gating-Ebenen

**Gate A — Datenstatus:** GREEN / YELLOW / RED
**Gate B — Aussageklasse:** A / B / C / D / E / F
**Gate C — Rechtsregime:** NONE / WPHG_MIFID_REVIEW / MAR_REVIEW / BOTH

Alle drei werden separat protokolliert. Ein GRÜN-Fakt kann trotzdem Class E/F sein.

## 2. Class A–F

- **A — Fakt:** reine überprüfbare Information.
- **B — Deskriptiver Kategorievergleich:** keine persönliche Handlungsaussage.
- **C — Fester Archetyp/Bildungsprofil:** statische, redaktionelle Typen.
- **D — Szenario/Stress Test/Prognose:** explizit hypothetisch, historisch oder modelliert.
- **E — Personalisierte Eignungs-/Handlungsaussage:** BLOCK.
- **F — Konkrete empfehlende Produkt-/Strategieaussage:** BLOCK.

## 3. Konkretes Instrument ist eigenes Flag

```text
specific_instrument = true|false
```

Eine rein deskriptive Erwähnung eines konkreten Instruments ist nicht automatisch verboten. Kritisch: `specific_instrument = true AND recommendatory_context = true`.

## 4. Semantische Materiellprüfung

Nicht nur Keywords. Prüfe:
1. Wird eine Transaktion/Strategie vorgeschlagen?
2. Wird ein Produkt als besser/geeignet dargestellt?
3. Wird aus Nutzerinformationen eine Handlungsrichtung abgeleitet?
4. Ist die Aussage an eine Person oder Personengruppe gerichtet?
5. Wird eine konkrete Portfoliozusammensetzung nahegelegt?
6. Würde ein vernünftiger Empfänger daraus eine konkrete Investmententscheidung ableiten?

Bei Unsicherheit: höhere Risikoklasse verwenden, nicht veröffentlichen.

## 5. WpHG/MiFID-II-Prüfpfad

Berücksichtigt mindestens: Recommendation vorhanden? Bezug auf Finanzinstrument/Transaktion? persönliche Empfehlung? als geeignet dargestellt oder auf persönliche Umstände gestützt? öffentliche oder nicht ausschließlich öffentliche Verbreitung?

ESMA weist ausdrücklich darauf hin, dass auch automatisierte Systeme, Apps, Internet-Kommunikation und vermeintliche Informationsformate bei der Abgrenzung relevant sein können.

## 6. MAR-Prüfung — zweistufig

Ein Instrumentbezug allein macht einen Text nicht automatisch zur Investment Recommendation. Deshalb zweistufig:

```text
MAR_RELEVANCE_CHECK
   ↓
Ist es tatsächlich eine Investment Recommendation
(explizite/implizite Strategie-/Werteinschätzung)?
   │
 ┌─┴─┐
NEIN JA
 │    │
normal  MAR-Disclosure-Gate
```

Nur wenn JA, greift die volle Disclosure-Prüfung:
- facts vs. interpretations getrennt
- wesentliche Quellen klar angegeben
- Quellenzuverlässigkeit
- Prognosen klar als Prognosen
- Annahmen offengelegt
- Zeitpunkt der Erstellung erkennbar
- Produzent/Verantwortlichkeit nach geltendem Regime
- Interessenkonflikte geprüft/offengelegt
- methodische Grundlage nachvollziehbar

Keine Provisionen/Affiliate-Links sind Governance-Vorgaben, ersetzen aber nicht diese Prüfung. Für bestimmte professionelle/Experten-Situationen können zusätzliche Anforderungen gelten.

## 7. Compliance-Klassifikation darf nicht vom LLM final geändert werden

```text
LLM → proposed_class → deterministic_policy_engine → final_class → publish_gate
```

Das LLM darf klassifizieren, begründen, umformulieren. Das LLM darf nicht: E/F zu B/C heruntersetzen, einen Block aufheben, selbst eine Ausnahme erzeugen.

## 8. Disclosure Contract

```json
{
  "as_of": "...",
  "sources": [],
  "methodology_version": "...",
  "jurisdiction": "...",
  "scope": "...",
  "uncertainty": "...",
  "producer": "...",
  "conflict_check": "passed|not_applicable|blocked"
}
```

Bei MAR-relevanten Empfehlungen zusätzlich die dann geltenden Disclosure-Anforderungen aus der anwendbaren Regulierung.

### 8.1 `producer` ist ein Pflichtfeld mit realer Identität, kein Platzhalter

`producer` muss eine tatsächlich benennbare natürliche oder juristische Person referenzieren (z. B. den Betreiber von Kontenlage als registrierte Entität), nicht "Hermes", "Kontenlage-KI" oder ein generisches Systemlabel. Ein Output ohne aufgelöste, reale `producer`-Identität gilt als `required_disclosure_missing` (siehe §11) und wird geblockt. Diese Zuordnung erfolgt außerhalb des LLM, über eine feste Konfiguration des Betreibers.

## 9. Archetypen

Nur 4–6 feste Typen, deterministische Zuordnung, komplette Typenübersicht sichtbar, keine Rückspiegelung sensibler Nutzerdaten, keine konkrete Produktempfehlung.

Formulierung: "Das Antwortmuster entspricht am stärksten dem Archetyp X." Nicht: "X ist für dich geeignet."

## 10. DeFi

Standardmäßig konservative Einstufung. Nicht: bester Yield, beste Plattform, optimale Allokation, jetzt einsteigen. Beschreiben: beobachtbare Risiken, Datenlage, technische Abhängigkeiten, Unsicherheit, historische Ereignisse.

## 11. Hard Rules

```text
if data_status == RED: BLOCK_NEW_PUBLICATION
if final_class in [E,F]: BLOCK
if missing_provenance: BLOCK
if required_disclosure_missing: BLOCK
if legal_fact_without_jurisdiction_or_scope: BLOCK
if stale_data_exceeds_hard_ttl: BLOCK
if compliance_engine_error: FAIL_CLOSED
```

## 12. Fail Closed

Bei Parserfehler, Policy Engine nicht erreichbar, unklarer Klassifikation, fehlender Datenherkunft, widersprüchlicher Regelversion → niemals veröffentlichen.
