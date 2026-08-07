# SKILLS.md — Hermes Fähigkeiten & Skill-Bibliothek

## Skill-Übersicht

Jeder Skill ist eine spezialisierte Fähigkeit, die Hermes auf Abruf oder automatisch einsetzt.

---

## SKILL-01: Steuer-Content-Generator

**Trigger**: Wöchentlicher Cron / manueller Aufruf  
**Input**: Datum, Learnings, Ziel-Thema  
**Output**: 5-Kanal Social Media Posts

### Themen-Pool:
- `ruerup` — §10 EStG, Höchstbetrag 30.825 €, Break-Even Kalkulation
- `sparerpauschbetrag` — §20 Abs. 9 EStG, 1.000 €/2.000 €, Freistellungsauftrag
- `immobilien` — §21 EStG, AfA 2%/3%, Vertriebsmargen-Analyse
- `bav` — §3 Nr. 63 EStG, 8% BBG, Gehaltsumwandlung
- `defi_crypto` — §22 Nr. 3 EStG, Haltefrist, Staking-Einkünfte
- `elster` — ELSTER-Antragsformate, Vorauszahlungen, Anlage N

### Output-Formate:
```
LinkedIn  → 800-1.200 Zeichen, sachlich, 1 Emoji, Link
X/Twitter → 4 Tweets à 280 Zeichen, Hook-Thread-Format
Instagram → 5 Slides Text-Bauplan (kein Bild, nur Text)
TikTok    → 45-Sek Sprecher-Skript mit Zeitmarken
Telegram  → 300-400 Zeichen Markdown-Digest mit Link
```

---

## SKILL-02: Artikel-Qualitätsprüfer

**Trigger**: Vor jedem neuen Artikel-Commit  
**Prüft**:
- Mindestens 1x §-Paragraphen-Verweis
- Mindestens 1x Eurobetragsnennung
- BaFin-Disclaimer im Footer
- Kein Werbebezug, keine Produktempfehlung
- SEO: `<title>`, `<meta description>`, `<h1>` (genau 1x), JSON-LD

---

## SKILL-03: Anti-Shadowban-Checker

**Trigger**: Vor jedem Social Media Post  
**Methode**: Vergleicht neue Headlines gegen `Learnings.md`-Archiv (letzte 30 Tage)

### Regeln:
- Nie gleiche Satzanfänge wie Vorwoche
- Nie gleiche §-Kombination wie Vorwoche
- Mindest-Editierdistanz: 40% Zeichenänderung zu letzten Posts
- Keine direkten Produktnamen (kein "Rürup 2.0 von [Anbieter]")

---

## SKILL-04: Confidence-Score-Kalkulator

**Trigger**: Nach jeder AI-Antwort  
**Output**: `confidence_score` zwischen 0.0 und 1.0

| Kriterium | Max. Punkte |
|---|---|
| §-Paragraphen korrekt zitiert | 0.25 |
| Eurobeträge mathematisch korrekt | 0.25 |
| Tonalität NZZ-konform | 0.20 |
| Kein Werbebezug | 0.20 |
| Anti-Shadowban bestanden | 0.10 |
| **Gesamt** | **1.00** |

---

## SKILL-05: DeFi & Crypto Steuer-Analyse

**Aus Chat-Export**: Topic-Anforderung vom User  
**Trigger**: Explizite Anfrage oder Themen-Rotation

### Abdeckung:
- **Staking-Einkünfte**: §22 Nr. 3 EStG, Freigrenze 256 €
- **Lending / Liquidity Providing**: Zinseinkünfte → §20 EStG
- **Haltefrist**: 1 Jahr = steuerfrei (§23 Abs. 1 Nr. 2 EStG)
- **NFTs & Airdrops**: Bewertungszeitpunkt, Zufluss-Prinzip
- **Bridge-Risiko kommunizieren**: Smart-Contract-Audit-Pflicht
- **TVL-Analyse**: Wie TVL-Daten DeFi-Risiken anzeigen

### Output-Format (DeFi):
```
1. Gesetzliche Grundlage: §§ mit Jahresangabe
2. Berechnungsbeispiel: Konkreter Fall in Euro
3. Risiko-Matrix: Smart-Contract / Oracle / Bridge / Liquidität
4. Fazit: Rechnet es sich bei Steuerpflicht?
```

---

## SKILL-06: Whitepaper-Analyse (DeFi Research)

**Aus Chat-Export**: Whitepaper, Audits, Community, Historie  
**Trigger**: User schickt Whitepaper-URL oder Protokollname

### Analyse-Schema:
```
1. Protokoll-Typ: AMM / Lending / Yield / Bridge / L2
2. Token-Mechanismus: Inflationary / Deflationary / veToken
3. Smart-Contract-Risiko: Audit-Status, SLOC, Audit-Firma
4. Oracle-Risiko: Chainlink / Pyth / inhouse → Manipulation-Vektor
5. Bridge-Risiko: Trusted/Trustless, Asset-Backing, Hack-Historie
6. TVL-Trend: 30T / 90T / 1J — Wachstum oder Abfluss?
7. Community-Signale: GitHub-Aktivität, Forum, Governance-Participation
8. Steuerliche Einordnung: §§ EStG für deutsche Nutzer
9. Risiko-Rating: 1 (sehr gering) bis 5 (sehr hoch)
```

---

## SKILL-07: Marketing & Wachstum (SEO + Social)

**Trigger**: Content-Produktions-Zyklus

### SEO-Checkliste (automatisch bei jedem Artikel):
- [ ] Title ≤ 60 Zeichen, enthält Haupt-Keyword
- [ ] Meta Description 150-160 Zeichen
- [ ] H1 exakt einmal, enthält Keyword
- [ ] JSON-LD mit `@type: Article` oder `WebPage`
- [ ] Internal Links zu anderen Artikeln (min. 1)
- [ ] CTA zu Rechner auf index.html

### Keyword-Pool (hochwertig, low competition):
- "Rürup Rente sinnvoll Rechner" (250/Monat, CPC 3,20 €)
- "Sparerpauschbetrag 2026 einrichten" (180/Monat)
- "Steuersparimmobilien Erfahrungen" (320/Monat)
- "DeFi Steuern Deutschland 2026" (140/Monat)
- "Staking Steuerpflicht Deutschland" (210/Monat)

---

## SKILL-08: Risk Assessment

**Trigger**: Vor jeder KI-Ausgabe die veröffentlicht wird  
**Output**: Risiko-Flag oder Freigabe

### Risiko-Checks:
- [ ] Enthält der Post eine konkrete Anlageempfehlung? → BLOCKIERT
- [ ] Wird ein spezifisches Finanzprodukt empfohlen? → BLOCKIERT
- [ ] Fehlt BaFin-Disclaimer auf Artikelseiten? → WARNUNG
- [ ] Confidence Score < 0.70? → Statischen Fallback verwenden
- [ ] AI-Provider fehlgeschlagen? → Nächsten Fallback aktivieren
