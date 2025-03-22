import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Skeleton } from '@/components/ui/skeleton';

// The featured product is hardcoded for now since it's a special showcase item
const featuredProduct = {
  id: 5,
  name: "Ultimate Harmony Kit",
  tagline: "Complete Wellness Set",
  price: 129.00,
  originalPrice: 149.00,
  description: "Our complete wellness solution combines facial cleanser, serum, body oil, and aromatherapy blend in one beautifully packaged set. Perfect for gifting or starting your natural wellness journey.",
  imageUrl: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1024&h=1200&q=80",
  rating: 5.0,
  reviewCount: 48,
  categoryId: 1,
  isFeatured: false,
  isBestSeller: false,
  isNewArrival: true
};

const FeaturedProduct = () => {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    addItem(featuredProduct, quantity);
  };

  return (
    <section className="py-20 bg-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <div className="relative">
              <img 
                src={featuredProduct.imageUrl} 
                alt={featuredProduct.name} 
                className="rounded-xl shadow-lg" 
              />
              {featuredProduct.isNewArrival && (
                <div className="absolute top-6 left-6 bg-accent text-white text-sm font-bold px-4 py-2 rounded-full">
                  New Arrival
                </div>
              )}
            </div>
          </div>
          
          <div className="md:w-1/2 md:pl-16">
            <h4 className="text-secondary font-medium mb-3">Featured Product</h4>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-dark mb-4">{featuredProduct.name}</h2>
            <div className="flex items-center mb-4">
              <div className="flex text-accent">
                {Array.from({ length: 5 }).map((_, index) => (
                  <i key={index} className={`fas fa-star`}></i>
                ))}
              </div>
              <span className="ml-2 text-sm text-dark opacity-60">
                {featuredProduct.rating} ({featuredProduct.reviewCount} reviews)
              </span>
            </div>
            <p className="text-lg text-dark mb-6">
              {featuredProduct.description}
            </p>
            <div className="mb-8">
              <div className="text-xl font-display font-bold">${featuredProduct.price.toFixed(2)}</div>
              {featuredProduct.originalPrice && (
                <div className="text-sm text-accent line-through">${featuredProduct.originalPrice.toFixed(2)}</div>
              )}
            </div>
            
            <div className="flex items-center mb-8">
              <span className="mr-4 font-medium">Quantity:</span>
              <div className="flex border border-neutral rounded-full">
                <button 
                  className="w-10 h-10 flex items-center justify-center hover:bg-neutral transition-colors duration-300"
                  onClick={decreaseQuantity}
                >
                  <i className="fas fa-minus text-sm"></i>
                </button>
                <div className="w-10 h-10 flex items-center justify-center font-medium">{quantity}</div>
                <button 
                  className="w-10 h-10 flex items-center justify-center hover:bg-neutral transition-colors duration-300"
                  onClick={increaseQuantity}
                >
                  <i className="fas fa-plus text-sm"></i>
                </button>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProduct;
