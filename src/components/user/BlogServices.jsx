'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Sparkles, ShieldCheck, ArrowUpRight } from 'lucide-react';
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';

const BlogServices = ({ initialBlogs: initialServices = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const timerRef = useRef(null);

  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: { perView: isMobile ? 1 : 3, spacing: 20 },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
  });

  // Synchronize autoplay and reset interval on user-manual drag/dots action
  useEffect(() => {
    if (!initialServices.length || !instanceRef.current) return;

    clearInterval(timerRef.current);

    if (!paused) {
      timerRef.current = setInterval(() => {
        instanceRef.current?.next();
      }, 4500);
    }

    return () => clearInterval(timerRef.current);
  }, [paused, currentSlide, initialServices.length]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!initialServices.length) return null;

  return (
    <section className="py-12 bg-gradient-to-b from-white to-[#F3F9FB] dark:from-zinc-900 dark:to-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#003459] dark:bg-zinc-800 dark:text-blue-300 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Recent Event Showcases
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#003459] dark:text-white tracking-tight">
              Our Premium Event Services
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl text-xs md:text-sm">
              Take a peek at our real-world galleries showing bespoke stages, custom entries, corporate audio-visual setups, and ambient lighting arrangements across top Mumbai venues.
            </p>
          </div>
          
          <Link 
            href="/services"
            className="inline-flex items-center gap-1.5 text-xs md:text-sm font-bold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition"
          >
            Explore All Services &rarr;
          </Link>
        </div>

        {/* Keen Slider Wrapper */}
        <div
          className="relative w-full group"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div ref={sliderRef} className="keen-slider overflow-hidden py-4">
            {initialServices.map((service) => (
              <div 
                key={service._id} 
                className="keen-slider__slide bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm transition-all duration-300 hover:shadow-md flex flex-col justify-between cursor-pointer"
              >
                <Link href={`/services/${service.slug}`} className="block group/card h-full flex flex-col justify-between" aria-label={`View details for ${service.title}`}>
                  <div>
                    {/* Cover Image container */}
                    {service.coverImage?.url && (
                      <div className="relative h-48 md:h-56 w-full rounded-t-2xl overflow-hidden">
                        <Image
                          src={service.coverImage.url}
                          alt={service.coverImage?.alt || service.title || "Event Service"}
                          fill
                          className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                          sizes="(max-w-768px) 100vw, 33vw"
                        />
                      </div>
                    )}

                    {/* Card Content */}
                    <div className="p-5 flex-1">
                      <h3 className="font-extrabold text-base md:text-lg text-gray-900 dark:text-white leading-snug group-hover/card:text-blue-600 dark:group-hover/card:text-blue-400 transition-colors line-clamp-2 mb-3">
                        {service.title}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        Coordinator: <span className="text-gray-700 dark:text-gray-300 font-semibold">{service.authorName || 'Event Specialists'}</span>
                      </p>
                    </div>
                  </div>

                  {/* Footer Bar inside Card */}
                  <div className="px-5 pb-5 pt-3 border-t border-gray-50 dark:border-zinc-800/50 flex items-center justify-end text-xs font-bold text-blue-600 dark:text-blue-400">
                    <span className="inline-flex items-center gap-0.5 group-hover/card:translate-x-0.5 transition-transform">
                      View Details <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Slider Arrows */}
          <button
            onClick={() => instanceRef.current?.prev()}
            aria-label="Previous slide"
            className="absolute top-1/2 -translate-y-1/2 -left-4 z-20 p-2.5 rounded-full bg-white dark:bg-zinc-800 shadow-md border border-gray-100 dark:border-zinc-700 hover:bg-gray-50 transition hidden group-hover:block"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
          <button
            onClick={() => instanceRef.current?.next()}
            aria-label="Next slide"
            className="absolute top-1/2 -translate-y-1/2 -right-4 z-20 p-2.5 rounded-full bg-white dark:bg-zinc-800 shadow-md border border-gray-100 dark:border-zinc-700 hover:bg-gray-50 transition hidden group-hover:block"
          >
            <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>

          {/* Dots Indicators */}
          <div className="flex justify-center gap-1 mt-4">
            {initialServices.map((_, idx) => (
              <button
                key={idx}
                onClick={() => instanceRef.current?.moveToIdx(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className="p-2 flex items-center justify-center touch-manipulation"
              >
                <span className={`h-2 transition-all rounded-full ${
                  currentSlide === idx ? 'w-5 bg-[#003459]' : 'w-2 bg-gray-300 dark:bg-zinc-700'
                }`} />
              </button>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default BlogServices;
