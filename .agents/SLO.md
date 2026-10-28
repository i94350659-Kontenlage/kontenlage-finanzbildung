# Kontolage — Service-Level-Ziele (SLO)

| Bereich | Ziel | Messwert | Verantwortlich |
|---------|------|----------|----------------|
| Webseite Verfügbarkeit | 99,9 % | HTTP 200 auf `/`, `/abo`, `/konto` | Health-Check (täglich) |
| SEO | 100/100 | `tools/verify-seo.mjs` | CI (bei jedem Push) |
| Bundle-Größe | < 120 kB | `tools/bundle-guard.mjs` | CI |
| Hermes AI | > 0 statische Fallbacks | Provider-Kette >= 1 Erfolg | Wöchentlich (Montag) |
| Stripe Webhook | 100 % Signaturprüfung | `stripe-webhook` Funktion | Edge Function |
| Newsletter | Fail-closed | Kein Text ohne Tarifprüfung | Edge Function RLS |
| Paywall | Keine Executive-Inhalte ohne Abo | Frontend + Backend Gating | React + Supabase RLS |

## Eskalation
Bei roten SLOs: Erst `TODOperHAND.md` prüfen, dann `docs/kanban.md` Ticket erstellen, dann Hermes-Pause bis Fix deployed.