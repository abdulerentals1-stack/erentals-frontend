import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://e-rentals.in";

export async function GET() {
  const lastmodDate = new Date().toISOString().split('T')[0];

  // --- 1. Static pages ---
  const staticPages = [
    "",
    "about-us",
    "contact-us",
    "terms-and-conditions",
    "privacy-policy", 
    "shipping-and-delivery",
    "payment-policy",
    "products",
    "services",
    "faq",
    "furniture-rental-andheri",
    "furniture-rental-bandra"
  ];

  const staticUrls = staticPages.map(
    (page) => `<url><loc>${BASE_URL}/${page}</loc><lastmod>${lastmodDate}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`
  );

  // --- 2. Fetch categories ---
  let categoryUrls = [];
  try {
    const categoriesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
      next: { revalidate: 3600 },
    });
    if (categoriesRes.ok) {
      const categoriesData = await categoriesRes.json();
      const categories = categoriesData?.categories || [];
      categoryUrls = categories.map(
        (cat) =>
          `<url><loc>${BASE_URL}/categories/${cat.slug}</loc><lastmod>${cat.updatedAt ? cat.updatedAt.split('T')[0] : lastmodDate}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>`
      );
    }
  } catch (err) {
    console.error("Sitemap category fetch error:", err);
  }

  // --- 3. Fetch tags ---
  let tagUrls = [];
  try {
    const tagsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tags`, {
      next: { revalidate: 3600 },
    });
    if (tagsRes.ok) {
      const tagsData = await tagsRes.json();
      const tags = tagsData?.tags || [];
      tagUrls = tags.map(
        (tag) =>
          `<url><loc>${BASE_URL}/tags/${tag.slug}</loc><lastmod>${tag.updatedAt ? tag.updatedAt.split('T')[0] : lastmodDate}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>`
      );
    }
  } catch (err) {
    console.error("Sitemap tag fetch error:", err);
  }

  // --- 4. Fetch products ---
  let productUrls = [];
  try {
    const productsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
      next: { revalidate: 3600 },
    });
    if (productsRes.ok) {
      const productsData = await productsRes.json();
      const products = productsData?.products || [];
      productUrls = products.map(
        (prod) =>
          `<url><loc>${BASE_URL}/products/${prod.slug}</loc><lastmod>${prod.updatedAt ? prod.updatedAt.split('T')[0] : lastmodDate}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>`
      );
    }
  } catch (err) {
    console.error("Sitemap product fetch error:", err);
  }

  let serviceUrls = [];
  try {
    const servicesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services?limit=100`, {
      next: { revalidate: 3600 },
    });
    if (servicesRes.ok) {
      const servicesData = await servicesRes.json();
      const services = servicesData?.services || [];
      serviceUrls = services.map(
        (serviceItem) =>
          `<url><loc>${BASE_URL}/services/${serviceItem.slug}</loc><lastmod>${serviceItem.updatedAt ? serviceItem.updatedAt.split('T')[0] : lastmodDate}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>`
      );
    }
  } catch (err) {
    console.error("Sitemap services fetch error:", err);
  }

  // --- 6. Combine all URLs ---
  const allUrls = [...staticUrls, ...categoryUrls, ...tagUrls, ...productUrls, ...serviceUrls].join("");

  // --- 7. Return XML ---
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${allUrls}
  </urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=600"
    },
  });
}
