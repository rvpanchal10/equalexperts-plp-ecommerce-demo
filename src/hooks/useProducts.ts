import { useState, useEffect, useCallback } from 'react';
import { Product } from '../types';
import { fetchProducts } from '../services/productService';

interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: string | null;
  retry: () => void;
}

export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, []);

  return { products, loading, error, retry: loadProducts };
}