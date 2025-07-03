import BannerCarousel from '../user/Banner';
import HotDealsPage from '../user/HotDeals';

export default function HomePage() {
  return (
    <main>
      <BannerCarousel />
      <HotDealsPage />
      {/* Add more Home sections here */}
    </main>
  );
}
