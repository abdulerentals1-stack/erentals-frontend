import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://e-rentals.in";

export async function GET() {
  // --- 1. Static pages ---
  const staticPages = [
    "",
    "about-us",
    "contact-us",
    "terms-and-conditions",
    "privacy-policy", // add other static pages if any
    "shipping-and-delivery",
    "payment-policy",
    "products"
    
  ];

  const staticUrls = staticPages.map(
    (page) => `<url><loc>${BASE_URL}/${page}</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>`
  );

  // --- 2. Fetch categories ---
  const categoriesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
    cache: "no-store",
  });
  const categoriesData = await categoriesRes.json();
  const categories = categoriesData?.categories || [];

  const categoryUrls = categories.map(
    (cat) =>
      `<url><loc>${BASE_URL}/categories/${cat.slug}</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>`
  );

  // --- 3. Fetch tags ---
  const tagsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tags`, {
    cache: "no-store",
  });
  const tagsData = await tagsRes.json();
  const tags = tagsData?.tags || [];

  const tagUrls = tags.map(
    (tag) =>
      `<url><loc>${BASE_URL}/tags/${tag.slug}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>`
  );

  // --- 4. Fetch products ---
  const productsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
    cache: "no-store",
  });
  const productsData = await productsRes.json();
  const products = productsData?.products || [];

  const productUrls = products.map(
    (prod) =>
      `<url><loc>${BASE_URL}/products/${prod.slug}</loc><changefreq>daily</changefreq><priority>1.0</priority></url>`
  );

  // --- 5. Combine all URLs ---
  const allUrls = [...staticUrls, ...categoryUrls, ...tagUrls, ...productUrls].join("");

  // --- 6. Return XML ---
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${allUrls}
  </urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
