/**
 * Custom Vercel Deployer via Vercel REST API v13
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const VERCEL_TOKEN = 'vck_5Lu9GJ6oH61xAzly08HBt4zVUGq42ZlxPhdq0z10IGaxujgPUP35bxaV';
const rootDir = path.join(__dirname, '..');

// Helper to collect all deployment files
function getFiles(dir, base = '') {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    if (file === 'node_modules' || file === '.git' || file === 'scratch') return;
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    const relPath = base ? `${base}/${file}` : file;
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(filePath, relPath));
    } else {
      results.push({
        file: relPath,
        data: fs.readFileSync(filePath, 'utf-8')
      });
    }
  });
  return results;
}

async function deploy() {
  console.log('🚀 Deploye Kontenlage zu Vercel über REST API...');
  const files = getFiles(rootDir);
  console.log(`📦 Gefundene Dateien zum Upload: ${files.length}`);

  const payload = JSON.stringify({
    name: 'kontenlage-finanzbildung',
    project: 'kontenlage-finanzbildung',
    files: files.map(f => ({
      file: f.file,
      data: f.data
    })),
    target: 'production'
  });

  const req = https.request({
    hostname: 'api.vercel.com',
    path: '/v13/deployments',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${VERCEL_TOKEN}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    }
  }, res => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        if (json.url) {
          console.log('\n========================================');
          console.log(`🎉 DEPLOYMENT ERFOLGREICH!`);
          console.log(`🌐 Live URL: https://${json.url}`);
          if (json.alias && json.alias.length) {
            console.log(`🔗 Primary Alias: https://${json.alias[0]}`);
          }
          console.log('========================================\n');
        } else {
          console.error('❌ Vercel Deployment Fehler:', json);
        }
      } catch (e) {
        console.error('❌ Parsing Error:', e, data);
      }
    });
  });

  req.on('error', err => {
    console.error('❌ Request Error:', err);
  });

  req.write(payload);
  req.end();
}

deploy();
