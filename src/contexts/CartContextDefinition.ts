import { createContext } from 'react';
import type { Product, CartItem } from '../types';

export interface CartContextType {
    cart: CartItem[];
    cartAmount: number;
    cartTotal: number;
    cartTotalFormatted: string;
    isLoading: boolean;
    addItemCart: (newItem: Product) => void;
    removeItemCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    incrementQuantity: (productId: string) => void;
    decrementQuantity: (productId: string) => void;
    clearCart: () => void;
    isItemInCart: (productId: string) => boolean;
    getItemQuantity: (productId: string) => number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);
