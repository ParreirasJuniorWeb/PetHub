import { Link } from 'react-router-dom';
import {
    Search,
    SlidersHorizontal,
    X,
    Star,
    ShoppingCart,
    Eye,
    Loader2,
    Grid2X2,
    Grid3X3,
    Package
} from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { useCart } from '../../contexts/useCart';
import { Button } from '../../components/common/Button';
import type { Product } from '../../types';
import { useState } from 'react';
import toast from 'react-hot-toast';

// Categorias disponíveis
const categories = [
    { id: 'all', name: 'Todos', slug: '' },
    { id: 'food', name: 'Ração', slug: 'food' },
    { id: 'toys', name: 'Brinquedos', slug: 'toys' },
    { id: 'accessories', name: 'Acessórios', slug: 'accessories' },
    { id: 'health', name: 'Saúde', slug: 'health' },
    { id: 'hygiene', name: 'Higiene', slug: 'hygiene' },
    { id: 'beds', name: 'Camas', slug: 'beds' },
];

// Opções de ordenação
const sortOptions = [
    { id: 'newest', name: 'Mais recentes' },
    { id: 'name', name: 'Nome (A-Z)' },
    { id: 'price-asc', name: 'Menor preço' },
    { id: 'price-desc', name: 'Maior preço' },
    { id: 'rating', name: 'Melhor avaliação' },
];

