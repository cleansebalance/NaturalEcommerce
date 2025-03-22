import { useState, useEffect } from 'react';
import { useProducts } from '@/context/ProductsContext';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductFilterProps {
  onCategoryChange: (categoryId: number | undefined) => void;
  onSearchChange: (searchTerm: string) => void;
  selectedCategory?: number;
}

const ProductFilter = ({ onCategoryChange, onSearchChange, selectedCategory }: ProductFilterProps) => {
  const { categories } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(searchTerm);
  };

  const handleCategoryClick = (categoryId: number | undefined) => {
    onCategoryChange(categoryId === selectedCategory ? undefined : categoryId);
  };

  // Clear search when component unmounts
  useEffect(() => {
    return () => {
      onSearchChange('');
    };
  }, [onSearchChange]);

  // Loading state
  if (categories.isLoading) {
    return (
      <div className="mb-8">
        <Skeleton className="h-10 w-full mb-6" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-8 w-24" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <form onSubmit={handleSearchSubmit} className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full px-4 py-3 pr-10 rounded-lg border border-neutral focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
            aria-label="Search"
          >
            <i className="fas fa-search text-dark opacity-60"></i>
          </button>
        </div>
      </form>

      <div className="mb-4">
        <h3 className="font-medium text-lg mb-3">Categories</h3>
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              !selectedCategory
                ? 'bg-primary text-white'
                : 'bg-neutral text-dark hover:bg-primary hover:text-white'
            }`}
            onClick={() => handleCategoryClick(undefined)}
          >
            All
          </button>
          
          {categories.data?.map(category => (
            <button
              key={category.id}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-primary text-white'
                  : 'bg-neutral text-dark hover:bg-primary hover:text-white'
              }`}
              onClick={() => handleCategoryClick(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;
