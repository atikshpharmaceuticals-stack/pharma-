const fs = require('fs');

const pages = [
  'index.html',
  'about.html',
  'products.html',
  'product-detail.html',
  'quality.html',
  'contact.html'
];

const oldHeaderRegex = /<!-- Logo -->\s*<a href="index\.html" class="flex items-center gap-3 group">[\s\S]*?<\/a>/;

const newHeaderLogo = `<!-- Logo -->
        <a href="index.html" class="flex items-center group py-1">
          <img src="images/logo.png" alt="Atiksh Pharma" class="h-10 sm:h-12 w-auto object-contain group-hover:opacity-90 transition-opacity">
        </a>`;

const oldFooterRegex = /<!-- Company Info -->\s*<div class="lg:col-span-2 space-y-4">\s*<div class="flex items-center gap-3">[\s\S]*?<\/div>/;

const newFooterLogo = `<!-- Company Info -->
        <div class="lg:col-span-2 space-y-4">
          <a href="index.html" class="inline-block bg-white px-3.5 py-2 rounded-2xl shadow-xs hover:opacity-95 transition-opacity">
            <img src="images/logo.png" alt="Atiksh Pharma" class="h-8 sm:h-9 w-auto object-contain">
          </a>`;

pages.forEach(file => {
  if (!fs.existsSync(file)) return;
  let html = fs.readFileSync(file, 'utf8');
  
  if (oldHeaderRegex.test(html)) {
    html = html.replace(oldHeaderRegex, newHeaderLogo);
    console.log(`Updated header logo in ${file}`);
  } else {
    console.warn(`Header logo regex not matched in ${file}`);
  }

  if (oldFooterRegex.test(html)) {
    html = html.replace(oldFooterRegex, newFooterLogo);
    console.log(`Updated footer logo in ${file}`);
  } else {
    console.warn(`Footer logo regex not matched in ${file}`);
  }

  fs.writeFileSync(file, html, 'utf8');
});

// Update admin.html specifically
if (fs.existsSync('admin.html')) {
  let adminHtml = fs.readFileSync('admin.html', 'utf8');
  const oldAdminLogoRegex = /<!-- Brand Logo -->\s*<div class="flex items-center gap-3">[\s\S]*?<\/div>\s*<\/div>/;
  const newAdminLogo = `<!-- Brand Logo -->
      <div class="flex items-center gap-3">
        <a href="index.html" class="bg-white px-3 py-1.5 rounded-xl inline-block shadow-xs hover:opacity-90 transition-opacity">
          <img src="images/logo.png" alt="Atiksh Pharma" class="h-7 sm:h-8 w-auto object-contain">
        </a>
        <span class="text-[10px] bg-teal-950/80 text-teal-300 border border-teal-800/80 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
          Admin Portal
        </span>
      </div>`;
  
  if (oldAdminLogoRegex.test(adminHtml)) {
    adminHtml = adminHtml.replace(oldAdminLogoRegex, newAdminLogo);
    fs.writeFileSync('admin.html', adminHtml, 'utf8');
    console.log('Updated logo in admin.html');
  } else {
    console.warn('Admin logo regex not matched');
  }
}
