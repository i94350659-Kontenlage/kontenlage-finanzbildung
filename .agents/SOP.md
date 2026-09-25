# SOP.md — Standard Operating Procedures für Hermes v6

> Abläufe sind verbindlich. Jeder Lauf endet mit Log + Learnings-Eintrag; Gates sind fail-closed.
> Neue SOPs werden nummeriert ergänzt, nie überschrieben (Historie liegt in Git).

## SOP-001: Wöchentlicher Content-Lauf (Pflicht)

**Trigger:** Montag 08:00 UTC via `.github/workflows/hermes_cron.yml`.
**Erfolg:** Telegram-Post gesendet + Draft in `obsidian_vault/Drafts/YYYY-MM-DD-social-drafts.md` + Supabase-Log + Learnings aktualisiert.

1. `Learnings.md` und letzte Drafts lesen (Anti-Shadowban, SKILL-03).
2. Prompt bauen: Datum, Kalenderwoche, Learnings, Thema aus Themen-Pool.
3. Provider-Kaskade ausführen: OpenRouter → EdenAI → Requesty → statischer Qualitätscontent.
4. Kanäle bedienen: Telegram sofort; X, Facebook, Instagram, LinkedIn nur mit gesetzten Tokens, sonst Draft; TikTok als Skript-Draft.
5. Ergebnis in Supabase protokollieren (`confidence_score`, `decision_reason`, `affected_parameters`).
6. `Learnings.md` ergänzen, Draft committen (`auto(hermes): … [skip ci]`).

**Harte Fail-Bedingungen:** kein Provider erreichbar und kein Fallback ⇒ Abbruch mit `process.exit(1)`, Kanban-Ticket „Provider-Ausfall" anlegen.

## SOP-002: Neuen Artikel erstellen

**Trigger:** Auftrag oder Themenrotation.
**Format:** Registry-Eintrag zuerst (`src/content/registry.ts`), dann Inhalte; Ausgabe über die React-Seite, nicht als lose HTML-Datei.

**Prüfliste:** §-Verweis · Euro-Rechenbeispiel · WpHG-Disclaimer · genau eine H1 · Title/Description/Canonical aus Registry · interne Verlinkung · Rechner-CTA · Datenstand.
**Danach:** `tools/generate-sitemap.mjs` ausführen, `node tools/verify-live.mjs` prüfen, Kanban-Status setzen.

## SOP-003: Preis- und Kaufstrecke aktivieren

**Trigger:** Betreiber meldet Freigabe (Gewerbe, Rechtstexte, MwSt.).
**Reihenfolge (nicht abkürzbar):**

1. `kontolage-legal-compliance-gate`: AGB, Widerruf, Kündigungsbutton, MwSt.-Endpreise vorhanden.
2. Stripe: Tax aktiviert, Registrierung DE, Rechnungsprofil gepflegt.
3. Supabase Secret `STRIPE_AUTOMATIC_TAX=true`, Checkout-Parameter (`locale=de`, Karte + SEPA).
4. `/abo` zeigt Endpreise inkl. MwSt.; CTA-Text im Sinne der Button-Lösung.
5. E2E-Testkarte: Checkout → Webhook → aktiver Plan → Kündigung.
6. Nachweise im Kanban, Ticket P0-05/P0-07 auf `DONE`.

## SOP-004: Neuen Kanal verbinden

1. Token/Access in GitHub Secrets hinterlegen (niemals im Repo).
2. Publish-Funktion in `scripts/hermes_runner.js` ergänzen.
3. Workflow-Env um das Secret erweitern.
4. Testlauf mit einem einzigen Beitrag, Ergebnis in `05_Skills_Changelog` dokumentieren.

## SOP-005: AI-Provider tauschen oder ergänzen

1. Eintrag im `AI_PROVIDERS`-Array (Name, URL, Key-Env, Modell, Header).
2. Secret setzen, Workflow-Env ergänzen.
3. Lokaler Testlauf mit gesetzten Env-Variablen.
4. Fallback-Kaskade bleibt immer mit statischem Content als letzter Stufe.

## SOP-006: Incident Response

1. Logs prüfen (GitHub Actions, Supabase Function Logs, Stripe Webhook-Versuche).
2. Ursache klassifizieren: Provider, Netzwerk, Secret, Daten, Code.
3. Kill-Switch bei Compliance-/Sicherheitsverdacht sofort setzen und Betreiber informieren.
4. Nach Behebung: Ursache + Maßnahme in `obsidian_vault/03_Audit_Logs_And_Improvements/Audit_Logs_and_Fixes.md`.
5. Kein „weiterlaufen lassen und später prüfen".

## SOP-007: Learnings pflegen (Self-Improvement-Basis)

`Learnings.md` ist Pflichtlektüre am Laufanfang und Pflichtschreibziel am Laufende.

| Regeltyp | Beispiel | Wirkung |
|---|---|---|
| CTR | „§-Nennung in Zeile 1 erhöht Klicks" | erste Zeile anpassen |
| Anti-Shadowban | „diese Phrase letzte Woche verwendet" | neue Formulierung |
| Plattform | „LinkedIn: maximal 1 Emoji" | automatisch einhalten |
| Zeit | „Freitagabend auf X reichweitenstärker" | Publishzeit anpassen |

## SOP-008: DeFi-Ensemble-Lauf (zweimal wöchentlich)

