const fs = require('fs');

const files = [
  'about.html',
  'products.html',
  'product-detail.html',
  'therapeutic.html',
  'quality.html',
  'contact.html',
  'admin.html'
];

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  let content = fs.readFileSync(f, 'utf8');

  // Standardize navbar logo
  content = content.replace(/ATIKSH\s*<span[^>]*>PHARMA<\/span>/g, 'ATIKSH <span class="font-extrabold" style="color:#0D9488;">PHARMA</span>');

  // Standardize footer logo
  content = content.replace(/ATIKSH\s*<span class="text-teal-400">PHARMA<\/span>/g, 'ATIKSH <span class="font-extrabold" style="color:#2DD4BF;">PHARMA</span>');

  fs.writeFileSync(f, content, 'utf8');
  console.log(`Updated brand colors in ${f}`);
});
