import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY!);

export interface CreateCheckoutSessionRequest {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}

export const createCheckoutSession = async (request: CreateCheckoutSessionRequest) => {
  try {
    // In a real implementation, this would call your backend API
    // For now, we'll simulate the checkout process
    
    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error('Stripe failed to load');
    }

    // This is where you'd normally call your backend to create a checkout session
    // For demo purposes, we'll redirect to Stripe's test checkout
    console.log('Creating checkout session for price:', request.priceId);
    
    // Simulate API call to your backend
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId: request.priceId,
        successUrl: request.successUrl,
        cancelUrl: request.cancelUrl,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const { sessionId } = await response.json();
    
    // Redirect to Stripe Checkout
    const result = await stripe.redirectToCheckout({
      sessionId,
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    return { success: true };
  } catch (error) {
    console.error('Checkout error:', error);
    throw error;
  }
};

// For demo purposes, we'll create a simple checkout simulation
export const simulateCheckout = async (priceId: string) => {
  const stripe = await stripePromise;
  if (!stripe) {
    throw new Error('Stripe failed to load');
  }

  // Create a test checkout session
  const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.REACT_APP_STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      'payment_method_types[]': 'card',
      'line_items[0][price]': priceId,
      'line_items[0][quantity]': '1',
      'mode': 'subscription',
      'success_url': `${window.location.origin}/success`,
      'cancel_url': `${window.location.origin}/cancel`,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create checkout session');
  }

  const session = await response.json();
  
  // Redirect to Stripe Checkout
  const result = await stripe.redirectToCheckout({
    sessionId: session.id,
  });

  if (result.error) {
    throw new Error(result.error.message);
  }

  return { success: true };
}; 