// Sitemap-Generator — liest die Registry (content/routes.json) und schreibt
// webseitenversionen/4.9.2026/public/sitemap.xml sowie dist/sitemap.xml.
// Es werden ausschließlich real existierende Routen ausgegeben (keine Soft-404s).
//
// Usage: node tools/generate-sitemap.mjs
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const app = path.join(root, 'webseitenversionen', '4.9.2026')
const registry = JSON.parse(fs.readFileSync(path.join(app, 'content', 'routes.json'), 'utf8'))
const site = registry.site.replace(/\/$/, '')

const entries = registry.routes
  .filter((route) => !route.noindex)
  .map((route) => {
    const loc = route.path === '/' ? `${site}/` : `${site}${route.path}`
    const lastmod = route.updated ?? registry.updated
    return [
      '  <url>',
      `    <loc>${loc}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      `    <changefreq>${route.changefreq ?? 'monthly'}</changefreq>`,
      `    <priority>${route.priority ?? '0.5'}</priority>`,
      '  </url>',
    ].join('\n')
  })
  .join('\n')

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  entries,
  '</urlset>',
  '',
].join('\n')

const targets = [path.join(app, 'public', 'sitemap.xml'), path.join(root, 'dist', 'sitemap.xml')]
let written = []
for (const target of targets) {
  if (target.includes('dist') && !fs.existsSync(path.dirname(target))) continue
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target, xml, { encoding: 'utf8' })
  written.push(path.relative(root, target).replace(/\\/g, '/'))
}

const articles = registry.routes.filter((route) => route.type === 'article').length
const pages = registry.routes.length - articles
console.log(`Sitemap: ${registry.routes.length - registry.routes.filter((r) => r.noindex).length} URLs (${pages} Seiten inkl. noindex-Abzug, ${articles} Artikel)`)
console.log(`  geschrieben: ${written.join(', ')}`)
