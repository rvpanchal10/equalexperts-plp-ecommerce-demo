import { useEffect, useRef } from 'react';
import { CartItem as CartItemType } from '../../types';
import { formatPrice } from '../../utils/format';
import CartItemComponent from '../CartItem';
import './Cart.css';

interface CartProps {
  items: CartItemType[];
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
  onClose: () => void;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onClearCart: () => void;
}

export default function Cart({ items, totalItems, totalPrice, isOpen, onClose, onUpdateQuantity, onRemoveItem, onClearCart }: CartProps) {
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
        className={`cart-overlay ${isOpen ? 'cart-overlay--visible' : ''}`}
        onClick={onClose}
        aria-hidden="true"
        data-testid="cart-overlay"
      />
      <aside
        className={`cart-drawer ${isOpen ? 'cart-drawer--open' : ''}`}
        role="dialog"
        aria-label="Shopping cart"
        aria-modal="true"
        data-testid="cart-drawer"
      >
        <div className="cart-drawer__header">
          <h2 className="cart-drawer__title">
            Your Cart
            {totalItems > 0 && <span className="cart-drawer__count">({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>}
          </h2>
          <button ref={closeButtonRef} className="cart-drawer__close" onClick={onClose} aria-label="Close cart" data-testid="close-cart">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="cart-drawer__body">
          {items.length === 0 ? (
            <div className="cart-drawer__empty" data-testid="cart-empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <p>Your cart is empty</p>
              <span>Add items to get started</span>
            </div>
          ) : (
            <div className="cart-drawer__items">
              {items.map((item) => (
                <CartItemComponent key={item.product.id} item={item} onUpdateQuantity={onUpdateQuantity} onRemove={onRemoveItem} />
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-drawer__footer">
            <div className="cart-drawer__total">
              <span className="cart-drawer__total-label">Total</span>
              <span className="cart-drawer__total-price" data-testid="cart-total">{formatPrice(totalPrice)}</span>
            </div>
            <button className="cart-drawer__checkout" data-testid="checkout-btn">Checkout</button>
            <button className="cart-drawer__clear" onClick={onClearCart} data-testid="clear-cart">Clear Cart</button>
          </div>
        )}
      </aside>
    </>
  );
}