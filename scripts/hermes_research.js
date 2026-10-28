// ============================================================================
// HERMES RESEARCH & CONTENT PIPELINE
// Automatische Recherche sicherer Quellen und Artikel-Entwurfsgenerierung
// Quelle: BMF, BFH, BZSt, Bundesanzeiger, Bundestag, EU-Kommission
// ============================================================================

const https = require('https');
const fs = require('fs');

const SOURCES = [
  {
    name: 'BMF',
    url: 'https://www.bmf.de/BMF/SharedDocs/Pressemitteilungen/DE/Pressemitteilungen.html',
    type: 'press',
    relevance: ['steuer', 'einkommen', 'umsatz', 'körperschaft', 'gewinn'],
    enabled: true
  },
  {
    name: 'BFH',
    url: 'https://www.bfh.de/bfh/de/presse/pressemitteilungen.html',
    type: 'court',
    relevance: ['urteil', 'beschluss', 'steuer', 'einkommen'],
    enabled: true
  },
  {
    name: 'Bundesanzeiger',
    url: 'https://www.bundesanzeiger.de/',
    type: 'law',
    relevance: ['gesetz', 'verordnung', 'steuer'],
    enabled: false // komplexe Parsing-Logik, später aktivieren
  },
  {
    name: 'Bundestag',
    url: 'https://www.bundestag.de/dokumente',
    type: 'law',
    relevance: ['steuer', 'finanz', 'einkommen'],
    enabled: false // komplexe Parsing-Logik, später aktivieren
  },
  {
    name: 'EU-Kommission',
    url: 'https://finance.ec.europa.eu/taxation-and-customs/taxation-news_en',
    type: 'eu',
    relevance: ['vat', 'tax', 'directive'],
    enabled: false // komplexe Parsing-Logik, später aktivieren
  }
];

// ─── Hilfsfunktionen ────────────────────────────────────────────────────────

function httpGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { timeout: 10000 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

// Einfache Keyword-Prüfung (Spam-Schutz, Themenzuordnung)
function matchesRelevance(text, keywords) {
  const lower = text.toLowerCase();
  return keywords.some(k => lower.includes(k.toLowerCase()));
}

// Artikel-Entwurf im routes.json-Format erzeugen
function createDraft(sourceName, title, desc, slug, tag, date, sources) {
  return {
    path: `/artikel/${slug}`,
    type: 'article',
    title,
    description: desc,
    h1: title,
    intro: desc,
    sections: [
      { heading: 'Zusammenfassung', body: desc },
      { heading: 'Quellen', body: `Die Informationen basieren auf ${sourceName} und öffentlich verfügbaren Regelungen.` }
    ],
    tag,
    as_of: date,
    published_on: date,
    readTime: '5 Min.',
    featured: false,
    draft: true, // WICHTIG: Erst nach Prüfung auf false setzen
    sources: sources || [
      { label: sourceName, url: '', jurisdiction: 'DE', asOf: date }
    ],
    status: 'draft'
  };
}

// Routes.json lesen und aktualisieren
async function updateRoutesJson(newArticles) {
  const routesPath = 'webseitenversionen/4.9.2026/content/routes.json';
  let routes;
  try {
    routes = JSON.parse(fs.readFileSync(routesPath, 'utf8'));
  } catch (e) {
    console.error('Konnte routes.json nicht lesen:', e.message);
    return;
  }

  const existingSlugs = new Set(routes.routes.map(r => r.path));
  let added = 0;

  for (const article of newArticles) {
    if (!existingSlugs.has(article.path)) {
      routes.routes.push(article);
      added++;
      console.log(`  ✅ Neuer Entwurf: ${article.title} (${article.path})`);
    } else {
      console.log(`  ⏭️  Übersprungen (bereits vorhanden): ${article.path}`);
    }
  }

  if (added > 0) {
    fs.writeFileSync(routesPath, JSON.stringify(routes, null, 2));
    console.log(`\n📝 ${added} neuer Entwurf(e) in routes.json hinzugefügt (Status: draft).`);
  } else {
    console.log('\nℹ️  Keine neuen Entwürfe gefunden.');
  }
}

// ─── Recherche pro Quelle ─────────────────────────────────────────────────

async function researchSource(source) {
  console.log(`\n🔍 Recherchiere ${source.name} (${source.url})...`);
  try {
    const html = await httpGet(source.url);
    // Platzhalter: Eigentliches Parsing später implementieren
    // Aktuell: Keine automatische Extraktion, da DOM-Parsing komplex ist
    console.log(`   ${source.name}: ${html.length} Zeichen empfangen (Parsing noch nicht implementiert)`);
    return [];
  } catch (err) {
    console.log(`   ${source.name}: Fehler beim Abruf – ${err.message}`);
    return [];
  }
}

// ─── Hauptfunktion ────────────────────────────────────────────────────────

async function main() {
  console.log('🔎 Hermes Research Pipeline gestartet\n');

  const allDrafts = [];

  for (const source of SOURCES) {
    if (!source.enabled) {
      console.log(`⏭️  ${source.name} deaktiviert`);
      continue;
    }
    const drafts = await researchSource(source);
    allDrafts.push(...drafts);
  }

  if (allDrafts.length === 0) {
    console.log('\n⚠️  Keine neuen Artikel automatisch gefunden.');
    console.log('   Die Quellen müssen erst manuell geprüft oder Parser implementiert werden.');
    console.log('   Beispiel-Entwurf kann manuell erstellt werden.');
  }

  await updateRoutesJson(allDrafts);
  console.log('\n✅ Hermes Research abgeschlossen.');
}

main().catch(err => {
  console.error('❌ Fehler:', err);
  process.exit(1);
});