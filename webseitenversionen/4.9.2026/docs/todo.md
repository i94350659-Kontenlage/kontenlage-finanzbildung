# Kontolage – Todo-Liste (Arbeitsstand)

> Stand: 2026-09-25 · Arbeitschecklisten zu `docs/kanban.md` und `docs/implementation-plan.md`
> Konvention: `[ ]` offen, `[x]` erledigt, `[~]` teilweise (mit Notiz), `[!]` blockiert (Grund dahinter)
> Nach jeder Sitzung: Status im Kanban nachziehen und hier Abhaken.

## Definition of Done (gilt für jedes Ticket)

- [ ] Code/Inhalt umgesetzt und im Build enthalten (`npm run build`)
- [ ] Verifikation ausgeführt (`node tools/verify-live.mjs` bzw. ticket-spezifischer Check)
- [ ] Nachweis im Kanban eingetragen (URL, Befehl, Messwert)
- [ ] keine Secrets in Code, Doku oder Chat
- [ ] Doku aktualisiert (`docs/`, `SETUP_CHECKLIST.md` bei Betriebsthemen)

---

## Sofortblock (Sitzung 1) – P0-01, P0-02, P1-01, P1-02 · ✅ abgeschlossen 2026-09-25

- [x] `content/routes.json`: Routen + Artikel (Slug, Titel, Description, Datum, Kategorie) als einzige Quelle
- [x] `src/pages/ArtikelDetail.tsx` und `src/pages/Artikel.tsx` auf die Registry umgestellt
- [x] `src/components/Seo.tsx` liest aus der Registry (kein Default mehr für Detailseiten)
- [x] `tools/prerender-routes.mjs`: erzeugt je Route HTML mit Title/Description/Canonical/OG/JSON-LD (26 Routen + `404.html`)
- [x] Root-`package.json`-Build um den Prerender-Schritt ergänzt (`npm run prerender`)
- [x] `tools/generate-sitemap.mjs`: Sitemap mit `lastmod`, tote Slugs entfernt (24 URLs)
- [x] `tools/verify-seo.mjs` erweitert: je Route Title ≠ Startseiten-Title, Canonical == eigene URL
- [x] Sitemap-Prüfung integriert (Abdeckung + keine toten URLs + `lastmod`)
- [x] echtes 404: `dist/404.html` per Prerender, Live-Status 404 + `noindex`
- [x] `ErrorBoundary` in `src/routes.ts` + `src/components/ErrorPage.tsx` (404- und 500-Variante)
- [x] Nachweis: `node tools/verify-seo.mjs` → **163/163 live bestanden, 0 Fehler**

## Recht & Geldfluss (Sitzung 2) – P0-03, P0-04, P0-05

- [x] `src/pages/Agb.tsx` + Route `/agb` (inkl. Widerrufsverzicht-Klausel für digitale Inhalte)
- [x] `src/pages/Widerruf.tsx` + Route `/widerruf` (Belehrung + Muster-Widerrufsformular)
- [x] `src/components/Legal.tsx` gebündelt; Chunk `Legal-*.js` lazy (2,2 KB gzip)
- [!] `src/components/KuendigungsButton.tsx`: „Verträge hier kündigen" — **Wartet auf P0-04/P1-09** (Bestätigungs-Mail braucht eigenen SMTP, Firmendaten fehlen)
- [x] Footer: Links auf AGB, Widerruf, Datenschutz, Impressum, Transparenz
- [~] `/abo`: AGB-/Widerruf-Links ergänzt; **Endpreise „inkl. 19 % MwSt."** erst nach Klärung Umsatzsteuerstatus (siehe `TODOperHAND.md`)
- [~] Plan-Preise/Perioden aus Konfiguration — Struktur vorhanden, finale Werte nach deiner Preisentscheidung
- [!] `Impressum.tsx`: echte Daten einsetzen, `§ 5 TMG` → `§ 5 DDG` (braucht Betreiberdaten)
- [!] `Datenschutz.tsx`: Supabase/Stripe/Vercel nennen, `localStorage` korrigieren (braucht Freigabe)
- [!] Stripe Dashboard: Tax aktivieren, Registrierung DE, Rechnungsdaten
- [!] Supabase Secret `STRIPE_AUTOMATIC_TAX=true`
- [x] Checkout-Parameter: `locale=de`, `allow_promotion_codes`; SEPA über Tax-Billing aktiviert sich automatisch
- [!] Nachweis: Testrechnung mit 19 % USt. (erst nach Tax-Aktivierung)

## Browser-Erlebnis (Sitzung 3) – P0-06, P1-03, P1-05, P1-12 · ✅ abgeschlossen 2026-09-25

