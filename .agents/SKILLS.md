# SKILLS.md — Hermes Fähigkeitskatalog v6

> Jeder Skill ist eine abrufbare oder automatische Fähigkeit. Technische Skill-Dateien liegen in `.agents/skills/<name>/SKILL.md`.
> Pflicht für jede Skill-Datei: YAML-Frontmatter mit `name` und `description`, danach Zweck, Trigger, Ablauf, Checks, Ausgabeformat, Fail-Closed-Regeln.
> Prüfung: `node tools/hermes-skill-audit.mjs` (Frontmatter, Pflichtabschnitte, Marken-Kanon, Secret-Muster).

## Übersicht nach Aufgabe

| Gruppe | Skills |
|---|---|
| Compliance & Freigabe | `kontenlage-wphg-guardrails`, `kontenlage-publish-gate`, `kontenlage-audit-redteam`, `kontolage-legal-compliance-gate` |
| Recherche & Bewertung | `kontenlage-source-evaluator`, `kontenlage-scoring-engine`, `kontenlage-asset-classes-taxonomy`, `kontenlage-private-*`, `kontenlage-archetype-quiz-maintainer` |
| Redaktion | `kontenlage-content-drafter`, `seo-content-optimierung`, `kontenlage-seo-meta-optimizer`, `kontolage-seo-prerender-maintainer`, `kontenlage-programmatic-tax-seo` |
| Produkt & Technik | `auth-billing-affiliate`, `kontolage-billing-tax-guardian`, `webapp-ui-ux-frontend`, `user-cabinet-personalization`, `kontenlage-private-investment-intelligence`, `kontenlage-private-router` |
| Marke & Wachstum | `kontolage-brand-consistency-guardian`, `value-proposition-pitch`, `zielgruppenanalyse`, `kontenlage-analytics-growth-optimizer` |
| Markt & Community | `community-posts-feedback`, `kontenlage-liquidity-monitor` |
| Meta | `kontolage-self-improvement-loop` |
| Andere Projekte (nicht Kontolage) | `merch-badge-design-system`, `merch-pod-designer`, `nous-hermes-travel-design` |

## SKILL-01: Steuer-Content-Generator (Social, 6 Kanäle)

**Trigger:** wöchentlicher Cron (`hermes_cron.yml`) oder manueller Lauf.
**Input:** Datum, Learnings der Vorwoche, Ziel-Thema.
**Output:** LinkedIn, X-Thread, Instagram-Slides, TikTok-Sprechskript, Telegram-Digest, Facebook-Post.

**Themen-Pool:** `ruerup` (§10 EStG), `sparerpauschbetrag` (§20 Abs. 9 EStG), `immobilien` (§21 EStG, AfA), `bav` (§3 Nr. 63 EStG), `defi_crypto` (§22 Nr. 3 / §23 EStG), `elster` (Anlage N), `vorabpauschale` (InvStG), `fuenftelregelung` (§34 EStG).

**Checks:** kein Produktname im Kaufkontext · Disclaimer am Ende · Zahlen mit Quelle · keine Wiederholung der Vorwochen-Headline.

## SKILL-02: Artikel-Qualitätsprüfer

**Trigger:** vor jedem Artikel-Commit.
**Prüft:** mindestens ein §-Verweis · mindestens ein Euro-Berechnungsbeispiel · WpHG-Disclaimer · kein Werbebezug · genau eine H1 · Title/Description aus der Registry · interne Verlinkung · Rechner-CTA.

## SKILL-03: Anti-Shadowban-Checker

**Trigger:** vor jedem Social-Post.
**Methode:** Vergleich gegen die letzten 30 Tage in `obsidian_vault/Drafts/`.
**Regeln:** kein identischer Satzanfang wie Vorwoche · keine identische §§-Kombination · Mindest-Editierdistanz 40 % · keine Anbieternamen.

## SKILL-04: Confidence-Score-Kalkulator

**Trigger:** nach jeder bewertenden Ausgabe.

| Kriterium | Max. Punkte |
|---|---|
| §§ korrekt und mit Jahresbezug zitiert | 0,25 |
| Euro-Beträge rechnerisch korrekt und nachvollziehbar | 0,25 |
| Tonalität Kontolage-konform (sachlich, kein Marketing) | 0,20 |
| kein Werbe-/Produktbezug | 0,20 |
| Anti-Shadowban bestanden | 0,10 |

Unter 0,70: keine Veröffentlichung; Fallback-Content plus Review-Ticket.

## SKILL-05 bis SKILL-08

### SKILL-05: DeFi- & Krypto-Steueranalyse

