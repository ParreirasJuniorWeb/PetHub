import { initializeApp } from 'firebase/app';
import {
    getFirestore,
    collection,
    getDocs,
    addDoc,
    doc,
    getDoc,
    query,
    where,
    orderBy,
    Timestamp,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import type { Product, Order } from '../types';

const isDev = import.meta.env.DEV;

const fallbackFirebaseConfig = {
    apiKey: 'AIzaSyDBxWxKaZMLww_O6V1L7UpYjVxK09RhYGM',
    authDomain: 'pethub-41a73.firebaseapp.com',
    projectId: 'pethub-41a73',
    storageBucket: 'pethub-41a73.firebasestorage.app',
    messagingSenderId: '913081764842',
    appId: '1:913081764842:web:e1706ffe097077b9b04093',
};

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || (isDev ? fallbackFirebaseConfig.apiKey : ''),
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || (isDev ? fallbackFirebaseConfig.authDomain : ''),
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || (isDev ? fallbackFirebaseConfig.projectId : ''),
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || (isDev ? fallbackFirebaseConfig.storageBucket : ''),
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || (isDev ? fallbackFirebaseConfig.messagingSenderId : ''),
    appId: import.meta.env.VITE_FIREBASE_APP_ID || (isDev ? fallbackFirebaseConfig.appId : ''),
};

const requiredFirebaseKeys: Array<keyof typeof firebaseConfig> = [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId',
];

const missingFirebaseKeys = requiredFirebaseKeys.filter((key) => !firebaseConfig[key]);

if (missingFirebaseKeys.length > 0) {
    throw new Error(`Firebase config ausente: ${missingFirebaseKeys.join(', ')}`);
}

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Coleções
export const productsRef = collection(db, 'petHub-products');
export const ordersRef = collection(db, 'orders');
export const usersRef = collection(db, 'users');

const toDate = (value: unknown): Date | undefined => {
    if (value instanceof Timestamp) return value.toDate();
    if (value instanceof Date) return value;
    return undefined;
};

// Funções de Produtos
export const getProducts = async (): Promise<Product[]> => {
    const snapshot = await getDocs(productsRef);
    return snapshot.docs.map((docItem) => ({ id: docItem.id, ...docItem.data() } as Product));
};

export const getProductById = async (id: string): Promise<Product | null> => {
    const docRef = doc(db, 'petHub-products', id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() } as Product;
    }
    return null;
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
    const q = query(productsRef, where('category', '==', category));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docItem) => ({ id: docItem.id, ...docItem.data() } as Product));
};

// Funções de Pedidos
export const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date();
    const docRef = await addDoc(ordersRef, {
        ...orderData,
        createdAt: now,
        updatedAt: now
    });
    return docRef.id;
};

export const getOrdersByUser = async (userId: string) => {
    const q = query(ordersRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docItem) => {
        const data = docItem.data();
        return {
            id: docItem.id,
            ...data,
            createdAt: toDate(data.createdAt) ?? new Date(0),
            updatedAt: toDate(data.updatedAt) ?? new Date(0),
        };
    });
};
