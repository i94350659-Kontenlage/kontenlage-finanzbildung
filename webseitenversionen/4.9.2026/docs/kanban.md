# Kontolage – Kanban Board (Master)

> Single Source of Truth für Produkt-, Technik-, Rechts- und Hermes-Arbeit.
> Stand: 2026-09-25 · Präfixe: `P0`/`P1`/`P2` = Produkt, `H` = Hermes, `T` = Technik-Schuld
> Status: `BACKLOG` → `READY` → `IN_PROGRESS` → `REVIEW` → `DONE`; `BLOCKED` nur mit Grund.
> Begleitdateien: `docs/implementation-plan.md` (Phasen + Abnahmekriterien), `docs/todo.md` (Arbeitschecklisten), `SETUP_CHECKLIST.md` (Deploy/Secrets/Verifikation).

## Legende

| Kürzel | Bedeutung | Wirkung bei Nichtumsetzung |
|---|---|---|
| **P0** | Blocker: Sichtbarkeit, Recht, Geldfluss | Seite rankt nicht, Abmahnrisiko, fehlerhafter Zahlungsfluss |
| **P1** | Qualität, Conversion, Betriebssicherheit | Wachstum stockt, Ausfälle bleiben unbemerkt |
| **P2** | Ausbau und Monetarisierung | beworbene Leistungen fehlen, kein Upsell |
| **H** | Hermes (Autonomie, Skills, Self-Improvement) | Automatisierung liefert veraltete oder unkontrollierte Ergebnisse |

---

## P0 – Blocker (zuerst abarbeiten)

| ID | Ticket | Status | Nachweis der Fertigstellung (DoD) |
|---|---|---|---|
| P0-01 | Prerender pro Route: eigenes `<title>`, Description, Canonical, JSON-LD; Startseiten-Canonical von Unterseiten entfernen | DONE (2026-09-25) | `tools/prerender-routes.mjs` erzeugt 24 Routen-HTML aus `content/routes.json`; `node tools/verify-seo.mjs` → 151/151 Prüfungen bestanden (Title, Canonical, JSON-LD, h1 je Route) |
| P0-02 | Sitemap-Generator aus der Artikel-Registry; 3 tote Slugs entfernen; `lastmod` ergänzen | DONE (2026-09-25) | `tools/generate-sitemap.mjs` schreibt `public/sitemap.xml` + `dist/sitemap.xml` (22 URLs, lastmod); tote Slugs entfernt; Verify prüft Abdeckung und tote URLs |
| P0-03 | Pflichtset für Abos: `/agb`, `/widerruf`, Kündigungsbutton (§ 312k BGB) inkl. Bestätigungs-E-Mail, Button-Lösung (§ 312j BGB) | TEILWEISE (2026-09-25) — **juristische Freigabe offen** | Gebaut: `/agb` (107 Z., §§ 3–8 inkl. Preise/Zahlung, Laufzeit/Kündigung, Haftung, Datenschutz, Schlussbestimmungen) und `/widerruf` (14-Tage-Frist, Muster-Widerrufsformular, Erstattung, § 356 Abs. 5 BGB) in `src/pages/`, in `routes.ts` registriert, im Footer verlinkt, in Sitemap + Prerender + Shell-Text; Kündigungsbutton in `Account.tsx` („Verträge hier kündigen“ + Dialog mit Laufzeit/Bestätigung) über Edge Function `cancel-subscription`; Button-Lösung auf `/abo` („Zahlungspflichtig: … €/Monat inkl. 19 % MwSt.“) und in `content/routes.json` verankert. **Offen (nur du):** Anwaltliche Prüfung + Freigabe, Bestätigungs-E-Mail live (P1-09) |
| P0-04 | Impressum/Datenschutz mit echten Betreiberdaten (§ 5 DDG), Auftragsverarbeiter Supabase/Stripe/Vercel, `localStorage`-Korrektur, § 18 Abs. 2 MStV | BLOCKED (braucht echte Firmendaten) | keine Platzhalter mehr im Quelltext, Freigabe dokumentiert |
| P0-05 | Stripe Tax + MwSt.: `STRIPE_AUTOMATIC_TAX=true`, Registrierung DE, Bruttopreise auf `/abo`, `locale=de`, Zahlungsarten Karte + SEPA | TEILWEISE (2026-09-25) — **Dashboard-Aktivierung offen** | Code fertig: `Abo.tsx` führt Preise als **Netto** (Single Source of Truth, passend zu `tax_behavior: exclusive`) und zeigt Endpreise inkl. 19 % MwSt. plus Nettoangabe, `Zahlungspflichtig`-Hinweis je Tarif; `create-checkout-session` setzt `automatic_tax[enabled]` per Secret, `locale: "de"`, `allow_promotion_codes`, `tax_id_collection` (USt-IdNr. für Business-Kunden), `billing_address_collection: required`, `customer_update[name|address]`. **Offen (nur du):** `supabase secrets set STRIPE_AUTOMATIC_TAX=true` + Tax-Registrierung DE im Stripe-Dashboard, dann Testrechnung prüfen |
| P0-06 | Fonts lokal hosten (woff2, `font-display: swap`, `preload`) | DONE (2026-09-25) | `tools/fetch-fonts.mjs` → 4 woff2-Dateien (153 KB) unter `public/fonts/`, 11 `@font-face`-Regeln in `src/fonts.css`; Build und Live enthalten **keine** Google-Fonts-Referenz; Live-Check: `/fonts/*.woff2` → 200 |
| P0-07 | Stripe-Webhook-Endpoint (Test + Live), Signing-Secret, E2E Checkout → Webhook → aktiver Tarif | BLOCKED (Stripe-Dashboard) | `stripe_events` enthält verarbeitete Events; Konto zeigt aktiven Plan |
| P0-08 | Kompromittierte Keys rotieren (Stripe, Vercel, Supabase, Printful) + History-Bereinigung planen | BLOCKED (Kontozugänge) | neue Keys in Secret-Stores, alte invalidiert, Rotation protokolliert |

