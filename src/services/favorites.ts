import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    setDoc,
    serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Product } from '../types';

const FAVORITES_LOCAL_KEY = 'pethub:favorites';

type FavoritePayload = {
    productId: string;
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
    createdAt?: Date;
    favoritedAt?: unknown;
};

const userFavoritesCollection = (uid: string) => collection(db, 'users', uid, 'favorites');

const userFavoriteDoc = (uid: string, productId: string) =>
    doc(db, 'users', uid, 'favorites', productId);

const toProduct = (favorite: FavoritePayload): Product => ({
    id: favorite.productId,
    name: favorite.name,
    description: favorite.description,
    price: Number(favorite.price || 0),
    originalPrice: favorite.originalPrice,
    category: favorite.category,
    image: favorite.image,
    images: favorite.images,
    stock: Number(favorite.stock || 0),
    rating: favorite.rating,
    reviews: favorite.reviews,
    featured: favorite.featured,
    createdAt: favorite.createdAt ?? new Date(),
});

export const getUserFavorites = async (uid: string): Promise<Product[]> => {
    const snapshot = await getDocs(userFavoritesCollection(uid));
    return snapshot.docs.map((docItem) => toProduct(docItem.data() as FavoritePayload));
};

export const addFavorite = async (uid: string, product: Product): Promise<void> => {
    const payload: FavoritePayload = {
        productId: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice,
        category: product.category,
        image: product.image,
        images: product.images,
        stock: product.stock,
        rating: product.rating,
        reviews: product.reviews,
        featured: product.featured,
        createdAt: product.createdAt,
        favoritedAt: serverTimestamp(),
    };

    await setDoc(userFavoriteDoc(uid, product.id), payload, { merge: true });
};

export const removeFavorite = async (uid: string, productId: string): Promise<void> => {
    await deleteDoc(userFavoriteDoc(uid, productId));
};

export const isFavorite = async (uid: string, productId: string): Promise<boolean> => {
    const snapshot = await getDoc(userFavoriteDoc(uid, productId));
    return snapshot.exists();
};

export const getLocalFavorites = (): Product[] => {
    try {
        const raw = localStorage.getItem(FAVORITES_LOCAL_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw) as Product[];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

export const setLocalFavorites = (favorites: Product[]) => {
    localStorage.setItem(FAVORITES_LOCAL_KEY, JSON.stringify(favorites));
};

export const toggleLocalFavorite = (product: Product): { next: Product[]; active: boolean } => {
    const current = getLocalFavorites();
    const exists = current.some((item) => item.id === product.id);

    if (exists) {
        const next = current.filter((item) => item.id !== product.id);
        setLocalFavorites(next);
        return { next, active: false };
    }

    const next = [...current, product];
    setLocalFavorites(next);
    return { next, active: true };
};
