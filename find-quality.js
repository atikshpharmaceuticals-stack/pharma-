const fs = require('fs');

const files = fs.readdirSync('.').filter(f => (f.endsWith('.html') || f.endsWith('.js')) && f !== 'remove-quality.js');

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  if (content.includes('quality.html')) {
    console.log(`Found quality.html in: ${f}`);
  }
});
