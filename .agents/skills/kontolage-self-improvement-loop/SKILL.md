---
name: kontolage-self-improvement-loop
description: Steuerungs-Loop für messbare Verbesserung: KPI-Snapshot, eine Hypothese, eine Änderung, sieben Tage Messung, Learnings-Eintrag, Rollout oder Rollback. Verhindert unbelegte Optimierung und unzuordenbare Paralleländerungen.
---

# Kontolage Self-Improvement Loop

## Zweck

Hermes verbessert sich nicht durch Behauptung, sondern durch Messung. Dieser Skill legt fest, wie Verbesserungen geplant, durchgeführt, bewertet und dauerhaft gespeichert werden. Er sichert die Tickets H-04 und P2-06 ab und ist die Klammer um alle anderen Skills.

## Trigger

- Montag nach dem Content-Lauf (Wochenzyklus, SOP-012)
- nach einem Incident (Retrospektive, sofort)
- bei jedem neuen Hypothesen-Kandidaten aus Learnings, Search-Console-Daten oder Nutzerfeedback

## Ablauf

1. **KPI-Snapshot** erheben und ablegen (`.agents/kpi-snapshot.json` oder Wochenbericht):
   - SEO: indexierte URLs, Sitemap-Abdeckung, Canonical-Fehler, Rich-Result-Fehler
   - Produkt: Registrierungen, bestätigte Konten, Checkout-Starts, Abschlüsse, Kündigungen
   - Betrieb: Deploy-Erfolgsquote, Webhook-Fehler, Uptime
   - Reichweite: Newsletter-Anmeldungen, Kanal-Interaktionen
2. **Genau eine Hypothese** formulieren: „Wenn X, dann Y, gemessen an Z über 7 Tage."
3. **Erwartungswert vorab notieren** (Zielkorridor), damit das Ergebnis nicht nachträglich schöngeredet wird.
4. **Eine Änderung pro Woche** umsetzen. Keine Paralleländerungen, keine „Sammeloptimierungen".
5. **Messen und protokollieren:** Eintrag in `obsidian_vault/04_SEO_And_Growth_Experiments/` mit Ausgangswert, Zielwert, Messwert, Datum, Entscheidung.
6. **Learnings-Eintrag** in `obsidian_vault/Learnings.md` — auch bei negativem Ergebnis (genau daraus entsteht der Wert).
7. **Rollout oder Rollback** dokumentieren. Rollback ist ein Erfolg der Methode, kein Fehler.
8. **Nächste Hypothese** aus den Learnings ableiten und im Kanban als Ticket vormerken.

## Experiment-Register (Auszug, fortlaufend gepflegt)

| Woche | Hypothese | Metrik | Ergebnis | Entscheidung |
|---|---|---|---|---|
| KW 36 | §-Nennung in Zeile 1 erhöht Klicks | Klickrate Social | offen | beobachten |
| KW 37 | Rechner-Link am Artikelende erhöht Registrierungen | Registrierungen/Artikel | offen | beobachten |

## Checks

| Prüfung | Verstoß |
|---|---|
| mehr als eine Änderung pro Woche | Fehler — Zuordnung unmöglich |
| kein Ausgangswert dokumentiert | Fehler |
| kein Learnings-Eintrag | Fehler — Wochenreport unvollständig |
| Zielwert nachträglich geändert | Fehler |
| Ergebnis nur behauptet, nicht gemessen | Fehler |
| Experiment ohne Ticketbezug | Warnung |

## Ausgabeformat

```json
{
  "week": "2026-KW40",
  "hypothesis": "…",
  "metric": "…",
  "baseline": 0,
  "target": 0,
  "measured": 0,
  "decision": "rollout | rollback | continue",
  "confidence_score": 0.0,
  "decision_reason": "…",
  "affected_parameters": ["…"],
  "generated_at": "ISO-8601"
}
```

## Fail-Closed

- Ohne Ausgangswert keine Bewertung, ohne Bewertung kein Rollout.
- Ohne Learnings-Eintrag gilt der Wochenlauf als nicht abgeschlossen (kein „still weiterlaufen").
- Nie mehrere Änderungen gleichzeitig, nie Zielwerte nachträglich anpassen.
- Kein Rollout von Änderungen an Rechtstexten, Preisen oder Compliance-Regeln über diesen Loop — dafür gelten `kontolage-legal-compliance-gate` und `kontenlage-publish-gate`.
