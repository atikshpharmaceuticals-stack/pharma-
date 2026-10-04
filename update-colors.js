const fs = require('fs');
const path = require('path');

const dir = 'C:\\Users\\WIN--11\\.gemini\\antigravity\\scratch\\atiksh-pharma';
const files = ['index.html', 'about.html', 'products.html', 'services.html', 'contact.html', 'admin.html', 'css/style.css'];

// Replace the entire olive palette block in HTML files with shades based on #636b2f
const oliveBlockRegex = /olive:\s*\{[^}]+\}/g;

const newPalette = `olive: {
              50: '#f4f5e8',
              100: '#e5e8c8',
              200: '#cdd294',
              300: '#b0b85e',
              400: '#919838',
              500: '#757d25',
              600: '#636b2f',
              700: '#4d521f',
              800: '#3a3e17',
              900: '#282b0f',
              950: '#161806',
            }`;

// All emerald/olive hex values → #636b2f scale
const replacements = [
  // Emerald greens → #636b2f shades
  ['#ECFDF5', '#f4f5e8'],
  ['#D1FAE5', '#e5e8c8'],
  ['#A7F3D0', '#cdd294'],
  ['#6EE7B7', '#b0b85e'],
  ['#34D399', '#919838'],
  ['#10B981', '#757d25'],
  ['#059669', '#636b2f'],
  ['#047857', '#4d521f'],
  ['#065F46', '#3a3e17'],
  ['#064E3B', '#282b0f'],
  ['#022c22', '#161806'],
  // Hero/bg gradients
  ['#052E1C', '#1e2108'],
  ['#020C08', '#0d0e04'],
  // rgba emerald in CSS
  ['rgba(16, 185, 129', 'rgba(99, 107, 47'],
  ['rgba(6, 95, 70', 'rgba(58, 62, 23'],
  ['rgba(52, 211, 153', 'rgba(145, 152, 56'],
  ['rgba(5, 150, 105', 'rgba(77, 82, 31'],
  ['rgba(6, 78, 59', 'rgba(40, 43, 15'],
];

files.forEach(file => {
  const fp = path.join(dir, file);
  if (!fs.existsSync(fp)) { console.log('NOT FOUND:', file); return; }
  let c = fs.readFileSync(fp, 'utf8');

  // Replace olive palette block (only in HTML files)
  if (file.endsWith('.html')) {
    c = c.replace(oliveBlockRegex, newPalette);
  }

  // Replace all hex & rgba values
  replacements.forEach(([from, to]) => {
    c = c.split(from).join(to);
  });

  fs.writeFileSync(fp, c, 'utf8');
  console.log('Updated:', file);
});

console.log('Done! All colors replaced with #636b2f palette.');
