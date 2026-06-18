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
    thresholds,
  } = product;

  // Calculate true starting price (for 1 unit) if thresholds exist
  let displayPrice = discountPrice || basePrice;
  if (thresholds && thresholds.length > 0) {
    let matched = [...thresholds]
      .filter((t) => 1 >= t.value)
      .sort((a, b) => b.value - a.value)[0];
    
    if (matched) {
      displayPrice = discountPrice || basePrice;
    } else {
      displayPrice = basePrice;
    }
  }

  const imageUrl = images?.[0]?.url || '/placeholder.jpg';

  return (
    <div className="group flex flex-col h-full border border-gray-200/60 rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 bg-white relative">
      {discountPercent && (
        <div className="absolute top-2.5 left-2.5 bg-[#003459] text-white text-[11px] font-bold px-2 py-0.5 z-10 rounded shadow-sm">
          {discountPercent}% OFF
        </div>
      )}

      {/* ✅ Wrap image with Link */}
      <Link href={`/products/${slug}`} className="block w-full aspect-square relative bg-zinc-50 overflow-hidden">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw,
                (max-width: 1200px) 50vw,
                33vw"
        />
      </Link>

      <div className="p-3.5 flex flex-col flex-grow justify-between">
        <div className="space-y-2.5">
          {/* ✅ Wrap name with Link */}
          <Link href={`/products/${slug}`}>
            <h3 className="font-semibold text-sm leading-snug text-zinc-800 line-clamp-2 hover:text-blue-600 transition-colors">
                {name}
            </h3>
          </Link>

          <div className="flex flex-col mt-0.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[#003459] font-extrabold text-[22px] tracking-tight">₹{displayPrice}</span>
              <span className="text-gray-500 text-xs font-medium">/day</span>
              {basePrice > displayPrice && (
                <span className="text-gray-400 line-through text-[11px] ml-1">₹{basePrice}</span>
              )}
            </div>
            
            {/* Display threshold pricing as professional, flush-left text instead of a floating pill */}
            {thresholds && thresholds.length > 0 && discountPrice && (
              <p className="text-[11px] font-semibold text-emerald-600 tracking-tight mt-0.5">
                Bulk Offer: ₹{discountPrice}/day ({thresholds[0].value}+ {thresholds[0].unit})
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons Section */}
        <div className="mt-4 space-y-1.5">
          <AddToRentalButton 
            product={product} 
            className="w-full h-8 rounded-md bg-[#003459] hover:bg-[#002240] text-white shadow-sm text-xs font-semibold transition-all duration-300" 
          />
          <div className="flex gap-1.5">
            <AddToQuoteButton 
              product={product} 
              className="flex-1 h-8 rounded-md bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors duration-300" 
            />
            <AddToCartButton 
              product={product} 
              className="flex-1 h-8 rounded-md bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors duration-300" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
