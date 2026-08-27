---
name: kontenlage-private-platform-research
description: Führt Live-Recherche zu konkreten Broker-, Bank- oder DeFi-Plattformen durch. Liefert aktuelle Tarife, Gebühren, KYC-Abläufe, Regulierungs-Einordnung und Schritt-für-Schritt-Anleitungen exklusiv für den Owner. Kein Regulierungs-Bypass, kein automatischer Übertrag in den öffentlichen Pfad.
---

# Kontenlage Private Platform Research v5.1

## 0. Kernprinzip

Live-Daten sind Pflicht. Kein Vertrauen auf Trainingsdaten für Konditionen, Regulierungsstatus oder Angebote.

## 1. Live-Search-Mandat

Bei Anfragen zu "aktuell", "beste", "günstigste", "APY", "Aktion", Gebühren oder Konditionen **muss** eine echte Websuche/Live-Quelle herangezogen werden. Niemals veraltete Modellkenntnisse für Preise oder Bedingungen verwenden.

## 2. Regulatorischer Entity-Check (Pflichtschritt vor jeder Regulierungsaussage)

Eine Aussage wie "reguliert von X" darf nie unreflektiert aus einer Suchantwort übernommen werden. Prüfe getrennt:

```text
legal_entity
  ↓
licensed_entity (ist das die Entität, die tatsächlich die Lizenz hält?)
  ↓
regulator (welche Behörde, welches Land?)
  ↓
license/scope (welche Tätigkeiten deckt die Lizenz konkret ab?)
  ↓
which service is regulated? (deckt die Lizenz genau den Service, um den es geht?)
```

Hintergrund: Ein Unternehmen kann in einem Land tätig sein, ohne dass jede angebotene Leistung unter dieselbe Regulierung fällt — besonders relevant bei Neo-Brokern, Krypto-Anbietern, ausländischen Instituten und Gruppenstrukturen. Bei Unsicherheit: Regulierungsstatus als "zu verifizieren" kennzeichnen, nicht als Fakt behaupten.

## 3. Strukturierter Output

- **Plattform-Name & Jurisdiktion** inkl. Ergebnis des Entity-Checks (Abschnitt 2).
- **Aktuelle Konditionen** (Zins/Gebühren), mit Stand-Datum der Suche.
- **Kontoeröffnung:** exakte Schritte, benötigte Dokumente (KYC-Maske).
- **Ein-/Auszahlung:** Dauer, Methoden, versteckte Kosten.
- **Risiken:** spezifische Plattformrisiken (z. B. Einlagensicherung nur für Verrechnungskonto, nicht für Wertpapiere).
- **Exit-Pfad:** siehe Abschnitt 5 — Pflichtbestandteil, kein optionaler Zusatz.

## 4. Ausfüllhilfe bei Masken/Formularen — harte Grenze

Hermes darf erklären, was ein Feld bedeutet ("Hier wird nach Steueransässigkeit gefragt, das bedeutet ..."). Hermes darf **nicht** Angaben empfehlen oder ausfüllen, die auf unsicheren Annahmen über den Owner beruhen (z. B. "Klicke Deutschland, weil du vermutlich ..."). Fehlende Owner-Angaben werden erfragt, nicht erraten.

## 5. Exit-Before-Entry (Pflichtregel)

**Keine Plattform/Variante wird als Top-Option dargestellt, bevor der Exit-Pfad recherchiert und dargestellt wurde.**

Bei DeFi: Entry → Yield → Lock-up? → Liquidity → Withdraw → Bridge → Gas → Slippage → Failure Mode.

Bei Broker/Bank: Einzahlung → Verwahrung → Kündigung → Übertragung → Auszahlung → Sperrungsfall → Insolvenzfall.

## 6. Private Guardrails

- Darf konkrete Produktnamen und Anbieter nennen.
- Muss dennoch auf Risiken hinweisen (keine blinde Euphorie).
- Darf **niemals** direkt in `kontenlage-content-drafter` oder einen anderen Public-Pfad-Skill einspeisen (siehe Data Firewall im Router-Skill).
- Sprache: "aktuell stärkste Variante unter den genannten Prioritäten" statt "beste Option" — siehe `kontenlage-private-investment-intelligence` §4 für die Begründungspflicht.

## 7. Output

```json
{
  "platform_name": "...",
  "entity_check": {
    "legal_entity": "...",
    "licensed_entity": "...",
    "regulator": "...",
    "license_scope": "...",
    "service_covered": "verified|unverified|mismatch"
  },
  "conditions_as_of": "...",
  "account_opening_steps": [],
  "deposit_withdrawal": {},
  "risks": [],
  "exit_path": [],
  "scope": "PRIVATE_OWNER_ONLY"
}
```
