import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { Redirect, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [, setLocation] = useLocation();
  const { clearCart } = useCart();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + '/order-confirmation',
        },
        redirect: 'if_required',
      });

      if (error) {
        toast({
          title: 'Payment Failed',
          description: error.message,
          variant: 'destructive',
        });
        setProcessing(false);
      } else {
        toast({
          title: 'Payment Successful',
          description: 'Thank you for your purchase!',
        });
        setSucceeded(true);
        
        // Clear the cart after successful payment
        await clearCart();
        
        // Redirect to order confirmation in 2 seconds
        setTimeout(() => {
          setLocation('/order-confirmation');
        }, 2000);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      toast({
        title: 'An error occurred',
        description: 'Please try again later',
        variant: 'destructive',
      });
      setProcessing(false);
    }
  };

  if (succeeded) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <CheckCircle className="h-16 w-16 text-green-500" />
        <h2 className="text-2xl font-bold">Payment Successful!</h2>
        <p className="text-muted-foreground">Thank you for your purchase.</p>
        <p className="text-sm">Redirecting to order confirmation...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 w-full">
      <PaymentElement />
      <Button 
        type="submit" 
        className="w-full" 
        disabled={!stripe || processing}
      >
        {processing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
            Processing
          </>
        ) : (
          <>
            <ShoppingBag className="mr-2 h-4 w-4" />
            Complete Purchase
          </>
        )}
      </Button>
    </form>
  );
};

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { cartItems } = useCart();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Redirect if cart is empty
    if (cartItems.length === 0) {
      setLocation('/cart');
      return;
    }

    // Create PaymentIntent as soon as the page loads
    const createIntent = async () => {
      try {
        setLoading(true);
        const res = await apiRequest('POST', '/api/payment/create-intent');
        
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to create payment intent');
        }
        
        const data = await res.json();
        setClientSecret(data.clientSecret);
      } catch (err: any) {
        console.error('Error creating payment intent:', err);
        setError(err.message || 'An error occurred while processing your payment');
      } finally {
        setLoading(false);
      }
    };

    createIntent();
  }, [cartItems.length, setLocation]);

  // Redirect to login if not authenticated
  if (!user) {
    return <Redirect to="/auth" />;
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Preparing your checkout...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="bg-destructive/10 p-6 rounded-lg max-w-md w-full">
          <h2 className="text-xl font-bold text-destructive mb-2">Payment Error</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => setLocation('/cart')}>
            Return to Cart
          </Button>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <p className="text-muted-foreground">Unable to initiate payment process. Please try again later.</p>
        <Button onClick={() => setLocation('/cart')} className="mt-4">
          Return to Cart
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Secure Checkout</h1>
      
      <div className="bg-card p-6 rounded-lg shadow-sm">
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm />
        </Elements>
      </div>
      
      <div className="mt-8 text-center">
        <Button variant="outline" onClick={() => setLocation('/cart')}>
          Return to Cart
        </Button>
      </div>
    </div>
  );
}