// app/hot-deals/page.jsx
import ProductSection from '@/components/ui/ProductSection';

export default function HotDealsPage() {
  return (
    <main className="space-y-8">
      {/* 🏷️ Featured Products */}
      <ProductSection title="Top Hot Deals Products" type="featured" />

      {/* 🛒 Top Rental Products */}
      <ProductSection title="Top Featured Products" type="featured" />

      {/* 🛒 Top Rental Products */}
      <ProductSection title="Top Rental Products" type="toprental" />
    </main>
  )
}
