---
name: kontenlage-publish-gate
description: Deterministische finale Veröffentlichungs-Governance für Kontenlage. Prüft Datenstatus, Compliance-Klasse, Provenance, Freshness, Jurisdiktion, Disclosure und Systemintegrität. Fail-closed. Dieses Gate ist der letzte Schritt vor jeder öffentlichen Ausgabe.
---

# Kontenlage Publish Gate v5.1

## Zweck

Dieses Gate entscheidet nicht, ob eine Anlage "gut" ist. Es entscheidet ausschließlich: Darf dieser konkrete Output mit diesem Datenstand und diesen Metadaten veröffentlicht werden?

## 1. Required Inputs

content_id, evidence_bundle_id, score_snapshot_id (falls Scores verwendet), methodology_version, data_status, proposed_compliance_class, provenance_complete, freshness_status, jurisdiction, scope, disclosure_status, source_ids, generated_at.

## 2. Deterministische Checks

1. **Provenance** — alle wesentlichen Aussagen rückverfolgbar, sonst BLOCK.
2. **Freshness** — harte TTL überschritten → BLOCK. Soft-TTL überschritten → mindestens YELLOW + deutlicher Datenstand.
3. **Data Status** — RED: kein neuer öffentlicher Wert. YELLOW: nur mit Audit Log. GREEN: normaler Publish-Pfad.
4. **Compliance** — finale Class muss aus Policy Engine kommen. E/F → BLOCK.
5. **MAR** — wenn MAR-relevant: Disclosure Contract vollständig.
6. **Jurisdiction/Scope** — rechtliche/steuerliche Aussage ohne gültige Jurisdiktion/Scope → BLOCK.
7. **Methodology** — Score ohne Methodenversion → BLOCK.
8. **Policy Version** — Output muss gegen aktuelle Policy-Version geprüft werden. Alte Policy-Version → Revalidation erforderlich.

## 3. Anti-self-approval

```text
content model → policy engine → publish gate → publisher
```

Content-LLM darf dieses Gate nicht selbst bestätigen.

## 4. Kill Switch

```text
PUBLISH_ENABLED = false
```

Muss mindestens setzbar sein bei: regulatorischer Unsicherheitsfall, Source-Systemfehler, Prompt-Injection-Verdacht, massenhafte widersprüchliche Daten, Policy-Version fehlerhaft, Datenmigration unsicher.

## 5. Atomic Publish

Nie: Score aktualisieren → Artikel halb aktualisieren → Disclosure später ergänzen.

Sondern: `prepare → validate → gate → atomic_publish`. Bei Fehler: alter bekannter gültiger Snapshot bleibt aktiv.

## 6. Rollback

Jede Veröffentlichung erhält: version_id, previous_version_id, published_at, source snapshot, method snapshot, policy version. Rollback ohne Neuberechnung des aktuellen Zustands möglich.

## 7. Audit Log

```json
{
  "content_id": "...",
  "decision": "publish|block",
  "reason_codes": [],
  "data_status": "green",
  "compliance_class": "B",
  "policy_version": "v5.1",
  "methodology_version": "v5.1",
  "producer": "...",
  "generated_at": "...",
  "published_at": "..."
}
```

### 7.1 Aufbewahrung

Audit-Logs werden über eine fest definierte Mindestfrist aufbewahrt (Richtwert: mehrjährig, konkrete Frist durch Betreiber unter Berücksichtigung der einschlägigen MAR-/WpHG-Dokumentationspflichten festzulegen — nicht durch diesen Skill selbst bestimmt). Kein automatisches Löschen von Audit-Logs ohne diese Frist, auch nicht bei Rollback.

### 7.2 Eskalation bei Kill-Switch / Critical Failure

Ein ausgelöster Kill-Switch (§4) oder ein Critical Failure aus `kontenlage-audit-redteam` führt zu:

```text
Ereignis
  ↓
Sofortiger Block neuer Publishes (fail-closed, siehe §8)
  ↓
Benachrichtigung einer benannten verantwortlichen Person (nicht des LLM selbst) mit definierter Reaktionsfrist
  ↓
Freigabe zur Wiederaufnahme (PUBLISH_ENABLED = true) ausschließlich durch diese Person, nie automatisch durch das System
```

Wer diese Person ist und welche Frist gilt, ist Betreiber-Konfiguration, kein Skill-internes Detail — muss aber vor Produktivbetrieb konkret benannt sein, sonst bleibt der Kill-Switch praktisch wirkungslos.

## 8. Fail Closed

Policy Engine fehlt, Datenquelle unklar, Gate antwortet nicht, Versionen inkompatibel, Required Metadata fehlt → BLOCK.

## 9. Keine autonome Ausnahme

Es gibt keine "temporary bypass", "emergency publish", "probably safe". Ausnahmen benötigen explizite Governance-Freigabe außerhalb des LLM.
