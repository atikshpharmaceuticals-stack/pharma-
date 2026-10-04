const fs = require('fs');

// 1. Update index.html
let indexHtml = fs.readFileSync('index.html', 'utf8');

// Inject site-config.js and site-renderer.js before </body>
if (!indexHtml.includes('js/site-config.js')) {
  indexHtml = indexHtml.replace(
    '<script src="js/products-data.js"></script>',
    '<script src="js/site-config.js"></script>\n  <script src="js/site-renderer.js"></script>\n  <script src="js/products-data.js"></script>'
  );
}

// Add data-site-key attributes to index.html elements
indexHtml = indexHtml.replace(
  '<span>Pan-India &amp; Global Pharmaceutical Supply</span>',
  '<span data-site-key="homeHeroBadge">Pan-India &amp; Global Pharmaceutical Supply</span>'
);

indexHtml = indexHtml.replace(
  `<h1 class="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight font-brand leading-none" style="color:#0A192F;">\n            ATIKSH <span style="color:#0D9488;">PHARMA</span>\n          </h1>`,
  `<h1 class="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight font-brand leading-none" style="color:#0A192F;">\n            <span data-site-key="homeHeroTitlePart1">ATIKSH</span> <span data-site-key="homeHeroTitlePart2" style="color:#0D9488;">PHARMA</span>\n          </h1>`
);

indexHtml = indexHtml.replace(
  `<p class="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight" style="color:#0A192F;">\n            Committed to Quality. <span style="color:#0D9488;">Driven by Healthcare.</span>\n          </p>`,
  `<p class="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight" style="color:#0A192F;">\n            <span data-site-key="homeHeroSubtitlePart1">Committed to Quality.</span> <span data-site-key="homeHeroSubtitlePart2" style="color:#0D9488;">Driven by Healthcare.</span>\n          </p>`
);

indexHtml = indexHtml.replace(
  `<p class="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">\n            Delivering reliable pharmaceutical solutions with a commitment to quality, innovation and better healthcare across essential formulations, institutional hospital supplies.\n          </p>`,
  `<p class="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal" data-site-key="homeHeroDescription">\n            Delivering reliable pharmaceutical solutions with a commitment to quality, innovation and better healthcare across essential formulations, institutional hospital supplies.\n          </p>`
);

// Metrics
indexHtml = indexHtml.replace(
  `<div class="text-3xl sm:text-4xl font-black font-brand" style="color:#0A192F;">500+</div>\n          <div class="text-xs text-slate-600 font-bold mt-1">Approved Formulations</div>`,
  `<div class="text-3xl sm:text-4xl font-black font-brand" style="color:#0A192F;" data-site-key="homeMetric1Num">500+</div>\n          <div class="text-xs text-slate-600 font-bold mt-1" data-site-key="homeMetric1Label">Approved Formulations</div>`
);

indexHtml = indexHtml.replace(
  `<div class="text-3xl sm:text-4xl font-black font-brand" style="color:#0D9488;">100%</div>\n          <div class="text-xs text-slate-600 font-bold mt-1">Quality Assurance Standards</div>`,
  `<div class="text-3xl sm:text-4xl font-black font-brand" style="color:#0D9488;" data-site-key="homeMetric2Num">100%</div>\n          <div class="text-xs text-slate-600 font-bold mt-1" data-site-key="homeMetric2Label">Quality Assurance Standards</div>`
);

indexHtml = indexHtml.replace(
  `<div class="text-3xl sm:text-4xl font-black font-brand" style="color:#0A192F;">28+</div>\n          <div class="text-xs text-slate-600 font-bold mt-1">States Distribution Reach</div>`,
  `<div class="text-3xl sm:text-4xl font-black font-brand" style="color:#0A192F;" data-site-key="homeMetric3Num">28+</div>\n          <div class="text-xs text-slate-600 font-bold mt-1" data-site-key="homeMetric3Label">States Distribution Reach</div>`
);

