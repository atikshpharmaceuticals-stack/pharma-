/**
 * ATIKSH PHARMA - Admin Control Center JavaScript Engine
 * Full CRUD, 5-Slot Multi-Image Base64 Processor, Inquiries Lead Table & CSV Exporter,
 * and Comprehensive Visual Website Customizer (All Texts, Headings & Images).
 */

document.addEventListener('DOMContentLoaded', async function() {
  checkAdminAuth();
  initLucide();
  renderAdminProductsTable();
  renderAdminInquiriesTable();
  renderAdminUsersTable();
  initAdminProductForm();
  initAdminSettingsForm();
  initSiteCustomizerForm();
  updateAdminStats();

  // Immediate Cloud Fetch from Firebase / Backend upon opening Admin Panel
  if (window.AtikshAPI) {
    try {
      await AtikshAPI.getInquiries();
      await AtikshAPI.getProducts();
      await AtikshAPI.getUsers();
      await AtikshAPI.getConfig();
      renderAdminProductsTable();
      renderAdminInquiriesTable();
      renderAdminUsersTable();
      updateAdminStats();
    } catch (e) {
      console.debug("Cloud init sync:", e);
    }
  }
});

function initLucide() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// --------------------------------------------------------------------------
// Database Getter / Setters
// --------------------------------------------------------------------------
function getProducts() {
  try {
    const data = localStorage.getItem('atiksh_products');
    if (data !== null) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error("Error reading localStorage products", e);
  }
  return (typeof ATIKSH_MASTER_PRODUCTS !== 'undefined' && Array.isArray(ATIKSH_MASTER_PRODUCTS)) ? [...ATIKSH_MASTER_PRODUCTS] : [];
}

function saveProducts(products) {
  try {
    localStorage.setItem('atiksh_products', JSON.stringify(products));
    if (window.AtikshAPI && typeof window.AtikshAPI.saveProducts === 'function') {
      window.AtikshAPI.saveProducts(products);
    }
    updateAdminStats();
  } catch (e) {
    alert("Storage limit reached! Please optimize image sizes.");
    console.error(e);
  }
}

function getInquiries() {
  try {
    const data = localStorage.getItem('atiksh_inquiries');
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error(e);
  }
  return [];
}

function saveInquiries(inquiries) {
  localStorage.setItem('atiksh_inquiries', JSON.stringify(inquiries));
  if (window.AtikshAPI && typeof window.AtikshAPI.saveInquiries === 'function') {
    window.AtikshAPI.saveInquiries(inquiries);
  }
  updateAdminStats();
}

// --------------------------------------------------------------------------
// Top Statistics
// --------------------------------------------------------------------------
function updateAdminStats() {
  const products = getProducts();
  const inquiries = getInquiries();
  const users = (typeof getRegisteredUsers === 'function') ? getRegisteredUsers() : [];

  const prodCountEl = document.getElementById('stat-total-products');
  const inqCountEl = document.getElementById('stat-total-inquiries');
  const userCountEl = document.getElementById('stat-total-users');
  const inqBadge = document.getElementById('inquiry-badge');
  const userBadge = document.getElementById('user-count-badge');
  const sbProdCount = document.getElementById('sidebar-product-count');
  const sbInqCount = document.getElementById('sidebar-inquiry-count');

  if (prodCountEl) prodCountEl.textContent = products.length;
  if (inqCountEl) inqCountEl.textContent = inquiries.length;
  if (userCountEl) userCountEl.textContent = users.length;
  if (inqBadge) inqBadge.textContent = inquiries.length;
  if (userBadge) userBadge.textContent = users.length;
  if (sbProdCount) sbProdCount.textContent = products.length;
  if (sbInqCount) sbInqCount.textContent = inquiries.length;
}

