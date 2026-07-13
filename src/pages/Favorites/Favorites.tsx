import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, Loader2 } from 'lucide-react';
import { useCart } from '../../contexts/useCart';
import { useAuth } from '../../contexts/useAuth';
import type { Product } from '../../types';
import {
  getLocalFavorites,
  getUserFavorites,
  removeFavorite as removeFavoriteRemote,
  setLocalFavorites,
} from '../../services/favorites';

export default function Favorites() {
  const { user } = useAuth();
  const { addItemCart } = useCart();
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadFavorites = async () => {
      setLoading(true);
      try {
        if (user?.uid) {
          const remoteFavorites = await getUserFavorites(user.uid);
          if (active) setFavorites(remoteFavorites);
        } else if (active) {
          setFavorites(getLocalFavorites());
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadFavorites();

    return () => {
      active = false;
    };
  }, [user?.uid]);

  const hasFavorites = useMemo(() => favorites.length > 0, [favorites]);

  const removeFavorite = async (productId: string) => {
    if (user?.uid) {
      await removeFavoriteRemote(user.uid, productId);
      setFavorites((prev) => prev.filter((item) => item.id !== productId));
      return;
    }

    const next = favorites.filter((item) => item.id !== productId);
    setFavorites(next);
    setLocalFavorites(next);
  };

  const handleAddToCart = (product: Product) => {
    addItemCart(product);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-light py-8 w-full">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
            <div className="flex items-center justify-center py-16 gap-3 text-gray-600">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Carregando favoritos...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-light py-8 w-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-neutral-dark">
              Produtos Favoritos
            </h1>
            <Link to="/products" className="text-sm font-medium text-primary hover:underline">
              Explorar produtos
            </Link>
          </div>

          {!hasFavorites && (
            <div className="text-center py-14">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-neutral-dark mb-2">
                Nenhum produto favoritado
              </h2>
              <p className="text-gray-500 mb-6">
                Adicione produtos aos favoritos para encontrá-los facilmente depois.
              </p>
              <Link
                to="/products"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-primary text-white hover:opacity-90"
              >
                Ver catálogo
              </Link>
            </div>
          )}

          {hasFavorites && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {favorites.map((product) => (
                <article
                  key={product.id}
                  className="border border-gray-100 rounded-xl overflow-hidden bg-white"
                >
                  <button
                    onClick={() => navigate(`/productDetails/${product.id}`)}
                    className="w-full text-left"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-44 object-cover"
                    />
                  </button>

                  <div className="p-4">
                    <h2 className="font-semibold text-neutral-dark line-clamp-1">{product.name}</h2>
                    <p className="text-sm text-gray-500 capitalize mb-2">{product.category}</p>
                    <p className="text-lg font-bold text-neutral-dark mb-4">
                      R$ {Number(product.price || 0).toFixed(2)}
                    </p>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary text-white hover:opacity-90"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Carrinho
                      </button>
                      <button
                        onClick={() => removeFavorite(product.id)}
                        className="inline-flex items-center justify-center px-3 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                        title="Remover dos favoritos"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
