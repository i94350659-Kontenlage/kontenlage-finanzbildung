const https = require('https');

const PRINTFUL_KEY = 'J7MC8caEjrgK6IMmVOSIKNngUX6JKjWNMB2AU82b';

const options = {
  hostname: 'api.printful.com',
  path: '/stores',
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${PRINTFUL_KEY}`,
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
