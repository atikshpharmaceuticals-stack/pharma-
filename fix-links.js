const fs = require('fs');

// Fix products.html
let c = fs.readFileSync('products.html', 'utf8');
c = c.split('company-profile.html').join('about.html');
c = c.split('manufacturing.html').join('services.html');
c = c.split('product-list.pdf').join('products.html');
c = c.split('/admin').join('admin.html');
c = c.split('919999999999').join('919876543210');
c = c.split('+91 99999 99999').join('+91 98765 43210');
c = c.split('WHO-GMP').join('DCGI');
c = c.split('123 Pharma Industrial Area, New Delhi – 110001, India').join('Sector 62, Industrial Area, New Delhi / NCR, India');
c = c.split('Delivering WHO-GMP certified').join('Delivering DCGI approved');
c = c.split('Delivering DCGI approved DCGI approved').join('Delivering DCGI approved');
fs.writeFileSync('products.html', c, 'utf8');
console.log('products.html fixed!');
