import pathlib

skills_dir = pathlib.Path(r"g:\B2B steuer Business Ideee 6.8.2026\.agents\skills\kontenlage-liquidity-monitor")
skills_dir.mkdir(parents=True, exist_ok=True)

skill_md = """---
name: kontenlage-liquidity-monitor
description: Autonomous DeFi Liquidity, Stablecoin De-peg, Yield and Bridge Risk Engine for Kontenlage Owner. Integrates DeFiLlama API, Uniswap/Curve pool depth monitoring, TVL momentum divergence, and Telegram emergency alerts. Strictly mathematical scoring, no LLM hallucinations.
---

# Kontenlage DeFi Liquidity & Risk Monitor

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
"""
(skills_dir / "SKILL.md").write_text(skill_md, encoding="utf-8")
print("kontenlage-liquidity-monitor skill registered successfully!")
