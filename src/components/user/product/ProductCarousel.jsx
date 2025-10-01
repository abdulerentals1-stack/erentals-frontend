'use client';
import Image from 'next/image';
import { useState } from 'react';

export default function ProductCarousel({ images = [] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = images?.[selectedIndex]?.url || '/placeholder.jpg';

  return (
    <div>
      {/* ✅ Main Product Image */}
      <div className="relative w-full aspect-square md:aspect-[4/3] border rounded-md overflow-hidden bg-white">
        <Image
          src={selectedImage}
          alt="Product Image"
          fill
          className="object-contain"
          sizes="100vw"
          placeholder="blur"
          blurDataURL="/placeholder.jpg"
          priority
        />
      </div>

      {/* ✅ Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-4 overflow-x-auto">
          {images.map((img, i) => (
            <div
              key={img._id || i}
              onClick={() => setSelectedIndex(i)}
              className={`relative w-20 aspect-square border rounded cursor-pointer bg-gray-50 ${
                selectedIndex === i ? 'border-blue-600' : ''
              }`}
            >
              <Image
                src={img.url}
                alt={`Thumbnail ${i + 1}`}
                fill
                className="object-contain rounded"
                sizes="80px"
                placeholder="blur"
                blurDataURL="/placeholder.jpg"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
