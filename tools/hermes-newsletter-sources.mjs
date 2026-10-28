#!/usr/bin/env node
// Hermes Newsletter Sources CLI & Checker
// Erlaubt das Abfragen und Validieren der offiziellen Primärquellen je Themenkategorie.
//
// Usage:
//   node tools/hermes-newsletter-sources.mjs
//   node tools/hermes-newsletter-sources.mjs --category "Makroökonomie & EZB"
//   node tools/hermes-newsletter-sources.mjs --list

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const registryPath = path.join(
  root,
  ".agents",
  "skills",
  "kontolage-newsletter-editor",
  "resources",
  "themen-quellen-registry.json"
);

if (!fs.existsSync(registryPath)) {
  console.error(`Fehler: Quell-Registry nicht gefunden unter ${registryPath}`);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(registryPath, "utf8"));
const categories = data.categories || [];

const args = process.argv.slice(2);
const categoryArgIndex = args.indexOf("--category");
const isList = args.includes("--list");

if (categoryArgIndex !== -1 && args[categoryArgIndex + 1]) {
  const query = args[categoryArgIndex + 1].toLowerCase().trim();
  const match = categories.find(
    (c) =>
      c.name.toLowerCase().includes(query) ||
      c.id.toLowerCase().includes(query)
  );

  if (!match) {
    console.error(`Keine Kategorie passend zu "${args[categoryArgIndex + 1]}" gefunden.`);
    console.log(`Verfügbare Kategorien:`);
    categories.forEach((c) => console.log(`  - ${c.name} (${c.id})`));
    process.exit(1);
  }

  console.log(`\n============================================================`);
  console.log(`📚 THEMA: ${match.name}`);
  console.log(`============================================================`);
  console.log(`Beschreibung:     ${match.shortDescription}`);
  console.log(`Rechner-Deep-Link: ${match.rechnerHref}`);
  console.log(`Decay-Klasse:      ${match.decayClass} (max. ${match.decayDays} Tage)`);
  console.log(`\n🏛️  PRIMÄRQUELLEN (Tier 1 & Tier 2):`);
  match.primarySources.forEach((src, idx) => {
    console.log(`  ${idx + 1}. ${src.name} [${src.jurisdiction}] — ${src.url}`);
    if (src.indicators?.length) {
      console.log(`     Kennzahlen/Reihen: ${src.indicators.join(", ")}`);
    }
    if (src.keyEndpoints?.length) {
      console.log(`     Endpunkte: ${src.keyEndpoints.join(" | ")}`);
    }
  });

  console.log(`\n⚖️  RECHTSGRUNDLAGEN:`);
  match.statutoryBases.forEach((law) => console.log(`  - ${law}`));

  console.log(`\n🔍 RECHERCHE-QUERIES (Hermes Suchmuster):`);
  match.searchQueries.forEach((q) => console.log(`  • "${q}"`));

  console.log(`\n🛡️  COMPLIANCE & WPHG-GUARDRAILS:`);
  console.log(`  ${match.complianceGuardrails}`);
  console.log(`============================================================\n`);
  process.exit(0);
}

// Default or --list: Summary overview
console.log(`\n🏛️  HERMES KONTOLAGE QUELLEN-REGISTRY (v${data.version})`);
console.log(`Insgesamt ${categories.length} Fachkategorien für Newsletter & Bildungsartikel:\n`);

categories.forEach((cat, index) => {
  console.log(`${index + 1}. [${cat.name}] (id: ${cat.id})`);
  console.log(`   Decay: ${cat.decayClass} (${cat.decayDays} Tage) | Rechner: ${cat.rechnerHref}`);
  console.log(`   Quellen: ${cat.primarySources.map((s) => s.name).join(", ")}`);
  console.log(`   Gesetze: ${cat.statutoryBases.join(", ")}`);
  console.log("");
});

console.log(`Aufruf einer Einzelkategorie: node tools/hermes-newsletter-sources.mjs --category "<Name>"`);
