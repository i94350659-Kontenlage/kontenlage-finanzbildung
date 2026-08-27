# Hermes Audit Logs, Error Understandings & Fix Post-Mortems

## Log 2026-08-27: DNS & Monetization Dropdown Optimization
- **Incident**: DNS_PROBE_FINISHED_NXDOMAIN auf `kontenlage.de`.
  - **Ursache**: Domain-Einträge noch nicht weltweit per A-Record auf Vercel (`76.76.21.21`) propagiert.
  - **Lösung**: Lokaler Dev-Server auf Port 3399 hochgezogen und DNS-Dokumentation hinterlegt.
- **Incident**: Registrierungs-Dropdown enthielt noch alte 19 €/49 € Staffelung.
  - **Ursache**: Modal-Template war nicht mit den neuen 9 € / 29 € / 49 € Tiers synchronisiert.
  - **Lösung**: Dropdown atomar synchronisiert und 4-Stufen Test-Seeder (`test-account-seeder.js`) bereitgestellt.

## Regression Prevention Matrix:
- Jeder Skill-Output muss automatische Validierungstests durchlaufen.
- Compliance-Klasse (A–F) darf niemals durch Prompts gelockert werden.
