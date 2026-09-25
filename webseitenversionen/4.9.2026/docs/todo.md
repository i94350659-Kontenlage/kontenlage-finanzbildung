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

## Sofortblock (Sitzung 1) – P0-01, P0-02, P1-01, P1-02

- [ ] `src/content/registry.ts`: Routen + Artikel (Slug, Titel, Description, Datum, Kategorie) als einzige Quelle
- [ ] `src/pages/ArtikelDetail.tsx` und `src/pages/Artikel.tsx` auf die Registry umstellen
- [ ] `src/components/Seo.tsx` liest aus der Registry (kein Default mehr für Detailseiten)
- [ ] `tools/prerender-routes.mjs`: erzeugt je Route `dist/<route>/index.html` mit Title/Description/Canonical/OG/JSON-LD
- [ ] Root-`package.json`-Build um den Prerender-Schritt ergänzen (`node tools/prerender-routes.mjs`)
- [ ] `tools/generate-sitemap.mjs`: Sitemap mit `lastmod`, tote Slugs entfernt
- [ ] `tools/verify-live.mjs` erweitern: je Route Title ≠ Startseiten-Title, Canonical == eigene URL
- [ ] `tools/verify-sitemap.mjs`: Status 200 + Canonical je Sitemap-URL
- [ ] echtes 404: `src/pages/NotFound.tsx` über `404.html`/Prerender mit Status 404 ausliefern
- [ ] `errorElement` in `src/routes.ts` + Fehler-UI-Komponente
- [ ] Nachweis: `node tools/verify-live.mjs` und Roh-HTML-Check `/rechner` + ein Artikel

## Recht & Geldfluss (Sitzung 2) – P0-03, P0-04, P0-05

- [ ] `src/pages/Agb.tsx` + Route `/agb` (inkl. Widerrufsverzicht-Klausel für digitale Inhalte)
- [ ] `src/pages/Widerruf.tsx` + Route `/widerruf` (Belehrung + Muster-Widerrufsformular)
- [ ] `src/components/KuendigungsButton.tsx`: „Verträge hier kündigen", ohne Login, mit Bestätigungs-Mail
- [ ] Footer: Links auf AGB, Widerruf, Kündigungsbutton, Datenschutz, Impressum
- [ ] `/abo`: CTA-Text mit Endpreis inkl. MwSt. + AGB-Zustimmungshäkchen vor Checkout
- [ ] Plan-Preise/Perioden aus einer Konfigurationsdatei (nicht mehr inline in `Abo.tsx`)
- [ ] `Impressum.tsx`: echte Daten einsetzen, `§ 5 TMG` → `§ 5 DDG`
- [ ] `Datenschutz.tsx`: Supabase/Stripe/Vercel nennen, `localStorage` korrigieren, Speicherdauer, VSBG-Hinweis
- [ ] Stripe Dashboard: Tax aktivieren, Registrierung DE, Rechnungsdaten
- [ ] Supabase Secret `STRIPE_AUTOMATIC_TAX=true`
- [ ] Checkout-Parameter: `locale=de`, Karte + SEPA, Promo-Codes
- [ ] Nachweis: Testrechnung mit 19 % USt. als PDF/Log; Screenshot der `/abo`-Preisdarstellung

## Browser-Erlebnis (Sitzung 3) – P0-06, P1-03, P1-05, P1-12

- [ ] `woff2`-Dateien nach `public/fonts/`, `@font-face` in `index.css`, `preload` im HTML-Kopf
- [ ] Netzwerktab: keine Google-Fonts-Requests mehr
- [ ] Lazy-Routes für `/rechner`, `/holding`, `/anlageformen`, `/artikel/*`, `/konto`
- [ ] `Suspense`-Fallback ohne Layout-Sprung
- [ ] Bundle-Budget ≤ 150 KB Brotli initial; Messung dokumentieren
- [ ] OG-Image 1200×630 (PNG) + `twitter:card=summary_large_image` + `og:locale=de_DE`
- [ ] A11y-Pass: `aria-expanded` am Burger, Feld-Labels, Fokus nach Routenwechsel, `prefers-reduced-motion`
- [ ] Nachweis: Netzwerk-/Bundle-Messung, axe-Scan, Tastatur-Durchlauf

## Betrieb (Sitzung 4) – P0-07, P0-08, P1-04, P1-10, P1-11, P1-13

- [ ] Stripe-Webhook-Endpoint anlegen, `STRIPE_WEBHOOK_SECRET` setzen
- [ ] `tools/stripe-webhook-setup.ps1 -Mode test` ausführen und Ergebnis protokollieren
- [ ] E2E-Testkarte: Checkout → Webhook → aktiver Plan → Kündigung
- [ ] Key-Rotation (Stripe, Vercel, Supabase, Printful) + Eintrag im `SETUP_CHECKLIST.md`
- [ ] `"typecheck": "tsc --noEmit"` in `webseitenversionen/4.9.2026/package.json`
- [ ] `.github/workflows/ci.yml`: Build + Typecheck + `node tools/hermes-skill-audit.mjs`
- [ ] Monitoring: fehlgeschlagene `stripe_events` + Uptime-Check + Alerting-Kanal
- [ ] Repo-Hygiene-Commit (Root-`assets/`, Doppeldateien, `api/`-Legacy, `pg`-Dependency, Figma-Plugins)
- [ ] CSP + Permissions-Policy + COOP; Cache-Regel auch für `/`
- [ ] Nachweis: Workflow-Lauf, Header-Check, `git status` sauber

## Hermes (parallel) – H-01 … H-05

- [ ] Governance-Dateien v6 fertig (`SOUL.md`, `AGENT.md`, `AGENTS.md`, `SKILLS.md`, `SOP.md`, `MEMORY.md`, `PROJECT.md`)
- [ ] fünf neue Skills angelegt (SEO-Prerender, Legal-Gate, Billing/Tax, Brand-Guardian, Self-Improvement-Loop)
- [ ] `tools/hermes-skill-audit.mjs` läuft ohne Fehler
- [ ] `.github/workflows/hermes-governance.yml` aktiv und grün
- [ ] Self-Improvement-Loop v2: Wochen-Experiment dokumentiert (Hypothese, Metrik, Ergebnis)
- [ ] KPI-Snapshot je Woche (Traffic, Sitemap-Abdeckung, Conversion, Deploy-Status)
- [ ] P0-Gates in den Deploy-/Publish-Pfad eingebaut (H-05)

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
