import FiltersSidebar from "@/components/user/FiltersSidebar";
import PaginationControls from "@/components/user/PaginationControls";
import ProductCard from "@/components/ui/ProductCard";
import { getAllFilteredProducts } from "@/services/productService";

const siteDomain = process.env.NEXT_PUBLIC_BASE_URL || "https://e-rentals.in";

export const metadata = {
  title: "All Event & Party Rental Products in Mumbai | e-Rentals",
  description: "Browse our comprehensive event and party equipment rental catalog in Mumbai. Rent luxury furniture, sound systems, stage setup, lights and appliances at affordable daily rates.",
  alternates: {
    canonical: `${siteDomain}/products`,
  },
  openGraph: {
    title: "All Event & Party Rental Products in Mumbai | e-Rentals",
    description: "Browse our comprehensive event and party equipment rental catalog in Mumbai. Rent luxury furniture, sound systems, stage setup, lights and appliances at affordable daily rates.",
    url: `${siteDomain}/products`,
    siteName: "e-Rentals",
    images: [
      {
        url: typeof process !== "undefined" && process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}/e-rental-logo.png` : "https://e-rentals.in/e-rental-logo.png",
        width: 1200,
        height: 630,
        alt: "e-Rentals Event and Party Rental Catalog",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "All Event & Party Rental Products in Mumbai | e-Rentals",
    description: "Browse our comprehensive event and party equipment rental catalog in Mumbai. Rent luxury furniture, sound systems, stage setup, lights and appliances at affordable daily rates.",
    images: [typeof process !== "undefined" && process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}/e-rental-logo.png` : "https://e-rentals.in/e-rental-logo.png"],
  },
};

export const dynamic = "force-dynamic"; // SSR always fresh

export default async function ProductSearchPage({ searchParams }) {
  // ✅ Step 1: Await dynamic searchParams
  const newSearchParams = await searchParams;

  // ✅ Step 2: Create safe query object
  const queryObj = {};
  for (const key of Object.keys(newSearchParams ?? {})) {
    const value = newSearchParams[key];
    if (typeof value === "string") {
      queryObj[key] = value.trim();
    }
  }

  const page = parseInt(queryObj.page || "1");
  const limit = 20;

  // ✅ Step 3: Call backend API
  const res = await getAllFilteredProducts({ ...queryObj, page, limit });
  const products = res?.products || [];
  const total = res?.total || 0;


  return (
    <div className="relative z-0 px-2 sm:px-12 md:px-16 lg:px-12 2xl:px-2 md:py-12 py-4">
      {/* Mobile filters will be skipped here in SSR unless you make separate client component */}

      <div className="grid md:grid-cols-[260px_1fr] gap-6">
        {/* Sidebar Filters */}
        <aside className="relative z-0">
      <div className="sticky top-24 md:h-[calc(100vh-6rem)] overflow-hidden">
        <FiltersSidebar searchParams={queryObj} path="/products" />
      </div>
    </aside>

        {/* Product Grid */}
        <section>
          <div className="mb-8 px-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#003459] tracking-tight">Event & Party Equipment Rentals in Mumbai</h1>
            <p className="mt-2 text-gray-600 text-sm md:text-base max-w-4xl leading-relaxed">
              Explore Mumbai's premium event equipment catalog. Rent clean, high-quality event furniture, professional sound systems, stage lighting setup, and catering appliances. Enjoy on-time delivery and hassle-free logistics for weddings, corporate events, and private celebrations across Mumbai.
            </p>
          </div>

          {res?.products.length === 0 ? (
            <div className="text-center text-gray-500 mt-20 text-lg">
              No products found.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 px-2">
                {res?.products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              <div className="mt-6">
                <PaginationControls
                  page={page}
                  limit={limit}
                  total={total}
                  path="/products"
                  searchParams={queryObj}
                />
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
