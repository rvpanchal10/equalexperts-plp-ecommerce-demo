import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useProductFilters } from '../hooks/useProductFilters';
import { mockProducts } from './fixtures';

describe('useProductFilters', () => {
  it('returns all products by default', () => {
    const { result } = renderHook(() => useProductFilters(mockProducts));
    expect(result.current.filteredProducts).toHaveLength(5);
    expect(result.current.activeCategory).toBe('all');
    expect(result.current.sortOption).toBe('default');
    expect(result.current.searchQuery).toBe('');
  });

  it('extracts sorted unique categories', () => {
    const { result } = renderHook(() => useProductFilters(mockProducts));
    expect(result.current.categories).toEqual([
      'electronics',
      'jewelery',
      "men's clothing",
      "women's clothing",
    ]);
  });

  it('filters by category', () => {
    const { result } = renderHook(() => useProductFilters(mockProducts));
    act(() => result.current.setCategory("men's clothing"));
    expect(result.current.filteredProducts).toHaveLength(2);
    expect(result.current.filteredProducts.every((p) => p.category === "men's clothing")).toBe(true);
  });

  it('filters by search query (title match)', () => {
    const { result } = renderHook(() => useProductFilters(mockProducts));
    act(() => result.current.setSearchQuery('backpack'));
    expect(result.current.filteredProducts).toHaveLength(1);
    expect(result.current.filteredProducts[0].id).toBe(1);
  });

  it('filters by search query (description match)', () => {
    const { result } = renderHook(() => useProductFilters(mockProducts));
    act(() => result.current.setSearchQuery('mythical water dragon'));
    expect(result.current.filteredProducts).toHaveLength(1);
    expect(result.current.filteredProducts[0].id).toBe(5);
  });

  it('search is case-insensitive', () => {
    const { result } = renderHook(() => useProductFilters(mockProducts));
    act(() => result.current.setSearchQuery('BACKPACK'));
    expect(result.current.filteredProducts).toHaveLength(1);
  });

  it('combines category and search filters', () => {
    const { result } = renderHook(() => useProductFilters(mockProducts));
    act(() => {
      result.current.setCategory("men's clothing");
      result.current.setSearchQuery('slim');
    });
    expect(result.current.filteredProducts).toHaveLength(1);
    expect(result.current.filteredProducts[0].id).toBe(2);
  });

  it('sorts by price ascending', () => {
    const { result } = renderHook(() => useProductFilters(mockProducts));
    act(() => result.current.setSortOption('price-asc'));
    const prices = result.current.filteredProducts.map((p) => p.price);
    expect(prices).toEqual([9.85, 22.3, 109, 109.95, 695]);
  });

  it('sorts by price descending', () => {
    const { result } = renderHook(() => useProductFilters(mockProducts));
    act(() => result.current.setSortOption('price-desc'));
    const prices = result.current.filteredProducts.map((p) => p.price);
    expect(prices).toEqual([695, 109.95, 109, 22.3, 9.85]);
  });

  it('sorts by rating descending', () => {
    const { result } = renderHook(() => useProductFilters(mockProducts));
    act(() => result.current.setSortOption('rating-desc'));
    const ratings = result.current.filteredProducts.map((p) => p.rating.rate);
    expect(ratings).toEqual([4.8, 4.7, 4.6, 4.1, 3.9]);
  });

  it('sorts by name ascending', () => {
    const { result } = renderHook(() => useProductFilters(mockProducts));
    act(() => result.current.setSortOption('name-asc'));
    expect(result.current.filteredProducts[0].title).toMatch(/^Fjallraven/);
  });

  it('paginates results (shows first page)', () => {
    const { result } = renderHook(() => useProductFilters(mockProducts));
    // PRODUCTS_PER_PAGE = 8, we have 5 products, so all visible
    expect(result.current.visibleProducts).toHaveLength(5);
    expect(result.current.hasMore).toBe(false);
  });

  it('loadMore increases visible count', () => {
    // Create many products to test pagination
    const manyProducts = Array.from({ length: 20 }, (_, i) =>
      ({ ...mockProducts[0], id: i + 100, title: `Product ${i}` })
    );
    const { result } = renderHook(() => useProductFilters(manyProducts));
    expect(result.current.visibleProducts).toHaveLength(8);
    expect(result.current.hasMore).toBe(true);

    act(() => result.current.loadMore());
    expect(result.current.visibleProducts).toHaveLength(16);
    expect(result.current.hasMore).toBe(true);

    act(() => result.current.loadMore());
    expect(result.current.visibleProducts).toHaveLength(20);
    expect(result.current.hasMore).toBe(false);
  });

  it('resets pagination when category changes', () => {
    const manyProducts = Array.from({ length: 20 }, (_, i) =>
      ({ ...mockProducts[0], id: i + 100, title: `Product ${i}` })
    );
    const { result } = renderHook(() => useProductFilters(manyProducts));
    act(() => result.current.loadMore());
    expect(result.current.visibleProducts).toHaveLength(16);

    act(() => result.current.setCategory("men's clothing"));
    expect(result.current.visibleProducts.length).toBeLessThanOrEqual(8);
  });

  it('resetFilters clears all filters', () => {
    const { result } = renderHook(() => useProductFilters(mockProducts));
    act(() => {
      result.current.setCategory('electronics');
      result.current.setSortOption('price-asc');
      result.current.setSearchQuery('test');
    });

    act(() => result.current.resetFilters());

    expect(result.current.activeCategory).toBe('all');
    expect(result.current.sortOption).toBe('default');
    expect(result.current.searchQuery).toBe('');
  });

  it('returns empty for no-match search', () => {
    const { result } = renderHook(() => useProductFilters(mockProducts));
    act(() => result.current.setSearchQuery('xyznonexistent'));
    expect(result.current.filteredProducts).toHaveLength(0);
    expect(result.current.totalCount).toBe(0);
  });
});