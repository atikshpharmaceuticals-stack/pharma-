const fs = require('fs');

const htmlFiles = [
  'index.html',
  'about.html',
  'products.html',
  'product-detail.html',
  'contact.html',
  'rnd.html',
  'careers.html'
];

htmlFiles.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  // Replace quality.html in desktop nav
  // Cases:
  // <a href="quality.html" class="nav-link...">Quality</a>
  // <a href="quality.html#compliance" class="nav-link...">Certifications</a>
  // In footer:
  // <li><a href="quality.html"...>Quality &amp; Standards</a></li>
  // <li><a href="quality.html#compliance"...>Certifications</a></li>
  // In mobile menu:
  // <a href="quality.html" class="block py-2 px-3 text-slate-700 hover:bg-slate-50 rounded-lg">Quality &amp; Compliance</a>

  // Remove individual desktop nav items for quality
  content = content.replace(/<a\s+href="quality\.html"[^>]*>Quality<\/a>\s*/gi, '');
  content = content.replace(/<a\s+href="quality\.html#compliance"[^>]*>Certifications<\/a>\s*/gi, '');
  content = content.replace(/<a\s+href="quality\.html"[^>]*>Quality\s*(&amp;|&)?\s*Compliance<\/a>\s*/gi, '');
  
  // Remove mobile menu links
  content = content.replace(/<a\s+href="quality\.html"[^>]*>.*?<\/a>\s*/gi, '');
  content = content.replace(/<a\s+href="quality\.html#compliance"[^>]*>.*?<\/a>\s*/gi, '');

  // Remove footer list items
  content = content.replace(/<li>\s*<a\s+href="quality\.html[^"]*"[^>]*>.*?<\/a>\s*<\/li>\s*/gi, '');

  // Any remaining generic references to quality.html href
  content = content.replace(/href="quality\.html(#\w+)?"/gi, 'href="about.html"');

  fs.writeFileSync(file, content, 'utf8');
  console.log(`Cleaned references in ${file}`);
});
