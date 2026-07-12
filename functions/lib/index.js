"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripeWebhook = exports.confirmPayment = exports.createPaymentIntent = void 0;
const https_1 = require("firebase-functions/v2/https");
const https_2 = require("firebase-functions/v2/https");
const firebase_functions_1 = require("firebase-functions");
const stripe_1 = __importDefault(require("stripe"));
const getStripeClient = () => {
    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) {
        throw new https_1.HttpsError('failed-precondition', 'Missing STRIPE_SECRET_KEY environment variable');
    }
    return new stripe_1.default(secret);
};
exports.createPaymentIntent = (0, https_1.onCall)({ region: 'us-central1', secrets: ['STRIPE_SECRET_KEY'] }, async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'Usuário não autenticado.');
    }
    const amount = Number(request.data?.amount);
    const orderId = String(request.data?.orderId ?? '');
    if (!Number.isFinite(amount) || amount <= 0) {
        throw new https_1.HttpsError('invalid-argument', 'Valor do pagamento inválido.');
    }
    if (!orderId) {
        throw new https_1.HttpsError('invalid-argument', 'orderId é obrigatório.');
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
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Erro ao criar PaymentIntent.';
        throw new https_1.HttpsError('internal', message);
    }
});
exports.confirmPayment = (0, https_1.onCall)({ region: 'us-central1', secrets: ['STRIPE_SECRET_KEY'] }, async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'Usuário não autenticado.');
    }
    const paymentIntentId = String(request.data?.paymentIntentId ?? '');
    if (!paymentIntentId) {
        throw new https_1.HttpsError('invalid-argument', 'paymentIntentId é obrigatório.');
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
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Erro ao confirmar pagamento.';
        throw new https_1.HttpsError('internal', message);
    }
});
exports.stripeWebhook = (0, https_2.onRequest)({ region: 'us-central1', secrets: ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET'] }, async (req, res) => {
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
    let event;
    try {
        const stripe = getStripeClient();
        event = stripe.webhooks.constructEvent(req.rawBody, signature, webhookSecret);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Invalid signature';
        res.status(400).send(`Webhook Error: ${message}`);
        return;
    }
    try {
        switch (event.type) {
            case 'payment_intent.succeeded': {
                const paymentIntent = event.data.object;
                firebase_functions_1.logger.info('Pagamento aprovado', {
                    paymentIntentId: paymentIntent.id,
                    orderId: paymentIntent.metadata?.orderId,
                    userId: paymentIntent.metadata?.userId,
                });
                break;
            }
            case 'payment_intent.payment_failed': {
                const paymentIntent = event.data.object;
                firebase_functions_1.logger.warn('Pagamento falhou', {
                    paymentIntentId: paymentIntent.id,
                    orderId: paymentIntent.metadata?.orderId,
                    userId: paymentIntent.metadata?.userId,
                });
                break;
            }
            default:
                firebase_functions_1.logger.info('Evento Stripe ignorado', { type: event.type });
        }
        res.status(200).json({ received: true });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Erro interno';
        firebase_functions_1.logger.error('Erro ao processar webhook Stripe', error);
        res.status(500).json({ error: message });
    }
});
//# sourceMappingURL=index.js.map