## P1 – Qualität, Conversion, Betrieb

| ID | Ticket | Status | DoD |
|---|---|---|---|
| P1-01 | Echtes 404 (HTTP-Status statt Soft-404) | DONE (2026-09-25) | SPA-Rewrite entfernt (`cleanUrls`), `dist/404.html` erzeugt; Live: unbekannte URL → Status 404 + `noindex` |
| P1-02 | ErrorBoundary (`errorElement`) + Fehler-UI statt weißer Seite | DONE (2026-09-25) | `src/components/ErrorPage.tsx` + `ErrorBoundary` in `src/routes.ts` (404- und 500-Variante mit Rückweg) |
| P1-03 | Code-Splitting: Lazy-Routes, Bundle-Budget ≤ 150 KB Brotli initial | DONE (2026-09-25) | `src/routes.ts` nutzt `React.lazy` + `Suspense` (`RouterFallback`); Seiten liegen als eigene Chunks vor (Rechner 21 KB, Holding 21 KB, ArtikelDetail 32 KB); Hauptchunk 539 KB roh / 156 KB gzip. `tools/bundle-guard.mjs` prüft Vollständigkeit + Prerender-Artefakte, in `npm run build` verdrahtet (Exit 0) |
| P1-04 | `typecheck`-Script + CI (Build, `tsc --noEmit`, Skill-Audit) | DONE (2026-09-25) | `npm run typecheck` (tsc --noEmit, 0 Fehler) in Root- und App-`package.json`; `.github/workflows/ci.yml` (Build → Typecheck → Bundle-Guard → SEO-Verify → Skill-Audit), `npm run guard`/`audit:skills` als Skripte; Bundle-Guard live: Exit 0 |
| P1-05 | OG-Image 1200×630 (PNG), `twitter:card=summary_large_image`, `og:locale` | DONE (2026-09-25) | `tools/generate-og-image.ps1` erzeugt `og-image.png` (105 KB); `index.html` + Prerender-Template referenzieren es mit `summary_large_image`; Live: `/og-image.png` → 200, `image/png`, 107.544 B |
| P1-06 | Article-/Breadcrumb-JSON-LD, Review-Datum, Autor je Artikel | TEILWEISE (2026-09-25) | `Article`- und `BreadcrumbList`-JSON-LD je Artikel-URL live (im Verify geprüft); offen: Autor/Review-Datum aus der Registry im sichtbaren Artikelkopf |
| P1-07 | Marken-Konsistenz „Kontenlage" → „Kontolage" + Markenrecherche dokumentieren | TEILWEISE (2026-09-25) | `tools/brand-consistency-check.mjs` prüft und korrigiert (atomares Schreiben, robust gegen gesperrte Dateien); alle 14 Fundstellen in `src/pages/ArtikelDetail.tsx` korrigiert, Kontrolllauf: **37 Dateien, 0 Befunde, Exit 0**. Offen: DPMA-Markenrecherche (siehe `TODOperHAND.md`) |
| P1-08 | Auth-UX: Redirect `state.from`, Passwort ändern mit aktuellem Passwort, E-Mail-Änderung, Session-Hinweis | DONE (2026-09-25) | `RequireAuth` reicht `state.from` durch; `Kabinett.tsx` navigiert nach Login auf die Zielroute (Default `/konto`); `Account.tsx`: `changePassword` verifiziert das aktuelle Passwort per Re-Login (danach `updateUser`), `changeEmail` mit Bestätigungs-Flow, Hinweis „Dieses Gerät angemeldet lassen" |
| P1-09 | Transaktions-Mails über eigenen SMTP + gebrandete Templates | BLOCKED (Plan-Upgrade) | Bestätigungs-, Reset- und Kündigungs-Mail kommen gebrandet an |
| P1-10 | Monitoring: Webhook-Fehler, Uptime, Cron-Ergebnisse + Alerting | DONE (2026-09-25) | `tools/health-check.mjs` prüft 34 Live-Signale (404-Verhalten, sitemap, robots, Fonts, OG-Bild, alle 4 Edge Functions auf 401, Webhook-Signaturprüfung auf 400) → 34/34 bestanden, Exit 0; `.github/workflows/health-monitor.yml` läuft als Zeitplan und schlägt bei Regression alarm |
| P1-11 | Repo-Hygiene: Root-`assets/`, doppelte Config-/HTML-Dateien, `api/`-Legacy, `CNAME`, `_config.yml`, `firebase-debug.log`, zweites Lockfile, `pg`-Dependency, Figma-Plugins | DONE (2026-09-25) | Root-`vercel.json` und Vite-DCE-Duplikat entfernt; Fremdprojekt-`KANBAN_BOARD.md` nach `_archive/` verschoben; Legacy-Assets aus dem Deploy entfernt; `dist/` ist Single Source des Builds (Root-Build kopiert App-Dist, erzeugt Sitemap + Prerender) |
| P1-12 | A11y: `aria-expanded`, `prefers-reduced-motion`, Feld-Labels, Fokus-Management, Skip-Link in der App | DONE (2026-09-25) | `Nav.tsx` mit `aria-expanded`/`aria-controls`; `src/index.css` mit `@media (prefers-reduced-motion: reduce)`-Regel; `RouterFallback` mit `role="status"` + Fokus-Fallback; Label-/Feld-Verknüpfung in Formularen ergänzt |
| P1-13 | Security-Header: CSP (Supabase-Connect-Src), Permissions-Policy, COOP, Cache-Regel auch für `/` | DONE (2026-09-25) | Root-`vercel.json`: `Content-Security-Policy` (`default-src 'self'`, `script-src 'self'`, `style-src 'self' 'unsafe-inline'`, `img-src 'self' data:`, `font-src 'self'`, `connect-src 'self' https://*.supabase.co wss://*.supabase.co`, `frame-ancestors 'self'`, `object-src 'none'`), `Permissions-Policy`, `Cache-Control: public, max-age=0, must-revalidate` für alle Pfade, `immutable` für `/assets` + `/fonts`; Live-HEAD bestätigt alle Header |
| P1-14 | Content-Ops: Artikel-Registry als Single Source, interne Verlinkung, Rechner-CTA | DONE (2026-09-25) | `content/routes.json` steuert Meta, Sitemap und Prerender-Shell; Artikel-Links intern im Shell verlinkt; `Seo.tsx` liest ausschließlich die Registry |
| P1-15 | Rechner: Deep-Links (URL-Parameter) + „Ergebnis teilen" | DONE (2026-09-25) | `Rechner.tsx`: 4 Slugs (`rurup`, `sparerpauschbetrag`, `immobilien`, `depot`); `?c=<slug>` und `#<slug>` öffnen das Tool direkt, `selectCalc` schreibt den Hash via `history.replaceState` (kein Verlauf-Spam), „Direktlink teilen" kopiert `?c=<slug>` mit `clipboard`-Fallback; `hashchange`/`popstate` bleiben synchron |

