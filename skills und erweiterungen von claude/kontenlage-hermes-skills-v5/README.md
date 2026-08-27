# Kontenlage Hermes Skills v5

## Ziel

Kontenlage soll eine transparente Financial-Research- und Bildungsplattform sein, keine Black-Box-Anlageberatung.

## Kernarchitektur

### Research
- source-evaluator

### Scoring
- scoring-engine

### Content
- content-drafter
- archetype-quiz-maintainer

### Governance
- wphg-guardrails
- publish-gate

### Sicherheit
- audit-redteam

## Vier Datenachsen

1. Risk
2. Opportunity
3. Evidence
4. Freshness

## Zwei Daten-/Compliance-Gates

### Datenstatus
- GREEN
- YELLOW
- RED

### Aussageklasse
- A Fakten
- B Kategorievergleich
- C Archetyp
- D Szenario
- E personalisierte Eignungs-/Handlungsaussage
- F konkrete empfehlende Produkt-/Strategieaussage

## Zusätzliche Pflichtattribute

- jurisdiction
- scope
- as_of
- source_ids
- fact_ids
- methodology_version
- policy_version
- provenance_complete

## V5 Verbesserungen

### 1. Provenance
Jeder Score führt zu seinen Fakten und Quellen zurück.

### 2. Temporal Integrity
Veraltete Daten können automatisch ihre Publikationsfähigkeit verlieren.

### 3. Policy Versioning
Rechts-/Governance-Regeln sind versioniert.

### 4. Fail Closed
Fehler führen zu Blockierung, nicht zu "best effort publish".

### 5. Atomic Publish + Rollback
Ein fehlerhaftes Update kann vollständig zurückgenommen werden.

### 6. Deterministische Finalfreigabe
Das LLM darf die endgültige Compliance-Entscheidung nicht selbst treffen.

### 7. Red Team
Compliance-Umgehung und Prompt Injection werden aktiv getestet.

### 8. MAR / MiFID / WpHG getrennt
Datenstatus, Aussageklasse und Rechtsregime sind getrennte Signale.

## Empfohlene Pipeline

```text
SOURCE
  ↓
SOURCE-EVALUATOR
  ↓
EVIDENCE BUNDLE
  ↓
SCORING ENGINE
  ↓
CONTENT DRAFTER
  ↓
WPHG/MAR GUARDRAILS
  ↓
DETERMINISTIC PUBLISH GATE
  ↓
AUDIT LOG
  ↓
PUBLISH
```

Red-Team:
```text
parallel / regression
→ darf nicht publishen
→ darf nur testen
```

## Rechtsgrundlagen

Die Skills sind technische Governance und keine Rechtsberatung.

Für die konkrete Ausgestaltung sind insbesondere die jeweils geltenden:
- WpHG/MiFID-II-Regeln
- MAR-Regeln
- Delegierten Rechtsakte
- ESMA-/BaFin-Leitlinien und Veröffentlichungen

zu prüfen.

Vor dem produktiven Start eines personalisierten Profil-/Archetypen-Tools ist eine Prüfung des tatsächlichen User-Flows und der Outputs durch einen auf Kapitalmarktrecht spezialisierten Rechtsanwalt vorgesehen.
