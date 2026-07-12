import { loadStripe } from '@stripe/stripe-js';

export const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';

export const stripePromise = stripePublicKey ? loadStripe(stripePublicKey) : null;

export const stripeElementsOptions = {
  appearance: {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#4A90A4',
      colorBackground: '#ffffff',
      colorText: '#1A1A2E',
      colorDanger: '#df1b41',
      fontFamily: 'Inter, system-ui, sans-serif',
      borderRadius: '8px',
    },
  },
};
