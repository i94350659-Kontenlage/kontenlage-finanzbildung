# PROJECT.md — Kontolage Projektdokumentation

> Stand: 2026-09-25 · Kanonische Kurzfassung für Kontext. Details: `docs/kanban.md`, `docs/implementation-plan.md`, `docs/todo.md`.

## Projektübersicht

**Kontolage** ist eine deutsche Finanzbildungsplattform für Einkommensbezieher ab etwa 60.000 € Jahresgehalt: neutrale Erklärungen, mathematisch nachrechenbare Steuerrechner und strukturierte Szenarien — ohne Anlageberatung, ohne Vertrieb, ohne Provision. Finanzierung ausschließlich über Abo-Mitgliedschaften.

## Tech-Stack (aktuell)

| Schicht | Technologie | Status |
|---|---|---|
| Frontend | React 19 + TypeScript + Vite 8 (SPA, Router v8) | live |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) + eigene CSS-Variablen | live |
| Hosting | Vercel (Projekt `kontolage-finanzbildung`, Region fra1) | live |
| Datenbank | Supabase PostgreSQL mit RLS (`tberfzrzfkwoytgqlpij`) | live |
| Auth | Supabase Auth (E-Mail + Passwort, Bestätigung erforderlich) | live |
| Backend-Logik | Supabase Edge Functions (Deno) | live (5 Functions) |
| Zahlungen | Stripe Checkout + Billing Portal (Abo) | Testmodus |
| Automatisierung | GitHub Actions (Hermes-Cron, Governance) | aktiv |
| E-Mail (Produkt) | Supabase-Default (eigener SMTP blockiert am Free-Tier) | Übergangslösung |
| Social | Telegram (direkt), übrige Kanäle als Drafts | aktiv |

## Repository-Struktur (relevant)

```text
G:\B2B steuer Business Ideee 6.8.2026\
├─ webseitenversionen/4.9.2026/        # aktive Anwendung
│  ├─ src/{components,context,layouts,lib,pages}
│  ├─ public/{robots.txt,sitemap.xml,favicon.svg}
│  ├─ supabase/{config.toml,functions,migrations,templates}
│  ├─ docs/{kanban.md,implementation-plan.md,todo.md,walkthrough.md}
│  └─ .env                             # nur browser-sichere Supabase-Werte
├─ tools/                              # Build-, Prüf- und Betriebsskripte
│  ├─ sync-app-env.mjs                 # erzeugt die App-.env aus Supabase-Keys
│  ├─ verify-live.mjs                  # Live-Bundle, Routen, Key-Gültigkeit
│  ├─ verify-supabase-auth.mjs         # .env ↔ Build ↔ GoTrue
│  ├─ hermes-skill-audit.mjs           # Governance-Audit der Skills
│  └─ stripe-webhook-setup.ps1
├─ .agents/                            # Hermes-Governance und Skills
├─ scripts/                            # Hermes-Laufzeit (Content, DeFi, Reflexion)
├─ obsidian_vault/                     # Learnings, Experimente, Drafts, Changelog
└─ .github/workflows/                  # Cron- und Governance-Workflows
```

## Datenmodell (Supabase)

| Tabelle | Zweck | Schutz |
|---|---|---|
| `profiles` | Anzeigename und Profildaten | RLS, nur eigener Datensatz, Update nur auf `display_name` |
| `subscriptions` | Stripe-Customer-/Abo-Zustand je Nutzer | RLS lesend eigener Datensatz; Schreiben nur serverseitig |
| `stripe_events` | Webhook-Idempotenz | keine Client-Policies; nur Service-Role |
| `audit_log` | sicherheitsrelevante Ereignisse | RLS lesend eigener Datensatz |
| `rate_limit_buckets` | Rate-Limits der Edge Functions | RLS; Funktion nur für `service_role` |

Zusätzlich: `consume_rate_limit(...)`, `claim_stripe_event(...)`, Trigger `handle_auth_user_change()`.

## Abo-Modell

| Tarif | Preis | Inhalt (Kurzfassung) |
|---|---|---|
| Basis | kostenlos | Basis-Rechner, Wochenartikel, PDF-Checkliste |
| Starter | 4,90 €/Monat | alle Artikel, Kabinett-Lesebereich |
| Pro Digital | 9,00 €/Monat | alle Rechner, Excel-Modelle, PDF-Export, Kabinett |
| Executive B2B | 29,00 €/Monat | Holding-/VV-GmbH-Modelle, ELSTER-Vorlagen, B2B-Analyse, Prio-Support |

Preis-IDs liegen als Supabase-Secrets (`STRIPE_PRICE_STARTER|PRO|EXECUTIVE`); Endpreise inkl. MwSt. sind Ticket P0-05.

## Wichtige URLs

- Live: `https://kontolage.de` (und `https://www.kontolage.de`)
- Repository: `https://github.com/i94350659-Kontenlage/kontenlage-finanzbildung`
- Supabase: `https://supabase.com/dashboard/project/tberfzrzfkwoytgqlpij`
- Vercel: Projekt `kontolage-finanzbildung`
- Stripe: `https://dashboard.stripe.com`

## Meilensteine

- [x] Website live mit SSL, SPA-Routing und SEO-Grundgerüst
- [x] Supabase-Projekt verknüpft, Migrationen und RLS angewendet
- [x] Fünf Edge Functions deployed und auth-geschützt
- [x] Auth-Flow (Registrierung, Bestätigung, Login, Reset) im Frontend
- [x] Build-Reproduzierbarkeit (`.env` + Sync-Skript, Vite-DCE-Falle dokumentiert)
- [x] Kanban/Implementierungsplan/Todo für P0–P2 und Hermes v6 erstellt
- [ ] P0 abgeschlossen: Prerender/Sitemap, Rechtsseiten, MwSt., Fonts, Webhook-E2E, Rotation
- [ ] Erste zahlende Mitglieder
- [ ] 100 Newsletter-Abonnenten und Suchsichtbarkeit (Search Console)
