# Kontenlage / Hermes — Übergabe- und Bauanleitung v5.2

**Zielgruppe dieses Dokuments:** jede KI oder jeder Entwickler, der dieses Skill-System technisch implementiert oder weiterbaut.
**Status:** technische Governance-Spezifikation. Kein Ersatz für anwaltliche Prüfung.

---

## 1. Was hier gebaut wird

Kontenlage ist eine **Financial-Research- und Bildungsplattform**, keine Anlageberatung. Hermes ist das KI-System dahinter. Es gibt zwei getrennte Betriebsmodi:

- **PUBLIC MODE** — Inhalte für kontenlage.de. Streng reguliert (WpHG/MiFID-II, MAR). Nie personalisiert, nie empfehlend.
- **PRIVATE OWNER MODE** — persönliche Recherche- und Entscheidungsunterstützung ausschließlich für den Betreiber ("Owner"), session-/flag-gebunden, nicht öffentlich.

Beide Modi teilen sich Prinzipien, aber **keine Daten laufen automatisch vom privaten in den öffentlichen Pfad** (siehe Data Firewall, Abschnitt 5).

---

## 2. Nicht verhandelbare Prinzipien

Diese Regeln dürfen von keinem Skill, keinem Prompt und keiner "Optimierung" aufgeweicht werden:

1. **Fail-closed.** Jeder Zweifel, jeder Fehler, jede fehlende Angabe → BLOCK, nicht "best effort publish".
2. **Das LLM schlägt vor, es entscheidet nicht final.** Compliance-Klassifikation (A–F) läuft immer durch eine deterministische Regel-Engine. Das LLM kann sich nicht selbst freischalten.
3. **Keine Selbstverschärfung/-lockerung.** Eine einmal vergebene Compliance-Klasse darf nicht durch Umformulierung, "semantisches Umschiffen" oder Kontextwechsel verändert werden. Prüfung ist immer materiell/semantisch, nie nur Keyword-basiert.
4. **Provenance ist Pflicht.** Jede Aussage mit Faktencharakter muss bis zur Quelle zurückverfolgbar sein. Kein Score ohne `fact_id`/`source_id`.
5. **Keine Fake-Präzision.** Bewertungen sind qualitative Bänder (niedrig/mittel/hoch), keine erfundenen Dezimalwerte.
6. **Freshness ist eine eigene Achse**, getrennt von Quellenqualität (Evidence). TTL ist Policy, nicht Naturgesetz — zentral versioniert, nicht in jedem Skill hart codiert.
7. **Evidence-Quorum ist fit-for-purpose.** "Mindestens 1 Tier-1-Quelle" gilt nicht universell — bei DeFi/On-Chain-Daten ist die passende Primärquelle das Protokoll selbst, nicht BaFin/EZB.
8. **Aussageklasse (A–F) und Datenstatus (GRÜN/GELB/ROT) sind orthogonale Achsen.** Ein hochkonfidenter Fakt (GRÜN) kann trotzdem Class E/F sein, wenn er personalisiert oder empfehlend formuliert ist.
9. **Private Mode ist nicht "regulierungsfrei".** Er ist nur ein anderer Vertrauens-/Sichtbarkeitskontext. § 2 Abs. 8 Nr. 10 WpHG und MAR gelten dem Grundsatz nach unabhängig davon, ob eine Aussage öffentlich oder privat erfolgt — der Private Layer reduziert *Publikationsrisiko*, nicht *regulatorische Einordnung*. Konkret bedeutet das: keine automatische Orderausführung, keine Behauptung von Lizenzfreiheit, explizite Owner-Freigabe vor jeder Transaktion.
10. **Private → Public ist keine Einbahnstraße nach vorn.** Private Recherche wird niemals direkt als öffentliche Evidence verwendet. Wiederverwendung erfordert Re-Verifikation im öffentlichen Research-Pfad.

---

## 3. Architekturübersicht

