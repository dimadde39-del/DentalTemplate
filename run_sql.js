const fs = require('fs');
const https = require('https');

const API_KEY = process.env.SUPABASE_ACCESS_TOKEN;
const PROJECT_REF = 'knbmutnhitqeqbejeqnd';

const sql = fs.readFileSync('c:/DentalTemplate/supabase_init.sql', 'utf8');

const options = {
  hostname: 'api.supabase.com',
  port: 443,
  path: `/v1/projects/${PROJECT_REF}/database/query`,
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json'
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Body: ${data}`);
  });
});

req.on('error', (error) => {
  console.error(error);
});

req.write(JSON.stringify({ query: sql }));
req.end();
