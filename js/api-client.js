/**
 * ATIKSH PHARMA - Centralized Multi-Device Real-Time Sync Client (api-client.js)
 * Supports:
 *  1. Self-hosted Node.js server (Default)
 *  2. Custom Cloud Backend URL (e.g. Render / Railway / Heroku / AWS / VPS)
 *  3. Free Firebase Realtime Database (100% serverless, works instantly on static hosts like Netlify/GitHub Pages/cPanel)
 *  4. Full Database Backup & One-Click Restore
 */

// Global default Firebase Database: Synchronizes across all devices, mobile phones, laptops, and static hosts
window.ATIKSH_FIREBASE_URL = window.ATIKSH_FIREBASE_URL || "https://atiksh-pharma-web-database-default-rtdb.firebaseio.com";

const AtikshAPI = (function() {
  function getCustomBackendUrl() {
    return localStorage.getItem('atiksh_cloud_api_url') || '';
  }

  function getFirebaseUrl() {
    let url = localStorage.getItem('atiksh_firebase_db_url') || window.ATIKSH_FIREBASE_URL || '';
    if (url && url.endsWith('/')) url = url.slice(0, -1);
    return url;
  }

  function getBaseUrl() {
    const custom = getCustomBackendUrl();
    if (custom) return custom.replace(/\/+$/, '');
    return window.location.origin;
  }

  // Generic REST request handler
  async function request(endpoint, method = 'GET', data = null) {
    const firebaseUrl = getFirebaseUrl();

    // 1. If Firebase Realtime Database is configured
    if (firebaseUrl) {
      try {
        const fbPath = endpoint.replace('/api/', '').replace(/\//g, '_');
        const fbEndpoint = `${firebaseUrl}/${fbPath}.json`;
        const opts = {
          method: method === 'POST' ? 'PUT' : method,
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store'
        };
        if (data && (method === 'POST' || method === 'PUT')) {
          opts.body = JSON.stringify(data);
        }
        const res = await fetch(fbEndpoint, opts);
        if (!res.ok) throw new Error(`Firebase HTTP ${res.status}`);
        const parsed = await res.json();
        return parsed;
      } catch (fbErr) {
        console.warn('Firebase sync notice:', fbErr);
        return null;
      }
    }

    // 2. Direct Node server or Custom Cloud Backend
    try {
      const baseUrl = getBaseUrl();
      const opts = {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      };
      if (data && (method === 'POST' || method === 'PUT')) {
        opts.body = JSON.stringify(data);
      }
      const res = await fetch(`${baseUrl}${endpoint}`, opts);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err) {
      return null;
    }
  }

  return {
    getBaseUrl,
    getFirebaseUrl,
    getCustomBackendUrl,

    // 1. PRODUCTS
    getProducts: async function() {
      const serverData = await request('/api/products', 'GET');
      if (serverData !== null && serverData !== undefined) {
        const list = Array.isArray(serverData) ? serverData : Object.values(serverData);
        localStorage.setItem('atiksh_products', JSON.stringify(list));
        return list;
      }
      try {
        const local = localStorage.getItem('atiksh_products');
        return local !== null ? JSON.parse(local) : [];
      } catch (e) {
        return [];
      }
    },
    saveProducts: async function(products) {
      localStorage.setItem('atiksh_products', JSON.stringify(products));
      await request('/api/products', 'POST', products);
    },

    // 2. INQUIRIES
    getInquiries: async function() {
      const serverData = await request('/api/inquiries', 'GET');
      if (serverData !== null && serverData !== undefined) {
        const list = Array.isArray(serverData) ? serverData : Object.values(serverData);
        localStorage.setItem('atiksh_inquiries', JSON.stringify(list));
        return list;
      }
      try {
        return JSON.parse(localStorage.getItem('atiksh_inquiries') || '[]');
      } catch (e) {
        return [];
      }
    },
    saveInquiries: async function(inquiries) {
      localStorage.setItem('atiksh_inquiries', JSON.stringify(inquiries));
      await request('/api/inquiries', 'POST', inquiries);
    },
    sendInquiry: async function(inquiry) {
      try {
        const local = JSON.parse(localStorage.getItem('atiksh_inquiries') || '[]');
        local.unshift(inquiry);
        localStorage.setItem('atiksh_inquiries', JSON.stringify(local));
      } catch (e) {}

      const firebaseUrl = getFirebaseUrl();
      if (firebaseUrl) {
        try {
          const res = await fetch(`${firebaseUrl}/inquiries.json`);
          const existing = (await res.json()) || [];
          const list = Array.isArray(existing) ? existing : Object.values(existing);
          list.unshift(inquiry);
          await fetch(`${firebaseUrl}/inquiries.json`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(list)
          });
          return { success: true };
        } catch (e) {}
      }

      return await request('/api/inquiries', 'POST', inquiry);
    },

    // 3. USERS
    getUsers: async function() {
      const serverData = await request('/api/users', 'GET');
      if (serverData !== null && serverData !== undefined) {
        const list = Array.isArray(serverData) ? serverData : Object.values(serverData);
        localStorage.setItem('atiksh_registered_users', JSON.stringify(list));
        return list;
      }
      try {
        return JSON.parse(localStorage.getItem('atiksh_registered_users') || '[]');
      } catch (e) {
        return [];
      }
    },
    saveUsers: async function(users) {
      localStorage.setItem('atiksh_registered_users', JSON.stringify(users));
      await request('/api/users', 'POST', users);
    },
    registerUser: async function(user) {
      try {
        const local = JSON.parse(localStorage.getItem('atiksh_registered_users') || '[]');
        local.unshift(user);
        localStorage.setItem('atiksh_registered_users', JSON.stringify(local));
      } catch (e) {}

      const firebaseUrl = getFirebaseUrl();
      if (firebaseUrl) {
        try {
          const res = await fetch(`${firebaseUrl}/users.json`);
          const existing = (await res.json()) || [];
          const list = Array.isArray(existing) ? existing : Object.values(existing);
          list.unshift(user);
          await fetch(`${firebaseUrl}/users.json`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(list)
          });
          return { success: true };
        } catch (e) {}
      }

      return await request('/api/users', 'POST', user);
    },

    // 4. SITE CONFIGURATION (Texts, Headings, Images)
    getConfig: async function() {
      const serverConfig = await request('/api/config', 'GET');
      if (serverConfig && typeof serverConfig === 'object' && Object.keys(serverConfig).length > 0) {
        localStorage.setItem('atiksh_site_config', JSON.stringify(serverConfig));
        return serverConfig;
      }
      try {
        const local = localStorage.getItem('atiksh_site_config');
        return local ? JSON.parse(local) : null;
      } catch (e) {
        return null;
      }
    },
    saveConfig: async function(config) {
      localStorage.setItem('atiksh_site_config', JSON.stringify(config));
      await request('/api/config', 'POST', config);
    },

    // 5. ADMIN AUTH (Password)
    getAdminPassword: async function() {
      const res = await request('/api/admin/password', 'GET');
      if (res && res.password) {
        localStorage.setItem('atiksh_admin_password', res.password);
        return res.password;
      }
      return localStorage.getItem('atiksh_admin_password') || 'admin123';
    },
    saveAdminPassword: async function(newPassword) {
      localStorage.setItem('atiksh_admin_password', newPassword);
      await request('/api/admin/password', 'POST', { password: newPassword });
    }
  };
})();

