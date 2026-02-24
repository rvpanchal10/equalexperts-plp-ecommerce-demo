import { useEffect, useRef } from 'react';
import { Product } from '../../types';
import WishlistItem from '../WishlistItem';
import './WishlistDrawer.css';

interface WishlistDrawerProps {
  items: Product[];
  totalItems: number;
  isOpen: boolean;
  onClose: () => void;
  onRemoveItem: (productId: number) => void;
  onAddToCart: (product: Product) => void;
  onClearWishlist: () => void;
}

export default function WishlistDrawer({
  items, totalItems, isOpen, onClose, onRemoveItem, onAddToCart, onClearWishlist,
}: WishlistDrawerProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <>
      <div
        className={`wishlist-overlay ${isOpen ? 'wishlist-overlay--visible' : ''}`}
        onClick={onClose}
        aria-hidden="true"
        data-testid="wishlist-overlay"
      />
      <aside
        className={`wishlist-drawer ${isOpen ? 'wishlist-drawer--open' : ''}`}
        role="dialog"
        aria-label="Wishlist"
        aria-modal="true"
        data-testid="wishlist-drawer"
      >
        <div className="wishlist-drawer__header">
          <h2 className="wishlist-drawer__title">
            Wishlist
            {totalItems > 0 && (
              <span className="wishlist-drawer__count">
                ({totalItems} {totalItems === 1 ? 'item' : 'items'})
              </span>
            )}
          </h2>
          <button
            ref={closeButtonRef}
            className="wishlist-drawer__close"
            onClick={onClose}
            aria-label="Close wishlist"
            data-testid="close-wishlist"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="wishlist-drawer__body">
          {items.length === 0 ? (
            <div className="wishlist-drawer__empty" data-testid="wishlist-empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <p>Your wishlist is empty</p>
              <span>Save items you love for later</span>
            </div>
          ) : (
            <div className="wishlist-drawer__items">
              {items.map((product) => (
                <WishlistItem
                  key={product.id}
                  product={product}
                  onRemove={onRemoveItem}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="wishlist-drawer__footer">
            <button
              className="wishlist-drawer__clear"
              onClick={onClearWishlist}
              data-testid="clear-wishlist"
            >
              Clear Wishlist
            </button>
          </div>
        )}
      </aside>
    </>
  );
}