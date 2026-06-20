import ProductCard from "@/components/ui/ProductCard";

import Script from "next/script";

export const dynamic = "force-dynamic";

const siteDomain = process.env.NEXT_PUBLIC_BASE_URL || "https://e-rentals.in";

export const metadata = {
  title: "Furniture Rental in Andheri (East & West) | e-Rentals Mumbai",
  description: "Rent premium event furniture, VIP sofas, chairs, and banquet tables in Andheri, Mumbai. Fast local delivery, professional setup, and transparent rates.",
  alternates: {
    canonical: `${siteDomain}/furniture-rental-andheri`,
  },
};

export default async function AndheriFurniturePage() {
  let category = null;
  let products = [];
  try {
    const catRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/furniture`, {
      cache: "no-store",
    });
    const catData = await catRes.json();
    category = catData?.category;

    if (category) {
      const productRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/search?categories=${category._id}&limit=12`,
        { cache: "no-store" }
      );
      const productData = await productRes.json();
      products = productData?.products || [];
    }
  } catch (err) {
    console.error("Failed to fetch Andheri furniture products:", err);
  }

  const locationSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "e-Rentals Andheri Furniture Hire",
    "image": "https://e-rentals.in/e-rental-logo.png",
    "telephone": "+919867348165",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Andheri East & West",
      "addressLocality": "Mumbai",
      "addressRegion": "MH",
      "postalCode": "400053",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "19.1136",
      "longitude": "72.8697"
    }
  };

  return (
    <div>
      <Script
        id="andheri-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(locationSchema) }}
      />

      <div className="py-8 md:py-16 bg-[#003459] px-4 md:px-16 text-center">
        <h1 className="font-extrabold text-2xl md:text-4xl text-white mb-3">
          Premium Furniture Rental in Andheri, Mumbai
        </h1>
        <p className="text-gray-200 max-w-3xl mx-auto text-sm md:text-base leading-relaxed">
          Planning an event in Andheri East, Andheri West, Lokhandwala, or Marol? e-Rentals provides top-quality chairs, luxury VIP sofas, exhibition tables, and bar stools on hire with fast local transport and professional venue setup.
        </p>
      </div>

      <div className="px-4 md:px-16 lg:px-16 py-6 md:py-12 max-w-7xl mx-auto">


        {/* Local Copy Section */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 mb-10 shadow-sm">
          <h2 className="text-xl sm:text-2xl font-bold text-[#003459] dark:text-white mb-4">
            Andheri's Trusted Event Furniture Hire Services
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
            Andheri is the commercial and social nerve center of Mumbai. From corporate exhibitions at Bombay Exhibition Centre (BEC) / Nesco, to glamorous weddings in Juhu and Versova, or private birthday events in Lokhandwala—the furniture demands are diverse. e-Rentals simplifies renting with zero logistics hassle.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm text-gray-500 dark:text-gray-400">
            <li><strong>Event Chairs:</strong> VIP chairs, plastic chairs, cushion chairs, and bar stools on rent.</li>
            <li><strong>VIP Sofas & Couches:</strong> Classy leather sofas and plush armchairs for weddings and conferences.</li>
            <li><strong>Tables & Counters:</strong> Round banquet tables, food buffet counters, and glass exhibition desks.</li>
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
