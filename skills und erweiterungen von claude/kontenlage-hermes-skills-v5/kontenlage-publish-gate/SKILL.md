---
name: kontenlage-publish-gate
description: Deterministische finale Veröffentlichungs-Governance für Kontenlage. Prüft Datenstatus, Compliance-Klasse, Provenance, Freshness, Jurisdiktion, Disclosure und Systemintegrität. Fail-closed. Dieses Gate ist der letzte Schritt vor jeder öffentlichen Ausgabe.
---

# Kontenlage Publish Gate v5

## Zweck

Dieses Gate entscheidet nicht, ob eine Anlage "gut" ist.

Es entscheidet ausschließlich:

> Darf dieser konkrete Output mit diesem Datenstand und diesen Metadaten veröffentlicht werden?

## 1. Required Inputs

- content_id
- evidence_bundle_id
- score_snapshot_id, falls Scores verwendet
- methodology_version
- data_status
- proposed_compliance_class
- provenance_complete
- freshness_status
- jurisdiction
- scope
- disclosure_status
- source_ids
- generated_at

## 2. Deterministische Checks

### Check 1 — Provenance
Alle wesentlichen Aussagen müssen rückverfolgbar sein.

Fehlt Provenance:
→ BLOCK.

### Check 2 — Freshness
Wenn harte TTL überschritten:
→ BLOCK.

Wenn Soft-TTL überschritten:
→ mindestens YELLOW und deutlicher Datenstand.

### Check 3 — Data Status
RED:
→ kein neuer öffentlicher Wert.

YELLOW:
→ Publikation nur mit Audit Log.

GREEN:
→ normaler Publish-Pfad.

### Check 4 — Compliance
Finale Class muss aus Policy Engine kommen.

E/F:
→ BLOCK.

### Check 5 — MAR
Wenn MAR-relevant:
→ Disclosure Contract vollständig.

### Check 6 — Jurisdiction/Scope
Rechtliche/steuerliche Aussage ohne gültige Jurisdiktion/Scope:
→ BLOCK.

### Check 7 — Methodology
Score ohne Methodenversion:
→ BLOCK.

### Check 8 — Policy Version
Output muss gegen aktuelle Policy-Version geprüft werden.

Alte Policy-Version:
→ Revalidation erforderlich.

## 3. Anti-self-approval

Content-LLM darf dieses Gate nicht selbst bestätigen.

```text
content model
     ↓
policy engine
     ↓
publish gate
     ↓
publisher
```

## 4. Kill Switch

Globaler Kill Switch:
```text
PUBLISH_ENABLED = false
```

Soll mindestens für folgende Ereignisse gesetzt werden können:
- regulatorischer Unsicherheitsfall
- Source-Systemfehler
- Prompt-Injection-Verdacht
- massenhafte widersprüchliche Daten
- Policy-Version fehlerhaft
- Datenmigration unsicher.

## 5. Atomic Publish

Nie:
1. Score aktualisieren
2. Artikel halb aktualisieren
3. Disclosure später ergänzen

Sondern:
```text
prepare
→ validate
→ gate
→ atomic_publish
```

Bei Fehler:
→ alter bekannter gültiger Snapshot bleibt aktiv.

## 6. Rollback

Jede Veröffentlichung erhält:
- version_id
- previous_version_id
- published_at
- source snapshot
- method snapshot
- policy version

Rollback muss ohne Neuberechnung des aktuellen Zustands möglich sein.

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
  "generated_at": "...",
  "published_at": "..."
}
```

## 8. Fail Closed

Wenn:
- Policy Engine fehlt
- Datenquelle unklar
- Gate nicht antwortet
- Versionen nicht kompatibel
- Required Metadata fehlt

→ BLOCK.

## 9. Keine autonome Ausnahme

Es gibt keine:
- "temporary bypass"
- "emergency publish"
- "probably safe"

Ausnahmen benötigen explizite Governance-Freigabe außerhalb des LLM.
