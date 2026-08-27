const fs = require('fs');
const path = require('path');

const ROOT_DIR = 'G:\\B2B steuer Business Ideee 6.8.2026';
const newsletterDir = path.join(ROOT_DIR, 'newsletter');
fs.mkdirSync(newsletterDir, { recursive: true });

const SITE_BASE_URL = 'https://kontenlage.de';

// 1. Daily Financial Newsletter Database
const DAILY_NEWSLETTERS = [
  {
    slug: 'ausblick-steuerreform-2026-2028-grundfreibetrag.html',
    title: 'Steuerreform 2026–2028: Grundfreibetrag, degressive AfA & kalte Progression',
    metaDesc: 'Wirtschaftswachstums- & Steuerentlastungspaket: Wie sich der Grundfreibetrag, Handwerkerleistungen (§ 35a) und die 5% Gebäude-AfA auswirken.',
    keywords: 'Steuerreform 2026 2028, Grundfreibetrag Erhöhung, degressive AfA Gebäude, Handwerkerleistungen absetzen',
    date: '2026-08-27',
    readTime: '4 Min. Lesezeit',
    h1: 'Steuerreform 2026 / 2027 / 2028: Das Entlastungspaket im Detail',
    intro: 'Mit den jüngsten Beschlüssen zum Steuerreformpaket werden Grenzsteuersätze nach rechts verschoben und gezielte Investitionsanreize für Sachwerte gesetzt.',
    sections: [
      {
        h2: '1. Grundfreibetrag & Tarifkurve (§ 32a EStG)',
        text: 'Der steuerliche Grundfreibetrag steigt auf über 11.784 € für Alleinstehende. Die Tarifeckwerte werden inflationsbereinigt verschoben, um die kalte Progression bei Gehaltserhöhungen systematisch zu dämpfen.'
      },
      {
        h2: '2. Degressive Gebäude-AfA (Wachstumschancengesetz)',
        text: 'Für neu errichtete oder im Jahr der Fertigstellung erworbene Wohngebäude greift eine degressive Abschreibung von bis zu 5% jährlich auf den Restbuchwert. Dies beschleunigt den Steuerstundungseffekt in den ersten 6 Jahren erheblich.'
      },
      {
        h2: '3. Handwerkerleistungen (§ 35a Abs. 3 EStG)',
        text: 'Arbeitskosten für Renovierungs-, Erhaltungs- und Modernisierungsmaßnahmen können weiterhin mit 20% von bis zu 6.000 € (max. 1.200 € direkter Steuerabzug) geltend gemacht werden.'
      }
    ],
    sources: [
      'Bundesministerium der Finanzen (BMF) — Bericht zur Steuerprogression',
      'Einkommensteuergesetz (EStG) §§ 32a, 35a, 7 Abs. 5a',
      'Beschlüsse des Koalitionsausschusses zur Steuerreform'
    ]
  },
  {
    slug: 'spardosen-gmbh-holding-wann-lohnt-sie-sich.html',
    title: 'Spardosen-GmbH & Holding-Struktur: Ab welchem Depotvolumen rentabel?',
    metaDesc: 'Mathematischer Vergleich: 1,5% Körperschaftsteuer nach § 8b KStG auf Aktiengewinne vs. 26,375% Abgeltungsteuer abzüglich 2.200 € laufender GmbH-Kosten.',
    keywords: 'Spardosen GmbH Rechner, Holding Struktur Aktien, 8b KStG Schachtelprivileg, Vermögensverwaltende GmbH',
    date: '2026-08-26',
    readTime: '5 Min. Lesezeit',
    h1: 'Die vermögensverwaltende GmbH: Mathematik statt Berater-Mythen',
    intro: 'Eine Spardosen-GmbH klingt verlockend: 98,5% der Aktiengewinne steuerfrei reinvestieren. Doch erst ab einem Mindest-Depotvolumen schlagen die Vorteile die laufenden Bilanzierungs- und IHK-Kosten.',
    sections: [
      {
        h2: 'Das Schachtelprivileg (§ 8b Abs. 1 & 2 KStG)',
        text: 'Gewinne aus der Veräußerung von Aktien gelten zu 95% als steuerfrei. Die verbleibenden 5% werden pauschal als nicht abzugsfähige Betriebsausgabe behandelt und mit ca. 30% Ertragssteuern (KSt + GewSt) belegt. Effektive Steuerlast: 1,54%.'
      },
      {
        h2: 'Die Kostenfalle: Laufende Fixkosten',
        text: 'Eine GmbH erfordert doppelte Buchführung, Eröffnungs- und Schlussbilanz beim Steuerberater (ca. 1.500 € – 2.500 € p.a.), IHK-Beitrag (ca. 150 € – 300 €) und Bundesanzeiger-Veröffentlichung. Mindestgewinn vor Steuern pro Jahr: ca. 12.000 € – 15.000 €.'
      }
    ],
    sources: [
      'Körperschaftsteuergesetz (KStG) § 8b Abs. 1 und 2',
      'Gewerbesteuergesetz (GewStG) § 9 Nr. 1 (Erweiterte Kürzung)',
      'Bundesfinanzhof (BFH) Rechtsprechung zu vermögensverwaltenden Gesellschaften'
    ]
  }
];

