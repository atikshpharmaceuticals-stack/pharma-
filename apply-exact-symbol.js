const fs = require('fs');

const pages = [
  'index.html',
  'about.html',
  'products.html',
  'product-detail.html',
  'quality.html',
  'contact.html'
];

const newNavLogo = `<!-- Logo -->
        <a href="index.html" class="flex items-center gap-3 group py-1">
          <img src="images/symbol.png" alt="Atiksh Pharma" class="h-10 sm:h-12 w-auto object-contain group-hover:scale-105 transition-transform shrink-0">
          <div class="flex flex-col justify-center leading-[1.02]">
            <span class="text-2xl sm:text-[25px] font-black tracking-tight font-brand" style="color: #0A192F;">Atiksh</span>
            <span class="text-2xl sm:text-[25px] font-black tracking-tight font-brand" style="color: #0D9488;">Pharma</span>
          </div>
        </a>`;

const newFooterLogo = `<!-- Company Info -->
        <div class="lg:col-span-2 space-y-4">
          <a href="index.html" class="flex items-center gap-3 group">
            <img src="images/symbol-light.png" alt="Atiksh Pharma" class="h-10 sm:h-11 w-auto object-contain shrink-0">
            <div class="flex flex-col justify-center leading-[1.02]">
              <span class="text-2xl sm:text-[25px] font-black tracking-tight text-white font-brand">Atiksh</span>
              <span class="text-2xl sm:text-[25px] font-black tracking-tight text-teal-400 font-brand">Pharma</span>
            </div>
          </a>`;

pages.forEach(file => {
  if (!fs.existsSync(file)) return;
  let html = fs.readFileSync(file, 'utf8');

  // Replace header logo
  const headerRegex = /<!-- Logo -->\s*<a href="index\.html"[^>]*>[\s\S]*?<\/a>/;
  if (headerRegex.test(html)) {
    html = html.replace(headerRegex, newNavLogo);
    console.log(`Updated header brand in ${file}`);
  }

  // Replace footer brand
  const footerRegex = /<!-- Company Info -->\s*<div class="lg:col-span-2 space-y-4">[\s\S]*?(?=<p class="text-xs text-slate-400)/;
  if (footerRegex.test(html)) {
    html = html.replace(footerRegex, newFooterLogo + '\n          ');
    console.log(`Updated footer brand in ${file}`);
  }

  fs.writeFileSync(file, html, 'utf8');
});

// Update index.html hero card
if (fs.existsSync('index.html')) {
  let indexHtml = fs.readFileSync('index.html', 'utf8');
  const heroCardRegex = /<div class="w-full py-8 px-6 rounded-2xl bg-slate-50\/80 border border-slate-100 flex items-center justify-center[\s\S]*?<\/div>\s*<\/div>/;
  const newHeroCard = `<div class="w-full py-8 px-6 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-center justify-center gap-4">
              <img src="images/symbol.png" alt="Atiksh Pharma" class="h-16 sm:h-20 w-auto object-contain drop-shadow-xs">
              <div class="flex flex-col justify-center leading-[1.02]">
                <span class="text-3xl sm:text-4xl font-black tracking-tight font-brand" style="color: #0A192F;">Atiksh</span>
                <span class="text-3xl sm:text-4xl font-black tracking-tight font-brand" style="color: #0D9488;">Pharma</span>
              </div>
            </div>`;
  if (heroCardRegex.test(indexHtml)) {
    indexHtml = indexHtml.replace(heroCardRegex, newHeroCard);
    fs.writeFileSync('index.html', indexHtml, 'utf8');
    console.log('Updated index.html hero showcase card');
  }
}

// Update admin.html
if (fs.existsSync('admin.html')) {
  let adminHtml = fs.readFileSync('admin.html', 'utf8');
  const adminHeaderRegex = /<!-- Brand Logo -->\s*<div class="flex items-center gap-3">[\s\S]*?<\/div>/;
  const newAdminHeader = `<!-- Brand Logo -->
      <div class="flex items-center gap-3">
        <a href="index.html" class="flex items-center gap-2.5 group">
          <img src="images/symbol-light.png" alt="Atiksh Pharma" class="h-8 w-auto object-contain">
          <div class="flex flex-col justify-center leading-none">
            <span class="text-lg font-black text-white font-brand">Atiksh</span>
            <span class="text-lg font-black text-teal-400 font-brand">Pharma</span>
          </div>
        </a>
        <span class="text-[10px] bg-teal-950/80 text-teal-300 border border-teal-800/80 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
          Admin Portal
        </span>
      </div>`;
  if (adminHeaderRegex.test(adminHtml)) {
    adminHtml = adminHtml.replace(adminHeaderRegex, newAdminHeader);
    fs.writeFileSync('admin.html', adminHtml, 'utf8');
    console.log('Updated admin.html logo');
  }
}
