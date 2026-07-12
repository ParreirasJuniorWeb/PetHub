import { useEffect, useMemo, useState } from 'react';
import { useCart } from '../../contexts/useCart';
import { useCheckout } from '../../contexts/useCheckout';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { stripeElementsOptions, stripePromise } from '../../services/stripe';
import toast from 'react-hot-toast';
import { useStripePayment } from '../../hooks/useStripe';

function StripePaymentForm({
  total,
  orderId,
  onBack,
  onPaymentSucceeded,
}: {
  total: number;
  orderId: string;
  onBack: () => void;
  onPaymentSucceeded: () => Promise<void>;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const { createPaymentIntent, confirmPaymentStatus, loading } = useStripePayment();

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      setInitError(null);
      setSubmitError(null);

      const result = await createPaymentIntent(total, orderId);
      if (!mounted) return;

      if (!result?.clientSecret || !result.paymentIntentId) {
        setInitError('Não foi possível iniciar o pagamento com a Stripe.');
        return;
      }

      setClientSecret(result.clientSecret);
      setPaymentIntentId(result.paymentIntentId);
    };

    initialize();

    return () => {
      mounted = false;
    };
  }, [createPaymentIntent, total, orderId]);

  const paymentElementOptions = useMemo(
    () => ({
      layout: 'tabs' as const,
      defaultValues: {
        billingDetails: {
          name: 'Cliente PetHub',
        },
      },
      fields: {
        billingDetails: {
          name: 'auto' as const,
          email: 'auto' as const,
        },
      },
    }),
    [],
  );

  const handleSubmit = async () => {
    if (!stripe || !elements || !clientSecret || !paymentIntentId) return;

    setProcessing(true);
    setSubmitError(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/checkout`,
        },
        redirect: 'if_required',
      });

      if (error) {
        setSubmitError(error.message || 'Não foi possível confirmar o pagamento.');
        return;
      }

      const resolvedPaymentIntentId = paymentIntent?.id ?? paymentIntentId;
      const statusResult = await confirmPaymentStatus(resolvedPaymentIntentId);

      if (!statusResult.success) {
        setSubmitError(`Pagamento ainda não concluído (status: ${statusResult.status}).`);
        return;
      }

      await onPaymentSucceeded();
      toast.success('Pagamento confirmado com sucesso!');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro inesperado ao confirmar pagamento.';
      setSubmitError(message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <p className="font-medium mb-3">Dados de pagamento (Stripe)</p>

      <div className="mb-3 rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
        Escolha sua forma de pagamento diretamente no formulário da Stripe (cartão, PIX, boleto e opções habilitadas na sua conta).
      </div>

      <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
        {clientSecret ? (
          <PaymentElement options={paymentElementOptions} />
        ) : (
          <p className="text-sm text-gray-600">Inicializando formulário de pagamento...</p>
        )}
      </div>

      {initError && <div className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-600">{initError}</div>}
      {submitError && <div className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-600">{submitError}</div>}

      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={processing}
          className="flex-1 rounded-lg bg-gray-200 py-3 font-medium disabled:opacity-50"
        >
          Voltar
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!clientSecret || processing || loading}
          className="flex-1 rounded-lg bg-purple-600 py-3 font-medium text-white disabled:opacity-50"
        >
          {processing || loading ? 'Processando...' : 'Pagar agora'}
        </button>
      </div>
    </div>
  );
}

const handleSuccessToast = () => {
  toast.success('Pagamento realizado com sucesso!');
};

export default function CheckoutPage() {
  const [stableOrderId] = useState(
    () => `order_${crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)}`,
  );

  const { cart, cartTotal, clearCart } = useCart();
  const {
    step,
    nextStep,
    prevStep,
    setAddress,
    setCartItems,
    paymentMethod,
    processPayment,
    goToStep,
  } = useCheckout();

  const [dados, setDados] = useState({
    street: '',
    number: '',
    complement: '',
    city: '',
    state: '',
    zipCode: '',
  });

  useEffect(() => {
    if (cart.length > 0) {
      setCartItems(cart);
    }
  }, [cart, setCartItems]);

  const shipping = cartTotal >= 199 ? 0 : 15.9;
  const total = cartTotal + shipping;

  if (step === 'cart') {
    if (cart.length === 0) {
      return (
        <div className="p-4 text-center">
          <h2 className="mb-4 text-xl font-bold">Seu carrinho está vazio</h2>
          <button
            onClick={() => {
              window.location.href = '/';
            }}
            className="rounded bg-purple-600 px-4 py-2 text-white"
          >
            Voltar às compras
          </button>
        </div>
      );
    }

    return (
      <div className="max-w-2xl mx-auto p-4">
        <h2 className="text-xl font-bold mb-4">Revisar Pedido</h2>

        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between items-center border-b py-3">
              <div className="flex items-center gap-3">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    R$ {item.price.toFixed(2)} x {item.quantity}
                  </p>
                </div>
              </div>
              <p className="font-bold">R$ {item.total.toFixed(2)}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>R$ {cartTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Frete</span>
            <span className={shipping === 0 ? 'text-green-600 font-bold' : ''}>
              {shipping === 0 ? 'Grátis' : `R$ ${shipping.toFixed(2)}`}
            </span>
          </div>
          <div className="flex justify-between text-xl font-bold border-t pt-2">
            <span>Total</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={nextStep}
          className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium"
        >
          Continuar para Entrega
        </button>
      </div>
    );
  }

  if (step === 'info') {
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setAddress({
        street: dados.street,
        number: dados.number,
        complement: dados.complement || '',
        city: dados.city,
        state: dados.state,
        zipCode: dados.zipCode,
      });
      nextStep();
    };

    return (
      <div className="max-w-2xl mx-auto p-4">
        <h2 className="text-xl font-bold mb-4">Endereço de Entrega</h2>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-4 space-y-3">
          <input
            type="text"
            placeholder="Rua/Avenida *"
            required
            className="w-full border border-gray-300 rounded p-2"
            value={dados.street}
            onChange={(e) => setDados({ ...dados, street: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Número *"
              required
              className="w-full border border-gray-300 rounded p-2"
              value={dados.number}
              onChange={(e) => setDados({ ...dados, number: e.target.value })}
            />
            <input
              type="text"
              placeholder="Complemento"
              className="w-full border border-gray-300 rounded p-2"
              value={dados.complement}
              onChange={(e) => setDados({ ...dados, complement: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Cidade *"
              required
              className="w-full border border-gray-300 rounded p-2"
              value={dados.city}
              onChange={(e) => setDados({ ...dados, city: e.target.value })}
            />
            <input
              type="text"
              placeholder="Estado *"
              required
              className="w-full border border-gray-300 rounded p-2"
              value={dados.state}
              onChange={(e) => setDados({ ...dados, state: e.target.value })}
            />
          </div>
          <input
            type="text"
            placeholder="CEP *"
            required
            className="w-full border border-gray-300 rounded p-2"
            value={dados.zipCode}
            onChange={(e) => setDados({ ...dados, zipCode: e.target.value })}
          />

          <div className="flex gap-3 pt-3">
            <button type="button" onClick={prevStep} className="w-1/2 bg-gray-200 py-3 rounded-lg font-medium">
              Voltar
            </button>
            <button type="submit" className="w-1/2 bg-purple-600 text-white py-3 rounded-lg font-medium">
              Continuar
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (step === 'payment') {
    const handlePaymentSucceeded = async () => {
      const result = await processPayment();
      if (result.success) {
        handleSuccessToast();
        clearCart();
      } else {
        toast.error(result.error || 'Erro ao registrar pedido');
      }
    };

    return (
      <div className="max-w-2xl mx-auto p-4">
        <h2 className="text-xl font-bold mb-4">Pagamento</h2>

        {stripePromise && (
          <Elements
            stripe={stripePromise}
            options={{
              ...stripeElementsOptions,
              mode: 'payment',
              currency: 'brl',
              amount: Math.round(total * 100),
            }}
          >
            <StripePaymentForm
              total={total}
              orderId={stableOrderId}
              onBack={prevStep}
              onPaymentSucceeded={handlePaymentSucceeded}
            />
          </Elements>
        )}

        <div className="bg-gray-50 rounded-lg shadow-md p-4 mb-4">
          <p className="font-medium mb-2">Resumo do Pedido</p>
          <div className="flex justify-between text-sm mb-1">
            <span>Subtotal ({cart.length} itens)</span>
            <span>R$ {cartTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span>Frete</span>
            <span>{shipping === 0 ? 'Grátis' : `R$ ${shipping.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'confirmation') {
    return (
      <div className="max-w-2xl mx-auto p-4 text-center">
        <div className="bg-white rounded-lg shadow-md p-8 mb-4">
          <div className="text-green-500 text-5xl mb-4">✓</div>
          <h2 className="text-2xl font-bold mb-2">Pedido Realizado!</h2>
          <p className="text-gray-600">Obrigado pela sua compra no Pet Shop!</p>
          <p className="mt-4 text-lg">
            Total pago: <span className="font-bold">R$ {total.toFixed(2)}</span>
          </p>
        </div>

        <button
          onClick={() => goToStep('cart')}
          className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium"
        >
          Voltar às Compras
        </button>
      </div>
    );
  }

  return null;
}
