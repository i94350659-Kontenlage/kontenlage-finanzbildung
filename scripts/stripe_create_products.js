/**
 * Automated Stripe Product & Price Setup Script for Kontenlage
 * Creates Pro (9€/mo) and Executive (29€/mo) Subscription Products
 *
 * SECURITY: Stripe Key kommt ausschließlich aus Umgebungsvariablen.
 * NIEMALS hardcodieren — Live-Key rotieren falls er je im Code stand.
 *
 * Verwendung:
 *   Testmodus:  STRIPE_SECRET_KEY=sk_test_xxx node scripts/stripe_create_products.js
 *   Livemodus:  STRIPE_SECRET_KEY=sk_live_xxx node scripts/stripe_create_products.js
 *
 * GitHub Secret: STRIPE_SECRET_KEY (Test-Key bis Gewerbeanmeldung, dann Live-Key)
 */

const https = require('https');
const querystring = require('querystring');

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY || '';

if (!STRIPE_KEY) {
  console.error('❌ STRIPE_SECRET_KEY Umgebungsvariable nicht gesetzt.');
  console.error('   Testmodus:  STRIPE_SECRET_KEY=sk_test_xxx node scripts/stripe_create_products.js');
  process.exit(1);
}

const IS_TEST_MODE = STRIPE_KEY.startsWith('sk_test_');
console.log(`💳 Stripe Modus: ${IS_TEST_MODE ? '🧪 TEST (sicher für Entwicklung)' : '🔴 LIVE (Produktion)'}`);
if (!IS_TEST_MODE) {
  console.log('⚠️  Live-Modus: Stelle sicher, dass Gewerbe angemeldet ist!');
}

function stripeReq(endpoint, postData = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.stripe.com',
      path: `/v1/${endpoint}`,
      method: postData ? 'POST' : 'GET',
      headers: {
        'Authorization': `Bearer ${STRIPE_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };

    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, json });
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    if (postData) req.write(querystring.stringify(postData));
    req.end();
  });
}

async function createStripeCatalog() {
  console.log('💳 Starte automatischen Stripe Produkt- & Preis-Import...\n');

  // 1. Pro Digital Produkt erstellen
  const proProd = await stripeReq('products', {
    name: 'Kontenlage Pro Digital',
    description: 'Vollzugang zu allen Finanz- & Steueranalysen'
  });
  console.log('✅ Produkt "Pro Digital" erstellt:', proProd.json.id);

  // Pro Digital Preis: 9,00 € / Monat (900 Cents)
  const proPrice = await stripeReq('prices', {
    product: proProd.json.id,
    unit_amount: '900',
    currency: 'eur',
    'recurring[interval]': 'month'
  });
  console.log('✅ Preis "Pro Digital (9€/Mo)" ID:', proPrice.json.id);

  // 2. Executive Produkt erstellen
  const execProd = await stripeReq('products', {
    name: 'Kontenlage Executive B2B',
    description: 'Executive Zugang inkl. ELSTER Muster & B2B Vorlagen'
  });
  console.log('✅ Produkt "Executive B2B" erstellt:', execProd.json.id);

  // Executive Preis: 29,00 € / Monat (2900 Cents)
  const execPrice = await stripeReq('prices', {
    product: execProd.json.id,
    unit_amount: '2900',
    currency: 'eur',
    'recurring[interval]': 'month'
  });
  console.log('✅ Preis "Executive B2B (29€/Mo)" ID:', execPrice.json.id);

  console.log('\n========================================');
  console.log('🎉 STRIPE PREISE LIVE ERSTELLT!');
  console.log(`Pro Price ID: ${proPrice.json.id}`);
  console.log(`Executive Price ID: ${execPrice.json.id}`);
  console.log('========================================\n');

  return {
    proPriceId: proPrice.json.id,
    execPriceId: execPrice.json.id
  };
}

if (require.main === module) {
  createStripeCatalog().catch(console.error);
}

module.exports = { createStripeCatalog };
