import './Header.css';

interface HeaderProps {
  totalItems: number;
  onCartClick: () => void;
}

export default function Header({ totalItems, onCartClick }: HeaderProps) {
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
    </header>
  );
}