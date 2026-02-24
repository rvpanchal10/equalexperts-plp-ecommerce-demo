import './Header.css';

interface HeaderProps {
  totalItems: number;
  onCartClick: () => void;
  onWishlistClick: () => void;
  wishlistCount: number;
}

export default function Header({ totalItems, onCartClick, onWishlistClick, wishlistCount }: HeaderProps) {
  return (
    <header className="header" role="banner">
      <div className="header__inner">
        <a href="/" className="header__logo" aria-label="Equal Experts Home">
           <img
              src="/equalexperts-logo.svg"
              alt="Equal Experts"
              className="header__logo-icon"
            />
        </a>

        <nav className="header__nav" aria-label="Main navigation">
          <h1 className="header__title">Product Catalogue</h1>
        </nav>

        <div className="header__actions">
          <button
            className="header__wishlist-btn"
            onClick={onWishlistClick}
            aria-label={`Wishlist with ${wishlistCount} ${wishlistCount === 1 ? 'item' : 'items'}`}
            data-testid="wishlist-button"
          >
            <svg className="header__wishlist-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {wishlistCount > 0 && (
              <span className="header__wishlist-badge" data-testid="wishlist-badge">{wishlistCount}</span>
            )}
          </button>

          <button
            className="header__cart-btn"
            onClick={onCartClick}
            aria-label={`Shopping cart with ${totalItems} ${totalItems === 1 ? 'item' : 'items'}`}
            data-testid="cart-button"
          >
            <svg className="header__cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {totalItems > 0 && (
              <span className="header__cart-badge" data-testid="cart-badge">{totalItems}</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}