const Products = () => {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showFilters, setShowFilters] = useState(false);

    // Estados locais
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [selectedCategory, setSelectedCategory] = useState('');

    const { addItemCart } = useCart();

    // Hook de produtos com filtros
    const { products, loading, error, total } = useProducts({
        category: selectedCategory || undefined,
        search: search || undefined,
        sortBy: sortBy as 'name' | 'price-asc' | 'price-desc' | 'rating' | 'newest',
    });

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(price);
    };

    // Handlers
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
    };

    const handleCategoryClick = (slug: string) => {
        setSelectedCategory(slug);
    };

    const handleClearFilters = () => {
        setSearch('');
        setSelectedCategory('');
        setSortBy('newest');
        toast.success("Seu carrinho está vazio.");
    };

    const handleAddToCart = (product: Product, e: React.MouseEvent) => {
        e.preventDefault();
        addItemCart(product);
        toast.success("Produto adicionado ao carrinho.");
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-light">
                <div className="flex flex-col items-center space-y-4">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    <p className="text-neutral-dark font-medium">Carregando produtos...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-light">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <Button onClick={() => window.location.reload()}>
                        Tentar novamente
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-light py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-heading font-bold text-neutral-dark mb-2">
                        Nossos Produtos
                    </h1>
                    <p className="text-gray-600">
                        Encontre tudo que seu pet precisa
                    </p>
                </div>

                {/* Barra de Busca e Filtros */}
                <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Busca */}
                        <form onSubmit={handleSearch} className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar produtos..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                />
                                {search && (
                                    <button
                                        type="button"
                                        onClick={() => setSearch('')}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        </form>

                        {/* Ordenação e View Mode */}
                        <div className="flex items-center gap-3">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                            >
                                {sortOptions.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.name}
                                    </option>
                                ))}
                            </select>

                            <div className="hidden lg:flex items-center border border-gray-200 rounded-xl overflow-hidden">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-3 ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <Grid2X2 className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-3 ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <Grid3X3 className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Mobile Filter Toggle */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="lg:hidden p-3 border border-gray-200 rounded-xl"
                            >
                                <SlidersHorizontal className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                    </div>

                    {/* Categorias (Desktop) */}
                    <div className="hidden lg:flex items-center gap-2 mt-4 pt-4 border-t border-gray-100 overflow-x-auto pb-2">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => handleCategoryClick(category.slug)}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === category.slug
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Categorias (Mobile) */}
                {showFilters && (
                    <div className="lg:hidden bg-white rounded-2xl shadow-sm p-4 mb-6">
                        <div className="flex flex-wrap gap-2">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => {
                                        handleCategoryClick(category.slug);
                                        setShowFilters(false);
                                    }}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category.slug
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Resultados */}
                <div className="flex items-center justify-between mb-6">
                    <p className="text-gray-600">
                        <strong className="text-primary">{total}</strong> produtos encontrados
                    </p>

                    {(search || selectedCategory) && (
                        <button
                            onClick={handleClearFilters}
                            className="flex items-center space-x-2 text-sm text-primary hover:text-primary-dark"
                        >
                            <X className="w-4 h-4" />
                            <span>Limpar filtros</span>
                        </button>
                    )}
                </div>

                {/* Grid de Produtos */}
                {products.length > 0 ? (
                    <div
                        className={
                            viewMode === 'grid'
                                ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6'
                                : 'grid grid-cols-1 md:grid-cols-2 gap-4'
                        }
                    >
                        {products.map((product) => {
                            const discount = product.originalPrice
                                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                                : 0;

                            return (
                                <div
                                    key={product.id}
                                    className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 group overflow-hidden"
                                >
                                    {/* Imagem */}
                                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />

                                        {/* Badge de Desconto */}
                                        {discount > 0 && (
                                            <div className="absolute top-3 left-3 px-2 py-1 bg-secondary text-white text-xs font-semibold rounded-lg">
                                                -{discount}%
                                            </div>
                                        )}

                                        {/* Badge de Novo */}
                                        {product.featured && !product.originalPrice && (
                                            <div className="absolute top-3 left-3 px-2 py-1 bg-primary text-white text-xs font-semibold rounded-lg">
                                                Novo
                                            </div>
                                        )}

                                        {/* ações no Hover */}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                            <Link
                                                to={`/productDetails/${product.id}`}
                                                className="p-2 bg-white rounded-full text-neutral-dark hover:text-primary transition-colors"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </Link>
                                            <button
                                                onClick={(e) => handleAddToCart(product, e)}
                                                className="p-2 bg-white rounded-full text-neutral-dark hover:text-primary transition-colors"
                                            >
                                                <ShoppingCart className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Informações */}
                                    <div className="p-4">
                                        <span className="text-xs text-gray-500 uppercase">
                                            {product.category}
                                        </span>
                                        <Link to={`/productDetails/${product.id}`}>
                                            <h3 className="font-medium text-neutral-dark mt-1 line-clamp-2 hover:text-primary transition-colors">
                                                {product.name}
                                            </h3>
                                        </Link>

                                        {/* Avaliação */}
                                        {product.rating && (
                                            <div className="flex items-center gap-1 mt-2">
                                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                <span className="text-sm text-gray-600">
                                                    {product.rating.toFixed(1)}
                                                </span>
                                                {product.reviews && (
                                                    <span className="text-sm text-gray-400">
                                                        ({product.reviews})
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        {/* Preço */}
                                        <div className="flex items-center justify-between mt-3">
                                            <div>
                                                {product.originalPrice && (
                                                    <span className="text-sm text-gray-400 line-through mr-2">
                                                        {formatPrice(product.originalPrice)}
                                                    </span>
                                                )}
                                                <span className="text-xl font-bold text-primary">
                                                    {formatPrice(product.price)}
                                                </span>
                                            </div>
                                            <button
                                                onClick={(e) => handleAddToCart(product, e)}
                                                className="p-2 bg-primary/10 rounded-full text-primary hover:bg-primary hover:text-white transition-colors"
                                            >
                                                <ShoppingCart className="w-5 h-5" />
                                            </button>
                                        </div>

                                        {/* Informações Extras (List View) */}
                                        {viewMode === 'list' && (
                                            <div className="mt-4 pt-4 border-t border-gray-100">
                                                <p className="text-sm text-gray-600 line-clamp-2">
                                                    {product.description}
                                                </p>
                                                <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                                        {product.stock > 0 ? 'Em estoque' : 'Indisponível'}
                                                    </span>
                                                    <span>Frete grátis</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Parcelamento */}
                                        <div className="mt-2 text-xs text-gray-500">
                                            em até 2x de {formatPrice(product.price / 2)} sem juros
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                            <Package className="w-12 h-12 text-gray-400" />
                        </div>
                        <h2 className="text-2xl font-heading font-bold text-neutral-dark mb-2">
                            Nenhum produto encontrado
                        </h2>
                        <p className="text-gray-500 text-center max-w-md mb-8">
                            Tente ajustar seus filtros de busca ou explorar outras categorias.
                        </p>
                        <Button onClick={handleClearFilters}>
                            Limpar filtros
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Products;