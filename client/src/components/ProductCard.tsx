import { useState } from "react";
import { Link } from "wouter";
import { type Product } from "@shared/schema";
import { formatPrice } from "@/lib/utils";
import { Star, Plus } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart, isLoading } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoading) {
      addToCart(product.id);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // In a real app, this could open a modal with product details
    window.location.href = `/products/${product.id}`;
  };

  return (
    <div 
      className="product-card bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product.id}`}>
        <div className="relative overflow-hidden h-64">
          <img 
            src={product.imageUrl}
            alt={product.name} 
            className={`product-image w-full h-full object-cover transition-all duration-500 ${
              isHovered ? "scale-105" : ""
            }`}
          />
          <div className={`quick-view absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center transition-all ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}>
            <button 
              className="bg-white text-primary text-sm font-medium px-4 py-2 rounded-full hover:bg-primary hover:text-white transition-all"
              onClick={handleQuickView}
            >
              Quick View
            </button>
          </div>
          {product.bestSeller && (
            <span className="absolute top-2 left-2 bg-accent text-white text-xs px-2 py-1 rounded">
              Best Seller
            </span>
          )}
          {product.isNew && (
            <span className="absolute top-2 left-2 bg-accent text-white text-xs px-2 py-1 rounded">
              New
            </span>
          )}
        </div>
      </Link>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium">{product.name}</h3>
          <div className="flex">
            {Array(product.rating).fill(0).map((_, i) => (
              <Star key={i} className="text-accent text-xs fill-current" size={12} />
            ))}
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-3">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="font-semibold">{formatPrice(Number(product.price))}</span>
          <button 
            className="bg-primary text-white text-sm p-2 rounded-full hover:bg-opacity-90 transition-all"
            onClick={handleAddToCart}
            disabled={isLoading}
            aria-label={`Add ${product.name} to cart`}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
