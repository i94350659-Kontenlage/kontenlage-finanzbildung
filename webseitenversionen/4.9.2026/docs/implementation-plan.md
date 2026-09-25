# Kontolage – Implementierungsplan (P0 → P2)

> Stand: 2026-09-25 · Grundlage: Code-, Live- und Rechtsanalyse (siehe `docs/kanban.md`)
> Arbeitsweise: Jede Phase endet mit Build + Live-Verifikation; Nachweise werden im Kanban eingetragen.
> Regel: Kein Ticket gilt als fertig, weil Code existiert – nur wenn der Nachweis (DoD) erbracht ist.

## 0. Ausgangslage (verifiziert)

| Fakt | Wert | Quelle |
|---|---|---|
| Live-Domain | `https://kontolage.de` (Vercel, Region fra1, TTFB ~110 ms) | Header-/Timing-Check |
| Bundle | 675.549 Zeichen JS (≈ 193 KB Brotli), CSS 12,6 KB (3,3 KB Brotli) | Live-Messung |
| Supabase | Projekt `tberfzrzfkwoytgqlpij`, 5 Edge Functions ACTIVE, RLS aktiv | `supabase functions list` |
| Auth | Signup offen, E-Mail-Bestätigung aktiv | `/auth/v1/settings` |
| Canonical-Problem | alle Routen liefern Startseiten-Meta + Canonical `/` | Roh-HTML von `/rechner`, `/artikel/...` |
| Sitemap | 15 URLs: 3 tote Slugs, 10 existierende Artikel fehlen | `public/sitemap.xml` vs. Artikel-Registry |
| Recht | keine AGB/Widerruf/Kündigungsbutton; Impressum mit Platzhaltern | Grep über `src/` |
| Stripe | `STRIPE_AUTOMATIC_TAX` nicht gesetzt, MwSt.-Ausweis unklar | `supabase secrets list` |
| Fonts | Google Fonts extern geladen (DSGVO + Renderpfad) | gebautes CSS |

## Phase P0 – Blocker (Reihenfolge verbindlich)

### P0-01 Prerender & Meta pro Route
1. Registry als einzige Datenquelle anlegen (`src/content/registry.ts`: Slug, Titel, Description, Datum, Kategorie).
2. Build-Script `tools/prerender-routes.mjs` erzeugt nach `vite build` für jede Route `dist/<route>/index.html` mit eigenem `title`, `description`, `canonical`, OG-Tags und JSON-LD.
3. `Seo.tsx` auf die Registry umstellen (kein Default-Leak für Detailseiten).
4. Verifikation: `tools/verify-live.mjs` um Meta-/Canonical-Prüfung je Route erweitern.

**Akzeptanz:** jede Route liefert eigene Meta und Canonical auf sich selbst; keine Startseiten-Kopie mehr für Crawler.

### P0-02 Sitemap-Generator
1. `tools/generate-sitemap.mjs` liest die Registry und schreibt `public/sitemap.xml` inklusive `lastmod`.
2. Tote Slugs (`vv-gmbh-wann-lohnt-sie-sich`, `krypto-steuern-holding`, `holding-vorteile-nachteile`) entfernen bzw. auf existierende Artikel umbiegen.
3. `robots.txt` behält Sitemap-Verweis; `/konto` und `/kabinett` bleiben `Disallow`.

**Akzeptanz:** Sitemap deckt alle real existierenden Artikel ab; jede URL liefert 200 mit eigenem Canonical.

