# MEMORY.md — Hermes Langzeit-Gedächtnis

> Stand: 2026-09-25 · Ersetzt alle früheren Stände. Fakten sind verifiziert (Live-Check, CLI-Ausgabe, Migrationen).
> Regel: nur verifizierte Fakten eintragen, Unsicheres wird als „offen" markiert. Keine Secret-Werte, nur Namen.

## 1. Aktueller Systemzustand (verifiziert)

| Bereich | Status |
|---|---|
| Website | `https://kontolage.de` live auf Vercel (Region fra1, TTFB ≈ 110 ms, SSL aktiv) |
| Bundle | 675.549 Zeichen JS (≈ 193 KB Brotli), CSS 12,6 KB — vollständig, enthält alle Routen |
| Supabase | Projekt `tberfzrzfkwoytgqlpij`; Migrationen `202609250001`, `202609250002` angewendet |
| Edge Functions | `account`, `create-checkout-session`, `stripe-webhook`, `billing-portal`, `cancel-subscription` — ACTIVE, ohne JWT 401 |
| Auth | Registrierung offen, E-Mail-Bestätigung aktiv (`mailer_autoconfirm=false`) |
| Datenbank | `profiles`, `subscriptions`, `stripe_events`, `audit_log`, `rate_limit_buckets` mit RLS; Service-Role nur serverseitig |
| Stripe | Testmodus konfiguriert; Webhook-Endpoint offen (P0-07); `STRIPE_AUTOMATIC_TAX` nicht gesetzt |
| Hermes | Cron aktiv: Content Montag 08:00 UTC, Self-Reflection Montag 04:00 UTC, DeFi Dienstag/Freitag; Governance v6 im Umbau (H-01 … H-03) |
| Content | 13 Artikel in der Registry, Sitemap enthält nur 3 davon (P0-02 offen) |
| Recht | AGB/Widerruf/Kündigungsbutton fehlen; Impressum enthält Platzhalter (P0-03/P0-04) |
| Fonts | extern von Google geladen (P0-06 offen) |

## 2. Erkannte technische Fallen (dauerhaft merken)

1. **Vite 8 / Rolldown:** Fehlen `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` beim Build, entfernt Tree-Shaking die komplette React-App (leeres Bundle). Lösung: `.env` im App-Ordner, erzeugt durch `node tools/sync-app-env.mjs`.
2. **CORS:** `www.kontolage.de` und Preview-URLs müssen als Origin erlaubt sein, sonst 403 bei allen Functions.
3. **Checkout:** `customer_update[name|address]=auto` und `tax_id_collection` sind Pflicht, sonst 500 beim Session-Create.
4. **Canonical:** Der statische Shell-Inhalt in `index.html` gilt für alle Routen; ohne Prerender zeigt jede Unterseite das Startseiten-Canonical.
5. **Soft-404:** Unbekannte URLs liefern HTTP 200 — Crawler-Falle.

## 3. Learnings aus bisherigen Läufen

- §-Paragraphen in der ersten Zeile erhöhen die Klickrate bei 40–55-Jährigen.
- Zahlen im Titel („1.000 €", „15 %") steigern Klicks messbar.
- Auf LinkedIn maximal ein Emoji, sonst sinkt die wahrgenommene Seriosität.
- Direkter Rechner-Link statt Übersichtsseite erhöht die Lead-Conversion.
- Handelsblatt-/NZZ-Tonalität erzeugt die höchste Vertrauenswirkung bei der Zielgruppe.
- Wiederholte Satzanfänge über zwei Wochen hinaus reduzieren die Reichweite (Anti-Shadowban).

## 4. Offene Punkte (Ticketbezug)

| Offen | Ticket |
|---|---|
| Prerender + Meta je Route, Sitemap-Generator | P0-01, P0-02 |
| AGB, Widerruf, Kündigungsbutton, echte Impressumsdaten | P0-03, P0-04 |
| Stripe Tax + MwSt.-Endpreise | P0-05 |
| Fonts lokal | P0-06 |
| Webhook-Endpoint + E2E-Zahlungsfluss | P0-07 |
| Key-Rotation | P0-08 |
| CI/Typecheck, Monitoring, Repo-Hygiene, A11y, Header | P1-04, P1-10, P1-11, P1-12, P1-13 |
| Konto-Persistenz, Exporte, Newsletter, Analytics | P2-01 … P2-06 |

## 5. Roadmap-Ideen (nicht zugesagt)

- Automatischer Artikel-Entwurf direkt in die Registry (mit Publish-Gate).
- LinkedIn-/X-Direktposting über API, sobald Tokens stabil laufen.
- DeFi-/Krypto-Artikelserie (5 geplante Themen).
- Whitepaper-Analyse-Tool als öffentliches Bildungsformat.

## 6. Secret-Namen (nur Namen, niemals Werte)

Repository-Secrets: `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `OPENROUTER_API_KEY`, `EDENAI_API_KEY`, `REQUESTY_API_KEY`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHANNEL_ID`, `SITE_URL`, `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, `X_API_KEY`, `X_API_SECRET`, `X_ACCESS_TOKEN`, `X_ACCESS_SECRET`, `FACEBOOK_PAGE_TOKEN`, `INSTAGRAM_ACCESS_TOKEN`, `INSTAGRAM_ACCOUNT_ID`, `LINKEDIN_ACCESS_TOKEN`, `LINKEDIN_PERSON_URN`, `META_APP_ID`, `META_APP_SECRET`.
Supabase-Function-Secrets: `APP_ORIGIN`, `APP_ORIGINS`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_STARTER`, `STRIPE_PRICE_PRO`, `STRIPE_PRICE_EXECUTIVE`, `STRIPE_AUTOMATIC_TAX` (offen).

## 7. Pflege-Protokoll

1. Fakten nur mit Nachweis eintragen (Befehl, Log, URL).
2. Überholte Zeilen löschen, nicht auskommentieren.
3. Wöchentlich prüfen: Supabase-Ref, Edge-Function-Status, offene P0-Tickets, Rotationsstand.
4. Bei Widerspruch zu `AGENTS.md`/`AGENT.md` gilt die Governance-Datei; `MEMORY.md` wird korrigiert.
