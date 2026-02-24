import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCart } from '../hooks/useCart';
import { createMockProduct } from './fixtures';

describe('useCart', () => {
  const product1 = createMockProduct({ id: 1, title: 'Product A', price: 10 });
  const product2 = createMockProduct({ id: 2, title: 'Product B', price: 25 });

  beforeEach(() => {
    localStorage.clear();
  });

  it('initialises with an empty cart', () => {
    const { result } = renderHook(() => useCart());
    expect(result.current.items).toEqual([]);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalPrice).toBe(0);
  });

  it('adds a new item to the cart', () => {
    const { result } = renderHook(() => useCart());
    act(() => result.current.addItem(product1));
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].product.id).toBe(1);
    expect(result.current.items[0].quantity).toBe(1);
    expect(result.current.totalItems).toBe(1);
    expect(result.current.totalPrice).toBe(10);
  });

  it('increments quantity when adding the same item again', () => {
    const { result } = renderHook(() => useCart());
    act(() => result.current.addItem(product1));
    act(() => result.current.addItem(product1));
    act(() => result.current.addItem(product1));
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(3);
    expect(result.current.totalItems).toBe(3);
    expect(result.current.totalPrice).toBe(30);
  });

  it('handles multiple different items', () => {
    const { result } = renderHook(() => useCart());
    act(() => result.current.addItem(product1));
    act(() => result.current.addItem(product2));
    expect(result.current.items).toHaveLength(2);
    expect(result.current.totalItems).toBe(2);
    expect(result.current.totalPrice).toBe(35);
  });

  it('removes an item from the cart', () => {
    const { result } = renderHook(() => useCart());
    act(() => result.current.addItem(product1));
    act(() => result.current.addItem(product2));
    act(() => result.current.removeItem(1));
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].product.id).toBe(2);
  });

  it('updates quantity of an item', () => {
    const { result } = renderHook(() => useCart());
    act(() => result.current.addItem(product1));
    act(() => result.current.updateQuantity(1, 5));
    expect(result.current.items[0].quantity).toBe(5);
    expect(result.current.totalPrice).toBe(50);
  });

  it('removes item when quantity updated to zero', () => {
    const { result } = renderHook(() => useCart());
    act(() => result.current.addItem(product1));
    act(() => result.current.updateQuantity(1, 0));
    expect(result.current.items).toHaveLength(0);
  });

  it('removes item when quantity updated to negative', () => {
    const { result } = renderHook(() => useCart());
    act(() => result.current.addItem(product1));
    act(() => result.current.updateQuantity(1, -1));
    expect(result.current.items).toHaveLength(0);
  });

  it('clears the entire cart', () => {
    const { result } = renderHook(() => useCart());
    act(() => result.current.addItem(product1));
    act(() => result.current.addItem(product2));
    act(() => result.current.clearCart());
    expect(result.current.items).toHaveLength(0);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalPrice).toBe(0);
  });

  it('returns correct quantity for a specific product', () => {
    const { result } = renderHook(() => useCart());
    act(() => result.current.addItem(product1));
    act(() => result.current.addItem(product1));
    expect(result.current.getItemQuantity(1)).toBe(2);
    expect(result.current.getItemQuantity(999)).toBe(0);
  });

  it('calculates correct totals with mixed quantities', () => {
    const { result } = renderHook(() => useCart());
    act(() => {
      result.current.addItem(product1);
      result.current.addItem(product1);
      result.current.addItem(product2);
    });
    expect(result.current.totalPrice).toBe(45);
    expect(result.current.totalItems).toBe(3);
  });

});