indexHtml = indexHtml.replace(
  `<div class="text-3xl sm:text-4xl font-black font-brand" style="color:#0D9488;">Quality</div>\n          <div class="text-xs text-slate-600 font-bold mt-1">Batch Tested Purity</div>`,
  `<div class="text-3xl sm:text-4xl font-black font-brand" style="color:#0D9488;" data-site-key="homeMetric4Num">Quality</div>\n          <div class="text-xs text-slate-600 font-bold mt-1" data-site-key="homeMetric4Label">Batch Tested Purity</div>`
);

// About Section on Index
indexHtml = indexHtml.replace(
  `<div class="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider">\n            About Our Enterprise\n          </div>`,
  `<div class="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider" data-site-key="homeAboutBadge">\n            About Our Enterprise\n          </div>`
);

indexHtml = indexHtml.replace(
  `<h2 class="text-3xl sm:text-4xl font-black tracking-tight font-brand" style="color:#0A192F;">\n            Advancing Healthcare Through Quality\n          </h2>`,
  `<h2 class="text-3xl sm:text-4xl font-black tracking-tight font-brand" style="color:#0A192F;" data-site-key="homeAboutTitle">\n            Advancing Healthcare Through Quality\n          </h2>`
);

indexHtml = indexHtml.replace(
  `<p class="text-slate-600 text-sm sm:text-base leading-relaxed">\n            Atiksh Pharma is an established pharmaceutical enterprise committed to the highest standards of scientific formulation, regulatory compliance, and reliable healthcare distribution. We collaborate with medical institutions, healthcare providers, and distributors across India.\n          </p>`,
  `<p class="text-slate-600 text-sm sm:text-base leading-relaxed" data-site-key="homeAboutParagraph1">\n            Atiksh Pharma is an established pharmaceutical enterprise committed to the highest standards of scientific formulation, regulatory compliance, and reliable healthcare distribution. We collaborate with medical institutions, healthcare providers, and distributors across India.\n          </p>`
);

indexHtml = indexHtml.replace(
  `<p class="text-slate-600 text-sm sm:text-base leading-relaxed">\n            Our portfolio spans essential formulations engineered to treat critical conditions. Every batch adheres to rigorous Quality Control and Quality Assurance protocols to ensure uncompromised therapeutic efficacy.\n          </p>`,
  `<p class="text-slate-600 text-sm sm:text-base leading-relaxed" data-site-key="homeAboutParagraph2">\n            Our portfolio spans essential formulations engineered to treat critical conditions. Every batch adheres to rigorous Quality Control and Quality Assurance protocols to ensure uncompromised therapeutic efficacy.\n          </p>`
);

// About Image
indexHtml = indexHtml.replace(
  `<img src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80" alt="Atiksh Pharma Facility" class="w-full h-96 object-cover rounded-2xl">`,
  `<img src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80" alt="Atiksh Pharma Facility" data-site-key="homeAboutImage" class="w-full h-96 object-cover rounded-2xl">`
);

indexHtml = indexHtml.replace(
  `<p class="text-xs font-bold text-teal-300 uppercase tracking-wider">Scientific Discipline</p>`,
  `<p class="text-xs font-bold text-teal-300 uppercase tracking-wider" data-site-key="homeAboutImageBadge">Scientific Discipline</p>`
);

indexHtml = indexHtml.replace(
  `<p class="text-xs text-slate-200 mt-1">Delivering clinical efficacy through certified manufacturing and stringent QA/QC oversight.</p>`,
  `<p class="text-xs text-slate-200 mt-1" data-site-key="homeAboutImageCaption">Delivering clinical efficacy through certified manufacturing and stringent QA/QC oversight.</p>`
);

// Quality section headers on index
indexHtml = indexHtml.replace(
  `<span class="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-100 px-3 py-1 rounded-md">\n          Scientific Rigor\n        </span>`,
  `<span class="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-100 px-3 py-1 rounded-md" data-site-key="homeQualityBadge">\n          Scientific Rigor\n        </span>`
);

indexHtml = indexHtml.replace(
  `<h2 class="text-3xl sm:text-4xl font-black tracking-tight font-brand mt-2" style="color:#0A192F;">\n          Quality at Every Step\n        </h2>`,
  `<h2 class="text-3xl sm:text-4xl font-black tracking-tight font-brand mt-2" style="color:#0A192F;" data-site-key="homeQualityTitle">\n          Quality at Every Step\n        </h2>`
);