// Attach globally
window.AtikshAPI = AtikshAPI;

// Initial Auto-Sync on page load across all clients
async function initBackgroundCloudSync() {
  try {
    // 1. Sync Site Config
    const remoteConfig = await AtikshAPI.getConfig();
    if (remoteConfig && typeof applySiteConfigToDOM === 'function') {
      applySiteConfigToDOM();
    }

    // 2. Sync Products
    const remoteProds = await AtikshAPI.getProducts();
    if (remoteProds) {
      if (typeof initHomeFeaturedProducts === 'function') initHomeFeaturedProducts();
      if (typeof window._renderCatalog === 'function') window._renderCatalog();
      else if (typeof initProductsCatalog === 'function') initProductsCatalog();
      if (typeof initProductDetailPage === 'function') initProductDetailPage();
      if (typeof renderAdminProductsTable === 'function') renderAdminProductsTable();
    }

    // 3. Sync Inquiries & Users if in Admin Panel
    if (typeof renderAdminInquiriesTable === 'function') {
      await AtikshAPI.getInquiries();
      renderAdminInquiriesTable();
    }
    if (typeof renderAdminUsersTable === 'function') {
      await AtikshAPI.getUsers();
      renderAdminUsersTable();
    }
    if (typeof updateAdminStats === 'function') {
      updateAdminStats();
    }
  } catch (err) {
    console.debug('Background Cloud Sync:', err);
  }
}

window.initBackgroundCloudSync = initBackgroundCloudSync;
initBackgroundCloudSync();
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => setTimeout(initBackgroundCloudSync, 150));
}
