# Hermes Skills Changelog & Auto-Refinements

## v6.2 (2026-08-27)
- [ADD] `kontenlage-asset-classes-taxonomy` (TradFi, ETFs, Anleihen, Immo, Gold, Krypto, DeFi).
- [ADD] `kontenlage-tax-holding-engine.js` (Above-the-fold Quick Estimator, Holding § 8b, VV-GmbH, Fünftelregelung).
- [ADD] `kontenlage-analytics-growth-optimizer` Skill & Analytics Engine.
- [ADD] 4-Tier Test-Account Seeder (Free, Pro 9 €, Executive 29 €, Private Owner 49 €).
- [UPDATE] Bereinigung aller internen Toolnamen im Public UI.
## v6.3 (2026-09-25) — Governance-Update & Self-Improvement v2
- [ADD] `.agents/AGENT.md` — Betriebsvertrag: Laufzeiten, Funktionsinventar, Gedächtnis-Ebenen, Pflicht-Ausgabeformat, Eskalation, Definition of Done.
- [UPDATE] `SOUL.md`, `AGENTS.md`, `SKILLS.md`, `SOP.md`, `MEMORY.md`, `PROJECT.md` auf v6 mit verifizierten Fakten (Supabase `tberfzrzfkwoytgqlpij`, fünf Edge Functions ACTIVE, Live-Bundle 675.549 Zeichen, Kanban P0–P2).
- [ADD] fünf kanonische Skills: `kontolage-seo-prerender-maintainer`, `kontolage-legal-compliance-gate`, `kontolage-billing-tax-guardian`, `kontolage-brand-consistency-guardian`, `kontolage-self-improvement-loop`.
- [ADD] `tools/hermes-skill-audit.mjs` (Frontmatter-, Pflichtabschnitt-, Marken- und Secret-Prüfung) mit Report `.agents/skills-audit.json`; Ergebnis 30 Skills, 0 Fehler.
- [ADD] `.github/workflows/hermes-governance.yml` (Push/PR/Montag 04:30 UTC, Artefakt-Upload, informeller Live-Check).
- [ADD] SOP-009 … SOP-013 (SEO-Gesundheit, Rechts-/Kaufstrecken-Gate, Billing-/Webhook-Gesundheit, Wochen-Experiment, Governance-Audit).
- [UPDATE] Marken-Kanon: neue Skills nutzen `kontolage-`; Legacy-IDs `kontenlage-*` bleiben als Alias gültig und werden im Audit als Aufräum-Schuld gelistet.
- [UPDATE] Legacy-Befund aus dem Audit: 17 Alt-Skills ohne Frontmatter-`description` bzw. mit zu wenigen Pflichtabschnitten — Migrationsschuld, kein Blocker.

## v6.4 (2026-09-25) — Skill-Vervollständigung & sauberes Audit-Signal
- [UPDATE] 14 `kontenlage-*`-Skills um einen **Betriebsblock** ergänzt (Zweck, Trigger, Ablauf, Check, Ausgabe, Fail-Verhalten, Ticket-Kopplung). Inhalt jeweils aus dem bestehenden Skill abgeleitet, keine erfundenen Verfahren, keine Inhalte entfernt.
- [ADD] `.agents/skills-classes.json` — dokumentiert je Fremdprojekt-Skill den Grund der Einordnung (`klasse: fremd`), damit echte Migrationsschuld von Fremdrauschen getrennt sichtbar bleibt.
- [UPDATE] `tools/hermes-skill-audit.mjs` — dritte Klasse `foreign`, Ausgabe jetzt dreifach (Fehler / offene Warnung / Fremd-Hinweis) plus Klassen-Zeilen; der als erlaubt markierte Marken-Selbstbezug zählt als Hinweis statt Warnung.
- [UPDATE] `SKILLS.md` — Abschnitt „Skill-Klassen und Migrationsstand" mit der Warnung, dass der Audit keine Cross-Referenzen prüft (rennen eines Legacy-Skills zieht alle Aufrufer mit).
- [RESULT] Audit: 30 Skills · 0 Fehler · **0 offene Warnungen** · 10 Fremd-Hinweise. `--strict` meldet weiterhin 9 Fehler in den nicht migrierten Skills und bleibt damit die Endziel-Metrik.
- [UPDATE] `tools/brand-consistency-check.mjs` schreibt jetzt atomar über Temp-Datei + `rename`; gesperrte Editor-Dateien erzeugen eine Meldung statt eines Abbruchs (P1-07).
- [UPDATE] `webseitenversionen/4.9.2026/src/pages/ArtikelDetail.tsx`: 14 verbliebene „Kontenlage"-Vorkommen in Autorangaben auf „Kontolage" korrigiert.
- [CHORE] Migration `202609250002_kuendigung_ohne_login.sql` → `202609250005_kuendigung_ohne_login.sql` umbenannt, damit die zeitliche Reihenfolge im Migrationslauf eindeutig bleibt.

