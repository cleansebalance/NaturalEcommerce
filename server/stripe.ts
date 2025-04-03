import Stripe from 'stripe';
import { storage } from './storage';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-03-31.basil', // Using the current version supported by Stripe
});

/**
 * Create a payment intent for checkout
 * @param {number} amount - Amount in dollars (e.g., 10.00 for $10.00)
 * @param {string} currency - Currency code (default: 'usd')
 * @param {Object} metadata - Additional metadata for the payment intent
 * @returns {Promise<Stripe.PaymentIntent>} - The created payment intent
 */
export async function createPaymentIntent(
  amount: number,
  currency = 'usd',
  metadata = {}
): Promise<Stripe.PaymentIntent> {
  // Convert dollars to cents for Stripe
  const amountInCents = Math.round(amount * 100);
  
  return await stripe.paymentIntents.create({
    amount: amountInCents,
    currency,
    metadata,
    automatic_payment_methods: {
      enabled: true,
    },
  });
}

/**
 * Calculate order total from cart items
 * @param {Array} cartItems - Array of cart items with product data
 * @returns {number} - Total amount in dollars
 */
export async function calculateOrderTotal(userId: number): Promise<number> {
  const cartItems = await storage.getCartItems(userId);
  return cartItems.reduce((total, item) => {
    return total + (item.product.price * item.quantity);
  }, 0);
}