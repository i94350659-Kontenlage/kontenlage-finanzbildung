// Lists Stripe webhook endpoints for every key found in the local env files.
// Usage: node tools/verify-stripe-endpoints.mjs
import fs from 'node:fs'

const files = ['.env', '.env.production.local']
const wanted = ['STRIPE_SECRET_KEY', 'STRIPE_TEST_SECRET_KEY']

const keys = new Map()
for (const file of files) {
  if (!fs.existsSync(file)) continue
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.+)$/)
    if (!match) continue
    const name = match[1]
    if (!wanted.includes(name) || keys.has(name)) continue
    const value = match[2].replace(/["'\r\n]/g, '').trim()
    if (value) keys.set(name, value)
  }
}

if (keys.size === 0) {
  console.log('No Stripe secret keys found in .env / .env.production.local')
  process.exit(1)
}

for (const [name, key] of keys) {
  const mode = key.startsWith('sk_live') ? 'live' : key.startsWith('sk_test') ? 'test' : 'unknown'
  console.log(`\n=== ${name} (mode=${mode}, prefix=${key.slice(0, 8)}) ===`)
  const res = await fetch('https://api.stripe.com/v1/webhook_endpoints?limit=100', {
    headers: { authorization: `Bearer ${key}` },
  })
  const body = await res.json()
  if (!res.ok) {
    console.log(`  Stripe error ${res.status}: ${body?.error?.message ?? 'unknown'}`)
    continue
  }
  for (const endpoint of body.data ?? []) {
    console.log(`  ${endpoint.status}  ${endpoint.url}`)
    console.log(`     id=${endpoint.id} desc=${endpoint.description ?? '-'} events=${(endpoint.enabled_events ?? []).join(',')}`)
  }
  if (!body.data?.length) console.log('  (no endpoints)')
}
