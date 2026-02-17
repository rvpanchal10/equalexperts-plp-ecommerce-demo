import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WishlistDrawer from '../components/WishlistDrawer';
import { mockProducts } from './fixtures';

describe('WishlistDrawer', () => {
  const defaultProps = {
    items: [mockProducts[0], mockProducts[1]],
    totalItems: 2,
    isOpen: true,
    onClose: vi.fn(),
    onRemoveItem: vi.fn(),
    onAddToCart: vi.fn(),
    onClearWishlist: vi.fn(),
  };

  it('renders when open', () => {
    render(<WishlistDrawer {...defaultProps} />);
    expect(screen.getByTestId('wishlist-drawer')).toHaveClass('wishlist-drawer--open');
  });

  it('renders item count', () => {
    render(<WishlistDrawer {...defaultProps} />);
    expect(screen.getByText('(2 items)')).toBeInTheDocument();
  });

  it('renders singular item text', () => {
    render(<WishlistDrawer {...defaultProps} totalItems={1} items={[mockProducts[0]]} />);
    expect(screen.getByText('(1 item)')).toBeInTheDocument();
  });

  it('renders all wishlist items', () => {
    render(<WishlistDrawer {...defaultProps} />);
    expect(screen.getByTestId('wishlist-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('wishlist-item-2')).toBeInTheDocument();
  });

  it('shows empty state when no items', () => {
    render(<WishlistDrawer {...defaultProps} items={[]} totalItems={0} />);
    expect(screen.getByTestId('wishlist-empty')).toBeInTheDocument();
    expect(screen.getByText('Your wishlist is empty')).toBeInTheDocument();
  });

  it('calls onClose when close button clicked', async () => {
    const onClose = vi.fn();
    render(<WishlistDrawer {...defaultProps} onClose={onClose} />);
    await userEvent.click(screen.getByTestId('close-wishlist'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose on Escape key', () => {
    const onClose = vi.fn();
    render(<WishlistDrawer {...defaultProps} onClose={onClose} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose on overlay click', () => {
    const onClose = vi.fn();
    render(<WishlistDrawer {...defaultProps} onClose={onClose} />);
    fireEvent.click(screen.getByTestId('wishlist-overlay'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClearWishlist when clear clicked', async () => {
    const onClearWishlist = vi.fn();
    render(<WishlistDrawer {...defaultProps} onClearWishlist={onClearWishlist} />);
    await userEvent.click(screen.getByTestId('clear-wishlist'));
    expect(onClearWishlist).toHaveBeenCalledTimes(1);
  });

  it('has correct aria attributes', () => {
    render(<WishlistDrawer {...defaultProps} />);
    const drawer = screen.getByTestId('wishlist-drawer');
    expect(drawer).toHaveAttribute('role', 'dialog');
    expect(drawer).toHaveAttribute('aria-modal', 'true');
    expect(drawer).toHaveAttribute('aria-label', 'Wishlist');
  });

  it('hides clear button when empty', () => {
    render(<WishlistDrawer {...defaultProps} items={[]} totalItems={0} />);
    expect(screen.queryByTestId('clear-wishlist')).not.toBeInTheDocument();
  });
});