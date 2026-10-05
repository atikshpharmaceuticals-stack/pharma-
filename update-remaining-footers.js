const fs = require('fs');

const pages = ['about.html', 'quality.html', 'contact.html'];

pages.forEach(file => {
  if (!fs.existsSync(file)) return;
  let html = fs.readFileSync(file, 'utf8');

  // Replace footer icon+text with logo
  const oldFooterBlock = /<div class="flex items-center gap-3">\s*<div class="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white font-bold">\s*<i data-lucide="activity" class="w-5 h-5"><\/i>\s*<\/div>\s*<span class="text-xl font-black tracking-tight text-white font-brand">\s*ATIKSH[\s\S]*?<\/span>\s*<\/div>/;

  const newFooterLogo = `<a href="index.html" class="inline-block bg-white px-3.5 py-2 rounded-2xl shadow-xs hover:opacity-95 transition-opacity">
            <img src="images/logo.png" alt="Atiksh Pharma" class="h-8 sm:h-9 w-auto object-contain">
          </a>`;

  if (oldFooterBlock.test(html)) {
    html = html.replace(oldFooterBlock, newFooterLogo);
    fs.writeFileSync(file, html, 'utf8');
    console.log(`Updated footer logo in ${file}`);
  } else {
    console.warn(`Footer block not matched in ${file}`);
  }
});