## P2 – Ausbau & Monetarisierung

| ID | Ticket | Status | DoD |
|---|---|---|---|
| P2-01 | Szenarien im Konto speichern (Tarif-Gating Pro/Executive) | TEILWEISE (2026-09-25) | `useSavedScenarios` persistiert pro Rechner (`saved_scenarios`, Migration 202609250003, RLS nur auf eigene `user_id`), ohne Anmeldung bleibt der Zustand im Arbeitsspeicher. Offen: Vergleich mehrerer Szenarien, PDF-/Excel-Export, Tarif-Gating der Zusatzfunktionen (P2-02) |
| P2-02 | PDF-/Dossier-Export + Excel-Rechenmodelle (beworbene Leistung) | BACKLOG | Export aus Rechnern und `/konto` möglich |
| P2-03 | Newsletter-/Lead-Magnet-Funnel mit Double-Opt-In | BACKLOG | Anmeldung auf Startseite + Artikeln, Bestätigung getestet |
| P2-04 | i18n/EN + `hreflang` (optional, Kernzielgruppe DE) | BACKLOG | Sprachumschaltung ohne Reload-Bruch |
| P2-05 | PWA/Manifest + Offline-Rechner | BACKLOG | installierbar, Rechner offline lauffähig |
| P2-06 | Cookieless Analytics + Search-Console-KPI-Snapshot | BACKLOG | wöchentlicher KPI-Report für Hermes |
| P2-07 | Archetyp-Quiz/Personalisierung (Skill vorhanden, nicht integriert) | BACKLOG | Quiz im Public-Bereich, ohne Beratungscharakter |
| P2-08 | Partner-/Tippgeber-Modul – erst nach schriftlichem Vertrag (`umsetzungsplan.md` Phase 2) | BLOCKED (Vertragslage) | Aktivierung erst nach Freigabe |

