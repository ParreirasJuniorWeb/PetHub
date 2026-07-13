import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Package,
  Heart,
  CreditCard,
  MapPin,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  Loader2,
  Save,
  Eye,
  EyeOff,
} from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '../../contexts/useAuth';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import toast from 'react-hot-toast';
import { db } from '../../services/firebase';
import { getUserFavorites } from '../../services/favorites';
import { getUserOrders } from '../../services/orders';

type TabType = 'profile' | 'orders' | 'wishlist' | 'addresses' | 'payments' | 'notifications' | 'settings';

type NotificationPrefs = {
  orders: boolean;
  promotions: boolean;
  news: boolean;
};

type UserDocAddress = {
  id?: string;
  label?: string;
  street?: string;
  number?: string;
  city?: string;
  state?: string;
};

type UserDocData = {
  displayName?: string;
  email?: string;
  phone?: string;
  cpf?: string;
  birthDate?: string;
  notificationPrefs?: NotificationPrefs;
  addresses?: UserDocAddress[];
};

type OrderLike = {
  id: string;
  status?: string;
  paymentMethod?: string;
  shippingAddress?: {
    street?: string;
    number?: string;
    city?: string;
    state?: string;
  };
};

const tabs = [
  { id: 'profile', label: 'Meu Perfil', icon: User },
  { id: 'orders', label: 'Meus Pedidos', icon: Package },
  { id: 'wishlist', label: 'Favoritos', icon: Heart },
  { id: 'addresses', label: 'Endereços', icon: MapPin },
  { id: 'payments', label: 'Pagamentos', icon: CreditCard },
  { id: 'notifications', label: 'Notificações', icon: Bell },
  { id: 'settings', label: 'Configurações', icon: Settings },
] as const;

