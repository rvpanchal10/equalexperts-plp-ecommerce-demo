import { useState } from 'react';
import { Product, TOP_RATED_THRESHOLD } from '../../types';
import { formatPrice, truncateText } from '../../utils/format';
import TopRatedBadge from '../TopRatedBadge';
import './ProductCard.css';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  cartQuantity: number;
  onUpdateQuantity: (productId: number, newQuantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
}

export default function ProductCard({ product, onAddToCart, cartQuantity, onUpdateQuantity, onRemoveItem, onToggleWishlist, isWishlisted }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const isTopRated = product.rating.rate >= TOP_RATED_THRESHOLD;

  const handleAddToCart = () => {
    setIsAdding(true);
    onAddToCart(product);
    setTimeout(() => setIsAdding(false), 400);
  };

  return (
    <article className="product-card" data-testid={`product-card-${product.id}`}>
      <Link to={`/product/${product.id}`} className="product-card__link" data-testid={`product-link-${product.id}`}>
        <div className="product-card__image-container">
          {isTopRated && <TopRatedBadge />}
          {!imageLoaded && !imageError && (
            <div className="product-card__image-placeholder" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
          )}
          {imageError ? (
            <div className="product-card__image-error" role="img" aria-label={product.title}>
              <span>Image unavailable</span>
            </div>
          ) : (
            <img
              className={`product-card__image ${imageLoaded ? 'product-card__image--loaded' : ''}`}
              src={product.image}
              alt={product.title}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          )}
          {cartQuantity > 0 && (
            <span className="product-card__in-cart-badge" data-testid={`in-cart-badge-${product.id}`}>
              {cartQuantity} in cart
            </span>
          )}
          <button
            className={`product-card__wishlist-btn ${isWishlisted ? 'product-card__wishlist-btn--active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              onToggleWishlist(product);
            }}
            aria-label={isWishlisted ? `Remove ${product.title} from wishlist` : `Add ${product.title} to wishlist`}
            aria-pressed={isWishlisted}
            data-testid={`wishlist-toggle-${product.id}`}
          >
            <svg viewBox="0 0 24 24" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>
      </Link>

      <div className="product-card__body">
        <span className="product-card__category">{product.category}</span>
        <h2 className="product-card__title" title={product.title}>{truncateText(product.title, 60)}</h2>
        <p className="product-card__description">{truncateText(product.description, 100)}</p>
        <div className="product-card__rating" aria-label={`Rated ${product.rating.rate} out of 5 from ${product.rating.count} reviews`}>
          <div className="product-card__stars" aria-hidden="true">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className={`product-card__star ${star <= Math.round(product.rating.rate) ? 'product-card__star--filled' : ''}`}>★</span>
            ))}
          </div>
          <span className="product-card__review-count">({product.rating.count})</span>
        </div>
      </div>

      <div className="product-card__footer">
        <span className="product-card__price" data-testid={`product-price-${product.id}`}>{formatPrice(product.price)}</span>
        {cartQuantity === 0 ? (
          <button
            className={`product-card__add-btn ${isAdding ? 'product-card__add-btn--adding' : ''}`}
            onClick={handleAddToCart}
            aria-label={`Add ${product.title} to cart`}
            data-testid={`add-to-cart-${product.id}`}
          >
            <svg className="product-card__add-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add to Cart
          </button>
        ) : (
          <div className="product-card__qty-controls" data-testid={`qty-controls-${product.id}`}>
            <button
              className="product-card__qty-btn"
              onClick={() => {
                if (cartQuantity === 1) {
                  onRemoveItem(product.id);
                } else {
                  onUpdateQuantity(product.id, cartQuantity - 1);
                }
              }}
              aria-label={cartQuantity === 1 ? `Remove ${product.title} from cart` : `Decrease quantity of ${product.title}`}
              data-testid={`card-decrease-${product.id}`}
            >
              {cartQuantity === 1 ? (
                <svg className="product-card__qty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              ) : '−'}
            </button>
            <span className="product-card__qty-value" data-testid={`card-qty-${product.id}`} aria-label={`Quantity: ${cartQuantity}`}>
              {cartQuantity}
            </span>
            <button
              className="product-card__qty-btn"
              onClick={() => onUpdateQuantity(product.id, cartQuantity + 1)}
              aria-label={`Increase quantity of ${product.title}`}
              data-testid={`card-increase-${product.id}`}
            >
              +
            </button>
          </div>
        )}
      </div>
    </article>
  );
}