import { db } from './firebase';
import {
    collection,
    addDoc,
    getDoc,
    doc,
    updateDoc,
    query,
    where,
    getDocs,
    serverTimestamp
} from 'firebase/firestore';
import type { CartItem } from '../types';
import type { Address } from '../types';

interface Order {
    id: string;
    userId: string;
    items: CartItem[];
    total: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    shippingAddress: Address;
    paymentId?: string;
    createdAt: Date;
}

export const createOrder = async (
    userId: string,
    items: CartItem[],
    total: number,
    shippingAddress: Address,
    paymentId?: string
): Promise<string> => {
    const orderRef = await addDoc(collection(db, 'orders'), {
        userId,
        items: items.map(item => ({
            productId: item.id,
            name: item.name,
            image: item.image,
            price: item.price,
            quantity: item.quantity,
        })),
        total,
        status: 'pending',
        shippingAddress,
        paymentId,
        createdAt: serverTimestamp(),
    });

    return orderRef.id;
};

export const getUserOrders = async (userId: string): Promise<Order[]> => {
    const q = query(collection(db, 'orders'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Order[];
};

export const getOrderById = async (orderId: string): Promise<Order | null> => {
    const docRef = doc(db, 'orders', orderId);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() } as Order;
    }
    return null;
};

export const updateOrderStatus = async (
    orderId: string,
    status: Order['status']
): Promise<void> => {
    const docRef = doc(db, 'orders', orderId);
    await updateDoc(docRef, { status });
};