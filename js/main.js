/**
 * ATIKSH PHARMA - Main JavaScript Application Controller
 * Handles Search, Product Filtering by Dosage/Category, Dynamic Detail View, Inquiries Lead Engine, and UI Interactivity.
 */

document.addEventListener('DOMContentLoaded', async function() {
  initLucide();
  initFooterYear();
  initMobileMenu();

  // Pre-fetch live products from Firebase cloud if not yet loaded locally
  if (window.AtikshAPI && typeof window.AtikshAPI.getProducts === 'function') {
    try {
      await window.AtikshAPI.getProducts();
    } catch (e) {}
  }

  initHomeFeaturedProducts();
  initProductsCatalog();
  initProductDetailPage();
  initInquiryFormHandler();
});

function initLucide() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function initFooterYear() {
  const els = document.querySelectorAll('.current-year');
  const y = new Date().getFullYear();
  els.forEach(el => el.textContent = y);
}

function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (btn && menu) {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      menu.classList.toggle('hidden');
      const isExpanded = !menu.classList.contains('hidden');
      btn.setAttribute('aria-expanded', isExpanded);
    });

    // Auto-close menu when clicking any link inside
    menu.querySelectorAll('a, button').forEach(item => {
      item.addEventListener('click', function() {
        menu.classList.add('hidden');
        btn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close when clicking outside header on mobile
    document.addEventListener('click', function(e) {
      if (!menu.contains(e.target) && !btn.contains(e.target)) {
        menu.classList.add('hidden');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

function getDosageBadgeClass(dosageForm) {
  const d = String(dosageForm || '').toLowerCase();
  if (d.includes('tablet')) return 'badge-tablet';
  if (d.includes('capsule')) return 'badge-capsule';
  if (d.includes('syrup') || d.includes('liquid')) return 'badge-syrup';
  if (d.includes('inject')) return 'badge-injection';
  if (d.includes('derma') || d.includes('cream') || d.includes('ointment')) return 'badge-derma';
  if (d.includes('nutra') || d.includes('supplement')) return 'badge-nutra';
  return 'badge-tablet';
}

function getProductCoverImage(product) {
  if (Array.isArray(product.images) && product.images.length > 0 && product.images[0]) {
    return product.images[0];
  }
  return "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80";
}

// Render Single Product Card HTML Component
function renderProductCardHTML(p) {
  const coverImg = getProductCoverImage(p);
  const badgeClass = getDosageBadgeClass(p.dosageForm);
  const imgCount = Array.isArray(p.images) ? p.images.length : 1;

  return `
    <div class="pharma-card bg-white rounded-2xl p-5 border border-slate-200 flex flex-col justify-between group hover:shadow-xl transition-all">
      <div>
        <!-- Image Container -->
        <div class="relative w-full h-48 rounded-xl bg-slate-50 overflow-hidden mb-4 border border-slate-100 flex items-center justify-center">
          <img src="${coverImg}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
          
          <span class="absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-md shadow-xs ${badgeClass}">
            ${p.dosageForm || p.category || 'Formulation'}
          </span>

          ${imgCount > 1 ? `
            <span class="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
              <i data-lucide="images" class="w-3 h-3"></i> ${imgCount} Photos
            </span>
          ` : ''}
        </div>

        <!-- Product Details -->
        <div class="space-y-1.5 mb-4">
          <div class="flex items-center justify-between gap-2">
            <span class="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded uppercase tracking-wider">
              ${p.category || p.dosageForm || 'Pharma'}
            </span>
            <span class="text-[11px] font-semibold text-slate-500">
              ${p.strength || ''}
            </span>
          </div>

          <h3 class="text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
            <a href="product-detail.html?id=${encodeURIComponent(p.id)}">${p.name}</a>
          </h3>

          <p class="text-xs font-medium text-slate-600 line-clamp-2 leading-relaxed" title="${p.composition}">
            <strong class="text-slate-800">Composition:</strong> ${p.composition}
          </p>

          <p class="text-xs text-slate-500 flex items-center gap-1.5 pt-1">
            <i data-lucide="package" class="w-3.5 h-3.5 text-slate-400"></i>
            <span><strong>Pack:</strong> ${p.packSize || 'Standard'}</span>
          </p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 mt-2">
        <a href="product-detail.html?id=${encodeURIComponent(p.id)}" class="px-3 py-2 text-xs font-bold text-slate-700 hover:text-navy-900 bg-slate-100 hover:bg-slate-200 rounded-lg text-center transition-colors flex items-center justify-center gap-1">
          <span>View Details</span>
          <i data-lucide="arrow-right" class="w-3 h-3"></i>
        </a>
        <a href="contact.html?product=${encodeURIComponent(p.name)}" class="px-3 py-2 text-xs font-bold text-white rounded-lg text-center transition-colors flex items-center justify-center gap-1" style="background-color:#0A192F;">
          <span>Enquire Now</span>
          <i data-lucide="send" class="w-3 h-3"></i>
        </a>
      </div>
    </div>
  `;
}

// --------------------------------------------------------------------------
// 1. Featured Products on Homepage
// --------------------------------------------------------------------------
function initHomeFeaturedProducts() {
  const container = document.getElementById('home-featured-products-grid');
  if (!container) return;

  const catalog = getAtikshMasterCatalog();
  const featured = catalog.filter(p => p.featured === true).slice(0, 6);
  const displayItems = featured.length > 0 ? featured : catalog.slice(0, 6);

  if (displayItems.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-14 text-center bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
        <div class="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-3 border border-teal-100">
          <i data-lucide="package-plus" class="w-8 h-8"></i>
        </div>
        <h3 class="text-lg font-bold text-slate-900 mb-1 font-brand">Catalog Ready For Real Formulations</h3>
        <p class="text-xs text-slate-500 max-w-md mx-auto mb-5 leading-relaxed">
          All sample products have been cleared. Add your real pharmaceutical formulations in the Admin Portal to showcase them here live.
        </p>
        <a href="admin.html" class="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white rounded-xl shadow-md transition-all hover:opacity-90" style="background-color:#0D9488;">
          <i data-lucide="plus-circle" class="w-4 h-4"></i>
          <span>Open Admin Portal &amp; Add Products</span>
        </a>
      </div>
    `;
    initLucide();
    return;
  }

  container.innerHTML = displayItems.map(renderProductCardHTML).join('');
  initLucide();
}

// --------------------------------------------------------------------------
// 2. Products Catalog Filter Engine (products.html)
// --------------------------------------------------------------------------
function initProductsCatalog() {
  const grid = document.getElementById('products-catalog-grid');
  if (!grid) return;

  const searchInput = document.getElementById('catalog-search-input');
  const dosageSelect = document.getElementById('catalog-dosage-filter');
  const resultCountEl = document.getElementById('catalog-result-count');
  const resetBtn = document.getElementById('catalog-reset-filters');
  const dosagePillBar = document.getElementById('dosage-pill-bar');

  const urlParams = new URLSearchParams(window.location.search);
  let selectedDosage = urlParams.get('dosage') || urlParams.get('category') || 'all';
  let searchQuery = urlParams.get('q') || '';

  if (searchInput && searchQuery) searchInput.value = searchQuery;
  if (dosageSelect && selectedDosage !== 'all') dosageSelect.value = selectedDosage;

  const dosageTabs = [
    { id: "all", name: "All Formulations" },
    { id: "tablet", name: "Tablets" },
    { id: "capsule", name: "Capsules" },
    { id: "syrup", name: "Syrups & Liquids" },
    { id: "inject", name: "Injections" },
    { id: "derma", name: "Ointments & Creams" },
    { id: "nutra", name: "Nutraceuticals" }
  ];

  if (dosagePillBar) {
    dosagePillBar.innerHTML = dosageTabs.map(t => `
      <button data-dosage="${t.id}" class="filter-pill px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 text-slate-700 ${selectedDosage === t.id ? 'active' : ''}">
        ${t.name}
      </button>
    `).join('');

    dosagePillBar.querySelectorAll('.filter-pill').forEach(pill => {
      pill.addEventListener('click', function() {
        dosagePillBar.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
        this.classList.add('active');
        selectedDosage = this.dataset.dosage;
        if (dosageSelect) dosageSelect.value = selectedDosage;
        renderCatalog();
      });
    });
  }

  function renderCatalog() {
    const catalog = getAtikshMasterCatalog();
    const q = (searchInput ? searchInput.value : '').toLowerCase().trim();

    const filtered = catalog.filter(p => {
      const matchDosage = (selectedDosage === 'all') || 
        (p.dosageForm && p.dosageForm.toLowerCase().includes(selectedDosage.toLowerCase())) ||
        (p.category && p.category.toLowerCase().includes(selectedDosage.toLowerCase()));

      const matchSearch = !q || 
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.composition && p.composition.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.strength && p.strength.toLowerCase().includes(q)) ||
        (p.indication && p.indication.toLowerCase().includes(q));

      return matchDosage && matchSearch;
    });

    if (resultCountEl) {
      resultCountEl.textContent = `${filtered.length} Formulations Available`;
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
          <div class="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-4 border border-teal-100">
            <i data-lucide="package-search" class="w-8 h-8"></i>
          </div>
          <h3 class="text-lg font-bold text-slate-900 mb-1 font-brand">No Formulations Listed Yet</h3>
          <p class="text-xs text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
            All sample products have been cleared. Use the Admin Portal to add real pharmaceutical formulations with custom strengths, pack sizes, and images.
          </p>
          <div class="flex items-center justify-center gap-3">
            <a href="admin.html" class="px-5 py-2.5 text-white text-xs font-bold rounded-xl shadow-md transition-all hover:opacity-90 flex items-center gap-1.5" style="background-color:#0D9488;">
              <i data-lucide="plus-circle" class="w-4 h-4"></i>
              <span>Add Formulations in Admin</span>
            </a>
            ${q || selectedDosage !== 'all' ? `
              <button onclick="document.getElementById('catalog-reset-filters').click()" class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors">
                Reset Filters
              </button>
            ` : ''}
          </div>
        </div>
      `;
    } else {
      grid.innerHTML = filtered.map(renderProductCardHTML).join('');
    }

    initLucide();
  }

  if (searchInput) searchInput.addEventListener('input', renderCatalog);
  if (dosageSelect) {
    dosageSelect.addEventListener('change', function() {
      selectedDosage = this.value;
      if (dosagePillBar) {
        dosagePillBar.querySelectorAll('.filter-pill').forEach(p => {
          p.classList.toggle('active', p.dataset.dosage === selectedDosage);
        });
      }
      renderCatalog();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', function() {
      if (searchInput) searchInput.value = '';
      if (dosageSelect) dosageSelect.value = 'all';
      selectedDosage = 'all';
      if (dosagePillBar) {
        dosagePillBar.querySelectorAll('.filter-pill').forEach(p => {
          p.classList.toggle('active', p.dataset.dosage === 'all');
        });
      }
      renderCatalog();
    });
  }

  renderCatalog();
  window._renderCatalog = renderCatalog;
}

// Expose on window for live sync
window.initHomeFeaturedProducts = initHomeFeaturedProducts;
window.initProductsCatalog = initProductsCatalog;


// --------------------------------------------------------------------------
// 3. Product Detail Page (product-detail.html)
// --------------------------------------------------------------------------
async function initProductDetailPage() {
  const container = document.getElementById('product-detail-container');
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  const prodId = urlParams.get('id');

  if (!prodId) {
    container.innerHTML = `
      <div class="py-24 text-center">
        <h2 class="text-2xl font-black text-slate-900 mb-2">No Product Specified</h2>
        <p class="text-sm text-slate-500 mb-6">Please select a formulation from our product catalogue.</p>
        <a href="products.html" class="px-6 py-3 text-white rounded-xl text-xs font-bold" style="background-color:#0A192F;">
          Browse Product Catalogue
        </a>
      </div>
    `;
    return;
  }

  let product = getAtikshProductById(prodId);

  // If not yet available in localStorage, fetch from Firebase Cloud
  if (!product && window.AtikshAPI && typeof window.AtikshAPI.getProducts === 'function') {
    try {
      await window.AtikshAPI.getProducts();
      product = getAtikshProductById(prodId);
    } catch (e) {}
  }

  if (!product) {
    container.innerHTML = `
      <div class="py-24 text-center">
        <h2 class="text-2xl font-black text-slate-900 mb-2">Product Not Found</h2>
        <p class="text-sm text-slate-500 mb-6">The requested formulation ID "${prodId}" was not found in our database.</p>
        <a href="products.html" class="px-6 py-3 text-white rounded-xl text-xs font-bold" style="background-color:#0A192F;">
          Back to Catalogue
        </a>
      </div>
    `;
    return;
  }

  document.title = `${product.name} | Atiksh Pharma`;

  const images = (Array.isArray(product.images) && product.images.length > 0) ? product.images : [getProductCoverImage(product)];
  const badgeClass = getDosageBadgeClass(product.dosageForm);

  container.innerHTML = `
    <!-- Breadcrumb -->
    <nav class="flex items-center gap-2 text-xs text-slate-500 mb-8 overflow-x-auto whitespace-nowrap">
      <a href="index.html" class="hover:text-teal-700">Home</a>
      <span>/</span>
      <a href="products.html" class="hover:text-teal-700">Products</a>
      <span>/</span>
      <a href="products.html?category=${encodeURIComponent(product.category || product.dosageForm || 'all')}" class="hover:text-teal-700">${product.category || product.dosageForm || 'Formulation'}</a>
      <span>/</span>
      <span class="text-slate-900 font-bold">${product.name}</span>
    </nav>

    <!-- Main Detail Grid -->
    <div class="grid lg:grid-cols-12 gap-10 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs mb-16">
      
      <!-- Left: Photo Gallery -->
      <div class="lg:col-span-5 space-y-4">
        <div class="w-full h-80 sm:h-96 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden relative flex items-center justify-center">
          <img id="detail-main-image" src="${images[0]}" alt="${product.name}" class="w-full h-full object-cover">
          <span class="absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-md shadow-xs ${badgeClass}">
            ${product.dosageForm || product.category || 'Formulation'}
          </span>
        </div>

        ${images.length > 1 ? `
          <div class="grid grid-cols-5 gap-2">
            ${images.map((img, i) => `
              <button onclick="document.getElementById('detail-main-image').src = '${img}'; this.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('ring-2', 'ring-teal-600')); this.classList.add('ring-2', 'ring-teal-600');" class="h-16 rounded-xl border border-slate-200 overflow-hidden focus:outline-none ${i === 0 ? 'ring-2 ring-teal-600' : ''}">
                <img src="${img}" alt="Thumbnail ${i+1}" class="w-full h-full object-cover">
              </button>
            `).join('')}
          </div>
        ` : ''}

        <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
          <p><strong>Quality Standard:</strong> Formulated in compliance with ISO 9001:2015 &amp; Pharmacopoeial guidelines.</p>
          <p><strong>Supply Capability:</strong> Hospital supplies, institutional tender, and commercial distribution.</p>
        </div>
      </div>

      <!-- Right: Formulation Specifications -->
      <div class="lg:col-span-7 flex flex-col justify-between space-y-6">
        <div>
          <div class="flex flex-wrap items-center gap-2 mb-2">
            <span class="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full uppercase tracking-wider">
              ${product.category || product.dosageForm || 'Pharmaceutical Formulation'}
            </span>
            <span class="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              Strength: ${product.strength || 'Standard'}
            </span>
          </div>

          <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
            ${product.name}
          </h1>

          <!-- Composition Callout Box -->
          <div class="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/80 mb-5">
            <span class="text-[11px] font-bold text-teal-800 uppercase tracking-wider block mb-1">
              Active Salt Composition
            </span>
            <p class="text-sm sm:text-base font-bold text-slate-900">
              ${product.composition}
            </p>
          </div>

          <!-- Description -->
          <p class="text-sm text-slate-600 leading-relaxed mb-6">
            ${product.description || 'Rigorously tested pharmaceutical formulation manufactured under high standards of quality assurance and clinical efficacy.'}
          </p>

          <!-- Specifications Table -->
          <div class="grid sm:grid-cols-2 gap-4 border-y border-slate-100 py-6 mb-6 text-xs">
            <div>
              <span class="text-slate-400 font-semibold block uppercase tracking-wider text-[10px]">Dosage Form</span>
              <strong class="text-slate-900 text-sm">${product.dosageForm || 'Oral Solid'}</strong>
            </div>
            <div>
              <span class="text-slate-400 font-semibold block uppercase tracking-wider text-[10px]">Packaging Specifications</span>
              <strong class="text-slate-900 text-sm">${product.packSize || '10 x 10'}</strong>
            </div>
            <div>
              <span class="text-slate-400 font-semibold block uppercase tracking-wider text-[10px]">Primary Indications</span>
              <strong class="text-slate-900 text-sm leading-snug block">${product.indication || 'Refer to package insert.'}</strong>
            </div>
            <div>
              <span class="text-slate-400 font-semibold block uppercase tracking-wider text-[10px]">Storage Instructions</span>
              <strong class="text-slate-900 text-sm">${product.storage || 'Store in a cool, dry place.'}</strong>
            </div>
          </div>

          <!-- Key Highlights -->
          ${Array.isArray(product.keyPoints) && product.keyPoints.length > 0 ? `
            <div class="mb-6">
              <span class="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">Key Quality Attributes</span>
              <ul class="space-y-1.5 text-xs text-slate-600">
                ${product.keyPoints.map(kp => `
                  <li class="flex items-center gap-2">
                    <i data-lucide="check-circle-2" class="w-4 h-4 text-teal-600 shrink-0"></i>
                    <span>${kp}</span>
                  </li>
                `).join('')}
              </ul>
            </div>
          ` : ''}
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-wrap gap-4 pt-4 border-t border-slate-100">
          <a href="contact.html?product=${encodeURIComponent(product.name)}" class="flex-1 px-8 py-4 text-white rounded-xl font-bold text-xs sm:text-sm text-center shadow-lg transition-all flex items-center justify-center gap-2 hover:opacity-90" style="background-color:#0A192F;">
            <i data-lucide="send" class="w-4 h-4"></i>
            <span>Enquire for Bulk Supply</span>
          </a>
          <a href="https://wa.me/919876543210?text=Hello%20Atiksh%20Pharma%2C%20I%20am%20interested%20in%20${encodeURIComponent(product.name)}%20(${encodeURIComponent(product.composition)})." target="_blank" rel="noopener noreferrer" class="px-6 py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs sm:text-sm transition-colors flex items-center gap-2">
            <i data-lucide="message-circle" class="w-4 h-4"></i>
            <span>WhatsApp Enquiry</span>
          </a>
        </div>

      </div>

    </div>

    <!-- Related Formulations Section -->
    <div class="mt-16">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="text-2xl font-extrabold text-slate-900 tracking-tight">Other Formulations</h2>
          <p class="text-xs text-slate-500 mt-1">Explore more certified pharmaceutical products</p>
        </div>
        <a href="products.html" class="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1">
          <span>View All Products</span>
          <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
        </a>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        ${getAtikshMasterCatalog()
          .filter(p => p.id !== product.id)
          .slice(0, 3)
          .map(renderProductCardHTML)
          .join('')}
      </div>
    </div>
  `;

  initLucide();
}

window.initProductDetailPage = initProductDetailPage;

// --------------------------------------------------------------------------
// 4. Contact & Commercial Inquiry Submission Handler
// --------------------------------------------------------------------------
function initInquiryFormHandler() {
  const form = document.getElementById('pharma-inquiry-form');
  if (!form) return;

  const urlParams = new URLSearchParams(window.location.search);
  const prodParam = urlParams.get('product');
  const productInput = document.getElementById('inquiry-products-input');
  if (prodParam && productInput) {
    productInput.value = prodParam;
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const nameInput = form.querySelector('input[name="fullName"]') || form.querySelector('input[type="text"]');
    const phoneInput = form.querySelector('input[name="phone"]') || form.querySelector('input[type="tel"]');
    const emailInput = form.querySelector('input[name="email"]') || form.querySelector('input[type="email"]');
    const cityInput = document.getElementById('inquiry-city-input') || form.querySelectorAll('input[type="text"]')[1];
    const companyInput = document.getElementById('inquiry-company-input');
    const typeSelect = document.getElementById('inquiry-type-select');
    const messageInput = form.querySelector('textarea');

    const newInquiry = {
      id: "INQ-" + Date.now(),
      date: new Date().toLocaleString(),
      name: nameInput ? nameInput.value.trim() : 'Customer',
      phone: phoneInput ? phoneInput.value.trim() : '',
      email: emailInput ? emailInput.value.trim() : '',
      city: cityInput ? cityInput.value.trim() : '',
      company: companyInput ? companyInput.value.trim() : '',
      type: typeSelect ? typeSelect.value : 'Commercial Supply',
      products: productInput ? productInput.value.trim() : '',
      message: messageInput ? messageInput.value.trim() : ''
    };

    try {
      const currentInquiries = JSON.parse(localStorage.getItem('atiksh_inquiries') || '[]');
      currentInquiries.unshift(newInquiry);
      localStorage.setItem('atiksh_inquiries', JSON.stringify(currentInquiries));
      if (window.AtikshAPI && typeof window.AtikshAPI.sendInquiry === 'function') {
        window.AtikshAPI.sendInquiry(newInquiry);
      }
    } catch (err) {
      console.warn("Error persisting inquiry to localStorage", err);
    }

    form.innerHTML = `
      <div class="py-12 text-center space-y-4">
        <div class="w-16 h-16 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mx-auto">
          <i data-lucide="check-circle" class="w-8 h-8"></i>
        </div>
        <h3 class="text-2xl font-bold text-slate-900">Enquiry Submitted Successfully</h3>
        <p class="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          Thank you for contacting <strong>Atiksh Pharma</strong>. Our commercial operations desk has received your request (Reference ID: <code class="text-teal-700 font-bold">${newInquiry.id}</code>) and will reach out within 24 business hours.
        </p>
        <div class="pt-4">
          <a href="products.html" class="px-6 py-3 text-white rounded-xl text-xs font-bold inline-block" style="background-color:#0A192F;">
            Continue Exploring Formulations
          </a>
        </div>
      </div>
    `;

    initLucide();
  });
}
