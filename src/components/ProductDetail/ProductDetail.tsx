import { useParams, useNavigate } from 'react-router-dom';
import { Product, TOP_RATED_THRESHOLD } from '../../types';
import { formatPrice } from '../../utils/format';
import TopRatedBadge from '../TopRatedBadge';
import './ProductDetail.css';

interface ProductDetailProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  getItemQuantity: (productId: number) => number;
  isInWishlist: (productId: number) => boolean;
  onToggleWishlist: (product: Product) => void;
}

export default function ProductDetail({ products, onAddToCart, getItemQuantity, isInWishlist, onToggleWishlist }: ProductDetailProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className="pdp__not-found" role="alert" data-testid="product-not-found">
        <h2>Product not found</h2>
        <p>The product you're looking for doesn't exist or has been removed.</p>
        <button className="pdp__back-btn" onClick={() => navigate('/')}>
          ← Back to Products
        </button>
      </div>
    );
  }

  const isTopRated = product.rating.rate >= TOP_RATED_THRESHOLD;
  const cartQuantity = getItemQuantity(product.id);
  const wishlisted = isInWishlist(product.id);

  return (
    <div className="pdp" data-testid={`pdp-${product.id}`}>
      <button
        className="pdp__back-link"
        onClick={() => navigate('/')}
        data-testid="back-to-products"
      >
        ← Back to Products
      </button>

      <div className="pdp__layout">
        <div className="pdp__image-section">
          {isTopRated && (
            <div className="pdp__top-rated">
              <TopRatedBadge />
            </div>
          )}
          <img
            className="pdp__image"
            src={product.image}
            alt={product.title}
            data-testid="pdp-image"
          />
        </div>

        <div className="pdp__info">
          <span className="pdp__category">{product.category}</span>
          <h1 className="pdp__title" data-testid="pdp-title">{product.title}</h1>

          <div className="pdp__rating" aria-label={`Rated ${product.rating.rate} out of 5 from ${product.rating.count} reviews`}>
            <div className="pdp__stars" aria-hidden="true">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className={`pdp__star ${star <= Math.round(product.rating.rate) ? 'pdp__star--filled' : ''}`}>★</span>
              ))}
            </div>
            <span className="pdp__review-count">{product.rating.rate} ({product.rating.count} reviews)</span>
          </div>

          <p className="pdp__price" data-testid="pdp-price">{formatPrice(product.price)}</p>

          <p className="pdp__description" data-testid="pdp-description">{product.description}</p>

          <div className="pdp__actions">
            <button
              className="pdp__add-btn"
              onClick={() => onAddToCart(product)}
              aria-label={`Add ${product.title} to cart`}
              data-testid="pdp-add-to-cart"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              Add to Cart
            </button>
            <button
              className={`pdp__wishlist-btn ${wishlisted ? 'pdp__wishlist-btn--active' : ''}`}
              onClick={() => onToggleWishlist(product)}
              aria-label={wishlisted ? `Remove ${product.title} from wishlist` : `Add ${product.title} to wishlist`}
              aria-pressed={wishlisted}
              data-testid="pdp-wishlist-toggle"
            >
              <svg viewBox="0 0 24 24" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {wishlisted ? 'Saved' : 'Save'}
            </button>
            {cartQuantity > 0 && (
              <span className="pdp__cart-info" data-testid="pdp-cart-info">
                {cartQuantity} already in cart
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}