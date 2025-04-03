import Stripe from 'stripe';
import { log } from './vite';

// Validate Stripe keys
if (!process.env.STRIPE_SECRET_KEY) {
  log('Missing STRIPE_SECRET_KEY environment variable', 'stripe');
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

// Initialize Stripe
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-03-31.basil' as const,
});

/**
 * Create a payment intent for checkout
 * @param {number} amount - Amount in cents (e.g., 1000 for $10.00)
 * @param {string} currency - Currency code (default: 'usd')
 * @param {Object} metadata - Additional metadata for the payment intent
 * @returns {Promise<Stripe.PaymentIntent>} - The created payment intent
 */
export async function createPaymentIntent(
  amount: number,
  currency = 'usd',
  metadata: Record<string, string> = {}
): Promise<Stripe.PaymentIntent> {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // ensure it's a whole number
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });
    
    log(`Created payment intent for ${amount / 100} ${currency.toUpperCase()}`, 'stripe');
    return paymentIntent;
  } catch (error) {
    log(`Error creating payment intent: ${error instanceof Error ? error.message : String(error)}`, 'stripe');
    throw error;
  }
}

/**
 * Retrieve a payment intent by ID
 * @param {string} id - The payment intent ID
 * @returns {Promise<Stripe.PaymentIntent>} - The payment intent
 */
export async function getPaymentIntent(id: string): Promise<Stripe.PaymentIntent> {
  try {
    return await stripe.paymentIntents.retrieve(id);
  } catch (error) {
    log(`Error retrieving payment intent: ${error instanceof Error ? error.message : String(error)}`, 'stripe');
    throw error;
  }
}

/**
 * Calculate order total from cart items
 * @param {Array} cartItems - Array of cart items with prices
 * @returns {number} - Total amount in cents
 */
export function calculateOrderTotal(cartItems: any[]): number {
  if (!cartItems || !Array.isArray(cartItems)) {
    return 0;
  }
  
  // Sum up prices from cart items
  const total = cartItems.reduce((sum, item) => {
    const price = item.product?.price || 0;
    const quantity = item.quantity || 1;
    return sum + (price * quantity);
  }, 0);
  
  // Convert to cents for Stripe
  return Math.round(total * 100);
}