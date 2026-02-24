import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { createMockProduct } from './fixtures';
import useWishlist from '../hooks/useWishlist';

describe('useWishlist', () => {
  const product1 = createMockProduct({ id: 1, title: 'Product A' });
  const product2 = createMockProduct({ id: 2, title: 'Product B' });

  beforeEach(() => {
    localStorage.clear();
  });

  it('initialises with empty wishlist', () => {
    const { result } = renderHook(() => useWishlist());
    expect(result.current.wishlistItems).toEqual([]);
    expect(result.current.totalItems).toBe(0);
  });

  it('adds item to wishlist via toggle', () => {
    const { result } = renderHook(() => useWishlist());
    act(() => result.current.toggleWishlistItem(product1));
    expect(result.current.wishlistItems).toHaveLength(1);
    expect(result.current.wishlistItems[0].id).toBe(1);
    expect(result.current.totalItems).toBe(1);
  });

  it('removes item from wishlist via toggle (untoggle)', () => {
    const { result } = renderHook(() => useWishlist());
    act(() => result.current.toggleWishlistItem(product1));
    act(() => result.current.toggleWishlistItem(product1));
    expect(result.current.wishlistItems).toHaveLength(0);
    expect(result.current.totalItems).toBe(0);
  });

  it('handles multiple items', () => {
    const { result } = renderHook(() => useWishlist());
    act(() => result.current.toggleWishlistItem(product1));
    act(() => result.current.toggleWishlistItem(product2));
    expect(result.current.wishlistItems).toHaveLength(2);
    expect(result.current.totalItems).toBe(2);
  });

  it('checks if product is in wishlist', () => {
    const { result } = renderHook(() => useWishlist());
    act(() => result.current.toggleWishlistItem(product1));
    expect(result.current.isInWishlist(1)).toBe(true);
    expect(result.current.isInWishlist(999)).toBe(false);
  });

  it('removes specific item', () => {
    const { result } = renderHook(() => useWishlist());
    act(() => result.current.toggleWishlistItem(product1));
    act(() => result.current.toggleWishlistItem(product2));
    act(() => result.current.removeWishlistItem(1));
    expect(result.current.wishlistItems).toHaveLength(1);
    expect(result.current.wishlistItems[0].id).toBe(2);
  });

  it('clears entire wishlist', () => {
    const { result } = renderHook(() => useWishlist());
    act(() => result.current.toggleWishlistItem(product1));
    act(() => result.current.toggleWishlistItem(product2));
    act(() => result.current.clearWishlist());
    expect(result.current.wishlistItems).toEqual([]);
  });

  // ── localStorage persistence ──

  it('persists to localStorage', () => {
    const { result } = renderHook(() => useWishlist());
    act(() => result.current.toggleWishlistItem(product1));
    const stored = JSON.parse(localStorage.getItem('ee-plp:wishlist')!);
    expect(stored).toHaveLength(1);
    expect(stored[0].id).toBe(1);
  });

  it('hydrates from localStorage on mount', () => {
    localStorage.setItem('ee-plp:wishlist', JSON.stringify([product1, product2]));
    const { result } = renderHook(() => useWishlist());
    expect(result.current.wishlistItems).toHaveLength(2);
    expect(result.current.isInWishlist(1)).toBe(true);
    expect(result.current.isInWishlist(2)).toBe(true);
  });
  
  it('persists across re-mounts', () => {
    const { result: first, unmount } = renderHook(() => useWishlist());
    act(() => first.current.toggleWishlistItem(product1));
    unmount();

    const { result: second } = renderHook(() => useWishlist());
    expect(second.current.wishlistItems).toHaveLength(1);
    expect(second.current.isInWishlist(1)).toBe(true);
  });
});