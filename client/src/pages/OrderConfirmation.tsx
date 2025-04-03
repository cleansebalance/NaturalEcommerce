import { useEffect } from 'react';
import { CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '../components/ui/button';
import { useCart } from '../contexts/CartContext';

export default function OrderConfirmation() {
  const { clearCart } = useCart();
  
  // Clear the cart when the confirmation page loads
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen max-w-4xl mx-auto px-4 py-16">
      <div className="bg-white rounded-lg shadow-md p-6 md:p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
        
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Thank you for your purchase. Your order has been confirmed and will be shipped soon.
        </p>
        
        <div className="border-t border-gray-200 pt-8 mt-8">
          <h2 className="text-xl font-semibold mb-4">What's Next?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-gray-50 p-6 rounded-lg text-left">
              <ShoppingBag className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold text-lg mb-2">Track Your Order</h3>
              <p className="text-gray-600 mb-4">
                You'll receive an email confirmation with order details and tracking information.
              </p>
              <Button variant="link" className="px-0">
                View Order Status <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg text-left">
              <ShoppingBag className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold text-lg mb-2">Continue Shopping</h3>
              <p className="text-gray-600 mb-4">
                Discover more of our premium products for your skincare regimen.
              </p>
              <Link href="/shop">
                <Button variant="link" className="px-0">
                  Browse Products <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-12">
          <Link href="/">
            <Button className="bg-primary hover:bg-primary/90 text-white">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}