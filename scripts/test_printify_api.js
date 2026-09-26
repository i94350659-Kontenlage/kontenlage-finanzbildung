const https = require('https');

// SICHERHEIT: Der Token wird ausschliesslich aus der Umgebung gelesen.
// Bis 2026-09-25 stand hier ein Printify-Token im Klartext (Commit 264eb3f) —
// dieser muss im Printify-Backend widerrufen und neu erzeugt werden
// (siehe TODOperHAND.md). Token nie in Dateien, nie in Commits, nie in Logs.
const PRINTIFY_KEY = process.env.PRINTIFY_API_TOKEN || '';

if (!PRINTIFY_KEY) {
  console.error('Abbruch: PRINTIFY_API_TOKEN fehlt. Token kommt ausschliesslich aus der Umgebung.');
  process.exit(1);
}

const options = {
  hostname: 'api.printify.com',
  path: '/v1/shops.json',
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${PRINTIFY_KEY}`,
    'User-Agent': 'ScratchAndTravel/1.0'
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    try {
      console.log('Response:', JSON.stringify(JSON.parse(data), null, 2));
    } catch (e) {
      console.log('Raw:', data);
    }
  });
});

req.on('error', (e) => {
  console.error('Error:', e);
});

req.end();
