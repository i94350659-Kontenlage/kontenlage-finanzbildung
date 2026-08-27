---
name: kontenlage-private-investment-intelligence
description: Erstellt persönliche Anlage-Szenarien, Risikoanalysen, Exit-Strategien und ein Decision Journal exklusiv für den Owner. Personalisiert und konkret, aber nicht regulierungsfrei — der Owner entscheidet immer selbst, keine automatische Ausführung.
---

# Kontenlage Private Investment Intelligence v5.1

## 0. Kernprinzip

Maximale Detailtiefe und persönliche Relevanz, aber fundiert, risikobewusst und **ohne die Fiktion, dass Personalisierung automatisch außerhalb regulierter Anlageberatung liegt** (siehe `kontenlage-private-router` §0). Jede "Top-Variante" ist eine Analyse für den Owner, keine öffentliche Empfehlung und keine automatische Handlungsanweisung.

## 1. Analyse-Rahmen

1. Ziel des Owners verstehen (z. B. "Inflationsschutz für X € bei monatlicher Verfügbarkeit").
2. Live-Recherche der aktuellen makroökonomischen Lage (EZB-Zins, Markttrends) — Pflicht, keine Trainingsdaten für aktuelle Werte.
3. Entwicklung von 2–3 konkreten Szenarien mit klar benannten Annahmen.

## 2. Output-Struktur

1. **Executive Summary** — klare, direkte Einschätzung.
2. **Top-Varianten** — konkrete Aufstellung mit Vor- und Nachteilen.
3. **Schritt-für-Schritt-Vorgehensweise** — Verweis auf `kontenlage-private-platform-research` für Detailrecherche.
4. **Exit-Strategie** — Pflichtabschnitt vor jeder finalen Einordnung (siehe Exit-Before-Entry in `kontenlage-private-platform-research` §5). Wie kommt das Geld im Notfall oder bei Zieländerung wieder raus?
5. **Risiken** — explizite Nennung von Worst-Case-Szenarien.

## 3. Private Guardrails

- Darf persönliche Bezüge herstellen ("Für deine Situation mit...").
- Darf konkrete ISINs oder Plattformen als Variante benennen, **immer mit dem Hinweis**: "Dies ist eine Analyse für dich als Owner, keine öffentliche Empfehlung, keine automatische Ausführung."
- Erzwingt Live-Recherche für alle aktuellen Rendite- oder Zinsangaben.
- Keine automatische Orderausführung. Jede Transaktion erfordert explizite, separate Owner-Freigabe.

## 4. Begründungspflicht statt Absoluturteil

Nie unbegründet "aktuell beste Option". Stattdessen immer:

```text
"Aktuell stärkste Variante unter deinen angegebenen Prioritäten."

Warum vorne:
+ [Kriterium, z. B. Kosten]
+ [Kriterium, z. B. Liquidität]
+ [Kriterium, z. B. Sicherheit]
- [Trade-off, z. B. geringere Rendite]

Größte Unsicherheit: ...
Warum nicht Alternative B: ...
```

Ziel: verhindern, dass "Top" zu einem unbegründeten Absoluturteil wird.

## 5. Decision Journal (Pflichtfunktion)

Bei jeder privaten Entscheidungsempfehlung wird ein strukturierter Eintrag erzeugt und gespeichert:

```json
{
  "decision_id": "...",
  "date": "2026-08-22",
  "question": "Wo soll Kapital X geparkt werden?",
  "assumptions": ["Liquiditätsbedarf hoch", "Horizont 12 Monate", "Ziel: Kapitalerhalt"],
  "options_considered": ["A", "B", "C"],
  "chosen_option": "...",
  "reasoning": "...",
  "rejected_options_reasoning": "...",
  "biggest_uncertainty": "...",
  "review_date": "2026-11-22",
  "scope": "PRIVATE_OWNER_ONLY"
}
```

Zweck: spätere Überprüfbarkeit — "War die damalige Entscheidung unter den damaligen Informationen sinnvoll?" statt reiner Ergebnisbewertung im Nachhinein. Bei Review-Fälligkeit prüft Hermes, ob sich Annahmen oder Konditionen wesentlich geändert haben, und meldet das aktiv.

**Datenschutz:** Journal-Einträge unterliegen den Regeln aus `kontenlage-private-router` §3 (Rechtsgrundlage, Löschkonzept, Verschlüsselung). Der Owner kann jeden Eintrag einzeln oder die gesamte Historie löschen lassen; ein `deleted_at`-Feld ersetzt dabei den Eintrag, harte Löschung erfolgt nach der definierten Frist auch aus Backups.

## 6. Data Firewall

Wie in `kontenlage-private-router` §3: kein automatischer Übertrag von Inhalten dieses Skills in `kontenlage-content-drafter`, `kontenlage-scoring-engine` (Public-Instanz) oder `kontenlage-publish-gate`. Re-Verwendung nur über den öffentlichen Re-Verify-Pfad mit neuer, öffentlicher `source_id`.

## 7. Output

```json
{
  "scenario_set": [],
  "executive_summary": "...",
  "exit_strategy": {},
  "risks": [],
  "decision_journal_entry_id": "...",
  "disclaimer": "private_owner_analysis_not_public_recommendation_no_automatic_execution",
  "scope": "PRIVATE_OWNER_ONLY"
}
```
