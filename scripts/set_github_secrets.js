/**
 * Automatisches Setzen von GitHub Actions Secrets
 */

const https = require('https');
const sodium = require('tweetsodium');

const GITHUB_TOKEN = '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';
const OWNER = 'i94350659-Kontenlage';
const REPO = 'kontenlage-finanzbildung';

const secretsToSet = {
  SUPABASE_URL: 'https://acgfcjcikjlrlfilqdyk.supabase.co',
  SUPABASE_SERVICE_KEY: 'sb_secret_6NYQMqxr7BtjL0tHMGjtsQ_LYjxBDvY'
};

function githubRequest(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.github.com',
      path,
      method,
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'User-Agent': 'Node.js',
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: data ? JSON.parse(data) : null });
        } catch (e) {
          resolve({ status: res.statusCode, data });
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function main() {
  console.log('🔑 Hole GitHub Public Key für Repository Secrets...');
  const keyRes = await githubRequest(`/repos/${OWNER}/${REPO}/actions/secrets/public-key`);
  if (keyRes.status !== 200) {
    console.error('❌ Fehler beim Abrufen des Public Keys:', keyRes.data);
    return;
  }

  const { key, key_id } = keyRes.data;
  console.log(`✅ Public Key empfangen (Key ID: ${key_id})`);

  for (const [secretName, secretValue] of Object.entries(secretsToSet)) {
    const messageBytes = Buffer.from(secretValue);
    const keyBytes = Buffer.from(key, 'base64');
    const encryptedBytes = sodium.seal(messageBytes, keyBytes);
    const encryptedValue = Buffer.from(encryptedBytes).toString('base64');

    const putRes = await githubRequest(`/repos/${OWNER}/${REPO}/actions/secrets/${secretName}`, 'PUT', {
      encrypted_value: encryptedValue,
      key_id
    });

    if (putRes.status === 201 || putRes.status === 204) {
      console.log(`✅ Secret '${secretName}' erfolgreich in GitHub Actions hinterlegt!`);
    } else {
      console.error(`❌ Fehler beim Setzen von '${secretName}':`, putRes.data);
    }
  }
}

main().catch(console.error);
