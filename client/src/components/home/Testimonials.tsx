import { useProducts } from '@/context/ProductsContext';
import { Skeleton } from '@/components/ui/skeleton';

const Testimonials = () => {
  const { testimonials } = useProducts();

  // Loading state
  if (testimonials.isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Skeleton className="h-10 w-1/3 mx-auto mb-4" />
            <Skeleton className="h-6 w-1/2 mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-light p-8 rounded-xl shadow-sm">
                <Skeleton className="h-4 w-24 mb-4" />
                <Skeleton className="h-20 w-full mb-6" />
                <div className="flex items-center">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="ml-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32 mt-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (testimonials.error || !testimonials.data) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-red-500">Failed to load testimonials. Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display font-bold text-dark mb-4">What Our Customers Say</h2>
          <p className="text-lg text-dark opacity-70 max-w-2xl mx-auto">
            Discover how our products have transformed their wellness routines.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.data.map(testimonial => (
            <div key={testimonial.id} className="bg-light p-8 rounded-xl shadow-sm">
              <div className="flex text-accent mb-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <i 
                    key={index} 
                    className={`${
                      index < testimonial.rating ? 'fas fa-star' : 
                      index === Math.floor(testimonial.rating) && testimonial.rating % 1 !== 0 ? 'fas fa-star-half-alt' : 
                      'far fa-star'
                    }`}
                  ></i>
                ))}
              </div>
              <p className="text-dark mb-6 italic">
                "{testimonial.comment}"
              </p>
              <div className="flex items-center">
                <img 
                  src={testimonial.userImageUrl} 
                  alt={testimonial.userName} 
                  className="w-12 h-12 rounded-full object-cover" 
                />
                <div className="ml-4">
                  <div className="font-medium">{testimonial.userName}</div>
                  <div className="text-sm text-dark opacity-60">
                    {testimonial.isVerified ? 'Verified Customer' : 'Customer'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
