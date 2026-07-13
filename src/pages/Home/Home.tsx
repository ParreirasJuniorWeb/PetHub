import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Hero } from '../../components/home/Hero';
import { Categories } from '../../components/home/Categories';
import { Services } from '../../components/home/Services';
import { Newsletter } from '../../components/home/Newsletter';
import { useProducts } from '../../hooks/useProducts';
import { useCart } from '../../contexts/useCart';
import { Button } from '../../components/common/Button';
import type { Product } from '../../types';
import toast from 'react-hot-toast';
import { Loader2, ShoppingCart, Eye, Package } from 'lucide-react';

const categories = [
  { id: 'all', name: 'Todos', slug: '' },
  { id: 'food', name: 'Ração', slug: 'food' },
  { id: 'toys', name: 'Brinquedos', slug: 'toys' },
  { id: 'accessories', name: 'Acessórios', slug: 'accessories' },
  { id: 'health', name: 'Saúde', slug: 'health' },
  { id: 'hygiene', name: 'Higiene', slug: 'hygiene' },
  { id: 'beds', name: 'Camas', slug: 'beds' },
];

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [maxPrice, setMaxPrice] = useState(1000);

  const { addItemCart } = useCart();
  const { products, loading, error } = useProducts({
    category: selectedCategory || undefined,
    sortBy: 'newest',
  });

  const filteredByPrice = useMemo(
    () => products.filter((product) => product.price <= maxPrice),
    [products, maxPrice],
  );

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);

  const handleAddToCart = (product: Product) => {
    addItemCart(product);
    toast.success('Produto adicionado ao carrinho.');
  };

  return (
    <div className="min-h-screen">
      <Hero />
      <Categories />

      <section className="py-10 bg-neutral-light">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-neutral-dark">
                Catálogo em destaque
              </h2>
              <p className="text-gray-600">Adicione ao carrinho ou veja detalhes dos produtos direto na Home.</p>
            </div>

            <Link to="/products">
              <Button>Ver catálogo completo</Button>
            </Link>
          </div>

          <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm">
            <p className="mb-3 text-sm font-semibold text-neutral-dark">Filtrar por categoria</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.slug)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    selectedCategory === category.slug
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold text-neutral-dark">Preço máximo</p>
                <span className="text-sm text-primary font-semibold">{formatPrice(maxPrice)}</span>
              </div>
              <input
                type="range"
                min={10}
                max={1000}
                step={10}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-14">
              <Loader2 className="h-9 w-9 animate-spin text-primary" />
            </div>
          )}

          {!loading && error && (
            <div className="rounded-xl bg-red-50 p-4 text-red-600">{error}</div>
          )}

          {!loading && !error && filteredByPrice.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-14 text-center shadow-sm">
              <Package className="mb-3 h-10 w-10 text-gray-400" />
              <p className="font-semibold text-neutral-dark">Nenhum produto encontrado nesses filtros.</p>
              <p className="mt-1 text-sm text-gray-500">Ajuste a categoria ou o preço máximo para continuar.</p>
            </div>
          )}

          {!loading && !error && filteredByPrice.length > 0 && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 sm:gap-6">
              {filteredByPrice.slice(0, 12).map((product) => (
                <div
                  key={product.id}
                  className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:shadow-lg"
                >
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                      <Link
                        to={`/productDetails/${product.id}`}
                        className="rounded-full bg-white p-2 text-neutral-dark transition-colors hover:text-primary"
                      >
                        <Eye className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="rounded-full bg-white p-2 text-neutral-dark transition-colors hover:text-primary"
                      >
                        <ShoppingCart className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-4">
                    <p className="text-xs uppercase text-gray-500">{product.category}</p>
                    <Link to={`/productDetails/${product.id}`}>
                      <h3 className="mt-1 line-clamp-2 font-medium text-neutral-dark transition-colors hover:text-primary">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="rounded-full bg-primary/10 p-2 text-primary transition-colors hover:bg-primary hover:text-white"
                      >
                        <ShoppingCart className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Services />
      <Newsletter />
    </div>
  );
};

export default Home;
