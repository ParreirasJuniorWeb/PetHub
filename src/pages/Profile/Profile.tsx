import { useState } from 'react';
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
    EyeOff
} from 'lucide-react';
import { useAuth } from '../../contexts/useAuth';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import toast from 'react-hot-toast';

type TabType = 'profile' | 'orders' | 'wishlist' | 'addresses' | 'payments' | 'notifications' | 'settings';

const tabs = [
    { id: 'profile', label: 'Meu Perfil', icon: User },
    { id: 'orders', label: 'Meus Pedidos', icon: Package },
    { id: 'wishlist', label: 'Favoritos', icon: Heart },
    { id: 'addresses', label: 'Endereços', icon: MapPin },
    { id: 'payments', label: 'Pagamentos', icon: CreditCard },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'settings', label: 'Configurações', icon: Settings },
];

export function Profile() {
    const { user, userData, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<TabType>('profile');
    const [loading, setLoading] = useState(false);

    // Estado do formulário de perfil
    const [formData, setFormData] = useState({
        name: userData?.displayName || user?.displayName || '',
        email: userData?.email || user?.email || '',
        phone: '',
        cpf: '',
        birthDate: '',
    });

    // Estado das notificações
    const [notifications, setNotifications] = useState({
        orders: true,
        promotions: true,
        news: false,
    });

    // Estado de senha
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

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Aqui você atualizaria os dados no Firebase
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success('Perfil atualizado com sucesso!');
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
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

        setLoading(true);

        try {
            // Aqui você atualizaria a senha no Firebase
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success('Senha atualizada com sucesso!');
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Erro ao atualizar senha';
            console.error('Erro ao atualizar senha:', error);
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
                    {/* Sidebar */}
                    <aside className="w-full lg:w-64 shrink-0">
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            {/* User Info */}
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
                                <h2 className="font-heading font-semibold text-neutral-dark">
                                    {formData.name || 'Usuário'}
                                </h2>
                                <p className="text-sm text-gray-500 truncate">{formData.email}</p>
                            </div>

                            {/* Navigation */}
                            <nav className="space-y-1">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id as TabType)}
                                            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${activeTab === tab.id
                                                ? 'bg-primary text-white'
                                                : 'text-gray-600 hover:bg-gray-50'
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

                                {/* Logout */}
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

                    {/* Content */}
                    <main className="flex-1">
                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
                                <h2 className="text-2xl font-heading font-bold text-neutral-dark mb-6">
                                    Meu Perfil
                                </h2>

                                <form onSubmit={handleProfileSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <Input
                                            label="Nome completo"
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Seu nome"
                                        />
                                        <Input
                                            label="Email"
                                            type="email"
                                            value={formData.email}
                                            disabled
                                            placeholder="seu@email.com"
                                        />
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

                        {/* Orders Tab */}
                        {activeTab === 'orders' && (
                            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
                                <h2 className="text-2xl font-heading font-bold text-neutral-dark mb-6">
                                    Meus Pedidos
                                </h2>

                                {/* Empty State */}
                                <div className="text-center py-12">
                                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-neutral-dark mb-2">
                                        Nenhum pedido ainda
                                    </h3>
                                    <p className="text-gray-500 mb-6">
                                        Que tal fazer sua primeira compra?
                                    </p>
                                    <Link to="/products">
                                        <Button variant="primary">
                                            Ver produtos
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Wishlist Tab */}
                        {activeTab === 'wishlist' && (
                            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
                                <h2 className="text-2xl font-heading font-bold text-neutral-dark mb-6">
                                    Meus Favoritos
                                </h2>

                                <div className="text-center py-12">
                                    <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-neutral-dark mb-2">
                                        Nenhum favorito ainda
                                    </h3>
                                    <p className="text-gray-500">
                                        Salve seus produtos favoritos para ver mais tarde
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Addresses Tab */}
                        {activeTab === 'addresses' && (
                            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-heading font-bold text-neutral-dark">
                                        Meus Endereços
                                    </h2>
                                    <Button variant="outline" size="sm">
                                        Adicionar
                                    </Button>
                                </div>

                                <div className="text-center py-12">
                                    <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-neutral-dark mb-2">
                                        Nenhum endereço cadastrado
                                    </h3>
                                    <p className="text-gray-500">
                                        Adicione um endereço para entrega
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Payments Tab */}
                        {activeTab === 'payments' && (
                            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
                                <h2 className="text-2xl font-heading font-bold text-neutral-dark mb-6">
                                    Meus Pagamentos
                                </h2>

                                <div className="text-center py-12">
                                    <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-neutral-dark mb-2">
                                        Nenhum cartão cadastrado
                                    </h3>
                                    <p className="text-gray-500">
                                        Adicione um cartão para compras mais rápidas
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Notifications Tab */}
                        {activeTab === 'notifications' && (
                            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
                                <h2 className="text-2xl font-heading font-bold text-neutral-dark mb-6">
                                    Notificações
                                </h2>

                                <div className="space-y-4">
                                    {[
                                        {
                                            key: 'orders',
                                            label: 'Pedidos',
                                            description: 'Receba atualizações sobre seus pedidos',
                                            enabled: notifications.orders
                                        },
                                        {
                                            key: 'promotions',
                                            label: 'Promoções',
                                            description: 'Receba ofertas e promoções exclusivas',
                                            enabled: notifications.promotions
                                        },
                                        {
                                            key: 'news',
                                            label: 'Novidades',
                                            description: 'Seja avisado sobre novos produtos',
                                            enabled: notifications.news
                                        },
                                    ].map((notification, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-4 border border-gray-100 rounded-lg"
                                        >
                                            <div>
                                                <h3 className="font-medium text-neutral-dark">
                                                    {notification.label}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {notification.description}
                                                </p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={notification.enabled}
                                                    onChange={(e) => setNotifications({
                                                        ...notifications,
                                                        [notification.key]: e.target.checked
                                                    })}
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Settings Tab */}
                        {activeTab === 'settings' && (
                            <div className="space-y-6">
                                {/* Change Password */}
                                <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
                                    <h2 className="text-2xl font-heading font-bold text-neutral-dark mb-6">
                                        Alterar Senha
                                    </h2>

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

                                        <Button
                                            type="submit"
                                            variant="primary"
                                            disabled={loading}>
                                            {loading ? (
                                                <span className="flex items-center space-x-2">
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    <span>Alterando...</span>
                                                </span>
                                            ) : (
                                                <span className="flex items-center space-x-2">
                                                    <Save className="w-5 h-5" />
                                                    <span>Alterar senha</span>
                                                </span>
                                            )}
                                        </Button>
                                    </form>
                                </div>

                                {/* Delete Account */}
                                <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
                                    <h2 className="text-2xl font-heading font-bold text-neutral-dark mb-4">
                                        Excluir Conta
                                    </h2>
                                    <p className="text-gray-500 mb-6">
                                        Ao excluir sua conta, todos os seus dados serão apagados permanentemente. Esta ação não pode ser desfeita.
                                    </p>
                                    <Button
                                        onClick={logout}
                                        variant="outline"
                                        className="text-red-500 border-red-500 hover:bg-red-50">
                                        Excluir minha conta
                                    </Button>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    )
}