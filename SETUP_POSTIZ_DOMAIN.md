# Postiz & Hermes Setup — Kontenlage Social Media Automation

## Schritt 1: Kostenlosen Postiz-Account erstellen

1. Gehe auf **[postiz.com](https://postiz.com)** → „Start for free"
2. Account mit deiner E-Mail anlegen
3. Nach dem Login: alle 5 Social-Media-Accounts verbinden:
   - 💼 **LinkedIn** (Company Page „Kontenlage")
   - 🧵 **X / Twitter** (`@kontenlage_de`)
   - 📸 **Instagram** (`@kontenlage.de`)
   - 🎬 **TikTok** (`@kontenlage`)
   - 📢 **Telegram** (Kanal `@kontenlage_de`)

---

## Schritt 2: Postiz API-Key generieren

In Postiz:
1. Klicke unten links auf **Settings**
2. → **Developers**
3. → **Public API**
4. → **„Generate API Key"**
5. Kopiere den generierten Key

---

## Schritt 3: Postiz Channel-IDs ermitteln

Nach dem Verbinden jedes Accounts:
1. Klicke in Postiz auf **Channels** oder **Integrations**
2. Jeder Account hat eine eindeutige **Channel-ID** (z.B. `clxyz123abc`)
3. Notiere die ID für jeden der 5 Accounts

---

## Schritt 4: GitHub Secrets hinterlegen

Gehe auf: **github.com/i94350659-Kontenlage/kontenlage-finanzbildung**
→ Settings → Secrets and variables → Actions → „New repository secret"

Lege folgende Secrets an:

| Secret Name | Wert |
|---|---|
| `POSTIZ_API_URL` | `https://app.postiz.com` |
| `POSTIZ_API_KEY` | dein generierter Postiz API-Key |
| `POSTIZ_CHANNEL_LINKEDIN` | Channel-ID des LinkedIn-Accounts |
| `POSTIZ_CHANNEL_X` | Channel-ID des X/Twitter-Accounts |
| `POSTIZ_CHANNEL_INSTAGRAM` | Channel-ID des Instagram-Accounts |
| `POSTIZ_CHANNEL_TIKTOK` | Channel-ID des TikTok-Accounts |
| `POSTIZ_CHANNEL_TELEGRAM` | Channel-ID des Telegram-Kanals |
| `SITE_URL` | `https://kontolage.de` |

---

## Schritt 5: Domain kontolage.de in Vercel einrichten

**Nach dem ersten Vercel-Deployment:**

1. Gehe in Vercel → dein Projekt → **Settings → Domains**
2. Gib `kontolage.de` ein → Bestätige
3. Vercel zeigt dir die DNS-Werte an:

```
A-Record:    76.76.21.21
CNAME:       cname.vercel-dns.com
```

4. Gehe in dein **Strato Kunden-Login**:
   - Domain → DNS-Verwaltung → A-Record auf `76.76.21.21` setzen
   - ggf. CNAME für `www` auf `cname.vercel-dns.com` setzen
5. Nach ca. 1–24 Stunden: Vercel stellt automatisch ein kostenloses **SSL-Zertifikat (HTTPS)** aus ✅

---

## Ergebnis nach dem Setup

Jeden Montag um 08:00 Uhr UTC läuft Hermes vollautomatisch:

```
GitHub Actions startet
    ↓
Hermes generiert 5 Social Media Posts
    ↓
Postiz plant alle Posts automatisch für die beste Uhrzeit
    ↓
Supabase loggt den Lauf mit Confidence Score
    ↓
Git commit: Neue Drafts & Learnings werden im Repo gespeichert
```

**Du musst nichts tun.** Hermes und Postiz erledigen alles. 🚀
