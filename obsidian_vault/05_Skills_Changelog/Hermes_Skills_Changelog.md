# Hermes Skills Changelog & Auto-Refinements

## v6.6 (2026-10-08) — AI-Fallback-Kette v2 & Auto-Deploy
- [UPDATE] `scripts/hermes_runner.js` — neue Fallback-Reihenfolge (Stand 2026-10-08): OpenRouter (Primär) → **Orcarouter** (`orcarouter/free`) → **Zenmux** (`sapiens-ai/agnes-2.5-flash`) → **Together** (`Prism-ML/Ternary-Bonsai-27B`, base `api.together.ai`) → Requesty (`gemma-4-31b-it`) → EdenAI (v3, `api.edenai.run/v3/chat/completions`, OpenAI-kompatibel) → Groq → Gemini → Mistral → Custom Gateway 1/2 → statischer Content.
- [ADD] Drei neue Provider-Slots mit frischen Secrets: `ORCAROUTER_API_KEY`, `ZENMUXAI_API_KEY`, `TOGETHERAI_API_KEY` (Namen exakt wie in GitHub Secrets; Env `TOGETHER_API_KEY` → `TOGETHERAI_API_KEY` korrigiert).
- [FIX] EdenAI: toter v1-Endpoint (404 im Lauf 2026-10-05) → v3 mit generischem OpenAI-Pfad; Sonderpfad `isEdenAI` entfernt (einheitlicher Codepfad für alle Provider).
- [ADD] Zweiter Kettendurchlauf nach 5 s bei transienten Fehlern (429/503/408/Netz) — behebt den statischen-Fallback-Fall vom 2026-10-05 (OpenRouter-503, Requesty-429).
- [FIX] Secrets korrigiert: `SUPABASE_URL` verwies auf nicht existierendes Projekt (`…ENOTFOUND` im Log) → `tberfzrzfkwoytgqlpij`; `SITE_URL` → `https://kontolage.de`; `SITE_URL`-Default, OpenRouter-Referer und Stripe-Webhook-Kommentar im Code auf `kontolage.de` korrigiert.
- [UPDATE] `.github/workflows/hermes_cron.yml` — Deploy-Job entfernt (Vercel Git Integration: Push auf `main` → Auto-Deploy Production, `kontolage-finanzbildung`, Branch `main`); env-Block um die neuen Keys ergänzt.
- [UPDATE] Governance-Dateien auf verifizierte Fakten: `AGENTS.md` (Stand, 6 Edge Functions inkl. `newsletter`, `newsletter_issues`, Deploy-Weg), `AGENT.md` (Functions-Liste, Deploy), `SOP.md` (SOP-001 Kaskade), `MEMORY.md` (Functions, Secret-Liste), `PROJECT.md` (Stand, Tech-Stack, Datenmodell, Meilensteine). `SOUL.md` und `SKILLS.md` ohne Änderung (keine betroffenen Fakten).
- [RESULT] Verifizierung: `node --check` ✓, `yaml-lint` ✓, `secret-scan` 0 Funde ✓; Auto-Deploy zweimal live nachgewiesen (`5s44xtg1r`, `ertuybr3z` ● Ready), CI success auf `9e955cc`.

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

## v6.5 (2026-09-26) — Kontolage-Ausgaben (Newsletter ohne Versand) + Secret-Scan
- [DECISION] Owner-Entscheid vom 2026-09-25: Ausgaben erscheinen **auf der Website**, kein E-Mail-Versand, keine Adresssammlung. Konsequenz: kein Mailchimp-Anschluss, keine Double-Opt-In-Pflicht, keine SMTP-Abhängigkeit.
- [ADD] `content/newsletter.json` — Registry der freien Ausgaben als Single Source of Truth (Slug, Kategorie, Titel, Teaser, Description, Abschnitte, Quellen mit Jurisdiktion/Stichtag, Rechner-Deep-Link, Keywords).
- [ADD] `src/pages/Newsletter.tsx` (Archiv) und `src/pages/NewsletterIssue.tsx` (Ausgabe) plus Routen `/newsletter` und `/newsletter/:slug`, Footer-Eintrag.
- [ADD] `supabase/migrations/202609250006_newsletter.sql` — `newsletter_issues` mit `tier` (free/pro/executive), RLS über `newsletter_tier_rank()` und `newsletter_active_plan()` (SECURITY DEFINER gegen RLS-Rekursion). Kernregel im Kommentar: bezahlte Texte gehören **nicht** ins Repository.
- [ADD] `supabase/functions/newsletter/index.ts` — GET-Liste und GET-Einzelausgabe; gesperrte Ausgaben liefern nur Vorschau + `locked`, fail-closed bei unbekanntem Tarif; Rate-Limit 20/60 min anonym, 60/60 min angemeldet.
- [ADD] `src/components/MemberAusgaben.tsx` — Ausgaben im Kabinett (`/konto`), Aufruf der Edge Function mit Session-Token, Vorschau-Modus ohne Abo.
- [ADD] `supabase/seed/newsletter.sql` — zwei gesperrte Beispielausgaben (pro, executive) für den Start.
- [ADD] `tools/newsletter-lint.mjs` — blockt fehlende Quellen/Stichtage/Jurisdiktion, ungültige Stufen, fehlende Routen-Registrierung und Empfehlungssprache; **verhindert explizit, dass eine gesperrte Ausgabe in die öffentliche Registry wandert**.
- [ADD] `tools/secret-scan.mjs` + CI-Schritt. Anlass: zwei echte Schlüssel im Klartext im öffentlichen Repo gefunden.
- [FIX] `tools/prerender-routes.mjs` — `newsletter` gilt als `Article` (JSON-LD inkl. `citation`), Quellenblock und interne Ausgaben-Verlinkung werden ins Server-HTML geschrieben. Damit sind Text und Belege ohne JavaScript sichtbar.
- [FIX] Security: Mailchimp-Key und Printify-Token aus `scripts/` entfernt, beide Skripte lesen jetzt ausschließlich aus der Umgebung und brechen ohne Wert ab.
- [ADD] SKILL-20 `kontolage-newsletter-editor` — Evidence-Bundle → Ausgabe, mit Stufenregel (free ins Repo, pro/executive in die DB) und Fail-Verhalten.
- [RESULT] Build Exit 0 · Bundle-Guard bestanden · Newsletter-Lint 0 Fehler · Secret-Scan 0 Funde · Skill-Audit 31 Skills, 0 Fehler.

