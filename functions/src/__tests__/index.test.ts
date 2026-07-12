/// <reference types="jest" />
/* eslint-disable @typescript-eslint/no-explicit-any */

const mockCreate = jest.fn();
const mockRetrieve = jest.fn();
const mockConstructEvent = jest.fn();

jest.mock('stripe', () => {
    return jest.fn().mockImplementation(() => ({
        paymentIntents: {
            create: mockCreate,
            retrieve: mockRetrieve,
        },
        webhooks: {
            constructEvent: mockConstructEvent,
        },
    }));
});

describe('Stripe Firebase Functions', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        process.env.STRIPE_SECRET_KEY = 'sk_test_mock';
        process.env.STRIPE_WEBHOOK_SECRET = 'whsec_mock';
        mockCreate.mockResolvedValue({
            id: 'pi_test_123',
            client_secret: 'cs_test_123',
        });
        mockRetrieve.mockResolvedValue({
            id: 'pi_test_123',
            status: 'succeeded',
            amount: 1000,
            currency: 'brl',
            metadata: { orderId: 'order_1', userId: 'user_1' },
        });
    });

    it('createPaymentIntent should throw unauthenticated when context.auth is missing', async () => {
        const { createPaymentIntent } = await import('../index.js');
        const callable = createPaymentIntent as any;

        await expect(
            callable.run({ amount: 10, orderId: 'order_1' }, { auth: null, rawRequest: {} } as any)
        ).rejects.toMatchObject({ code: 'unauthenticated' });
    });

    it('createPaymentIntent should throw invalid-argument for invalid amount', async () => {
        const { createPaymentIntent } = await import('../index.js');
        const callable = createPaymentIntent as any;
        await expect(
            callable.run(
                { amount: 0, orderId: 'order_1' },
                { auth: { uid: 'user_1' }, rawRequest: {} } as any
            )
        ).rejects.toMatchObject({ code: 'invalid-argument' });
    });

    it('confirmPayment should return succeeded status', async () => {
        const { confirmPayment } = await import('../index.js');
        const callable = confirmPayment as any;
        const result = await callable.run(
            { paymentIntentId: 'pi_test_123' },
            { auth: { uid: 'user_1' }, rawRequest: {} } as any
        );

        expect(result.success).toBe(true);
        expect(result.status).toBe('succeeded');
    });
});
