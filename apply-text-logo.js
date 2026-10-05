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
        <a href="index.html" class="flex items-center gap-3.5 group py-1">
          <div class="w-11 h-11 sm:w-12 sm:h-12 shrink-0">
            <svg class="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="navLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#0A192F" />
                  <stop offset="50%" stop-color="#0E4B6E" />
                  <stop offset="100%" stop-color="#0D9488" />
                </linearGradient>
              </defs>
              <path d="M10 40H30V15H70C86 15 95 26 95 42C95 58 86 68 70 68H50V90H30V68H10V40Z M50 35V48H68C76 48 80 44 80 42C80 39 76 35 68 35H50Z" fill="url(#navLogoGrad)" fill-rule="evenodd" />
            </svg>
          </div>
          <div class="flex flex-col justify-center leading-[1.02]">
            <span class="text-2xl sm:text-[25px] font-black tracking-tight font-brand group-hover:opacity-90 transition-opacity" style="color: #0A192F;">Atiksh</span>
            <span class="text-2xl sm:text-[25px] font-black tracking-tight font-brand group-hover:opacity-90 transition-opacity" style="color: #0D9488;">Pharma</span>
          </div>
        </a>`;

const newFooterLogo = `<!-- Company Info -->
        <div class="lg:col-span-2 space-y-4">
          <a href="index.html" class="flex items-center gap-3.5 group">
            <div class="w-10 h-10 sm:w-11 sm:h-11 shrink-0">
              <svg class="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="footerLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#38BDF8" />
                    <stop offset="100%" stop-color="#2DD4BF" />
                  </linearGradient>
                </defs>
                <path d="M10 40H30V15H70C86 15 95 26 95 42C95 58 86 68 70 68H50V90H30V68H10V40Z M50 35V48H68C76 48 80 44 80 42C80 39 76 35 68 35H50Z" fill="url(#footerLogoGrad)" fill-rule="evenodd" />
              </svg>
            </div>
            <div class="flex flex-col justify-center leading-[1.02]">
              <span class="text-2xl sm:text-[25px] font-black tracking-tight text-white font-brand">Atiksh</span>
              <span class="text-2xl sm:text-[25px] font-black tracking-tight text-teal-400 font-brand">Pharma</span>
            </div>
          </a>`;

pages.forEach(file => {
  if (!fs.existsSync(file)) return;
  let html = fs.readFileSync(file, 'utf8');

  // Replace header logo (whether it was img or previous div)
  const headerRegex = /<!-- Logo -->\s*<a href="index\.html"[^>]*>[\s\S]*?<\/a>/;
  if (headerRegex.test(html)) {
    html = html.replace(headerRegex, newNavLogo);
    console.log(`Updated header brand in ${file}`);
  } else {
    console.warn(`Header regex not found in ${file}`);
  }

  // Replace footer brand
  const footerRegex = /<!-- Company Info -->\s*<div class="lg:col-span-2 space-y-4">[\s\S]*?(?=<p class="text-xs text-slate-400)/;
  if (footerRegex.test(html)) {
    html = html.replace(footerRegex, newFooterLogo + '\n          ');
    console.log(`Updated footer brand in ${file}`);
  } else {
    // Alternate match without comment
    const altFooterRegex = /<div class="lg:col-span-2 space-y-4">\s*<a href="index\.html"[\s\S]*?<\/a>/;
    if (altFooterRegex.test(html)) {
      html = html.replace(altFooterRegex, newFooterLogo);
      console.log(`Updated alt footer brand in ${file}`);
    } else {
      console.warn(`Footer regex not found in ${file}`);
    }
  }

  fs.writeFileSync(file, html, 'utf8');
});

// Update index.html hero card to use the vector logo component as well
if (fs.existsSync('index.html')) {
  let indexHtml = fs.readFileSync('index.html', 'utf8');
  const heroCardRegex = /<div class="w-full py-8 px-6 rounded-2xl bg-slate-50\/80 border border-slate-100 flex items-center justify-center">[\s\S]*?<\/div>/;
  const newHeroCard = `<div class="w-full py-8 px-6 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-center justify-center gap-4">
              <div class="w-14 h-14 sm:w-16 sm:h-16 shrink-0">
                <svg class="w-full h-full" viewBox="0 0 100 100" fill="none">
                  <defs>
                    <linearGradient id="heroLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stop-color="#0A192F" />
                      <stop offset="50%" stop-color="#0E4B6E" />
                      <stop offset="100%" stop-color="#0D9488" />
                    </linearGradient>
                  </defs>
                  <path d="M10 40H30V15H70C86 15 95 26 95 42C95 58 86 68 70 68H50V90H30V68H10V40Z M50 35V48H68C76 48 80 44 80 42C80 39 76 35 68 35H50Z" fill="url(#heroLogoGrad)" fill-rule="evenodd" />
                </svg>
              </div>
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
          <div class="w-8 h-8 shrink-0">
            <svg class="w-full h-full" viewBox="0 0 100 100" fill="none">
              <defs>
                <linearGradient id="adminLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#38BDF8" />
                  <stop offset="100%" stop-color="#2DD4BF" />
                </linearGradient>
              </defs>
              <path d="M10 40H30V15H70C86 15 95 26 95 42C95 58 86 68 70 68H50V90H30V68H10V40Z M50 35V48H68C76 48 80 44 80 42C80 39 76 35 68 35H50Z" fill="url(#adminLogoGrad)" fill-rule="evenodd" />
            </svg>
          </div>
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
