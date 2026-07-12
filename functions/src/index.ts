import { onCall, HttpsError, CallableRequest } from 'firebase-functions/v2/https';
import { onRequest } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions';
import Stripe from 'stripe';

const getStripeClient = (): Stripe => {
    const secret = process.env.STRIPE_SECRET_KEY;

    if (!secret) {
        throw new HttpsError('failed-precondition', 'Missing STRIPE_SECRET_KEY environment variable');
    }

    return new Stripe(secret);
};

export const createPaymentIntent = onCall(
    { region: 'us-central1', secrets: ['STRIPE_SECRET_KEY'] },
    async (request: CallableRequest<{ amount?: number | string; orderId?: string }>) => {
        if (!request.auth) {
            throw new HttpsError('unauthenticated', 'Usuário não autenticado.');
        }

        const amount = Number(request.data?.amount);
        const orderId = String(request.data?.orderId ?? '');

        if (!Number.isFinite(amount) || amount <= 0) {
            throw new HttpsError('invalid-argument', 'Valor do pagamento inválido.');
        }

        if (!orderId) {
            throw new HttpsError('invalid-argument', 'orderId é obrigatório.');
        }

        try {
            const stripe = getStripeClient();
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(amount * 100),
                currency: 'brl',
                automatic_payment_methods: { enabled: true },
                metadata: {
                    orderId,
                    userId: request.auth.uid,
                },
            });

            return {
                success: true,
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id,
            };
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Erro ao criar PaymentIntent.';
            throw new HttpsError('internal', message);
        }
    }
);

export const confirmPayment = onCall(
    { region: 'us-central1', secrets: ['STRIPE_SECRET_KEY'] },
    async (request: CallableRequest<{ paymentIntentId?: string }>) => {
        if (!request.auth) {
            throw new HttpsError('unauthenticated', 'Usuário não autenticado.');
        }

        const paymentIntentId = String(request.data?.paymentIntentId ?? '');

        if (!paymentIntentId) {
            throw new HttpsError('invalid-argument', 'paymentIntentId é obrigatório.');
        }

        try {
            const stripe = getStripeClient();
            const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

            return {
                success: paymentIntent.status === 'succeeded',
                status: paymentIntent.status,
                amount: paymentIntent.amount,
                currency: paymentIntent.currency,
                metadata: paymentIntent.metadata,
            };
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Erro ao confirmar pagamento.';
            throw new HttpsError('internal', message);
        }
    }
);

export const stripeWebhook = onRequest(
    { region: 'us-central1', secrets: ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET'] },
    async (req, res) => {
        if (req.method !== 'POST') {
            res.status(405).send('Method Not Allowed');
            return;
        }

        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

        if (!webhookSecret) {
            res.status(500).send('Missing STRIPE_WEBHOOK_SECRET configuration');
            return;
        }

        const signature = req.headers['stripe-signature'];

        if (!signature || Array.isArray(signature)) {
            res.status(400).send('Missing stripe-signature header');
            return;
        }

        let event: Stripe.Event;

        try {
            const stripe = getStripeClient();
            event = stripe.webhooks.constructEvent(req.rawBody, signature, webhookSecret);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Invalid signature';
            res.status(400).send(`Webhook Error: ${message}`);
            return;
        }

        try {
            switch (event.type) {
                case 'payment_intent.succeeded': {
                    const paymentIntent = event.data.object as Stripe.PaymentIntent;
                    logger.info('Pagamento aprovado', {
                        paymentIntentId: paymentIntent.id,
                        orderId: paymentIntent.metadata?.orderId,
                        userId: paymentIntent.metadata?.userId,
                    });
                    break;
                }
                case 'payment_intent.payment_failed': {
                    const paymentIntent = event.data.object as Stripe.PaymentIntent;
                    logger.warn('Pagamento falhou', {
                        paymentIntentId: paymentIntent.id,
                        orderId: paymentIntent.metadata?.orderId,
                        userId: paymentIntent.metadata?.userId,
                    });
                    break;
                }
                default:
                    logger.info('Evento Stripe ignorado', { type: event.type });
            }

            res.status(200).json({ received: true });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Erro interno';
            logger.error('Erro ao processar webhook Stripe', error);
            res.status(500).json({ error: message });
        }
    }
);
