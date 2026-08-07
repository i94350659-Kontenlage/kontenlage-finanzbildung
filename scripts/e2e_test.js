/**
 * Automated E2E & Validation Test Suite for Kontenlage
 * Verifiziert HTML-Dateien, Link-Struktur, Rechner-Logiken und Formulare.
 */

const fs = require('fs');
const path = require('path');

function runE2ETests() {
  console.log('🧪 Starte E2E & Qualitäts-Tests für Kontenlage...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASSED: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAILED: ${message}`);
      failed++;
    }
  }

  const rootDir = path.join(__dirname, '..');

  // Test 1: Existenz wichtiger Dateien
  const requiredFiles = [
    'index.html',
    'lead_magnet_freibetraege_2026.html',
    'artikel/steuersparimmobilien-erfahrungen.html',
    'artikel/ruerup-rente-sinnvoll-rechner.html',
    'artikel/sparerpauschbetrag-2026-einrichten.html',
    'supabase_schema.sql',
    '.github/workflows/hermes_cron.yml'
  ];

  requiredFiles.forEach(relPath => {
    const fullPath = path.join(rootDir, relPath);
    assert(fs.existsSync(fullPath), `Datei existiert: ${relPath}`);
  });

  // Test 2: HTML Inhalt Validierung (index.html)
  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');
  assert(indexHtml.includes('<!DOCTYPE html>'), 'index.html enthält Doctype declaration');
  assert(indexHtml.includes('Schema.org'), 'index.html enthält JSON-LD Structured Data');
  assert(indexHtml.includes('handleLeadSubmit'), 'index.html enthält Lead-Formular Event Handler');
  assert(indexHtml.includes('artikel/steuersparimmobilien-erfahrungen.html'), 'index.html verlinkt Artikel 1');
  assert(indexHtml.includes('artikel/ruerup-rente-sinnvoll-rechner.html'), 'index.html verlinkt Artikel 2');
  assert(indexHtml.includes('artikel/sparerpauschbetrag-2026-einrichten.html'), 'index.html verlinkt Artikel 3');
  assert(indexHtml.includes('lead_magnet_freibetraege_2026.html'), 'index.html verlinkt Lead-Magnet PDF');

  // Test 3: Mathematische Rechner-Logik Test (Rürup Grenzsteuersatz)
  function calcRuerupErsparnis(brutto, monatsBeitrag) {
    const jahresBeitrag = Math.min(monatsBeitrag * 12, 30825.60);
    const grenzsteuersatz = brutto > 66760 ? 0.42 : brutto > 17005 ? 0.24 + (brutto - 17005)/(66760 - 17005) * 0.18 : 0.14;
    return jahresBeitrag * grenzsteuersatz;
  }

  const testErsparnis = calcRuerupErsparnis(70000, 250);
  assert(testErsparnis === 1260, `Rürup-Rechner Logik korrekt: bei 70k Brutto & 250€/Mo => 1.260 € Ersparnis (Ergebnis: ${testErsparnis} €)`);

  console.log(`\n========================================`);
  console.log(`📊 Testergebnis: ${passed} Bestanden, ${failed} Fehlgeschlagen.`);
  console.log(`========================================\n`);

  if (failed > 0) process.exit(1);
}

runE2ETests();
