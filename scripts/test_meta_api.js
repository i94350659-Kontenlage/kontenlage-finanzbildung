const https = require('https');

const FB_TOKEN = process.env.FACEBOOK_PAGE_TOKEN || '';
const IG_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN || '';

function metaRequest(hostname, path) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname,
      path,
      method: 'GET'
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(d) }); }
        catch (e) { resolve({ status: res.statusCode, body: d }); }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function main() {
  console.log('🔍 Teste Meta Facebook & Instagram API Tokens...\n');

  // 1. Facebook Page API Check
  console.log('1️⃣ Facebook Page API Test:');
  const fbRes = await metaRequest('graph.facebook.com', `/v19.0/me?access_token=${FB_TOKEN}`);
  console.log('   Status:', fbRes.status);
  console.log('   Response:', JSON.stringify(fbRes.body, null, 2).slice(0, 300));

  // 2. Instagram API Check
  console.log('\n2️⃣ Instagram API Test:');
  const igRes = await metaRequest('graph.instagram.com', `/me?fields=id,username&access_token=${IG_TOKEN}`);
  console.log('   Status:', igRes.status);
  console.log('   Response:', JSON.stringify(igRes.body, null, 2).slice(0, 300));
}

main().catch(console.error);
