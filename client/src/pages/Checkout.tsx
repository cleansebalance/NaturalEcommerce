import { useState, useEffect } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../hooks/use-auth';
import { apiRequest } from '../lib/queryClient';
import { useToast } from '../hooks/use-toast';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'wouter';
import { formatPrice } from '../lib/utils';

// Load Stripe outside of component render to avoid recreating instance on every render
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Payment form component (inside Stripe Elements)
const CheckoutForm = ({ amount }: { amount: number }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't loaded yet
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('idle');
    setErrorMessage(null);

    // Confirm payment
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order-confirmation`,
      },
      redirect: 'if_required',
    });

    if (error) {
      setIsProcessing(false);
      setPaymentStatus('error');
      setErrorMessage(error.message || 'An error occurred during payment processing');
      toast({
        title: 'Payment failed',
        description: error.message || 'An error occurred during payment processing',
        variant: 'destructive',
      });
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      setIsProcessing(false);
      setPaymentStatus('success');
      toast({
        title: 'Payment successful!',
        description: 'Thank you for your purchase.',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto">
      <div className="mb-6">
        <PaymentElement />
      </div>

      {paymentStatus === 'error' && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center">
          <XCircle className="h-5 w-5 mr-2" />
          <span>{errorMessage}</span>
        </div>
      )}

      {paymentStatus === 'success' && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          <span>Payment successful! Thank you for your purchase.</span>
        </div>
      )}

      <div className="flex justify-between items-center mt-8">
        <span className="text-lg font-semibold">Total: {formatPrice(amount)}</span>
        
        <Button
          type="submit"
          disabled={!stripe || isProcessing}
          className="bg-primary hover:bg-primary/90 text-white"
        >
          {isProcessing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            'Complete Payment'
          )}
        </Button>
      </div>
    </form>
  );
};

// Main Checkout page
export default function Checkout() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [amount, setAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user, isLoading: isAuthLoading } = useAuth();
  const { cartItems, cartTotal, isLoading: isCartLoading } = useCart();
  const { toast } = useToast();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthLoading && !user) {
      window.location.href = '/auth';
    }
  }, [user, isAuthLoading]);

  // Redirect to cart if no cart items
  useEffect(() => {
    if (cartItems.length === 0 && !isCartLoading) {
      window.location.href = '/cart';
    }
  }, [cartItems, isCartLoading]);

  // Create payment intent when component mounts
  useEffect(() => {
    const createIntent = async () => {
      if (!user || cartItems.length === 0) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await apiRequest('POST', '/api/payment/create-intent', {
          cartItems: cartItems,
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to create payment intent');
        }
        
        setClientSecret(data.clientSecret);
        setAmount(data.amount);
      } catch (err) {
        console.error('Payment intent error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        toast({
          title: 'Error',
          description: err instanceof Error ? err.message : 'Failed to initialize payment',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    createIntent();
  }, [user, cartItems, toast]);

  if (isAuthLoading || (user && isLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen max-w-4xl mx-auto px-4 py-16">
        <div className="bg-red-50 p-6 rounded-lg text-center">
          <XCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Payment Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <div className="flex justify-center gap-4">
            <Link href="/cart">
              <Button variant="outline">Return to Cart</Button>
            </Link>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-center mb-12">Checkout</h1>
      
      {clientSecret ? (
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <Elements
            stripe={stripePromise}
            options={{ clientSecret, appearance: { theme: 'stripe' } }}
          >
            <CheckoutForm amount={amount} />
          </Elements>
        </div>
      ) : (
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      <div className="mt-8 text-center">
        <Link href="/cart">
          <Button variant="link" className="text-gray-600">
            Return to Cart
          </Button>
        </Link>
      </div>
    </div>
  );
}