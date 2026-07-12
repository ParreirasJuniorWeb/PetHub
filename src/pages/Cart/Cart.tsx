import { Link } from 'react-router-dom';
import {
    ArrowLeft,
    Trash2,
    Minus,
    Plus,
    ShoppingCart,
    Package,
    CreditCard,
    Truck,
    ShieldCheck
} from 'lucide-react';
import { useCart } from '../../contexts/useCart';
import { Button } from '../../components/common/Button';

const Cart = () => {
    const {
        cart,
        cartAmount,
        cartTotalFormatted,
        incrementQuantity,
        decrementQuantity,
        removeItemCart,
        clearCart,
        isLoading,
        getItemQuantity
    } = useCart();

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(price);
    };

    // Estado de carregamento
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-light">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-neutral-dark font-medium">Carregando carrinho...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-light py-8" >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-heading font-bold text-neutral-dark mb-2">
                        Meu Carrinho
                    </h1>
                    <p className="text-gray-600">
                        Revise seus produtos antes de finalizar a compra
                    </p>
                    {cartAmount > 0 && (
                        <p className="text-gray-600 text-sm mt-2">
                            Total de itens: <strong className="text-primary">{cartAmount}</strong>
                        </p>
                    )}
                </div>

                {/* Conteúdo Principal */}
                {cart.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Lista de Produtos */}
                        <div className="lg:col-span-2 space-y-4">
                            {/* Botão Limpar Carrinho */}
                            <div className="flex justify-end">
                                <button
                                    onClick={clearCart}
                                    className="flex items-center space-x-2 px-4 py-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    <span className="text-sm font-medium">Limpar carrinho</span>
                                </button>
                            </div>

                            {/* Itens do Carrinho */}
                            {cart.map((item) => {
                                const quantity = getItemQuantity(item.id);

                                return (
                                    <div
                                        key={item.id}
                                        className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                                    >
                                        <div className="flex flex-col sm:flex-row">
                                            {/* Imagem */}
                                            <div className="w-full sm:w-48 h-48 sm:h-auto flex-shrink-0">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            {/* Informações do Produto */}
                                            <div className="flex-1 p-4 sm:p-6">
                                                <div className="flex flex-col h-full justify-between">
                                                    {/* Categoria e Nome */}
                                                    <div>
                                                        <span className="text-xs font-medium text-primary uppercase tracking-wide">
                                                            {item.category}
                                                        </span>
                                                        <Link
                                                            to={`/productDetails/${item.id}`}
                                                            className="block mt-1"
                                                        >
                                                            <h3 className="text-lg font-medium text-neutral-dark hover:text-primary transition-colors line-clamp-2">
                                                                {item.name}
                                                            </h3>
                                                        </Link>
                                                    </div>

                                                    {/* Preços */}
                                                    <div className="mt-4 space-y-1">
                                                        {item.originalPrice && (
                                                            <p className="text-sm text-gray-400 line-through">
                                                                {formatPrice(item.originalPrice)}
                                                            </p>
                                                        )}
                                                        <p className="text-2xl font-bold text-primary">
                                                            {formatPrice(item.total)}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            Preço unitário: {formatPrice(item.price)}
                                                        </p>
                                                    </div>

                                                    {/* Ações e Quantidade */}
                                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 gap-4">
                                                        {/* Contador de Quantidade */}
                                                        <div className="flex items-center space-x-3">
                                                            <button
                                                                onClick={() => decrementQuantity(item.id)}
                                                                className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 hover:border-primary hover:text-primary transition-colors"
                                                            >
                                                                <Minus className="w-4 h-4" />
                                                            </button>
                                                            <span className="w-12 text-center font-semibold text-lg text-neutral-dark">
                                                                {quantity}
                                                            </span>
                                                            <button
                                                                onClick={() => incrementQuantity(item.id)}
                                                                className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 hover:border-primary hover:text-primary transition-colors"
                                                            >
                                                                <Plus className="w-4 h-4" />
                                                            </button>
                                                        </div>

                                                        {/* Remover */}
                                                        <button
                                                            onClick={() => removeItemCart(item.id)}
                                                            className="flex items-center space-x-2 text-gray-400 hover:text-red-500 transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                            <span className="text-sm font-medium">Remover</span>
                                                        </button>
                                                    </div>

                                                    {/* Informações de Entrega */}
                                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                                                            <Truck className="w-4 h-4 text-green-500" />
                                                            <span>Entrega grátis</span>
                                                            <span className="font-medium text-neutral-dark">
                                                                - Manipulation_formatada
                                                            </span>
                                                        </div>
                                                        {item.stock > 0 && (
                                                            <div className="flex items-center space-x-2 text-sm text-green-600 mt-1">
                                                                <Package className="w-4 h-4" />
                                                                <span>Em estoque</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Resumo do Pedido */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
                                <h2 className="text-xl font-heading font-bold text-neutral-dark mb-6">
                                    Resumo do Pedido
                                </h2>

                                {/* Itens */}
                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal ({cartAmount} itens)</span>
                                        <span className="font-medium text-neutral-dark">{cartTotalFormatted}</span>
                                    </div>
                                    <div className="flex justify-between text-green-600">
                                        <span className="flex items-center space-x-2">
                                            <Truck className="w-4 h-4" />
                                            <span>Frete</span>
                                        </span>
                                        <span className="font-medium">Grátis</span>
                                    </div>
                                    <div className="border-t pt-4 flex justify-between">
                                        <span className="text-lg font-bold text-neutral-dark">Total</span>
                                        <span className="text-lg font-bold text-primary">
                                            {cartTotalFormatted}
                                        </span>
                                    </div>
                                </div>

                                {/* Parcelamento */}
                                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                    <p className="text-sm text-gray-600 mb-2">
                                        em até <strong>2x</strong> de{' '}
                                        <strong>
                                            {formatPrice(
                                                cart.reduce((sum, item) => sum + item.price, 0) / 2
                                            )}
                                        </strong>{' '}
                                        sem juros
                                    </p>
                                </div>

                                {/* Benefícios */}
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                                        <ShieldCheck className="w-5 h-5 text-green-500" />
                                        <span>Compra 100% segura</span>
                                    </div>
                                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                                        <Truck className="w-5 h-5 text-green-500" />
                                        <span>Entrega para todo o Brasil</span>
                                    </div>
                                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                                        <CreditCard className="w-5 h-5 text-green-500" />
                                        <span>Até 12x no cartão</span>
                                    </div>
                                </div>

                                {/* Botão Finalizar */}
                                <Link to="/checkout">
                                    <Button variant="primary" size="lg" className="w-full">
                                        Finalizar Compra
                                    </Button>
                                </Link>

                                {/* Continuar Comprando */}
                                <Link
                                    to="/products"
                                    className="flex items-center justify-center space-x-2 mt-4 text-primary hover:text-primary-dark transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    <span className="font-medium">Continuar comprando</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center py-16">
                        {/* Ícone */}
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                            <ShoppingCart className="w-12 h-12 text-gray-400" />
                        </div>

                        {/* Título */}
                        <h2 className="text-2xl font-heading font-bold text-neutral-dark mb-2">
                            Carrinho vazio
                        </h2>

                        {/* Descrição */}
                        <p className="text-gray-500 text-center max-w-md mb-8">
                            Você ainda não adicionou nenhum produto ao seu carrinho.
                            Que tal conhecer nossos produtos?
                        </p>

                        {/* Botões */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/products">
                                <Button variant="primary" size="lg">
                                    <ShoppingCart className="w-5 h-5 mr-2" />
                                    Ver produtos
                                </Button>
                            </Link>
                            <Button variant="outline" size="lg" onClick={() => window.history.back()}>
                                <ArrowLeft className="w-5 h-5 mr-2" />
                                Voltar
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
};

export default Cart;