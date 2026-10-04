# Atiksh Pharma - Official Corporate Website & Admin Control Center

A modern, high-performance, mobile-responsive pharmaceutical website built for **Atiksh Pharma**. Engineered with clinical healthcare aesthetics, DCGI compliance standards, dynamic product search & filtering, multi-image product galleries, and a full-featured Admin Control Panel.

---

## 🚀 Key Features

1. **Front-End Architecture**:
   - `index.html`: Corporate homepage featuring an **animated pop-up hero title for ATIKSH PHARMA**, therapeutic divisions, flagship formulations, and industrial capabilities.
   - `about.html`: Clean placeholder for official Company Profile & leadership details.
   - `products.html`: Interactive product catalog with **instant live search**, category filtering, and **multi-image modal views** (supporting up to 5 product photos per medicine).
   - `services.html`: Contract manufacturing, third-party formulation production, institutional hospital supply, and 4-step manufacturing roadmap.
   - `contact.html`: Interactive trade inquiry form with product auto-prefill, office details, and customer FAQ.

2. **Admin Control Panel (`admin.html`)**:
   - **Formulations Manager**: Add, edit, and delete products from the live website in real-time.
   - **Up to 5 Photos per Product**: Upload or link up to 5 packaging/blister/bottle photos per formulation with instant thumbnail previews.
   - **Inquiries & Leads Viewer**: View and manage customer inquiries submitted via `contact.html`, with one-click CSV export.
   - **Company Settings**: Update company name, phone, email, and corporate address across the site.
   - **Local Sync Engine**: Changes saved in the Admin Panel immediately synchronize with the live website.

---

## 📁 Project Structure

```text
atiksh-pharma/
│
├── index.html          # Main Homepage (with animated ATIKSH PHARMA pop-up)
├── about.html          # Clean Company Profile
├── products.html       # Products Catalog with search, filters & 5-image gallery
├── services.html       # Contract Manufacturing & Institutional Supply
├── contact.html        # Contact Us & Business Inquiry Form
├── admin.html          # Full-Featured Admin Control Center
├── server.js           # Lightweight Node.js local web server
├── start-website.bat   # 1-Click launcher to host locally
├── README.md           # Documentation
│
├── css/
│   └── style.css       # Custom styles, pop-up animations, multi-image gallery
│
└── js/
    ├── main.js         # Products catalog engine, search, gallery modal, inquiry handler
    └── admin.js        # Admin panel engine, product CRUD, 5-image upload, leads viewer
```

---

## 🛠️ How to Open & Run Locally

### 1-Click Launch:
Double-click **`start-website.bat`** in the project folder to automatically start the local server and open `http://localhost:3000` in your default browser.

### Direct Admin Access:
Visit `http://localhost:3000/admin.html` to manage your products, upload photos, and view inquiries.
