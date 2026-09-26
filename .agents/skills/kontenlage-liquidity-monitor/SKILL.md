---
name: kontenlage-liquidity-monitor
description: Autonomous DeFi Liquidity, Stablecoin De-peg, Yield and Bridge Risk Engine for Kontolage Owner. Integrates DeFiLlama API, Uniswap/Curve pool depth monitoring, TVL momentum divergence, and Telegram emergency alerts. Strictly mathematical scoring, no LLM hallucinations.
---

# Kontolage DeFi Liquidity & Risk Monitor

## Mission & Architecture (Fail-Closed)
Monitors on-chain liquidity pools, stablecoin peg stability (USDC, EURC, USDT, sDAI), and smart contract exploit indicators.

## Core Thresholds & Triggers
- **TVL Crash 24h:** > -15% → Immediate Emergency Alert
- **TVL Warning 7d:** > -10% → Advisory
- **Stablecoin De-peg:** > 0.5% (Advisory), > 1.5% (Critical Action Alert)
- **Ponzi Yield Filter:** APY > 3.5x median pool yield flagged as anomalous risk

## Execution Script
Runs via `scripts/hermes_defi_researcher.js` in three modes:
- `flash`: Daily background pulse check
- `deep`: Full Tuesday/Friday audit with backtest verification
- `emergency`: Immediate alert triggered on TVL crash or de-peg event

## Betriebsblock (Hermes-Konvention)

- **Zweck**: Frühwarnung für DeFi-Liquiditäts-, Stablecoin-Peg- und Bridge-Risiken mit rein mathematischer Bewertung.
- **Trigger**: `flash` täglich per Zeitplan, `deep` dienstags/freitags, `emergency` bei TVL-Crash > -15 % (24 h) oder De-Peg > 1,5 %.
- **Ablauf**: 1) DeFiLlama-/Pool-Tiefe abrufen 2) TVL-Momentum gegen Schwelle prüfen 3) Peg-Abweichung je Stablecoin messen 4) APY-Ausreißer gegen Pool-Median filtern 5) Status als `ok|advisory|critical` ausgeben, `critical` sofort melden.
- **Check**: Jede Meldung nennt den Messwert, die Schwelle, die Quelle und den Abrufzeitpunkt; fail-closed bei fehlender API (kein „alles ruhig“ aus nicht erreichbarer Datenquelle).
- **Ausgabe**: Statusobjekt mit `mode`, `metrics[]`, `threshold`, `severity`, `observed_at`, `sources[]`.
- **Fail-Verhalten**: API nicht erreichbar, Metrik fehlt oder Wert ist älter als der Toleranzzeitraum → `severity: unknown` + Alarm „Monitoring blind“. Kein `ok` aus fehlenden Daten. Keine Rendite- oder Plattformempfehlung aus diesem Skill.
- **Ticket-Kopplung**: H-04 (Wochen-Experiment), P1-10 (Monitoring-Alerting).
