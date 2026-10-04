/**
 * ATIKSH PHARMA - Scalable Pharmaceutical Product Master Database
 * Clean empty master catalog ready for real-time Admin Portal management.
 */

const ATIKSH_MASTER_PRODUCTS = [];

/**
 * Returns current catalog from localStorage or empty array.
 */
function getAtikshMasterCatalog() {
  try {
    const local = localStorage.getItem('atiksh_products');
    if (local !== null) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Error reading Atiksh products database.", e);
  }
  return [];
}

/**
 * Lookup single product by ID.
 */
function getAtikshProductById(productId) {
  if (!productId) return null;
  const catalog = getAtikshMasterCatalog();
  return catalog.find(p => p.id === productId || String(p.id).toLowerCase() === String(productId).toLowerCase()) || null;
}

/**
 * Clear all products utility.
 */
function clearAllProductsDatabase() {
  try {
    localStorage.setItem('atiksh_products', JSON.stringify([]));
  } catch (e) {
    console.error("Error clearing products", e);
  }
}

// Ensure default state is valid array if uninitialized
(function ensureCleanProductsDatabase() {
  try {
    const raw = localStorage.getItem('atiksh_products');
    if (raw === null) {
      localStorage.setItem('atiksh_products', JSON.stringify([]));
    }
  } catch (e) {}
})();