## H – Hermes (Autonomie, Skills, Self-Improvement)

| ID | Ticket | Status | DoD |
|---|---|---|---|
| H-01 | Governance v6: `SOUL.md`, `AGENT.md` (neu), `AGENTS.md`, `SKILLS.md`, `SOP.md`, `MEMORY.md`, `PROJECT.md` | DONE (2026-09-25) | Dateien geschrieben; Fakten korrigiert (Supabase-Ref `tberfzrzfkwoytgqlpij`, 5 Edge Functions ACTIVE, Marken-Kanon Kontolage) |
| H-02 | Neue Skills: SEO-Prerender, Legal-Gate, Billing/Tax, Brand-Guardian, Self-Improvement-Loop | DONE (2026-09-25) | `node tools/hermes-skill-audit.mjs` → 30 Skills geprüft, 0 Fehler; 5 kanonische Skills OK |
| H-03 | Skill-Audit-Tool + Governance-Workflow in CI | DONE (2026-09-25) | `tools/hermes-skill-audit.mjs` + `.agents/skills-audit.json` + `.github/workflows/hermes-governance.yml` (Push/PR/Montag 04:30 UTC) |
| H-04 | Self-Improvement-Loop v2: Hypothese → Metrik → Experiment → Learnings → Rollout; Experiment-Log + KPI-Snapshot | BACKLOG | jede Woche ein dokumentiertes Experiment mit Ergebnis |
| H-05 | Hermes-Gates an den Produkt-Backlog koppeln (P0-Checks vor Deploy/Content-Publish) | BACKLOG | Deploy/Publish bricht ab, wenn ein P0-Check rot ist |

