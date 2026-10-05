/**
 * ATIKSH PHARMA - Centralized Multi-Device Railway & Node Cloud API Client (api-client.js)
 * Connects directly to Railway.app cloud backend or self-hosted Node server.
 * Synchronizes Formulations, Inquiries, User Accounts, and Site Config in real-time.
 */

const AtikshAPI = (function() {
  function getCustomBackendUrl() {
    return localStorage.getItem('atiksh_cloud_api_url') || '';
  }

  function getBaseUrl() {
    const custom = getCustomBackendUrl();
    if (custom) return custom.replace(/\/+$/, '');
    return window.location.origin;
  }

  // Central REST request handler for Railway.app & Node backend
  async function request(endpoint, method = 'GET', data = null) {
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
      console.warn(`Railway API notice (${endpoint}):`, err.message);
      return null;
    }
  }

  return {
    getBaseUrl,
    getCustomBackendUrl,

    // 1. PRODUCTS (Formulations)
    getProducts: async function() {
      const serverData = await request('/api/products', 'GET');
      if (serverData !== null && serverData !== undefined) {
        const list = Array.isArray(serverData) ? serverData : (serverData.data || Object.values(serverData));
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

    // 2. INQUIRIES (Customer Leads)
    getInquiries: async function() {
      const serverData = await request('/api/inquiries', 'GET');
      if (serverData !== null && serverData !== undefined) {
        const list = Array.isArray(serverData) ? serverData : (serverData.data || Object.values(serverData));
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

      return await request('/api/inquiries', 'POST', inquiry);
    },

    // 3. USERS (Registered Accounts)
    getUsers: async function() {
      const serverData = await request('/api/users', 'GET');
      if (serverData !== null && serverData !== undefined) {
        const list = Array.isArray(serverData) ? serverData : (serverData.data || Object.values(serverData));
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

      return await request('/api/users', 'POST', user);
    },

    // 4. SITE CONFIGURATION (Texts, Headings, Images)
    getConfig: async function() {
      const serverConfig = await request('/api/config', 'GET');
      if (serverConfig && typeof serverConfig === 'object' && Object.keys(serverConfig).length > 0) {
        const confData = serverConfig.data || serverConfig;
        localStorage.setItem('atiksh_site_config', JSON.stringify(confData));
        return confData;
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
    console.debug('Railway Cloud Sync notice:', err);
  }
}

window.initBackgroundCloudSync = initBackgroundCloudSync;
initBackgroundCloudSync();
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => setTimeout(initBackgroundCloudSync, 150));
}
