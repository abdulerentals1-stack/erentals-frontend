// app/categories/[slug]/page.jsx

import ProductCard from "@/components/ui/ProductCard";
import PaginationControls from "@/components/user/PaginationControls";
import Script from "next/script";

export const dynamic = "force-dynamic"; // Always fresh SSR

const siteDomain = process.env.NEXT_PUBLIC_BASE_URL || "https://e-rentals.in";

// ✅ Dynamic Metadata for Category Page
export async function generateMetadata({ params }) {
  const { slug } = params;

  const catRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${slug}`, {
    cache: "no-store",
  });
  const catData = await catRes.json();
  const category = catData?.category;

  if (!category) {
    return {
      title: "Category not found - e-Rentals",
      description: "The category you are looking for does not exist.",
      alternates: { canonical: `${siteDomain}/categories/${slug}` },
    };
  }

  const categoryUrl = `${siteDomain}/categories/${category.slug}`;
  const imageUrl = category.image?.url || "/placeholder.jpg";

  return {
    title: category.metaTitle || category.name,
    description: category.metaDescription || "",
    keywords: category.metaKeywords || [],
    alternates: { canonical: categoryUrl },
    openGraph: {
      title: category.metaTitle || category.name,
      description: category.metaDescription || "",
      url: categoryUrl,
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: category.name,
        },
      ],
      siteName: "e-Rentals",
    },
    twitter: {
      card: "summary_large_image",
      title: category.metaTitle || category.name,
      description: category.metaDescription || "",
      images: [imageUrl],
      creator: "@erentals",
    },
  };
}

export default async function CategoryPage({ params, searchParams }) {
  const { slug } = params;
  const page = parseInt(searchParams?.page || "1");
  const limit = 20;

  // ✅ 1. Fetch category data by slug
  const catRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${slug}`, {
    cache: "no-store",
  });
  const catData = await catRes.json();
  const category = catData?.category;

  if (!category) {
    return (
      <div className="text-center py-10 text-gray-500">
        Category not found or removed.
      </div>
    );
  }

  // ✅ 2. Fetch products for this category
  const productRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products/search?categories=${category._id}&page=${page}&limit=${limit}`,
    { cache: "no-store" }
  );

  const productData = await productRes.json();
  const products = productData?.products || [];
  const total = productData?.total || 0;

  // ✅ 3. JSON-LD Structured Data for Google Rich Results
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: category.name,
    description: category.metaDescription || "",
    url: `${siteDomain}/categories/${category.slug}`,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteDomain },
        { "@type": "ListItem", position: 2, name: category.name, item: `${siteDomain}/categories/${category.slug}` },
      ],
    },
  };

  return (
    <div>
      {/* ✅ JSON-LD for SEO */}
      <Script
        id="category-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Page Header */}
      <div className="py-4 md:py-12 bg-[#003459] px-4 md:px-16 lg:px-16 flex items-center">
        <h1 className="font-semibold md:text-2xl text-md text-white">
          Category / <span className="text-white">{category.name}</span>
        </h1>
      </div>

      {/* Products Grid */}
      <div className="px-4 md:px-16 lg:px-16 py-6 md:py-12">
        {products.length === 0 ? (
          <div className="text-center text-gray-500 mt-20 text-lg">No products found.</div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            <div className="mt-6">
              <PaginationControls
                page={page}
                limit={limit}
                total={total}
                path={`/categories/${slug}`}
                searchParams={{}}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
