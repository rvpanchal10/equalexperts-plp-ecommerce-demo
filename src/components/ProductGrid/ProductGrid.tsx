import { Product } from '../../types';
import ProductCard from '../ProductCard';
import './ProductGrid.css';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  getItemQuantity: (productId: number) => number;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  totalCount: number;
  visibleCount: number;
  hasMore: boolean;
  sentinelRef: (node: HTMLDivElement | null) => void;
  onResetFilters: () => void;
  isInWishlist: (productId: number) => boolean;
  onToggleWishlist: (product: Product) => void;
}

export default function ProductGrid({
  products,
  onAddToCart,
  getItemQuantity,
  totalCount,
  visibleCount,
  hasMore,
  sentinelRef,
  onResetFilters,
  onUpdateQuantity,
  onRemoveItem,
  isInWishlist,
  onToggleWishlist
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="product-grid__empty" role="status" data-testid="no-results">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <p>No products match your filters</p>
        <button className="product-grid__reset-btn" onClick={onResetFilters}>
          Clear all filters
        </button>
      </div>
    );
  }

  return (
    <section className="product-grid" aria-label="Products">
      <div className="product-grid__count" data-testid="results-count" aria-live="polite">
        Showing {visibleCount} of {totalCount} {totalCount === 1 ? 'product' : 'products'}
      </div>
      <div className="product-grid__container">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            cartQuantity={getItemQuantity(product.id)}
            onUpdateQuantity={onUpdateQuantity}
            onRemoveItem={onRemoveItem}
            isWishlisted={isInWishlist(product.id)}
            onToggleWishlist={onToggleWishlist}
          />
        ))}
      </div>
      {hasMore && (
        <div
          ref={sentinelRef}
          className="product-grid__sentinel"
          data-testid="scroll-sentinel"
          aria-hidden="true"
        >
          <div className="product-grid__loading-more">
            <span className="product-grid__spinner" />
            Loading more products…
          </div>
        </div>
      )}
    </section>
  );
}