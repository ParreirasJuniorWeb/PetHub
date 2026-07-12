import { useContext } from 'react';
import { CartContext } from './CartContextDefinition';

export function useCart() {
    const context = useContext(CartContext);

    if (context === undefined) {
        throw new Error('useCart deve ser usado dentro de um CartProvider');
    }

    return context;
}
