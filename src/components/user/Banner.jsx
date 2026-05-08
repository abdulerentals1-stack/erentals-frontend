'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';

export default function BannerCarousel({ initialBanners = [] }) {
  const [currentMobileSlide, setCurrentMobileSlide] = useState(0);
  const [currentDesktopSlide, setCurrentDesktopSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const [mobileSliderRef, mobileInstanceRef] = useKeenSlider({
    loop: true,
    slideChanged(slider) {
      setCurrentMobileSlide(slider.track.details.rel);
    },
  });

  const [desktopSliderRef, desktopInstanceRef] = useKeenSlider({
    loop: true,
    slideChanged(slider) {
      setCurrentDesktopSlide(slider.track.details.rel);
    },
  });

  useEffect(() => {
    if (!initialBanners.length) return;

    clearInterval(timerRef.current);

    if (!paused) {
      timerRef.current = setInterval(() => {
        if (window.innerWidth < 768) {
          mobileInstanceRef.current?.next();
        } else {
          desktopInstanceRef.current?.next();
        }
      }, 4000);
    }

    return () => clearInterval(timerRef.current);
  }, [paused, initialBanners.length]);

  if (!initialBanners.length) return null;

  const mobileBanners = initialBanners.filter((b) => b.type === 'mobile');
  const desktopBanners = initialBanners.filter((b) => b.type === 'desktop');

  const renderSlider = (banners, sliderRef, instanceRef, currentSlide, isMobile) => {
    if (!banners.length) return null;

    return (
      <div
        className={`relative w-full group bg-gray-50 ${isMobile ? 'block md:hidden' : 'hidden md:block'}`}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          ref={sliderRef}
          className={`keen-slider overflow-hidden ${isMobile ? "aspect-[16/9]" : "aspect-[42/12]"} rounded md:rounded-xl`}
        >
          {banners.map((banner, idx) => {
            const image = (
              <Image
                src={banner.image.url}
                alt={banner.image.alt || `Banner ${idx + 1}`}
                fill
                className="object-cover"
                sizes={isMobile ? "100vw" : "100vw"}
                priority={idx === 0}
                placeholder="blur"
                blurDataURL="/placeholder.jpg"
              />
            );

            return (
              <div key={banner._id || idx} className="keen-slider__slide relative">
                {banner.link ? (
                  <Link href={banner.link} className="block w-full h-full relative">
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
          {banners.map((_, idx) => (
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
  };

  return (
    <>
      {renderSlider(mobileBanners, mobileSliderRef, mobileInstanceRef, currentMobileSlide, true)}
      {renderSlider(desktopBanners, desktopSliderRef, desktopInstanceRef, currentDesktopSlide, false)}
    </>
  );
}
