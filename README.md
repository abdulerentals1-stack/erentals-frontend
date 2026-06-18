# 💻 e-Rentals Frontend Client Engine

Welcome to the premium frontend application for **e-Rentals.in**. Built using **Next.js 15 (App Router)** and styled with custom **TailwindCSS**, this application provides a highly performant, responsive, glassmorphic UX combined with search engine optimization (SEO) capabilities.

---

## 🛠️ Technology Stack
*   **Framework:** Next.js 15 (React 19) — App Router
*   **Styling System:** TailwindCSS v3 & Lucide Icons
*   **State Management:** Standard React Context & Hooks
*   **HTTP Client:** Axios (With built-in interceptors and token refreshing in `@/lib/axios`)
*   **SEO Schema Scripts:** JSON-LD structured structured metadata injections
*   **Alert & Toast System:** Sonner Toasts

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
```

### 3. Run Development Server
Start the frontend with hot module reloading:
```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser to inspect and run the application!

---

## 🚀 Technical SEO Framework (Premium Design)

We have customized the architecture to maximize search engine discoverability:

### 1. Hybrid Server-Client Routing
To let crawlers read meta tags from initial payloads while keeping interactivity:
*   `services/[slug]/page.jsx` acts as a pure **Server Component** fetching data first, then exporting standard Next.js `async function generateMetadata()` to output titles, meta descriptions, og:images, and alternates.
*   `ServiceDetailClient.jsx` handles stateful sliders, navigation, and custom quote enquiry submissions.

### 2. Google Rich Schema Injections
*   **FAQ Page Schema:** Mapped dynamically across 100% of standard questions.
*   **Article Page Schema:** Structured schema injected inside service case studies.
*   **Dynamic Sitemap:** Located inside `src/app/sitemap.xml/route.js`, auto-indexing primary, product, and dynamic local pages.

### 3. Advanced Bulk Pricing Engine
*   **Dynamic Threshold Calculations:** Real-time quantity validation that triggers cascading bulk discount pricing blocks automatically.
*   **Consistent Premium UI:** Uses global design system constraints (`h-12`, `rounded-xl`) across cart, inputs, and toggle components.

---

## 📦 Directory Structure

```text
erentals-frontend/
├── src/
│   ├── app/                    # Next.js 15 App Router routing trees
│   │   ├── (user)/             # Customer layout pages (faq, services, products)
│   │   ├── admin/              # Management admin dashboard routing
│   │   ├── sitemap.xml/        # Dynamically compiled XML sitemaps
│   │   └── page.jsx            # Platform home page
│   ├── components/
│   │   ├── layouts/            # Persistent header, footer, and navbar designs
│   │   ├── ui/                 # Reusable skeletons, breadcrumbs, inputs
│   │   └── user/               # Specific customer-focused views & forms
│   ├── lib/                    # Axios instances, cookie/token managers
│   └── services/               # API connection layers (blog, product APIs)
├── .env.example                # Local environment template
└── tailwind.config.js          # Tailored layout tokens and design system
```

---

## 📧 Support & Maintenance
For help, bug reports, or updating production environment structures, contact the tech team at **`support@e-rentals.in`**.
