// Kontolage Newsletter-Lint — prüft die freien Ausgaben in content/newsletter.json.
//
// Prüft die Regeln, die sonst erst nach dem Deploy auffallen: jede Ausgabe braucht
// mindestens eine belegte Quelle mit Stichtag und Jurisdiktion, einen gueltigen Tarif,
// einen eindeutigen Slug und einen Eintrag in der Sitemap-Registry. Ausserdem wird
// verhindert, dass gesperrte (bezahlte) Ausgaben versehentlich im oeffentlichen
// Registry landen — das wuerde den Text in das Bundle und ins prerenderte HTML spu.len.
//
// Usage: node tools/newsletter-lint.mjs
import fs from "node:fs"
import path from "node:path"

const root = process.cwd()
const registryPath = path.join(root, "webseitenversionen", "4.9.2026", "content", "newsletter.json")
const routesPath = path.join(root, "webseitenversionen", "4.9.2026", "content", "routes.json")

const VALID_TIERS = new Set(["free", "pro", "executive"])
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/
// Formulierungen, die eine materielle Empfehlung implizieren (WpHG / MAR).
const BANNED = [
  "sichere Rendite",
  "garantierte Rendite",
  "beste Wahl",
  "optimal für Sie",
  "für Sie geeignet",
  "jetzt kaufen",
  "jetzt einsteigen",
  "sollten Sie investieren",
  "empfehlen wir",
]

const errors = []
const warnings = []
const today = new Date().toISOString().slice(0, 10)

if (!fs.existsSync(registryPath)) {
  console.error(`Fehlt: ${path.relative(root, registryPath)}`)
  process.exit(1)
}

const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"))
const routes = fs.existsSync(routesPath)
  ? JSON.parse(fs.readFileSync(routesPath, "utf8")).routes
  : []
const registeredPaths = new Set(routes.map((route) => route.path))
const issues = Array.isArray(registry.issues) ? registry.issues : []
const seenSlugs = new Set()

if (issues.length === 0) errors.push("Registry enthält keine Ausgabe.")
if (!registry.disclaimer || registry.disclaimer.length < 40) {
  errors.push("Pflicht-Disclaimer fehlt oder ist zu kurz (WpHG-Hinweis).")
}

for (const issue of issues) {
  const label = issue.slug ?? "(ohne slug)"
  if (!issue.slug) errors.push("Ausgabe ohne slug.")
  if (seenSlugs.has(issue.slug)) errors.push(`Doppelter slug: ${label}`)
  seenSlugs.add(issue.slug)

  if (!VALID_TIERS.has(issue.tier)) errors.push(`${label}: ungültige tier "${issue.tier}" (free|pro|executive)`)
  // Kernregel: bezahlte Inhalte gehören nicht in die oeffentliche Registry.
  if (issue.tier && issue.tier !== "free") {
    errors.push(`${label}: tier "${issue.tier}" ist gesperrt und darf NICHT in content/newsletter.json stehen — nur in newsletter_issues.`)
  }
  if (!issue.title || issue.title.length < 20) errors.push(`${label}: Titel fehlt oder ist zu kurz.`)
  if (!issue.description || issue.description.length < 80 || issue.description.length > 165) {
    errors.push(`${label}: Description muss 80–165 Zeichen haben (aktuell ${issue.description?.length ?? 0}).`)
  }
  if (!ISO_DATE.test(issue.published ?? "")) errors.push(`${label}: published muss ISO-Datum sein.`)
  if (!ISO_DATE.test(issue.asOf ?? "")) errors.push(`${label}: asOf muss ISO-Datum sein.`)
  if (issue.asOf && issue.asOf > today) errors.push(`${label}: asOf liegt in der Zukunft (${issue.asOf}).`)
  if (issue.published && issue.asOf && issue.published > issue.asOf) {
    warnings.push(`${label}: published liegt nach asOf — Datumslogik prüfen.`)
  }
  if (!Array.isArray(issue.sections) || issue.sections.length < 2) {
    errors.push(`${label}: mindestens zwei Abschnitte erforderlich.`)
  }
  (issue.sections ?? []).forEach((section, index) => {
    if (!section.heading || !section.body) errors.push(`${label}: Abschnitt ${index + 1} unvollständig.`)
  })
  if (!Array.isArray(issue.sources) || issue.sources.length === 0) {
    errors.push(`${label}: mindestens eine Quelle erforderlich.`)
  }
  ;(issue.sources ?? []).forEach((source, index) => {
    if (!source?.label) errors.push(`${label}: Quelle ${index + 1} ohne label.`)
    if (!/^https:\/\//.test(source?.url ?? "")) errors.push(`${label}: Quelle ${index + 1} ohne https-URL.`)
    if (!ISO_DATE.test(source?.asOf ?? "")) errors.push(`${label}: Quelle ${index + 1} ohne asOf.`)
    if (!source?.jurisdiction) errors.push(`${label}: Quelle ${index + 1} ohne jurisdiction.`)
  })
  if (!issue.rechnerHref) warnings.push(`${label}: kein rechnerHref — interner Mitnahme-Link fehlt.`)
  if (!Array.isArray(issue.keywords) || issue.keywords.length === 0) {
    warnings.push(`${label}: keine Keywords — SEO-Signal fehlt.`)
  }
  if (issue.h1 && issue.title && issue.h1 !== issue.title) {
    warnings.push(`${label}: h1 weicht vom title ab (SEO: eigener Title bleibt kanonisch).`)
  }
  if (!registeredPaths.has(`/newsletter/${issue.slug}`)) {
    errors.push(`${label}: nicht in content/routes.json registriert → fehlt in Sitemap und Prerender.`)
  }
  const text = [issue.title, issue.teaser, ...(issue.sections ?? []).map((s) => `${s.heading} ${s.body}`)].join(" ")
  for (const phrase of BANNED) {
    if (text.toLowerCase().includes(phrase.toLowerCase())) {
      errors.push(`${label}: unzulässige Empfehlungsformulierung "${phrase}" (WpHG/MAR).`)
    }
  }
}

const missingArchive = registeredPaths.has("/newsletter") ? null : "kein /newsletter-Eintrag in content/routes.json"
if (missingArchive) errors.push(missingArchive)

console.log(`Newsletter-Lint: ${issues.length} Ausgabe(n) geprüft`)
for (const issue of issues) {
  console.log(`  ${issue.slug} (${issue.tier}) — ${issue.published} · ${issue.sources?.length ?? 0} Quelle(n)`)
}
for (const warning of warnings) console.log(`  WARNUNG: ${warning}`)
for (const error of errors) console.log(`  FEHLER: ${error}`)
console.log(`\nErgebnis: ${issues.length - errors.length} OK · ${errors.length} Fehler · ${warnings.length} Warnungen`)
process.exit(errors.length > 0 ? 1 : 0)
