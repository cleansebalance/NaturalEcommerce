import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { useProducts } from '@/context/ProductsContext';
import { useCart } from '@/contexts/CartContext'; // Fixed path to use the correct CartContext
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { getProductById } = useProducts();
  const cart = useCart(); // Get the full cart context
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  
  const productId = parseInt(id, 10);
  const product = getProductById(productId);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // If product not found after loading
  useEffect(() => {
    if (!isLoading && !product) {
      setLocation('/shop');
    }
  }, [isLoading, product, setLocation]);

  const handleAddToCart = async () => {
    if (product) {
      // The CartContext from contexts/CartContext expects a productId (number) instead of a product object
      await cart.addToCart(product.id, quantity);
    }
  };

  if (isLoading || !product) {
    return (
      <div className="min-h-screen pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex gap-10">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <Skeleton className="w-full h-[600px] rounded-xl" />
            </div>
            <div className="md:w-1/2">
              <Skeleton className="h-8 w-40 mb-2" />
              <Skeleton className="h-12 w-3/4 mb-4" />
              <Skeleton className="h-6 w-32 mb-6" />
              <Skeleton className="h-24 w-full mb-6" />
              <Skeleton className="h-10 w-32 mb-8" />
              <Skeleton className="h-14 w-full mb-4" />
              <Skeleton className="h-14 w-14" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex gap-10">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <div className="relative">
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full rounded-xl shadow-lg" 
              />
              {product.isBestSeller && (
                <div className="absolute top-6 left-6 bg-accent text-white text-sm font-bold px-4 py-2 rounded-full">
                  Best Seller
                </div>
              )}
              {product.isNewArrival && (
                <div className="absolute top-6 left-6 bg-accent text-white text-sm font-bold px-4 py-2 rounded-full">
                  New Arrival
                </div>
              )}
            </div>
          </div>
          
          <div className="md:w-1/2">
            <p className="text-secondary font-medium mb-3">{product.tagline}</p>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-dark mb-4">{product.name}</h1>
            
            <div className="flex items-center mb-6">
              <div className="flex text-accent">
                {Array.from({ length: 5 }).map((_, index) => (
                  <i 
                    key={index} 
                    className={`${
                      index < Math.floor(product.rating) ? 'fas fa-star' : 
                      index === Math.floor(product.rating) && product.rating % 1 !== 0 ? 'fas fa-star-half-alt' : 
                      'far fa-star'
                    }`}
                  ></i>
                ))}
              </div>
              <span className="ml-2 text-sm text-dark opacity-60">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>
            
            <p className="text-lg text-dark mb-8">
              {product.description}
            </p>
            
            <div className="mb-8">
              <div className="text-2xl font-display font-bold">${product.price.toFixed(2)}</div>
              {product.originalPrice && (
                <div className="text-sm text-accent line-through">${product.originalPrice.toFixed(2)}</div>
              )}
            </div>
            
            <Separator className="mb-8" />
            
            <div className="flex items-center mb-8">
              <span className="mr-4 font-medium">Quantity:</span>
              <div className="flex border border-neutral rounded-full">
                <button 
                  className="w-10 h-10 flex items-center justify-center hover:bg-neutral transition-colors duration-300"
                  onClick={decreaseQuantity}
                  aria-label="Decrease quantity"
                >
                  <i className="fas fa-minus text-sm"></i>
                </button>
                <div className="w-10 h-10 flex items-center justify-center font-medium">{quantity}</div>
                <button 
                  className="w-10 h-10 flex items-center justify-center hover:bg-neutral transition-colors duration-300"
                  onClick={increaseQuantity}
                  aria-label="Increase quantity"
                >
                  <i className="fas fa-plus text-sm"></i>
                </button>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mb-10">
              <button 
                className="btn-hover-expand flex-1 bg-primary text-white px-8 py-4 rounded-full font-medium text-lg transition-all duration-300 hover:shadow-lg"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
              <button className="btn-hover-expand bg-white border-2 border-primary text-primary px-6 py-4 rounded-full font-medium transition-all duration-300 hover:shadow-md">
                <i className="far fa-heart"></i>
              </button>
            </div>
            
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
                <TabsTrigger value="howtouse">How to Use</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="text-dark opacity-80">
                <p>
                  Our {product.name} is specially formulated to provide maximum effectiveness while being gentle on your skin.
                  Made with sustainable practices and eco-friendly packaging.
                </p>
                <ul className="list-disc pl-5 mt-3 space-y-1">
                  <li>100% natural ingredients</li>
                  <li>No parabens or sulfates</li>
                  <li>Cruelty-free and vegan</li>
                  <li>Sustainably sourced</li>
                </ul>
              </TabsContent>
              <TabsContent value="ingredients" className="text-dark opacity-80">
                <p>
                  All of our ingredients are carefully selected for their natural benefits and minimal environmental impact.
                </p>
                <ul className="list-disc pl-5 mt-3 space-y-1">
                  <li>Aloe Vera: Soothes and hydrates</li>
                  <li>Jojoba Oil: Nourishes and balances</li>
                  <li>Lavender Extract: Calms and refreshes</li>
                  <li>Vitamin E: Protects and repairs</li>
                  <li>Green Tea Extract: Antioxidant protection</li>
                </ul>
              </TabsContent>
              <TabsContent value="howtouse" className="text-dark opacity-80">
                <p>For best results, follow these simple steps:</p>
                <ol className="list-decimal pl-5 mt-3 space-y-1">
                  <li>Apply to clean, dry skin</li>
                  <li>Use gentle circular motions to massage into skin</li>
                  <li>Allow to absorb completely</li>
                  <li>Use morning and evening as part of your daily ritual</li>
                </ol>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
