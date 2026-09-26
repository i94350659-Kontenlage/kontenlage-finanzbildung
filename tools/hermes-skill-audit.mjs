// Hermes Skill Audit — deterministische Governance-Prüfung aller Skills.
//
// Prüft je Skill: Frontmatter (name, description), Pflichtabschnitte, Marken-Kanon,
// Secret-Muster, Ticket-Kopplung und Registry-Abdeckung.
//
// Policy:
//   - Skills mit Präfix "kontolage-" gelten als kanonisch: Fehler blockieren (Exit 1).
//   - Alle anderen (Legacy "kontenlage-*", Fremdprojekte) erzeugen Warnungen,
//     damit Aufräum-Schuld sichtbar bleibt, ohne den Lauf zu blockieren.
//   - Skills, die in .agents/skills-classes.json als "fremd" klassifiziert sind, erzeugen
//     nur noch Hinweise: sie bleiben nutzbar, zählen aber nicht als offene Migration.
//   - Secret-Muster und fehlende SKILL.md blockieren immer.
//   - "--strict" behandelt alle Skills wie kanonische.
//
// Usage:  node tools/hermes-skill-audit.mjs [--strict] [--json]
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const skillsDir = path.join(root, '.agents', 'skills')
const registryFiles = [path.join(root, '.agents', 'SKILLS.md'), path.join(root, '.agents', 'AGENTS.md')]
const classesFile = path.join(root, '.agents', 'skills-classes.json')
const reportFile = path.join(root, '.agents', 'skills-audit.json')
const strict = process.argv.includes('--strict')
const jsonOnly = process.argv.includes('--json')

