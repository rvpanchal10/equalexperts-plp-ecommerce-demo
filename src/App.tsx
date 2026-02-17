import { useState, useCallback } from 'react';
import Header from './components/Header';
import Cart from './components/Cart';
import Loading from './components/Loading';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import { useProducts } from './hooks/useProducts';
import { useCart } from './hooks/useCart';
import { useProductFilters } from './hooks/useProductFilters';
import { useInfiniteScroll } from './hooks/useInfiniteScroll';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import WishlistDrawer from './components/WishlistDrawer';
import useWishlistItem from './hooks/useWishlist';

const AppContent = () => {
  const { products, loading, error, retry } = useProducts();
  const { wishlistItems, toggleWishlistItem, removeWishlistItem, clearWishlist, isInWishlist, totalItems: wishlistTotalItems } = useWishlistItem();
  const { items, totalItems, totalPrice, addItem, removeItem, updateQuantity, clearCart, getItemQuantity } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);

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

  const handleWishlistOpen = useCallback(() => setWishlistOpen(true), []);
  const handleWishlistClose = useCallback(() => setWishlistOpen(false), []);

  return (
    <ErrorBoundary>
      <div className="app">
        <a className="skip-link" href="#main-content">Skip to main content</a>

        <Header totalItems={totalItems} onCartClick={handleCartOpen} onWishlistClick={handleWishlistOpen} wishlistCount={wishlistTotalItems} />

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
            <AppRoutes
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              sortOption={sortOption}
              setSortOption={setSortOption}
              categories={categories}
              activeCategory={activeCategory}
              setCategory={setCategory}
              visibleProducts={visibleProducts}
              totalCount={totalCount}
              visibleCount={visibleCount}
              hasMore={hasMore}
              sentinelRef={sentinelRef}
              resetFilters={resetFilters}
              onAddToCart={addItem}
              getItemQuantity={getItemQuantity}
              products={products}
              onRemoveItem={removeItem}
              onUpdateQuantity={updateQuantity}
              isInWishlist={isInWishlist}
              onToggleWishlist={toggleWishlistItem}
            />
          )}
        </main>

        <Cart
          items={items}
          totalItems={totalItems}
          totalPrice={totalPrice}
          isOpen={cartOpen}
          onClose={handleCartClose}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeItem}
          onClearCart={clearCart}
        />

        <WishlistDrawer
          isOpen={wishlistOpen}
          items={wishlistItems}
          onAddToCart={addItem}
          onClearWishlist={clearWishlist}
          onClose={handleWishlistClose}
          onRemoveItem={removeWishlistItem}
          totalItems={wishlistTotalItems}
        />

        <ScrollToTop />

        <footer className="app__footer">
          <p>&copy; {new Date().getFullYear()} Equal Experts — Frontend Assessment</p>
        </footer>
      </div>
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ErrorBoundary>
  );
}