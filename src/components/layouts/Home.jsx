import { Suspense } from 'react';
import BannerCarousel from '../user/Banner';
import HotDealsPage from '../user/HotDeals';
import Services from '../user/Services';
import CategoriesPage from '../user/Categories';
import { fetchBannersISR } from '@/services/banner';

function HotDealsSkeleton() {
  return (
    <div className="space-y-12 animate-pulse">
      {[1, 2, 3].map((i) => (
        <section key={i} className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="h-7 w-56 bg-gray-200 dark:bg-zinc-800 rounded mb-6" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map((j) => (
                <div key={j} className="rounded-xl bg-gray-200 dark:bg-zinc-800 h-52" />
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}

export default async function HomePage() {
  let initialBanners = [];
  try {
    const res = await fetchBannersISR();
    initialBanners = res?.data?.banners || [];
  } catch (err) {
    console.error('Failed to fetch banners on server:', err);
  }

  return (
    <main className="space-y-12 pb-16 bg-gray-50/50 dark:bg-zinc-950/50 animate-fade-in">
      <BannerCarousel initialBanners={initialBanners} />
      <CategoriesPage />

      {/* ✅ Visible, Premium SEO Compliant Hero Title Block placed below Cover Image */}
      <div className="max-w-7xl mx-auto px-4 pt-2 md:pt-4 text-center">
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-[#003459] dark:text-white tracking-tight leading-none">
          Premium Event, Party & <span className="text-[#007EA7] dark:text-blue-400">Furniture Rentals</span> in Mumbai
        </h1>
        <p className="mt-3 text-xs sm:text-sm md:text-base text-gray-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Rent high-quality luxury event furniture, professional sound setups, staging, lighting and catering appliances. Enjoy transparent pricing and hassle-free local delivery across Mumbai.
        </p>
      </div>

      <Services />

      {/* ⚡ Suspense boundary: streams product sections progressively after above-the-fold content */}
      <Suspense fallback={<HotDealsSkeleton />}>
        <HotDealsPage />
      </Suspense>
    </main>
  );
}
