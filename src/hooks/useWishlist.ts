import { useCallback, useEffect, useState } from "react";
import { Product } from "../types";
import { getStorageItem, setStorageItem } from "../utils/storage";

const WISHLIST_STORAGE_KEY = 'wishlist';

export default function useWishlist() {
  const [wishlistItems, setWishlistItems] = useState<Product[]>(() => getStorageItem(WISHLIST_STORAGE_KEY) || []);

  useEffect(() => {
    setStorageItem(WISHLIST_STORAGE_KEY, wishlistItems);
  }, [wishlistItems]);

  const toggleWishlistItem = useCallback((product: Product) => {
    setWishlistItems((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      return [...prev, product];
    });
  }, []);

  const removeWishlistItem = useCallback((productId: number) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const clearWishlist = useCallback(() => {
    setWishlistItems([]);
  }, []);

  const isInWishlist = useCallback((productId: number) => {
    return wishlistItems.some((item) => item.id === productId);
  }, [wishlistItems]);

  return {
    wishlistItems,
    totalItems: wishlistItems.length,
    toggleWishlistItem,
    removeWishlistItem,
    clearWishlist,
    isInWishlist
  };
}
