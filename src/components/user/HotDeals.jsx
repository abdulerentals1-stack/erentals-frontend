import ProductSection from '@/components/ui/ProductSection';
import BlogServices from './BlogServices';
import { fetchPublicServicesISR } from '@/services/serviceService';

export default async function HotDealsPage() {
  let initialServices = [];
  try {
    const res = await fetchPublicServicesISR(1, 12);
    initialServices = res?.data?.services || [];
  } catch (err) {
    console.error('Failed to fetch services on server:', err);
  }

  return (
    <div className="space-y-12 bg-transparent">
      {/* 🏷️ Hot Deals Products */}
      {/* <ProductSection title="🔥 Special Hot Deals" type="hotdeal" /> */}

      {/* 🌟 Featured Products */}
      <ProductSection title="⭐ Featured Rental Items" type="featured" />

      {/* 🏆 Top Rental Products */}
      <ProductSection title="🏆 Top Rental Products" type="toprental" />
        
      {/* 📝 Portfolio & Setup Services Slider */}
      <BlogServices initialBlogs={initialServices} />
    </div>
  );
}
