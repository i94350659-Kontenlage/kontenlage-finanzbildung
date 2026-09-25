// Prerender — erzeugt je Route eine eigene HTML-Datei mit eigenem Title, Description,
// Canonical, Open-Graph/Twitter-Tags, JSON-LD und einem semantischen Grundgerüst im
// #root-Container (Crawler- und No-JS-Ansicht). Läuft nach `vite build`.
//
// Usage: node tools/prerender-routes.mjs
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const registryFile = path.join(root, 'webseitenversionen', '4.9.2026', 'content', 'routes.json')
const distDir = path.join(root, 'dist')
const templateFile = path.join(distDir, 'index.html')

const registry = JSON.parse(fs.readFileSync(registryFile, 'utf8'))
const site = registry.site.replace(/\/$/, '')
const template = fs.readFileSync(templateFile, 'utf8')

const escapeHtml = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const navRoutes = registry.routes.filter((route) => route.type === 'page' && !route.noindex && route.path !== '/')

function setTag(html, key, replacement) {
  let found = false
  const result = html.replace(TAG_PATTERN, (tag) => {
    if (found || metaKey(tag) !== key) return tag
    found = true
    return replacement
  })
  if (!found) throw new Error(`Vorlage enthält ${key} nicht`)
  return result
}

// Meta-Tags, die je Route genau einmal existieren dürfen. Build-Tools (z. B. das
// Figma-Plugin via transformIndexHtml) injizieren sonst Duplikate, die Google als
// widersprüchliche Meta wertet. Es gewinnt jeweils das erste Vorkommen im Head.
const UNIQUE_META_KEYS = new Set([
  'description', 'robots', 'og:title', 'og:description', 'og:url', 'og:image', 'og:image:width', 'og:image:height',
  'twitter:card', 'twitter:title', 'twitter:description', 'twitter:image',
])

const TAG_PATTERN = /<(meta|link)\b[^>]*>/gi
const ATTR_PATTERN = /([a-zA-Z_:][\w:.-]*)\s*=\s*("([^"]*)"|'([^']*)')/g

function metaKey(tag) {
  let name = null
  let rel = null
  let match
  ATTR_PATTERN.lastIndex = 0
  while ((match = ATTR_PATTERN.exec(tag)) !== null) {
    const [, attr, , dq, sq] = match
    const value = dq ?? sq ?? ''
    if (attr.toLowerCase() === 'name') name = value
    if (attr.toLowerCase() === 'property') name = value
    if (attr.toLowerCase() === 'rel') rel = value
  }
  if (rel?.split(/\s+/).includes('canonical')) return 'canonical'
  if (rel?.split(/\s+/).includes('icon')) return null
  return name ? name.toLowerCase() : null
}

// Der <title>-Tag trägt keinen name/property-Attributwert und wird deshalb gesondert geführt.
function replaceTitle(html, replacement) {
  if (!/<title>[\s\S]*?<\/title>/.test(html)) throw new Error('Vorlage enthält title nicht')
  return html.replace(/<title>[\s\S]*?<\/title>/, replacement)
}

// Erkennt sowohl <meta name="description" …> als auch <meta content='…' name='description'>
// und unabhängig von der Attributreihenfolge sowie der Anführungszeichen-Art.
function dedupeMeta(html) {
  const seen = new Set()
  return html.replace(TAG_PATTERN, (tag) => {
    const key = metaKey(tag)
    if (!key || !UNIQUE_META_KEYS.has(key)) return tag
    if (seen.has(key)) {
      duplicates.push(key)
      return ''
    }
    seen.add(key)
    return tag
  })
}

const duplicates = []

