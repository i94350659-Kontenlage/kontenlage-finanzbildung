const https = require('https');
const crypto = require('crypto');

const API_KEY    = process.env.X_API_KEY    || '';
const API_SECRET = process.env.X_API_SECRET || '';
const ACC_TOKEN  = process.env.X_ACCESS_TOKEN  || '';
const ACC_SECRET = process.env.X_ACCESS_SECRET || '';

function oauthSign(method, url, params, consumerSecret, tokenSecret) {
  const sorted = Object.keys(params).sort()
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    .join('&');
  const base = method.toUpperCase() + '&' + encodeURIComponent(url) + '&' + encodeURIComponent(sorted);
  const sigKey = encodeURIComponent(consumerSecret) + '&' + encodeURIComponent(tokenSecret);
  return crypto.createHmac('sha1', sigKey).update(base).digest('base64');
}

function buildAuthHeader(method, url, extraParams = {}) {
  const nonce = crypto.randomBytes(16).toString('hex');
  const ts = Math.floor(Date.now() / 1000).toString();
  const oauthParams = {
    oauth_consumer_key: API_KEY,
    oauth_nonce: nonce,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: ts,
    oauth_token: ACC_TOKEN,
    oauth_version: '1.0'
  };
  const allParams = { ...oauthParams, ...extraParams };
  const sig = oauthSign(method, url, allParams, API_SECRET, ACC_SECRET);
  oauthParams.oauth_signature = sig;
  return 'OAuth ' + Object.keys(oauthParams)
    .map(k => encodeURIComponent(k) + '="' + encodeURIComponent(oauthParams[k]) + '"')
    .join(', ');
}

function xRequest(path, method = 'GET', body = null, extraOauthParams = {}) {
  return new Promise((resolve, reject) => {
    const url = 'https://api.twitter.com' + path;
    const auth = buildAuthHeader(method, url, extraOauthParams);
    const data = body ? JSON.stringify(body) : null;
    const req = https.request({
      hostname: 'api.twitter.com',
      path,
      method,
      headers: {
        'Authorization': auth,
        'Content-Type': 'application/json',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {})
      }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(d) }); }
        catch (e) { resolve({ status: res.statusCode, body: d }); }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function postTweet(text) {
  const res = await xRequest('/2/tweets', 'POST', { text });
  return res;
}

async function main() {
  console.log('Teste X/Twitter API...');

  // Account-Info
  const me = await xRequest('/2/users/me', 'GET');
  console.log('Status:', me.status);
  console.log('Account:', JSON.stringify(me.body).slice(0, 200));

  if (me.status === 200) {
    console.log('\n✅ X/Twitter API verbunden!');
    console.log('   Username:', me.body.data?.username);
    console.log('   ID:', me.body.data?.id);

    // Test-Tweet posten
    const TEST_MODE = process.argv[2] === '--post';
    if (TEST_MODE) {
      const tweet = await postTweet(
        '📊 Kontenlage — Finanzbildung ohne Interessenkonflikt.\n\nSparerpauschbetrag 2026: 1.000 € (§20 Abs. 9 EStG) — nutzt du ihn wirklich?\n\nhttps://kontolage.de'
      );
      console.log('\nTweet Status:', tweet.status);
      console.log('Tweet ID:', tweet.body?.data?.id);
    } else {
      console.log('\nTipp: node scripts/test_x_api.js --post  → sendet einen echten Test-Tweet');
    }
  } else {
    console.error('❌ Fehler:', JSON.stringify(me.body));
  }
}

module.exports = { postTweet, xRequest, buildAuthHeader };
main().catch(console.error);
