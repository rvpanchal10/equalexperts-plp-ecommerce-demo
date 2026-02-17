import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WishlistItem from '../components/WishlistItem';
import { createMockProduct } from './fixtures';

describe('WishlistItem', () => {
  const product = createMockProduct({ id: 1, title: 'Test Product', price: 25 });
  const defaultProps = {
    product,
    onRemove: vi.fn(),
    onAddToCart: vi.fn(),
  };

  it('renders product title', () => {
    render(<WishlistItem {...defaultProps} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('renders price', () => {
    render(<WishlistItem {...defaultProps} />);
    expect(screen.getByText('£25.00')).toBeInTheDocument();
  });

  it('renders product image', () => {
    render(<WishlistItem {...defaultProps} />);
    expect(screen.getByAltText('Test Product')).toHaveAttribute('src', product.image);
  });

  it('calls onAddToCart and onRemove when move-to-cart clicked', async () => {
    const onAddToCart = vi.fn();
    const onRemove = vi.fn();
    render(<WishlistItem {...defaultProps} onAddToCart={onAddToCart} onRemove={onRemove} />);
    await userEvent.click(screen.getByTestId('move-to-cart-1'));
    expect(onAddToCart).toHaveBeenCalledWith(product);
    expect(onRemove).toHaveBeenCalledWith(1);
  });

  it('calls onRemove when remove clicked', async () => {
    const onRemove = vi.fn();
    render(<WishlistItem {...defaultProps} onRemove={onRemove} />);
    await userEvent.click(screen.getByTestId('remove-wishlist-1'));
    expect(onRemove).toHaveBeenCalledWith(1);
  });

  it('has accessible move-to-cart label', () => {
    render(<WishlistItem {...defaultProps} />);
    expect(screen.getByTestId('move-to-cart-1')).toHaveAttribute('aria-label', 'Move Test Product to cart');
  });

  it('has accessible remove label', () => {
    render(<WishlistItem {...defaultProps} />);
    expect(screen.getByTestId('remove-wishlist-1')).toHaveAttribute('aria-label', 'Remove Test Product from wishlist');
  });
});