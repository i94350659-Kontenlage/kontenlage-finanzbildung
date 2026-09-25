---
name: kontolage-brand-consistency-guardian
description: Erzwingt den Marken-Kanon "Kontolage" in allen öffentlichen Ausgaben und prüft Tonalität, Anrede, Zahlenformate und Disclaimer-Konsistenz. Meldet und behebt die historische Schreibweise "Kontenlage" außerhalb technischer Identifikatoren.
---

<!-- brand-allow: legacy-spelling — dieser Skill dokumentiert die abweichende Schreibweise ausdrücklich und darf sie deshalb nennen. -->

# Kontolage Brand Consistency Guardian

## Zweck

Eine Marke mit zwei Schreibweisen verliert Sichtbarkeit, Vertrauen und Wiedererkennung. Dieser Skill hält Produkttexte, Metadaten, Artikel, Social-Beiträge und Dokumentation konsistent. Er sichert Ticket P1-07 ab.

## Trigger

- vor jeder Veröffentlichung (Teil des Publish-Pfads)
- bei neuen Artikeln, Metadaten, E-Mail-Vorlagen, Social-Beiträgen
- wöchentlich als Repository-Scan

## Regeln (Kanon)

1. **Schreibweise:** „Kontolage" — nie „Kontenlage", „Kontenlage.de", „KontenLage".
2. **Domain:** `kontolage.de` (kleingeschrieben), Produktname „Kontolage".
3. **Absender:** E-Mails von `kontolage.de`, Anzeigename „Kontolage".
4. **Anrede:** Produkttexte in Sie-Form, Social-Beiträge in Du-Form; innerhalb eines Dokuments nicht mischen.
5. **Zahlen und Einheiten:** deutsches Format (`1.000 €`, `12,5 %`), Paragraphen mit Gesetz (`§ 20 Abs. 9 EStG`), Daten als `TT.MM.JJJJ` oder ISO.
6. **Disclaimer:** identischer Wortlaut in Artikeln und Rechnern (WpHG § 2 Abs. 8 Nr. 10, keine Einzelfallberatung).
7. **Ausnahmen:** technische Identifikatoren (Repository-Name `kontenlage-finanzbildung`, bestehende Skill-IDs `kontenlage-*`, historische Commit-Messages) bleiben unverändert — sie werden dokumentiert, nicht kosmetisch umbenannt.

## Ablauf

1. Repository-Scan: `src/`, `public/`, `.figma/`, `supabase/templates/`, `docs/`, `.agents/` nach abweichenden Schreibweisen durchsuchen.
2. Treffer klassifizieren: öffentlicher Text (muss korrigiert werden) vs. technischer Identifier (Ausnahme dokumentieren).
3. Korrektur als eigener Commit („chore(brand): canonical Kontolage spelling"), damit der Diff prüfbar bleibt.
4. Stichprobe im Live-Bundle: darf „Kontenlage" nicht mehr enthalten (außer in Hostnamen wie `kontenlage-finanzbildung.vercel.app`).
5. Ergebnis im Kanban und im Skills-Changelog vermerken.

## Checks

| Prüfung | Sollwert | Verstoß |
|---|---|---|
| öffentliche Texte | ausschließlich „Kontolage" | Fehler |
| Metadaten (Title/OG) | Marke korrekt geschrieben | Fehler |
| E-Mail-Templates | Absender und Signatur korrekt | Fehler |
| Anrede | konsistent innerhalb eines Dokuments | Warnung |
| Disclaimer-Wortlaut | identisch zum Referenztext | Warnung |
| technische Identifier | unverändert und dokumentiert | Warnung bei fehlender Doku |

## Ausgabeformat

```json
{
  "decision": "publish | block",
  "confidence_score": 0.0,
  "decision_reason": "…",
  "violations": [{"file": "…", "line": 0, "text": "…", "class": "public|technical"}],
  "generated_at": "ISO-8601"
}
```

## Fail-Closed

- Eine abweichende Schreibweise in einem öffentlichen Text blockiert die Veröffentlichung dieses Textes.
- Ein pauschales Umbenennen technischer Identifier ist untersagt (Bruch von Builds, Skills und Links) — Ausnahmen werden explizit dokumentiert.
