# Kontenlage — Setup-Checkliste & Was fehlt noch

> Zuletzt aktualisiert: 2026-08-13 | Hermes v2.3

---

## 🔴 SOFORT erledigen (Sicherheit)

- [ ] **Stripe Live-Key rotieren** — Der alte Key `rk_live_51TI...` war hardcodiert im Code und ist in der Git-History.
  - Stripe Dashboard → Developers → API Keys → Roll key
  - Neuer Key als GitHub Secret: `STRIPE_SECRET_KEY` setzen
  - URL: https://dashboard.stripe.com/apikeys

- [ ] **Supabase Service-Key prüfen** — War ebenfalls im Frontend-Code sichtbar (`sb_secret_6NYQ...`)
  - Supabase Dashboard → Settings → API → Service Role Key rotieren (falls besorgt)
  - Supabase Anon-Key (öffentlich, für Frontend OK) als Vercel Env-Variable setzen: `KL_ANON_KEY`
  - URL: https://supabase.com/dashboard

- [x] **OpenRouter/EdenAI/Requesty Keys** — aus Code entfernt (v2.3), jetzt nur via GitHub Secrets

---

## 🟡 Gewerbe & Rechtliches

- [ ] **Gewerbe anmelden** (Voraussetzung für Stripe Live-Mode)
  - Tätigkeitsbeschreibung: "Betrieb einer Online-Plattform für allgemeine Finanzbildung..."
  - Kosten: ~20–60 €, meist online
  - URL: https://www.existenzgruendungsportal.de

- [ ] **Impressum** live schalten (ab Tag 1 Pflicht!)
  - IHK-Generator oder e-recht24.de
  - Muss enthalten: Name, Adresse, E-Mail, ggf. USt-ID

- [ ] **Datenschutzerklärung** live schalten
  - DSGVO: Double-Opt-In für Newsletter, Cookie-Hinweis prüfen
  - e-recht24.de Generator

- [ ] **AGB** für Abo-Abschluss (vor Stripe Live-Mode)

---

## 🟡 GitHub Secrets einrichten

Unter: https://github.com/[dein-repo]/settings/secrets/actions

### Bereits konfiguriert (vermutlich)
- [?] `VERCEL_TOKEN` — Vercel Deploy
- [?] `VERCEL_ORG_ID`
- [?] `VERCEL_PROJECT_ID`
- [?] `OPENROUTER_API_KEY`
- [?] `SUPABASE_URL`
- [?] `SUPABASE_SERVICE_KEY`

### Noch einzurichten
- [ ] `EDENAI_API_KEY` — https://app.edenai.run → API Key
- [ ] `REQUESTY_API_KEY` — https://requesty.ai → API Key
- [ ] `SITE_URL` → `https://kontenlage.de`
- [ ] `TELEGRAM_BOT_TOKEN` — @BotFather → /newbot
- [ ] `TELEGRAM_CHANNEL_ID` — z.B. `-1001234567890`
- [ ] `STRIPE_SECRET_KEY` — sk_test_xxx (jetzt) oder sk_live_xxx (nach Gewerbe)
- [ ] `STRIPE_WEBHOOK_SECRET` — Stripe Dashboard → Webhooks → Signing Secret
- [ ] `LINKEDIN_ACCESS_TOKEN` — LinkedIn Developer App
- [ ] `LINKEDIN_PERSON_URN` — `urn:li:person:XXXXXXXXX`
- [ ] `INSTAGRAM_ACCOUNT_ID` — Numerische Business Account ID
- [ ] `INSTAGRAM_ACCESS_TOKEN` — Meta Graph API Token
- [ ] `FACEBOOK_PAGE_TOKEN` — Meta Graph API Page Token
- [ ] `X_API_KEY` — Twitter Developer Portal
- [ ] `X_API_SECRET`
- [ ] `X_ACCESS_TOKEN`
- [ ] `X_ACCESS_SECRET`
- [ ] `X_BEARER_TOKEN`

---

## 🟡 Stripe Einrichten (Testmodus — kein Gewerbe nötig)

1. [ ] Account erstellen: https://dashboard.stripe.com/register
2. [ ] Im Test-Modus bleiben (Toggle oben links)
3. [ ] Test-Key kopieren (`sk_test_xxx`) → GitHub Secret `STRIPE_SECRET_KEY`
4. [ ] Produkte anlegen:
   ```bash
   STRIPE_SECRET_KEY=sk_test_xxx node scripts/stripe_create_products.js
   ```
5. [ ] Price-IDs aus Output kopieren → in `index.html` Zeile ~800 bei `startCheckout()` eintragen:
   ```js
   const prices = {
     'pro':       'price_test_XXXXXXXXXXXXX',  // aus Script-Output
     'executive': 'price_test_XXXXXXXXXXXXX',  // aus Script-Output
   };
   ```
6. [ ] Webhook-Endpunkt konfigurieren:
   - Stripe Dashboard → Developers → Webhooks → Add Endpoint
   - URL: `https://kontenlage.de/api/stripe-webhook`
   - Events: `checkout.session.completed`, `customer.subscription.deleted`, `invoice.payment_failed`
   - Signing Secret → GitHub Secret `STRIPE_WEBHOOK_SECRET`
7. [ ] Webhook Handler als Vercel Function deployen:
   ```bash
   # stripe_webhook_handler.js → api/stripe-webhook.js verschieben
   # Dann pushen → Vercel deployed automatisch
   ```
8. [ ] **Nach Gewerbeanmeldung**: Live-Key austauschen (1 Secret ändern reicht)

---

## 🟢 Social Media Kanäle einrichten

