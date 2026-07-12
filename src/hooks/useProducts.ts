import { useState, useEffect, useMemo } from 'react';
import { getProducts, getProductsByCategory } from '../services/firebase';
import type { Product } from "../types";

interface UseProductsOptions {
    category?: string;
    search?: string;
    sortBy?: 'name' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
}

export function useProducts(options: UseProductsOptions = {}) {
    const { category, search, sortBy } = options;
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);

                let fetchedProducts: Product[];

                if (category) {
                    fetchedProducts = await getProductsByCategory(category);
                } else {
                    fetchedProducts = await getProducts();
                }

                setProducts(fetchedProducts);
            } catch (err) {
                setError('Erro ao carregar produtos');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [category]);

    // Filtrar e ordenar produtos no cliente
    const filteredProducts = useMemo(() => {
        let result = [...products];

        // Filtrar por busca
        if (search) {
            const searchLower = search.toLowerCase();
            result = result.filter(
                (product) =>
                    product.name.toLowerCase().includes(searchLower) ||
                    product.description.toLowerCase().includes(searchLower) ||
                    product.category.toLowerCase().includes(searchLower)
            );
        }

        // Ordenar
        switch (sortBy) {
            case 'name':
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'price-asc':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            case 'newest':
                result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                break;
        }

        return result;
    }, [products, search, sortBy]);

    return {
        products: filteredProducts,
        loading,
        error,
        total: filteredProducts.length
    };
}