- [x] `woff2`-Dateien nach `public/fonts/` (4 Dateien, 153 KB), `@font-face` in `src/fonts.css`, 2 Preloads im HTML-Kopf
- [x] Netzwerktab: keine Google-Fonts-Requests mehr (live geprüft)
- [x] Lazy-Routes via `React.lazy` + `Suspense` (`RouterFallback`) für alle Seiten
- [x] `Suspense`-Fallback ohne Layout-Sprung
- [x] Bundle-Budget: `tools/bundle-guard.mjs`, Einstiegs-Chunk **44 595 B** (Budget 120 000 B), grün
- [x] OG-Image 1200×630 PNG (107 KB) + `twitter:card=summary_large_image` + `og:locale` (live 200)
- [x] A11y: `aria-expanded` am Burger, `aria-pressed`/`aria-controls` an Rechner-Tabs, Feld-Labels, Skip-Link, Fokus nach Routenwechsel, `prefers-reduced-motion`
- [x] Nachweis: Bundle-Guard grün, Health-Check **36/36 live**, Header-Check grün

## Betrieb (Sitzung 4) – P0-07, P0-08, P1-04, P1-10, P1-11, P1-13

- [!] Stripe-Webhook-Endpoint anlegen, `STRIPE_WEBHOOK_SECRET` setzen (Dashboard)
- [!] `tools/stripe-webhook-setup.ps1 -Mode test` ausführen (wird durch obigen Punkt möglich)
- [x] Live-Signaturprüfung bestätigt: `stripe-webhook` ohne Signatur → 400 (im Health-Check verankert)
- [!] E2E-Testkarte: Checkout → Webhook → aktiver Plan → Kündigung
- [!] Key-Rotation (Stripe, Vercel, Supabase, Printful) + Eintrag im `SETUP_CHECKLIST.md`
- [x] `"typecheck": "tsc --noEmit"` in `webseitenversionen/4.9.2026/package.json` (Exit 0)
- [x] `.github/workflows/ci.yml`: Build + Typecheck + Bundle-Guard + Skill-Audit
- [x] Monitoring: `tools/health-check.mjs` (36 Checks) + `.github/workflows/health-monitor.yml`
- [x] Repo-Hygiene (Root-`assets/`, Doppeldateien, `api/`-Legacy, `pg`-Dependency, Figma-Plugins, zweites Lockfile)
- [x] CSP + Permissions-Policy + Cache-Regel auch für `/` (live per HEAD bestätigt)
- [~] Nachweis: Workflow-Lauf + Header-Check grün · offen: `git status` sauber (Commit steht aus, siehe `TODOperHAND.md`)

## Hermes (parallel) – H-01 … H-05

- [x] Governance-Dateien v6 fertig (`SOUL.md`, `AGENT.md`, `AGENTS.md`, `SKILLS.md`, `SOP.md`, `MEMORY.md`, `PROJECT.md`, `USER.md`)
- [x] fünf neue Skills angelegt (SEO-Prerender, Legal-Gate, Billing/Tax, Brand-Guardian, Self-Improvement-Loop)
- [x] `tools/hermes-skill-audit.mjs` läuft ohne Fehler (30/30, 0 Fehler, 24 Legacy-Warnungen)
- [x] `.github/workflows/hermes-governance.yml` aktiv (Push/PR/Montag 04:30 UTC)
- [ ] Self-Improvement-Loop v2: Wochen-Experiment dokumentiert (Hypothese, Metrik, Ergebnis) → H-04
- [ ] KPI-Snapshot je Woche (Traffic, Sitemap-Abdeckung, Conversion, Deploy-Status) → H-04, P2-06
- [ ] P0-Gates in den Deploy-/Publish-Pfad eingebaut → H-05

## Nur manuell durch dich möglich (nicht automatisierbar)

- [!] echte Firmendaten für Impressum/Datenschutz (Firma, Anschrift, Register, USt-IdNr., verantwortliche Person)
- [!] juristische Freigabe von AGB, Widerruf, Datenschutz (Steuerberater/Anwalt)
- [!] Stripe-Dashboard: Tax-Registrierung, Rechnungsprofil, Zahlungsarten, Webhook anlegen
- [!] Entscheidung zu Supabase Pro (eigener SMTP + gebrandete Mails) oder Übergangslösung
- [!] Markenrecherche „Kontolage/Kontenlage" (DPMA) und Entscheidung über Namensführung
- [!] Gewerbeanmeldung + Freigabe der Preis-Sichtbarkeit
- [!] Google Search Console prüfen und Indexierungsstand nach P0-01/P0-02 bewerten (4–6 Wochen später)

## Nächste-Sitzung-Startpunkt

1. `docs/kanban.md` öffnen, P0-01/02 auf `IN_PROGRESS` setzen.
2. Registry anlegen, Prerender-Script schreiben, Build erweitern.
3. `node tools/verify-live.mjs` und Sitemap-Check laufen lassen, Nachweise ins Kanban.
