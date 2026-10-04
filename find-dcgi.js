const fs = require('fs');

const files = [
  'index.html',
  'about.html',
  'products.html',
  'product-detail.html',
  'quality.html',
  'contact.html',
  'admin.html',
  'js/products-data.js',
  'js/main.js',
  'js/admin.js'
];

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  const content = fs.readFileSync(f, 'utf8');
  const matches = content.match(/dcgi/gi);
  if (matches) {
    console.log(`${f}: found ${matches.length} matches`);
  }
});
