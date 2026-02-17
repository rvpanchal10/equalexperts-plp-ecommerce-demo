import React from 'react';
import { Route, Routes } from 'react-router-dom';
import SearchBar from './components/SearchBar';
import SortDropdown from './components/SortDropdown';
import FilterBar from './components/FilterBar';
import ProductGrid from './components/ProductGrid';
import { Product, SortOption } from './types';
import ProductDetail from './components/ProductDetail';

interface AppRoutesProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  categories: string[];
  activeCategory: string;
  setCategory: (category: string) => void;
  visibleProducts: Product[];
  totalCount: number;
  visibleCount: number;
  hasMore: boolean;
  sentinelRef: (node: HTMLDivElement | null) => void;
  resetFilters: () => void;
  onAddToCart: (product: Product) => void;
  getItemQuantity: (productId: number) => number;
  products: Product[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  onToggleWishlist: (product: Product) => void;
}

export default function AppRoutes(props: AppRoutesProps) {
  const {
    searchQuery,
    setSearchQuery,
    sortOption,
    setSortOption,
    categories,
    activeCategory,
    setCategory,
    visibleProducts,
    totalCount,
    visibleCount,
    hasMore,
    sentinelRef,
    resetFilters,
    onAddToCart,
    getItemQuantity,
    products,
    onRemoveItem,
    onUpdateQuantity,
    isInWishlist,
    onToggleWishlist
  } = props;
  return (
    <Routes>
      <Route path="/" element={
        <>
          <div className="app__toolbar" data-testid="toolbar">
            <div className="app__toolbar-top">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
              <SortDropdown value={sortOption} onChange={setSortOption} />
            </div>
            <FilterBar
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setCategory}
            />
          </div>

          <ProductGrid
            products={visibleProducts}
            onAddToCart={onAddToCart}
            getItemQuantity={getItemQuantity}
            totalCount={totalCount}
            visibleCount={visibleCount}
            hasMore={hasMore}
            sentinelRef={sentinelRef}
            onResetFilters={resetFilters}
            onRemoveItem={onRemoveItem}
            onUpdateQuantity={onUpdateQuantity}
            isInWishlist={isInWishlist}
            onToggleWishlist={onToggleWishlist}
          />
        </>
      } />
      <Route
        path="/product/:id"
        element={
          <ProductDetail
            products={products}
            onAddToCart={onAddToCart}
            getItemQuantity={getItemQuantity}
            isInWishlist={isInWishlist}
            onToggleWishlist={onToggleWishlist}
          />
        }
      />
    </Routes>
  );
}