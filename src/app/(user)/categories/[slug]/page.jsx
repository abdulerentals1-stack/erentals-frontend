// app/categories/[slug]/page.jsx

import ProductCard from "@/components/ui/ProductCard";
import PaginationControls from "@/components/user/PaginationControls";

import Script from "next/script";

export const dynamic = "force-dynamic"; // Always fresh SSR

const siteDomain = process.env.NEXT_PUBLIC_BASE_URL || "https://e-rentals.in";

function getCleanCategoryName(name) {
  if (!name) return "";
  return name.replace(/^(Category\s*[\/\-]\s*)/i, "").trim();
}

export async function generateStaticParams() {
  try {
    const { fetchCategoriesISR } = await import('@/services/category');
    const res = await fetchCategoriesISR();
    const categories = res.data?.categories || [];
    return categories.map((c) => ({
      slug: c.slug,
    }));
  } catch (err) {
    console.error("Failed to generate static params for categories:", err);
    return [];
  }
}

// ✅ Dynamic Metadata for Category Page
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  if (!slug) {
    return {
      title: "Categories - e-Rentals",
      description: "Explore party and corporate event equipment categories on rent in Mumbai.",
      alternates: { canonical: `${siteDomain}/categories` },
    };
  }

  try {
    const catRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${slug}`, {
      next: { revalidate: 300 },
    });
    const catData = await catRes.json();
    const category = catData?.category;

    if (!category) {
      return {
        title: "Category not found - e-Rentals",
        description: "The category you are looking for does not exist.",
        alternates: { canonical: `${siteDomain}/categories/${slug}` },
        openGraph: {
          url: `${siteDomain}/categories/${slug}`,
        },
      };
    }

    const categoryUrl = `${siteDomain}/categories/${category.slug}`;
    const imageUrl = category.image?.url || "/placeholder.jpg";

    const cleanName = getCleanCategoryName(category.name);
    const fallbackDesc = category.metaDescription || `Rent premium ${cleanName} for party and event hire in Mumbai. Explore high-quality catalog items, transparent rates and instant quotation estimates at e-Rentals.`;

    const displayTitle = category.metaTitle || `${cleanName} on Rent in Mumbai | e-Rentals`;

    return {
      title: displayTitle,
      description: fallbackDesc,
      keywords: category.metaKeywords || [],
      alternates: { canonical: categoryUrl },
      openGraph: {
        title: displayTitle,
        description: fallbackDesc,
        url: categoryUrl,
        type: "website",
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: cleanName,
          },
        ],
        siteName: "e-Rentals",
      },
      twitter: {
        card: "summary_large_image",
        title: displayTitle,
        description: fallbackDesc,
        images: [imageUrl],
        creator: "@erentals",
      },
    };
  } catch (err) {
    console.error("Error generating metadata for category slug:", slug, err);
    return {
      title: "Event Category Hire - e-Rentals",
      description: "Explore and rent premium event equipment and party items in Mumbai.",
      alternates: { canonical: `${siteDomain}/categories/${slug}` },
      openGraph: {
        url: `${siteDomain}/categories/${slug}`,
      },
    };
  }
}

export default async function CategoryPage({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const slug = resolvedParams?.slug;
  const page = parseInt(resolvedSearchParams?.page || "1");
  const limit = 20;

  // ✅ 1. Fetch category data by slug
  const catRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${slug}`, {
    next: { revalidate: 300 },
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
    { next: { revalidate: 300 } }
  );

  const productData = await productRes.json();
  const products = productData?.products || [];
  const total = productData?.total || 0;

  const cleanName = getCleanCategoryName(category.name);

  // ✅ 3. JSON-LD Structured Data for Google Rich Results
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: cleanName,
    description: category.metaDescription || "",
    url: `${siteDomain}/categories/${category.slug}`,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteDomain },
        { "@type": "ListItem", position: 2, name: cleanName, item: `${siteDomain}/categories/${category.slug}` },
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

      <div className="py-4 md:py-12 bg-[#003459] px-4 md:px-16 lg:px-16 flex items-center">
        <h1 className="font-semibold md:text-2xl text-md text-white">
          <span className="text-white">{cleanName} Rentals in Mumbai</span>
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
