---
name: kontolage-seo-prerender-maintainer
description: Deterministische Pflege von Meta-Daten, Canonical, Sitemap und JSON-LD für jede Route der Kontolage-Plattform. Verhindert Duplicate-Content durch die SPA-Shell, erzwingt eigenes Canonical je URL und hält Sitemap und Artikel-Registry deckungsgleich. Fail-closed bei Abweichung.
---

# Kontolage SEO & Prerender Maintainer

## Zweck

Diese Fähigkeit stellt sicher, dass jede öffentliche Route genau ihre eigenen Metadaten ausliefert — für Crawler, Social-Bots und Nutzer ohne JavaScript. Sie ist die technische Absicherung der Tickets P0-01, P0-02, P1-01, P1-05, P1-06 und P1-14.

## Trigger

- nach jedem Deploy der Website
- nach jeder Änderung an der Artikel-Registry oder an `src/components/Seo.tsx`
- wöchentlich im Governance-Lauf (SOP-009)

## Ablauf

1. Registry prüfen: jede Route und jeder Artikel hat `slug`, `title` (≤ 60 Zeichen), `description` (145–155 Zeichen), `updated` (ISO-Datum), `category`.
2. Prerender ausführen (`node tools/prerender-routes.mjs`): erzeugt je Route eine eigene `index.html` mit Title, Description, Canonical, OG-/Twitter-Tags und JSON-LD.
3. Sitemap erzeugen (`node tools/generate-sitemap.mjs`) und mit der Registry abgleichen — keine URL ohne Seite, keine Seite ohne URL.
4. Verifikation: `node tools/verify-live.mjs` (Routen, Bundle, Key) und `node tools/verify-sitemap.mjs` (Status 200, Canonical je URL, `lastmod`).
5. Status im Kanban nachziehen, Nachweis (Befehl + Messwert) dokumentieren.

## Checks

| Prüfung | Sollwert | Verstoß |
|---|---|---|
| Canonical je Route | eigene absolute URL | Fehler |
| Title je Route | eigener Titel, nicht der Startseitentitel | Fehler |
| Description je Route | vorhanden, 145–155 Zeichen | Warnung |
| H1 je Seite | genau eine | Fehler |
| Sitemap-Abdeckung | Registry == Sitemap | Fehler |
| Unbekannte URL | HTTP 404 mit `noindex` | Fehler |
| JSON-LD | `Article` bei Artikeln, `FAQPage`/`Organization` auf Startseite | Warnung |
| `lastmod` | vorhanden und plausibel | Warnung |

## Ausgabeformat

```json
{
  "decision": "publish | block",
  "confidence_score": 0.0,
  "decision_reason": "…",
  "affected_parameters": ["canonical", "title", "sitemap"],
  "routes_checked": 0,
  "routes_failed": [],
  "generated_at": "ISO-8601"
}
```

## Fail-Closed

- Canonical zeigt auf eine andere URL ⇒ **BLOCK** (kein Deploy, kein Publish).
- Sitemap enthält URLs ohne Seite (oder umgekehrt) ⇒ **BLOCK**.
- Route liefert 200 statt 404 für unbekannte Pfade ⇒ **BLOCK**.
- Keine Ausnahme „nur kurz" — Freigabe ausschließlich durch den Betreiber.
