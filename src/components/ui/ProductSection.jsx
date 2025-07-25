// app/components/ProductSection.jsx
import ProductCard from './ProductCard';
import { getFlaggedProducts } from '@/services/productService';
import { Store } from 'lucide-react';
import Link from 'next/link';

export default async function ProductSection({ title, type }) {
  const data = await getFlaggedProducts(type);
  const products = data?.products?.slice(0, 10) || [];

  if (!products.length) return null;

  return (
    <section className="py-6">
      <div className="px-4 sm:px-6 lg:px-8">
         <div className="items-center justify-between border-b-4 border-[#003459] inline-block pb-2 mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          {/* <Link href={`/products/${type}`} className="text-sm text-blue-600 hover:underline flex items-center gap-1">
            <Store size={16} />
            See All
          </Link> */}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
