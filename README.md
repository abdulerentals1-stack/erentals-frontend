# 💻 e-Rentals Frontend Client Engine

Welcome to the premium frontend application for **e-Rentals.in**. Built using **Next.js 15 (App Router)** and styled with custom **TailwindCSS**, this application provides a highly performant, responsive, glassmorphic UX combined with search engine optimization (SEO) capabilities.

---

## 🛠️ Technology Stack
*   **Framework:** Next.js 15 (React 19) — App Router
*   **Styling System:** TailwindCSS v4 & Lucide Icons
*   **State Management & Forms:** Standard React Context, React Hook Form, Zod for validation
*   **HTTP Client:** Axios (With built-in interceptors and token refreshing in `@/lib/axios`)
*   **SEO Schema Scripts:** JSON-LD structured metadata injections
*   **Alert & Toast System:** Sonner Toasts
*   **PDF Generation:** `@react-pdf/renderer` for in-browser invoice and quotation generation

---

## 🚀 Quick Start Guide

### 1. Installation
Clone the repository, enter the directory, and install dependencies:
```bash
cd erentals-frontend
npm install
```

### 2. Set Up Environment Variables
Duplicate the environment template file:
```bash
cp .env.example .env.local
```
Open `.env.local` and configure your API routes:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key
```

### 3. Run Development Server
Start the frontend with hot module reloading:
```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser to inspect and run the application!

---

## 🚀 Technical Features & Architecture

### 1. Advanced Bulk Pricing Engine
*   **Single Source of Truth:** The client UI seamlessly calls the backend pricing API to ensure quantity-based volume tier discounts, day-wise variations, and service charges are 100% synchronized between the user cart and the admin panel.
*   **Intelligent Unit Formatting:** Dynamically adapts input rendering and pricing tier labels based on product configuration (e.g., Area-based `sq.ft`, Linear Length `ft`, or simple Quantity `pcs`).
*   **Real-time Bulk Discount Nudges:** Actively suggests users to add more units to unlock the next volume discount tier.

### 2. Comprehensive Admin Dashboard
*   **Inventory Management:** Create and edit products with highly configurable volume pricing matrices.
*   **Order & Quotation Tracking:** Process incoming orders, update statuses, and instantly preview and download beautifully styled PDF Quotations and Invoices without needing backend rendering.
*   **Live Metrics:** Chart.js powered visualization of rental analytics.

### 3. Technical SEO Framework (Premium Design)
*   **Hybrid Server-Client Routing:** Utilizes Server Components for data fetching and Next.js `generateMetadata()` for dynamic SEO tags, paired with Client Components for rich interactivity.
*   **Google Rich Schema Injections:** Dynamic FAQ schema mappings and Article schemas for services and case studies.
*   **Dynamic Sitemap:** Auto-indexing primary, product, and dynamic local pages.

---

## 📦 Directory Structure

```text
erentals-frontend/
├── src/
│   ├── app/                    # Next.js 15 App Router routing trees
│   │   ├── (user)/             # Customer layout pages (services, products, cart, checkout)
│   │   ├── admin/              # Management admin dashboard routing (orders, products, etc.)
│   │   ├── sitemap.xml/        # Dynamically compiled XML sitemaps
│   │   └── page.jsx            # Platform home page
│   ├── components/
│   │   ├── admin/              # Admin dashboard tables, charts, and PDF generators
│   │   ├── layouts/            # Persistent header, footer, and navbar designs
│   │   ├── ui/                 # Reusable skeletons, breadcrumbs, and base inputs
│   │   └── user/               # Customer-focused views, product inputs, and price boxes
│   ├── lib/                    # Axios instances, cookie/token managers
│   └── services/               # API connection layers (auth, products, orders, quotations)
├── .env.example                # Local environment template
└── tailwind.config.js          # Tailored layout tokens and design system
```

---

## 📧 Support & Maintenance
For help, bug reports, or updating production environment structures, contact the tech team at **`support@e-rentals.in`**.
