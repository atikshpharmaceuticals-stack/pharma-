const http = require('http');

const endpoints = [
  '/',
  '/index.html',
  '/products.html',
  '/about.html',
  '/quality.html',
  '/contact.html',
  '/admin.html',
  '/images/symbol.png',
  '/images/symbol-light.png'
];

async function run() {
  for (const ep of endpoints) {
    await new Promise(res => {
      http.get('http://localhost:3000' + ep, r => {
        console.log(`[HTTP ${r.statusCode}] ${ep}`);
        res();
      }).on('error', e => {
        console.log(`[ERROR] ${ep}: ${e.message}`);
        res();
      });
    });
  }
}

run();