// --------------------------------------------------------------------------
// Tab Navigation
// --------------------------------------------------------------------------
function switchTab(tabId) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.mobile-tab-btn').forEach(btn => {
    btn.classList.remove('bg-teal-600', 'text-white', 'border-teal-600');
    btn.classList.add('bg-white', 'text-slate-600', 'border-slate-200');
  });

  const activePanel = document.getElementById('tab-' + tabId);
  const activeBtn = document.getElementById('btn-tab-' + tabId);
  const activeMobileBtn = document.getElementById('btn-mobile-tab-' + tabId);

  if (activePanel) activePanel.classList.add('active');
  if (activeBtn) activeBtn.classList.add('active');
  if (activeMobileBtn) {
    activeMobileBtn.classList.remove('bg-white', 'text-slate-600', 'border-slate-200');
    activeMobileBtn.classList.add('bg-teal-600', 'text-white', 'border-teal-600');
  }

  // Refresh tab content dynamically
  if (tabId === 'inquiries') {
    renderAdminInquiriesTable();
    if (window.AtikshAPI) {
      AtikshAPI.getInquiries().then(() => {
        renderAdminInquiriesTable();
        updateAdminStats();
      });
    }
  } else if (tabId === 'products') {
    renderAdminProductsTable();
    if (window.AtikshAPI) {
      AtikshAPI.getProducts().then(() => {
        renderAdminProductsTable();
        updateAdminStats();
      });
    }
  } else if (tabId === 'users') {
    renderAdminUsersTable();
    if (window.AtikshAPI) {
      AtikshAPI.getUsers().then(() => {
        renderAdminUsersTable();
        updateAdminStats();
      });
    }
  }

  initLucide();
}

// --------------------------------------------------------------------------
// Customizer Subtab Navigation
// --------------------------------------------------------------------------
function switchCustomSubtab(subtabId) {
  document.querySelectorAll('.custom-subpanel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.custom-subtab').forEach(b => b.classList.remove('active'));

  const activePanel = document.getElementById('subpanel-' + subtabId);
  const activeBtn = document.getElementById('subtab-btn-' + subtabId);

  if (activePanel) activePanel.classList.add('active');
  if (activeBtn) activeBtn.classList.add('active');

  initLucide();
}

// --------------------------------------------------------------------------
// Products Table CRUD
// --------------------------------------------------------------------------
function renderAdminProductsTable() {
  const tbody = document.getElementById('admin-products-table-body');
  if (!tbody) return;

  const products = getProducts();
  tbody.innerHTML = '';

  if (products.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="py-12 text-center text-slate-400">
          No formulations currently in database. Click "Add New Product" to create one.
        </td>
      </tr>
    `;
    return;
  }

  products.forEach(p => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50 transition-colors';

    const images = Array.isArray(p.images) && p.images.length > 0 ? p.images : ["https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80"];
    const mainImg = images[0];
    const imgCount = images.length;

    tr.innerHTML = `
      <td class="py-3 px-4">
        <div class="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
          <img src="${mainImg}" alt="${p.name}" class="w-full h-full object-cover">
          ${imgCount > 1 ? `
            <span class="absolute bottom-0 right-0 bg-navy-dark/90 text-white text-[9px] px-1 rounded-tl font-bold" style="background-color:#07111E;">
              ${imgCount}
            </span>
          ` : ''}
        </div>
      </td>
      <td class="py-3 px-4">
        <span class="font-bold text-slate-900 block text-xs sm:text-sm">${p.name}</span>
        <span class="text-[10px] text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">${p.category || 'Tablets'}</span>
      </td>
      <td class="py-3 px-4 font-semibold text-slate-700 text-xs">
        ${p.dosageForm || 'Tablet'}
      </td>
      <td class="py-3 px-4 max-w-xs truncate text-slate-600 text-xs" title="${p.composition}">
        ${p.composition}
      </td>
      <td class="py-3 px-4 font-semibold text-slate-700 text-xs">
        ${p.packSize || '10 x 10'}
      </td>
      <td class="py-3 px-4 text-right">
        <div class="inline-flex items-center gap-1.5">
          <button onclick="editProduct('${p.id}')" class="p-1.5 text-slate-600 hover:text-teal-700 hover:bg-slate-100 rounded-lg transition-colors" title="Edit Formulation">
            <i data-lucide="edit-3" class="w-4 h-4"></i>
          </button>
          <button onclick="deleteProduct('${p.id}')" class="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete Formulation">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });

  initLucide();
}

function resetProductsToDefault() {
  if (!confirm("Are you sure you want to reset formulations to empty catalog?")) return;
  localStorage.setItem('atiksh_products', JSON.stringify([]));
  renderAdminProductsTable();
  updateAdminStats();
  showToast("Formulations catalog reset to clean state");
}

function clearAllProducts() {
  if (!confirm("Are you sure you want to delete ALL formulations from the catalog? This action will remove all products immediately.")) return;
  saveProducts([]);
  renderAdminProductsTable();
  showToast("All formulations deleted from catalog");
}