```text
PUBLIC PIPELINE
────────────────────────────────────────
SOURCE
  ↓
kontenlage-source-evaluator        (Research, Provenance, Freshness)
  ↓
kontenlage-scoring-engine          (Risk/Opportunity/Evidence/Freshness-Bänder)
  ↓
kontenlage-content-drafter         (neutrale Texte)
  ↓
kontenlage-archetype-quiz-maintainer (nur bei Profil-Tool)
  ↓
kontenlage-wphg-guardrails         (Class A–F, WpHG-Pfad, MAR-Pfad — LLM schlägt vor)
  ↓
kontenlage-publish-gate            (deterministisch, fail-closed, atomar)
  ↓
PUBLISH (kontenlage.de)

parallel/regressiv, nie im Publish-Pfad selbst:
kontenlage-audit-redteam           (adversarial testing, blockt nichts live, meldet nur)


PRIVATE OWNER LAYER
────────────────────────────────────────
Owner-Anfrage
  ↓
kontenlage-private-router          (Auth-Check is_private_owner==true, Intent-Routing)
  ↓                    ↓
kontenlage-private-   kontenlage-private-
platform-research     investment-intelligence
  ↓                    ↓
        DATA FIREWALL (kein automatischer Pfad → Public)
```

---

## 4. Skill-Übersicht (Kurzreferenz)

| Skill | Rolle | Darf entscheiden? |
|---|---|---|
| `kontenlage-source-evaluator` | Fakten extrahieren, Quellen bewerten, Widersprüche erkennen | Nein — nur Rohdaten liefern |
| `kontenlage-scoring-engine` | Risk/Opportunity/Evidence/Freshness-Bänder berechnen | Nein — `proposed_compliance_class` ist nur Vorschlag |
| `kontenlage-content-drafter` | Neutrale Bildungstexte erzeugen | Nein — Compliance-Freigabe extern |
| `kontenlage-archetype-quiz-maintainer` | Deterministisches Archetyp-Quiz | Nein — feste Regeln, kein KI-Inferenz auf Nutzerebene |
| `kontenlage-wphg-guardrails` | Materielle Compliance-Klassifikation (WpHG + MAR) | LLM schlägt vor, Policy Engine entscheidet final |
| `kontenlage-publish-gate` | Letzte, deterministische Freigabe vor Veröffentlichung | Ja, aber rein regelbasiert, kein LLM-Ermessen |
| `kontenlage-audit-redteam` | Adversarial-Tests gegen alle obigen Skills | Nein — testet nur, publiziert nie |
| `kontenlage-private-router` | Auth + Intent-Routing für den Owner | Nein — reines Gate |
| `kontenlage-private-platform-research` | Live-Recherche zu konkreten Plattformen/Konditionen | Nein — liefert recherchierte Fakten + Risiken |
| `kontenlage-private-investment-intelligence` | Persönliche Szenarien, Risiko-/Exit-Analyse, Decision Journal | Nein — Owner entscheidet immer selbst |

---

## 5. Data Firewall (Public/Private-Trennung)

```text
PRIVATE_SOURCE → PRIVATE_EVIDENCE → PRIVATE_SCORE → PRIVATE_OWNER_ONLY-Output
```

Es gibt **keinen** direkten Pfeil `PRIVATE → PUBLIC`. Wenn eine private Recherche später öffentlich verwendet werden soll:

```text
PRIVATE (Ausgangspunkt/Idee)
  ↓
RE-VERIFY über kontenlage-source-evaluator (öffentlicher Pfad, neue source_id)
  ↓
PUBLIC EVIDENCE
  ↓
normaler Public-Pipeline-Durchlauf
```

`kontenlage-audit-redteam` muss regelmäßig aktiv testen, ob dieser Damm hält (siehe `privacy_boundary_test` im Red-Team-Skill).

---

## 6. Build-Reihenfolge für die implementierende KI

