'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';
import { getPublicBlogs } from '@/services/blogService';

const BlogServices = () => {

    const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const timerRef = useRef(null);

  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: { perView: isMobile ? 1 : 4, spacing: 15 },
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

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await getPublicBlogs(1, 10);
        setBlogs(data.blogs || []);
      } catch (err) {
        console.error('Failed to fetch blogs', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) return <Skeleton className="w-full h-64 rounded-xl" />;
  if (!blogs.length) return null;


  return (
     <section className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">
             <div className="items-center justify-between border-b-4 border-[#003459] inline-block pb-2 mb-4">
              <h2 className="text-xl font-semibold">Our Services</h2>
            </div>
             <div
      className="relative w-full group"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        ref={sliderRef}
        className="keen-slider overflow-hidden py-4"
      >
        {blogs.map((blog) => (
          <div key={blog._id} className="keen-slider__slide bg-white dark:bg-zinc-900 rounded-xl shadow-md p-4 cursor-pointer">
            <Link href={`/blogs/${blog.slug}`} className="block">
              {blog.coverImage?.url && (
                <div className="relative h-40 w-full mb-2 rounded overflow-hidden">
                  <Image
                    src={blog.coverImage.url}
                    alt={blog.title}
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                </div>
              )}
              <h3 className="font-semibold text-lg">{blog.title}</h3>
              <p className="text-sm text-gray-500">{blog.authorName}</p>
            </Link>
          </div>
        ))}
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

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {blogs.map((_, idx) => (
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
          </div>
        </section>
  )
}

export default BlogServices