function deleteProduct(id) {
  if (!confirm("Are you sure you want to delete this formulation?")) return;
  let products = getProducts();
  products = products.filter(p => p.id !== id);
  saveProducts(products);
  renderAdminProductsTable();
  showToast("Product formulation removed");
}

// --------------------------------------------------------------------------
// Multi-Image Form Slots Handling
// --------------------------------------------------------------------------
function clearImageSlot(slot) {
  const prev = document.getElementById(`img-preview-${slot}`);
  const icon = document.getElementById(`img-icon-${slot}`);
  const dataInput = document.getElementById(`img-data-${slot}`);
  const wrap = document.getElementById(`slot-wrap-${slot}`);

  if (prev) { prev.src = ''; prev.classList.add('hidden'); }
  if (icon) icon.classList.remove('hidden');
  if (dataInput) dataInput.value = '';
  if (wrap) wrap.classList.remove('has-image');
}

function setImageSlot(slot, base64Url) {
  const prev = document.getElementById(`img-preview-${slot}`);
  const icon = document.getElementById(`img-icon-${slot}`);
  const dataInput = document.getElementById(`img-data-${slot}`);
  const wrap = document.getElementById(`slot-wrap-${slot}`);

  if (prev && base64Url) {
    prev.src = base64Url;
    prev.classList.remove('hidden');
  }
  if (icon) icon.classList.add('hidden');
  if (dataInput) dataInput.value = base64Url;
  if (wrap) wrap.classList.add('has-image');
}

function handleImageSlotUpload(event, slot) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const maxDim = 800;
      let w = img.width;
      let h = img.height;
      if (w > maxDim || h > maxDim) {
        if (w > h) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        } else {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
      setImageSlot(slot, compressedDataUrl);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// --------------------------------------------------------------------------
// Product Modal Add / Edit
// --------------------------------------------------------------------------
function openProductModalForAdd() {
  document.getElementById('admin-modal-title').textContent = "Add New Formulation";
  document.getElementById('form-product-id').value = "";
  document.getElementById('admin-product-form').reset();

  for (let i = 1; i <= 5; i++) {
    clearImageSlot(i);
  }

  document.getElementById('admin-product-modal').classList.remove('hidden');
  initLucide();
}

function editProduct(id) {
  const products = getProducts();
  const p = products.find(x => x.id === id);
  if (!p) return;

  document.getElementById('admin-modal-title').textContent = `Edit Formulation: ${p.name}`;
  document.getElementById('form-product-id').value = p.id;
  document.getElementById('form-product-name').value = p.name || '';
  document.getElementById('form-product-category').value = p.category || 'Tablets';
  document.getElementById('form-product-composition').value = p.composition || '';
  document.getElementById('form-product-dosage').value = p.dosageForm || 'Tablet';
  document.getElementById('form-product-strength').value = p.strength || '';
  document.getElementById('form-product-packing').value = p.packSize || '';
  document.getElementById('form-product-indication').value = p.indication || '';
  document.getElementById('form-product-description').value = p.description || '';
  document.getElementById('form-product-storage').value = p.storage || 'Store below 25°C in a dry place.';

  for (let i = 1; i <= 5; i++) {
    clearImageSlot(i);
  }

  if (Array.isArray(p.images)) {
    p.images.forEach((img, idx) => {
      if (idx < 5 && img) setImageSlot(idx + 1, img);
    });
  }

  document.getElementById('admin-product-modal').classList.remove('hidden');
  initLucide();
}

function closeAdminProductModal() {
  document.getElementById('admin-product-modal').classList.add('hidden');
}

function initAdminProductForm() {
  const form = document.getElementById('admin-product-form');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const id = document.getElementById('form-product-id').value || ("prod-" + Date.now());
    const name = document.getElementById('form-product-name').value.trim();
    const category = document.getElementById('form-product-category').value;
    const composition = document.getElementById('form-product-composition').value.trim();
    const dosageForm = document.getElementById('form-product-dosage').value;
    const strength = document.getElementById('form-product-strength').value.trim();
    const packSize = document.getElementById('form-product-packing').value.trim();
    const indication = document.getElementById('form-product-indication').value.trim();
    const description = document.getElementById('form-product-description').value.trim();
    const storage = document.getElementById('form-product-storage').value.trim();

    const images = [];
    for (let i = 1; i <= 5; i++) {
      const val = document.getElementById(`img-data-${i}`).value;
      if (val) images.push(val);
    }

    if (images.length === 0) {
      images.push("https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80");
    }

    const updatedProduct = {
      id,
      name,
      category,
      composition,
      dosageForm,
      strength,
      packSize,
      indication,
      description,
      storage,
      images,
      featured: true,
      keyPoints: [
        "Quality Certified Formulation",
        "Superior Bioavailability Profile",
        "High Stability Packaging"
      ]
    };

    let products = getProducts();
    const existingIndex = products.findIndex(p => p.id === id);

    if (existingIndex > -1) {
      products[existingIndex] = updatedProduct;
      showToast("Formulation updated successfully");
    } else {
      products.unshift(updatedProduct);
      showToast("New formulation added to catalog");
    }

    saveProducts(products);
    renderAdminProductsTable();
    closeAdminProductModal();
  });
}

