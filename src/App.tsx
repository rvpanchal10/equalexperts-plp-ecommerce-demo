import { useState, useCallback } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import FilterBar from './components/FilterBar';
import SortDropdown from './components/SortDropdown';
import ProductGrid from './components/ProductGrid';
import Cart from './components/Cart';
import Loading from './components/Loading';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import { useProducts } from './hooks/useProducts';
import { useCart } from './hooks/useCart';
import { useProductFilters } from './hooks/useProductFilters';
import { useInfiniteScroll } from './hooks/useInfiniteScroll';
import './App.css';

export default function App() {
  const { products, loading, error, retry } = useProducts();
  const { items, totalItems, totalPrice, addItem, removeItem, updateQuantity, clearCart, getItemQuantity } = useCart();
  const [cartOpen, setCartOpen] = useState(false);

  const {
    visibleProducts,
    categories,
    activeCategory,
    sortOption,
    searchQuery,
    hasMore,
    totalCount,
    visibleCount,
    setCategory,
    setSortOption,
    setSearchQuery,
    loadMore,
    resetFilters,
  } = useProductFilters(products);

  const sentinelRef = useInfiniteScroll(loadMore, hasMore);

  const handleCartOpen = useCallback(() => setCartOpen(true), []);
  const handleCartClose = useCallback(() => setCartOpen(false), []);

  return (
    <ErrorBoundary>
      <div className="app">
        <a className="skip-link" href="#main-content">Skip to main content</a>

        <Header totalItems={totalItems} onCartClick={handleCartOpen} />

        <main id="main-content" className="app__main">
          {loading && <Loading />}

          {error && (
            <div className="app__error" role="alert" data-testid="error-message">
              <h2>Unable to load products</h2>
              <p>{error}</p>
              <button className="app__error-retry" onClick={retry}>Retry</button>
            </div>
          )}

          {!loading && !error && (
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
                onAddToCart={addItem}
                getItemQuantity={getItemQuantity}
                totalCount={totalCount}
                visibleCount={visibleCount}
                hasMore={hasMore}
                sentinelRef={sentinelRef}
                onResetFilters={resetFilters}
              />
            </>
          )}
        </main>

        <Cart
          items={items} totalItems={totalItems} totalPrice={totalPrice}
          isOpen={cartOpen} onClose={handleCartClose}
          onUpdateQuantity={updateQuantity} onRemoveItem={removeItem} onClearCart={clearCart}
        />

        <ScrollToTop />

        <footer className="app__footer">
          <p>&copy; {new Date().getFullYear()} Equal Experts — Frontend Assessment</p>
        </footer>
      </div>
    </ErrorBoundary>
  );
}