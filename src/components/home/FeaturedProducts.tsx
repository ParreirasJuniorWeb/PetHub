import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Eye } from 'lucide-react';
import type { Product } from '../../types/index';
import { getProducts } from '../../services/firebase';

// loading component
import Loading from "../../components/common/Loader";

export function FeaturedProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const allProducts = await getProducts();
                // Pegar produtos em destaque ou primeiros 8
                const featured = allProducts
                    .filter(p => p.featured)
                    .slice(0, 8);
                setProducts(featured.length > 0 ? featured : allProducts.slice(0, 8));
            } catch (error) {
                console.error('Erro ao carregar produtos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(price);
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <section className="py-16 bg-neutral-light">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h2 className="text-3xl sm:text-4xl font-heading font-bold text-neutral-dark mb-2">
                            Produtos em Destaque
                        </h2>
                        <p className="text-gray-600">
                            Os favoritos dos nossos clientes
                        </p>
                    </div>
                    <Link
                        to="/products"
                        className="hidden sm:inline-flex items-center text-primary hover:text-primary-dark font-medium transition-colors"
                    >
                        Ver todos
                        <Star className="w-4 h-4 ml-2" />
                    </Link>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 group overflow-hidden"
                        >
                            {/* Image */}
                            <div className="relative aspect-square overflow-hidden bg-gray-100">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />

                                {/* Badges */}
                                {product.originalPrice && (
                                    <div className="absolute top-3 left-3 px-2 py-1 bg-secondary text-white text-xs font-semibold rounded-lg">
                                        -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                                    </div>
                                )}

                                {/* Hover Actions */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                    <button className="p-2 bg-white rounded-full text-neutral-dark hover:text-primary transition-colors">
                                        <Eye className="w-5 h-5" />
                                    </button>
                                    <button className="p-2 bg-white rounded-full text-neutral-dark hover:text-primary transition-colors">
                                        <ShoppingCart className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-4">
                                <p className="text-xs text-gray-500 mb-1 uppercase flex gap-1">
                                    {product.category}
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                </p>
                                <h3 className="font-medium text-neutral-dark mb-2 line-clamp-2">
                                    {product.name}
                                </h3>

                                {/* Rating */}
                                {
                                    product.rating
                                    && product.reviews
                                    &&
                                    (
                                        <div className="flex items-center gap-1 mb-2">
                                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                            <span className="text-sm text-gray-600">
                                                {product.rating.toFixed(1)}
                                            </span>
                                            <span className="text-sm text-gray-400">
                                                {product.reviews} - reviews
                                            </span>
                                        </div>
                                    )
                                }

                                {/* Price */}
                                <div className="flex items-center gap-4">
                                    <span className="text-lg font-bold text-primary">
                                        {formatPrice(product.price)}
                                    </span>
                                    {product.originalPrice && (
                                        <span className="text-sm text-gray-400 line-through">
                                            {formatPrice(product.originalPrice)}
                                        </span>
                                    )}
                                    <span className='w-9 h-9 px-1 py-1 flex cursor-pointer hover:bg-slate-900 items-center justify-center rounded-full bg-slate-500 text-2xl text-white'>
                                        <ShoppingCart />
                                    </span>
                                </div>

                                <div className='flex flex-col gap-2 justify-center py-3'>
                                    <p className="text-xs text-gray-500 flex gap-1">
                                        em até 2x de {formatPrice(product.price / 2)} sem juros
                                    </p>

                                    <p className="text-xs text-gray-500 flex gap-1">
                                        Entrega GRÁTIS: <span className='font-bold'>ter., 5 de ago.</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mobile View All */}
                <div className="mt-8 text-center sm:hidden">
                    <Link
                        to="/products"
                        className="inline-flex items-center text-primary hover:text-primary-dark font-medium"
                    >
                        Ver todos os produtos
                        <Star className="w-4 h-4 ml-2" />
                    </Link>
                </div>
            </div>
        </section >
    );
}