// --------------------------------------------------------------------------
// Inquiries Lead Center
// --------------------------------------------------------------------------
function renderAdminInquiriesTable() {
  const tbody = document.getElementById('admin-inquiries-table-body');
  if (!tbody) return;

  const inquiries = getInquiries();
  tbody.innerHTML = '';

  if (inquiries.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="py-12 text-center text-slate-400">
          No customer inquiries received yet. Submissions from public forms will show here in real-time.
        </td>
      </tr>
    `;
    return;
  }

  inquiries.forEach((inq, idx) => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50 transition-colors';
    tr.innerHTML = `
      <td class="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
        ${inq.date || 'Recent'}
      </td>
      <td class="py-3 px-4">
        <strong class="text-slate-900 block">${inq.name || 'Anonymous'}</strong>
        <span class="text-[11px] text-slate-500">${inq.company || 'Direct Buyer'}</span>
      </td>
      <td class="py-3 px-4 text-slate-700">
        <div><a href="tel:${inq.phone}" class="font-bold text-teal-700 hover:underline">${inq.phone || 'N/A'}</a></div>
        <div class="text-[11px] text-slate-500">${inq.email || ''}</div>
      </td>
      <td class="py-3 px-4 text-slate-700">
        ${inq.city || 'India'}
      </td>
      <td class="py-3 px-4">
        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
          ${inq.type || 'Commercial Supply'}
        </span>
      </td>
      <td class="py-3 px-4 max-w-xs text-slate-600">
        ${inq.products ? `<div class="font-bold text-slate-900 mb-0.5">Interested: ${inq.products}</div>` : ''}
        <div class="truncate text-[11px]" title="${inq.message || ''}">${inq.message || 'Standard quote request'}</div>
      </td>
      <td class="py-3 px-4 text-right">
        <button onclick="deleteInquiry(${idx})" class="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Remove Lead">
          <i data-lucide="trash-2" class="w-4 h-4"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  initLucide();
  updateAdminStats();
}

function deleteInquiry(index) {
  let inqs = getInquiries();
  inqs.splice(index, 1);
  saveInquiries(inqs);
  renderAdminInquiriesTable();
  showToast("Inquiry removed");
}

function clearAllInquiries() {
  if (!confirm("Are you sure you want to delete ALL customer inquiries?")) return;
  saveInquiries([]);
  renderAdminInquiriesTable();
  showToast("All inquiries cleared");
}

function exportInquiriesCSV() {
  const inquiries = getInquiries();
  if (inquiries.length === 0) {
    alert("No inquiries to export.");
    return;
  }

  let csv = "ID,Date,Name,Company,Phone,Email,City,Type,Products,Message\n";
  inquiries.forEach(i => {
    csv += `"${i.id || ''}","${i.date || ''}","${(i.name||'').replace(/"/g, '""')}","${(i.company||'').replace(/"/g, '""')}","${i.phone||''}","${i.email||''}","${(i.city||'').replace(/"/g, '""')}","${(i.type||'').replace(/"/g, '""')}","${(i.products||'').replace(/"/g, '""')}","${(i.message||'').replace(/"/g, '""')}"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `atiksh_pharma_inquiries_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// --------------------------------------------------------------------------
// REGISTERED USERS MANAGEMENT & CSV EXPORT
// --------------------------------------------------------------------------
function renderAdminUsersTable() {
  const tbody = document.getElementById('admin-users-table-body');
  if (!tbody) return;

  const users = (typeof getRegisteredUsers === 'function') ? getRegisteredUsers() : [];
  tbody.innerHTML = '';

  if (users.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="py-12 text-center text-slate-400">
          No visitors have registered yet. New account sign-ups from the website entry modal will appear here in real-time.
        </td>
      </tr>
    `;
    updateAdminStats();
    return;
  }

  users.forEach((u, idx) => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50 transition-colors';
    tr.innerHTML = `
      <td class="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
        ${u.registeredAt || 'Recent'}
      </td>
      <td class="py-3 px-4">
        <strong class="text-slate-900 block text-sm">${u.name || 'Anonymous User'}</strong>
        <span class="text-[10px] text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">ID: ${u.id || ('USR-' + idx)}</span>
      </td>
      <td class="py-3 px-4 text-slate-700">
        <a href="mailto:${u.email}" class="font-bold text-teal-700 hover:underline">${u.email || 'N/A'}</a>
      </td>
      <td class="py-3 px-4 text-slate-700">
        <a href="tel:${u.phone}" class="font-medium text-slate-800 hover:underline">${u.phone || 'N/A'}</a>
      </td>
      <td class="py-3 px-4">
        <div class="inline-flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
          <i data-lucide="key" class="w-3 h-3 text-slate-500"></i>
          <span class="font-mono text-xs text-slate-800 font-bold select-all">${u.password || '••••••'}</span>
        </div>
      </td>
      <td class="py-3 px-4">
        <span class="inline-flex items-center gap-1 text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
          <i data-lucide="cookie" class="w-3 h-3 text-teal-600"></i>
          <span>Auto-Login Active</span>
        </span>
      </td>
      <td class="py-3 px-4 text-right">
        <div class="inline-flex items-center gap-1.5">
          <button onclick="promptAdminResetUserPassword(${idx})" class="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer" title="Change/Reset User Password">
            <i data-lucide="edit-3" class="w-4 h-4"></i>
          </button>
          <button onclick="deleteUser(${idx})" class="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer" title="Delete User">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });

  initLucide();
  updateAdminStats();
}

function promptAdminResetUserPassword(index) {
  let users = (typeof getRegisteredUsers === 'function') ? getRegisteredUsers() : [];
  const u = users[index];
  if (!u) return;

  const newPwd = prompt(`Set new password for user: ${u.name} (${u.email})`, u.password || '');
  if (newPwd !== null && newPwd.trim().length >= 4) {
    u.password = newPwd.trim();
    saveRegisteredUsers(users);
    renderAdminUsersTable();
    showToast(`Password updated for ${u.name}`);
  } else if (newPwd !== null) {
    alert("Password must be at least 4 characters long.");
  }
}

function deleteUser(index) {
  let users = (typeof getRegisteredUsers === 'function') ? getRegisteredUsers() : [];
  if (!confirm(`Are you sure you want to remove user "${users[index]?.name || 'this account'}"?`)) return;
  users.splice(index, 1);
  saveRegisteredUsers(users);
  renderAdminUsersTable();
  showToast("User account removed");
}

function clearAllUsers() {
  if (!confirm("Are you sure you want to delete ALL registered users? This cannot be undone.")) return;
  saveRegisteredUsers([]);
  renderAdminUsersTable();
  showToast("All registered users cleared");
}

function exportUsersCSV() {
  const users = (typeof getRegisteredUsers === 'function') ? getRegisteredUsers() : [];
  if (users.length === 0) {
    alert("No registered users to export.");
    return;
  }

  let csv = "User ID,Registered On,Full Name,Email Address,Phone Number,Password,Last Login\n";
  users.forEach(u => {
    csv += `"${u.id || ''}","${u.registeredAt || ''}","${(u.name||'').replace(/"/g, '""')}","${u.email || ''}","${u.phone || ''}","${(u.password||'').replace(/"/g, '""')}","${u.lastLogin || ''}"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `atiksh_pharma_registered_users_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


// --------------------------------------------------------------------------
// FULL WEBSITE CUSTOMIZER ENGINE (Headings, Paragraphs, Images)
// --------------------------------------------------------------------------
function initSiteCustomizerForm() {
  if (typeof getSiteConfig !== 'function') return;
  const config = getSiteConfig();

  // Populate all inputs matching cfg-[key]
  Object.keys(config).forEach(key => {
    const input = document.getElementById('cfg-' + key);
    if (input) {
      input.value = config[key];
    }
  });

  // Set image previews
  if (config.homeAboutImage) updateImagePreview('homeAboutImage', config.homeAboutImage);
  if (config.aboutWhoImage) updateImagePreview('aboutWhoImage', config.aboutWhoImage);
}

function updateImagePreview(key, src) {
  const preview = document.getElementById('preview-' + key);
  if (preview && src) {
    preview.src = src;
  }
}

function handleSingleImageUpload(event, key) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const base64 = e.target.result;
    const input = document.getElementById('cfg-' + key);
    if (input) input.value = base64;
    updateImagePreview(key, base64);
    showToast("Image loaded! Click Save to apply.");
  };
  reader.readAsDataURL(file);
}

function saveAllCustomizerChanges() {
  if (typeof getSiteConfig !== 'function' || typeof saveSiteConfig !== 'function') return;
  const current = getSiteConfig();

  // Gather values for all registered customizer fields
  const fields = [
    'homeHeroBadge',
    'homeHeroTitlePart1',
    'homeHeroTitlePart2',
    'homeHeroSubtitlePart1',
    'homeHeroSubtitlePart2',
    'homeHeroDescription',
    'homeMetric1Num',
    'homeMetric1Label',
    'homeMetric2Num',
    'homeMetric2Label',
    'homeMetric3Num',
    'homeMetric3Label',
    'homeMetric4Num',
    'homeMetric4Label',
    'homeAboutBadge',
    'homeAboutTitle',
    'homeAboutParagraph1',
    'homeAboutParagraph2',
    'homeAboutImage',
    'homeAboutImageBadge',
    'homeAboutImageCaption',
    'homeQualityBadge',
    'homeQualityTitle',
    'homeQualityDescription',
    'homeWhyBadge',
    'homeWhyTitle',
    'homeWhyDescription',
    'aboutHeroBadge',
    'aboutHeroTitle',
    'aboutHeroDescription',
    'aboutWhoBadge',
    'aboutWhoTitle',
    'aboutWhoParagraph1',
    'aboutWhoParagraph2',
    'aboutWhoImage',
    'aboutMissionText',
    'aboutVisionText'
  ];

  fields.forEach(f => {
    const el = document.getElementById('cfg-' + f);
    if (el) {
      current[f] = el.value.trim();
    }
  });

  saveSiteConfig(current);
  showToast("Website customized and published successfully!");
}

function resetSiteConfigToDefaults() {
  if (!confirm("Are you sure you want to reset all website headings, texts, and images back to defaults?")) return;
  localStorage.removeItem('atiksh_site_config');
  initSiteCustomizerForm();
  showToast("Website configuration restored to defaults");
}

// --------------------------------------------------------------------------
// Company & Contact Settings Form
// --------------------------------------------------------------------------
function initAdminSettingsForm() {
  const form = document.getElementById('admin-settings-form');
  if (!form) return;

  const config = (typeof getSiteConfig === 'function') ? getSiteConfig() : {};

  if (config.companyName && document.getElementById('setting-company-name')) document.getElementById('setting-company-name').value = config.companyName;
  if (config.tagline && document.getElementById('setting-tagline')) document.getElementById('setting-tagline').value = config.tagline;
  if (config.phone && document.getElementById('setting-phone')) document.getElementById('setting-phone').value = config.phone;
  if (config.phoneOffice && document.getElementById('setting-phone-office')) document.getElementById('setting-phone-office').value = config.phoneOffice;
  if (config.email && document.getElementById('setting-email')) document.getElementById('setting-email').value = config.email;
  if (config.emailSales && document.getElementById('setting-email-sales')) document.getElementById('setting-email-sales').value = config.emailSales;
  if (config.emailInstitutional && document.getElementById('setting-email-inst')) document.getElementById('setting-email-inst').value = config.emailInstitutional;
  if (config.address && document.getElementById('setting-address')) document.getElementById('setting-address').value = config.address;
  if (config.footerStandards && document.getElementById('setting-standards')) document.getElementById('setting-standards').value = config.footerStandards;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (typeof getSiteConfig !== 'function' || typeof saveSiteConfig !== 'function') return;

    const current = getSiteConfig();
    current.companyName = document.getElementById('setting-company-name').value.trim();
    current.tagline = document.getElementById('setting-tagline').value.trim();
    current.phone = document.getElementById('setting-phone').value.trim();
    current.phoneOffice = document.getElementById('setting-phone-office').value.trim();
    current.email = document.getElementById('setting-email').value.trim();
    current.emailSales = document.getElementById('setting-email-sales').value.trim();
    current.emailInstitutional = document.getElementById('setting-email-inst').value.trim();
    current.address = document.getElementById('setting-address').value.trim();
    current.footerStandards = document.getElementById('setting-standards').value.trim();

    saveSiteConfig(current);
    showToast("Company contact points updated successfully");
  });
}

// --------------------------------------------------------------------------
// Toast Notification Engine
// --------------------------------------------------------------------------
function showToast(msg) {
  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toast-msg');
  if (toast && msgEl) {
    msgEl.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
}

// --------------------------------------------------------------------------
// ADMIN ACCESS GATE & PASSWORD MANAGEMENT SYSTEM
// --------------------------------------------------------------------------
const DEFAULT_ADMIN_PASSWORD = "admin123";

function getAdminPassword() {
  return localStorage.getItem('atiksh_admin_password') || DEFAULT_ADMIN_PASSWORD;
}

function setAdminPassword(newPassword) {
  localStorage.setItem('atiksh_admin_password', newPassword);
  if (window.AtikshAPI && typeof window.AtikshAPI.saveAdminPassword === 'function') {
    window.AtikshAPI.saveAdminPassword(newPassword);
  }
}

function isAdminAuthenticated() {
  return sessionStorage.getItem('atiksh_admin_auth') === 'true';
}

function checkAdminAuth() {
  const overlay = document.getElementById('admin-auth-overlay');
  if (!overlay) return;

  if (isAdminAuthenticated()) {
    overlay.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  } else {
    overlay.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
    const pwdInput = document.getElementById('admin-login-password');
    if (pwdInput) setTimeout(() => pwdInput.focus(), 100);
  }
}

function handleAdminLogin(event) {
  event.preventDefault();
  const pwdInput = document.getElementById('admin-login-password');
  const errEl = document.getElementById('admin-login-error');
  if (!pwdInput) return;

  const entered = pwdInput.value.trim();
  const currentSaved = getAdminPassword();

  if (entered === currentSaved) {
    sessionStorage.setItem('atiksh_admin_auth', 'true');
    if (errEl) errEl.classList.add('hidden');
    pwdInput.value = '';

    const overlay = document.getElementById('admin-auth-overlay');
    if (overlay) overlay.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');

    showToast("Welcome to Atiksh Pharma Admin Portal");
    initLucide();

    // Immediately fetch latest live data from Firebase cloud upon login
    if (window.AtikshAPI) {
      Promise.all([
        AtikshAPI.getProducts(),
        AtikshAPI.getInquiries(),
        AtikshAPI.getUsers()
      ]).then(() => {
        renderAdminProductsTable();
        renderAdminInquiriesTable();
        renderAdminUsersTable();
        updateAdminStats();
      });
    } else {
      renderAdminProductsTable();
      renderAdminInquiriesTable();
      renderAdminUsersTable();
      updateAdminStats();
    }
  } else {
    if (errEl) errEl.classList.remove('hidden');
    pwdInput.select();
    pwdInput.focus();
  }
}

function handleAdminLogout() {
  if (!confirm("Are you sure you want to log out of the admin panel?")) return;
  sessionStorage.removeItem('atiksh_admin_auth');
  checkAdminAuth();
  showToast("Logged out successfully");
}

function handleAdminChangePassword() {
  const curInput = document.getElementById('change-pwd-current');
  const newInput = document.getElementById('change-pwd-new');
  const confInput = document.getElementById('change-pwd-confirm');

  if (!curInput || !newInput || !confInput) return;

  const currentEntered = curInput.value.trim();
  const newEntered = newInput.value.trim();
  const confEntered = confInput.value.trim();

  const realCurrent = getAdminPassword();

  if (currentEntered !== realCurrent) {
    alert("Incorrect Current Password! Please enter your existing password correctly.");
    curInput.focus();
    return;
  }

  if (newEntered.length < 4) {
    alert("New password must be at least 4 characters long.");
    newInput.focus();
    return;
  }

  if (newEntered !== confEntered) {
    alert("New Password and Confirm Password do not match. Please verify.");
    confInput.focus();
    return;
  }

  // Save new password
  setAdminPassword(newEntered);
  curInput.value = '';
  newInput.value = '';
  confInput.value = '';

  showToast("Password updated successfully! Keep your new password safe.");
}

function togglePasswordVisibility(inputId, btnEl) {
  const input = document.getElementById(inputId);
  if (!input) return;

  if (input.type === 'password') {
    input.type = 'text';
    btnEl.innerHTML = '<i data-lucide="eye-off" class="w-4 h-4"></i>';
  } else {
    input.type = 'password';
    btnEl.innerHTML = '<i data-lucide="eye" class="w-4 h-4"></i>';
  }
  initLucide();
}

// --------------------------------------------------------------------------
// CLOUD DATABASE & STATIC HOSTING MANAGEMENT
// --------------------------------------------------------------------------
function initCloudTabUI() {
  const apiUrlInput = document.getElementById('cloud-api-url');
  const statusText = document.getElementById('cloud-status-text');

  if (apiUrlInput) {
    apiUrlInput.value = localStorage.getItem('atiksh_cloud_api_url') || '';
  }

  if (statusText) {
    const api = localStorage.getItem('atiksh_cloud_api_url');
    if (api) {
      statusText.textContent = `Connected to External Railway Cloud Backend: ${api}`;
    } else {
      statusText.textContent = `Railway.app / Central Cloud Backend Active (${window.location.origin})`;
    }
  }
}

function saveCloudApiUrl() {
  const input = document.getElementById('cloud-api-url');
  if (!input) return;
  let val = input.value.trim();
  if (val && !val.startsWith('http://') && !val.startsWith('https://')) {
    val = 'https://' + val;
  }
  localStorage.setItem('atiksh_cloud_api_url', val);
  showToast(val ? "Railway Cloud Backend URL saved!" : "Reset to default Railway server URL");
  initCloudTabUI();
}

async function testCloudConnection() {
  showToast("Testing Railway Cloud connection...");
  try {
    const prods = await AtikshAPI.getProducts();
    if (prods !== null) {
      showToast("Railway Cloud Connected! Formulations & Leads in Sync.");
    } else {
      showToast("Could not reach cloud database.");
    }
  } catch (e) {
    showToast("Connection notice: " + e.message);
  }
}

function exportFullSiteDatabase() {
  const db = {
    products: getProducts(),
    inquiries: getInquiries(),
    users: typeof getRegisteredUsers === 'function' ? getRegisteredUsers() : [],
    config: typeof getSiteConfig === 'function' ? getSiteConfig() : {},
    adminPassword: getAdminPassword(),
    exportedAt: new Date().toISOString()
  };

  const blob = new Blob([JSON.stringify(db, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `atiksh-database-backup-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast("Database backup downloaded!");
}

function importFullSiteDatabase(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async function(evt) {
    try {
      const data = JSON.parse(evt.target.result);
      if (!confirm("Are you sure you want to restore this database? Existing products and inquiries will be replaced.")) return;

      if (Array.isArray(data.products)) {
        await saveProducts(data.products);
      }
      if (Array.isArray(data.inquiries)) {
        await saveInquiries(data.inquiries);
      }
      if (Array.isArray(data.users) && typeof saveRegisteredUsers === 'function') {
        saveRegisteredUsers(data.users);
      }
      if (data.config && typeof saveSiteConfig === 'function') {
        saveSiteConfig(data.config);
      }
      if (data.adminPassword) {
        setAdminPassword(data.adminPassword);
      }

      renderAdminProductsTable();
      renderAdminInquiriesTable();
      renderAdminUsersTable();
      updateAdminStats();
      showToast("Database restored successfully!");
    } catch (err) {
      alert("Invalid database file format. Please upload a valid JSON backup.");
    }
  };
  reader.readAsText(file);
}

async function manualSyncFromCloud() {
  showToast("Syncing with Railway Cloud...");
  if (window.AtikshAPI) {
    try {
      await AtikshAPI.getInquiries();
      await AtikshAPI.getProducts();
      await AtikshAPI.getUsers();
      await AtikshAPI.getConfig();
      renderAdminProductsTable();
      renderAdminInquiriesTable();
      renderAdminUsersTable();
      updateAdminStats();
      showToast("Cloud sync complete! Up to date.");
    } catch (err) {
      showToast("Sync notice: " + err.message);
    }
  }
}

document.addEventListener('DOMContentLoaded', function() {
  initCloudTabUI();
});

