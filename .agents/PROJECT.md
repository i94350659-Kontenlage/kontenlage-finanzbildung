# PROJECT.md — Kontenlage Projektdokumentation

## Projektübersicht
**Kontenlage** ist ein deutsches Finanzbildungsportal für Einkommensbezieher ab 60.000 € Jahresgehalt. Die Plattform bietet neutrale, mathematisch exakte Erklärungen zu Steuersparstrategien — ohne Anlageberatung, ohne Vertrieb, ohne Interessenkonflikt.

## Tech Stack
| Schicht | Technologie | Status |
|---|---|---|
| Frontend | HTML/CSS/JS (Vanilla) | ✅ Live |
| Hosting | Vercel (Free) | ✅ `www.kontolage.de` |
| Datenbank | Supabase PostgreSQL | ✅ Schema deployed |
| CI/CD | GitHub Actions | ✅ Hermes Cron aktiv |
| AI Agent | Hermes (OpenRouter → EdenAI → Requesty) | ✅ Live |
| Email | Mailchimp (Audience `c3728821fc`) | ✅ Double Opt-In |
| Payments | Stripe Live (temporär versteckt) | ⏸️ Bis Gewerbeanmeldung |
| Social | Telegram Bot (direkt), Drafts für andere Kanäle | ✅ |

## Repository Struktur
```
kontenlage-finanzbildung/
├── index.html                    # Hauptseite mit Rechner & Artikeln
├── lead_magnet_freibetraege_2026.html  # Printbare A4 PDF-Vorlage
├── artikel/
│   ├── steuersparimmobilien-erfahrungen.html
│   ├── ruerup-rente-sinnvoll-rechner.html
│   └── sparerpauschbetrag-2026-einrichten.html
├── scripts/
│   ├── hermes_runner.js          # Hermes AI Agent (Hauptskript)
│   ├── e2e_test.js               # 15-Step E2E Testsuite
│   ├── mailchimp_subscribe.js    # Mailchimp Integration
│   └── stripe_create_products.js # Stripe Produkt-Setup
├── obsidian_vault/
│   ├── Drafts/                   # Wöchentliche Social Media Entwürfe
│   └── Learnings.md              # Hermes Self-Improvement Log
├── .agents/                      # Agent-Konfigurationsdateien
│   ├── AGENTS.md                 # Core Agent Rules
│   ├── SOUL.md                   # Persönlichkeit & Werte
│   ├── USER.md                   # Nutzerprofil
│   ├── PROJECT.md                # Diese Datei
│   ├── SOP.md                    # Standard Operating Procedures
│   └── SKILLS.md                 # Hermes Fähigkeiten & Skills
├── .github/workflows/
│   └── hermes_cron.yml           # GitHub Actions (Montag 08:00 UTC)
└── supabase_schema.sql           # Datenbankschema
```

## Supabase Datenbankschema
```sql
-- Nutzer
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  plan TEXT DEFAULT 'free',        -- 'free', 'pro', 'executive'
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Hermes Lauf-Logs
CREATE TABLE hermes_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_date DATE NOT NULL,
  ai_provider TEXT,
  channels_ok INT,
  channels_total INT DEFAULT 5,
  confidence_score FLOAT,
  draft_file TEXT,
  decision_reason TEXT,
  affected_parameters JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Audit Logs (Sicherheit & Compliance)
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event TEXT NOT NULL,
  payload JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

## Stripe Produkte (LIVE, temporär versteckt)
```
Kontenlage Pro Digital (9 €/Monat)
  → prod_V1vEPrVUKmN8vo
  → price_1U1rXRPoNfLOPXfNMHK4F2yE

Kontenlage Executive B2B (29 €/Monat)
  → prod_V1vE7YlRVJYynj
  → price_1U1rXRPoNfLOPXfNUnOvBzXo
```

## GitHub Secrets (Vollständig konfiguriert)
- `SUPABASE_URL` + `SUPABASE_SERVICE_KEY`
- `OPENROUTER_API_KEY` + `EDENAI_API_KEY` + `REQUESTY_API_KEY`
- `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHANNEL_ID`
- `SITE_URL` = `https://kontolage.de`

## Wichtige URLs
- **Live Website**: https://www.kontolage.de
- **GitHub Repo**: https://github.com/i94350659-Kontenlage/kontenlage-finanzbildung
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Supabase Dashboard**: https://supabase.com/dashboard/project/acgfcjcikjlrlfilqdyk
- **Stripe Dashboard**: https://dashboard.stripe.com

## Meilensteine
- [x] Website live auf Vercel mit SSL
- [x] Hermes AI Agent deployed auf GitHub Actions
- [x] Stripe Produkte erstellt (Live-Modus)
- [x] Mailchimp Double Opt-In konfiguriert
- [x] Telegram Bot live
- [x] OpenRouter + 2 Fallbacks konfiguriert
- [ ] Gewerbeanmeldung → Preise aktivieren
- [ ] 100 Newsletter-Abonnenten
- [ ] LinkedIn Unternehmensseite erstellen
- [ ] Google Search Console verifizieren
