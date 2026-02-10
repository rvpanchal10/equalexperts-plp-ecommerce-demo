import { describe, it, expect, vi, afterEach } from 'vitest';
import { fetchProducts } from '../services/productService';
import { mockProducts } from './fixtures';

describe('fetchProducts', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches products from the API and returns data', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockProducts),
    } as Response);

    const products = await fetchProducts();

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://equalexperts.github.io/frontend-take-home-test-data/products.json'
    );
    expect(products).toEqual(mockProducts);
    expect(products).toHaveLength(mockProducts.length);
  });

  it('throws an error when response is not ok', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    } as Response);

    await expect(fetchProducts()).rejects.toThrow('Failed to fetch products: 500 Internal Server Error');
  });

  it('throws when fetch itself fails (network error)', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network error'));

    await expect(fetchProducts()).rejects.toThrow('Network error');
  });
});