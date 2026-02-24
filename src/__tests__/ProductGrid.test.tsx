import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import { mockProducts } from './fixtures';

const renderGrid = (props = {}) => {
  const defaultProps = {
    products: mockProducts,
    onAddToCart: vi.fn(),
    onUpdateQuantity: vi.fn(),
    onRemoveItem: vi.fn(),
    getItemQuantity: vi.fn().mockReturnValue(0),
    totalCount: 5,
    visibleCount: 5,
    hasMore: false,
    sentinelRef: vi.fn(),
    onResetFilters: vi.fn(),
    isInWishlist: vi.fn().mockReturnValue(false),
    onToggleWishlist: vi.fn(),
    ...props,
  };
  return render(
    <MemoryRouter>
      <ProductGrid {...defaultProps} />
    </MemoryRouter>
  );
};

describe('ProductGrid', () => {
  it('renders all products', () => {
    renderGrid();
    expect(screen.getByTestId('product-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('product-card-2')).toBeInTheDocument();
  });

  it('shows result count', () => {
    renderGrid();
    expect(screen.getByTestId('results-count')).toHaveTextContent('Showing 5 of 5 products');
  });

  it('shows singular product when count is 1', () => {
    renderGrid({ products: [mockProducts[0]], totalCount: 1, visibleCount: 1 });
    expect(screen.getByTestId('results-count')).toHaveTextContent('Showing 1 of 1 product');
  });

  it('shows empty state with reset button when no products', async () => {
    const onResetFilters = vi.fn();
    renderGrid({ products: [], totalCount: 0, visibleCount: 0, onResetFilters });
    expect(screen.getByTestId('no-results')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Clear all filters'));
    expect(onResetFilters).toHaveBeenCalledTimes(1);
  });

  it('shows scroll sentinel when hasMore is true', () => {
    renderGrid({ hasMore: true });
    expect(screen.getByTestId('scroll-sentinel')).toBeInTheDocument();
  });

  it('hides scroll sentinel when hasMore is false', () => {
    renderGrid({ hasMore: false });
    expect(screen.queryByTestId('scroll-sentinel')).not.toBeInTheDocument();
  });

  it('renders as a section with Products label', () => {
    renderGrid();
    expect(screen.getByRole('region', { name: 'Products' })).toBeInTheDocument();
  });

  it('shows qty controls on cards with items in cart', () => {
    const getItemQuantity = vi.fn().mockImplementation((id: number) => (id === 1 ? 2 : 0));
    renderGrid({ getItemQuantity });
    expect(screen.getByTestId('qty-controls-1')).toBeInTheDocument();
    expect(screen.getByTestId('add-to-cart-2')).toBeInTheDocument();
  });

  it('passes wishlist state to cards', () => {
    const isInWishlist = vi.fn().mockImplementation((id: number) => id === 1);
    renderGrid({ isInWishlist });
    expect(screen.getByTestId('wishlist-toggle-1')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByTestId('wishlist-toggle-2')).toHaveAttribute('aria-pressed', 'false');
  });
});