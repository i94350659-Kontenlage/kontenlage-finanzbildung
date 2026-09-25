// Health-Check für Kontolage (Ticket P1-10): prüft die Live-Kette ohne Zugangsdaten.
// Läuft täglich im Workflow `.github/workflows/health-monitor.yml` und bei Bedarf lokal.
//
// Usage: node tools/health-check.mjs [--base https://kontolage.de]
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const registry = JSON.parse(fs.readFileSync(path.join(root, 'webseitenversionen', '4.9.2026', 'content', 'routes.json'), 'utf8'))
const baseArg = process.argv.indexOf('--base')
const base = (baseArg > -1 ? process.argv[baseArg + 1] : registry.site).replace(/\/$/, '')
const supabase = 'https://tberfzrzfkwoytgqlpij.supabase.co'

const checks = []
const check = async (label, fn) => {
  try {
    const detail = await fn()
    checks.push({ label, ok: true, detail })
  } catch (error) {
    checks.push({ label, ok: false, detail: error instanceof Error ? error.message : String(error) })
  }
}

const expectStatus = (expected, url, init) => async () => {
  const response = await fetch(url, init)
  if (response.status !== expected) throw new Error(`erwartet ${expected}, erhalten ${response.status}`)
  return `status=${response.status}`
}

// 1. Alle Registry-Routen müssen erreichbar sein.
for (const route of registry.routes) {
  const url = route.path === '/' ? `${base}/` : `${base}${route.path}`
  await check(`route ${route.path}`, expectStatus(200, url))
}

// 2. Unbekannte URL muss 404 liefern (kein Soft-404).
await check('404-Verhalten', expectStatus(404, `${base}/health-check-unbekannt-${Date.now()}`))

// 3. Sitemap und robots.
await check('sitemap.xml', expectStatus(200, `${base}/sitemap.xml`))
await check('robots.txt', expectStatus(200, `${base}/robots.txt`))

// 4. Statische Assets (Fonts, OG-Bild).
await check('font inter', expectStatus(200, `${base}/fonts/inter-300.woff2`))
await check('og-image.png', expectStatus(200, `${base}/og-image.png`))

// 5. Edge Functions müssen ohne JWT 401 liefern (Auth-Schutz aktiv).
for (const fn of ['account', 'create-checkout-session', 'billing-portal', 'cancel-subscription']) {
  await check(`edge function ${fn}`, expectStatus(401, `${supabase}/functions/v1/${fn}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' }))
}

// 6. Webhook muss unsignierte Requests ablehnen.
await check('stripe-webhook Signaturprüfung', expectStatus(400, `${supabase}/functions/v1/stripe-webhook`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' }))

const failures = checks.filter((entry) => !entry.ok)
for (const entry of checks) console.log(`  ${entry.ok ? 'OK  ' : 'FAIL'} ${entry.label}${entry.detail ? ` — ${entry.detail}` : ''}`)
console.log(`\nHealth-Check: ${checks.length - failures.length}/${checks.length} bestanden, ${failures.length} Fehler`)

if (failures.length > 0) {
  console.error('\nFehlgeschlagene Prüfungen: ' + failures.map((entry) => entry.label).join(', '))
  process.exit(1)
}
