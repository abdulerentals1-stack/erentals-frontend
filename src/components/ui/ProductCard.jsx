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

  // For the card listing view, qty is 1 — show discountPrice if available, otherwise basePrice.
  // If a threshold is matched at qty=1, use that threshold price instead.
  const firstMatchedAtOne = thresholds?.find((t) => t.value <= 1);
  let displayPrice = firstMatchedAtOne?.price || (discountPrice && discountPrice > 0 ? discountPrice : basePrice);

  // Best bulk offer = the lowest threshold price (highest qty tier)
  const sortedTiers = [...(thresholds || [])]
    .filter((t) => t.value > 0 && t.price > 0)
    .sort((a, b) => a.value - b.value); // ascending
  const firstBulkTier = sortedTiers[0]; // show the first bulk tier as a teaser

  // Dynamically calculate the discount percent for standard discount display
  const calculatedDiscountPercent = (basePrice > 0 && discountPrice > 0 && basePrice > discountPrice)
    ? Math.round(((basePrice - discountPrice) / basePrice) * 100)
    : 0;

  const imageUrl = images?.[0]?.url || '/placeholder.jpg';

  return (
    <div className="group flex flex-col h-full border border-gray-200/60 rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 bg-white relative">
      {calculatedDiscountPercent > 0 && (
        <div className="absolute top-2.5 left-2.5 bg-[#003459] text-white text-[11px] font-bold px-2 py-0.5 z-20 rounded shadow-sm">
          {calculatedDiscountPercent}% OFF
        </div>
      )}

      {/* ✅ Wrap image with Link */}
      <Link href={`/products/${slug}`} className="block w-full aspect-square relative bg-zinc-50 overflow-hidden flex items-center justify-center group-hover:bg-zinc-100 transition-colors">
        {/* Blurred Background Layer for uneven images */}
        <Image
          src={imageUrl}
          alt={`${name} background blur`}
          fill
          className="object-cover opacity-30 blur-2xl scale-110 saturate-150 group-hover:opacity-40 transition-opacity duration-500"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {/* Main Image */}
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-contain p-4 z-10 transition-transform duration-500 group-hover:scale-110 drop-shadow-sm"
          sizes="(max-width: 768px) 100vw, 50vw, 33vw"
        />
      </Link>

      <div className="p-3.5 flex flex-col flex-grow justify-between">
        <div className="space-y-2.5">
          {/* ✅ Wrap name with Link */}
          <Link href={`/products/${slug}`}>
            <h3 className="font-semibold text-sm leading-snug text-zinc-800 line-clamp-2 min-h-[40px] hover:text-blue-600 transition-colors">
                {name}
            </h3>
          </Link>

          <div className="flex flex-col mt-0.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[#003459] font-extrabold text-lg sm:text-[22px] tracking-tight">₹{displayPrice}</span>
              <span className="text-gray-500 text-[10px] sm:text-xs font-medium">/day</span>
              {basePrice > displayPrice && (
                <span className="text-gray-400 line-through text-[10px] sm:text-[11px] ml-1">₹{basePrice}</span>
              )}
            </div>
            
            {/* Bulk offer teaser from first threshold tier */}
            {firstBulkTier && firstBulkTier.value > 1 && (
              <p className="text-[11px] font-semibold text-emerald-600 tracking-tight mt-0.5">
                Bulk Offer: ₹{firstBulkTier.price}/day ({firstBulkTier.value}+ pcs)
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
          <div className="flex gap-1.5 w-full">
            <AddToQuoteButton 
              product={product} 
              className="flex-1 h-8 !px-1 sm:!px-2 rounded-md bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors duration-300" 
            />
            <AddToCartButton 
              product={product} 
              className="flex-1 h-8 !px-1 sm:!px-2 rounded-md bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors duration-300" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
