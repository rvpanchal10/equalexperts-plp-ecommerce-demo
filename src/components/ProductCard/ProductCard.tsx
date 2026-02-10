import { useState } from 'react';
import { Product, TOP_RATED_THRESHOLD } from '../../types';
import { formatPrice, truncateText } from '../../utils/format';
import TopRatedBadge from '../TopRatedBadge';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  cartQuantity: number;
}

export default function ProductCard({ product, onAddToCart, cartQuantity }: ProductCardProps) {
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
      </div>

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
      </div>
    </article>
  );
}