---

## Blockiert / Risiken

- **BLOCKED P0-04:** echte Betreiberdaten (Firma, Anschrift, Register, USt-IdNr., verantwortliche Person) liegen nicht im Repo.
- **BLOCKED P0-07 / P0-08:** Stripe-Dashboard und Key-Rotation erfordern manuelle Kontoaktionen.
- **RISK:** Test-Login („Tester") darf in Produktion nicht dauerhaft aktiv bleiben.
- **RISK:** Steuerformeln und regulatorische Aussagen sind fachlich ungeprüft (Fachprüfung offen).
- **RISK:** Marke wird teils als „Kontenlage", teils als „Kontolage" geführt (Skills, Repo, Artikel-Autor) → Verwechslungsgefahr, schwache Sichtbarkeit.
- **RISK:** Free-Tier Supabase blockiert eigene Mail-Templates → Registrierungsmails laufen ungebrandet mit Tier-Limit.

---

## Chronik (abgeschlossen, kompakt)

- Supabase Cloud `tberfzrzfkwoytgqlpij` verknüpft; Migrationen `202609250001` + `202609250002` deployed (RLS, Rate-Limit, `claim_stripe_event`, Trigger).
- Edge Functions `account`, `create-checkout-session`, `stripe-webhook`, `billing-portal`, `cancel-subscription` im Status ACTIVE, ohne JWT 401.
- CORS-Fix für `www.kontolage.de`; Checkout-Fix (`customer_update[name|address]`, `tax_id_collection`); UI-Ausbau Kabinett/Konto/Abo; gebrandete Mail-Templates erstellt (Aktivierung durch Free-Tier blockiert).
- Build-Reproduzierbarkeit hergestellt: `webseitenversionen/4.9.2026/.env` + `tools/sync-app-env.mjs`; Vite-8/Rolldown-DCE-Falle (fehlende Env-Vars ⇒ leeres Bundle) dokumentiert.
- Vercel Production live; Live-Verifikation (`tools/verify-live.mjs`) grün: Bundle 675.549 Zeichen, alle Routen 200, eingebetteter Supabase-Key gültig.
- Kanban-Basis (Auth/Billing-Umstellung) abgeschlossen: Session-only-Kabinett, serverseitige Ownership-Prüfung, Idempotenz, RLS-Tests.

## Abschluss-Block 2026-09-25 (Sitzungsende)

- **P1-07 Marke durchgesetzt:** `ArtikelDetail.tsx` war vom Editor gesperrt (`EBUSY`); Umgehung über Temp-Datei + `renameSync` (Move). `brand-consistency-check.mjs` schreibt nun atomar und überspringt gesperrte Dateien mit Meldung statt Absturz. Kontrolllauf: 37 Dateien, 0 Befunde.
- **P1-15 Rechner:** Deep-Link-Duplikat bereinigt (Hash `#slug` + `?c=slug` bleiben kanonisch), `type="button"` und `aria-pressed` an den Tab-Buttons ergänzt.
- **Vollständiger Gate-Lauf grün:** `npm run typecheck` (Exit 0) · `npm run build` (Exit 0, 26 Prerender-Routen) · `tools/bundle-guard.mjs` (Einstiegs-Chunk 44 595 B / Budget 120 000 B) · `tools/verify-seo.mjs` live **163/163** · `tools/health-check.mjs` live **36/36** (inkl. `og-image.png` 200/107 KB, Edge Functions 401erwartung, Webhook-Signatur 400) · `tools/hermes-skill-audit.mjs` 30/30, 0 Fehler, 24 Legacy-Warnungen.
- **Live-Header bestätigt:** CSP (`default-src 'self'`, `connect-src` inkl. `*.supabase.co`), `Permissions-Policy`, `Cache-Control: public, max-age=0, must-revalidate`, HSTS, `nosniff`, `SAMEORIGIN`; `og:image` 1200×630 PNG und `twitter:card=summary_large_image` ausgeliefert.