indexHtml = indexHtml.replace(
  `<p class="text-slate-600 text-sm mt-2">\n          From raw active pharmaceutical ingredient (API) inspection to finished batch distribution, quality compliance is built into every phase of our operations.\n        </p>`,
  `<p class="text-slate-600 text-sm mt-2" data-site-key="homeQualityDescription">\n          From raw active pharmaceutical ingredient (API) inspection to finished batch distribution, quality compliance is built into every phase of our operations.\n        </p>`
);

// Why Choose Us
indexHtml = indexHtml.replace(
  `<span class="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-md">\n          Corporate Advantage\n        </span>`,
  `<span class="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-md" data-site-key="homeWhyBadge">\n          Corporate Advantage\n        </span>`
);

indexHtml = indexHtml.replace(
  `<h2 class="text-3xl sm:text-4xl font-black tracking-tight font-brand mt-2" style="color:#0A192F;">\n          Why Atiksh Pharma\n        </h2>`,
  `<h2 class="text-3xl sm:text-4xl font-black tracking-tight font-brand mt-2" style="color:#0A192F;" data-site-key="homeWhyTitle">\n          Why Atiksh Pharma\n        </h2>`
);

indexHtml = indexHtml.replace(
  `<p class="text-slate-600 text-sm mt-2">\n          A dedicated pharmaceutical partner delivering reliability, clinical efficacy, and collaborative commercial value.\n        </p>`,
  `<p class="text-slate-600 text-sm mt-2" data-site-key="homeWhyDescription">\n          A dedicated pharmaceutical partner delivering reliability, clinical efficacy, and collaborative commercial value.\n        </p>`
);

// Footer standards and contact
indexHtml = indexHtml.replace(
  `<p><strong>Standards:</strong> ISO 9001:2015 Standards • Certified Pharmaceutical Formulations</p>`,
  `<p><strong>Standards:</strong> <span data-site-key="footerStandards">ISO 9001:2015 Standards • Certified Pharmaceutical Formulations</span></p>`
);

indexHtml = indexHtml.replace(
  `<span class="text-slate-400">Sector 62, Industrial Area, New Delhi / NCR, India</span>`,
  `<span class="text-slate-400 site-address" data-site-key="address">Sector 62, Industrial Area, New Delhi / NCR, India</span>`
);

indexHtml = indexHtml.replace(
  `<span class="text-slate-400">+91 98765 43210</span>`,
  `<span class="text-slate-400 site-phone" data-site-key="phone">+91 98765 43210</span>`
);

indexHtml = indexHtml.replace(
  `<span class="text-slate-400">info@atikshpharma.com</span>`,
  `<span class="text-slate-400 site-email" data-site-key="email">info@atikshpharma.com</span>`
);

fs.writeFileSync('index.html', indexHtml, 'utf8');
console.log('index.html updated with data-site-key attributes');

// 2. Update about.html
let aboutHtml = fs.readFileSync('about.html', 'utf8');

if (!aboutHtml.includes('js/site-config.js')) {
  aboutHtml = aboutHtml.replace(
    '<script src="js/products-data.js"></script>',
    '<script src="js/site-config.js"></script>\n  <script src="js/site-renderer.js"></script>\n  <script src="js/products-data.js"></script>'
  );
}

aboutHtml = aboutHtml.replace(
  `<span class="text-xs font-bold uppercase tracking-wider text-teal-300 bg-white/10 px-3 py-1 rounded-md inline-block mb-3">\n          Corporate Identity &amp; Philosophy\n        </span>`,
  `<span class="text-xs font-bold uppercase tracking-wider text-teal-300 bg-white/10 px-3 py-1 rounded-md inline-block mb-3" data-site-key="aboutHeroBadge">\n          Corporate Identity &amp; Philosophy\n        </span>`
);

