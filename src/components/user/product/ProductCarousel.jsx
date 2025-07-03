// components/product/ProductCarousel.jsx
'use client';
import Image from 'next/image';
import { useState } from 'react';

export default function ProductCarousel({ images = [] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = images?.[selectedIndex]?.url || '/placeholder.jpg';

  return (
    <div>
      <div className="relative w-full h-64 md:h-96 border rounded-md overflow-hidden">
        <Image
          src={selectedImage}
          alt="Product Image"
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 mt-4 overflow-x-auto">
          {images.map((img, i) => (
            <div
              key={img._id || i}
              onClick={() => setSelectedIndex(i)}
              className={`w-20 h-20 relative border rounded cursor-pointer ${
                selectedIndex === i ? 'border-blue-600' : ''
              }`}
            >
              <Image
                src={img.url}
                alt={`Thumbnail ${i}`}
                fill
                className="object-cover rounded"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
