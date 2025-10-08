// app/tags/[slug]/page.jsx

import ProductCard from "@/components/ui/ProductCard";
import PaginationControls from "@/components/user/PaginationControls";
import Script from "next/script";

export const dynamic = "force-dynamic"; // Always fresh SSR

const siteDomain = process.env.NEXT_PUBLIC_BASE_URL || "https://e-rentals.in";

// ✅ Dynamic Metadata for Tag Page
export async function generateMetadata({ params }) {
  const { slug } = params;

  const tagRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tags/${slug}`, {
    cache: "no-store",
  });
  const tagData = await tagRes.json();
  const tag = tagData?.tag;

  if (!tag) {
    return {
      title: "Tag not found - e-Rentals",
      description: "The tag you are looking for does not exist.",
      alternates: { canonical: `${siteDomain}/tags/${slug}` },
    };
  }

  const tagUrl = `${siteDomain}/tags/${tag.slug}`;
  const imageUrl = tag.image?.url || "/placeholder.jpg";

  return {
    title: tag.metaTitle || tag.name,
    description: tag.metaDescription || "",
    keywords: tag.metaKeywords || [],
    alternates: { canonical: tagUrl },
    openGraph: {
      title: tag.metaTitle || tag.name,
      description: tag.metaDescription || "",
      url: tagUrl,
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: tag.name,
        },
      ],
      siteName: "e-Rentals",
    },
    twitter: {
      card: "summary_large_image",
      title: tag.metaTitle || tag.name,
      description: tag.metaDescription || "",
      images: [imageUrl],
      creator: "@erentals",
    },
  };
}

export default async function TagPage({ params, searchParams }) {
  const { slug } = params;
  const page = parseInt(searchParams?.page || "1");
  const limit = 20;

  // ✅ 1. Fetch tag data by slug
  const tagRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tags/${slug}`, {
    cache: "no-store",
  });
  const tagData = await tagRes.json();
  const tag = tagData?.tag;

  if (!tag) {
    return (
      <div className="text-center py-10 text-gray-500">
        Tag not found or removed.
      </div>
    );
  }

  // ✅ 2. Fetch products for this tag
  const productRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products/search?tags=${tag._id}&page=${page}&limit=${limit}`,
    { cache: "no-store" }
  );

  const productData = await productRes.json();
  const products = productData?.products || [];
  const total = productData?.total || 0;

  // ✅ 3. JSON-LD Structured Data for Google Rich Results
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: tag.name,
    description: tag.metaDescription || "",
    url: `${siteDomain}/tags/${tag.slug}`,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteDomain },
        { "@type": "ListItem", position: 2, name: tag.name, item: `${siteDomain}/tags/${tag.slug}` },
      ],
    },
  };

  return (
    <div>
      {/* ✅ JSON-LD for SEO */}
      <Script
        id="tag-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Page Header */}
      <div className="py-4 md:py-12 bg-[#003459] px-4 md:px-16 lg:px-16 flex items-center">
        <h1 className="font-semibold md:text-2xl text-md text-white">
          <span className="text-white">{tag.name}</span>
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
                path={`/tags/${slug}`}
                searchParams={{}}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