const SECRET_PATTERNS = [
  ['stripe_live_key', /sk_live_[A-Za-z0-9]{10,}/],
  ['stripe_test_key', /sk_test_[A-Za-z0-9]{10,}/],
  ['stripe_webhook_secret', /whsec_[A-Za-z0-9]{10,}/],
  ['jwt_token', /eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,}/],
  ['service_role_value', /service_role["']?\s*[:=]\s*["'][A-Za-z0-9._-]{20,}/],
]

const REQUIRED_SECTIONS = ['zweck', 'trigger', 'ablauf', 'check', 'ausgabe', 'fail']
const MIN_SECTIONS = 4
const BRAND_ALLOW_MARKER = 'brand-allow: legacy-spelling'

function listSkillDirs(dir) {
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
}

function parseFrontmatter(text) {
  const normalized = text.replace(/^\uFEFF/, '')
  if (!normalized.startsWith('---')) return null
  const end = normalized.search(/\r?\n---/)
  if (end === -1) return null
  const block = normalized.slice(3, end)
  const meta = {}
  for (const rawLine of block.split(/\r\n|\r|\n/)) {
    const line = rawLine.trimEnd()
    const match = line.match(/^([a-zA-Z_][\w-]*)\s*:\s*(.+)$/)
    if (match) meta[match[1]] = match[2].trim()
  }
  return meta
}

function registryText() {
  return registryFiles
    .filter((file) => fs.existsSync(file))
    .map((file) => fs.readFileSync(file, 'utf8'))
    .join('\n')
}

const dirs = listSkillDirs(skillsDir)
const registry = registryText()
const results = []

function loadClassOverrides() {
  if (!fs.existsSync(classesFile)) return {}
  try {
    return JSON.parse(fs.readFileSync(classesFile, 'utf8')).klassen ?? {}
  } catch {
    console.log('WARNUNG: .agents/skills-classes.json ist kein gültiges JSON - Klassifizierung wird ignoriert.')
    return {}
  }
}

const classOverrides = loadClassOverrides()

for (const dir of dirs) {
  const override = classOverrides[dir]
  const canonical = override?.klasse === 'kanonisch' || (!override && dir.startsWith('kontolage-'))
  const foreign = override?.klasse === 'fremd' && !strict
  const file = path.join(skillsDir, dir, 'SKILL.md')
  const entry = {
    skill: dir,
    file: path.relative(root, file).replace(/\\/g, '/'),
    class: canonical ? 'canonical' : foreign ? 'foreign' : 'legacy',
    reason: override?.grund ?? null,
    errors: [],
    warnings: [],
    notes: [],
  }
  const flag = (message) => {
    if (canonical || strict) entry.errors.push(message)
    else if (foreign) entry.notes.push(message)
    else entry.warnings.push(`Legacy: ${message}`)
  }

  if (!fs.existsSync(file)) {
    entry.errors.push('SKILL.md fehlt')
    results.push(entry)
    continue
  }

  const text = fs.readFileSync(file, 'utf8')
  const meta = parseFrontmatter(text)

  if (!meta) flag('YAML-Frontmatter fehlt oder ist nicht abgeschlossen')
  else {
    if (!meta.name) flag('Frontmatter ohne "name"')
    if (!meta.description) flag('Frontmatter ohne "description"')
    if (meta.name && meta.name !== dir) entry.warnings.push(`Frontmatter-name "${meta.name}" weicht vom Ordner "${dir}" ab`)
  }

  const lower = text.toLowerCase()
  const missingSections = REQUIRED_SECTIONS.filter((section) => !lower.includes(section))
  const present = REQUIRED_SECTIONS.length - missingSections.length
  if (present < MIN_SECTIONS) flag(`zu wenige Pflichtabschnitte (${present}/${REQUIRED_SECTIONS.length}): ${missingSections.join(', ')}`)

  for (const [id, re] of SECRET_PATTERNS) {
    if (re.test(text)) entry.errors.push(`Secret-Muster gefunden: ${id}`)
  }

  const brandHits = text.match(/Kontenlage/g) ?? []
  if (brandHits.length > 0) {
    if (text.includes(BRAND_ALLOW_MARKER)) {
      // Kein Fehler und keine Migrationsschuld: die alte Schreibweise wird hier
      // bewusst dokumentiert (z. B. in der Ersetzungsliste des Marken-Skills).
      entry.notes.push(`historische Schreibweise "Kontenlage" (${brandHits.length}×) — durch "${BRAND_ALLOW_MARKER}" ausdrücklich erlaubt`)
    } else {
      flag(`Marken-Kanon verletzt: ${brandHits.length}× "Kontenlage" (Kanon ist "Kontolage")`)
    }
  }

  if (canonical && !/\b(P0-\d|P1-\d|P2-\d|H-\d)/.test(text)) {
    flag('keine Ticket-Kopplung (P0-/P1-/P2-/H-Nummer) gefunden')
  }

  if (!registry.includes(dir)) flag('nicht in .agents/SKILLS.md oder .agents/AGENTS.md registriert (orphan)')

  entry.sections = present
  results.push(entry)
}

const errors = results.reduce((sum, entry) => sum + entry.errors.length, 0)
const warnings = results.reduce((sum, entry) => sum + entry.warnings.length, 0)
const notes = results.reduce((sum, entry) => sum + entry.notes.length, 0)

const report = {
  generated_at: new Date().toISOString(),
  mode: strict ? 'strict' : 'default',
  skills_dir: path.relative(root, skillsDir).replace(/\\/g, '/'),
  totals: {
    skills: results.length,
    canonical: results.filter((entry) => entry.class === 'canonical').length,
    legacy: results.filter((entry) => entry.class === 'legacy').length,
    foreign: results.filter((entry) => entry.class === 'foreign').length,
    errors,
    warnings,
    notes,
    ok: results.filter((entry) => entry.errors.length === 0).length,
  },
  skills: results,
}

fs.writeFileSync(reportFile, JSON.stringify(report, null, 2) + '\n', { encoding: 'utf8' })

if (jsonOnly) {
  console.log(JSON.stringify(report, null, 2))
} else {
  console.log(`Hermes Skill Audit (${report.mode}) — ${results.length} Skills geprüft`)
  console.log(`Report: ${path.relative(root, reportFile)}`)
  for (const entry of results) {
    const mark = entry.errors.length > 0 ? 'FEHLER' : entry.warnings.length > 0 ? 'WARNUNG' : 'OK'
    console.log(`  [${mark}] (${entry.class}) ${entry.skill}${entry.errors.length ? ` — ${entry.errors.join('; ')}` : ''}`)
    if (entry.warnings.length) console.log(`          Hinweise: ${entry.warnings.join('; ')}`)
    if (entry.notes.length) console.log(`          Notiz (fremd): ${entry.notes.join('; ')}${entry.reason ? ` — ${entry.reason}` : ''}`)
  }
  console.log(`\nErgebnis: ${report.totals.ok}/${results.length} ohne Fehler · ${errors} Fehler · ${warnings} offene Warnungen · ${notes} Fremd-Hinweise`)
  console.log(`Klassen: ${report.totals.canonical} kanonisch · ${report.totals.legacy} Legacy (offene Migrationsschuld) · ${report.totals.foreign} fremd (in .agents/skills-classes.json dokumentiert)`)
  console.log('Zielpräfix für eigene Skills ist "kontolage-".')
}

process.exit(errors > 0 ? 1 : 0)

