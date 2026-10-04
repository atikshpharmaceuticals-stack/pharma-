const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;
const DATA_DIR = path.join(__dirname, 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf'
};

function readJsonFile(filename, defaultValue) {
  const filePath = path.join(DATA_DIR, filename);
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error(`Error reading ${filename}:`, err);
  }
  return defaultValue;
}

function writeJsonFile(filename, data) {
  const filePath = path.join(DATA_DIR, filename);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error(`Error writing ${filename}:`, err);
    return false;
  }
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 50 * 1024 * 1024) { // 50MB max (for base64 product images)
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        resolve({});
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=UTF-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Cache-Control': 'no-cache, no-store, must-revalidate'
  });
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  const [pathname] = req.url.split('?');

  // Handle CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
    return;
  }

  // -------------------------------------------------------------------------
  // REST API Endpoints for Central Multi-Device Database
  // -------------------------------------------------------------------------
  if (pathname.startsWith('/api/')) {
    try {
      // 1. PRODUCTS API
      if (pathname === '/api/products') {
        if (req.method === 'GET') {
          const products = readJsonFile('products.json', []);
          return sendJson(res, 200, products);
        }
        if (req.method === 'POST') {
          const body = await parseBody(req);
          // body can be full array of products or single product
          let products = readJsonFile('products.json', []);
          if (Array.isArray(body)) {
            products = body;
          } else if (body && body.id) {
            const idx = products.findIndex(p => p.id === body.id);
            if (idx > -1) {
              products[idx] = body;
            } else {
              products.unshift(body);
            }
          }
          writeJsonFile('products.json', products);
          return sendJson(res, 200, { success: true, count: products.length, data: products });
        }
      }

      // 2. INQUIRIES API
      if (pathname === '/api/inquiries') {
        if (req.method === 'GET') {
          const inquiries = readJsonFile('inquiries.json', []);
          return sendJson(res, 200, inquiries);
        }
        if (req.method === 'POST') {
          const newInquiry = await parseBody(req);
          const inquiries = readJsonFile('inquiries.json', []);
          if (Array.isArray(newInquiry)) {
            writeJsonFile('inquiries.json', newInquiry);
            return sendJson(res, 200, { success: true, data: newInquiry });
          } else if (newInquiry && (newInquiry.name || newInquiry.id)) {
            if (!newInquiry.id) newInquiry.id = 'INQ-' + Date.now();
            if (!newInquiry.date) newInquiry.date = new Date().toLocaleString();
            inquiries.unshift(newInquiry);
            writeJsonFile('inquiries.json', inquiries);
            return sendJson(res, 201, { success: true, data: newInquiry });
          }
          return sendJson(res, 400, { error: 'Invalid inquiry data' });
        }
      }

      // 3. REGISTERED USERS API
      if (pathname === '/api/users') {
        if (req.method === 'GET') {
          const users = readJsonFile('users.json', []);
          return sendJson(res, 200, users);
        }
        if (req.method === 'POST') {
          const body = await parseBody(req);
          const users = readJsonFile('users.json', []);
          if (Array.isArray(body)) {
            writeJsonFile('users.json', body);
            return sendJson(res, 200, { success: true, data: body });
          } else if (body && (body.email || body.phone)) {
            const idx = users.findIndex(u => u.email === body.email || (body.phone && u.phone === body.phone));
            if (idx > -1) {
              users[idx] = { ...users[idx], ...body };
            } else {
              users.unshift(body);
            }
            writeJsonFile('users.json', users);
            return sendJson(res, 200, { success: true, data: body });
          }
          return sendJson(res, 400, { error: 'Invalid user payload' });
        }
      }

      // 4. SITE CONFIGURATION (Texts, Headings, Images) API
      if (pathname === '/api/config') {
        if (req.method === 'GET') {
          const config = readJsonFile('site-config.json', null);
          return sendJson(res, 200, config || {});
        }
        if (req.method === 'POST') {
          const newConfig = await parseBody(req);
          writeJsonFile('site-config.json', newConfig);
          return sendJson(res, 200, { success: true, data: newConfig });
        }
      }

      // 5. ADMIN AUTH SETTINGS (Password) API
      if (pathname === '/api/admin/password') {
        if (req.method === 'GET') {
          const pwdObj = readJsonFile('admin-auth.json', { password: '' });
          return sendJson(res, 200, pwdObj);
        }
        if (req.method === 'POST') {
          const body = await parseBody(req);
          if (body && body.password) {
            writeJsonFile('admin-auth.json', { password: body.password });
            return sendJson(res, 200, { success: true });
          }
          return sendJson(res, 400, { error: 'Password required' });
        }
      }

      return sendJson(res, 404, { error: 'API endpoint not found' });
    } catch (apiErr) {
      console.error('API Error:', apiErr);
      return sendJson(res, 500, { error: apiErr.message });
    }
  }

  // -------------------------------------------------------------------------
  // Static File Serving
  // -------------------------------------------------------------------------
  let reqUrl = pathname;
  if (reqUrl === '/') reqUrl = '/index.html';

  const safePath = path.normalize(reqUrl).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(PUBLIC_DIR, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Access-Control-Allow-Origin': '*'
    });

    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}/ (Bound to all network interfaces)`);
});
