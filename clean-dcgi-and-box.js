const fs = require('fs');

// 1. Process index.html: remove hero box and replace DCGI
if (fs.existsSync('index.html')) {
  let indexHtml = fs.readFileSync('index.html', 'utf8');

  // Remove the hero grid box completely
  const heroGridRegex = /<div class="grid lg:grid-cols-12 gap-12 items-center">[\s\S]*?<div class="lg:col-span-7 space-y-6">([\s\S]*?)<\/div>\s*<div class="lg:col-span-5">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;

  if (heroGridRegex.test(indexHtml)) {
    indexHtml = indexHtml.replace(heroGridRegex, `<div class="max-w-4xl mx-auto sm:mx-0 space-y-6">$1</div>`);
    console.log('Removed hero box from index.html and expanded hero content');
  } else {
    console.warn('Hero grid regex not matched in index.html');
  }

  // Replace hero trust metric DCGI
  indexHtml = indexHtml.replace(
    /<div class="text-3xl sm:text-4xl font-black font-brand" style="color:#0D9488;">DCGI<\/div>\s*<div class="text-xs text-slate-600 font-bold mt-1">Compliance Formulations<\/div>/g,
    `<div class="text-3xl sm:text-4xl font-black font-brand" style="color:#0D9488;">Quality</div>\n          <div class="text-xs text-slate-600 font-bold mt-1">Batch Tested Purity</div>`
  );

  // Replace regulatory card DCGI
  indexHtml = indexHtml.replace(/DCGI standards,\s*/gi, '');

  fs.writeFileSync('index.html', indexHtml, 'utf8');
}

// 2. Remove DCGI references across all files
const allFiles = [
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

allFiles.forEach(file => {
  if (!fs.existsSync(file)) return;
  let text = fs.readFileSync(file, 'utf8');

  // Replace specific phrases
  text = text.replace(/DCGI Approved •\s*/gi, '');
  text = text.replace(/•\s*DCGI Approved Formulations/gi, '• Certified Pharmaceutical Formulations');
  text = text.replace(/DCGI Approved Formulations/gi, 'Certified Quality Formulations');
  text = text.replace(/DCGI-approved formulations/gi, 'certified pharmaceutical formulations');
  text = text.replace(/DCGI-approved/gi, 'certified');
  text = text.replace(/DCGI Approved/gi, 'Quality Certified');
  text = text.replace(/DCGI guidelines/gi, 'Pharmacopoeial guidelines');
  text = text.replace(/DCGI standards/gi, 'statutory pharmacopoeial standards');
  text = text.replace(/DCGI Compliance Formulations/gi, 'High Purity Formulations');
  text = text.replace(/DCGI\s*/g, '');

  fs.writeFileSync(file, text, 'utf8');
  console.log(`Cleaned DCGI references from ${file}`);
});
