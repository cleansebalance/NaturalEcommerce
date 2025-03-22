import { useQuery } from "@tanstack/react-query";
import { fetchTestimonials } from "@/lib/data";
import { Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function TestimonialSection() {
  const { data: testimonials, isLoading, error } = useQuery({
    queryKey: ['/api/testimonials'],
    queryFn: fetchTestimonials
  });

  if (isLoading) {
    return (
      <section className="py-16 px-4 bg-primary text-white">
        <div className="container mx-auto">
          <h2 className="font-serif text-3xl text-center mb-12 font-semibold">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
                <div className="flex mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Skeleton key={star} className="h-4 w-4 bg-accent/30 mr-1" />
                  ))}
                </div>
                <Skeleton className="h-4 w-full bg-white/30 mb-2" />
                <Skeleton className="h-4 w-full bg-white/30 mb-2" />
                <Skeleton className="h-4 w-3/4 bg-white/30 mb-4" />
                <div className="flex items-center">
                  <Skeleton className="h-10 w-10 rounded-full bg-white/30 mr-3" />
                  <div>
                    <Skeleton className="h-4 w-20 bg-white/30 mb-1" />
                    <Skeleton className="h-3 w-24 bg-white/30" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !testimonials) {
    return (
      <section className="py-16 px-4 bg-primary text-white">
        <div className="container mx-auto text-center">
          <h2 className="font-serif text-3xl mb-4 font-semibold">What Our Customers Say</h2>
          <p>Unable to load testimonials. Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-primary text-white">
      <div className="container mx-auto">
        <h2 className="font-serif text-3xl text-center mb-12 font-semibold">What Our Customers Say</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <div className="flex text-accent mb-3">
                {Array(testimonial.rating).fill(0).map((_, i) => (
                  <Star key={i} className="fill-current" size={16} />
                ))}
              </div>
              <p className="italic mb-4">{testimonial.content}</p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                  <img src={testimonial.avatarUrl} alt={testimonial.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-medium">{testimonial.name}</h4>
                  <p className="text-xs opacity-80">Verified Customer</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-10 text-center">
          <a 
            href="#" 
            className="inline-block border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-3 rounded-md transition-all font-medium"
            onClick={(e) => e.preventDefault()}
          >
            Read More Reviews
          </a>
        </div>
      </div>
    </section>
  );
}
