const fs = require('fs');

const files = [
  'about.html',
  'product-detail.html',
  'quality.html',
  'contact.html',
  'admin.html'
];

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  let content = fs.readFileSync(f, 'utf8');

  // Remove nav-link to therapeutic.html
  content = content.replace(/<a href="therapeutic\.html"[^>]*>Therapeutic Areas<\/a>/g, '');
  content = content.replace(/<a href="therapeutic\.html"[^>]*>Therapeutics<\/a>/g, '');

  // In footer replace "Therapeutics" heading and links with "Product Categories"
  content = content.replace(/<h4 class="text-white font-bold text-xs uppercase tracking-wider mb-4">Therapeutics<\/h4>[\s\S]*?<\/ul>/g, `<h4 class="text-white font-bold text-xs uppercase tracking-wider mb-4">Product Categories</h4>
          <ul class="space-y-2.5">
            <li><a href="products.html?category=tablet" class="hover:text-teal-300 transition-colors">Tablets</a></li>
            <li><a href="products.html?category=capsule" class="hover:text-teal-300 transition-colors">Capsules</a></li>
            <li><a href="products.html?category=syrup" class="hover:text-teal-300 transition-colors">Syrups &amp; Liquids</a></li>
            <li><a href="products.html?category=inject" class="hover:text-teal-300 transition-colors">Injections</a></li>
            <li><a href="products.html?category=derma" class="hover:text-teal-300 transition-colors">Ointments &amp; Creams</a></li>
            <li><a href="products.html?category=nutra" class="hover:text-teal-300 transition-colors">Nutraceuticals</a></li>
          </ul>`);

  // Remove therapeutic link in quick links if present
  content = content.replace(/<li><a href="therapeutic\.html"[^>]*>Therapeutic Areas<\/a><\/li>/g, '');

  fs.writeFileSync(f, content, 'utf8');
  console.log(`Cleaned therapeutic areas from ${f}`);
});
