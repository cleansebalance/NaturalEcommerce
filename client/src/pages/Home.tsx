import { useQuery } from "@tanstack/react-query";
import { fetchCategories, fetchBestSellerProducts } from "@/lib/data";
import { Hero } from "@/components/Hero";
import { CategoryCard } from "@/components/CategoryCard";
import { ProductCard } from "@/components/ProductCard";
import { FeaturesBanner } from "@/components/FeaturesBanner";
import { TestimonialSection } from "@/components/TestimonialSection";
import { Newsletter } from "@/components/Newsletter";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { bundleProducts } from "@/lib/data";
import { Check } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/utils";

export default function Home() {
  const [activeFilter, setActiveFilter] = useState("All");
  const { addToCart } = useCart();

  // Fetch categories
  const { 
    data: categories, 
    isLoading: categoriesLoading 
  } = useQuery({
    queryKey: ['/api/categories'],
    queryFn: fetchCategories
  });

  // Fetch best seller products
  const { 
    data: bestSellers, 
    isLoading: productsLoading 
  } = useQuery({
    queryKey: ['/api/products/bestsellers'],
    queryFn: fetchBestSellerProducts
  });

  // Handle adding bundle to cart (simplified for demo)
  const handleAddBundle = () => {
    // In a real app, you might have a bundle product ID
    // For this demo, we'll simply add the first product
    if (bestSellers && bestSellers.length > 0) {
      addToCart(bestSellers[0].id);
    }
  };

  return (
    <>
      <Hero />

      {/* Featured Categories */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="font-serif text-3xl text-center mb-12 font-semibold">Shop by Category</h2>
          
          {categoriesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-80 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categories?.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-16 px-4 bg-secondary">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <h2 className="font-serif text-3xl font-semibold mb-4 md:mb-0">Best Sellers</h2>
            <div className="flex items-center space-x-2">
              {["All", "Skincare", "Wellness", "Bundles"].map((filter) => (
                <button 
                  key={filter}
                  className={`bg-white hover:bg-primary hover:text-white ${
                    activeFilter === filter 
                      ? "text-white bg-primary border-primary" 
                      : "text-neutral-800 border-transparent"
                  } px-3 py-2 rounded border transition-all`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
          
          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm">
                  <Skeleton className="h-64 w-full" />
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-4 w-full mb-3" />
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {bestSellers?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          
          <div className="mt-12 text-center">
            <a 
              href="/products" 
              className="inline-block border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded-md transition-all font-medium"
            >
              View All Products
            </a>
          </div>
        </div>
      </section>

      <FeaturesBanner />

      <TestimonialSection />

      {/* Promo Section */}
      <section className="relative py-16 px-4">
        <div className="container mx-auto flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 mb-8 md:mb-0">
            <img 
              src="https://images.unsplash.com/photo-1570194065383-0c107c7b39e2?q=80&w=1470&auto=format&fit=crop" 
              alt="Complete wellness collection" 
              className="rounded-lg shadow-lg w-full h-96 object-cover"
            />
          </div>
          <div className="w-full md:w-1/2 md:pl-12">
            <h2 className="font-serif text-3xl mb-4 font-semibold">The Complete Wellness Collection</h2>
            <p className="mb-6 text-gray-600">
              Our most popular products bundled together for the ultimate self-care routine. 
              Save 20% when purchasing this limited-time collection.
            </p>
            <ul className="mb-6 space-y-2">
              {bundleProducts.map((product, index) => (
                <li key={index} className="flex items-center">
                  <Check className="text-success mr-2" size={16} />
                  {product}
                </li>
              ))}
            </ul>
            <div className="flex items-center mb-6">
              <span className="text-xl font-bold mr-3">{formatPrice(129)}</span>
              <span className="text-gray-500 line-through">{formatPrice(162)}</span>
            </div>
            <button 
              className="bg-primary text-white px-8 py-3 rounded-md hover:bg-opacity-90 transition-all font-medium"
              onClick={handleAddBundle}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </section>

      <Newsletter />
    </>
  );
}
