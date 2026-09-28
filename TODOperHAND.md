# TODOperHAND — nur von dir erledigbar

> Stand: 2026-09-25 · Gegenstück zu `webseitenversionen/4.9.2026/docs/todo.md` (dort steht alles, was automatisiert läuft).
> Hier stehen **ausschließlich** Dinge, die Zugänge, Unterschriften, Zahlungen oder juristische Entscheidungen brauchen.
> Nach Erledigung: Häkchen setzen und im Kanban (`docs/kanban.md`) den Ticketstatus nachziehen.

## 0. DRINGEND: Schluessel im Git widerrufen (2026-09-26)

> Beim Bau des Ausgaben-Archiv hat der neue Secret-Scann zwei echte Lecks im oeffentlichen Repo gefunden.
> Der Code ist bereinigt, aber ein Schlüssel im Git-Verlauf gilt als kompromittiert, auch wenn er entfernt wird.

- [ ] **Printify-API-Token widerrufen** (lag in `scripts/test_printify_api.js`, Commit `264eb3f`): Printify-Backend -> token revoken, neu erzeugen, nur noch als `PRINTIFY_API_TOKEN` in der Umgebung ablegen. -> traegt P0-08
- [ ] **Mailchimp-API-Key widerrufen** (lag in `scripts/mailchimp_subscribe.js`, Commit `4cdc80c`, Audience `c3728821fc`): Mailchimp -> Account -> Extras -> API keys -> alten Key loeschen, neu erzeugen, als `MAILCHIMP_API_KEY` in der Umgebung ablegen. -> traegt P0-08
- [ ] **Git-History pruefen**: `git log -S <teil-des-schluessels>` und ggf. mit `git filter-repo` bereinigen. Vorher Backup des Repos anlegen (force-push ist nicht rueckgaengig zu machen).
- [x] ~~Code bereinigen~~ -> erledigt am 2026-09-26: beide Skripte lesen den Schluessel nur noch aus der Umgebung und brechen ohne Wert ab; `tools/secret-scan.mjs` laeuft in CI und meldet 0 Funde. Der Scan prueft Stripe, Printify/Supabase-JWT, Mailchimp, AWS, Google und Private Keys.

## 1. Recht (höchste Priorität – blockiert jeden Verkauf)

- [ ] **Firmen-/Betreiberdaten** bereitstellen für Impressum und Datenschutz: Firma oder Inhaber, Anschrift, Telefon, E-Mail, Registergericht, Registernummer, USt-IdNr., verantwortliche Person nach § 18 Abs. 2 MStV. → trägt P0-04
- [ ] **AGB, Widerrufsbelehrung, Datenschutzerklärung** juristisch prüfen lassen (Rechtsanwalt IT-/Vertragsrecht oder e-recht24 + Gegencheck). → trägt P0-03/P0-04
- [ ] **Kündigungsbutton-Flow** absegnen: On-Site-Button führt aktuell in den Mitgliederbereich; die Bestätigungs-E-Mail ist erst nach SMTP-Umstellung möglich (§ 312k BGB). → trägt P0-03/P1-09
- [ ] **Erfüllungsort/Steuerstatus** klären: Umsatzsteuerpflicht oder Kleinunternehmerregelung (§ 19 UStG)? Entscheidet, ob „inkl. 19 % MwSt." auf `/abo` ausgewiesen werden muss. → trägt P0-05
- [ ] **Gewerbeanmeldung** erledigen (falls noch offen) und Datum dokumentieren.

## 2. Stripe (Kontoaktionen)

- [ ] Stripe Dashboard: **Stripe Tax aktivieren**, Registrierung Deutschland anlegen, Rechnungsprofil (Firmenname, Anschrift, USt-IdNr.) pflegen.
- [x] ~~Supabase Secret `STRIPE_AUTOMATIC_TAX=true` setzen~~ → **erledigt am 2026-09-28**: per Supabase CLI gesetzt und verifiziert.
- [x] ~~Webhook anlegen~~ → **erledigt am 2026-09-28**: Endpoint `we_1UJcNkL9kVIkJrXZijhHpJAW` auf Stripe aktiv verknüpft mit `https://tberfzrzfkwoytgqlpij.supabase.co/functions/v1/stripe-webhook`, `STRIPE_WEBHOOK_SECRET` und neuer API-Key in Supabase aktiv. → trägt P0-07
- [ ] **Testkauf** mit Karte `4242 4242 4242 4242` durchspielen: Registrierung → Checkout → Tarif aktiv in `/konto` → Kündigung → Status „canceling".
- [ ] Zahlungsarten prüfen/aktivieren (Karte, SEPA-Lastschrift) und ggf. Promo-Codes freischalten.

