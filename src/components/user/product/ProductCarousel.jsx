'use client';
import Image from 'next/image';
import { useState } from 'react';

export default function ProductCarousel({ images = [], productName = "Product" }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = images?.[selectedIndex]?.url || '/placeholder.jpg';

  return (
    <div>
      {/* ✅ Main Product Image */}
      <div className="relative w-full max-h-[50vh] md:max-h-[500px] border border-gray-200/60 rounded-xl overflow-hidden bg-zinc-50 flex items-center justify-center group shadow-sm">
        {/* Blurred Background Layer for uneven images */}
        <Image
          src={selectedImage}
          alt={`${productName} background blur`}
          fill
          className="object-cover opacity-30 blur-2xl scale-110 saturate-150"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
        {/* Main Image */}
        <Image
          src={selectedImage}
          alt={`${productName} - Rental Product Image`}
          width={800}
          height={600}
          priority
          className="relative w-full h-auto max-h-[50vh] md:max-h-[500px] object-contain z-10 p-2 sm:p-4 drop-shadow-sm transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* ✅ Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2.5 mt-3 px-1.5 pt-1.5 pb-2 overflow-x-auto no-scrollbar">
          {images.map((img, i) => (
            <div
              key={img._id || i}
              onClick={() => setSelectedIndex(i)}
              className={`relative shrink-0 w-20 aspect-square border rounded-lg cursor-pointer overflow-hidden bg-zinc-100 transition-all duration-300 ${
                selectedIndex === i ? 'border-[#003459] ring-1 ring-[#003459] shadow-md scale-105' : 'hover:border-gray-400'
              }`}
            >
              {/* Blurred bg for thumbnail */}
              <Image
                src={img.url}
                alt={`${productName} View ${i + 1} blur`}
                fill
                className="object-cover opacity-30 blur-md scale-110 saturate-150"
                sizes="80px"
              />
              <Image
                src={img.url}
                alt={`${productName} View ${i + 1}`}
                fill
                className="object-contain z-10 p-1"
                sizes="80px"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
