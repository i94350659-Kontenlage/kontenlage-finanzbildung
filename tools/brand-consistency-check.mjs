// Marken-Konsistenz-Prüfung (Skill kontolage-brand-consistency-guardian, Ticket P1-07).
// Kanonische Schreibweise ist "Kontolage". Meldet Abweichungen und kann sie in Quelldateien
// sicher korrigieren (technische Identifier wie Repo-/Skill-Namen bleiben unangetastet).
//
// Usage: node tools/brand-consistency-check.mjs [--fix]
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const fix = process.argv.includes('--fix')

const scanRoots = [
  path.join(root, 'webseitenversionen', '4.9.2026', 'src'),
  path.join(root, 'webseitenversionen', '4.9.2026', 'public'),
  path.join(root, 'webseitenversionen', '4.9.2026', 'index.html'),
  path.join(root, 'webseitenversionen', '4.9.2026', 'content'),
]
const skipDirs = new Set(['node_modules', 'dist', '.git', '.figma'])
const extensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.json', '.html', '.css', '.txt', '.xml'])

// Sichere Korrekturen für öffentliche Texte (lange Varianten zuerst).
const replacements = [
  ['Hermes Autonomous Engine & Redaktion Kontenlage', 'Redaktion Kontolage'],
  ['Kontenlage Redaktion', 'Redaktion Kontolage'],
  ['Redaktion Kontenlage', 'Redaktion Kontolage'],
  ['Kontenlage.de', 'Kontolage.de'],
  ['kontenlage.de', 'kontolage.de'],
]
// Technische Identifier, die nicht verändert werden dürfen.
const protectedPatterns = [/kontenlage-finanzbildung/g, /i94350659-Kontenlage/g]

function walk(target, files = []) {
  if (!fs.existsSync(target)) return files
  const stat = fs.statSync(target)
  if (stat.isFile()) {
    if (extensions.has(path.extname(target))) files.push(target)
    return files
  }
  for (const entry of fs.readdirSync(target, { withFileTypes: true })) {
    if (entry.isDirectory() && skipDirs.has(entry.name)) continue
    walk(path.join(target, entry.name), files)
  }
  return files
}

const files = scanRoots.flatMap((target) => walk(target))
const hits = []
let changed = 0

for (const file of files) {
  const original = fs.readFileSync(file, 'utf8')
  let next = original
  const rel = path.relative(root, file).replace(/\\/g, '/')

  for (const [from, to] of replacements) {
    if (!next.includes(from)) continue
    const before = next
    next = next.split(from).join(to)
    // Geschützte Identifier wiederherstellen, falls eine Regel sie berührt hätte.
    protectedPatterns.forEach((pattern, index) => {
      const canonical = ['kontenlage-finanzbildung', 'i94350659-Kontenlage'][index]
      if (before.includes(canonical) && !next.includes(canonical)) {
        next = next.replace(new RegExp(to.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), canonical)
      }
    })
  }

  if (next !== original) {
    hits.push(rel)
    if (fix) {
      // Atomar schreiben: manche Editoren/Server halten die Datei kurz gesperrt,
      // dann schlägt ein direktes writeFileSync mit UNKNOWN/EBUSY fehl.
      const tmp = `${file}.${process.pid}.tmp`
      try {
        fs.writeFileSync(tmp, next, { encoding: 'utf8' })
        fs.renameSync(tmp, file)
      } catch (error) {
        try { fs.unlinkSync(tmp) } catch { /* Cleanup ist optional */ }
        hits[hits.length - 1] = `${rel} (Schreibfehler: ${error.code ?? error.message})`
        continue
      }
      changed += 1
    }
  }
}

console.log(`Marken-Prüfung: ${files.length} Dateien geprüft, ${hits.length} mit abweichender Schreibweise`)
for (const hit of hits) console.log(`  ${fix ? 'korrigiert' : 'Befund'}: ${hit}`)
if (hits.length > 0 && !fix) {
  console.log('\nKorrektur ausführen mit: node tools/brand-consistency-check.mjs --fix')
}
console.log(fix ? `\n${changed} Datei(en) aktualisiert.` : `\nergebnis: ${hits.length === 0 ? 'konsistent' : 'Abweichungen gefunden'}`)
process.exit(hits.length > 0 && !fix ? 1 : 0)
