import { useState, useEffect } from 'react';
import { getProductById } from '../services/firebase';
import type { Product } from "../types";

export function useProduct(id: string) {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;

            try {
                setLoading(true);
                setError(null);

                const fetchedProduct = await getProductById(id);

                if (fetchedProduct) {
                    setProduct(fetchedProduct);
                } else {
                    setError('Produto não encontrado');
                }
            } catch (err) {
                setError('Erro ao carregar produto');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    return { product, loading, error };
}