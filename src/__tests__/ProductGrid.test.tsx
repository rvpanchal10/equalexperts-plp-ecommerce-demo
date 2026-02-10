import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductGrid from '../components/ProductGrid';
import { mockProducts } from './fixtures';

describe('ProductGrid', () => {
  const defaultProps = {
    products: mockProducts,
    onAddToCart: vi.fn(),
    getItemQuantity: vi.fn().mockReturnValue(0),
    totalCount: 5,
    visibleCount: 5,
    hasMore: false,
    sentinelRef: vi.fn(),
    onResetFilters: vi.fn(),
  };

  it('renders all products', () => {
    render(<ProductGrid {...defaultProps} />);
    expect(screen.getByTestId('product-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('product-card-2')).toBeInTheDocument();
  });

  it('shows result count', () => {
    render(<ProductGrid {...defaultProps} />);
    expect(screen.getByTestId('results-count')).toHaveTextContent('Showing 5 of 5 products');
  });

  it('shows singular product when count is 1', () => {
    render(<ProductGrid {...defaultProps} products={[mockProducts[0]]} totalCount={1} visibleCount={1} />);
    expect(screen.getByTestId('results-count')).toHaveTextContent('Showing 1 of 1 product');
  });

  it('shows empty state with reset button when no products', async () => {
    const onResetFilters = vi.fn();
    render(<ProductGrid {...defaultProps} products={[]} totalCount={0} visibleCount={0} onResetFilters={onResetFilters} />);
    expect(screen.getByTestId('no-results')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Clear all filters'));
    expect(onResetFilters).toHaveBeenCalledTimes(1);
  });

  it('shows scroll sentinel when hasMore is true', () => {
    render(<ProductGrid {...defaultProps} hasMore={true} />);
    expect(screen.getByTestId('scroll-sentinel')).toBeInTheDocument();
  });

  it('hides scroll sentinel when hasMore is false', () => {
    render(<ProductGrid {...defaultProps} hasMore={false} />);
    expect(screen.queryByTestId('scroll-sentinel')).not.toBeInTheDocument();
  });

  it('renders as a section with Products label', () => {
    render(<ProductGrid {...defaultProps} />);
    expect(screen.getByRole('region', { name: 'Products' })).toBeInTheDocument();
  });
});