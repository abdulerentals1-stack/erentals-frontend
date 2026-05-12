import BannerCarousel from '../user/Banner';
import HotDealsPage from '../user/HotDeals';
import Services from '../user/Services';
import TagsList from '../user/TagsList';
import CategoriesPage from '../user/Categories';
import { fetchBannersISR } from '@/services/banner';
import Link from 'next/link';

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
      <TagsList />
      
      {/* ✅ Visible, Premium SEO Compliant Hero Title Block */}
      <div className="max-w-7xl mx-auto px-4 pt-2 md:pt-4 text-center">
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-[#003459] dark:text-white tracking-tight leading-none">
          Premium Event, Party & <span className="text-[#007EA7] dark:text-blue-400">Furniture Rentals</span> in Mumbai
        </h1>
        <p className="mt-3 text-xs sm:text-sm md:text-base text-gray-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Rent high-quality luxury event furniture, professional sound setups, staging, lighting and catering appliances. Enjoy transparent pricing and hassle-free local delivery across Mumbai.
        </p>
      </div>

      <BannerCarousel initialBanners={initialBanners} />
      <CategoriesPage />
      <Services />

      <HotDealsPage />
    </main>
  );
}
