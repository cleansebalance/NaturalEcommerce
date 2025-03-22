import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { type Product } from "@shared/schema";
import { 
  fetchCartItems, 
  addToCart as apiAddToCart,
  updateCartItem as apiUpdateCartItem,
  removeFromCart as apiRemoveFromCart,
  clearCart as apiClearCart,
  DEFAULT_USER_ID
} from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

// Define the cart item type with product data
export type CartItemWithProduct = {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  product: Product;
};

// Define the context type
type CartContextType = {
  cartItems: CartItemWithProduct[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isLoading: boolean;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateCartItem: (id: number, quantity: number) => Promise<void>;
  removeFromCart: (id: number) => Promise<void>;
  clearCart: () => Promise<void>;
  cartTotal: number;
  cartCount: number;
};

// Create context with default values
const CartContext = createContext<CartContextType>({
  cartItems: [],
  isCartOpen: false,
  setIsCartOpen: () => {},
  isLoading: false,
  addToCart: async () => {},
  updateCartItem: async () => {},
  removeFromCart: async () => {},
  clearCart: async () => {},
  cartTotal: 0,
  cartCount: 0,
});

// Cart provider component
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Calculate cart total
  const cartTotal = cartItems.reduce(
    (total, item) => total + (Number(item.product.price) * item.quantity),
    0
  );

  // Calculate cart count
  const cartCount = cartItems.reduce(
    (count, item) => count + item.quantity,
    0
  );

  // Fetch cart items when component mounts
  useEffect(() => {
    const getCartItems = async () => {
      setIsLoading(true);
      try {
        const items = await fetchCartItems();
        setCartItems(items);
      } catch (error) {
        console.error("Failed to fetch cart items:", error);
        toast({
          title: "Error",
          description: "Failed to load your cart. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    getCartItems();
  }, [toast]);

  // Add item to cart
  const addToCart = async (productId: number, quantity = 1) => {
    setIsLoading(true);
    try {
      await apiAddToCart(productId, quantity);
      const updatedCart = await fetchCartItems();
      setCartItems(updatedCart);
      toast({
        title: "Item added",
        description: "Item has been added to your cart.",
      });
      setIsCartOpen(true);
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add item to your cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update cart item
  const updateCartItem = async (id: number, quantity: number) => {
    if (quantity < 1) return;
    
    setIsLoading(true);
    try {
      await apiUpdateCartItem(id, quantity);
      const updatedCart = await fetchCartItems();
      setCartItems(updatedCart);
    } catch (error) {
      console.error("Failed to update cart item:", error);
      toast({
        title: "Error",
        description: "Failed to update item quantity. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (id: number) => {
    setIsLoading(true);
    try {
      await apiRemoveFromCart(id);
      const updatedCart = await fetchCartItems();
      setCartItems(updatedCart);
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart.",
      });
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
      toast({
        title: "Error",
        description: "Failed to remove item from your cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Clear cart
  const clearCart = async () => {
    setIsLoading(true);
    try {
      await apiClearCart();
      setCartItems([]);
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart.",
      });
    } catch (error) {
      console.error("Failed to clear cart:", error);
      toast({
        title: "Error",
        description: "Failed to clear your cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        isLoading,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart context
export const useCart = () => useContext(CartContext);
