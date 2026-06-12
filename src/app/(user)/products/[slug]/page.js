import { getProductBySlug, getFilteredProducts } from "@/services/productService";
import ProductInfoSection from "@/components/user/product/ProductInfoSection";
import ProductDetailsTabs from "@/components/user/product/ProductDetailsTabs";
import ProductCard from "@/components/ui/ProductCard";

import Script from "next/script";

const siteDomain = process.env.NEXT_PUBLIC_BASE_URL || "https://e-rentals.in";
const logoUrl = "https://blr1.vultrobjects.com/erental-object/378f01fe-2344-4c35-90d2-07dcd2236dd8.png";

function getCleanCategoryName(name) {
  if (!name) return "";
  return name.replace(/^(Category\s*[\/\-]\s*)/i, "").trim();
}

export async function generateStaticParams() {
  try {
    const { getFilteredProducts } = await import('@/services/productService');
    const res = await getFilteredProducts({ limit: 500 });
    const products = res?.products || [];
    return products.map((p) => ({
      slug: p.slug,
    }));
  } catch (err) {
    console.error("Failed to generate static params for products:", err);
    return [];
  }
}

// ✅ Dynamic metadata for each product
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  if (!slug) {
    return {
      title: "Products - e-Rentals",
      description: "Premium event and equipment rentals in Mumbai.",
      alternates: { canonical: `${siteDomain}/products` },
    };
  }

  try {
    const data = await getProductBySlug(slug);
    const product = data?.product;

    if (!product) {
      return {
        title: "Product not found - e-Rentals",
        description: "The product you are looking for does not exist.",
        alternates: { canonical: `${siteDomain}/products/${slug}` },
        openGraph: {
          url: `${siteDomain}/products/${slug}`,
        },
      };
    }

    const productUrl = `${siteDomain}/products/${product.slug}`;

    // ✅ Handle canonical URL correctly
    // If product.isCanonical true => self URL
    // If product.isCanonical false => point to main/original product URL
    const canonicalUrl = product.isCanonical
      ? productUrl
      : `${siteDomain}/products/${product.slug}`; // replace with main product URL if you have one

    const fallbackDescription = product.metaDescription || (product.description ? `${product.description.slice(0, 150)}...` : "Premium event and equipment rentals in Mumbai on e-Rentals.");

    return {
      title: product.metaTitle || `${product.name} on Rent in Mumbai – e-Rentals`,
      description: fallbackDescription,
      keywords: product.metaKeywords || [],
      alternates: { canonical: canonicalUrl },
      openGraph: {
        title: product.metaTitle || `${product.name} on Rent in Mumbai – e-Rentals`,
        description: fallbackDescription,
        url: productUrl,
        type: "website",
        images: [
          {
            url: product.images?.[0]?.url || product.images?.[0] || logoUrl,
            width: 1200,
            height: 630,
            alt: product.name,
          },
        ],
        siteName: "e-Rentals",
      },
      twitter: {
        card: "summary_large_image",
        title: product.metaTitle || `${product.name} on Rent in Mumbai – e-Rentals`,
        description: fallbackDescription,
        images: [product.images?.[0]?.url || product.images?.[0] || logoUrl],
        creator: "@erentals",
      },
    };
  } catch (err) {
    console.error("Error generating metadata for product slug:", slug, err);
    return {
      title: "Event Equipment Rental - e-Rentals",
      description: "Rent premium party and corporate event equipment in Mumbai at best prices.",
      alternates: { canonical: `${siteDomain}/products/${slug}` },
      openGraph: {
        url: `${siteDomain}/products/${slug}`,
      },
    };
  }
}

export default async function ProductPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  const data = await getProductBySlug(slug);
  const product = data?.product;

  if (!product) {
    return <div className="text-center py-20 text-xl">Product not found</div>;
  }

  const categoryId = typeof product.category === 'object' ? product.category._id : product.category;
  let relatedProducts = [];
  if (categoryId) {
    try {
      const relatedRes = await getFilteredProducts({ categories: categoryId, limit: 5 });
      relatedProducts = (relatedRes?.products || []).filter(p => p._id !== product._id).slice(0, 4);
    } catch (err) {
      console.error("Failed to fetch related products:", err);
    }
  }

  // ✅ JSON-LD structured data for Google Rich Snippets
  const productStructuredData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: product.images?.map((img) => img.url || img),
    description: product.metaDescription || product.description,
    sku: product.productCode,
    url: `${siteDomain}/products/${product.slug}`,
    brand: {
      "@type": "Brand",
      name: "e-Rentals",
    },
    offers: {
      "@type": "Offer",
      url: `${siteDomain}/products/${product.slug}`,
      priceCurrency: "INR",
      price: product.discountPrice || product.basePrice,
      priceValidUntil: "2027-12-31",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/UsedCondition",
      seller: {
        "@type": "Organization",
        name: "e-Rentals",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.averageRating || 4,
      reviewCount: product.totalRatings || 1,
    },
  };

  return (
    <div className="max-w-8xl mx-auto md:px-4 md:py-6">
      {/* ✅ Inject Product JSON-LD */}
      <Script
        id="product-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productStructuredData),
        }}
      />

      <div className="max-w-6xl mx-auto px-4 py-6">

        <ProductInfoSection product={product} />
        <ProductDetailsTabs product={product} />
        
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-10 border-t border-gray-100 dark:border-zinc-800">
            <h2 className="text-xl sm:text-2xl font-bold text-[#003459] dark:text-white mb-6">
              You May Also Like – Related Products
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
