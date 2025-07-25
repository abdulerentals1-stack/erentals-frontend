// app/product/[slug]/page.jsx

import { getProductBySlug } from '@/services/productService';
import ProductInfoSection from '@/components/user/product/ProductInfoSection';
import ProductDetailsTabs from '@/components/user/product/ProductDetailsTabs';

export default async function ProductPage({ params }) {
  const { slug } = await params;

  const data = await getProductBySlug(slug);
  const product = data?.product;

  if (!product) {
    return <div className="text-center py-20 text-xl">Product not found</div>;
  }

  return (
    <div className="max-w-8xl mx-auto md:px-4 md:py-6">
     <div className="max-w-6xl mx-auto px-4 py-6">
        <ProductInfoSection product={product} />
        <ProductDetailsTabs product={product} />
        </div>
    </div>
  );
}
