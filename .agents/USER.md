# USER.md — Nutzerprofil & Präferenzen des Kontenlage-Gründers

## Identität
- **GitHub**: `i94350659-Kontenlage`
- **Email**: `i94350659@gmail.com` / `kolbaska2009@googlemail.com`
- **Vercel Account**: `kolbaska2009-9272`
- **Standort**: Deutschland
- **Sprache**: Deutsch (primär), kann Englisch wenn nötig

## Aktuelle Projektphase
- **Phase**: Pre-Launch / Aufbauphase (kein Gewerbe angemeldet)
- **Domain**: `kontolage.de` (bei Strato, 60 Cent/Jahr, bereits auf Vercel aktiv)
- **Website**: `https://www.kontolage.de` — Live mit SSL ✅
- **Gewerbe**: NOCH NICHT angemeldet → Kaufstrecke rechtlich noch nicht freigegeben (AGB/Widerruf/Kündigungsbutton offen, Ticket P0-03)

## Technische Präferenzen
- **Kein Serverhosting** ohne zwingenden Grund — GitHub Actions + Vercel bevorzugt
- **Kein paid Tier** ohne explizite Genehmigung — kostenfreie Alternativen bevorzugen
- **Keine Kreditkarte** für Infrastruktur-Services
- **Lieber weniger Komplexität** — One-Click-Lösungen bevorzugen

## Arbeitsweise
- **Entscheidungsstil**: Pragmatisch, schnell, vertrauensbasiert — gibt klare Tokens und erwartet Ergebnisse
- **Feedback-Stil**: Kurze Bestätigungen ("gespeichert", "continue") — kein langer Dialog nötig
- **Präferenz**: Hermes soll autonom handeln, Rückfragen nur bei echten Blockern

## Verbundene Services (Credentials in GitHub Secrets)
| Service | Status |
|---|---|
| GitHub PAT | In GitHub Secrets — repo + workflow |
| Vercel Token | In GitHub Secrets — deployed |
| Supabase URL | `https://tberfzrzfkwoytgqlpij.supabase.co` (Projekt `tberfzrzfkwoytgqlpij`, RLS aktiv, 5 Edge Functions) |
| Supabase Anon Key | In GitHub Secrets |
| Supabase Service Key | In GitHub Secrets |
| Stripe Live Key | In GitHub Secrets — Produkte angelegt |
| Mailchimp | Audience `c3728821fc`, DC `us5` |
| OpenRouter | In GitHub Secrets (Nemotron Primary) |
| EdenAI | In GitHub Secrets (Fallback 1) |
| Requesty | In GitHub Secrets (Fallback 2) |
| Telegram Bot | In GitHub Secrets (Bot live) |
| X/Twitter | In GitHub Secrets (OAuth 1.0a, @kontolage) |

## Stripe (Stand 2026-09-25)

Testmodus aktiv. Preis-IDs liegen ausschließlich als Supabase-Secrets `STRIPE_PRICE_STARTER|PRO|EXECUTIVE` (keine IDs in Dateien).

| Tarif | Preis | Status |
|---|---|---|
| Basis | 0 € | kostenlos, ohne Registrierung |
| Starter | 4,90 €/Monat | auf `/abo` buchbar (Testmodus) |
| Pro Digital | 9,00 €/Monat | auf `/abo` buchbar (Testmodus) |
| Executive B2B | 29,00 €/Monat | auf `/abo` buchbar (Testmodus) |

> ⚠️ Offen: Stripe Tax aktivieren (Ticket P0-05), Webhook-Endpoint anlegen (P0-07), Endpreise inkl. MwSt. darstellen, AGB/Widerruf/Kündigungsbutton vor Liveverkauf (P0-03).

## Content-Präferenzen
- **Themen**: §10, §20, §21 EStG, Rürup, Sparerpauschbetrag, Gehaltsumwandlung, DeFi/Crypto Steuern
- **Stil**: NZZ / Handelsblatt — sachlich, mathematisch, keine Emojis im Fließtext
- **Zielgruppe**: 40–55 Jahre, 60.000–200.000 € Einkommen, Selbstständige & Angestellte mit GV

## Business-Ziele (kurzfristig)
1. Gewerbe anmelden → Preise aktivieren
2. Erste 100 Newsletter-Abonnenten über Mailchimp
3. LinkedIn-Kanal mit 500 Followern aufbauen
4. Telegram-Kanal als kostenloses Lead-Netzwerk