## 3. Schlüssel-Rotation (Sicherheit)

- [ ] Kompromittierte Keys rotieren: Stripe (Test), Vercel-Token, Supabase-Keys, Printful/Printify — neue Werte nur in Secret-Stores, alte invalidieren.
- [ ] Danach Git-History-Bereinigung prüfen (BFG oder `git filter-repo`) und Rotation mit Datum im `SETUP_CHECKLIST.md` vermerken. → trägt P0-08

## 4. Infrastruktur-Entscheidungen

- [ ] **Supabase Pro-Tier** (25 $/Monat) mit eigener SMTP-Anbindung (Resend/Brevo) buchen — sonst laufen Bestätigungs-, Reset- und Kündigungs-Mails ungebrandet und mit Free-Tier-Limit. Templates liegen fertig in `supabase/templates/`. → trägt P1-09
- [ ] Entscheidung zu cookieless Analytics (Vercel Web Analytics) und ob ein KPI-Zugang (Search Console) für Hermes freigegeben wird. → trägt P2-06
- [x] ~~Vercel-Node-Version im Projekt auf `22.x` angleichen~~ → **erledigt**: `.vercel/project.json` steht auf `"nodeVersion": "22.x"` und `.nvmrc` auf `22`.

## 5. Marke

- [ ] **Markenrecherche** „Kontolage" / „Kontenlage" beim DPMA (und Freigabe der Schreibweise). Ergebnis als Notiz ablegen. → trägt P1-07
- [ ] Entscheiden, ob das GitHub-Repository von `kontenlage-finanzbildung` in einen neutralen/korrekten Namen überführt wird (Rename ändert Deploy-Ziel – nur mit Zeitfenster).
- [x] ~~Gesperrte Datei `src/pages/ArtikelDetail.tsx`~~ → **erledigt am 2026-09-25**: 14 Fundstellen „Kontenlage" → „Kontolage" korrigiert; `node tools/brand-consistency-check.mjs` meldet jetzt `Ergebnis: konsistent` (Exit 0). Das Prüftool schreibt künftig atomar (Temp-Datei + `renameSync`), gesperrte Dateien überspringt es statt abzustürzen.

## 6. Fachliche Freigaben

- [ ] Steuerliche Aussagen und Rechner-Formeln durch Steuerberater prüfen lassen (insbesondere Höchstbeträge 2026, § 34 EStG, § 8b KStG, § 23 EStG).
- [ ] WpHG-Abgrenzung der Texte bestätigen lassen („Bildung, keine Beratung").

## 7. Wenn alles oben erledigt ist

- [ ] `docs/kanban.md` gegenlesen und P0 auf `DONE` setzen.
- [x] ~~`node tools/verify-seo.mjs` und `node tools/health-check.mjs` laufen lassen~~ → **erledigt am 2026-09-28**: **268/268** SEO-Prüfungen und **39/39** Health-Checks live auf `https://kontolage.de` grün (Exit 0).
- [ ] Freigabe für den ersten echten Zahlungsvorgang erteilen.
## 8. Optional, wenn Zeit ist

- [x] ~~Git-Stand versionieren~~ → **Commits liegen lokal.** Rebase mit Remote ist bereits sauber erfolgt!
- [x] ~~Push ausführen~~ → **erledigt am 2026-09-28**: Branch `main` vollständig nach `origin/main` gepusht, Vercel Production Deploy live!
- [x] ~~17 Legacy-Skills auf kanonische Frontmatter heben~~ → **Betriebsblöcke ergänzt am 2026-09-25** (14 Skills um Zweck/Trigger/Ablauf/Check/Ausgabe/Fail-Verhalten/Ticket-Kopplung erweitert, ohne Inhaltsverlust). Audit: 30 Skills, 0 Fehler, **0 offene Warnungen**, 10 Fremd-Hinweise.
- [ ] Optional: Ordner-Umbenennung `kontenlage-*` → `kontolage-*` (15 Skills). **Achtung:** `source-evaluator`, `content-drafter`, `wphg-guardrails` und `publish-gate` verweisen namentlich aufeinander — alle Aufrufer mitschieben. Endziel-Metrik: `node tools/hermes-skill-audit.mjs --strict` (aktuell 9 Fehler, Exit 1).
- [ ] P2-Backlog priorisieren (PDF/Excel-Export, Newsletter-Funnel, cookieless Analytics).
