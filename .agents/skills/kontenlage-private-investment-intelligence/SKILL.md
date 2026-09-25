---
name: kontenlage-private-investment-intelligence
description: Erstellt persönliche Anlage-Szenarien, quantitative Risikoanalysen, Exit-Strategien und ein mathematisch kalibriertes Decision Journal exklusiv für den Owner. Personalisiert und konkret, aber nicht regulierungsfrei — der Owner entscheidet immer selbst, keine automatische Ausführung.
---

# Kontolage Private Investment Intelligence & Quantitative Prediction Engine v6.0

## 0. Warum frühere LLM-Predictions ungenau waren (Root-Cause-Analyse)
Reine Sprachmodelle neigen ohne strenge Leitplanken zu:
1. **Scheinpräzision ohne quantitative Basis** (vage Vorhersagen wie "Krypto wird mittelfristig steigen" oder "Zinsen sinken wahrscheinlich").
2. **Fehlenden Konfidenzbändern**: Punktprognosen statt probabilistischer Monte-Carlo-Verteilungen (P10, P50, P90).
3. **Mangelndem Regime-Bewusstsein**: Keine Unterscheidung zwischen expansiven, stagflationären oder restriktiven Liquiditätsphasen.
4. **Fehlendem Feedback-Loop**: Keine automatische Überprüfung früherer Vorhersagen gegen reale Marktdaten am Stichtag (`review_date`).

---

## 1. Das 5-Faktoren Quantitative Regime-Modell (Pflicht vor jeder Prediction)
Jede private Markteinschätzung an den Owner MUSS zwingend folgende 5 mathematischen Faktoren berechnen:

1. **Zentralbank-Divergenz & Taylor-Rule**:
   - EZB Einlagezins vs. Fed Funds Rate vs. Kerninflationsrate (PCE / HICP).
   - Realzins-Berechnung: `Realzins = Nominalzins - Forward-Inflationserwartung (5y5y Swaps)`.
2. **Zinsstrukturkurven-Momentum (Yield Curve)**:
   - 10Y minus 2Y Spread (US-Treasuries & deutsche Bundesanleihen).
   - Regime: Invertiert (Rezessiv), Steiler werdend nach Inversion (Liquiditätsschock/Disinflation), Flach (Transition).
3. **Global Net Liquidity Index**:
   - Zentralbankbilanzen (Fed + EZB + BoJ + PBoC) abzüglich TGA (Treasury General Account) und RRP (Reverse Repo).
   - Trend: Expansiv (+), Neutral (0), Kontraktiv (-).
4. **Volatilitäts- & Risiko-Perzentil**:
   - VIX (S&P) und V2TX (EuroStoxx 50) im 1-Jahres-Perzentil (<15 = Complacency, 15-25 = Normal, >30 = High Stress).
5. **On-Chain & Liquiditätstiefe (bei Krypto/DeFi)**:
   - Stablecoin-Nettozuflüsse auf Börsen (USDT/USDC Supply Momentum).
   - Funding Rates & MVRV Z-Score (Mean Reversion Indikator).

---

## 2. Deterministisches Output-Format für Private Predictions
Predictions an den Owner dürfen NIEMALS reine Fließtexte sein. Sie MÜSSEN folgende Struktur aufweisen:

```json
{
  "timestamp": "2026-09-12T20:00:00Z",
  "prediction_id": "PRED-2026-09-12-01",
  "macro_regime": "Easing Pivot / Disinflationary Window",
  "affected_asset_classes": ["Euro-Staatsanleihen (Duration)", "Gold", "Aktien-ETFs"],
  "confidence_score": 0.82,
  "confidence_calibration": "Brier-calibrated based on historical yield spread correlation",
  "probabilistic_scenarios": {
    "bear_case_p10": {
      "probability": "15%",
      "trigger": "Kerninflation zieht unerwartet über 2,9 % an; EZB pausiert Zinssenkungen",
      "impact": "Tagesgeld bleibt stabil bei 3,0%; Anleihen-Kurse korrigieren um -4,2%"
    },
    "base_case_p50": {
      "probability": "65%",
      "trigger": "EZB senkt Einlagezins schrittweise um 50 Basispunkte auf 2,75%",
      "impact": "Tagesgeldzinsen fallen auf 2,2-2,5%; 7-10Y Bundesanleihen erzielen +5,5% bis +7,8% Gesamtrendite"
    },
    "bull_case_p90": {
      "probability": "20%",
      "trigger": "Aggressivere Zinsschritte wegen schwacher EU-Industriedaten (PMI < 45)",
      "impact": "Tagesgeld fällt unter 2,0%; langlaufende Anleihen & Gold haussieren (+12%)"
    }
  },
  "deterministic_action_triggers": [
    "WENN Rendite 10Y Bundesanleihe < 2,10% FÄLLT -> 20% der Renten-Allokation in kurzlaufende Festgelder/Tagesgeld rotieren",
    "WENN Gold-Spot über 2.650 €/Unze bricht -> Rebalancing-Quote prüfen (Gewinnmitnahme nach § 23 EStG steuerfrei)"
  ],
  "decision_reason": "Realzins-Kompression im Euroraum erfordert aktives Reinvestment-Management weg von reinem Tagesgeld.",
  "review_date": "2026-11-15",
  "backtest_checkpoint": "Automatic verification of actual vs predicted rates on 2026-11-15"
}
```

---

## 3. Decision Journal & Backtesting-Loop
1. Jede Prediction wird mit eindeutiger ID und Zeitstempel in der Backend-DB (`hermes_private_predictions`) abgelegt.
2. Am `review_date` führt Hermes einen automatischen Abgleich durch:
   - **Tatsächlicher Marktwert** vs. **Prognostizierter Korridor**.
   - Berechnung des Vorhersagefehlers (Mean Absolute Error).
   - Selbstjustierung der Vertrauens-Scores: Wenn Vorhersagen in einem Asset ungenau waren, senkt das System automatisch das `confidence_score` für dieses Asset, bis das Modell nachjustiert ist.

---

## 4. Governance & Firewall
- Ausschließlich sichtbar für den Owner (`is_private_owner == true`).
- Keine unbegründeten "Top-Optionen".
- Der Owner entscheidet immer eigenhändig. Keine automatische Orderausführung.
