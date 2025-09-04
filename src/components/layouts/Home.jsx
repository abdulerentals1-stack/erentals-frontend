import BannerCarousel from '../user/Banner';
import HotDealsPage from '../user/HotDeals';
import Services from '../user/Services';
import TagsList from '../user/TagsList';


export default function HomePage() {
  return (
    <main>
      <TagsList />
      <BannerCarousel />
      <Services />
      <HotDealsPage />
      {/* Add more Home sections here */}
    </main>
  );
}
