import { Product } from '../../types';
import { formatPrice } from '../../utils/format';
import './WishlistItem.css';

interface WishlistItemProps {
  product: Product;
  onRemove: (productId: number) => void;
  onAddToCart: (product: Product) => void;
}

export default function WishlistItem({ product, onRemove, onAddToCart }: WishlistItemProps) {
  const handleMoveToCart = () => {
    onAddToCart(product);
    onRemove(product.id);
  };

  return (
    <div className="wishlist-item" data-testid={`wishlist-item-${product.id}`}>
      <img className="wishlist-item__image" src={product.image} alt={product.title} loading="lazy" />
      <div className="wishlist-item__details">
        <h3 className="wishlist-item__title">{product.title}</h3>
        <span className="wishlist-item__price">{formatPrice(product.price)}</span>
        <div className="wishlist-item__stars" aria-hidden="true">
          {[1, 2, 3, 4, 5].map((star) => (
            <span key={star} className={`wishlist-item__star ${star <= Math.round(product.rating.rate) ? 'wishlist-item__star--filled' : ''}`}>★</span>
          ))}
        </div>
      </div>
      <div className="wishlist-item__actions">
        <button
          className="wishlist-item__cart-btn"
          onClick={handleMoveToCart}
          aria-label={`Move ${product.title} to cart`}
          data-testid={`move-to-cart-${product.id}`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
        </button>
        <button
          className="wishlist-item__remove-btn"
          onClick={() => onRemove(product.id)}
          aria-label={`Remove ${product.title} from wishlist`}
          data-testid={`remove-wishlist-${product.id}`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}