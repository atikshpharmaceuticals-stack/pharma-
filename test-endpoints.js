const http = require('http');

const pages = [
  '/',
  '/index.html',
  '/about.html',
  '/products.html',
  '/product-detail.html?id=atiksh-cv-625',
  '/therapeutic.html',
  '/quality.html',
  '/contact.html',
  '/admin.html'
];

async function checkPages() {
  console.log('Testing Atiksh Pharma Pages:');
  for (const p of pages) {
    await new Promise(resolve => {
      http.get('http://localhost:3000' + p, res => {
        console.log(`[HTTP ${res.statusCode}] ${p}`);
        resolve();
      }).on('error', err => {
        console.log(`[ERROR] ${p} - ${err.message}`);
        resolve();
      });
    });
  }
}

checkPages();
