# TODOperHAND — nur von dir erledigbar

> Stand: 2026-09-25 · Gegenstück zu `webseitenversionen/4.9.2026/docs/todo.md` (dort steht alles, was automatisiert läuft).
> Hier stehen **ausschließlich** Dinge, die Zugänge, Unterschriften, Zahlungen oder juristische Entscheidungen brauchen.
> Nach Erledigung: Häkchen setzen und im Kanban (`docs/kanban.md`) den Ticketstatus nachziehen.

## 1. Recht (höchste Priorität – blockiert jeden Verkauf)

- [ ] **Firmen-/Betreiberdaten** bereitstellen für Impressum und Datenschutz: Firma oder Inhaber, Anschrift, Telefon, E-Mail, Registergericht, Registernummer, USt-IdNr., verantwortliche Person nach § 18 Abs. 2 MStV. → trägt P0-04
- [ ] **AGB, Widerrufsbelehrung, Datenschutzerklärung** juristisch prüfen lassen (Rechtsanwalt IT-/Vertragsrecht oder e-recht24 + Gegencheck). → trägt P0-03/P0-04
- [ ] **Kündigungsbutton-Flow** absegnen: On-Site-Button führt aktuell in den Mitgliederbereich; die Bestätigungs-E-Mail ist erst nach SMTP-Umstellung möglich (§ 312k BGB). → trägt P0-03/P1-09
- [ ] **Erfüllungsort/Steuerstatus** klären: Umsatzsteuerpflicht oder Kleinunternehmerregelung (§ 19 UStG)? Entscheidet, ob „inkl. 19 % MwSt." auf `/abo` ausgewiesen werden muss. → trägt P0-05
- [ ] **Gewerbeanmeldung** erledigen (falls noch offen) und Datum dokumentieren.

## 2. Stripe (Kontoaktionen)

- [ ] Stripe Dashboard: **Stripe Tax aktivieren**, Registrierung Deutschland anlegen, Rechnungsprofil (Firmenname, Anschrift, USt-IdNr.) pflegen.
- [ ] Supabase Secret **`STRIPE_AUTOMATIC_TAX=true`** setzen (Dashboard → Edge Functions → Secrets).
- [ ] **Webhook anlegen**: `https://tberfzrzfkwoytgqlpij.supabase.co/functions/v1/stripe-webhook` mit den Events `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.paid`, `invoice.payment_failed`. Danach `tools/stripe-webhook-setup.ps1 -Mode test` ausführen. → trägt P0-07
- [ ] **Testkauf** mit Karte `4242 4242 4242 4242` durchspielen: Registrierung → Checkout → Tarif aktiv in `/konto` → Kündigung → Status „canceling".
- [ ] Zahlungsarten prüfen/aktivieren (Karte, SEPA-Lastschrift) und ggf. Promo-Codes freischalten.

## 3. Schlüssel-Rotation (Sicherheit)

- [ ] Kompromittierte Keys rotieren: Stripe (Test), Vercel-Token, Supabase-Keys, Printful/Printify — neue Werte nur in Secret-Stores, alte invalidieren.
- [ ] Danach Git-History-Bereinigung prüfen (BFG oder `git filter-repo`) und Rotation mit Datum im `SETUP_CHECKLIST.md` vermerken. → trägt P0-08

## 4. Infrastruktur-Entscheidungen

- [ ] **Supabase Pro-Tier** (25 $/Monat) mit eigener SMTP-Anbindung (Resend/Brevo) buchen — sonst laufen Bestätigungs-, Reset- und Kündigungs-Mails ungebrandet und mit Free-Tier-Limit. Templates liegen fertig in `supabase/templates/`. → trägt P1-09
- [ ] Entscheidung zu cookieless Analytics (Vercel Web Analytics) und ob ein KPI-Zugang (Search Console) für Hermes freigegeben wird. → trägt P2-06
- [ ] Optional: Vercel-Node-Version im Projekt auf `22.x` angleichen (`.vercel/project.json` meldet 24.x, Projekt fordert 22.x).

## 5. Marke

- [ ] **Markenrecherche** „Kontolage" / „Kontenlage" beim DPMA (und Freigabe der Schreibweise). Ergebnis als Notiz ablegen. → trägt P1-07
- [ ] Entscheiden, ob das GitHub-Repository von `kontenlage-finanzbildung` in einen neutralen/korrekten Namen überführt wird (Rename ändert Deploy-Ziel – nur mit Zeitfenster).
- [x] ~~Gesperrte Datei `src/pages/ArtikelDetail.tsx`~~ → **erledigt am 2026-09-25**: 14 Fundstellen „Kontenlage" → „Kontolage" korrigiert; `node tools/brand-consistency-check.mjs` meldet jetzt `Ergebnis: konsistent` (Exit 0). Das Prüftool schreibt künftig atomar (Temp-Datei + `renameSync`), gesperrte Dateien überspringt es statt abzustürzen.

## 6. Fachliche Freigaben

- [ ] Steuerliche Aussagen und Rechner-Formeln durch Steuerberater prüfen lassen (insbesondere Höchstbeträge 2026, § 34 EStG, § 8b KStG, § 23 EStG).
- [ ] WpHG-Abgrenzung der Texte bestätigen lassen („Bildung, keine Beratung").

## 7. Wenn alles oben erledigt ist

- [ ] `docs/kanban.md` gegenlesen und P0 auf `DONE` setzen.
- [ ] `node tools/verify-seo.mjs` und `node tools/health-check.mjs` laufen lassen (Ergebnis aktuell: **241/241** SEO-Prüfungen und **36/36** Health-Checks, beide live grün).
- [ ] Freigabe für den ersten echten Zahlungsvorgang erteilen.
## 8. Optional, wenn Zeit ist

- [x] ~~Git-Stand versionieren~~ → **Commits liegen lokal (ahead 11).** Offen bleibt nur der **Push**.
- [ ] **Push ausführen** (Stand 2026-09-25: `ahead 11, behind 6`). Die 6 Remote-Commits stammen ausschließlich vom Hermes-Wochen-Cron (`obsidian_vault/Drafts/*`, `obsidian_vault/Learnings.md`, `HERMES_WEEKLY_REFLECTION_*`, `package-lock.json`) und berühren **keinen** App-Code. Vorgehen: `git pull --rebase origin main` → bei Konflikten in `package-lock.json` und `obsidian_vault/Learnings.md` auflösen (lokale Fassung behalten, danach `npm install`) → `npm run build` als Gegenprobe → `git push`.
- [x] ~~17 Legacy-Skills auf kanonische Frontmatter heben~~ → **Betriebsblöcke ergänzt am 2026-09-25** (14 Skills um Zweck/Trigger/Ablauf/Check/Ausgabe/Fail-Verhalten/Ticket-Kopplung erweitert, ohne Inhaltsverlust). Audit: 30 Skills, 0 Fehler, **0 offene Warnungen**, 10 Fremd-Hinweise.
- [ ] Optional: Ordner-Umbenennung `kontenlage-*` → `kontolage-*` (15 Skills). **Achtung:** `source-evaluator`, `content-drafter`, `wphg-guardrails` und `publish-gate` verweisen namentlich aufeinander — alle Aufrufer mitschieben. Endziel-Metrik: `node tools/hermes-skill-audit.mjs --strict` (aktuell 9 Fehler, Exit 1).
- [ ] P2-Backlog priorisieren (PDF/Excel-Export, Newsletter-Funnel, cookieless Analytics).
