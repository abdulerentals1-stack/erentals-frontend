import ProductCard from "@/components/ui/ProductCard";

import Script from "next/script";

export const revalidate = 600; // Revalidate every 10 minutes (ISR)

const siteDomain = process.env.NEXT_PUBLIC_BASE_URL || "https://e-rentals.in";

export const metadata = {
  title: "Furniture Rental in Bandra (East & West) | e-Rentals Mumbai",
  description: "Rent premium event furniture, VIP sofas, chairs, and banquet tables in Bandra, Mumbai. Fast local delivery, professional setup, and transparent rates.",
  alternates: {
    canonical: `${siteDomain}/furniture-rental-bandra`,
  },
};

export default async function BandraFurniturePage() {
  let category = null;
  let products = [];
  try {
    const catRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/furniture`, {
      next: { revalidate: 600 },
    });
    const catData = await catRes.json();
    category = catData?.category;

    if (category) {
      const productRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/search?categories=${category._id}&limit=12`,
        { next: { revalidate: 600 } }
      );
      const productData = await productRes.json();
      products = productData?.products || [];
    }
  } catch (err) {
    console.error("Failed to fetch Bandra furniture products:", err);
  }

  const locationSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "e-Rentals Bandra Furniture Hire",
    "image": "https://e-rentals.in/e-rental-logo.png",
    "telephone": "+919867348165",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Bandra East & West",
      "addressLocality": "Mumbai",
      "addressRegion": "MH",
      "postalCode": "400050",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "19.0596",
      "longitude": "72.8295"
    }
  };

  return (
    <div>
      <Script
        id="bandra-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(locationSchema) }}
      />

      <div className="py-8 md:py-16 bg-[#003459] px-4 md:px-16 text-center">
        <h1 className="font-extrabold text-2xl md:text-4xl text-white mb-3">
          Premium Furniture Rental in Bandra, Mumbai
        </h1>
        <p className="text-gray-200 max-w-3xl mx-auto text-sm md:text-base leading-relaxed">
          Planning an event in Bandra East, Bandra West, Pali Hill, or BKC (Bandra Kurla Complex)? e-Rentals provides top-quality chairs, luxury VIP sofas, exhibition tables, and bar stools on hire with fast local transport and professional venue setup.
        </p>
      </div>

      <div className="px-4 md:px-16 lg:px-16 py-6 md:py-12 max-w-7xl mx-auto">


        {/* Local Copy Section */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 mb-10 shadow-sm">
          <h2 className="text-xl sm:text-2xl font-bold text-[#003459] dark:text-white mb-4">
            Bandra's Trusted Event Furniture Hire Services
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
            Bandra is the undisputed cultural and elite hub of Mumbai. From high-powered corporate meetings and summits in BKC, to lavish wedding banquets, private parties, or art exhibits—the quality and promptness of furniture services are paramount. e-Rentals connects you with top-rated local vendors with guaranteed delivery timelines.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm text-gray-500 dark:text-gray-400">
            <li><strong>Premium Seating:</strong> Sleek leather chairs, banquet chairs, cushion seating, and bar stools on rent.</li>
            <li><strong>Luxury Lounge Sofas:</strong> VIP luxury single/double seaters and pristine white couches for grand receptions.</li>
            <li><strong>Conference Tables:</strong> Executive meeting tables, food counter tables, and registration desks.</li>
          </ul>
        </div>

        {products.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">No local products found currently.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
