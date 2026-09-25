// SEO-/Meta-Verifikation gegen die Live-Domain (Tickets P0-01, P0-02, P1-01).
// Prüft je Registry-Route: HTTP-Status, Title, Canonical, robots-Verhalten und JSON-LD.
// Prüft zusätzlich: unbekannte URL -> 404, Sitemap deckt alle indexierbaren Routen.
//
// Usage: node tools/verify-seo.mjs [--base https://kontolage.de]
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const registry = JSON.parse(fs.readFileSync(path.join(root, 'webseitenversionen', '4.9.2026', 'content', 'routes.json'), 'utf8'))
const baseArg = process.argv.indexOf('--base')
const base = (baseArg > -1 ? process.argv[baseArg + 1] : registry.site).replace(/\/$/, '')
const bust = () => `?v=${Date.now()}`

let failures = 0
let checks = 0
const record = (ok, label, detail = '') => {
  checks += 1
  if (!ok) failures += 1
  console.log(`  ${ok ? 'OK  ' : 'FAIL'} ${label}${detail ? ` — ${detail}` : ''}`)
}

const pick = (html, re) => html.match(re)?.[1] ?? ''
// HTML-Entities zurückwandeln (z. B. &amp; in Titeln), damit der Vergleich mit der Registry stimmt.
const decode = (value) =>
  value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")

console.log(`SEO-Verifikation gegen ${base} (${registry.routes.length} Routen)`)

for (const route of registry.routes) {
  const url = route.path === '/' ? `${base}/` : `${base}${route.path}`
  const res = await fetch(`${url}${bust()}`, { headers: { 'user-agent': 'Kontolage-Verify/1.0' } })
  const html = await res.text()

  const expectedCanonical = route.path === '/' ? `${base}/` : `${base}${route.path}`
  const title = pick(html, /<title>([\s\S]*?)<\/title>/)
  const canonical = pick(html, /<link rel="canonical" href="([^"]*)"/)
  const robots = pick(html, /<meta name="robots" content="([^"]*)"/)
  const hasJsonLd = /application\/ld\+json/.test(html)
  const hasH1 = html.includes(`<h1`)

  // Duplikat-Meta: der Figma-Document-Shell-Pfad (.figma/make/site.json) kann
  // zusaetzliche og:/twitter:-Tags einhaengen. Crawler werten dann je nach
  // Implementierung die falsche (Startseiten-)Vorschau aus - daher hart pruefen.
  const ogTitles = [...html.matchAll(/<meta property="og:title" content="([^"]*)"/g)].map((m) => m[1])
  const metaDescriptions = [...html.matchAll(/<meta name="description" content="([^"]*)"/g)].map((m) => m[1])
  const twitterTitles = [...html.matchAll(/<meta name="twitter:title" content="([^"]*)"/g)].map((m) => m[1])

  record(res.status === 200, `${route.path} status=200`, `status=${res.status}`)
  record(decode(title).trim() === route.title, `${route.path} title`, `ist="${decode(title).trim().slice(0, 60)}"`)
  record(canonical === expectedCanonical, `${route.path} canonical`, `ist="${canonical}"`)
  record(hasJsonLd, `${route.path} JSON-LD`)
  record(hasH1, `${route.path} h1 im HTML`)
  record(ogTitles.length === 1 && decode(ogTitles[0]).trim() === route.title, `${route.path} og:title eindeutig`, `gefunden=${ogTitles.length} "${decode(ogTitles[0] ?? '').slice(0, 50)}"`)
  record(metaDescriptions.length === 1, `${route.path} description eindeutig`, `gefunden=${metaDescriptions.length}`)
  record(twitterTitles.length === 1, `${route.path} twitter:title eindeutig`, `gefunden=${twitterTitles.length}`)
  if (route.noindex) record(robots.includes('noindex'), `${route.path} robots=noindex`, `ist="${robots}"`)
  else record(!robots.includes('noindex'), `${route.path} robots=index`, `ist="${robots}"`)
}

// 404-Verhalten
const missing = await fetch(`${base}/diese-seite-gibt-es-nicht-${Date.now()}`, { headers: { 'user-agent': 'Kontolage-Verify/1.0' } })
const missingHtml = await missing.text()
record(missing.status === 404, 'unbekannte URL liefert 404', `status=${missing.status}`)
record(/noindex/i.test(missingHtml), 'unbekannte URL ist noindex')

// Sitemap-Abdeckung
const sitemapRes = await fetch(`${base}/sitemap.xml${bust()}`)
const sitemap = await sitemapRes.text()
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])
const expectedUrls = registry.routes
  .filter((route) => !route.noindex)
  .map((route) => (route.path === '/' ? `${base}/` : `${base}${route.path}`))
record(sitemapRes.status === 200, 'sitemap.xml erreichbar', `status=${sitemapRes.status}`)
const missingInSitemap = expectedUrls.filter((url) => !sitemapUrls.includes(url))
const extraInSitemap = sitemapUrls.filter((url) => !expectedUrls.includes(url))
record(missingInSitemap.length === 0, 'Sitemap enthält alle Routen', missingInSitemap.slice(0, 5).join(', '))
record(extraInSitemap.length === 0, 'Sitemap enthält keine toten URLs', extraInSitemap.slice(0, 5).join(', '))
record(sitemapUrls.every((url) => url.startsWith(base)), 'Sitemap-Domain konsistent')
record(/<lastmod>/.test(sitemap), 'Sitemap enthält lastmod')

console.log(`\nErgebnis: ${checks - failures}/${checks} Prüfungen bestanden, ${failures} Fehler`)
process.exit(failures > 0 ? 1 : 0)