function runDailySeoAndNewsletterEngine() {
  console.log('🚀 Running Daily Autonomous SEO & Newsletter Growth Engine...');

  // Step 1: Generate Legal-Proof Newsletter Pages
  DAILY_NEWSLETTERS.forEach(art => {
    let sectionsHtml = '';
    art.sections.forEach(s => {
      sectionsHtml += '<div style="background: var(--paper-card); border: 1px solid var(--line); border-radius: var(--radius); padding: 22px; margin-bottom: 20px; box-shadow: var(--shadow);">' +
        '<h2 style="font-size: 1.25rem; font-weight: 600; color: var(--ink); margin-bottom: 8px;">' + s.h2 + '</h2>' +
        '<p style="font-size: 0.95rem; color: var(--ink-soft); line-height: 1.7; margin: 0;">' + s.text + '</p>' +
        '</div>';
    });

    let sourcesHtml = art.sources.map(src => '<li style="margin-bottom: 4px;">📌 ' + src + '</li>').join('');

    const html = '<!DOCTYPE html>\n' +
      '<html lang="de">\n' +
      '<head>\n' +
      '  <meta charset="UTF-8">\n' +
      '  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
      '  <title>' + art.title + ' | Kontenlage Finanzbildung</title>\n' +
      '  <meta name="description" content="' + art.metaDesc + '">\n' +
      '  <meta name="keywords" content="' + art.keywords + '">\n' +
      '  <link rel="canonical" href="' + SITE_BASE_URL + '/newsletter/' + art.slug + '">\n' +
      '  <link rel="icon" type="image/png" href="../assets/favicon.png">\n' +
      '  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;600&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap">\n' +
      '  <style>\n' +
      '    :root {\n' +
      '      --paper: #F7F5EF; --paper-card: #FFFFFF; --ink: #1C2A24; --ink-soft: #4B5750;\n' +
      '      --line: #D8D2C0; --gold: #A9762F; --positive: #2E6B48; --radius: 4px;\n' +
      '      --shadow: 0 4px 20px rgba(28, 42, 36, 0.06);\n' +
      '    }\n' +
      '    body { margin: 0; background: var(--paper); color: var(--ink); font-family: \'IBM Plex Sans\', sans-serif; line-height: 1.65; }\n' +
      '    h1, h2, h3 { font-family: \'Fraunces\', serif; }\n' +
      '    .wrap { max-width: 820px; margin: 0 auto; padding: 32px 20px; }\n' +
      '  </style>\n' +
      '</head>\n' +
      '<body>\n' +
      '  <header style="border-bottom: 1px solid var(--line); padding: 14px 24px; background: var(--paper); position: sticky; top: 0; z-index: 100;">\n' +
      '    <div style="max-width: 820px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center;">\n' +
      '      <a href="../index.html" style="font-family: \'Fraunces\', serif; font-size: 1.3rem; font-weight: 600; text-decoration: none; color: var(--ink);">\n' +
      '        Konten<span>lage</span> <span style="font-size: 0.75rem; color: var(--gold); font-family: \'IBM Plex Mono\', monospace;">/ Newsletter</span>\n' +
      '      </a>\n' +
      '      <a href="../index.html#rechner" style="background: var(--gold); color: #FFF; padding: 6px 14px; text-decoration: none; font-size: 0.82rem; font-weight: 600; border-radius: var(--radius);">Zum Szenarien-Rechner →</a>\n' +
      '    </div>\n' +
      '  </header>\n' +
      '  <article class="wrap">\n' +
      '    <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 14px;">\n' +
      '      <span style="background: var(--ink); color: var(--paper); font-size: 0.72rem; padding: 2px 8px; border-radius: 2px; font-family: \'IBM Plex Mono\', monospace; font-weight: 600;">MARKT-BRIEFING</span>\n' +
      '      <span style="font-size: 0.8rem; color: var(--ink-soft);">' + art.date + ' · ' + art.readTime + '</span>\n' +
      '    </div>\n' +
      '    <h1 style="font-size: 2.2rem; line-height: 1.25; margin-bottom: 18px; color: var(--ink);">' + art.h1 + '</h1>\n' +
      '    <div style="background: #EFE3C8; border-left: 3px solid var(--gold); padding: 14px 18px; border-radius: 0 var(--radius) var(--radius) 0; margin-bottom: 28px;">\n' +
      '      <p style="font-size: 1.02rem; color: var(--ink); font-weight: 500; margin: 0; line-height: 1.6;">“' + art.intro + '”</p>\n' +
      '    </div>\n' +
      sectionsHtml + '\n' +
      '    <div style="background: #FAF8F3; border: 1px solid var(--line); border-radius: var(--radius); padding: 18px; margin-top: 30px;">\n' +
      '      <strong style="font-size: 0.85rem; color: var(--ink); display: block; margin-bottom: 8px;">📚 Verifizierte Quellen &amp; Gesetzliche Grundlagen:</strong>\n' +
      '      <ul style="margin: 0; padding-left: 18px; font-size: 0.82rem; color: var(--ink-soft); line-height: 1.6;">\n' +
      sourcesHtml + '\n' +
      '      </ul>\n' +
      '    </div>\n' +
      '    <div style="margin-top: 36px; padding: 24px; background: linear-gradient(135deg, #1C2A24 0%, #2D4238 100%); color: var(--paper); border-radius: var(--radius); text-align: center;">\n' +
      '      <h3 style="color: #FFF; font-size: 1.35rem; margin: 0 0 8px;">Berechne dein individuelles Steuerszenario</h3>\n' +
      '      <p style="color: #CBD5CE; font-size: 0.88rem; max-width: 540px; margin: 0 auto 16px;">\n' +
      '        Nutze unsere neutralen Rechner nach § 10 EStG, § 8b KStG und § 20 EStG ohne Beraterprovisionen.\n' +
      '      </p>\n' +
      '      <a href="../index.html#rechner" style="background: var(--gold); color: #FFF; padding: 10px 22px; text-decoration: none; font-size: 0.9rem; font-weight: 600; border-radius: var(--radius); display: inline-block;">\n' +
      '        Jetzt Szenarien-Rechner starten →\n' +
      '      </a>\n' +
      '    </div>\n' +
      '    <div style="margin-top: 24px; font-size: 0.72rem; color: var(--ink-soft); border-top: 1px solid var(--line); padding-top: 14px;">\n' +
      '      ⚖️ Hinweis nach § 2 Abs. 8 Nr. 10 WpHG &amp; Art. 20 MAR: Dieser Inhalt dient ausschließlich der allgemeinen Finanzbildung und stellt keine Anlage-, Rechts- oder Steuerberatung dar.\n' +
      '    </div>\n' +
      '  </article>\n' +
      '</body>\n' +
      '</html>';

    fs.writeFileSync(path.join(newsletterDir, art.slug), html, 'utf8');
    console.log('✅ Generated Legal-Proof Newsletter: ' + art.slug);
  });

  const sitemapXml = '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    '  <url>\n' +
    '    <loc>' + SITE_BASE_URL + '/</loc>\n' +
    '    <lastmod>' + new Date().toISOString().split('T')[0] + '</lastmod>\n' +
    '    <changefreq>daily</changefreq>\n' +
    '    <priority>1.0</priority>\n' +
    '  </url>\n' +
    '  <url>\n' +
    '    <loc>' + SITE_BASE_URL + '/lead_magnet_freibetraege_2026.html</loc>\n' +
    '    <lastmod>' + new Date().toISOString().split('T')[0] + '</lastmod>\n' +
    '    <changefreq>weekly</changefreq>\n' +
    '    <priority>0.8</priority>\n' +
    '  </url>\n' +
    DAILY_NEWSLETTERS.map(n => '  <url>\n    <loc>' + SITE_BASE_URL + '/newsletter/' + n.slug + '</loc>\n    <lastmod>' + n.date + '</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.85</priority>\n  </url>').join('\n') + '\n' +
    '</urlset>';

  fs.writeFileSync(path.join(ROOT_DIR, 'sitemap.xml'), sitemapXml, 'utf8');
  console.log('✅ Generated dynamic sitemap.xml');

  const robotsTxt = 'User-agent: *\nAllow: /\n\nSitemap: ' + SITE_BASE_URL + '/sitemap.xml\n';
  fs.writeFileSync(path.join(ROOT_DIR, 'robots.txt'), robotsTxt, 'utf8');
  console.log('✅ Generated robots.txt');

  console.log('🎉 Autonomous Daily SEO & Newsletter Growth Engine completed successfully!');
}

runDailySeoAndNewsletterEngine();
