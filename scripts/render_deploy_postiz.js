const https = require('https');

const RENDER_TOKEN = 'rnd_TcrUdYZTESIpglUxiHOWK2dElyi2';
const OWNER_ID = 'tea-d9r46ic9v7es738gkjdg';

const DB_URL    = 'postgresql://postiz_user:SwQIhYqhztflKT9bIq0fU6A9WaoSqQUV@dpg-d9r4pefavr4c73c7ib4g-a/postiz_db_gem2';
const REDIS_URL = 'rediss://red-d9r4pg67bikc7388e950:KxynB6LL2sTjPo4VR0y0R1JTSDHjYwJy@frankfurt-keyvalue.render.com:6379';
const FRONTEND_URL = 'https://postiz-kontolage.onrender.com';
const JWT_SECRET = 'kontolage2026_' + require('crypto').randomBytes(16).toString('hex');

function renderReq(path, method, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const req = https.request({
      hostname: 'api.render.com',
      path,
      method,
      headers: {
        'Authorization': 'Bearer ' + RENDER_TOKEN,
        'Accept': 'application/json',
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

async function main() {
  console.log('🚀 Deploye Postiz auf Render.com...\n');

  // Render v1 API: web_service with docker image
  const payload = {
    name: 'postiz-kontolage',
    ownerId: OWNER_ID,
    region: 'frankfurt',
    plan: 'starter',
    type: 'web_service',
    autoDeploy: 'yes',
    serviceDetails: {
      env: 'docker',
      dockerDetails: {
        dockerImage: 'ghcr.io/gitroomhq/postiz-app:latest'
      },
      numInstances: 1,
      pullRequestPreviewsEnabled: 'no',
    },
    envVars: [
      { key: 'DATABASE_URL',             value: DB_URL },
      { key: 'REDIS_URL',                value: REDIS_URL },
      { key: 'JWT_SECRET',               value: JWT_SECRET },
      { key: 'FRONTEND_URL',             value: FRONTEND_URL },
      { key: 'NEXT_PUBLIC_BACKEND_URL',  value: FRONTEND_URL + '/api' },
      { key: 'BACKEND_INTERNAL_URL',     value: 'http://localhost:3000' },
      { key: 'IS_GENERAL',               value: 'true' },
      { key: 'NODE_ENV',                 value: 'production' },
      { key: 'PORT',                     value: '3000' }
    ]
  };

  const res = await renderReq('/v1/services', 'POST', payload);
  console.log('Status:', res.status);

  if (res.status === 201 || res.status === 200) {
    const svc = res.body;
    console.log('\n✅ Postiz Service erstellt!');
    console.log('   ID: ', svc.id);
    console.log('   URL:', svc.serviceDetails?.url || FRONTEND_URL);
  } else {
    console.error('❌ Fehler:', JSON.stringify(res.body, null, 2));
  }
}

main().catch(console.error);
