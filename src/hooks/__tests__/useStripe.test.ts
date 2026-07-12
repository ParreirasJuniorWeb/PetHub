import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useStripePayment } from '../useStripe';

const callableMock = vi.fn();

vi.mock('firebase/functions', () => ({
    getFunctions: vi.fn(() => ({})),
    httpsCallable: vi.fn(() => callableMock),
}));

vi.mock('../../services/firebase', () => ({
    app: {},
}));

describe('useStripePayment', () => {
    beforeEach(() => {
        callableMock.mockReset();
    });

    it('createPaymentIntent retorna clientSecret em caso de sucesso', async () => {
        callableMock.mockResolvedValueOnce({
            data: {
                success: true,
                clientSecret: 'cs_test_123',
                paymentIntentId: 'pi_test_123',
            },
        });

        const { result } = renderHook(() => useStripePayment());

        let response: { clientSecret: string; paymentIntentId?: string } | null = null;
        await act(async () => {
            response = await result.current.createPaymentIntent(100, 'order_1');
        });

        expect((response as { clientSecret: string } | null)?.clientSecret).toBe('cs_test_123');
        expect(result.current.error).toBeNull();
    });

    it('createPaymentIntent retorna null em caso de erro', async () => {
        callableMock.mockRejectedValueOnce(new Error('Falha'));

        const { result } = renderHook(() => useStripePayment());

        let response: unknown = 'initial';
        await act(async () => {
            response = await result.current.createPaymentIntent(100, 'order_1');
        });

        expect(response).toBeNull();
        expect(result.current.error).toBeTruthy();
    });

    it('confirmPaymentStatus retorna status em caso de sucesso', async () => {
        callableMock.mockResolvedValueOnce({
            data: { success: true, status: 'succeeded' },
        });

        const { result } = renderHook(() => useStripePayment());

        let response: { success: boolean; status: string } | null = null;
        await act(async () => {
            response = await result.current.confirmPaymentStatus('pi_test_123');
        });

        expect((response as { success: boolean; status: string } | null)?.success).toBe(true);
        expect((response as { success: boolean; status: string } | null)?.status).toBe('succeeded');
    });
});