function jsonLdFor(route, url) {
  const graph = []
  if (route.type === 'article') {
    graph.push({
      '@type': 'Article',
      headline: route.h1,
      description: route.description,
      datePublished: route.updated,
      dateModified: route.updated,
      inLanguage: 'de-DE',
      articleSection: route.category,
      author: { '@type': 'Organization', name: 'Redaktion Kontolage' },
      publisher: { '@type': 'Organization', name: 'Kontolage', url: site },
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    })
  } else {
    graph.push({
      '@type': 'WebPage',
      name: route.title,
      description: route.description,
      url,
      inLanguage: 'de-DE',
      isPartOf: { '@type': 'WebSite', name: 'Kontolage.de', url: `${site}/` },
    })
  }
  if (route.path !== '/') {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Startseite', item: `${site}/` },
        { '@type': 'ListItem', position: 2, name: route.h1, item: url },
      ],
    })
  }
  return { '@context': 'https://schema.org', '@graph': graph }
}

function shellFor(route) {
  const nav = navRoutes
    .map((entry) => `<a href="${entry.path}" style="color:#cdc6be;text-decoration:none">${escapeHtml(entry.h1)}</a>`)
    .join(' ')
  const articleLinks = registry.routes
    .filter((entry) => entry.type === 'article')
    .slice(0, 12)
    .map((entry) => `<li style="margin-bottom:6px"><a href="${entry.path}" style="color:#e2c27d;text-decoration:none">${escapeHtml(entry.h1)}</a></li>`)
    .join('')
  const sections = (route.sections ?? [])
    .map((section) => `<h2 style="font-size:20px;margin:30px 0 8px;color:#f0ece4">${escapeHtml(section.heading)}</h2>\n    <p style="margin:0;color:#cdc6be;line-height:1.8">${escapeHtml(section.body)}</p>`)
    .join('\n    ')
  const showArticles = route.type === 'article' || route.path === '/' || route.path === '/artikel'
  const list = showArticles ? `<h2 style="font-size:20px;margin:34px 0 8px;color:#f0ece4">Fachartikel</h2>\n    <ul style="list-style:none;padding:0;margin:0">${articleLinks}</ul>` : ''
  return `<div style="min-height:100vh;background:#111827;color:#f0ece4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
  <header style="border-bottom:1px solid rgba(201,168,76,0.15);padding:18px 24px;max-width:1200px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;gap:16px">
    <a href="/" style="font-size:20px;font-weight:700;color:#e2c27d;text-decoration:none;letter-spacing:0.04em">Kontolage.de</a>
    <nav style="display:flex;gap:16px;font-size:14px;flex-wrap:wrap">${nav}</nav>
  </header>
  <main style="max-width:900px;margin:0 auto;padding:56px 24px 72px">
    <h1 style="font-size:clamp(26px,4vw,42px);line-height:1.2;margin:0 0 18px;color:#faf8f4">${escapeHtml(route.h1)}</h1>
    <p style="font-size:17px;line-height:1.8;color:#cdc6be;margin:0 0 18px">${escapeHtml(route.intro)}</p>
    ${sections}
    ${list}
  </main>
  <section style="max-width:900px;margin:0 auto;padding:0 24px 48px;font-size:13px;color:#a89f94;line-height:1.75">
    <p style="margin:0">${escapeHtml(registry.disclaimer ?? '')}</p>
  </section>
  <footer style="border-top:1px solid rgba(255,255,255,0.06);padding:28px 24px;max-width:1200px;margin:0 auto;font-size:13px;color:#a89f94">
    <p style="margin:0 0 8px">Kontolage.de — unabhängige Finanzbildung und Steuerrechner. Allgemeine Informationen, keine Anlage-, Steuer- oder Rechtsberatung.</p>
    <p style="margin:0"><a href="/impressum" style="color:#a89f94">Impressum</a> · <a href="/datenschutz" style="color:#a89f94">Datenschutz</a> · <a href="/transparenz" style="color:#a89f94">Transparenz</a> · <a href="/artikel" style="color:#a89f94">Artikel</a></p>
  </footer>
</div>`
}

