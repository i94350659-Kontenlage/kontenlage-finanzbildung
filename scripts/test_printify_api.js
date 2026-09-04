const https = require('https');

const PRINTIFY_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzN2Q0YmQzMDM1ZmUxMWU5YTgwM2FiN2VlYjNjY2M5NyIsImp0aSI6IjIyMmIyNGU1NGM5ZWIzZGI1YTVlYjc0ZGU5MmNlMjgwYmI4MThkNTI3ZmQyNGZiNjA0MWRhY2NmNGIzODY4YjgzMGUwZjRjYmQ1MDkyNWQ3IiwiaWF0IjoxNzg4Mzc3NTk3Ljc5MTIxMSwibmJmIjoxNzg4Mzc3NTk3Ljc5MTIxMywiZXhwIjoxODE5OTEzNTk3Ljc3ODgwNiwic3ViIjoiMjgyMDk2NzgiLCJzY29wZXMiOlsic2hvcHMubWFuYWdlIiwic2hvcHMucmVhZCIsImNhdGFsb2cucmVhZCIsIm9yZGVycy5yZWFkIiwib3JkZXJzLndyaXRlIiwicHJvZHVjdHMucmVhZCIsInByb2R1Y3RzLndyaXRlIiwid2ViaG9va3MucmVhZCIsIndlYmhvb2tzLndyaXRlIiwidXBsb2Fkcy5yZWFkIiwidXBsb2Fkcy53cml0ZSIsInByaW50X3Byb3ZpZGVycy5yZWFkIiwidXNlci5pbmZvIl19.Tlu99464M8EAnTNlyeK8Gne5PDFkG8p7mrPLoPtVzfINHEX6_WOKAxaGspLFSgvSVzgns-chBZ0DQztQ66doBPJiFjO-gjeNaPwUWRghLyHUmSuMCngg_v6SbzeiXc--hFl_8uRxxC5MafEo6anuYsDnYqsn65GW1M9uWMAGng6MOq27LlX9hBeCncj7UENAurHqY0f3GHyAbIZVz6lkCksu_9ahdkjP_rsXN0PhPmobAMAGs0yf1yS_f4lOt4Spwfah8983BrGdGEkUtHv7NcfIDEUMT4XwKbc_bTpDFCdgt9zRM8ZlHHHDZqBAqDuSTnWlxmodsUbIpu6xK1taA0uJkvJiDlvKyKQRVBEcTJioHZkvA10Bl61B9GYMH-ZuaSFs8eTwdjpwpZGn7v3krpHXCxxk4KNRSiK3oa_MxoAz75_hMi92GOCcTSke_K5pnLFngoV-6dS29922t58L_RclQbQgfUk04i4RYSEix7xweoijQ_2AEheJA41VeLlWt3vd17Gumhl6Z6dciH4lTy6QxqL_4ZoambFAee9myDUkrloKXkypkgWnrtefDQ9fQ72LEEC73cQMYUeDx-sFkLl0J0j0qKwOaROytYEm2szXESCIDHSuKthduuwFz3VpDV16-Y-A4A2kOPtKfZDYfLhm43co6KOXBVdqS9I8drU';

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
