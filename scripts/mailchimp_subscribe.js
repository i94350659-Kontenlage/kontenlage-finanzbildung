/**
 * Mailchimp Integration Helper for Kontenlage
 * Audience ID: c3728821fc (kontenlage)
 * Server Prefix: us5
 */

const https = require('https');

const MAILCHIMP_API_KEY = 'f69fba0d24c4049395fdcffff6c3b7a4-us5';
const AUDIENCE_ID = 'c3728821fc';
const DATACENTER = 'us5';

function subscribeLead(email, firstName) {
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
  subscribeLead('test.lead@kontenlage.de', 'TestUser');
}

module.exports = { subscribeLead };
