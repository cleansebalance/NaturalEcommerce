import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { CheckCircle, ShoppingBag, Home } from 'lucide-react';

export default function OrderConfirmation() {
  const [, setLocation] = useLocation();
  const [orderNumber, setOrderNumber] = useState<string>('');
  
  useEffect(() => {
    // Generate a random order number for display purposes
    const generateOrderNumber = () => {
      const prefix = 'BC';
      const randomNum = Math.floor(100000 + Math.random() * 900000);
      const timestamp = new Date().getTime().toString().slice(-4);
      return `${prefix}-${randomNum}-${timestamp}`;
    };
    
    setOrderNumber(generateOrderNumber());
  }, []);

  return (
    <div className="container max-w-3xl mx-auto py-12 px-4">
      <div className="bg-card p-8 rounded-lg shadow-sm text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-primary/10 rounded-full p-4">
            <CheckCircle className="h-12 w-12 text-primary" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-muted-foreground mb-6">
          Thank you for your purchase. Your order has been confirmed.
        </p>
        
        {orderNumber && (
          <div className="bg-secondary p-4 rounded-md mb-8 inline-block">
            <p className="text-sm text-muted-foreground">Order Reference</p>
            <p className="font-mono font-bold">{orderNumber}</p>
          </div>
        )}
        
        <div className="border-t pt-6 mt-6">
          <p className="text-muted-foreground mb-6">
            We've sent a confirmation email with your order details.
            You will receive another email when your order ships.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="flex-1"
              onClick={() => setLocation('/shop')}
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Continue Shopping
            </Button>
            
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setLocation('/')}
            >
              <Home className="mr-2 h-4 w-4" />
              Return Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}