import ProductSection from '@/components/ui/ProductSection';
import BlogServices from './BlogServices';

export default function HotDealsPage() {
  return (
    <div className="space-y-12 bg-transparent">
      {/* 🏷️ Hot Deals Products */}
      <ProductSection title="🔥 Special Hot Deals" type="hotdeal" />

      {/* 🌟 Featured Products */}
      <ProductSection title="⭐ Featured Rental Items" type="featured" />

      {/* 🏆 Top Rental Products */}
      <ProductSection title="🏆 Top Rental Products" type="toprental" />
        
      {/* 📝 Portfolio & Setup Services Slider */}
      <BlogServices />
    </div>
  );
}
