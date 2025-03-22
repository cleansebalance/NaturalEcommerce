import { Link } from 'wouter';
import { useProducts } from '@/context/ProductsContext';
import ProductCard from '@/components/shop/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';

const FeaturedCollection = () => {
  const { featuredProducts } = useProducts();

  // Loading state
  if (featuredProducts.isLoading) {
    return (
      <section className="py-20 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Skeleton className="h-10 w-1/3 mx-auto mb-4" />
            <Skeleton className="h-6 w-1/2 mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <Skeleton className="w-full h-80" />
                <div className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-4 w-1/4 mb-6" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (featuredProducts.error) {
    return (
      <section className="py-20 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-red-500">Failed to load featured products. Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display font-bold text-dark mb-4">Our Featured Collection</h2>
          <p className="text-lg text-dark opacity-70 max-w-2xl mx-auto">
            Carefully curated products formulated with natural ingredients to enhance your wellness journey.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.data?.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        <div className="text-center mt-14">
          <Link href="/shop" className="btn-hover-expand inline-block border-2 border-primary text-primary hover:text-primary px-8 py-3 rounded-full font-medium transition-all duration-300 hover:shadow-md">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollection;
