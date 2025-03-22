import { Link } from 'wouter';
import { useProducts } from '@/context/ProductsContext';
import { Skeleton } from '@/components/ui/skeleton';

const CategoryBanner = () => {
  const { categories } = useProducts();

  // Loading state
  if (categories.isLoading) {
    return (
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Skeleton className="h-10 w-1/3 mx-auto mb-4" />
            <Skeleton className="h-6 w-1/2 mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="w-full h-96 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (categories.error || !categories.data) {
    return (
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-red-500">Failed to load categories. Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display font-bold text-dark mb-4">Shop By Category</h2>
          <p className="text-lg text-dark opacity-70 max-w-2xl mx-auto">
            Explore our wide range of natural wellness products designed to enhance your daily routine.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.data.map(category => (
            <Link key={category.id} href={`/shop?category=${category.id}`} className="block">
              <div className="relative rounded-xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300">
                <img 
                  src={category.imageUrl} 
                  alt={category.name} 
                  className="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent opacity-60 group-hover:opacity-70 transition-opacity duration-300"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <h3 className="text-white text-2xl font-display font-bold">{category.name}</h3>
                  <p className="text-white opacity-80 mb-4">{category.description}</p>
                  <span className="text-white font-medium flex items-center group-hover:translate-x-2 transition-transform duration-300">
                    Explore Collection <i className="fas fa-arrow-right ml-2"></i>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryBanner;
