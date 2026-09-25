# Archiv  Root-Ablage (Stand 2026-09-25)

Diese Dateien lagen im Repository-Root, wurden aber von der aktiven Anwendung (`webseitenversionen/4.9.2026` + Vercel-Output `dist/`) nicht mehr verwendet oder gehörten zu einem anderen Projekt:

| Datei | Grund |
|---|---|
| `KANBAN_BOARD.md` | Board des Projekts Scratch n Travel (anderes Repository) |
| `PROMPT_LIBRARY_MASTER.md` | Prompt-Bibliothek für Scratch n Travel |
| `supabase_schema.sql` | altes Schema, ersetzt durch `webseitenversionen/4.9.2026/supabase/migrations/` |
| `index.html`, `robots.txt`, `sitemap.xml` | Duplikate; ausgeliefert wird ausschließlich `dist/` (Quelle: App-`public/` + Prerender) |
| `CNAME`, `_config.yml` | GitHub-Pages-/Jekyll-Artefakte, für Vercel ohne Funktion |
| `assets/` | alte Build-Bundles aus früheren Deployments |

Wiederherstellen bei Bedarf: Datei aus diesem Ordner zurück ins Root verschieben (Git-Historie bleibt ohnehin erhalten).
