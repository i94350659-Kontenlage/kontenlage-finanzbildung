/**
 * Postiz Bridge for Scratch'n'Travel & Kontenlage
 * Automatically publishes or schedules social posts via Postiz API (app.postiz.com)
 */

const https = require('https');

const POSTIZ_API_URL = process.env.POSTIZ_API_URL || 'https://app.postiz.com';
const POSTIZ_API_KEY = process.env.POSTIZ_API_KEY || '';

async function schedulePostizPost({ channelId, content, mediaUrls = [], scheduleDate = null }) {
  if (!POSTIZ_API_KEY) {
    console.log('⚠️ Postiz API Key nicht hinterlegt. Post im Entwurfs-Modus gespeichert.');
    return { skipped: true, reason: 'Missing POSTIZ_API_KEY' };
  }

  const payload = {
    channelId,
    content,
    media: mediaUrls,
    scheduledAt: scheduleDate ? new Date(scheduleDate).toISOString() : null,
    publishNow: !scheduleDate
  };

  return new Promise((resolve, reject) => {
    const url = new URL(`${POSTIZ_API_URL}/api/v1/posts`);
    const dataStr = JSON.stringify(payload);

    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${POSTIZ_API_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(dataStr)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ success: true, post: json });
          } else {
            resolve({ error: true, status: res.statusCode, details: json });
          }
        } catch (e) {
          resolve({ error: true, status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', err => resolve({ error: true, message: err.message }));
    req.write(dataStr);
    req.end();
  });
}

module.exports = { schedulePostizPost };
