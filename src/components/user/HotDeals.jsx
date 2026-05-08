import ProductSection from '@/components/ui/ProductSection';
import BlogServices from './BlogServices';
import { fetchPublicBlogsISR } from '@/services/blogService';

export default async function HotDealsPage() {
  let initialBlogs = [];
  try {
    const res = await fetchPublicBlogsISR(1, 12);
    initialBlogs = res?.data?.blogs || [];
  } catch (err) {
    console.error('Failed to fetch blogs on server:', err);
  }

  return (
    <div className="space-y-12 bg-transparent">
      {/* 🏷️ Hot Deals Products */}
      <ProductSection title="🔥 Special Hot Deals" type="hotdeal" />

      {/* 🌟 Featured Products */}
      <ProductSection title="⭐ Featured Rental Items" type="featured" />

      {/* 🏆 Top Rental Products */}
      <ProductSection title="🏆 Top Rental Products" type="toprental" />
        
      {/* 📝 Portfolio & Setup Services Slider */}
      <BlogServices initialBlogs={initialBlogs} />
    </div>
  );
}
