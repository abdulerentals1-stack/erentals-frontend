// app/categories/[slug]/page.jsx

import ProductCard from "@/components/ui/ProductCard";
import PaginationControls from "@/components/user/PaginationControls";

export const dynamic = "force-dynamic"; // Always fresh SSR

export default async function CategoryPage({ params, searchParams }) {
 const { slug } = await params;
  const newpaarams = await searchParams
  const page = parseInt(newpaarams?.page || "1");
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

  console.log(productData)
  const products = productData?.products || [];
  const total = productData?.total || 0;

  return (
    <div >
      <div className=" py-4 md:py-12 bg-[#003459] px-4 md:px-16 lg:px-16 flex items-center">
        <h1 className="font-semibold text-2xl text-white">
            Category / <span className="text-white"> {category.name}</span>
        </h1>
      </div>

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
