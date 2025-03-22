import { createContext, useContext, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { Product, Category, Testimonial } from "@/types";

interface ProductsContextType {
  products: {
    data: Product[] | undefined;
    isLoading: boolean;
    error: Error | null;
  };
  featuredProducts: {
    data: Product[] | undefined;
    isLoading: boolean;
    error: Error | null;
  };
  categories: {
    data: Category[] | undefined;
    isLoading: boolean;
    error: Error | null;
  };
  testimonials: {
    data: Testimonial[] | undefined;
    isLoading: boolean;
    error: Error | null;
  };
  getProductById: (id: number) => Product | undefined;
  getProductsByCategory: (categoryId: number) => Product[] | undefined;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: ReactNode }) {
  // Fetch all products
  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError
  } = useQuery({
    queryKey: ['/api/products'],
  });

  // Fetch featured products
  const {
    data: featuredProductsData,
    isLoading: featuredProductsLoading,
    error: featuredProductsError
  } = useQuery({
    queryKey: ['/api/products/featured'],
  });

  // Fetch categories
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError
  } = useQuery({
    queryKey: ['/api/categories'],
  });

  // Fetch testimonials
  const {
    data: testimonialsData,
    isLoading: testimonialsLoading,
    error: testimonialsError
  } = useQuery({
    queryKey: ['/api/testimonials'],
  });

  // Helper function to get a product by ID
  const getProductById = (id: number): Product | undefined => {
    return productsData?.find(product => product.id === id);
  };

  // Helper function to get products by category
  const getProductsByCategory = (categoryId: number): Product[] | undefined => {
    return productsData?.filter(product => product.categoryId === categoryId);
  };

  return (
    <ProductsContext.Provider
      value={{
        products: {
          data: productsData,
          isLoading: productsLoading,
          error: productsError as Error | null,
        },
        featuredProducts: {
          data: featuredProductsData,
          isLoading: featuredProductsLoading,
          error: featuredProductsError as Error | null,
        },
        categories: {
          data: categoriesData,
          isLoading: categoriesLoading,
          error: categoriesError as Error | null,
        },
        testimonials: {
          data: testimonialsData,
          isLoading: testimonialsLoading,
          error: testimonialsError as Error | null,
        },
        getProductById,
        getProductsByCategory,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
}