### P0-03 Rechtliches Pflichtset
1. Routen `/agb` und `/widerruf` (Widerrufsbelehrung + Muster-Widerrufsformular) in `src/routes.ts`.
2. `KündigungsButton`-Komponente („Verträge hier kündigen") im Footer – ohne Login erreichbar, mit Bestätigungs-E-Mail.
3. `/abo`: CTA im Sinne der Button-Lösung („Zahlungspflichtig bestellen – 9,00 €/Monat inkl. 19 % MwSt."), AGB-Zustimmung, Widerrufshinweis mit Link.
4. Endpreise inkl. MwSt. gemäß Preisangabenverordnung.

**Akzeptanz:** Kauf ohne Kenntnisnahme von AGB/Widerruf unmöglich; Kündigung ohne Login in höchstens drei Schritten.

### P0-04 Impressum & Datenschutz (echte Daten)
1. Betreiber liefert: Firma/Inhaber, Anschrift, Register, USt-IdNr., Kontakt, verantwortliche Person (§ 18 Abs. 2 MStV).
2. `§ 5 TMG` → `§ 5 DDG`.
3. Datenschutz: Supabase (inkl. Drittlandtransfer), Stripe Payments Europe, Vercel als Empfänger; `localStorage` statt „Session-Cookies"; Speicherdauer; VSBG-Hinweis.

**Akzeptanz:** keine Platzhalter mehr in `Impressum.tsx` / `Datenschutz.tsx`; juristische Freigabe dokumentiert.

### P0-05 Stripe Tax & MwSt.
1. Stripe Dashboard: Tax aktivieren, Registrierung DE anlegen, Rechnungsdaten pflegen.
2. Supabase Secret `STRIPE_AUTOMATIC_TAX=true` setzen.
3. Checkout erweitern: `locale=de`, `payment_method_types[]=card`, `payment_method_types[]=sepa_debit`, `allow_promotion_codes=true`.
4. `/abo` auf Bruttopreise mit MwSt.-Hinweis umstellen; Preisangaben nur aus einer Quelle (Plan-Konfiguration).

**Akzeptanz:** Testrechnung weist 19 % USt. aus; Website zeigt Endpreise inkl. MwSt.

### P0-06 Fonts lokal
1. Benötigte Schnitte als `woff2` unter `public/fonts/`.
2. `@import` in `src/index.css` durch `@font-face` + `preload` ersetzen.
3. Bei Lizenzfragen auf freie Alternativen (z. B. Source Serif, Inter, JetBrains Mono via SIL OFL) ausweichen.

**Akzeptanz:** Live-CSS enthält keine Google-Fonts-Referenz; LCP verbessert sich messbar.

### P0-07 Stripe-Webhook & E2E-Zahlungsfluss
1. Endpoint anlegen: `https://tberfzrzfkwoytgqlpij.supabase.co/functions/v1/stripe-webhook`, Events: `checkout.session.completed`, `customer.subscription.created|updated|deleted`, `invoice.paid`, `invoice.payment_failed`.
2. `STRIPE_WEBHOOK_SECRET` setzen, `tools/stripe-webhook-setup.ps1 -Mode test` ausführen.
3. E2E: Registrierung → Testkarte → Webhook → Plan aktiv in `/konto` → Kündigung → Status `canceling`.

**Akzeptanz:** `stripe_events` enthält verarbeitete Events; Konto zeigt nach Testzahlung aktiven Tarif; doppelte Events ändern nichts.

### P0-08 Key-Rotation
1. Stripe-, Vercel-, Supabase- und Printful-Keys rotieren; neue Werte nur in Secret-Stores.
2. Git-History-Bereinigung vorbereiten (BFG oder `git filter-repo`), Rotation protokollieren.
3. `.env`-Dateien lokal prüfen: keine Secrets in `dist/`, keine Secrets in `docs/`.

**Akzeptanz:** alte Keys sind invalidiert, neue sind nur in Secret-Stores, Rotationstabelle im `SETUP_CHECKLIST.md` gepflegt.

## Phase P1 – Qualität (nach P0, parallelisierbar in dieser Reihenfolge)

1. **P1-01/P1-02:** echtes 404 + ErrorBoundary – kleine, sofort wirksame Robustheitsfixes.
2. **P1-04:** `typecheck`-Script, CI mit Build + `tsc --noEmit` + Skill-Audit; jeder weitere Schritt wird damit abgesichert.
3. **P1-03:** Lazy-Routes + Bundle-Budget (Startseite soll ohne Rechner-/Artikel-Chunks laden).
4. **P1-05/P1-06:** OG-Image und Article-/Breadcrumb-JSON-LD (baut auf der Registry aus P0-01 auf).
5. **P1-07:** Brand-Bereinigung `Kontenlage` → `Kontolage` inklusive Markenrecherche-Notiz; Legacy-Skill-IDs bleiben als Alias gültig.
6. **P1-08:** Auth-UX (Redirect-Ziel, Passwortwechsel mit aktuellem Passwort, E-Mail-Änderung).
7. **P1-10:** Monitoring + Alerting (Webhook-Fehler, Uptime, Cron).
8. **P1-11:** Repo-Hygiene in einem eigenen Commit, damit Build-Diffs nachweisbar sind.
9. **P1-12/P1-13:** A11y- und Header-Härtung, jeweils mit Live-Nachweis.
10. **P1-14/P1-15:** Content-Ops und Rechner-Deep-Links.

## Phase P2 – Ausbau (nach P1, nach Bedarf)

- **P2-01/P2-02:** Konto-Persistenz und Exporte – die auf `/abo` beworbenen Leistungen müssen existieren, sonst ist die Zahlungsseite irreführend.
- **P2-03:** Newsletter/Lead-Magnet aktivieren (Double-Opt-In, DSGVO-konform).
- **P2-06:** cookieless Analytics + KPI-Snapshot als Input für Hermes (H-04).
- **P2-04/P2-05/P2-07/P2-08:** i18n, PWA, Quiz, Partner – erst nach stabilem P0/P1-Zustand.

## Phase H – Hermes-Parallelspur

1. **H-01/H-02/H-03:** Governance-Dateien v6, fünf neue Skills, Skill-Audit-Tool + Governance-Workflow (`node tools/hermes-skill-audit.mjs`).
2. **H-04:** Self-Improvement-Loop v2 (Hypothese → Metrik → Experiment → Learnings → Rollout) mit Experiment-Log und KPI-Snapshot.
3. **H-05:** Hermes-Gates an den Produkt-Backlog koppeln: P0-Checks (Canonical, Sitemap, Rechtsseiten, MwSt.) blockieren Deploy und Content-Publish.

## Abhängigkeiten

```text
P0-01 Registry ──> P0-02 Sitemap ──> P1-05/P1-06 OG + JSON-LD ──> P1-14 Content-Ops
P0-03/P0-04 (Rechtstexte, Betreiberdaten) ──> P0-05 (MwSt./Endpreise) ──> E2E P0-07
P0-06 Fonts ──> P1-03 Perf-Budget
P1-04 CI ──> alle weiteren Tickets (Absicherung)
H-03 Audit-Tool ──> H-05 Gates ──> P0/P1-Abnahme
```

## Aufwandsschätzung (grob, 1 Person)

| Phase | Umfang | Schätzung |
|---|---|---|
| P0-01/P0-02 | Prerender + Sitemap + Verify-Erweiterung | 4–6 h |
| P0-03/P0-04 | Rechtsseiten, Kündigungsbutton, Textarbeit (Freigabe extern) | 4–6 h + Freigabe |
| P0-05 | Stripe Tax, Checkout-Parameter, Preisdarstellung | 2–3 h |
| P0-06 | Fonts lokal | 1–2 h |
| P0-07/P0-08 | Webhook-E2E + Rotation | 2 h + manuelle Kontoarbeit |
| P1-01 … P1-15 | Qualitätspaket | 12–18 h |
| P2 | Ausbau | nach Priorisierung |

## Verifikationsbefehle

```powershell
# Build + Live
npm run build
node tools/verify-live.mjs          # Routen, Bundle, Canonical, Key
node tools/verify-supabase-auth.mjs # lokale .env ↔ Build ↔ GoTrue

# Meta/Canonical pro Route (nach P0-01)
curl.exe -s https://kontolage.de/rechner | Select-String 'canonical|<title>'

# Sitemap-Konsistenz (nach P0-02)
node tools/verify-sitemap.mjs       # neu anzulegen, prüft 200 + Canonical je URL

# Hermes-Governance
node tools/hermes-skill-audit.mjs
```

## Go/No-Go-Kriterien

**Go:** Canonical/Meta korrekt je Route · Sitemap deckt alle realen Artikel · AGB + Widerruf + Kündigungsbutton live · Impressum ohne Platzhalter · MwSt. korrekt ausgewiesen · Fonts lokal · Webhook-E2E bestanden · keine Secrets im Bundle · CI grün.

**No-Go:** Startseiten-Canonical auf Unterseiten · Kaufstrecke ohne AGB/Widerrufsbezug · ungeprüfte Steuer-/Rechtsaussagen als Freigabe dargestellt · Secrets in Repo/Chat/Logs · Webhook ohne Signaturprüfung.

## Umsetzungsstand (2026-09-25, nach P0-01/P0-02/P1-01/P1-02)

**Umgesetzt und live verifiziert**

| Ticket | Nachweis |
|---|---|
| P0-01 | `content/routes.json` (24 Routen) → `tools/prerender-routes.mjs` erzeugt je Route HTML mit Title, Description, Canonical, OG/Twitter, JSON-LD und semantischem Shell-Inhalt; `npm run build` ruft Registry → Sitemap → Prerender auf |
| P0-02 | `tools/generate-sitemap.mjs` schreibt `public/sitemap.xml` und `dist/sitemap.xml` (22 URLs, `lastmod`); die drei toten Slugs sind entfernt |
| P1-01 | SPA-Catch-all-Rewrite entfernt, `cleanUrls` aktiv; `dist/404.html`; live: unbekannte URL → **404** + `noindex` |
| P1-02 | `src/components/ErrorPage.tsx` + `ErrorBoundary` in `src/routes.ts` |
| P1-14 | `Seo.tsx` liest ausschließlich die Registry (kein Default mehr für Detailseiten) |
| P1-13 (Teil) | `Permissions-Policy`-Header ergänzt; Cache-Regel für HTML angepasst |
| Neues Werkzeug | `tools/verify-seo.mjs` prüft je Route Status, Title, Canonical, JSON-LD, h1, robots sowie 404 und Sitemap-Abdeckung → **151/151 Prüfungen bestanden** |
| Neues Werkzeug | `tools/brand-consistency-check.mjs` (Marken-Kanon, `--fix`) und `tools/hermes-skill-audit.mjs` (Skill-Governance) |

**Bewusste Design-Entscheidung:** Statt Client-seitiger Meta-Aktualisierung liefert der Server jetzt pro Route fertiges HTML aus („true prerender"). Damit funktionieren auch Social-Crawler ohne JavaScript, und der Startseiten-Canonical-Leak ist beseitigt. Nach jeder Änderung an der Registry ist ein neuer Deploy nötig.

**Nächste Schritte in der geplanten Reihenfolge**

1. P0-03/P0-04 (Rechtsseiten und echte Betreiberdaten) – blockiert durch Zuarbeit, siehe `TODOperHAND.md`.
2. P0-05 (Stripe Tax + MwSt.-Endpreise) – erfordert Dashboard-Aktivierung.
3. P0-06 (Fonts lokal) – unabhängig umsetzbar, danach LCP-Messung als Nachweis.
4. P1-03 (Lazy-Routes + Bundle-Budget), P1-04 (CI mit Typecheck), P1-05 (OG-Image), P1-12 (A11y).


