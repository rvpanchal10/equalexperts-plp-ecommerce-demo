import { useState, useCallback, useMemo, useEffect } from 'react';
import { CartItem, Product } from '../types';
import { getStorageItem, setStorageItem } from '../utils/storage';

const CART_STORAGE_KEY = 'cart';

interface UseCartResult {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: number) => number;
}

export function useCart(): UseCartResult {
  const [items, setItems] = useState<CartItem[]>(getStorageItem(CART_STORAGE_KEY) || []);

  useEffect(() => {
    setStorageItem(CART_STORAGE_KEY, items);
  }, [items]);

  const addItem = useCallback((product: Product) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return updated;
      }

      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((productId: number) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.product.id !== productId));
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const getItemQuantity = useCallback(
    (productId: number): number => {
      const item = items.find((i) => i.product.id === productId);
      return item?.quantity ?? 0;
    },
    [items]
  );

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items]
  );

  return { items, totalItems, totalPrice, addItem, removeItem, updateQuantity, clearCart, getItemQuantity };
}