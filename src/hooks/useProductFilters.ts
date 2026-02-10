import { useState, useMemo, useCallback } from 'react';
import {
  Product,
  SortOption,
  ALL_CATEGORIES,
  PRODUCTS_PER_PAGE,
} from '../types';

interface UseProductFiltersResult {
  filteredProducts: Product[];
  visibleProducts: Product[];
  categories: string[];
  activeCategory: string;
  sortOption: SortOption;
  searchQuery: string;
  hasMore: boolean;
  totalCount: number;
  visibleCount: number;
  setCategory: (category: string) => void;
  setSortOption: (option: SortOption) => void;
  setSearchQuery: (query: string) => void;
  loadMore: () => void;
  resetFilters: () => void;
}

export function useProductFilters(products: Product[]): UseProductFiltersResult {
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORIES);
  const [sortOption, setSortOption] = useState<SortOption>('default');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(PRODUCTS_PER_PAGE);

  const categories = useMemo(() => {
    const cats = [...new Set(products.map((p) => p.category))];
    return cats.sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (activeCategory !== ALL_CATEGORIES) {
      result = result.filter((p) => p.category === activeCategory);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    // Sort
    switch (sortOption) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        result.sort((a, b) => b.rating.rate - a.rating.rate);
        break;
      case 'name-asc':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return result;
  }, [products, activeCategory, searchQuery, sortOption]);

  const visibleProducts = useMemo(
    () => filteredProducts.slice(0, visibleCount),
    [filteredProducts, visibleCount]
  );

  const hasMore = visibleCount < filteredProducts.length;

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => prev + PRODUCTS_PER_PAGE);
  }, []);

  const setCategory = useCallback((category: string) => {
    setActiveCategory(category);
    setVisibleCount(PRODUCTS_PER_PAGE);
  }, []);

  const handleSetSortOption = useCallback((option: SortOption) => {
    setSortOption(option);
    setVisibleCount(PRODUCTS_PER_PAGE);
  }, []);

  const handleSetSearchQuery = useCallback((query: string) => {
    setSearchQuery(query);
    setVisibleCount(PRODUCTS_PER_PAGE);
  }, []);

  const resetFilters = useCallback(() => {
    setActiveCategory(ALL_CATEGORIES);
    setSortOption('default');
    setSearchQuery('');
    setVisibleCount(PRODUCTS_PER_PAGE);
  }, []);

  return {
    filteredProducts,
    visibleProducts,
    categories,
    activeCategory,
    sortOption,
    searchQuery,
    hasMore,
    totalCount: filteredProducts.length,
    visibleCount: visibleProducts.length,
    setCategory,
    setSortOption: handleSetSortOption,
    setSearchQuery: handleSetSearchQuery,
    loadMore,
    resetFilters,
  };
}