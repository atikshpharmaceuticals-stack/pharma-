const fs = require('fs');

// --- 1. UPDATE index.html ---
if (fs.existsSync('index.html')) {
  let html = fs.readFileSync('index.html', 'utf8');

  // Meta description
  html = html.replace(/,\s*and contract manufacturing/gi, '');

  // Hero text
  html = html.replace(/,\s*and contract manufacturing\./gi, '.');

  // Hero CTA button: "Partner With Us" -> "Contact Us"
  html = html.replace(
    /<a href="contact\.html" class="px-8 py-4 text-xs sm:text-sm font-bold text-white rounded-xl shadow-lg transition-all flex items-center gap-2 hover:opacity-95" style="background-color:#0A192F;">\s*<i data-lucide="handshake" class="w-4 h-4 text-teal-400"><\/i>\s*<span>Partner With Us<\/span>\s*<\/a>/g,
    `<a href="contact.html" class="px-8 py-4 text-xs sm:text-sm font-bold text-white rounded-xl shadow-lg transition-all flex items-center gap-2 hover:opacity-95" style="background-color:#0A192F;">
              <i data-lucide="mail" class="w-4 h-4 text-teal-400"></i>
              <span>Contact Us</span>
            </a>`
  );

  // Section title & text
  html = html.replace(/Partner With Atiksh Pharma/g, 'Contact Atiksh Pharma');
  html = html.replace(
    /Interested in partnering with Atiksh Pharma\? Get in touch with our team to discuss business opportunities, institutional supplies, contract manufacturing, and product enquiries\./g,
    'Have questions about our pharmaceutical formulations? Get in touch with our commercial desk to discuss supplies, quotations, and product enquiries.'
  );

  // Buttons in section: "Become a Partner" -> "Contact Us"
  html = html.replace(
    /<a href="contact\.html\?type=distributor" class="px-6 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-colors flex items-center gap-2">\s*<i data-lucide="handshake" class="w-4 h-4"><\/i>\s*<span>Become a Partner<\/span>\s*<\/a>/g,
    `<a href="contact.html" class="px-6 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-colors flex items-center gap-2">
            <i data-lucide="phone" class="w-4 h-4"></i>
            <span>Contact Us</span>
          </a>`
  );

  // Dropdown option
  html = html.replace(/<option value="Contract Manufacturing">Third-Party &amp; Contract Manufacturing<\/option>/g, '<option value="Hospital Supply">Hospital &amp; Institutional Supply</option>');

  fs.writeFileSync('index.html', html, 'utf8');
  console.log('Updated index.html');
}

// --- 2. UPDATE about.html ---
if (fs.existsSync('about.html')) {
  let html = fs.readFileSync('about.html', 'utf8');

  // Replace Third-Party Manufacturing block
  html = html.replace(
    /<strong class="text-teal-300 block mb-1 text-sm font-bold">Third-Party Manufacturing<\/strong>\s*<p class="text-slate-300">Flexible batch capacities and customized packaging design for client brands\.<\/p>/g,
    `<strong class="text-teal-300 block mb-1 text-sm font-bold">Hospital Supply</strong>
            <p class="text-slate-300">Direct supply of high-grade formulations for multi-specialty healthcare networks.</p>`
  );

  fs.writeFileSync('about.html', html, 'utf8');
  console.log('Updated about.html');
}

// --- 3. UPDATE contact.html ---
if (fs.existsSync('contact.html')) {
  let html = fs.readFileSync('contact.html', 'utf8');

  // Meta & hero descriptions
  html = html.replace(/contract manufacturing,\s*/gi, '');
  html = html.replace(/contract manufacturing quotations,\s*/gi, '');
  html = html.replace(/and business partnerships/gi, 'and product inquiries');

  // Dropdown option
  html = html.replace(/<option value="Contract Manufacturing">Third-Party &amp; Contract Manufacturing<\/option>/g, '<option value="Hospital Supply">Hospital &amp; Institutional Supply</option>');

  // FAQ block on contract manufacturing
  html = html.replace(
    /<h3 class="font-bold text-slate-900 text-sm mb-1\.5">How do I request customized batch formulation under Contract Manufacturing\?<\/h3>\s*<p class="text-xs text-slate-600 leading-relaxed">[\s\S]*?<\/p>/,
    `<h3 class="font-bold text-slate-900 text-sm mb-1.5">How can institutions request bulk pharmaceutical supply?</h3>
            <p class="text-xs text-slate-600 leading-relaxed">
              Please submit your required formulations, batch volumes, and delivery location via our inquiry form above. Our institutional supply desk will review and provide a formal quotation within 24 hours.
            </p>`
  );

  fs.writeFileSync('contact.html', html, 'utf8');
  console.log('Updated contact.html');
}

// --- 4. UPDATE js/main.js & js/admin.js ---
['js/main.js', 'js/admin.js'].forEach(f => {
  if (fs.existsSync(f)) {
    let code = fs.readFileSync(f, 'utf8');
    code = code.replace(/Third-Party & Contract Manufacturing/g, 'Hospital & Institutional Supply');
    code = code.replace(/Contract Manufacturing/g, 'Hospital Supply');
    fs.writeFileSync(f, code, 'utf8');
    console.log(`Updated ${f}`);
  }
});
