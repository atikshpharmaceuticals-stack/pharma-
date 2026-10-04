const fs = require('fs');
const path = require('path');

const files = [
  'index.html',
  'about.html',
  'contact.html',
  'products.html',
  'product-detail.html',
  'services.html',
  'admin.html'
];

files.forEach(f => {
  const p = path.join(__dirname, f);
  if (!fs.existsSync(p)) return;

  let html = fs.readFileSync(p, 'utf8');
  if (html.includes('js/api-client.js')) {
    console.log(f, 'already contains api-client.js');
    return;
  }

  if (html.includes('<script src="js/site-config.js"></script>')) {
    html = html.replace(
      '<script src="js/site-config.js"></script>',
      '<script src="js/api-client.js"></script>\n  <script src="js/site-config.js"></script>'
    );
  } else if (html.includes('<script src="js/main.js"></script>')) {
    html = html.replace(
      '<script src="js/main.js"></script>',
      '<script src="js/api-client.js"></script>\n  <script src="js/main.js"></script>'
    );
  }

  fs.writeFileSync(p, html, 'utf8');
  console.log(f, 'successfully injected api-client.js');
});
