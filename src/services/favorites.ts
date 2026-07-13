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

export type FavoritePayload = {
    productId?: string;
    id?: string;
    name?: string;
    description?: string;
    price?: number;
    originalPrice?: number;
    category?: string;
    image?: string;
    images?: string[];
    stock?: number;
    rating?: number;
    reviews?: number;
    featured?: boolean;
    createdAt?: Date;
    favoritedAt?: unknown;
};

const normalizeKey = (value: unknown): string => String(value ?? '').trim().toLowerCase();

const userFavoritesCollection = (uid: string) => collection(db, 'users', uid, 'favorites');

const userFavoriteDoc = (uid: string, productId: string) =>
    doc(db, 'users', uid, 'favorites', normalizeKey(productId));

const toProduct = (favorite: FavoritePayload, fallbackId?: string): Product | null => {
    const safeId = normalizeKey(favorite.productId ?? favorite.id ?? fallbackId);
    if (!safeId) return null;

    return {
        id: safeId,
        name: favorite.name ?? 'Produto',
        description: favorite.description ?? '',
        price: Number(favorite.price || 0),
        originalPrice: favorite.originalPrice,
        category: favorite.category ?? '',
        image: favorite.image ?? '',
        images: favorite.images,
        stock: Number(favorite.stock || 0),
        rating: favorite.rating,
        reviews: favorite.reviews,
        featured: favorite.featured,
        createdAt: favorite.createdAt ?? new Date(),
    };
};

export const getUserFavorites = async (uid: string): Promise<Product[]> => {
    const snapshot = await getDocs(userFavoritesCollection(uid));
    return snapshot.docs
        .map((docItem) => {
            const data = docItem.data() as FavoritePayload;
            const normalized = toProduct(data, docItem.id);
            return normalized;
        })
        .filter((item): item is Product => item !== null)
        .filter((item) => Boolean(String(item.id ?? '').trim()) && Boolean(String(item.name ?? '').trim()));
};

export const addFavorite = async (uid: string, product: Product): Promise<void> => {
    const safeId = normalizeKey(product.id);
    if (!safeId) return;

    const payload: Record<string, unknown> = {
        productId: safeId,
        id: safeId,
        name: product.name ?? 'Produto',
        description: product.description ?? '',
        price: Number(product.price ?? 0),
        category: product.category ?? '',
        image: product.image ?? '',
        images: Array.isArray(product.images) ? product.images : [],
        stock: Number(product.stock ?? 0),
        favoritedAt: serverTimestamp(),
    };

    if (typeof product.originalPrice === 'number') payload.originalPrice = product.originalPrice;
    if (typeof product.rating === 'number') payload.rating = product.rating;
    if (typeof product.reviews === 'number') payload.reviews = product.reviews;
    if (typeof product.featured === 'boolean') payload.featured = product.featured;
    if (product.createdAt) payload.createdAt = product.createdAt;

    await setDoc(userFavoriteDoc(uid, safeId), payload, { merge: true });
};

export const removeFavorite = async (uid: string, productId: string): Promise<void> => {
    const safeId = normalizeKey(productId);
    if (!safeId) return;
    await deleteDoc(userFavoriteDoc(uid, safeId));
};

export const isFavorite = async (uid: string, productId: string): Promise<boolean> => {
    const safeId = normalizeKey(productId);
    if (!safeId) return false;

    const byNormalizedId = await getDoc(userFavoriteDoc(uid, safeId));
    if (byNormalizedId.exists()) return true;

    const byRawId = await getDoc(doc(db, 'users', uid, 'favorites', String(productId ?? '').trim()));
    return byRawId.exists();
};

export const getLocalFavorites = (): Product[] => {
    try {
        const raw = localStorage.getItem(FAVORITES_LOCAL_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw) as Array<Product | FavoritePayload>;
        if (!Array.isArray(parsed)) return [];

        return parsed
            .map((item) => toProduct(item as FavoritePayload))
            .filter((item): item is Product => item !== null);
    } catch {
        return [];
    }
};

export const setLocalFavorites = (favorites: Product[]) => {
    const sanitized = favorites.filter((item) => Boolean(String(item.id ?? '').trim()));
    localStorage.setItem(FAVORITES_LOCAL_KEY, JSON.stringify(sanitized));
};

export const toggleLocalFavorite = (product: Product): { next: Product[]; active: boolean } => {
    const current = getLocalFavorites();
    const targetId = normalizeKey(product.id);
    const exists = current.some((item) => normalizeKey(item.id) === targetId);

    if (exists) {
        const next = current.filter((item) => normalizeKey(item.id) !== targetId);
        setLocalFavorites(next);
        return { next, active: false };
    }

    const next = [...current, product];
    setLocalFavorites(next);
    return { next, active: true };
};
