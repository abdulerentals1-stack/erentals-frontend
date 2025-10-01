'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getAllBanners } from '@/services/banner';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';

export default function BannerCarousel() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const timerRef = useRef(null);

  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created(slider) {
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        if (!paused) slider.next();
      }, 4000);
    },
  });

  // Detect mobile/desktop once (no SSR mismatch)
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // < 768px = mobile
    };
    handleResize(); // initial
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const { data } = await getAllBanners();
        setBanners(data.banners || []);
      } catch (err) {
        console.error('Banner fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  if (loading) {
    return <Skeleton className="w-full h-64 rounded-xl" />;
  }

  // Filter banners based on type
  const filteredBanners = banners.filter((b) =>
    isMobile ? b.type === 'mobile' : b.type === 'desktop'
  );

  if (!filteredBanners.length) return null;

  return (
    <div
      className="relative w-full group bg-gray-50"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        ref={sliderRef}
        className="keen-slider overflow-hidden h-48 sm:h-72 md:h-[65vh] lg:h-[70vh] rounded md:rounded-xl"
      >
        {filteredBanners.map((banner, idx) => {
          const image = (
            <Image
              src={banner.image.url}
              alt={banner.image.alt || `Banner ${idx + 1}`}
              fill
              className="object-cover"
              priority={idx === 0}
            />
          );

          return (
            <div key={banner._id || idx} className="keen-slider__slide relative">
              {banner.link ? (
                <Link
                  href={banner.link}
                  className="block w-full h-full relative"
                >
                  {image}
                </Link>
              ) : (
                <div className="w-full h-full relative">{image}</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Arrows */}
      <button
        onClick={() => instanceRef.current?.prev()}
        className="absolute top-1/2 -translate-y-1/2 left-3 z-10 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition hidden group-hover:block"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => instanceRef.current?.next()}
        className="absolute top-1/2 -translate-y-1/2 right-3 z-10 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition hidden group-hover:block"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dot indicators */}
      <div className="flex justify-center items-center gap-2 mt-4">
        {filteredBanners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => instanceRef.current?.moveToIdx(idx)}
            className={`h-2 w-2 rounded-full transition-all ${
              currentSlide === idx ? 'bg-black' : 'bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
