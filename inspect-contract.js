const fs = require('fs');

const files = ['index.html', 'about.html', 'contact.html', 'product-detail.html', 'products.html', 'quality.html'];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    if (/contract\s+manufacturing/i.test(line)) {
      console.log(`${file}:${i+1}: ${line.trim()}`);
    }
  });
});
