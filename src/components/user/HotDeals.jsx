// app/hot-deals/page.jsx
import ProductSection from '@/components/ui/ProductSection';
import CategoriesPage from './Categories';

export default function HotDealsPage() {
  return (
    <main className="space-y-8 bg-gray-50">
      {/* 🏷️ Featured Products */}
      <ProductSection title="Top Hot Deals Products" type="featured" />

       {/* 🏷️ categories list Products */}
      <CategoriesPage />

      {/* 🛒 Top Rental Products */}
      <ProductSection title="Top Featured Products" type="featured" />

      {/* 🛒 Top Rental Products */}
      <ProductSection title="Top Rental Products" type="toprental" />
    </main>
  )
}