aboutHtml = aboutHtml.replace(
  `<h1 class="text-3xl sm:text-5xl font-black font-brand tracking-tight">\n          Advancing Healthcare Through Quality\n        </h1>`,
  `<h1 class="text-3xl sm:text-5xl font-black font-brand tracking-tight" data-site-key="aboutHeroTitle">\n          Advancing Healthcare Through Quality\n        </h1>`
);

aboutHtml = aboutHtml.replace(
  `<p class="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed">\n          Atiksh Pharma is dedicated to building trustworthy, science-led pharmaceutical relationships through uncompromising quality, dependable supply, and clinical integrity.\n        </p>`,
  `<p class="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed" data-site-key="aboutHeroDescription">\n          Atiksh Pharma is dedicated to building trustworthy, science-led pharmaceutical relationships through uncompromising quality, dependable supply, and clinical integrity.\n        </p>`
);

aboutHtml = aboutHtml.replace(
  `<span class="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-md">\n            Who We Are\n          </span>`,
  `<span class="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-md" data-site-key="aboutWhoBadge">\n            Who We Are\n          </span>`
);

aboutHtml = aboutHtml.replace(
  `<h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-brand">\n            A Committed Pharmaceutical Enterprise\n          </h2>`,
  `<h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-brand" data-site-key="aboutWhoTitle">\n            A Committed Pharmaceutical Enterprise\n          </h2>`
);

aboutHtml = aboutHtml.replace(
  `<p class="text-sm sm:text-base text-slate-600 leading-relaxed">\n            Atiksh Pharma was founded with a singular commitment: to deliver reliable, high-efficacy pharmaceutical medicines across critical therapeutic domains. We understand that healthcare providers and institutions rely on consistency, safety, and strict regulatory compliance.\n          </p>`,
  `<p class="text-sm sm:text-base text-slate-600 leading-relaxed" data-site-key="aboutWhoParagraph1">\n            Atiksh Pharma was founded with a singular commitment: to deliver reliable, high-efficacy pharmaceutical medicines across critical therapeutic domains. We understand that healthcare providers and institutions rely on consistency, safety, and strict regulatory compliance.\n          </p>`
);

aboutHtml = aboutHtml.replace(
  `<p class="text-sm sm:text-base text-slate-600 leading-relaxed">\n            Headquartered in India with a wide-ranging distribution network, Atiksh Pharma bridges patient therapeutic requirements with modern, certified manufacturing capabilities.\n          </p>`,
  `<p class="text-sm sm:text-base text-slate-600 leading-relaxed" data-site-key="aboutWhoParagraph2">\n            Headquartered in India with a wide-ranging distribution network, Atiksh Pharma bridges patient therapeutic requirements with modern, certified manufacturing capabilities.\n          </p>`
);

aboutHtml = aboutHtml.replace(
  `<img src="https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=800&auto=format&fit=crop&q=80" alt="Atiksh Pharma Corporate Laboratory" class="w-full h-96 object-cover">`,
  `<img src="https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=800&auto=format&fit=crop&q=80" alt="Atiksh Pharma Corporate Laboratory" data-site-key="aboutWhoImage" class="w-full h-96 object-cover">`
);

aboutHtml = aboutHtml.replace(
  `<h3 class="text-lg font-bold text-slate-900 mb-2">Our Mission</h3>\n            <p class="text-xs text-slate-600 leading-relaxed">\n              To enhance patient outcomes by providing consistently high-quality, scientifically validated pharmaceuticals at accessible costs across hospital, institutional, and retail channels.\n            </p>`,
  `<h3 class="text-lg font-bold text-slate-900 mb-2" data-site-key="aboutMissionTitle">Our Mission</h3>\n            <p class="text-xs text-slate-600 leading-relaxed" data-site-key="aboutMissionText">\n              To enhance patient outcomes by providing consistently high-quality, scientifically validated pharmaceuticals at accessible costs across hospital, institutional, and retail channels.\n            </p>`
);