1. **Fundament zuerst:** `source-evaluator` + zentrale TTL-/Decay-Policy (nicht in Skills hart codieren, sondern als eigenes versioniertes Policy-Objekt, z. B. `market_rate_default_v2`).
2. **Scoring** auf Basis der Evidence-Bundles.
3. **Compliance-Engine** (`wphg-guardrails`) als deterministische Policy Engine implementieren — technisch getrennt vom Content-LLM (eigener Service/eigene Funktion, kein reiner Prompt).
4. **Publish-Gate** als letzten, unabhängigen Schritt — atomarer Publish, Rollback-fähig, mit Kill-Switch.
5. **Content-Drafter** und **Archetype-Quiz** erst danach anschließen.
6. **Red-Team** von Anfang an parallel mitlaufen lassen, nicht erst am Ende — jede Policy-Änderung braucht die Regressionsmatrix aus dem Red-Team-Skill.
7. **Private Layer** technisch komplett isoliert bauen (eigener Auth-Kontext, eigene Datenhaltung), erst wenn der Public-Pfad steht. Kein gemeinsamer Speicher für Private- und Public-Evidence.
8. Vor Produktivgang des öffentlichen personalisierten Profil-/Archetypen-Tools: **Prüfung durch einen auf Kapitalmarktrecht spezialisierten Rechtsanwalt** (User-Flow und tatsächliche Outputs, nicht nur die Spezifikation).

---

## 7. Rechtlicher Rahmen (Kontext, keine Rechtsberatung)

Relevante Regime, die die Skills operationalisieren, ohne sie zu ersetzen:

- **WpHG / MiFID II** — Anlageberatung liegt u. a. vor bei persönlicher Empfehlung zu bestimmten Finanzinstrumenten, die auf persönlichen Umständen beruht oder als geeignet dargestellt wird, und nicht ausschließlich öffentlich verbreitet wird (§ 2 Abs. 8 Nr. 10 WpHG). Automatisierte Prozesse (Robo-Advice) heben die Erlaubnispflicht nicht auf.
- **MAR Art. 3 Abs. 1 Nr. 35** — "Anlageempfehlungen" umfassen auch öffentliche, nicht personalisierte Inhalte mit expliziter oder impliziter Strategie-/Werteinschätzung. Rechtsfolge ist hier primär eine Offenlegungs-/Sorgfaltspflicht (u. a. Art. 20 MAR: objektive Darstellung, Interessenkonflikte offenlegen), keine Erlaubnispflicht.
- **ESMA-Leitlinien** betonen die materielle Funktion einer Aussage über die reine Wortwahl — automatisierte, App-basierte oder scheinbar rein informative Formate sind einbezogen, wenn sie faktisch Kauf-/Verkaufsentscheidungen nahelegen.

Alle drei Regime sind in den Skills als **getrennte, gleichzeitig zu prüfende Gates** modelliert (Datenstatus / Aussageklasse / Rechtsregime), nicht als eine einzige Ampel.

---

## 8. Bekannte offene Punkte (bewusst nicht im Skill-Text final entschieden)

Diese Punkte sind Betreiber-/Infrastruktur-Entscheidungen, keine Skill-Logik, und müssen vor Produktivbetrieb konkret ausgefüllt werden:

- **Auth-Mechanismus** für `is_private_owner` (Token-Typ, TTL, Rate-Limiting) — siehe `private-router` §1.1.
- **Reale `producer`-Identität** für Disclosure Contract — siehe `wphg-guardrails` §8.1.
- **Konkrete Aufbewahrungsfrist** für Audit-Logs — siehe `publish-gate` §7.1.
- **Benannte verantwortliche Person** für Kill-Switch-Eskalation und deren Reaktionsfrist — siehe `publish-gate` §7.2.
- **Datenschutz-Folgenabschätzung** für den Private Layer vor Launch — siehe `private-router` §3.
- Testfrequenz für `kontenlage-audit-redteam` (nicht nur reaktiv bei Policy-Änderung, sondern z. B. auch periodisch/bei jedem Publish).
- Rate-/Kostenlimit für die Live-Search-Pflicht im Private Layer.
- Verhalten bei mehreren Owners (aktuell als Einzel-Owner-Konzept modelliert).

Diese Liste ersetzt keine juristische oder sicherheitstechnische Prüfung, sondern markiert nur, wo dieses Spezifikationspaket bewusst an den Betreiber übergibt.

## 9. Versionierung

- Jede Änderung an Archetypen, Gewichtungen, Fragen, Grenzwerten, TTL-Policy oder Compliance-Regeln = **Methodology/Policy Change** → Version erhöhen, Change Log, Regression Test, dann erst Publish.
- Dieses Paket ist **v5.1**. Nachfolgeversionen bitte mit Change Log gegenüber diesem Dokument versehen.
