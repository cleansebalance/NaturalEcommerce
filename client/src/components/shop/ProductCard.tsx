import { useState } from 'react';
import { Link } from 'wouter';
import { Product } from '../../types';

// Re-enable cart functionality
import { useCart } from '../../contexts/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [isWishlist, setIsWishlist] = useState(false);
  const cart = useCart();
  
  // Use the real cart function
  const addToCart = async () => {
    try {
      await cart.addToCart(product.id, 1);
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    }
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlist(!isWishlist);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart();
  };

  return (
    <Link href={`/product/${product.id}`} className="block">
      <div className="product-card bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg">
        <div className="relative">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-80 object-cover" 
          />
          <div className="absolute top-4 right-4">
            <button 
              className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow hover:bg-light transition-colors duration-300"
              onClick={toggleWishlist}
              aria-label={isWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
              <i className={`${isWishlist ? 'fas' : 'far'} fa-heart text-dark`}></i>
            </button>
          </div>
          {product.isBestSeller && (
            <div className="absolute top-4 left-4 bg-accent text-white text-sm font-bold px-3 py-1 rounded-full">
              Best Seller
            </div>
          )}
          {product.isNewArrival && (
            <div className="absolute top-4 left-4 bg-accent text-white text-sm font-bold px-3 py-1 rounded-full">
              New Arrival
            </div>
          )}
        </div>
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-display font-bold text-xl text-dark">{product.name}</h3>
              <p className="text-secondary font-medium mt-1">{product.tagline}</p>
            </div>
            <div className="font-display font-bold text-lg">${product.price.toFixed(2)}</div>
          </div>
          <div className="flex items-center mt-3">
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
              {product.rating} ({product.reviewCount})
            </span>
          </div>
          <button 
            className="btn-hover-expand w-full mt-5 bg-primary text-white py-3 rounded-full font-medium transition-all duration-300 hover:shadow-md"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
