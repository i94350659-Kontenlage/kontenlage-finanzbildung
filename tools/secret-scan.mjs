// Secret-Scan — findet hart kodierte Schlüssel im Repository.
//
// Anlass: In scripts/mailchimp_subscribe.js stand bis 2026-09-25 ein Mailchimp-Key
// im Klartext (Commit 4cdc80c) in einem oeffentlichen Repository. Dieser Scan
// verhindert die Wiederholung und laeuft in CI (siehe .github/workflows/ci.yml).
//
// Geprueft werden alle versionierten Textdateien ausserhalb von node_modules,
// dist, .git, _archive und der Registry der Secrets selbst.
//
// Usage: node tools/secret-scan.mjs [--staged]
import fs from "node:fs"
import path from "node:path"

const root = process.cwd()
const skipDirs = new Set(["node_modules", "dist", ".git", "_archive", ".next", "coverage", ".kilo", ".vercel"])
const skipFiles = new Set([".agents/skills-audit.json", ".agents/hermes_skills_audit.json"])
const extensions = new Set([".js", ".mjs", ".cjs", ".ts", ".tsx", ".jsx", ".json", ".sh", ".ps1", ".yml", ".yaml", ".env", ".toml", ".sql", ".html", ".md"])

// Muster: echte Schluessel, nicht Platzhalter wie sk_test_xxx.
const PATTERNS = [
  ["Stripe Secret Key", /sk_(?:live|test)_[A-Za-z0-9]{16,}/g],
  ["Stripe Webhook Secret", /whsec_[A-Za-z0-9]{16,}/g],
  ["JWT / API-Token (Printify, Supabase, andere)", /eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,}/g],
  ["Supabase Service Role", /service_role["']?\s*[:=]\s*["'][A-Za-z0-9._-]{30,}/g],
  ["Mailchimp API Key", /\b[0-9a-f]{32}-us\d{1,2}\b/g],
  ["AWS Access Key", /\bAKIA[0-9A-Z]{16}\b/g],
  ["Google API Key", /\bAIza[0-9A-Za-z_-]{35}\b/g],
  ["Private Key Block", /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g],
]

// Bekannte, dokumentierte Platzhalter in Kommentaren/Doku.
const PLACEHOLDERS = /(xxx|XXXX|example|placeholder|REDACTED|<[^>]+>|\.\.\.)/i

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (skipDirs.has(entry.name)) continue
      walk(path.join(dir, entry.name), files)
    } else if (entry.isFile()) {
      if (skipFiles.has(entry.name)) continue
      if (extensions.has(path.extname(entry.name))) files.push(path.join(dir, entry.name))
    }
  }
  return files
}

const files = walk(root)
const findings = []

for (const file of files) {
  const rel = path.relative(root, file).replace(/\\/g, "/")
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/)
  lines.forEach((line, index) => {
    for (const [name, pattern] of PATTERNS) {
      // eigene Treffer zuruecksetzen, damit Zeilen unabhaengig zaehlen
      pattern.lastIndex = 0
      const matches = line.match(pattern)
      if (!matches) continue
      for (const match of matches) {
        if (PLACEHOLDERS.test(match)) continue
        // Nur die ersten 4 Zeichen zeigen, nie den vollstaendigen Schluessel.
        const masked = `${match.slice(0, 4)}${"*".repeat(Math.max(0, match.length - 8))}${match.slice(-4)}`
        findings.push({ file: rel, line: index + 1, kind: name, masked })
      }
    }
  })
}

console.log(`Secret-Scan: ${files.length} Dateien geprueft`)
if (findings.length === 0) {
  console.log("Ergebnis: keine hart kodierten Schluessel gefunden.")
  process.exit(0)
}
for (const finding of findings) {
  console.log(`  ${finding.file}:${finding.line}  ${finding.kind}  ${finding.masked}`)
}
console.log(`\nErgebnis: ${findings.length} Fund(e). Schluessel sofort widerrufen und neu erzeugen, dann History bereinigen (siehe TODOperHAND.md).`)
process.exit(1)
