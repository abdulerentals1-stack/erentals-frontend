import BannerCarousel from '../user/Banner';
import HotDealsPage from '../user/HotDeals';
import Services from '../user/Services';
import TagsList from '../user/TagsList';
import CategoriesPage from '../user/Categories';
import Link from 'next/link';

export default async function HomePage() {
  return (
    <main className="space-y-12 pb-16 bg-gray-50/50 dark:bg-zinc-950/50">
      {/* Visually hidden screen-reader H1 for SEO crawler optimization */}
      <h1 className="sr-only">e-Rentals | Premium Event, Party & Furniture Rental Services in Mumbai</h1>
      <TagsList />
      <BannerCarousel />
      <CategoriesPage />
      <Services />

      <HotDealsPage />
    </main>
  );
}
