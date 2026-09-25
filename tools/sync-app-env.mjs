// Writes webseitenversionen/4.9.2026/.env from the authoritative Supabase project keys.
// The anon key is browser-safe (it is embedded in the public bundle by design).
//
// Usage: node tools/sync-app-env.mjs
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const projectRef = 'tberfzrzfkwoytgqlpij'
const appDir = path.resolve('webseitenversionen/4.9.2026')
const envFile = path.join(appDir, '.env')

const raw = execFileSync('supabase', ['projects', 'api-keys', '--project-ref', projectRef, '--output', 'json'], {
  encoding: 'utf8',
  shell: true,
})

const start = raw.indexOf('[')
if (start === -1) {
  console.error('Unexpected CLI output:')
  console.error(raw.slice(0, 400))
  process.exit(1)
}

const keys = JSON.parse(raw.slice(start))
const anon = keys.find((entry) => entry.id === 'anon' || entry.name === 'anon')
if (!anon?.api_key) {
  console.error('No "anon" API key returned by the Supabase CLI.')
  process.exit(1)
}

const url = `https://${projectRef}.supabase.co`
const contents = `VITE_SUPABASE_URL=${url}\nVITE_SUPABASE_ANON_KEY=${anon.api_key}\n`
fs.writeFileSync(envFile, contents, { encoding: 'utf8' })

const bytes = fs.readFileSync(envFile)
console.log(`wrote ${path.relative(process.cwd(), envFile)} (${bytes.length} bytes, bom=${bytes[0] === 0xef})`)
console.log(`  VITE_SUPABASE_URL len=${url.length}`)
console.log(`  VITE_SUPABASE_ANON_KEY len=${anon.api_key.length}`)
