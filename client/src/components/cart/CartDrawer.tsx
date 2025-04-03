import { useCart } from '@/contexts/CartContext';
import CartItem from './CartItem';
import { useLocation } from 'wouter';
import { Separator } from '@/components/ui/separator';

const CartDrawer = () => {
  // Use the real cart context
  const { 
    cartItems, 
    isCartOpen, 
    setIsCartOpen, 
    cartTotal,
    isLoading 
  } = useCart();
  
  const [, setLocation] = useLocation();

  const handleCheckout = () => {
    setIsCartOpen(false);
    setLocation('/checkout');
  };

  const handleContinueShopping = () => {
    setIsCartOpen(false);
    setLocation('/shop');
  };

  return (
    <div 
      className={`fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-xl transform ${
        isCartOpen ? 'translate-x-0' : 'translate-x-full'
      } transition-transform duration-300 ease-in-out z-50`}
    >
      <div className="h-full flex flex-col">
        <div className="p-6 border-b border-neutral flex justify-between items-center">
          <h2 className="text-xl font-display font-bold">Your Cart ({cartItems.length})</h2>
          <button 
            className="text-dark hover:text-primary transition-colors"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        {cartItems.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="text-center">
              <i className="fas fa-shopping-bag text-4xl text-neutral mb-4"></i>
              <p className="text-lg font-medium">Your cart is empty</p>
              <p className="text-dark opacity-70 mt-1 mb-6">Add items to your cart to see them here</p>
              <button 
                className="btn-hover-expand bg-primary text-white px-6 py-3 rounded-full font-medium transition-all duration-300 hover:shadow-lg"
                onClick={handleContinueShopping}
              >
                Browse Products
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
              <div className="flow-root">
                <ul className="divide-y divide-neutral">
                  {cartItems.map(item => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="border-t border-neutral py-6 px-4 sm:px-6">
              <div className="flex justify-between text-base font-medium text-dark mb-2">
                <p>Subtotal</p>
                <p>${cartTotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between text-sm text-dark opacity-70 mb-4">
                <p>Shipping</p>
                <p>Calculated at checkout</p>
              </div>
              <Separator className="mb-4" />
              <button 
                className="btn-hover-expand w-full bg-primary text-white px-6 py-4 rounded-full font-medium transition-all duration-300 hover:shadow-lg mb-3"
                onClick={handleCheckout}
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Checkout'}
              </button>
              <div className="flex justify-center text-sm">
                <button 
                  className="font-medium text-primary hover:text-primary/80"
                  onClick={handleContinueShopping}
                >
                  Continue Shopping <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
