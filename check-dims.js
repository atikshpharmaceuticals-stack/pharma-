const fs = require('fs');

const buf = fs.readFileSync('images/logo.png');
// PNG width is at offset 16-19, height at 20-23
const width = buf.readUInt32BE(16);
const height = buf.readUInt32BE(20);

console.log(`Logo Dimensions: ${width} x ${height} (Aspect ratio: ${(width/height).toFixed(2)})`);
