'use client';

import Image from 'next/image';
import Link from 'next/link';
import AddToCartButton from './AddToCartButton';
import AddToQuoteButton from './AddToQuoteButton';
import AddToRentalButton from './AddToRentalButton';

export default function ProductCard({ product }) {
  const {
    _id: id,
    name,
    images,
    basePrice,
    discountPrice,
    discountPercent,
    slug,
  } = product;

  const imageUrl = images?.[0]?.url || '/placeholder.jpg';

  return (
    <div className="border rounded-md overflow-hidden shadow-sm hover:shadow-md transition duration-300 bg-white relative">
      {discountPercent && (
        <div className="absolute top-0 right-0 bg-blue-900 text-white text-xs px-2 py-1 z-10 rounded-bl">
          {discountPercent}% OFF
        </div>
      )}

      {/* ✅ Wrap image with Link */}
      <Link href={`/products/${slug}`} className="block w-full aspect-square relative group">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-contain bg-white transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw,
                (max-width: 1200px) 50vw,
                33vw"
          placeholder="blur"
          blurDataURL="/placeholder.jpg"
        />
      </Link>


      <div className="p-3 space-y-1">
        {/* ✅ Wrap name with Link */}
        <Link href={`/products/${slug}`}>
          <p className="font-semibold text-sm line-clamp-2 hover:underline">
              {name?.split(" ").slice(0, 3).join(" ")} 
              {name?.split(" ").length > 5 && " ..."}
          </p>
        </Link>

        <div className="flex justify-between text-sm">
          <span className="text-gray-500 line-through">₹{basePrice}</span>
          <span className="text-black font-semibold">₹{discountPrice}/day</span>
        </div>
      </div>

      <div className="grid grid-cols-2 text-xs text-center border-t border-b">
        <AddToQuoteButton product={product} />
        <AddToCartButton product={product} />
      </div>

      <AddToRentalButton product={product} />
    </div>
  );
}
