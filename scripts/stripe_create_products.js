/**
 * Automated Stripe Product & Price Setup Script for Kontenlage
 * Creates Pro (9€/mo) and Executive (29€/mo) Subscription Products
 */

const https = require('https');
const querystring = require('querystring');

const STRIPE_KEY = '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';

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
