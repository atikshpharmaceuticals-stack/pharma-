const fs = require('fs');

const pages = [
  'index.html',
  'about.html',
  'products.html',
  'product-detail.html',
  'contact.html'
];

pages.forEach(p => {
  if (!fs.existsSync(p)) return;
  let html = fs.readFileSync(p, 'utf8');

  if (!html.includes('js/visitor-auth.js')) {
    html = html.replace(
      '<script src="js/site-renderer.js"></script>',
      '<script src="js/site-renderer.js"></script>\n  <script src="js/visitor-auth.js"></script>'
    );
    fs.writeFileSync(p, html, 'utf8');
    console.log(`Injected visitor-auth.js into ${p}`);
  }
});
