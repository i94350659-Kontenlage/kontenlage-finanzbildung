/**
 * Mailchimp Integration Helper for Kontolage
 * Audience ID: c3728821fc (kontenlage)
 * Server Prefix: us5
 *
 * SICHERHEIT: Der API-Key wird ausschliesslich aus der Umgebung gelesen.
 * Bis 2026-09-25 stand hier ein Schluessel im Klartext (Commit 4cdc80c) — dieser
 * muss im Mailchimp-Backend widerrufen und neu erzeugt werden (siehe TODOperHAND.md).
 * Key nie in Dateien, nie in Commits, nie in Logs.
 */

const https = require('https');

const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY || '';
const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID || 'c3728821fc';
const DATACENTER = process.env.MAILCHIMP_DATACENTER || MAILCHIMP_API_KEY.split('-').pop() || '';

function subscribeLead(email, firstName) {
  if (!MAILCHIMP_API_KEY) {
    return Promise.reject(new Error('MAILCHIMP_API_KEY ist nicht gesetzt (Umgebungsvariable fehlt).'));
  }
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      email_address: email,
      status: 'pending', // Pending triggers Double Opt-In confirmation email
      merge_fields: {
        FNAME: firstName || ''
      }
    });

    const req = https.request({
      hostname: `${DATACENTER}.api.mailchimp.com`,
      path: `/3.0/lists/${AUDIENCE_ID}/members`,
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`anystring:${MAILCHIMP_API_KEY}`).toString('base64'),
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (res.statusCode === 200 || res.statusCode === 201) {
            console.log(`✅ Mailchimp Double Opt-In E-Mail verschickt an: ${email}`);
            resolve({ success: true, json });
          } else if (json.title === 'Member Exists') {
            console.log(`ℹ️ Lead ${email} existiert bereits in Mailchimp.`);
            resolve({ success: true, message: 'Already subscribed' });
          } else {
            console.error('❌ Mailchimp Fehler:', json);
            resolve({ success: false, json });
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

// Quick Test Execution
if (require.main === module) {
  if (!MAILCHIMP_API_KEY) {
    console.error('Abbruch: MAILCHIMP_API_KEY fehlt. Key kommt ausschliesslich aus der Umgebung.');
    process.exit(1);
  }
  const testEmail = process.env.MAILCHIMP_TEST_EMAIL || '';
  if (!testEmail) {
    console.error('Abbruch: MAILCHIMP_TEST_EMAIL fehlt (kein Versand an echte Adressen im Testlauf).');
    process.exit(1);
  }
  subscribeLead(testEmail, process.env.MAILCHIMP_TEST_NAME || 'Test');
}

module.exports = { subscribeLead };
