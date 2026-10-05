const fs = require('fs');
const path = require('path');

const src = 'C:/Users/WIN--11/.gemini/antigravity/brain/e86e433f-c38e-4133-9474-4cbb0e74db4d/.user_uploaded/media_1791116341924.png';
const dest = path.join(__dirname, 'images', 'logo.png');

if (!fs.existsSync(path.join(__dirname, 'images'))) {
  fs.mkdirSync(path.join(__dirname, 'images'));
}

fs.copyFileSync(src, dest);
console.log('Logo copied successfully! Size:', fs.statSync(dest).size, 'bytes');
