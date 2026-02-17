import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { createMockProduct } from './fixtures';

const product = createMockProduct({
  id: 1, title: 'Test Backpack', price: 109.95,
  category: "men's clothing", rating: { rate: 4, count: 120 },
});

const defaultProps = {
  product, onAddToCart: vi.fn(), onUpdateQuantity: vi.fn(), onRemoveItem: vi.fn(),
  cartQuantity: 0, isWishlisted: false, onToggleWishlist: vi.fn(),
};

const renderCard = (props = {}) =>
  render(<MemoryRouter><ProductCard {...defaultProps} {...props} /></MemoryRouter>);

describe('ProductCard', () => {
  it('renders product title and price', () => {
    renderCard();
    expect(screen.getByText('Test Backpack')).toBeInTheDocument();
    expect(screen.getByTestId('product-price-1')).toHaveTextContent('£109.95');
  });

  it('shows Add to Cart when not in cart', () => {
    renderCard();
    expect(screen.getByTestId('add-to-cart-1')).toBeInTheDocument();
  });

  it('shows qty controls when in cart', () => {
    renderCard({ cartQuantity: 2 });
    expect(screen.getByTestId('qty-controls-1')).toBeInTheDocument();
    expect(screen.getByTestId('card-qty-1')).toHaveTextContent('2');
  });

  it('renders wishlist toggle button', () => {
    renderCard();
    expect(screen.getByTestId('wishlist-toggle-1')).toBeInTheDocument();
  });

  it('shows unfilled heart when not wishlisted', () => {
    renderCard({ isWishlisted: false });
    expect(screen.getByTestId('wishlist-toggle-1')).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByTestId('wishlist-toggle-1')).toHaveAttribute('aria-label', 'Add Test Backpack to wishlist');
  });

  it('shows filled heart when wishlisted', () => {
    renderCard({ isWishlisted: true });
    expect(screen.getByTestId('wishlist-toggle-1')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByTestId('wishlist-toggle-1')).toHaveAttribute('aria-label', 'Remove Test Backpack from wishlist');
    expect(screen.getByTestId('wishlist-toggle-1')).toHaveClass('product-card__wishlist-btn--active');
  });

  it('calls onToggleWishlist when heart clicked', async () => {
    const onToggleWishlist = vi.fn();
    renderCard({ onToggleWishlist });
    await userEvent.click(screen.getByTestId('wishlist-toggle-1'));
    expect(onToggleWishlist).toHaveBeenCalledWith(product);
  });

  it('heart click does not navigate (prevents link default)', async () => {
    renderCard();
    await userEvent.click(screen.getByTestId('wishlist-toggle-1'));
    expect(screen.getByTestId('product-card-1')).toBeInTheDocument();
  });

  it('shows image with lazy loading', () => {
    renderCard();
    const img = screen.getByAltText('Test Backpack');
    expect(img).toHaveAttribute('loading', 'lazy');
    fireEvent.load(img);
    expect(img).toHaveClass('product-card__image--loaded');
  });

  it('renders as article with link to PDP', () => {
    renderCard();
    expect(screen.getByTestId('product-card-1').tagName).toBe('ARTICLE');
    expect(screen.getByTestId('product-link-1')).toHaveAttribute('href', '/product/1');
  });
});