aboutHtml = aboutHtml.replace(
  `<h3 class="text-lg font-bold text-slate-900 mb-2">Our Vision</h3>\n            <p class="text-xs text-slate-600 leading-relaxed">\n              To be recognized as one of India's most dependable, ethically governed pharmaceutical partners, revered for clinical precision and supply excellence.\n            </p>`,
  `<h3 class="text-lg font-bold text-slate-900 mb-2" data-site-key="aboutVisionTitle">Our Vision</h3>\n            <p class="text-xs text-slate-600 leading-relaxed" data-site-key="aboutVisionText">\n              To be recognized as one of India's most dependable, ethically governed pharmaceutical partners, revered for clinical precision and supply excellence.\n            </p>`
);

aboutHtml = aboutHtml.replace(
  `<h3 class="text-lg font-bold text-slate-900 mb-2">Core Values</h3>\n            <p class="text-xs text-slate-600 leading-relaxed">\n              Scientific Integrity, Transparency, Zero Quality Compromise, Customer Centricity, and Continuous Improvement in all operations.\n            </p>`,
  `<h3 class="text-lg font-bold text-slate-900 mb-2" data-site-key="aboutValuesTitle">Core Values</h3>\n            <p class="text-xs text-slate-600 leading-relaxed" data-site-key="aboutValuesText">\n              Scientific Integrity, Transparency, Zero Quality Compromise, Customer Centricity, and Continuous Improvement in all operations.\n            </p>`
);

// Footer standards and contact in about.html
aboutHtml = aboutHtml.replace(
  `<p><strong>Standards:</strong> ISO 9001:2015 Standards • Certified Pharmaceutical Formulations</p>`,
  `<p><strong>Standards:</strong> <span data-site-key="footerStandards">ISO 9001:2015 Standards • Certified Pharmaceutical Formulations</span></p>`
);

aboutHtml = aboutHtml.replace(
  `<span class="text-slate-400">Sector 62, Industrial Area, New Delhi / NCR, India</span>`,
  `<span class="text-slate-400 site-address" data-site-key="address">Sector 62, Industrial Area, New Delhi / NCR, India</span>`
);

aboutHtml = aboutHtml.replace(
  `<span class="text-slate-400">+91 98765 43210</span>`,
  `<span class="text-slate-400 site-phone" data-site-key="phone">+91 98765 43210</span>`
);

aboutHtml = aboutHtml.replace(
  `<span class="text-slate-400">info@atikshpharma.com</span>`,
  `<span class="text-slate-400 site-email" data-site-key="email">info@atikshpharma.com</span>`
);

fs.writeFileSync('about.html', aboutHtml, 'utf8');
console.log('about.html updated with data-site-key attributes');

// 3. Update contact.html
let contactHtml = fs.readFileSync('contact.html', 'utf8');

if (!contactHtml.includes('js/site-config.js')) {
  contactHtml = contactHtml.replace(
    '<script src="js/products-data.js"></script>',
    '<script src="js/site-config.js"></script>\n  <script src="js/site-renderer.js"></script>\n  <script src="js/products-data.js"></script>'
  );
}

contactHtml = contactHtml.replace(
  `<p class="text-xs text-slate-600 mt-1 leading-relaxed">\n                Atiksh Pharma Tower, Plot No. 42, Sector 62, Industrial Area, New Delhi / NCR, Pin - 110092, India\n              </p>`,
  `<p class="text-xs text-slate-600 mt-1 leading-relaxed" data-site-key="address">\n                Atiksh Pharma Tower, Plot No. 42, Sector 62, Industrial Area, New Delhi / NCR, Pin - 110092, India\n              </p>`
);

contactHtml = contactHtml.replace(
  `<a href="tel:+919876543210" class="font-bold text-teal-700 hover:underline">+91 98765 43210</a>`,
  `<a href="tel:+919876543210" data-site-key="phone" class="font-bold text-teal-700 hover:underline">+91 98765 43210</a>`
);

contactHtml = contactHtml.replace(
  `<p class="text-xs text-slate-500 mt-0.5">\n                Head Office Line: +91 11 2345 6789\n              </p>`,
  `<p class="text-xs text-slate-500 mt-0.5">\n                Head Office Line: <span data-site-key="phoneOffice">+91 11 2345 6789</span>\n              </p>`
);

