import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    ChevronRight,
    Star,
    ShoppingCart,
    Heart,
    Truck,
    ShieldCheck,
    ArrowLeft,
    Check,
    Minus,
    Plus,
    Loader2,
    ZoomIn
} from 'lucide-react';
import { useProduct } from '../../hooks/useProduct';
import { useProducts } from '../../hooks/useProducts';
import { useCart } from '../../contexts/useCart';
import { Button } from '../../components/common/Button';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/useAuth';
import {
    addFavorite,
    getLocalFavorites,
    isFavorite as isFavoriteRemote,
    removeFavorite,
    toggleLocalFavorite
} from '../../services/favorites';

const ProductDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { product, loading, error } = useProduct(id || '');
    const { products: relatedProducts } = useProducts();
    const { addItemCart } = useCart();
    const { user } = useAuth();

    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [showZoom, setShowZoom] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(price);
    };

    const handleAddToCart = () => {
        if (product) {
            // Adicionar múltiplos da quantidade selecionada
            for (let i = 0; i < quantity; i++) {
                addItemCart(product);
                toast.success("Produto adicionado ao carrinho.")
            }
            setAddedToCart(true);
            setTimeout(() => setAddedToCart(false), 2000);
        }
    };

    const incrementQuantity = () => setQuantity((prev) => prev + 1);
    const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

    useEffect(() => {
        let active = true;

        const syncFavoriteState = async () => {
            if (!product) return;

            if (user?.uid) {
                const remoteState = await isFavoriteRemote(user.uid, product.id);
                if (active) setIsFavorite(remoteState);
                return;
            }

            const localState = getLocalFavorites().some((item) => item.id === product.id);
            if (active) setIsFavorite(localState);
        };

        void syncFavoriteState();

        return () => {
            active = false;
        };
    }, [product, user?.uid]);

    const handleToggleFavorite = async () => {
        if (!product) return;

        if (user?.uid) {
            if (isFavorite) {
                await removeFavorite(user.uid, product.id);
                setIsFavorite(false);
                toast.success('Removido dos favoritos.');
                return;
            }

            await addFavorite(user.uid, product);
            setIsFavorite(true);
            toast.success('Adicionado aos favoritos.');
            return;
        }

        const { active } = toggleLocalFavorite(product);
        setIsFavorite(active);
        toast.success(active ? 'Adicionado aos favoritos.' : 'Removido dos favoritos.');
    };

    // Imagens do produto (fallback para image única)
    const images = product?.images?.length ? product.images : [product?.image].filter(Boolean);
    const discount = product?.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    // Loading
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-light">
                <div className="flex flex-col items-center space-y-4">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    <p className="text-neutral-dark font-medium">Carregando produto...</p>
                </div>
            </div>
        );
    }

    // Error
    if (error || !product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-light">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error || 'Produto não encontrado'}</p>
                    <Button onClick={() => navigate('/products')}>
                        Voltar aos produtos
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-light py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6 overflow-x-auto">
                    <Link to="/" className="hover:text-primary transition-colors whitespace-nowrap">
                        Início
                    </Link>
                    <ChevronRight className="w-4 h-4 shrink-0" />
                    <Link to="/products" className="hover:text-primary transition-colors whitespace-nowrap">
                        Produtos
                    </Link>
                    <ChevronRight className="w-4 h-4 shrink-0" />
                    <Link
                        to={`/products?category=${product.category}`}
                        className="hover:text-primary transition-colors whitespace-nowrap capitalize"
                    >
                        {product.category}
                    </Link>
                    <ChevronRight className="w-4 h-4 shrink-0" />
                    <span className="text-neutral-dark truncate max-w-50
                     whitespace-nowrap">
                        {product.name}
                    </span>
                </nav>

                {/* Detalhes do Produto */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
                        {/* ============================================ */}
                        {/* GALERIA DE IMAGENS */}
                        {/* ============================================ */}
                        <div className="space-y-4">
                            {/* Imagem Principal */}
                            <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden group">
                                <img
                                    src={images[selectedImage]}
                                    alt={`${product.name} - Imagem ${selectedImage + 1}`}
                                    className="w-full h-full object-cover"
                                />

                                {/* Badges */}
                                {discount > 0 && (
                                    <div className="absolute top-4 left-4 px-3 py-1 bg-secondary text-white text-sm font-semibold rounded-lg">
                                        -{discount}%
                                    </div>
                                )}
                                {product.featured && !product.originalPrice && (
                                    <div className="absolute top-4 left-4 px-3 py-1 bg-primary text-white text-sm font-semibold rounded-lg">
                                        Novo
                                    </div>
                                )}

                                {/* Botão Zoom */}
                                <button
                                    onClick={() => setShowZoom(true)}
                                    className="absolute bottom-4 right-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50"
                                >
                                    <ZoomIn className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>

                            {/* Miniaturas */}
                            {images.length > 1 && (
                                <div className="flex gap-3 overflow-x-auto pb-2">
                                    {images.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === index
                                                ? 'border-primary'
                                                : 'border-transparent hover:border-gray-300'
                                                }`}
                                        >
                                            <img
                                                src={image}
                                                alt={`${product.name} - Miniatura ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Modal de Zoom */}
                            {showZoom && (
                                <div
                                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center cursor-zoom-out"
                                    onClick={() => setShowZoom(false)}
                                >
                                    <button
                                        onClick={() => setShowZoom(false)}
                                        className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center"
                                    >
                                        <span className="text-gray-600 font-bold text-xl">×</span>
                                    </button>
                                    <img
                                        src={images[selectedImage]}
                                        alt={product.name}
                                        className="max-w-[90vw] max-h-[90vh] object-contain"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                            )}
                        </div>

                        {/* ============================================ */}
                        {/* INFORMAÇÕES DO PRODUTO */}
                        {/* ============================================ */}
                        <div className="space-y-6">
                            {/* Categoria */}
                            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full capitalize">
                                {product.category}
                            </span>

                            {/* Título */}
                            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-neutral-dark">
                                {product.name}
                            </h1>

                            {/* Avaliação */}
                            {product.rating && (
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`w-5 h-5 ${star <= Math.round(product.rating || 0)
                                                    ? 'text-yellow-400 fill-current'
                                                    : 'text-gray-300'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-gray-600">
                                        {product.rating.toFixed(1)} ({product.reviews} avaliações)
                                    </span>
                                </div>
                            )}

                            {/* Preço */}
                            <div className="space-y-2">
                                <div className="flex items-baseline gap-3">
                                    {product.originalPrice && (
                                        <span className="text-xl text-gray-400 line-through">
                                            {formatPrice(product.originalPrice)}
                                        </span>
                                    )}
                                    <span className="text-3xl font-bold text-primary">
                                        {formatPrice(product.price)}
                                    </span>
                                </div>

                                {discount > 0 && (
                                    <span className="inline-block px-2 py-1 bg-secondary text-white text-sm font-semibold rounded-lg">
                                        {discount}% OFF
                                    </span>
                                )}

                                <p className="text-sm text-gray-500">
                                    em até 2x de {formatPrice(product.price / 2)} sem juros
                                </p>
                            </div>

                            {/* Descrição */}
                            <p className="text-gray-600 leading-relaxed">
                                {product.description}
                            </p>

                            {/* Estoque */}
                            <div className="flex items-center gap-2">
                                {product.stock > 0 ? (
                                    <>
                                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                        <span className="text-green-600 font-medium">
                                            Em estoque ({product.stock} unidades)
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <span className="w-2 h-2 bg-red-500 rounded-full" />
                                        <span className="text-red-600 font-medium">Indisponível</span>
                                    </>
                                )}
                            </div>

                            {/* Quantidade */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Quantidade:</label>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center border border-gray-200 rounded-lg">
                                        <button
                                            onClick={decrementQuantity}
                                            className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                            disabled={quantity <= 1}
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="w-12 text-center font-semibold text-lg">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={incrementQuantity}
                                            className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        Máximo {product.stock} unidades
                                    </span>
                                </div>
                            </div>

                            {/* Botões de Ação */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button
                                    variant="primary"
                                    size="lg"
                                    className="flex-1"
                                    disabled={product.stock <= 0}
                                    onClick={handleAddToCart}
                                >
                                    {addedToCart ? (
                                        <>
                                            <Check className="w-5 h-5 mr-2" />
                                            Adicionado!
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingCart className="w-5 h-5 mr-2" />
                                            Adicionar ao Carrinho
                                        </>
                                    )}
                                </Button>

                                <Button
                                    variant="outline"
                                    size="lg"
                                    onClick={handleToggleFavorite}
                                >
                                    <Heart
                                        className={`w-5 h-5 ${isFavorite ? 'fill-current text-red-500' : ''
                                            }`}
                                    />
                                </Button>
                            </div>

                            {/* Benefícios */}
                            <div className="space-y-3 pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Truck className="w-5 h-5 text-green-500" />
                                    <span>Frete grátis para todo o Brasil</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <ShieldCheck className="w-5 h-5 text-green-500" />
                                    <span>Compra 100% segura</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Check className="w-5 h-5 text-green-500" />
                                    <span>Produto original e lacrado</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ============================================ */}
                {/* ESPECIFICAÇÕES TÉCNICAS */}
                {/* ============================================ */}
                <div className="mt-8 bg-gray-50 rounded-2xl p-6">
                    <h3 className="text-lg font-heading font-semibold text-neutral-dark mb-4">
                        Especificações Técnicas
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex justify-between p-3 bg-white rounded-lg">
                            <span className="text-gray-600">Categoria</span>
                            <span className="font-medium capitalize">{product.category}</span>
                        </div>
                        <div className="flex justify-between p-3 bg-white rounded-lg">
                            <span className="text-gray-600">Código do Produto</span>
                            <span className="font-medium">{product.id}</span>
                        </div>
                        <div className="flex justify-between p-3 bg-white rounded-lg">
                            <span className="text-gray-600">Disponibilidade</span>
                            <span className="font-medium text-green-600">
                                {product.stock > 0 ? 'Em estoque' : 'Indisponível'}
                            </span>
                        </div>
                        <div className="flex justify-between p-3 bg-white rounded-lg">
                            <span className="text-gray-600">Garantia</span>
                            <span className="font-medium">90 dias</span>
                        </div>
                    </div>
                </div>

                {/* ============================================ */}
                {/* PRODUTOS RELACIONADOS */}
                {/* ============================================ */}
                <div className="mt-16">
                    <h2 className="text-2xl font-heading font-bold text-neutral-dark mb-6">
                        Produtos Relacionados
                    </h2>

                    {relatedProducts && relatedProducts.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                            {relatedProducts
                                .filter((p) => p.id !== product.id)
                                .slice(0, 4)
                                .map((relatedProduct) => {
                                    const relatedDiscount = relatedProduct.originalPrice
                                        ? Math.round(
                                            ((relatedProduct.originalPrice - relatedProduct.price) /
                                                relatedProduct.originalPrice) *
                                            100
                                        )
                                        : 0;

                                    return (
                                        <Link
                                            key={relatedProduct.id}
                                            to={`/productDetails/${relatedProduct.id}`}
                                            className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
                                        >
                                            <div className="relative aspect-square bg-gray-100">
                                                <img
                                                    src={relatedProduct.image}
                                                    alt={relatedProduct.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                />
                                                {relatedDiscount > 0 && (
                                                    <div className="absolute top-3 left-3 px-2 py-1 bg-secondary text-white text-xs font-semibold rounded-lg">
                                                        -{relatedDiscount}%
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-4">
                                                <span className="text-xs text-gray-500 uppercase">
                                                    {relatedProduct.category}
                                                </span>
                                                <h3 className="font-medium text-neutral-dark mt-1 line-clamp-2">
                                                    {relatedProduct.name}
                                                </h3>
                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="text-lg font-bold text-primary">
                                                        {formatPrice(relatedProduct.price)}
                                                    </span>
                                                    <button className="p-2 bg-primary/10 rounded-full text-primary hover:bg-primary hover:text-white transition-colors">
                                                        <ShoppingCart className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-2xl">
                            <p className="text-gray-500">
                                Nenhum produto relacionado encontrado
                            </p>
                        </div>
                    )}
                </div>

                {/* Voltar */}
                <div className="mt-8">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/products')}
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Voltar aos produtos
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;