const fs = require('fs');

const files = ['index.html', 'about.html', 'contact.html', 'product-detail.html', 'products.html', 'quality.html'];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    if (/third[-\s]?party|3rd[-\s]?party/i.test(line) || /partner\s+with/i.test(line) || /become\s+a\s+partner/i.test(line)) {
      console.log(`${file}:${i+1}: ${line.trim()}`);
    }
  });
});
