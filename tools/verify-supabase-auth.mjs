// Verifies the Supabase auth wiring used by the live site:
//  - parses VITE_SUPABASE_* from the local app .env (quotes/line endings stripped)
//  - compares the anon key with the one embedded in the built bundle
//  - proves the key is valid via the GoTrue token endpoint (expects 400 invalid_credentials)
//  - prints the public auth settings (signups, email confirmation)
//
// Usage: node tools/verify-supabase-auth.mjs
import fs from 'node:fs'

const projectRef = 'tberfzrzfkwoytgqlpij'
const envPath = 'webseitenversionen/4.9.2026/.env'

function parseEnv(file) {
  const text = fs.readFileSync(file, 'utf8')
  const result = {}
  for (const line of text.split(/\r?\n/)) {
    if (!line.includes('=') || line.trim().startsWith('#')) continue
    const index = line.indexOf('=')
    const key = line.slice(0, index).trim()
    let value = line.slice(index + 1).trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    result[key] = value.replace(/\s+/g, '')
  }
  return result
}

const env = parseEnv(envPath)
const url = env.VITE_SUPABASE_URL
const key = env.VITE_SUPABASE_ANON_KEY
if (!url || !key) {
  console.error(`${envPath}: VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY missing`)
  process.exit(1)
}
console.log(`env: url=${url} keys=${Object.keys(env).join(',')}`)
console.log(`anon key: len=${key.length}`)

const assetDir = 'dist/assets'
const bundleFile = fs
  .readdirSync(assetDir)
  .filter((name) => name.endsWith('.js'))
  .map((name) => `${assetDir}/${name}`)
  .find((file) => fs.readFileSync(file, 'utf8').includes(key))
console.log(`bundle: ${bundleFile ? `${bundleFile} contains the anon key` : 'NO bundle contains this key!'}`)
if (bundleFile) {
  const bundle = fs.readFileSync(bundleFile, 'utf8')
  console.log(`bundle host matches: ${bundle.includes(url)}`)
}

const tokenRes = await fetch(`${url}/auth/v1/token?grant_type=password`, {
  method: 'POST',
  headers: { apikey: key, 'content-type': 'application/json' },
  body: JSON.stringify({ email: 'nobody@example.invalid', password: 'definitely-wrong-password-123' }),
})
const tokenBody = await tokenRes.text()
console.log(
  tokenRes.status === 400 && tokenBody.includes('invalid_credentials')
    ? 'anon key: VALID (credentials rejected as expected)'
    : `anon key: UNEXPECTED (${tokenRes.status}) ${tokenBody.slice(0, 140)}`,
)

const settingsRes = await fetch(`${url}/auth/v1/settings`, { headers: { apikey: key } })
if (settingsRes.ok) {
  const settings = await settingsRes.json()
  console.log('auth settings: ' + JSON.stringify({
    disable_signup: settings.disable_signup,
    mailer_autoconfirm: settings.mailer_autoconfirm,
    external_email_enabled: settings.external_email_enabled,
  }))
} else {
  console.log(`auth settings: HTTP ${settingsRes.status}`)
}
