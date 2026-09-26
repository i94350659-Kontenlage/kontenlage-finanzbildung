---
name: kontenlage-seo-meta-optimizer
description: Synthese aus 15+ führenden On-Page- & Metadata-Skills (Schema.org, JSON-LD FAQ/FinancialCalculator, High-CTR OpenGraph, Core Web Vitals). 100% BaFin- und DSGVO-konform für maximale Sichtbarkeit bei Google.
---

# Kontolage SEO & Metadata Master Optimizer

## 1. Zweck & Abgrenzung
Dieser Skill optimiert alle technischen und semantischen Metadaten der Kontolage-Plattform. Er kombiniert Best-Practices aus Google Official SEO Guidelines, Schema.org structured data und Performance-Audits, ohne die redaktionelle Neutralität nach WpHG § 2 / MAR Art. 20 zu verletzen.

## 2. Kern-Prüffelder (Checkliste)

### A. Title- & Meta-Description Architektur
- **Title-Tag**: 50–60 Zeichen, Primär-Keyword vorne, Brand hinten (*„Grenzsteuersatz Rechner 2026 — Was bleibt vom Gehalt? | Kontolage“*).
- **Meta-Description**: 145–155 Zeichen mit klarem Nutzenversprechen, Handlungsaufforderung und Sonderzeichen (*„Berechne deinen persönlichen Steuerspar-Hebel nach § 10 & § 8b KStG als reine Mathematik ohne Beratermarge. Jetzt Szenario testen →“*).
- **OpenGraph & Twitter Cards**: `og:title`, `og:description`, `og:image`, `og:type="website"`.

### B. Schema.org JSON-LD Structured Data
- **FAQPage**: Automatische Generierung von ausklappbaren Google-Suchergebnissen (Rich Snippets).
- **FinancialCalculator / SoftwareApplication**: Deklaration interaktiver Rechner für Google Search.
- **Article / NewsArticle**: Für tägliche Markt-Briefings mit Autoren- und Quellenkennzeichnung.

### C. Performance & Core Web Vitals
- LCP (Largest Contentful Paint) < 1.2s
- CLS (Cumulative Layout Shift) = 0
- FID/INP (Interaction to Next Paint) < 50ms

## Betriebsblock (Hermes-Konvention)

- **Zweck**: Metadaten, strukturierte Daten und Core Web Vitals der Kontolage-Seiten deterministisch auf Sichtbarkeit und Neutralität prüfen.
- **Trigger**: jede Inhalts- oder Template-Änderung, jeder Deploy, oder wenn `tools/verify-seo.mjs` fehlschlägt.
- **Ablauf**: 1) Titel/Description-Längen prüfen 2) Canonical = eigene Route 3) OpenGraph/Twitter inkl. `summary_large_image` und `og:locale` 4) JSON-LD-Typ prüfen (FAQPage, FinancialCalculator, Article, BreadcrumbList) 5) LCP/CLS/INP gegen Zielwerte messen 6) Ergebnis als `pass|warn` je Feld.
- **Check**: Metadaten stehen im **Server-HTML** (nicht nur per JS nachgeladen), sind je Route eindeutig und enthalten keine Startseiten-Werte auf Unterseiten. `npm run verify:seo` Exit 0.
- **Ausgabe**: Prüfprotokoll mit Route, Feld, Ist, Soll, Status — Grundlage für `tools/verify-seo.mjs`.
- **Fail-Verhalten**: Fehlender oder fremder Canonical, doppelte Title, JSON-LD ohne `inLanguage` oder WpHG-relevante Sprache → Gate schließen, kein Publish. Bei Metrik-Ausreißer: als `warn` melden, nicht schönrechnen.
- **Ticket-Kopplung**: P0-01 (Prerender), P0-02 (Sitemap), P1-05 (OG-Image), P1-06 (JSON-LD), P1-14 (Registry).
