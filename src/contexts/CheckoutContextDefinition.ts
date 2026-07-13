import { createContext } from 'react';
import type { Address, CartItem } from '../types';

export interface CheckoutContextType {
    step: 'cart' | 'info' | 'payment' | 'payment_stripe' | 'confirmation';
    currentStep: number;
    address: Address | null;
    setAddress: (address: Address) => void;
    paymentMethod: 'card' | 'pix' | 'boleto' | null;
    setPaymentMethod: (method: 'card' | 'pix' | 'boleto') => void;
    cardInfo: {
        number: string;
        expiry: string;
        cvc: string;
        name: string;
    };
    setCardInfo: (info: {
        number: string;
        expiry: string;
        cvc: string;
        name: string;
    }) => void;
    cartItems: CartItem[];
    setCartItems: (items: CartItem[]) => void;
    nextStep: () => void;
    prevStep: () => void;
    goToStep: (step: 'cart' | 'info' | 'payment' | 'payment_stripe' | 'confirmation') => void;
    processPayment: (params?: {
        paymentMethod?: 'card' | 'pix' | 'boleto';
        paymentStatus?: 'approved' | 'pending';
    }) => Promise<{ success: boolean; orderId?: string; error?: string }>;
    clearCheckout: () => void;
}

export const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);
