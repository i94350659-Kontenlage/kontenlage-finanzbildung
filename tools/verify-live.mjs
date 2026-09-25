// Live verification for kontolage.de
// Usage: node tools/verify-live.mjs
const base = 'https://kontolage.de'

const bust = () => '?cb=' + Date.now() + Math.random().toString(36).slice(2)
const noCache = { headers: { 'cache-control': 'no-cache', pragma: 'no-cache' } }

const htmlRes = await fetch(`${base}/${bust()}`, noCache)
const html = await htmlRes.text()
const assets = [...new Set([...html.matchAll(/\/assets\/[A-Za-z0-9_.-]+/g)].map((m) => m[0]))]
console.log(`HTML status=${htmlRes.status} bytes=${html.length} assets=${assets.join(', ')}`)

const jsPath = assets.find((a) => a.endsWith('.js'))
if (jsPath) {
  const jsRes = await fetch(`${base}${jsPath}${bust()}`, noCache)
  const js = await jsRes.text()
  console.log(`JS ${jsPath} status=${jsRes.status} chars=${js.length}`)
  const needles = [
    'kabinett',
    'Sparerpauschbetrag',
    'Mein Konto',
    'Konto erstellen',
    'Vergeben Sie ein sicheres Passwort',
    'billing-portal',
    'Rechnungen',
    'supabase.co',
    'not configured',
  ]
  for (const needle of needles) console.log(`  ${needle} => ${js.includes(needle)}`)

  // Validate the Supabase anon key embedded in the live bundle against GoTrue.
  const projectRef = 'tberfzrzfkwoytgqlpij'
  const tokens = [...new Set([...js.matchAll(/eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]+/g)].map((m) => m[0]))]
  console.log(`  supabase jwt candidates: ${tokens.map((t) => t.length).join(', ') || 'none'}`)
  for (const token of tokens) {
    const probe = await fetch(`https://${projectRef}.supabase.co/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: { apikey: token, 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'nobody@example.invalid', password: 'definitely-wrong-password-123' }),
    })
    const body = await probe.text()
    const verdict =
      probe.status === 400 && body.includes('invalid_credentials')
        ? 'VALID KEY'
        : probe.status === 401
          ? 'INVALID KEY'
          : `unexpected ${probe.status}`
    console.log(`  supabase key len=${token.length} -> ${verdict}`)
  }
}

for (const route of [
  '/',
  '/abo',
  '/kabinett',
  '/konto',
  '/rechner',
  '/holding',
  '/anlageformen',
  '/artikel',
  '/transparenz',
  '/impressum',
  '/datenschutz',
  '/sitemap.xml',
  '/robots.txt',
]) {
  try {
    const res = await fetch(`${base}${route}${bust()}`, noCache)
    console.log(`  ${res.status}  ${route}`)
  } catch (error) {
    console.log(`  ERR ${route} -> ${error.message}`)
  }
}

for (const host of ['https://www.kontolage.de/', 'https://kontolage.de/api/health']) {
  try {
    const res = await fetch(`${host}${bust()}`, noCache)
    console.log(`  ${res.status}  ${host}`)
  } catch (error) {
    console.log(`  ERR ${host} -> ${error.message}`)
  }
}