**Abdeckung:** Staking (§22 Nr. 3 EStG, Freigrenze 256 €), Lending/Liquidity Providing (§20 EStG), Haltefrist (§23 Abs. 1 Nr. 2 EStG), NFTs/Airdrops (Zufluss), Bridge-/Contract-Risiken, TVL-Aussagekraft.
**Ausgabe:** Gesetzesgrundlage → Berechnungsbeispiel in Euro → Risikomatrix → Fazit „rechnet sich unter Steuerlast ja/nein/unsicher".
**Pflicht:** Krypto-Aussagen immer mit Datenstand und Hinweis auf Einzelfallabhängigkeit.

### SKILL-06: Whitepaper-/Protokollanalyse

**Schema:** Protokoll-Typ → Token-Mechanik → Contract-Risiko (Audit-Status) → Oracle-Risiko → Bridge-Risiko → TVL-Trend 30/90/365 Tage → Community-Signale → steuerliche Einordnung → Risiko-Rating 1–5.

### SKILL-07: Marketing & Wachstum (SEO + Social)

**SEO-Checkliste je Artikel:** Title ≤ 60 Zeichen mit Hauptkeyword · Description 145–155 Zeichen · genau eine H1 · JSON-LD (`Article`) · interne Links · Rechner-CTA · Canonical auf eigene URL (Ticket P0-01).
**Keyword-Pool (laufend gepflegt):** „Rürup Rente sinnvoll Rechner", „Sparerpauschbetrag 2026 einrichten", „Steuersparimmobilien Erfahrungen", „DeFi Steuern Deutschland 2026", „Staking Steuerpflicht Deutschland", „Vorabpauschale ETF 2026".

### SKILL-08: Risk Assessment

**Trigger:** vor jeder Veröffentlichung.
**Blocker:** konkrete Anlageempfehlung · Produktnennung mit Kaufaufforderung · fehlender Disclaimer · `confidence_score` < 0,70 · unbelegte Zahlen.
**Ausgabe:** `decision: publish | review | block` mit `reason_codes`.

## SKILL-09 bis SKILL-15 (v6, Ticket-gekoppelt)

| Nr. | Skill | Zweck | Tickets |
|---|---|---|---|
| SKILL-09 | `kontolage-seo-prerender-maintainer` | Meta, Canonical, Sitemap und JSON-LD deterministisch pflegen | P0-01, P0-02, P1-01, P1-05, P1-06, P1-14 |
| SKILL-10 | `kontolage-legal-compliance-gate` | AGB/Widerruf/Kündigungsbutton/MwSt. vor der Kaufstrecke prüfen | P0-03, P0-04, P0-05 |
| SKILL-11 | `kontolage-billing-tax-guardian` | Stripe Tax, Rechnungen, Webhook-Gesundheit, Secret-Hygiene | P0-05, P0-07, P1-09, P1-10 |
| SKILL-12 | `kontolage-brand-consistency-guardian` | „Kontolage" als Kanon durchsetzen, Tonalität prüfen | P1-07 |
| SKILL-13 | `kontolage-self-improvement-loop` | Hypothese → Metrik → Experiment → Learnings → Rollout | H-04, P2-06 |
| SKILL-14 | `webapp-ui-ux-frontend` | UI/UX-Umsetzung im bestehenden Designsystem | P1-03, P1-12, P2-01 |
| SKILL-15 | `user-cabinet-personalization` | Kabinett-/Konto-Personalisierung ohne Beratungscharakter | P2-01, P2-07 |
| SKILL-16 | `kontenlage-programmatic-tax-seo` | Massen-SEO für Steuerrechner-Landeseiten (Kanon § 10 EStG, § 20 Abs. 9, § 21) | P2-04, P2-06 |
| SKILL-17 | `kontenlage-analytics-growth-optimizer` | Messbare Wachstums-Hypothesen statt Bauchgefühl, 1 Experiment pro Woche | H-04, P2-06 |
| SKILL-18 | `kontenlage-liquidity-monitor` | Markt-Daten für DeFi-/Liquiditäts-Kontext, ohne Anlageempfehlung | P2-06 |
| SKILL-19 | `community-posts-feedback` | Community-Beiträge moderieren und Feedback einspeisen | P2-08 |

## Skill-Lebenszyklus

1. **Anlegen:** Datei `.agents/skills/<slug>/SKILL.md` mit Frontmatter, Zweck, Trigger, Ablauf, Checks, Ausgabeformat, Fail-Closed-Regeln.
2. **Registrieren:** Eintrag in dieser Datei plus Ticket-Kopplung im Kanban.
3. **Prüfen:** `node tools/hermes-skill-audit.mjs` — 0 Fehler, Report im CI-Artefakt.
4. **Versionieren:** Eintrag in `obsidian_vault/05_Skills_Changelog/Hermes_Skills_Changelog.md`.
5. **Aussortieren:** Skills ohne Trigger, ohne Ticketbezug oder mit widersprüchlichen Regeln werden gelöscht (Audit meldet sie als `orphan`).

