import { getProductBySlug } from "@/services/productService";
import ProductInfoSection from "@/components/user/product/ProductInfoSection";
import ProductDetailsTabs from "@/components/user/product/ProductDetailsTabs";
import Script from "next/script";

const siteDomain = process.env.NEXT_PUBLIC_BASE_URL || "https://e-rentals.in";

// ✅ Dynamic metadata for each product
export async function generateMetadata({ params }) {
  const { slug } = params;
  const data = await getProductBySlug(slug);
  const product = data?.product;

  if (!product) {
    return {
      title: "Product not found - e-Rentals",
      description: "The product you are looking for does not exist.",
      alternates: { canonical: `${siteDomain}/product/${slug}` },
    };
  }

  const productUrl = `${siteDomain}/product/${product.slug}`;

  // ✅ Handle canonical URL correctly
  // If product.isCanonical true => self URL
  // If product.isCanonical false => point to main/original product URL
  const canonicalUrl = product.isCanonical
    ? productUrl
    : `${siteDomain}/product/${product.slug}`; // replace with main product URL if you have one

  return {
    title: product.metaTitle || product.name,
    description: product.metaDescription || product.description,
    keywords: product.metaKeywords || [],
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: product.metaTitle || product.name,
      description: product.metaDescription,
      url: productUrl,
      type: "website",
      images: [
        {
          url: product.images?.[0]?.url || product.images?.[0] || "/default-image.jpg",
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
      siteName: "e-Rentals",
    },
    twitter: {
      card: "summary_large_image",
      title: product.metaTitle || product.name,
      description: product.metaDescription,
      images: [product.images?.[0]?.url || product.images?.[0] || "/default-image.jpg"],
      creator: "@erentals",
    },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = params;
  const data = await getProductBySlug(slug);
  const product = data?.product;

  if (!product) {
    return <div className="text-center py-20 text-xl">Product not found</div>;
  }

  // ✅ JSON-LD structured data for Google Rich Snippets
  const productStructuredData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: product.images?.map((img) => img.url || img),
    description: product.metaDescription || product.description,
    sku: product.productCode,
    brand: {
      "@type": "Brand",
      name: "e-Rentals",
    },
    offers: {
      "@type": "Offer",
      url: `${siteDomain}/product/${product.slug}`,
      priceCurrency: "INR",
      price: product.discountPrice || product.basePrice,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
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
      </div>
    </div>
  );
}