function render(route) {
  const url = route.path === '/' ? `${site}/` : `${site}${route.path}`
  // Erst die von uns gesetzten Werte schreiben, danach alle Meta-Duplikate
  // entfernen, die Build-Tools zusätzlich in den Head injiziert haben.
  let html = dedupeMeta(template)

  // <title> ist kein meta/link-Tag und braucht den eigenen Ersetzer.
  html = replaceTitle(html, `<title>${escapeHtml(route.title)}</title>`)
  html = setTag(html, 'description', `<meta name="description" content="${escapeHtml(route.description)}" />`)
  html = setTag(html, 'canonical', `<link rel="canonical" href="${url}" />`)
  html = setTag(html, 'og:url', `<meta property="og:url" content="${url}" />`)
  html = setTag(html, 'og:title', `<meta property="og:title" content="${escapeHtml(route.title)}" />`)
  html = setTag(html, 'og:description', `<meta property="og:description" content="${escapeHtml(route.description)}" />`)
  html = setTag(html, 'twitter:title', `<meta name="twitter:title" content="${escapeHtml(route.title)}" />`)
  html = setTag(html, 'twitter:description', `<meta name="twitter:description" content="${escapeHtml(route.description)}" />`)

  if (route.noindex) {
    html = setTag(html, 'robots', '<meta name="robots" content="noindex, follow" />')
  }

  if (route.path !== '/') {
    // Das JSON-LD der Vorlage (FinancialService/FAQPage) gehört ausschließlich auf die Startseite.
    html = html.replace(/[ \t]*<script type="application\/ld\+json">[\s\S]*?<\/script>\r?\n?/g, '')
  } else {
    // Startseite: vorhandenen @graph um die routenspezifischen Knoten erweitern,
    // damit genau ein JSON-LD-Block je Dokument ausgeliefert wird.
    const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)
    if (match) {
      try {
        const existing = JSON.parse(match[1])
        const addition = jsonLdFor(route, url)
        const graph = Array.isArray(existing['@graph']) ? existing['@graph'] : [existing]
        const merged = { ...addition, '@graph': [...graph, ...addition['@graph']] }
        html = html.replace(match[0], `<script type="application/ld+json">\n${JSON.stringify(merged, null, 2)}\n    </script>`)
        return insertShell(html, route)
      } catch {
        // Ungültiges JSON in der Vorlage: eigenständigen Block ergänzen (siehe unten).
      }
    }
  }
  html = html.replace('</head>', `    <script type="application/ld+json">\n${JSON.stringify(jsonLdFor(route, url), null, 2)}\n    </script>\n  </head>`)

  return insertShell(html, route)
}

function insertShell(html, route) {
  const startMarker = '<div id="root">'
  const bodyEnd = html.indexOf('</body>')
  const start = html.indexOf(startMarker)
  const end = html.lastIndexOf('</div>', bodyEnd)
  if (start === -1 || bodyEnd === -1 || end === -1 || end < start) throw new Error('Shell-Struktur der Vorlage nicht gefunden')
  return `${html.slice(0, start + startMarker.length)}\n${shellFor(route)}\n    ${html.slice(end)}`
}

let written = 0
for (const route of registry.routes) {
  const target = route.path === '/' ? path.join(distDir, 'index.html') : path.join(distDir, `${route.path.replace(/^\//, '')}.html`)
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target, render(route), { encoding: 'utf8' })
  written += 1
}

// 404-Seite: Vercel liefert sie bei unbekannten Pfaden mit Status 404 aus.
const fallback = registry.routes.find((route) => route.path === '/')
const notFoundHtml = render({
  ...fallback,
  path: '/404',
  title: 'Seite nicht gefunden (404) | Kontolage',
  description: 'Diese Seite existiert nicht oder wurde verschoben.',
  h1: 'Seite nicht gefunden',
  intro: 'Diese Adresse existiert nicht oder wurde verschoben. Nutzen Sie die Navigation oder starten Sie auf der Startseite.',
  noindex: true,
})
// Die 404-Variante zeigt bewusst auf die Startseite, damit keine 404-Adresse indexiert wird.
const notFoundCanonical = setTag(notFoundHtml, 'canonical', `<link rel="canonical" href="${site}/" />`)
fs.writeFileSync(path.join(distDir, '404.html'), notFoundCanonical, { encoding: 'utf8' })

console.log(`Prerender: ${written} Routen geschrieben (plus 404.html)`)
console.log('  Beispiel: /rechner -> dist/rechner.html · /artikel/<slug> -> dist/artikel/<slug>.html')

