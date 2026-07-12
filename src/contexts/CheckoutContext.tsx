import { useState, useCallback } from 'react';
import { createOrder } from '../services/firebase';
import type { Address, CartItem } from '../types';
import type { ReactNode } from 'react';
import { useAuth } from './useAuth';
import { checkoutSteps } from './checkoutSteps';
import { CheckoutContext } from './CheckoutContextDefinition';

export function CheckoutProvider({ children }: { children: ReactNode }) {
    const [step, setStep] = useState<'cart' | 'info' | 'payment' | 'payment_stripe' | 'confirmation'>('cart');
    const [currentStep, setCurrentStep] = useState(0);

    const { userData } = useAuth();

    const [address, setAddress] = useState<Address | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'pix' | 'boleto' | null>(null);
    const [cardInfo, setCardInfo] = useState({
        number: '',
        expiry: '',
        cvc: '',
        name: '',
    });
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    const nextStep = useCallback(() => {
        const nextIndex = currentStep + 1;
        if (nextIndex < checkoutSteps.length) {
            setCurrentStep(nextIndex);
            setStep(checkoutSteps[nextIndex]);
        }
    }, [currentStep]);

    const prevStep = useCallback(() => {
        const prevIndex = currentStep - 1;
        if (prevIndex >= 0) {
            setCurrentStep(prevIndex);
            setStep(checkoutSteps[prevIndex]);
        }
    }, [currentStep]);

    const goToStep = useCallback((newStep: 'cart' | 'info' | 'payment' | 'payment_stripe' | 'confirmation') => {
        setStep(newStep);
        setCurrentStep(checkoutSteps.indexOf(newStep));
    }, []);

    const processPayment = useCallback(async () => {
        try {
            if (!address || !cartItems.length) {
                return { success: false, error: 'Dados incompletos' };
            }

            const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0);
            const shipping = subtotal >= 199 ? 0 : 15.90;
            const total = subtotal + shipping;

            const orderId = await createOrder({
                userId: userData?.uid ?? '',
                items: cartItems.map((item) => ({
                    productId: item.id,
                    name: item.name,
                    image: item.image,
                    price: item.price,
                    quantity: item.quantity,
                    total: item.total,
                })),
                subtotal,
                shipping,
                discount: 0,
                total,
                status: 'pending',
                paymentMethod: paymentMethod ?? undefined,
                paymentStatus: 'pending',
                shippingAddress: address,
            });

            goToStep('confirmation');
            return { success: true, orderId };
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Erro ao processar pagamento';
            console.error('Erro ao processar pagamento:', error);
            return { success: false, error: message };
        }
    }, [address, cartItems, paymentMethod, goToStep, userData]);

    const clearCheckout = useCallback(() => {
        setStep('cart');
        setCurrentStep(0);
        setAddress(null);
        setPaymentMethod(null);
        setCardInfo({
            number: '',
            expiry: '',
            cvc: '',
            name: '',
        });
        setCartItems([]);
    }, []);

    return (
        <CheckoutContext.Provider
            value={{
                step,
                currentStep,
                address,
                setAddress,
                paymentMethod,
                setPaymentMethod,
                cardInfo,
                setCardInfo,
                cartItems,
                setCartItems,
                nextStep,
                prevStep,
                goToStep,
                processPayment,
                clearCheckout,
            }}
        >
            {children}
        </CheckoutContext.Provider>
    );
}
