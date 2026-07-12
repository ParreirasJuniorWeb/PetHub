import {
    useState,
    useEffect,
    useCallback
} from 'react';
import type { ReactNode } from 'react';
import type { Product, CartItem } from '../types/index';
import { CartContext } from './CartContextDefinition';

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // ============================================
    // PERSISTÊNCIA LOCALSTORAGE
    // ============================================

    // Carregar carrinho do localStorage ao iniciar
    useEffect(() => {
        const loadCart = () => {
            try {
                const savedCart = localStorage.getItem('@pethub:cart');
                if (savedCart) {
                    const parsedCart = JSON.parse(savedCart) as CartItem[];
                    setCart(parsedCart);
                }
            } catch (error) {
                console.error('Erro ao carregar carrinho:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadCart();
    }, []);

    //Salvar carrinho no localStorage quando mudar
    useEffect(() => {
        if (!isLoading) {
            try {
                localStorage.setItem('@pethub:cart', JSON.stringify(cart));
            } catch (error) {
                console.error('Erro ao salvar carrinho:', error);
            }
        }
    }, [cart, isLoading]);

    // ============================================
    // FUNÇÕES AUXILIARES
    // ============================================

    const calculateTotal = (items: CartItem[]): number => {
        return items.reduce((sum, item) => sum + item.total, 0);
    };

    const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    // ============================================
    // ADICIONAR ITEM
    // ============================================

    const addItemCart = useCallback((newItem: Product) => {
        setCart((prevCart) => {
            const existingItemIndex = prevCart.findIndex((item) => item.id === newItem.id);

            if (existingItemIndex !== -1) {
                // Item já existe, incrementa quantidade
                const updatedCart = prevCart.map((item, index) => {
                    if (index === existingItemIndex) {
                        const newQuantity = item.quantity + 1;
                        return {
                            ...item,
                            quantity: newQuantity,
                            total: newQuantity * item.price,
                        };
                    }
                    return item;
                });
                return updatedCart;
            }

            // Novo item, adiciona ao carrinho
            const cartItem: CartItem = {
                ...newItem,
                quantity: 1,
                total: newItem.price,
            };
            return [...prevCart, cartItem];
        });
    }, []);

    // ============================================
    // REMOVER ITEM
    // ============================================

    const removeItemCart = useCallback((productId: string) => {
        setCart((prevCart) => {
            const newCart = prevCart.filter((item) => item.id !== productId);
            return newCart;
        });
    }, []);

    // ============================================
    // ATUALIZAR QUANTIDADE
    // ============================================

    const updateQuantity = useCallback((productId: string, quantity: number) => {
        if (quantity < 1) return;

        setCart((prevCart) => {
            return prevCart.map((item) => {
                if (item.id === productId) {
                    return {
                        ...item,
                        quantity,
                        total: quantity * item.price,
                    };
                }
                return item;
            });
        });
    }, []);

    // ============================================
    // INCREMENTAR QUANTIDADE
    // ============================================

    const incrementQuantity = useCallback((productId: string) => {
        setCart((prevCart) => {
            return prevCart.map((item) => {
                if (item.id === productId) {
                    const newQuantity = item.quantity + 1;
                    return {
                        ...item,
                        quantity: newQuantity,
                        total: newQuantity * item.price,
                    };
                }
                return item;
            });
        });
    }, []);

    // ============================================
    // DECREMENTAR QUANTIDADE
    // ============================================

    const decrementQuantity = useCallback((productId: string) => {
        setCart((prevCart) => {
            const itemToUpdate = prevCart.find((item) => item.id === productId);

            if (itemToUpdate && itemToUpdate.quantity <= 1) {
                // Remove item se quantidade for 1
                return prevCart.filter((item) => item.id !== productId);
            }

            return prevCart.map((item) => {
                if (item.id === productId) {
                    const newQuantity = item.quantity - 1;
                    return {
                        ...item,
                        quantity: newQuantity,
                        total: newQuantity * item.price,
                    };
                }
                return item;
            });
        });
    }, []);

    // ============================================
    // LIMPAR CARRINHO
    // ============================================

    const clearCart = useCallback(() => {
        setCart([]);
    }, []);

    // ============================================
    // VERIFICAR SE ITEM ESTÁ NO CARRINHO
    // ============================================

    const isItemInCart = useCallback((productId: string): boolean => {
        return cart.some((item) => item.id === productId);
    }, [cart]);

    // ============================================
    // OBTER QUANTIDADE DO ITEM
    // ============================================

    const getItemQuantity = useCallback((productId: string): number => {
        const item = cart.find((item) => item.id === productId);
        return item?.quantity || 0;
    }, [cart]);

    // ============================================
    // VALORES CALCULADOS
    // ============================================

    const cartAmount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = calculateTotal(cart);
    const cartTotalFormatted = formatCurrency(cartTotal);

    return (
        <CartContext.Provider
            value={{
                // Estado
                cart,
                cartAmount,
                cartTotal,
                cartTotalFormatted,
                isLoading,

                // Ações
                addItemCart,
                removeItemCart,
                updateQuantity,
                incrementQuantity,
                decrementQuantity,
                clearCart,
                isItemInCart,
                getItemQuantity,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

