# SOP.md — Standard Operating Procedures für Hermes

## SOP-001: Wöchentlicher Content-Lauf (PFLICHT)
**Trigger**: Montag 08:00 UTC via GitHub Actions  
**Erfolg-Kriterium**: Telegram-Post gesendet + Draft-File in `obsidian_vault/Drafts/` + Supabase-Log

### Ablauf:
1. `Learnings.md` lesen → Anti-Shadowban-Check (keine identischen Headlines wie Vorwoche)
2. AI-Prompt bauen mit Kontext: Datum, Woche, Learnings
3. OpenRouter → EdenAI → Requesty → Statisch (Fallback-Kaskade)
4. 5-Format-Outputs generieren (LinkedIn, X, Instagram, TikTok, Telegram)
5. Telegram direkt senden via Bot API
6. Drafts in `obsidian_vault/Drafts/YYYY-MM-DD-social-drafts.md` speichern
7. Supabase `hermes_logs` updaten: `{run_date, ai_provider, confidence_score, decision_reason}`
8. `Learnings.md` updaten mit Lauf-Ergebnis
9. Git commit + push: `auto(hermes): weekly social drafts & learnings update`

### Hard-Fail-Bedingungen (process.exit(1)):
- Supabase nicht erreichbar → Log lokal, trotzdem weiter
- Alle AI Provider fehlgeschlagen → Statischen Content verwenden
- Git push fehlgeschlagen → GitHub Actions meldet Fehler

---

## SOP-002: Neuen Artikel erstellen
**Trigger**: Manuell vom User oder durch Hermes-Erweiterung

### Format (HTML):
```html
<!-- artikel/THEMA-SLUG.html -->
- DOCTYPE, Lang=de, Meta SEO, JSON-LD
- Header mit Kicker + H1 + Datum + Lesezeit
- Einleitung: Mathematische Ausgangslage
- H2: Abschnitt 1 (Gesetzesgrundlage mit §§)
- H2: Abschnitt 2 (Berechnungsbeispiel)
- H2: Abschnitt 3 (Szenarien-Tabelle)
- Fazit: Wann rechnet es sich, wann nicht
- CTA: Verlinkung auf Rechner in index.html
- BaFin-Disclaimer im Footer
```

### Qualitätsprüfung vor Veröffentlichung:
- [ ] Enthält mindestens einen konkreten §-Paragraphen
- [ ] Enthält mindestens ein numerisches Berechnungsbeispiel in Euro
- [ ] Enthält `<a href="/">Zum Rechner</a>` oder ähnlichen CTA
- [ ] BaFin-Disclaimer vorhanden
- [ ] `<article>` und `<h1>` (genau 1x) vorhanden

---

## SOP-003: Preise aktivieren (nach Gewerbeanmeldung)
**Trigger**: Nutzer meldet Gewerbeanmeldung

### Schritte:
1. In `index.html`: `<section id="abo" style="display:none">` → `<section id="abo">`
2. Stripe Webhook-URL auf Vercel eintragen: `https://kontolage.de/api/webhook`
3. In `index.html`: `startCheckout()` mit echten Stripe Price IDs verifizieren
4. E2E Test: `node scripts/e2e_test.js`
5. Push + Deploy

---

## SOP-004: Neuen Social Media Account verbinden
**Trigger**: User schickt OAuth-Token oder Kanal-ID

### Für Telegram:
1. `TELEGRAM_BOT_TOKEN` in GitHub Secrets setzen
2. `TELEGRAM_CHANNEL_ID` in GitHub Secrets setzen  
3. Test: `node -e "require('./scripts/test_telegram.js')"`

### Für andere Kanäle (zukünftig):
- OAuth 2.0 Access Token als GitHub Secret speichern
- Neue `publish_to_[PLATFORM]()` Funktion in `hermes_runner.js` eintragen
- `SOP-001` Ablauf um neuen Kanal erweitern

---

## SOP-005: AI Provider tauschen oder ergänzen
1. Neuen Provider in `AI_PROVIDERS` Array in `hermes_runner.js` eintragen
2. API Key als GitHub Secret hinterlegen
3. Workflow `hermes_cron.yml` um neues Secret-Env ergänzen
4. Testet: `node scripts/hermes_runner.js` lokal mit gesetzten Env-Vars
5. Push → nächster Montags-Lauf nutzt neuen Provider

---

## SOP-006: Incident Response (Wenn Hermes fehlschlägt)
1. GitHub Actions → Logs prüfen → Fehlerursache identifizieren
2. Wenn AI-Provider → anderen Provider testen, Key prüfen
3. Wenn Telegram → Bot-Status prüfen (`api.telegram.org/bot{TOKEN}/getMe`)
4. Wenn Supabase → Connection String prüfen, RLS-Regeln prüfen
5. Manuell ausführen: GitHub Actions → `Run workflow` → Dispatch

---

## SOP-007: Learnings interpretieren (Self-Improvement)
Hermes liest bei jedem Lauf `Learnings.md` und passt Prompts automatisch an:

| Regel-Typ | Beispiel | Wirkung |
|---|---|---|
| CTR-Optimierung | "§-Nennung in Zeile 1 = +40% CTR" | Immer in erste Zeile |
| Anti-Shadowban | "Diese Phrase letzte Woche" | Neue Formulierung |
| Plattform-spezifisch | "LinkedIn: max. 1 Emoji" | Automatisch eingehalten |
| Zeitlich | "Freitagabend = hohe Reichweite auf X" | Publishzeit anpassen |

---

## SOP-008: DeFi Ensemble Risk & Backtesting Lauf (2x wöchentlich)
**Trigger**: Dienstag 07:00 UTC & Freitag 16:00 UTC via GitHub Actions  
**Ergebnis**:
1. Live-Daten von DeFiLlama API (TVL, Yields, Bridges) holen
2. 600+ historische Hacks aus DeFiLlama Hacks API als Ground-Truth laden
3. 4-Modell Ensemble Risk Engine deterministisch rechnen (Regel, Anomalie, Peer, Extern)
4. Backtest durchführen: Treffsicherheit (%) & Qualitätsscore (%) berechnen
5. Telegram-Bericht mit Handlungsempfehlungen für kleine Kapitalansätze senden
6. Ergebnis in Supabase DB `defi_backtest_logs` & `defi_scores` speichern
