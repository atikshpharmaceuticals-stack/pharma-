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

console.log('--- SEARCHING FOR "PARTNER" ---');
files.forEach(f => {
  if (!fs.existsSync(f)) return;
  const content = fs.readFileSync(f, 'utf8');
  const matches = content.match(/partner[a-z\s]*/gi);
  if (matches) {
    console.log(`${f}: ${matches.length} matches`);
    matches.slice(0, 5).forEach(m => console.log('   -> ' + m.trim()));
  }
});

console.log('\n--- SEARCHING FOR "3RD PARTY / THIRD PARTY" ---');
files.forEach(f => {
  if (!fs.existsSync(f)) return;
  const content = fs.readFileSync(f, 'utf8');
  const matches = content.match(/(?:3rd|third)[-\s]?party[a-z\s]*/gi);
  if (matches) {
    console.log(`${f}: ${matches.length} matches`);
    matches.slice(0, 5).forEach(m => console.log('   -> ' + m.trim()));
  }
});
