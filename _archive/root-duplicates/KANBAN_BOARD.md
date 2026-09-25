# Scratch'n'Travel — Master Kanban & Architecture v5.0

> Letztes Update: August 2026 · Hermes Autonomous Platform Edition

---

## 📋 Kanban Board

| 🔴 Backlog / Nächste Iteration | 🟡 In Testing / Automatisierung | 🟢 Abgeschlossen & Live (v5.0) |
|---|---|---|
| • Push Notifications via Web Push | • Hermes SEO Auto-Ranking Cron | • 400+ Gamification Badges & Mystery Drops |
| • Stripe Live Webhook Signing Test | • Core Web Vitals Monitoring | • Community Tagestouren & Routen zu Fuß |
| • Splitwise Gruppen-Kosten Splitter | • PWA Service Worker Caching | • 1-Klick GPX / KML & PDF Export |
| • AR Location Marker Prototyp | • OpenStreetMap Nominatim Live Geo | • Fair-Price & Anti-Abzocke Radar |
| | • Weekly City Seeding Daemon | • World Scratch Counter & Story Cards |
| | | • Local Guide Verification Trust Badge |
| | | • Hero Interactive Live Scratch Demo |
| | | • Multi-City Hazard & Disaster Radar |
| | | • 8 SaaS & Merch Skills (.agents/skills) |
| | | • Obsidian Brand Design System Vault |
| | | • Scrubbed All Hermes UI References |
| | | • B2B Host Portal 0% Provision Polish |

---

## 🏛️ Architektur-Übersicht

```
┌─────────────────────────────────────────────────────────────┐
│                    SCRATCH'N'TRAVEL WEB APP                 │
│         (index.html / app.html / PWA Service Worker)        │
└──────┬───────────────────────┬───────────────────────┬──────┘
       │                       │                       │
       ▼                       ▼                       ▼
┌───────────────┐     ┌─────────────────┐     ┌───────────────┐
│ Gamification  │     │ WanderBond 130  │     │ Live Hazard & │
│ 400+ Badges & │     │ Hobby-DNA Match │     │ Disaster      │
│ Scratch-Map   │     │ & Day-Trips     │     │ Multi-City    │
└──────┬────────┘     └────────┬────────┘     └───────┬───────┘
       │                       │                      │
       ▼                       ▼                      ▼
┌─────────────────────────────────────────────────────────────┐
│               HERMES BACKEND & ORCHESTRATOR LAYER           │
│   (Vercel Serverless / OpenRouter / Supabase DB / POD API)  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧪 E2E Verifikations-Ergebnisse (100% Passed)
- `GET /` -> HTTP 200 (Hero Live Mini-Canvas, Badges Mockups, Routes)
- `GET /app.html` -> HTTP 200 (Synced State, GPS Radar, Filter Tabs)
- `GET /assets/js/gamification-400-db.js` -> HTTP 200 (400+ Badges Loaded)
- `GET /assets/js/routes-daytrips-engine.js` -> HTTP 200 (GPX Export Ready)
- `GET /assets/js/travel-budget-engine.js` -> HTTP 200 (Fair-Price Radar)
- `GET /assets/js/world-scratch-stats.js` -> HTTP 200 (Story Card Generator)
- `GET /assets/js/local-verification-engine.js` -> HTTP 200 (Gold Trust Badge)
- `GET /assets/js/open-geocoding-engine.js` -> HTTP 200 (Nominatim Live GPS)
- `GET /sw.js` -> HTTP 200 (PWA Offline Service Worker)
- `GET /sitemap.xml` & `/robots.txt` -> HTTP 200 (Googlebot Indexing)
