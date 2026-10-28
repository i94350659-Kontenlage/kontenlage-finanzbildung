# Hermes Agent — Konfiguration v2.4

## Rolle
Hermes ist der Automatisierungskern von Kontolage (kontolage.de). Er generiert wöchentlich finanzbildenden 5-Kanal-Content (Telegram, X, Facebook, Instagram, LinkedIn) und veröffentlicht ihn direkt.

## AI Provider-Kette (Reihenfolge = Priorität)
| Rang | Provider | Modell | Key (GitHub Secret) | Status |
|------|----------|--------|---------------------|--------|
| 1 | OpenRouter (Primär) | nvidia/nemotron-3-ultra-550b-a55b:free | `OPENROUTER_API_KEY` | aktiv |
| 2 | Orcarouter (free) | orcarouter/free | `ORCAROUTER_API_KEY` | neu |
| 3 | Zenmux (Agnes 2.5 Flash) | sapiens-ai/agnes-2.5-flash | `ZENMUXAI_API_KEY` | neu |
| 4 | Together AI | Prism-ML/Ternary-Bonsai-27B | `TOGETHERAI_API_KEY` | neu (Key umbenannt von TOGETHER_API_KEY) |
| 5 | Requesty | gemma-4-31b-it | `REQUESTY_API_KEY` | aktiv |
| 6 | EdenAI (v3) | google/gemma-4-31b-it | `EDENAI_API_KEY` | aktiv (Endpoint v1→v3) |
| 7 | Groq | llama-3.3-70b-versatile | `GROQ_API_KEY` | aktiv |
| 8 | Google Gemini | gemini-2.0-flash | `GEMINI_API_KEY` | aktiv |
| 9 | Mistral | mistral-small-latest | `MISTRAL_API_KEY` | aktiv |
| 10+ | Custom Gateway 1/2 | frei wählbar | `GATEWAY1/2_*` | optional |

## Fehlerbehandlung
- Provider ohne Key/URL werden übersprungen.
- Bei transienten Fehlern (429 Rate-Limit, 503 Overload, 408 Timeout) läuft ein **zweiter Durchlauf** durch die gesamte Kette nach 5 s Pause.
- Endpunkt-Fallback: Statischer Qualitätscontent aus der Knowledge Base, wenn alle Provider scheitern.

## Secrets, die gesetzt sein müssen (GitHub → Settings → Secrets → Actions)
`OPENROUTER_API_KEY`, `ORCAROUTER_API_KEY`, `ZENMUXAI_API_KEY`, `TOGETHERAI_API_KEY`, `REQUESTY_API_KEY`, `EDENAI_API_KEY`, `GROQ_API_KEY`, `GEMINI_API_KEY`, `MISTRAL_API_KEY`, plus Social-Media- und Supabase-Secrets (siehe `scripts/hermes_runner.js` Kommentarblock).

## Auslöser
- Jeden Montag 08:00 UTC (GitHub Actions Schedule)
- Manuell via `workflow_dispatch` im GitHub Dashboard

## Verknüpfte Dateien
- `scripts/hermes_runner.js` — Hauptlogik
- `.github/workflows/hermes_cron.yml` — CI/CD
- `TODOperHAND.md` — Manuelle Aufgaben (Key-Rotation etc.)
- `docs/kanban.md` — Ticket-Status