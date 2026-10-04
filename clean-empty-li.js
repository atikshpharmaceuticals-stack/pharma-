const fs = require('fs');

const htmlFiles = [
  'index.html',
  'about.html',
  'products.html',
  'product-detail.html',
  'contact.html'
];

htmlFiles.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  // Remove empty <li></li> or <li>\s*</li>
  content = content.replace(/<li>\s*<\/li>\s*/gi, '');

  fs.writeFileSync(file, content, 'utf8');
  console.log(`Cleaned empty li tags in ${file}`);
});
