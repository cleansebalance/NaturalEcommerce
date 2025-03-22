import Hero from '@/components/home/Hero';
import FeaturedCollection from '@/components/home/FeaturedCollection';
import CategoryBanner from '@/components/home/CategoryBanner';
import FeaturedProduct from '@/components/home/FeaturedProduct';
import Testimonials from '@/components/home/Testimonials';
import Newsletter from '@/components/home/Newsletter';

const Home = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <FeaturedCollection />
      <CategoryBanner />
      <FeaturedProduct />
      <Testimonials />
      <Newsletter />
    </div>
  );
};

export default Home;
