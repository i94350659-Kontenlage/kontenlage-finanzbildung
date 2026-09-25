# Kontolage – Walkthrough

## Ziel

Kontolage verwendet Vercel für das Frontend, Supabase für Auth/PostgreSQL/RLS und Stripe für Checkout sowie Billing. Keine geheimen Stripe- oder Supabase-Service-Schlüssel dürfen im Browser-Code erscheinen.

## Lokale Umgebung

```powershell
Set-Location "G:\B2B steuer Business Ideee 6.8.2026\webseitenversionen\4.9.2026"
supabase login
supabase link --project-ref tberfzrzfkwoytgqlpij
supabase projects list
```

`supabase status` ist für lokale Docker-Instanzen und nicht für den Cloud-Link relevant.

## Supabase-Datenbank

```powershell
supabase db push --dry-run
supabase db push
```

Die bereits deployte Migration liegt unter `supabase/migrations/`. Nach erfolgreichem Push muss ein erneuter Dry-Run `Remote database is up to date` melden.

## Stripe-Test-Webhook

In einem Fenster:

```powershell
stripe login
stripe listen --forward-to "https://tberfzrzfkwoytgqlpij.supabase.co/functions/v1/stripe-webhook" --events checkout.session.completed,invoice.paid,invoice.payment_failed,customer.subscription.created,customer.subscription.updated,customer.subscription.deleted
```

Im zweiten Fenster:

```powershell
stripe trigger checkout.session.completed
stripe trigger invoice.paid
stripe trigger invoice.payment_failed
stripe trigger customer.subscription.updated
stripe trigger customer.subscription.deleted
```

Das von Stripe angezeigte `whsec_...` wird ausschließlich als Supabase Secret `STRIPE_WEBHOOK_SECRET` gespeichert.

## Supabase Secrets

Namen, die vorhanden sein müssen:

```text
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_PRICE_STARTER
STRIPE_PRICE_PRO
STRIPE_PRICE_EXECUTIVE
APP_ORIGIN
APP_ORIGINS
STRIPE_AUTOMATIC_TAX
```

Nur Namen prüfen:

```powershell
supabase secrets list
```

## Function-Deployment

```powershell
supabase functions deploy create-checkout-session
supabase functions deploy stripe-webhook
supabase functions deploy billing-portal
supabase functions deploy cancel-subscription
supabase functions deploy account
supabase functions list
```

Die Function muss die User-Session serverseitig verifizieren und darf keine beliebigen Browser-`customer_id`-Werte akzeptieren.

## Produktionsprüfung

```powershell
npm run build
npx tsc --noEmit
supabase db push --dry-run
supabase functions list
```

Danach Vercel Preview testen, Checkout im Stripe-Testmodus durchführen und Supabase Function Logs prüfen. Live-Modus erst nach Go/No-Go-Freigabe aktivieren.

## Tatsächlicher technischer Walkthrough (Update 2026-09-25)

### A. Lokal prüfen

```powershell
Set-Location "G:\B2B steuer Business Ideee 6.8.2026\webseitenversionen\4.9.2026"
npx tsc --noEmit
npm run build
```

Erwartung: Beide Befehle müssen erfolgreich enden. Das Vite-Build erzeugt `dist/`.

### B. Supabase-Projekt prüfen

```powershell
supabase projects list
supabase db push --dry-run
supabase functions list
```

Aktueller Sollzustand: Projekt verknüpft, neue Hardening-Migration wartet auf `supabase db push`, Edge Functions sind lokal implementiert, aber noch nicht deployed.

### C. Funktionen erstellen und deployen

Erst wenn die Dateien unter `supabase/functions/<name>/index.ts` existieren:

```powershell
supabase functions deploy create-checkout-session
supabase functions deploy stripe-webhook
supabase functions deploy billing-portal
supabase functions deploy cancel-subscription
supabase functions deploy account
supabase functions list
```

Nicht den Namen `stripe-webhook` deployed erwarten, solange keine Function-Datei vorhanden ist.

### D. Stripe-Testlauf

```powershell
stripe listen --forward-to "https://tberfzrzfkwoytgqlpij.supabase.co/functions/v1/stripe-webhook" --events checkout.session.completed,invoice.paid,invoice.payment_failed,customer.subscription.created,customer.subscription.updated,customer.subscription.deleted
```

Danach in einem zweiten Fenster:

```powershell
stripe trigger checkout.session.completed
stripe trigger invoice.paid
stripe trigger invoice.payment_failed
stripe trigger customer.subscription.updated
stripe trigger customer.subscription.deleted
```

### F. Vercel Preview

1. Vercel-Projekt mit diesem Repository verbinden.
2. Node.js-Version im Vercel-Dashboard auf `22.x` setzen; das Root- und App-Manifest verlangen bereits `22.x`.
3. Build Command: `npm run build`.
4. Output Directory: `dist`.
5. SPA Rewrite aus `vercel.json` beibehalten.
6. Preview-URL öffnen und alle öffentlichen Routen testen.
7. Geschützte `/kabinett`-Route ohne Session muss sicher umgeleitet oder abgewiesen werden.
8. Vercel Serverless Functions nur verwenden, wenn ihre Auth-/Ownership-Prüfung aktuell ist.

### G. Livegang-Gate

Livegang erst freigeben, wenn Rechtstexte, Auth, Edge Functions, Stripe-Test, RLS, Logs und Vercel Preview geprüft sind. `dist/` allein ist kein Nachweis für einen sicheren Abo-Betrieb.

---

## Update 2026-09-25 (abends) — Prerender, Sitemap, echtes 404

Der frühere SPA-Rewrite ist **entfernt**. Stattdessen wird pro Route eine eigene HTML-Datei gebaut:

```powershell
Set-Location "G:\B2B steuer Business Ideee 6.8.2026"
npm run build          # App-Build -> dist/ -> Sitemap -> Prerender (24 Routen + 404.html)
npm run prerender      # nur Sitemap + Prerender erneut ausführen
vercel --prod --yes    # Deployment
```

**Steuerung der Metabaten:** `webseitenversionen/4.9.2026/content/routes.json` ist die einzige Quelle für Pfad, Title, Description, H1, Intro, `noindex`, Sitemap-Priorität und `lastmod`. Neue Artikel also immer zuerst dort eintragen.

**Verifikation (Pflicht nach jedem Deploy):**

```powershell
node tools/verify-seo.mjs        # Status, Title, Canonical, JSON-LD, h1, robots, 404, Sitemap
node tools/verify-live.mjs       # Bundle-Größe, Routen, eingebetteter Supabase-Key
node tools/hermes-skill-audit.mjs
node tools/brand-consistency-check.mjs
```

Sollwerte: `verify-seo` 151/151, `verify-live` alle Routen 200, unbekannte URL **404**.

**Wichtig für zukünftige Änderungen:**

- Neue Route ⇒ Eintrag in `content/routes.json`, dann `npm run prerender` + Deploy. Ohne Deploy 404t die Route beim Direktaufruf.
- `cleanUrls: true` in `vercel.json` sorgt dafür, dass `/rechner` auf `dist/rechner.html` zeigt; `dist/404.html` wird von Vercel mit Status 404 ausgeliefert.
- Die Startseiten-Shell in `index.html` wird vom Prerender durch den Registry-Inhalt ersetzt — Marketing-Texte der Startseite gehören daher in `routes.json` (`intro`, `sections`).
- Gesperrte Dateien (z. B. offene Editor-Tabs) blockieren Schreibzugriffe; dann Tab schließen und das jeweilige Tool erneut ausführen.


