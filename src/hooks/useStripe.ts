import { useState, useCallback } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '../services/firebase';

type CreatePaymentIntentResponse = {
    success: boolean;
    clientSecret?: string | null;
    paymentIntentId?: string;
};

export function useStripePayment() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createPaymentIntent = useCallback(async (amount: number, orderId: string) => {
        setLoading(true);
        setError(null);

        try {
            const functions = getFunctions(app, 'us-central1');
            const createPaymentIntentFn = httpsCallable<
                { amount: number; orderId: string },
                CreatePaymentIntentResponse
            >(functions, 'createPaymentIntent');

            const response = await createPaymentIntentFn({ amount, orderId });

            if (!response.data.success || !response.data.clientSecret) {
                throw new Error('Não foi possível criar o pagamento.');
            }

            return {
                clientSecret: response.data.clientSecret,
                paymentIntentId: response.data.paymentIntentId,
            };
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Erro ao iniciar pagamento.';
            setError(message);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const confirmPaymentStatus = useCallback(async (paymentIntentId: string) => {
        setLoading(true);
        setError(null);

        try {
            const functions = getFunctions(app, 'us-central1');
            const confirmPaymentFn = httpsCallable<
                { paymentIntentId: string },
                { success: boolean; status: string }
            >(functions, 'confirmPayment');

            const response = await confirmPaymentFn({ paymentIntentId });
            return response.data;
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Erro ao confirmar pagamento.';
            setError(message);
            return { success: false, status: 'error' };
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        createPaymentIntent,
        confirmPaymentStatus,
    };
}
