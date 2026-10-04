const fs = require('fs');

const files = [
  'index.html',
  'about.html',
  'products.html',
  'rnd.html',
  'quality.html',
  'contact.html',
  'careers.html',
  'product-detail.html',
  'js/main.js',
  'js/admin.js',
  'js/data.js'
];

const patterns = [
  { name: 'partner with', rx: /partner\s+with/gi },
  { name: 'become a partner', rx: /become\s+a\s+partner/gi },
  { name: '3rd party', rx: /3rd\s*party/gi },
  { name: 'third party', rx: /third[\s-]party/gi },
  { name: 'dcgi', rx: /dcgi/gi }
];

let totalHits = 0;

files.forEach(file => {
  if (fs.existsSync(file)) {
    const text = fs.readFileSync(file, 'utf8');
    patterns.forEach(p => {
      const matches = text.match(p.rx);
      if (matches) {
        console.log(`[ALERT] In ${file}: found ${matches.length} instance(s) matching "${p.name}":`, matches);
        totalHits += matches.length;
      }
    });
  }
});

if (totalHits === 0) {
  console.log('SUCCESS: All audited files are completely clear of prohibited phrases!');
} else {
  console.log(`Found total ${totalHits} occurrences to review.`);
}
