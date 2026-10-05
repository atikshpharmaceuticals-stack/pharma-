const fs = require('fs');

const pages = [
  'index.html',
  'about.html',
  'products.html',
  'product-detail.html',
  'contact.html'
];

const targetDesktop = '<div class="flex items-center gap-3">';
const replacementDesktop = `<div class="flex items-center gap-3">
          <!-- User Profile / Sign In Container -->
          <div id="public-nav-auth-container" class="flex items-center gap-2">
            <button type="button" onclick="event.preventDefault(); event.stopPropagation(); openVisitorAuthModal('signin');" class="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-teal-700 bg-slate-100/90 hover:bg-slate-200/80 rounded-xl transition-all border border-slate-200 cursor-pointer shadow-xs">
              <i data-lucide="user" class="w-3.5 h-3.5 text-teal-600"></i>
              <span>Sign In</span>
            </button>
          </div>`;

const targetMobile = '<div id="mobile-menu" class="hidden lg:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-2 text-sm font-semibold">';
const replacementMobile = `<div id="mobile-menu" class="hidden lg:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-2 text-sm font-semibold">
      <!-- Mobile Auth Container -->
      <div id="mobile-nav-auth-container" class="pb-2 mb-2 border-b border-slate-100">
        <button type="button" onclick="event.preventDefault(); event.stopPropagation(); openVisitorAuthModal('signin');" class="w-full py-2.5 px-3 text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl flex items-center justify-center gap-2 transition-colors">
          <i data-lucide="user" class="w-3.5 h-3.5 text-teal-600"></i>
          <span>Sign In / Create Account</span>
        </button>
      </div>`;

pages.forEach(p => {
  if (!fs.existsSync(p)) return;
  let html = fs.readFileSync(p, 'utf8');

  // Replace desktop
  if (html.includes(targetDesktop) && !html.includes('id="public-nav-auth-container"')) {
    html = html.replace(targetDesktop, replacementDesktop);
  }

  // Replace mobile
  if (html.includes(targetMobile) && !html.includes('id="mobile-nav-auth-container"')) {
    html = html.replace(targetMobile, replacementMobile);
  }

  fs.writeFileSync(p, html, 'utf8');
  console.log(`Updated header and mobile drawer in ${p}`);
});
