// ============================================
// PRODUTO
// ============================================

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    category: string;
    image: string;
    images?: string[];
    stock: number;
    rating?: number;
    reviews?: number;
    featured?: boolean;
    createdAt: Date;
}

// Interface para item no carrinho (estende Product)
export interface CartItem extends Product {
    quantity: number;
    total: number;
}

// ============================================
// CATEGORIA
// ============================================

export interface Category {
    id: string;
    name: string;
    slug: string;
    icon: string;
    image: string;
}

// ============================================
// PEDIDO
// ============================================

export interface Order {
    id: string;
    userId: string;
    items: OrderItem[];
    subtotal: number;
    shipping: number;
    discount: number;
    total: number;
    status: OrderStatus;
    paymentMethod?: PaymentMethod;
    paymentStatus: PaymentStatus;
    createdAt: Date;
    updatedAt: Date;
    shippingAddress: Address;
    trackingCode?: string;
}

export type OrderStatus =
    | 'pending'      // Pendente
    | 'processing'  // Processando
    | 'shipped'      // Enviado
    | 'delivered'   // Entregue
    | 'cancelled'; // Cancelado

export type PaymentMethod =
    | 'card'
    | 'pix'
    | 'boleto';

export type PaymentStatus =
    | 'pending'
    | 'approved'
    | 'rejected'
    | 'refunded';

// ============================================
// ITEM DE PEDIDO
// ============================================

export interface OrderItem {
    productId: string;
    name: string;
    image: string;
    price: number;
    originalPrice?: number;
    quantity: number;
    total: number;
}

// ============================================
// ENDEREÇO
// ============================================

export interface Address {
    id?: string;
    label?: string; // "Casa", "Trabalho", etc.
    street: string;
    number: string;
    complement?: string;
    neighborhood?: string;
    city: string;
    state: string;
    zipCode: string;
    isDefault?: boolean;
}

// ============================================
// USUÁRIO
// ============================================

export interface UserData {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
    phone?: string;
    cpf?: string;
    birthDate?: Date;
    addresses?: Address[];
    createdAt: Date;
    updatedAt: Date;
}