Dienstag 07:00 UTC und Freitag 16:00 UTC: DeFiLlama-Daten (TVL, Yields, Bridges) → Hack-Historie als Ground Truth → Vier-Modell-Ensemble → Backtest (Trefferquote, Qualität) → Telegram-Bericht → Persistenz in Supabase.
**Grenze:** Analyse und Bildung; keine Handelsausführung, keine Anlageempfehlung.

---

## SOP-009: SEO-/Meta-Gesundheit prüfen (Ticket P0-01, P0-02, P1-01)

**Trigger:** nach jedem Deploy, mindestens einmal pro Woche.
**Ablauf:**

1. `node tools/verify-live.mjs` — Routen-Status, Bundle-Größe, eingebetteter Key.
2. `node tools/verify-sitemap.mjs` — jede Sitemap-URL: Status 200, Canonical == eigene URL, `lastmod` plausibel.
3. Stichprobe `/rechner` und ein Artikel: Roh-HTML muss eigenen `title` und eigenes `canonical` tragen.
4. Unbekannte URL prüfen: Status muss **404** sein (nicht 200 mit Startseiteninhalt).

**Fail-closed:** weicht Canonical oder Status ab, gilt der Deploy als nicht freigegeben; Ticket im Kanban anlegen und Betreiber informieren.

## SOP-010: Rechts-/Kaufstrecken-Gate (Ticket P0-03, P0-04, P0-05)

**Trigger:** vor jeder Aktivierung oder Änderung der Kaufstrecke, vor jedem Preis-Deploy.
**Prüfliste (alle Punkte müssen erfüllt sein):**

- AGB und Widerrufsbelehrung erreichbar, im Footer verlinkt.
- Kündigung ohne Login möglich, Bestätigungs-E-Mail funktioniert (§ 312k BGB).
- CTA auf `/abo` entspricht der Button-Lösung inklusive Endpreis und MwSt.-Hinweis (§ 312j BGB, PAngV).
- Impressum enthält keine Platzhalter (§ 5 DDG), Verantwortliche Person benannt (§ 18 Abs. 2 MStV).
- Datenschutz nennt Supabase, Stripe, Vercel als Empfänger; `localStorage` korrekt beschrieben.
- Stripe Tax aktiv, Registrierung DE vorhanden, Testrechnung weist USt. aus.

**Ergebnis:** `decision: publish | block` mit `reason_codes`; Blocker verhindert Preissichtbarkeit.

## SOP-011: Billing-/Webhook-Gesundheit (Ticket P0-07, P1-09, P1-10)

**Trigger:** wöchentlich sowie nach jeder Billing-Änderung.
**Ablauf:**

1. `stripe_events` auf `status = 'failed'` und Events älter als 24 Stunden ohne Verarbeitung prüfen.
2. Webhook-Signaturprüfung verifizieren (unsignierter Test-POST muss 400 liefern).
3. Abgleich: jede aktive `subscriptions`-Zeile hat `stripe_customer_id` und konsistenten Status.
4. Secret-Liste prüfen (Namen, keine Werte): erwartet sind `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_*`, `APP_ORIGIN(S)`, `STRIPE_AUTOMATIC_TAX`.
5. Bundle auf Secret-Muster scannen (`sk_live`, `sk_test`, `whsec_`, `service_role`).

**Fail-closed:** Fund ⇒ Preissichtbarkeit deaktivieren, Betreiber informieren, Rotation starten (SOP-006).

## SOP-012: Wochen-Experiment (Self-Improvement-Loop v2, Ticket H-04)

**Trigger:** Montag nach dem Content-Lauf.
**Ablauf:**

1. KPI-Snapshot erheben: indexierte URLs, Sitemap-Gesundheit, Registrierungen, Checkout-Abschlüsse, Newsletter-Anmeldungen, Deploy-Erfolgsquote.
2. Genau **eine** Hypothese formulieren („Wenn X, dann Y, gemessen an Z").
3. Eine Änderung umsetzen (Content, Meta, Preis, Kanalzeit).
4. Sieben Tage messen, Ergebnis notieren — auch bei Fehlschlag.
5. Eintrag in `obsidian_vault/04_SEO_And_Growth_Experiments/` plus zweizeiliger Eintrag in `Learnings.md`.
6. Rollout nur, wenn die Metrik sich verbessert hat; sonst Rollback dokumentieren.

**Regel:** mehrere gleichzeitige Änderungen sind unzulässig — sie zerstören die Zuordenbarkeit.

## SOP-013: Governance- und Skill-Audit (Ticket H-02, H-03)

**Trigger:** vor jedem Merge, wöchentlich im Governance-Workflow, nach jeder Skill-Änderung.
**Ablauf:**

1. `node tools/hermes-skill-audit.mjs` — prüft Frontmatter (`name`, `description`), Pflichtabschnitte, Marken-Kanon, Secret-Muster, verwaiste Skills.
2. Report `.agents/skills-audit.json` erzeugen und als CI-Artefakt sichern.
3. Fehler der Klasse `error` blockieren; `warning` wird als Ticket erfasst.
4. Änderungen an Skills in `obsidian_vault/05_Skills_Changelog/Hermes_Skills_Changelog.md` protokollieren.

**Definition of Done:** Audit ohne `error`, Changelog-Eintrag vorhanden, Kanban-Status aktualisiert.

