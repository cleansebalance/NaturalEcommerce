import { useState, useEffect } from 'react';
import { useProducts } from '@/context/ProductsContext';
import ProductCard from './ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Product } from '@/types';

interface ProductGridProps {
  selectedCategory?: number;
  searchTerm?: string;
}

const ProductGrid = ({ selectedCategory, searchTerm }: ProductGridProps) => {
  const { products } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!products.data) return;

    let filtered = [...products.data];

    // Filter by category if selected
    if (selectedCategory) {
      filtered = filtered.filter(product => product.categoryId === selectedCategory);
    }

    // Filter by search term if provided
    if (searchTerm?.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(term) || 
        product.tagline.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term)
      );
    }

    setFilteredProducts(filtered);
  }, [products.data, selectedCategory, searchTerm]);

  // Loading state
  if (products.isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, index) => (
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
    );
  }

  // Error state
  if (products.error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Failed to load products. Please try again later.</p>
      </div>
    );
  }

  // Empty state
  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-dark">No products found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {filteredProducts.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
