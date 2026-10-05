/**
 * ATIKSH PHARMA - Dynamic Site Config & Real-Time Live Sync Engine
 * Automatically applies master configuration to DOM elements matching [data-site-key]
 * and synchronizes changes across tabs in real-time as they are made in the Admin Panel.
 */

let _lastAppliedConfigHash = '';

function applySiteConfigToDOM() {
  if (typeof getSiteConfig !== 'function') return;
  const config = getSiteConfig();

  // 1. Elements with explicit data-site-key
  document.querySelectorAll('[data-site-key]').forEach(el => {
    const key = el.getAttribute('data-site-key');
    if (config[key] !== undefined) {
      if (el.tagName === 'IMG') {
        if (el.src !== config[key]) el.src = config[key];
      } else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        if (el.value !== config[key]) el.value = config[key];
      } else {
        if (el.textContent !== config[key]) el.textContent = config[key];
      }
    }
  });

  // 2. Elements with data-site-html
  document.querySelectorAll('[data-site-html]').forEach(el => {
    const key = el.getAttribute('data-site-html');
    if (config[key] !== undefined) {
      if (el.innerHTML !== config[key]) el.innerHTML = config[key];
    }
  });

  // 3. Fallback targeted bindings for common layout components
  // Global phone links
  document.querySelectorAll('a[href^="tel:"]').forEach(a => {
    if (config.phone) {
      const cleanPhone = config.phone.replace(/[\s-]/g, '');
      a.href = `tel:${cleanPhone}`;
      if (a.hasAttribute('data-auto-phone')) a.textContent = config.phone;
    }
  });

  // Global email links
  document.querySelectorAll('a[href^="mailto:"]').forEach(a => {
    if (config.email) {
      a.href = `mailto:${config.email}`;
      if (a.hasAttribute('data-auto-email')) a.textContent = config.email;
    }
  });

  // Header and footer brand texts
  document.querySelectorAll('.site-company-name').forEach(el => {
    if (config.companyName && el.textContent !== config.companyName) el.textContent = config.companyName;
  });

  document.querySelectorAll('.site-tagline').forEach(el => {
    if (config.tagline && el.textContent !== config.tagline) el.textContent = config.tagline;
  });

  document.querySelectorAll('.site-address').forEach(el => {
    if (config.address && el.textContent !== config.address) el.textContent = config.address;
  });

  document.querySelectorAll('.site-phone').forEach(el => {
    if (config.phone && el.textContent !== config.phone) el.textContent = config.phone;
  });

  document.querySelectorAll('.site-email').forEach(el => {
    if (config.email && el.textContent !== config.email) el.textContent = config.email;
  });
}

// --------------------------------------------------------------------------
// Real-Time Cross-Tab & Live Synchronization Listeners
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
  applySiteConfigToDOM();
});

// 1. Cross-Tab Storage Event (Immediate instant sync when admin saves)
window.addEventListener('storage', function(e) {
  if (e.key === 'atiksh_site_config') {
    applySiteConfigToDOM();
  }
  if (e.key === 'atiksh_products') {
    if (typeof initHomeFeaturedProducts === 'function') initHomeFeaturedProducts();
    if (typeof initProductsCatalog === 'function') initProductsCatalog();
  }
  if (e.key === 'atiksh_logged_in_user' || e.key === 'atiksh_registered_users') {
    if (typeof updatePublicAuthNav === 'function') updatePublicAuthNav();
  }
});

// 2. Tab Focus & Page Visibility
window.addEventListener('focus', function() {
  applySiteConfigToDOM();
  if (typeof initHomeFeaturedProducts === 'function') initHomeFeaturedProducts();
  if (typeof initProductsCatalog === 'function') initProductsCatalog();
});

document.addEventListener('visibilitychange', function() {
  if (!document.hidden) {
    applySiteConfigToDOM();
    if (typeof initHomeFeaturedProducts === 'function') initHomeFeaturedProducts();
    if (typeof initProductsCatalog === 'function') initProductsCatalog();
  }
});

// 3. Ultra-responsive 1-second dynamic poll to reflect changes live in the DOM
setInterval(function() {
  applySiteConfigToDOM();
}, 1000);

// 4. Cross-Device Cloud Sync Poll (Polls every 3 seconds for updates from other devices)
let _lastSyncProductsHash = '';
let _lastSyncInquiriesHash = '';
let _lastSyncUsersHash = '';

async function syncRemoteDataCrossDevice() {
  if (!window.AtikshAPI) return;
  try {
    // 1. Sync Site Config
    const remoteConfig = await AtikshAPI.getConfig();
    if (remoteConfig) applySiteConfigToDOM();

    // 2. Sync Products (Website Catalog + Admin Table)
    const remoteProds = await AtikshAPI.getProducts();
    if (Array.isArray(remoteProds)) {
      const prodsHash = JSON.stringify(remoteProds);
      if (_lastSyncProductsHash !== prodsHash) {
        _lastSyncProductsHash = prodsHash;
        if (typeof initHomeFeaturedProducts === 'function') initHomeFeaturedProducts();
        if (typeof window._renderCatalog === 'function') {
          window._renderCatalog();
        } else if (typeof initProductsCatalog === 'function') {
          initProductsCatalog();
        }
        if (typeof initProductDetailPage === 'function') initProductDetailPage();
        if (typeof renderAdminProductsTable === 'function') renderAdminProductsTable();
        if (typeof updateAdminStats === 'function') updateAdminStats();
      }
    }

    // 3. Sync Inquiries (Admin Inquiries Table)
    if (typeof renderAdminInquiriesTable === 'function') {
      const remoteInquiries = await AtikshAPI.getInquiries();
      if (Array.isArray(remoteInquiries)) {
        const inqHash = JSON.stringify(remoteInquiries);
        if (_lastSyncInquiriesHash !== inqHash) {
          _lastSyncInquiriesHash = inqHash;
          renderAdminInquiriesTable();
          if (typeof updateAdminStats === 'function') updateAdminStats();
        }
      }
    }

    // 4. Sync Users (Admin Users Table)
    if (typeof renderAdminUsersTable === 'function') {
      const remoteUsers = await AtikshAPI.getUsers();
      if (Array.isArray(remoteUsers)) {
        const usersHash = JSON.stringify(remoteUsers);
        if (_lastSyncUsersHash !== usersHash) {
          _lastSyncUsersHash = usersHash;
          renderAdminUsersTable();
          if (typeof updateAdminStats === 'function') updateAdminStats();
        }
      }
    }
  } catch (err) {
    // Quiet fail on temporary network hiccups
  }
}

// Check every 3 seconds for new inquiries or products from other phones/browsers
setInterval(syncRemoteDataCrossDevice, 3000);

// Also trigger immediate background sync on startup
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => setTimeout(syncRemoteDataCrossDevice, 100));
} else {
  setTimeout(syncRemoteDataCrossDevice, 100);
}

// Global export
window.applySiteConfigToDOM = applySiteConfigToDOM;
window.syncRemoteDataCrossDevice = syncRemoteDataCrossDevice;
