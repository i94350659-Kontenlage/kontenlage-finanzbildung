# MEMORY.md — Hermes Langzeit-Gedächtnis & Kontext

## Wissen über das Projekt (Stand: 2026-08-07)

### Was bereits funktioniert:
- Website live: `https://www.kontolage.de` (Vercel, SSL, X-Vercel-Cache: HIT)
- Hermes Cron: Jeden Montag 08:00 UTC via GitHub Actions
- Telegram: Bot live, Testnachricht erfolgreich gesendet (Message-ID: 2)
- Supabase: Schema deployed, RLS aktiviert
- Stripe: 2 Live-Produkte angelegt (Pro 9 €, Executive 29 €)
- Mailchimp: Audience `kontenlage` (`c3728821fc`), Double Opt-In getestet
- 15/15 E2E Tests bestanden

### Aktueller Systemzustand:
```
Preise: VERSTECKT (display:none) — bis Gewerbeanmeldung
Postiz: NICHT verwendet — ersetzt durch direktes Telegram
Render: Nicht konfiguriert (erfordert Kreditkarte für Web Services)
Railway: Nicht konfiguriert (erfordert Kreditkarte nach Trial)
```

### Erkannte Learnings (aus bisherigen Läufen):
- §-Paragraphen in Zeile 1 erhöhen CTR bei 40-55-Jährigen
- Zahlen im Titel (z.B. "1.000 €", "15%") steigern Klickrate
- Emojis auf LinkedIn: max. 1, sonst wahrgenommene Seriositätsverlust
- Direkter Rechner-Link erhöht Lead-Conversion
- Handelsblatt/NZZ-Tonalität erzeugt höchstes Vertrauen bei Zielgruppe

### Offene Punkte (für zukünftige Läufe):
1. **Gewerbeanmeldung** → `index.html` Pricing-Section aktivieren
2. **LinkedIn Unternehmensseite** → Kanal aufbauen
3. **Google Search Console** → Domain verifizieren für SEO
4. **X/Twitter Account** → `@kontenlage_de` anlegen
5. **Instagram** → `@kontenlage.de` anlegen
6. **Erster zahlender Kunde** → Stripe Webhook testen

### Geplante Feature-Roadmap:
- [ ] Supabase Edge Function für Newsletter-Subscription (ohne Mailchimp-Dependency)
- [ ] Automatischer Artikel-Generator (Hermes schreibt neue Artikel in `artikel/`)
- [ ] LinkedIn API Direktposting (OAuth 2.0)
- [ ] X API v2 Direktposting (Bearer Token + User Token)
- [ ] DeFi/Crypto Artikel-Serie (5 geplante Themen)
- [ ] Whitepaper-Analyse-Tool (SKILL-06)

## Credentials-Referenz (Secrets in GitHub Actions)
> ⚠️ Echte Werte NIEMALS in diese Datei schreiben — nur Secret-Namen

| Secret-Name | Beschreibung | Status |
|---|---|---|
| `SUPABASE_URL` | DB-URL | ✅ Gesetzt |
| `SUPABASE_SERVICE_KEY` | Service Role Key | ✅ Gesetzt |
| `OPENROUTER_API_KEY` | Nemotron Primary | ✅ Gesetzt |
| `EDENAI_API_KEY` | Gemma Fallback 1 | ✅ Gesetzt |
| `REQUESTY_API_KEY` | Nemotron Fallback 2 | ✅ Gesetzt |
| `TELEGRAM_BOT_TOKEN` | Bot Token | ✅ Gesetzt (Live) |
| `TELEGRAM_CHANNEL_ID` | Kanal-ID | ✅ Gesetzt (Live) |
| `SITE_URL` | https://kontolage.de | ✅ Gesetzt |
