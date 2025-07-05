import BannerCarousel from '../user/Banner';
import HotDealsPage from '../user/HotDeals';
import Services from '../user/Services';

export default function HomePage() {
  return (
    <main>
      <BannerCarousel />
      <Services />
      <HotDealsPage />
      {/* Add more Home sections here */}
    </main>
  );
}