### Telegram (einfachster Start, sofort kostenlos)
1. [ ] @BotFather in Telegram anschreiben → `/newbot`
2. [ ] Name: `KontenlageBot`, Username: `@KontenlageInfoBot` (o.ä.)
3. [ ] Token → GitHub Secret `TELEGRAM_BOT_TOKEN`
4. [ ] Kanal erstellen: `@kontenlage_de` (oder `@kontenlage`)
5. [ ] Bot als Admin hinzufügen (Rechte: Nachrichten senden)
6. [ ] Kanal-ID ermitteln:
   ```
   https://api.telegram.org/bot{TOKEN}/getUpdates
   → chat.id (beginnt mit -100...)
   ```
7. [ ] Kanal-ID → GitHub Secret `TELEGRAM_CHANNEL_ID`

### LinkedIn (professionellste Reichweite)
1. [ ] LinkedIn Developer Portal: https://developer.linkedin.com
2. [ ] App erstellen → Products → "Share on LinkedIn" aktivieren
3. [ ] OAuth 2.0 Flow: Scope `w_member_social` beantragen
4. [ ] Person-URN ermitteln: `https://api.linkedin.com/v2/me` (nach Auth)
5. [ ] Token → GitHub Secret `LINKEDIN_ACCESS_TOKEN`
6. [ ] URN → GitHub Secret `LINKEDIN_PERSON_URN`
   - ⚠️ LinkedIn Access Tokens laufen nach 60 Tagen ab → Token-Refresh einrichten

### X/Twitter
1. [ ] https://developer.twitter.com → App erstellen
2. [ ] Elevated Access beantragen (kostenlos, 1–3 Tage Wartezeit)
3. [ ] App-Einstellungen: Read + Write Permissions
4. [ ] Keys + Secrets → 4 GitHub Secrets (X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_SECRET)

### Instagram (Business Account erforderlich)
1. [ ] Instagram Business Account (kein Personal) aktivieren
2. [ ] Meta Business Manager: https://business.facebook.com
3. [ ] Instagram-Konto mit Facebook-Seite verknüpfen
4. [ ] Graph API Explorer: https://developers.facebook.com/tools/explorer
5. [ ] Permissions: `instagram_basic`, `instagram_content_publish`, `pages_read_engagement`
6. [ ] Access Token + Business Account ID → GitHub Secrets
   - ⚠️ Ohne Bild/Video kein Instagram-Post möglich (Text allein reicht nicht)
   - Lösung: Hermes kann wöchentliche Grafik-Templates generieren

### Facebook Page
1. [ ] Facebook-Seite für Kontenlage erstellen
2. [ ] Meta Business Manager verknüpfen
3. [ ] Page Access Token (long-lived, 60 Tage) → GitHub Secret `FACEBOOK_PAGE_TOKEN`

---

## 🟢 Supabase-Tabellen prüfen

```sql
-- Muss existieren (aus supabase_schema.sql):
-- hermes_logs
-- audit_logs
-- kontenlage_subscribers (NEU — für Stripe Webhook)

-- Neu anlegen (falls nicht vorhanden):
CREATE TABLE IF NOT EXISTS kontenlage_subscribers (
  id                      UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stripe_customer_id      TEXT,
  stripe_subscription_id  TEXT UNIQUE,
  email                   TEXT NOT NULL,
  plan                    TEXT DEFAULT 'pro',
  status                  TEXT DEFAULT 'active',
  subscribed_at           TIMESTAMPTZ DEFAULT NOW(),
  cancelled_at            TIMESTAMPTZ,
  last_payment_failed_at  TIMESTAMPTZ,
  confidence_score        NUMERIC(3,2) DEFAULT 1.0,
  decision_reason         TEXT,
  affected_parameters     JSONB
);

-- RLS aktivieren:
ALTER TABLE kontenlage_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role only" ON kontenlage_subscribers
  FOR ALL USING (auth.role() = 'service_role');
```

---

## 🔵 Preise aktivieren (nach Gewerbeanmeldung + Impressum)

1. `index.html` öffnen
2. Zeile suchen: `<section id="abo" style="display:none">`
3. `style="display:none"` entfernen
4. Zeile in `<style>` Block: `#abo { display: none !important; }` → `#abo { display: block; }` ändern
5. In `startCheckout()` die echten Stripe Price-IDs eintragen (aus Schritt Stripe, Punkt 5)
6. Git commit & push → Vercel deployed automatisch

---

## 📊 Aktueller Status (2026-08-13)

| System | Status | Nächster Schritt |
|--------|--------|-----------------|
| Vercel Deploy | ✅ Live | — |
| Hermes GitHub Actions | ✅ Konfiguriert | Secrets eintragen |
| AI Cascade (3 Provider) | ✅ Bereit | Env-Keys als Secrets |
| Telegram | ⚠️ Nicht eingerichtet | @BotFather → Token |
| X/Twitter | ⚠️ Nicht eingerichtet | Developer App erstellen |
| LinkedIn | ⚠️ Nicht eingerichtet | LinkedIn Developer App |
| Instagram | ⚠️ Nicht eingerichtet | Meta Business Manager |
| Facebook | ⚠️ Nicht eingerichtet | Page erstellen |
| Stripe (Test) | ⚠️ Nicht eingerichtet | stripe_create_products.js |
| Stripe (Live) | 🔒 Gesperrt bis Gewerbe | Gewerbeanmeldung |
| Supabase Logging | ⚠️ Key rotieren! | Neuen Key in Secrets |
| Preise sichtbar | ❌ Versteckt | Nach Gewerbeanmeldung |
| Impressum | ❌ Fehlt | Sofort erstellen! |
| Datenschutz | ❌ Fehlt | Sofort erstellen! |