export function Profile() {
  const { user, userData, logout, resetPassword } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [loading, setLoading] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [addresses, setAddresses] = useState<string[]>([]);
  const [manualAddress, setManualAddress] = useState('');
  const [lastPaymentMethod, setLastPaymentMethod] = useState<string>('Não identificado');
  const [notificationsPreview, setNotificationsPreview] = useState<string[]>([]);
  const [notifSaving, setNotifSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: userData?.displayName || user?.displayName || '',
    email: userData?.email || user?.email || '',
    phone: '',
    cpf: '',
    birthDate: '',
  });

  const [notifications, setNotifications] = useState<NotificationPrefs>({
    orders: true,
    promotions: true,
    news: false,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const userDocRef = user?.uid ? doc(db, 'users', user.uid) : null;

  useEffect(() => {
    const loadProfileData = async () => {
      if (!user?.uid || !userDocRef) return;

      try {
        const [favorites, ordersRaw, userDocSnap] = await Promise.all([
          getUserFavorites(user.uid),
          getUserOrders(user.uid),
          getDoc(userDocRef),
        ]);

        const orders = ordersRaw as unknown as OrderLike[];

        setFavoritesCount(favorites.length);
        setOrdersCount(orders.length);

        const addressFromOrders = orders
          .map((order) => {
            const shipping = order.shippingAddress;
            if (!shipping) return null;
            const parts = [shipping.street, shipping.number, shipping.city, shipping.state]
              .filter(Boolean)
              .join(', ');
            return parts || null;
          })
          .filter((value): value is string => Boolean(value));

        const paymentMethods = orders
          .map((order) => order.paymentMethod)
          .filter((value): value is string => Boolean(value));

        const statusNotifications = orders
          .map((order) => {
            if (!order.status) return null;
            return `Pedido ${order.id.slice(0, 8)}: ${order.status}`;
          })
          .filter((value): value is string => Boolean(value));

        if (userDocSnap.exists()) {
          const data = userDocSnap.data() as UserDocData;

          setFormData((prev) => ({
            ...prev,
            name: data.displayName || prev.name,
            email: data.email || prev.email,
            phone: data.phone || '',
            cpf: data.cpf || '',
            birthDate: data.birthDate || '',
          }));

          setNotifications({
            orders: data.notificationPrefs?.orders ?? true,
            promotions: data.notificationPrefs?.promotions ?? true,
            news: data.notificationPrefs?.news ?? false,
          });

          const storedAddresses = Array.isArray(data.addresses) ? data.addresses : [];
          const readableStored = storedAddresses
            .map((item) => [item.street, item.number, item.city, item.state].filter(Boolean).join(', '))
            .filter((value): value is string => Boolean(value));

          setAddresses(Array.from(new Set([...readableStored, ...addressFromOrders])));
        } else {
          setAddresses(Array.from(new Set(addressFromOrders)));
        }

        if (paymentMethods.length > 0) {
          const latest = paymentMethods[paymentMethods.length - 1];
          setLastPaymentMethod(String(latest).toUpperCase());
        }

        setNotificationsPreview(
          statusNotifications.length > 0
            ? statusNotifications.slice(0, 5)
            : ['Sem atualizações recentes de pedidos.']
        );
      } catch (error) {
        console.error('Erro ao carregar dados do perfil:', error);
      }
    };

    void loadProfileData();
  }, [user?.uid, userDocRef]);

  const saveNotifications = async () => {
    if (!userDocRef) return;
    setNotifSaving(true);
    try {
      await setDoc(
        userDocRef,
        {
          notificationPrefs: notifications,
          updatedAt: new Date(),
        },
        { merge: true }
      );
      toast.success('Preferências de notificação salvas.');
    } catch (error) {
      console.error(error);
      toast.error('Não foi possível salvar as notificações.');
    } finally {
      setNotifSaving(false);
    }
  };

  const addManualAddress = async () => {
    if (!manualAddress.trim()) return;

    const next = Array.from(new Set([...addresses, manualAddress.trim()]));
    setAddresses(next);
    setManualAddress('');

    if (!userDocRef) return;

    try {
      await setDoc(
        userDocRef,
        {
          addresses: next.map((value, index) => ({
            id: `addr-${index + 1}`,
            label: index === 0 ? 'Principal' : `Endereço ${index + 1}`,
            street: value,
          })),
          updatedAt: new Date(),
        },
        { merge: true }
      );
      toast.success('Endereço adicionado.');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao salvar endereço.');
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!userDocRef || !user?.uid) {
        toast.error('Usuário não autenticado');
        return;
      }

      await setDoc(
        userDocRef,
        {
          uid: user.uid,
          email: formData.email,
          displayName: formData.name,
          phone: formData.phone,
          cpf: formData.cpf,
          birthDate: formData.birthDate,
          updatedAt: new Date(),
        },
        { merge: true }
      );

      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast.error('Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('As senhas não conferem');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('A nova senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      if (!formData.email) {
        toast.error('Email não encontrado para reset de senha');
        return;
      }

      await resetPassword(formData.email);
      toast.success('Enviamos um link de redefinição para seu email.');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao solicitar reset de senha';
      console.error('Erro ao resetar senha:', error);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao fazer logout';
      console.error('Erro ao fazer logout:', error);
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-light py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-64 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="text-center mb-6 pb-6 border-b border-gray-100">
                <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={userData?.displayName}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-primary" />
                  )}
                </div>
                <h2 className="font-heading font-semibold text-neutral-dark">{formData.name || 'Usuário'}</h2>
                <p className="text-sm text-gray-500 truncate">{formData.email}</p>
              </div>

              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                        activeTab === tab.id ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span className="flex items-center space-x-3">
                        <Icon className="w-5 h-5" />
                        <span>{tab.label}</span>
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  );
                })}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sair</span>
                </button>
              </nav>
            </div>
          </aside>

          <main className="flex-1">
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
                <h2 className="text-2xl font-heading font-bold text-neutral-dark mb-6">Meu Perfil</h2>

                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Input
                      label="Nome completo"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Seu nome"
                    />
                    <Input label="Email" type="email" value={formData.email} disabled placeholder="seu@email.com" />
                    <Input
                      label="Telefone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(00) 00000-0000"
                    />
                    <Input
                      label="CPF"
                      type="text"
                      value={formData.cpf}
                      onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                      placeholder="000.000.000-00"
                    />
                    <Input
                      label="Data de nascimento"
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    />
                  </div>

                  <div className="pt-4">
                    <Button type="submit" variant="primary" disabled={loading}>
                      {loading ? (
                        <span className="flex items-center space-x-2">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Salvando...</span>
                        </span>
                      ) : (
                        <span className="flex items-center space-x-2">
                          <Save className="w-5 h-5" />
                          <span>Salvar alterações</span>
                        </span>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
                <h2 className="text-2xl font-heading font-bold text-neutral-dark mb-6">Meus Pedidos</h2>
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-neutral-dark mb-2">
                    {ordersCount > 0 ? `${ordersCount} pedido(s) encontrado(s)` : 'Nenhum pedido ainda'}
                  </h3>
                  <p className="text-gray-500 mb-6">Acompanhe o status dos seus pedidos em tempo real.</p>
                  <Link to="/orders">
                    <Button variant="primary">Acompanhar pedidos</Button>
                  </Link>
                </div>
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
                <h2 className="text-2xl font-heading font-bold text-neutral-dark mb-6">Meus Favoritos</h2>
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-neutral-dark mb-2">
                    {favoritesCount > 0 ? `${favoritesCount} itens favoritados` : 'Nenhum favorito ainda'}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {favoritesCount > 0
                      ? 'Seus produtos favoritos estão salvos e sincronizados com sua conta.'
                      : 'Salve seus produtos favoritos para ver mais tarde'}
                  </p>
                  <Link to="/favorites">
                    <Button variant="primary">Ver favoritos</Button>
                  </Link>
                </div>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-heading font-bold text-neutral-dark">Meus Endereços</h2>
                  <Button variant="outline" size="sm">
                    Adicionar
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-3">
                    <input
                      value={manualAddress}
                      onChange={(e) => setManualAddress(e.target.value)}
                      placeholder="Rua, número, cidade, estado"
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg"
                    />
                    <Button variant="primary" onClick={addManualAddress}>
                      Salvar
                    </Button>
                  </div>

                  {addresses.length === 0 ? (
                    <div className="text-center py-12">
                      <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-neutral-dark mb-2">Nenhum endereço cadastrado</h3>
                      <p className="text-gray-500">Adicione um endereço para entrega</p>
                    </div>
                  ) : (
                    <ul className="space-y-2">
                      {addresses.map((address, idx) => (
                        <li key={`${address}-${idx}`} className="p-3 border border-gray-100 rounded-lg">
                          {address}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
                <h2 className="text-2xl font-heading font-bold text-neutral-dark mb-6">Meus Pagamentos</h2>
                <div className="text-center py-12">
                  <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-neutral-dark mb-2">
                    Último método usado: {lastPaymentMethod}
                  </h3>
                  <p className="text-gray-500">
                    Resumo baseado no histórico dos seus pedidos ({ordersCount} pedido(s)).
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
                <h2 className="text-2xl font-heading font-bold text-neutral-dark mb-6">Notificações</h2>

                <div className="space-y-4">
                  {[
                    {
                      key: 'orders',
                      label: 'Pedidos',
                      description: 'Receba atualizações sobre seus pedidos',
                      enabled: notifications.orders,
                    },
                    {
                      key: 'promotions',
                      label: 'Promoções',
                      description: 'Receba ofertas e promoções exclusivas',
                      enabled: notifications.promotions,
                    },
                    {
                      key: 'news',
                      label: 'Novidades',
                      description: 'Seja avisado sobre novos produtos',
                      enabled: notifications.news,
                    },
                  ].map((notification) => (
                    <div
                      key={notification.key}
                      className="flex items-center justify-between p-4 border border-gray-100 rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium text-neutral-dark">{notification.label}</h3>
                        <p className="text-sm text-gray-500">{notification.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={notification.enabled}
                          onChange={(e) =>
                            setNotifications((prev) => ({
                              ...prev,
                              [notification.key]: e.target.checked,
                            }))
                          }
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                      </label>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <h3 className="font-semibold text-neutral-dark mb-2">Atualizações recentes</h3>
                  <ul className="space-y-2">
                    {notificationsPreview.map((item, index) => (
                      <li
                        key={`${item}-${index}`}
                        className="text-sm text-gray-600 p-3 border border-gray-100 rounded-lg"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4">
                  <Button variant="primary" onClick={saveNotifications} disabled={notifSaving}>
                    {notifSaving ? 'Salvando...' : 'Salvar preferências'}
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
                  <h2 className="text-2xl font-heading font-bold text-neutral-dark mb-6">Alterar Senha</h2>

                  <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    <div className="relative">
                      <Input
                        label="Senha atual"
                        type={showPasswords.current ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                        className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>

                    <div className="relative">
                      <Input
                        label="Nova senha"
                        type={showPasswords.new ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                        className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>

                    <div className="relative">
                      <Input
                        label="Confirmar nova senha"
                        type={showPasswords.confirm ? 'text' : 'password'}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                        className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>

                    <Button type="submit" variant="primary" disabled={loading}>
                      {loading ? (
                        <span className="flex items-center space-x-2">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Alterando...</span>
                        </span>
                      ) : (
                        <span className="flex items-center space-x-2">
                          <Save className="w-5 h-5" />
                          <span>Enviar link de redefinição</span>
                        </span>
                      )}
                    </Button>
                  </form>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
                  <h2 className="text-2xl font-heading font-bold text-neutral-dark mb-4">Sessão</h2>
                  <p className="text-gray-500 mb-6">
                    Você pode encerrar sua sessão atual com segurança a qualquer momento.
                  </p>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="text-red-500 border-red-500 hover:bg-red-50"
                  >
                    Sair da conta
                  </Button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
