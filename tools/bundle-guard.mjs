// Bundle-Guard: verhindert das stille Leer-Bundle (Vite-8/Rolldown entfernt bei fehlenden
// VITE_SUPABASE_*-Variablen den kompletten App-Baum, weil src/lib/supabase.ts im Modul-Scope wirft).
// Läuft lokal und in der CI nach `npm run build`.
//
// Usage: node tools/bundle-guard.mjs
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distDir = path.join(root, 'dist')
const assetsDir = path.join(distDir, 'assets')

const MIN_JS_CHARS = 400_000
const REQUIRED_MARKERS = ['supabase.co', 'kabinett', 'Rechnungen']

// Budgets gegen Regressionen (P1-03). Werte liegen bewusst über dem aktuellen
// Stand, damit sie nur echte Verschlechterungen melden — keine täglichen Fehlalarme.
const MAIN_CHUNK_LIMIT = 120_000
const VENDOR_CHUNK_LIMIT = 320_000
const TOTAL_JS_LIMIT = 900_000

if (!fs.existsSync(assetsDir)) {
  console.error('Bundle-Guard: dist/assets fehlt — zuerst `npm run build` ausführen.')
  process.exit(1)
}

const jsFiles = fs
  .readdirSync(assetsDir)
  .filter((file) => file.endsWith('.js'))
  .map((file) => ({ file, size: fs.statSync(path.join(assetsDir, file)).size }))

const problems = []
const total = jsFiles.reduce((sum, entry) => sum + entry.size, 0)
if (jsFiles.length === 0) problems.push('keine JS-Datei in dist/assets gefunden')
if (total < MIN_JS_CHARS) problems.push(`Gesamtgröße JS ${total} Zeichen < ${MIN_JS_CHARS} — vermutlich Leer-Bundle (fehlende .env?)`)

const bundle = jsFiles.map((entry) => fs.readFileSync(path.join(assetsDir, entry.file), 'utf8')).join('\n')
for (const marker of REQUIRED_MARKERS) {
  if (!bundle.includes(marker)) problems.push(`Marker "${marker}" fehlt im Bundle`)
}

// Prerender-Artefakte müssen vorhanden sein (Ticket P0-01/P1-01)
for (const file of ['index.html', 'rechner.html', '404.html', 'artikel/ruerup-angestellte.html', 'sitemap.xml']) {
  if (!fs.existsSync(path.join(distDir, file))) problems.push(`Prerender-Artefakt fehlt: dist/${file}`)
}

// Budget-Prüfung: Der Einstiegs-Chunk (nicht "vendor-*") entscheidet über die
// Ladezeit des ersten Bildschirms und ist deshalb der wichtigste Wert.
const mainEntry = jsFiles.find((entry) => /^index-[^/]*\.js$/.test(entry.file))
if (!mainEntry) {
  problems.push('Einstiegs-Chunk index-*.js nicht gefunden')
} else {
  if (mainEntry.size > MAIN_CHUNK_LIMIT) {
    problems.push(`Einstiegs-Chunk ${mainEntry.size} Bytes > ${MAIN_CHUNK_LIMIT} Budget`)
  }
}
for (const entry of jsFiles.filter((e) => e.file.startsWith('vendor-'))) {
  if (entry.size > VENDOR_CHUNK_LIMIT) {
    problems.push(`Vendor-Chunk ${entry.file} ${entry.size} Bytes > ${VENDOR_CHUNK_LIMIT} Budget`)
  }
}
if (total > TOTAL_JS_LIMIT) {
  problems.push(`Gesamt-JS ${total} Bytes > ${TOTAL_JS_LIMIT} Budget`)
}

console.log(`Bundle-Guard: ${jsFiles.length} JS-Datei(en), ${total} Zeichen gesamt`)
for (const entry of jsFiles) console.log(`  ${entry.file}  ${entry.size} Bytes`)
console.log(
  `  Einstiegs-Chunk: ${mainEntry ? `${mainEntry.size} Bytes (Budget ${MAIN_CHUNK_LIMIT})` : 'FEHLT'}`,
)

if (problems.length > 0) {
  console.error('\nBundle-Guard FEHLGESCHLAGEN:')
  for (const problem of problems) console.error(`  - ${problem}`)
  console.error('\nHinweis: fehlt webseitenversionen/4.9.2026/.env, erzeugt sie mit `node tools/sync-app-env.mjs`.')
  process.exit(1)
}
console.log('Bundle-Guard bestanden: Bundle vollständig, Prerender-Artefakte vorhanden.')
