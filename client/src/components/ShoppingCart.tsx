import { useCart } from "@/contexts/CartContext";
import { X, Trash } from "lucide-react";
import { Link } from "wouter";
import { formatPrice } from "@/lib/utils";

export function ShoppingCart() {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cartItems, 
    removeFromCart, 
    updateCartItem,
    cartTotal,
    isLoading 
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50"
      onClick={() => setIsCartOpen(false)}
    >
      <div 
        className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-lg transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="font-medium">Your Cart ({cartItems.length})</h3>
            <button 
              className="text-neutral-800 hover:text-primary transition-all"
              onClick={() => setIsCartOpen(false)}
              aria-label="Close cart"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex-grow overflow-auto p-4 scroll-hidden">
            {cartItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">Your cart is empty</p>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-all"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center py-4 border-b">
                    <div className="w-20 h-20 rounded overflow-hidden flex-shrink-0">
                      <img 
                        src={item.product.imageUrl} 
                        alt={item.product.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-grow">
                      <h4 className="font-medium">{item.product.name}</h4>
                      <div className="flex items-center mt-1">
                        <button 
                          className="text-gray-500 hover:text-primary"
                          onClick={() => updateCartItem(item.id, Math.max(1, item.quantity - 1))}
                          disabled={isLoading}
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="mx-2 min-w-[24px] text-center">{item.quantity}</span>
                        <button 
                          className="text-gray-500 hover:text-primary"
                          onClick={() => updateCartItem(item.id, item.quantity + 1)}
                          disabled={isLoading}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {formatPrice(Number(item.product.price))} each
                      </p>
                    </div>
                    <button 
                      className="text-gray-400 hover:text-error transition-all"
                      onClick={() => removeFromCart(item.id)}
                      disabled={isLoading}
                      aria-label="Remove item"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>
          
          {cartItems.length > 0 && (
            <div className="p-4 border-t">
              <div className="flex justify-between mb-4">
                <span className="font-medium">Subtotal</span>
                <span className="font-semibold">{formatPrice(cartTotal)}</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Shipping and taxes calculated at checkout
              </p>
              <Link 
                href="/checkout" 
                className="block w-full bg-primary text-white py-3 rounded-md hover:bg-opacity-90 transition-all font-medium mb-3 text-center"
                onClick={() => setIsCartOpen(false)}
              >
                Checkout
              </Link>
              <Link 
                href="/cart" 
                className="block w-full border border-primary text-primary py-3 rounded-md hover:bg-primary hover:text-white transition-all font-medium text-center"
                onClick={() => setIsCartOpen(false)}
              >
                View Cart
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
