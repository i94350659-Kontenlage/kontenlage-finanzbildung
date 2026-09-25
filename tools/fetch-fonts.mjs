// Fonts lokal hosten (Ticket P0-06): lädt die benötigten Schnitte von Google Fonts
// als woff2 herunter, legt sie unter public/fonts/ ab und schreibt src/fonts.css
// mit @font-face-Regeln. Danach enthält die Seite keine Fremd-Requests mehr an Google.
//
// Lizenzen: Inter, Playfair Display und JetBrains Mono stehen unter SIL Open Font License
// (Selbst-Hosting ausdrücklich erlaubt).
//
// Usage: node tools/fetch-fonts.mjs
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const app = path.join(root, 'webseitenversionen', '4.9.2026')
const fontDir = path.join(app, 'public', 'fonts')
const cssFile = path.join(app, 'src', 'fonts.css')
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36'

const families = [
  { family: 'Playfair Display', slug: 'playfair-display', query: 'Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600' },
  { family: 'Inter', slug: 'inter', query: 'Inter:wght@300;400;500;600' },
  { family: 'JetBrains Mono', slug: 'jetbrains-mono', query: 'JetBrains+Mono:wght@400;500' },
]

// Nur die Subsets, die deutschen Text vollständig abdecken (Latin inkl. Umlaute).
const wantedSubsets = new Set(['latin'])

fs.mkdirSync(fontDir, { recursive: true })
const rules = []
const urlToFile = new Map()
let downloaded = 0

for (const entry of families) {
  const cssUrl = `https://fonts.googleapis.com/css2?family=${entry.query}&display=swap`
  const response = await fetch(cssUrl, { headers: { 'user-agent': UA } })
  if (!response.ok) throw new Error(`Google-CSS nicht abrufbar: ${response.status} für ${entry.family}`)
  const css = await response.text()

  const blocks = [...css.matchAll(/\/\*\s*([a-z0-9-]+)\s*\*\/\s*@font-face\s*\{([^}]+)\}/g)]
  for (const [, subset, body] of blocks) {
    if (!wantedSubsets.has(subset)) continue
    const weight = body.match(/font-weight:\s*(\d+)/)?.[1]
    const style = /font-style:\s*italic/.test(body) ? 'italic' : 'normal'
    const url = body.match(/url\((https:[^)]+\.woff2)\)/)?.[1]
    const unicodeRange = body.match(/unicode-range:\s*([^;]+);/)?.[1]?.trim()
    if (!weight || !url) continue

    const fileName = urlToFile.get(url) ?? `${entry.slug}-${weight}${style === 'italic' ? '-italic' : ''}${subset === 'latin' ? '' : `-${subset}`}.woff2`
    if (!urlToFile.has(url)) urlToFile.set(url, fileName)
    const target = path.join(fontDir, fileName)
    if (!fs.existsSync(target)) {
      const fontResponse = await fetch(url, { headers: { 'user-agent': UA } })
      if (!fontResponse.ok) throw new Error(`Font-Download fehlgeschlagen: ${fontResponse.status} ${url}`)
      fs.writeFileSync(target, Buffer.from(await fontResponse.arrayBuffer()))
      downloaded += 1
    }

    rules.push(
      [
        '@font-face {',
        `  font-family: '${entry.family}';`,
        `  font-style: ${style};`,
        `  font-weight: ${weight};`,
        '  font-display: swap;',
        `  src: url('/fonts/${fileName}') format('woff2');`,
        unicodeRange ? `  unicode-range: ${unicodeRange};` : null,
        '}',
      ]
        .filter(Boolean)
        .join('\n'),
    )
  }
}

const header = [
  '/* Lokal gehostete Schriften (Ticket P0-06).',
  ' * Erzeugt von tools/fetch-fonts.mjs — nicht manuell bearbeiten.',
  ' * Quellen: Google Fonts, SIL Open Font License (Inter, Playfair Display, JetBrains Mono).',
  ' * Vorteil: keine Requests an fonts.googleapis.com/fonts.gstatic.com (DSGVO, TDDDG) und kein Renderblocking. */',
  '',
].join('\n')

fs.writeFileSync(cssFile, `${header}${rules.join('\n\n')}\n`, { encoding: 'utf8' })
console.log(`Fonts: ${rules.length} @font-face-Regeln geschrieben, ${downloaded} Dateien heruntergeladen`)
console.log(`  CSS: ${path.relative(root, cssFile).replace(/\\/g, '/')}`)
console.log(`  Dateien: ${path.relative(root, fontDir).replace(/\\/g, '/')}`)