contactHtml = contactHtml.replace(
  `<p class="text-xs text-slate-600 mt-1">General Inquiries: <span class="font-bold text-slate-900">info@atikshpharma.com</span></p>`,
  `<p class="text-xs text-slate-600 mt-1">General Inquiries: <span class="font-bold text-slate-900" data-site-key="email">info@atikshpharma.com</span></p>`
);

contactHtml = contactHtml.replace(
  `<p class="text-xs text-slate-600 mt-0.5">Sales &amp; Supply: <span class="font-bold text-slate-900">sales@atikshpharma.com</span></p>`,
  `<p class="text-xs text-slate-600 mt-0.5">Sales &amp; Supply: <span class="font-bold text-slate-900" data-site-key="emailSales">sales@atikshpharma.com</span></p>`
);

contactHtml = contactHtml.replace(
  `<p class="text-xs text-slate-600 mt-0.5">Institutional Desk: <span class="font-bold text-slate-900">exports@atikshpharma.com</span></p>`,
  `<p class="text-xs text-slate-600 mt-0.5">Institutional Desk: <span class="font-bold text-slate-900" data-site-key="emailInstitutional">exports@atikshpharma.com</span></p>`
);

contactHtml = contactHtml.replace(
  `<p class="text-xs text-slate-600 mt-1">Monday – Saturday: 9:30 AM – 6:30 PM IST</p>`,
  `<p class="text-xs text-slate-600 mt-1" data-site-key="operatingHours">Monday – Saturday: 9:30 AM – 6:30 PM IST</p>`
);

// Footer standards and contact in contact.html
contactHtml = contactHtml.replace(
  `<p><strong>Standards:</strong> ISO 9001:2015 Standards • Certified Pharmaceutical Formulations</p>`,
  `<p><strong>Standards:</strong> <span data-site-key="footerStandards">ISO 9001:2015 Standards • Certified Pharmaceutical Formulations</span></p>`
);

contactHtml = contactHtml.replace(
  `<span class="text-slate-400">Sector 62, Industrial Area, New Delhi / NCR, India</span>`,
  `<span class="text-slate-400 site-address" data-site-key="address">Sector 62, Industrial Area, New Delhi / NCR, India</span>`
);

contactHtml = contactHtml.replace(
  `<span class="text-slate-400">+91 98765 43210</span>`,
  `<span class="text-slate-400 site-phone" data-site-key="phone">+91 98765 43210</span>`
);

contactHtml = contactHtml.replace(
  `<span class="text-slate-400">info@atikshpharma.com</span>`,
  `<span class="text-slate-400 site-email" data-site-key="email">info@atikshpharma.com</span>`
);

fs.writeFileSync('contact.html', contactHtml, 'utf8');
console.log('contact.html updated with data-site-key attributes');

// 4. Also update products.html and product-detail.html with site-config scripts and footer bindings
['products.html', 'product-detail.html'].forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    if (!content.includes('js/site-config.js')) {
      content = content.replace(
        '<script src="js/products-data.js"></script>',
        '<script src="js/site-config.js"></script>\n  <script src="js/site-renderer.js"></script>\n  <script src="js/products-data.js"></script>'
      );
    }
    content = content.replace(
      `<p><strong>Standards:</strong> ISO 9001:2015 Standards • Certified Pharmaceutical Formulations</p>`,
      `<p><strong>Standards:</strong> <span data-site-key="footerStandards">ISO 9001:2015 Standards • Certified Pharmaceutical Formulations</span></p>`
    );
    content = content.replace(
      `<span class="text-slate-400">Sector 62, Industrial Area, New Delhi / NCR, India</span>`,
      `<span class="text-slate-400 site-address" data-site-key="address">Sector 62, Industrial Area, New Delhi / NCR, India</span>`
    );
    content = content.replace(
      `<span class="text-slate-400">+91 98765 43210</span>`,
      `<span class="text-slate-400 site-phone" data-site-key="phone">+91 98765 43210</span>`
    );
    content = content.replace(
      `<span class="text-slate-400">info@atikshpharma.com</span>`,
      `<span class="text-slate-400 site-email" data-site-key="email">info@atikshpharma.com</span>`
    );
    fs.writeFileSync(f, content, 'utf8');
    console.log(`${f} updated with script tags`);
  }
});
