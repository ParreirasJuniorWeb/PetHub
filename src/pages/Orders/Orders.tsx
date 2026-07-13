import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/useAuth';
import { getUserOrders } from '../../services/orders';
import type { OrderStatus, PaymentStatus } from '../../types';

type OrderItemView = {
  productId?: string;
  name?: string;
  image?: string;
  price?: number;
  quantity?: number;
};

type OrderView = {
  id: string;
  total: number;
  status: OrderStatus;
  paymentStatus?: PaymentStatus;
  paymentMethod?: 'card' | 'pix' | 'boleto';
  createdAt?: Date | { seconds?: number; toDate?: () => Date } | string | null;
  items?: OrderItemView[];
};

const statusLabel: Record<OrderStatus, string> = {
  pending: 'Pendente',
  processing: 'Em processamento',
  shipped: 'Enviado',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
};

const paymentStatusLabel: Record<PaymentStatus, string> = {
  pending: 'Pendente',
  approved: 'Aprovado',
  rejected: 'Recusado',
  refunded: 'Reembolsado',
};

function formatOrderDate(input: OrderView['createdAt']) {
  if (!input) return 'Data indisponível';

  if (input instanceof Date) {
    return input.toLocaleString('pt-BR');
  }

  if (typeof input === 'string') {
    const date = new Date(input);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleString('pt-BR');
    }
    return 'Data indisponível';
  }

  if (typeof input === 'object') {
    if (typeof input.toDate === 'function') {
      return input.toDate().toLocaleString('pt-BR');
    }

    if (typeof input.seconds === 'number') {
      return new Date(input.seconds * 1000).toLocaleString('pt-BR');
    }
  }

  return 'Data indisponível';
}

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hasOrders = useMemo(() => orders.length > 0, [orders]);

  useEffect(() => {
    const loadOrders = async () => {
      if (!user?.uid) {
        setOrders([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const result = (await getUserOrders(user.uid)) as unknown as OrderView[];
        setOrders(result);
      } catch (err) {
        console.error('Erro ao buscar pedidos:', err);
        setError('Não foi possível carregar seu histórico de compras.');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user?.uid]);

  return (
    <div className="min-h-screen bg-neutral-light py-8 w-full">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4 mb-6">
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-neutral-dark">
              Histórico de Compras
            </h1>
            <Link
              to="/products"
              className="text-sm font-medium text-primary hover:underline"
            >
              Continuar comprando
            </Link>
          </div>

          {loading && (
            <div className="py-16 flex flex-col items-center text-gray-500">
              <Loader2 className="w-8 h-8 animate-spin mb-3" />
              <p>Carregando seus pedidos...</p>
            </div>
          )}

          {!loading && error && (
            <div className="py-10 rounded-xl border border-red-100 bg-red-50 text-red-700 flex items-start gap-3 px-4">
              <AlertCircle className="w-5 h-5 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && !hasOrders && (
            <div className="text-center py-14">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-neutral-dark mb-2">
                Você ainda não possui pedidos
              </h2>
              <p className="text-gray-500 mb-6">
                Assim que finalizar uma compra, ela aparecerá aqui para acompanhamento.
              </p>
              <Link
                to="/products"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-primary text-white hover:opacity-90"
              >
                Ver produtos
              </Link>
            </div>
          )}

          {!loading && !error && hasOrders && (
            <div className="space-y-4">
              {orders.map((order) => (
                <article
                  key={order.id}
                  className="border border-gray-100 rounded-xl p-4 sm:p-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Pedido</p>
                      <p className="font-semibold text-neutral-dark">#{order.id.slice(0, 10)}</p>
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatOrderDate(order.createdAt)}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500">Status</p>
                      <p className="font-medium">{statusLabel[order.status] ?? order.status}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Pagamento</p>
                      <p className="font-medium">
                        {order.paymentStatus
                          ? paymentStatusLabel[order.paymentStatus] ?? order.paymentStatus
                          : 'Não informado'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Método</p>
                      <p className="font-medium uppercase">{order.paymentMethod ?? '—'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Total</p>
                      <p className="font-semibold text-neutral-dark">
                        R$ {Number(order.total || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500 mb-2">Itens</p>
                    <ul className="space-y-2">
                      {(order.items ?? []).map((item, index) => (
                        <li key={`${order.id}-item-${index}`} className="text-sm text-neutral-dark">
                          {item.quantity ?? 1}x {item.name ?? 'Produto'}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
