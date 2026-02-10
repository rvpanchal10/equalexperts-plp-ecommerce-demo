import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useProducts } from '../hooks/useProducts';
import { mockProducts } from './fixtures';

vi.mock('../services/productService');

import { fetchProducts } from '../services/productService';

const mockedFetch = vi.mocked(fetchProducts);

describe('useProducts', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('starts in a loading state', () => {
    mockedFetch.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useProducts());
    expect(result.current.loading).toBe(true);
    expect(result.current.products).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('loads products successfully', async () => {
    mockedFetch.mockResolvedValue(mockProducts);
    const { result } = renderHook(() => useProducts());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.products).toEqual(mockProducts);
    expect(result.current.error).toBeNull();
  });

  it('handles fetch errors gracefully', async () => {
    mockedFetch.mockRejectedValue(new Error('Network failure'));
    const { result } = renderHook(() => useProducts());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('Network failure');
    expect(result.current.products).toEqual([]);
  });

  it('handles non-Error exceptions', async () => {
    mockedFetch.mockRejectedValue('string error');
    const { result } = renderHook(() => useProducts());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('An unexpected error occurred');
  });

  it('provides a retry function that re-fetches', async () => {
    mockedFetch.mockRejectedValueOnce(new Error('First fail'));
    const { result } = renderHook(() => useProducts());
    await waitFor(() => expect(result.current.error).toBe('First fail'));

    mockedFetch.mockResolvedValueOnce(mockProducts);
    await waitFor(async () => { result.current.retry(); });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.products).toEqual(mockProducts);
      expect(result.current.error).toBeNull();
    });
  });
});