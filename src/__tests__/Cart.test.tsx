import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Cart from '../components/Cart';
import { mockCartItems } from './fixtures';

describe('Cart', () => {
  const defaultProps = {
    items: mockCartItems,
    totalItems: 3,
    totalPrice: 242.2,
    isOpen: true,
    onClose: vi.fn(),
    onUpdateQuantity: vi.fn(),
    onRemoveItem: vi.fn(),
    onClearCart: vi.fn(),
  };

  it('renders cart drawer when open', () => {
    render(<Cart {...defaultProps} />);
    expect(screen.getByTestId('cart-drawer')).toHaveClass('cart-drawer--open');
  });

  it('renders title with item count', () => {
    render(<Cart {...defaultProps} />);
    expect(screen.getByText('Your Cart')).toBeInTheDocument();
    expect(screen.getByText('(3 items)')).toBeInTheDocument();
  });

  it('renders singular item when count is 1', () => {
    render(<Cart {...defaultProps} totalItems={1} />);
    expect(screen.getByText('(1 item)')).toBeInTheDocument();
  });

  it('renders all cart items', () => {
    render(<Cart {...defaultProps} />);
    expect(screen.getByTestId('cart-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('cart-item-2')).toBeInTheDocument();
  });

  it('shows total price', () => {
    render(<Cart {...defaultProps} />);
    expect(screen.getByTestId('cart-total')).toHaveTextContent('£242.20');
  });

  it('shows empty state when no items', () => {
    render(<Cart {...defaultProps} items={[]} totalItems={0} totalPrice={0} />);
    expect(screen.getByTestId('cart-empty')).toBeInTheDocument();
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
  });

  it('hides checkout/clear when empty', () => {
    render(<Cart {...defaultProps} items={[]} totalItems={0} totalPrice={0} />);
    expect(screen.queryByTestId('checkout-btn')).not.toBeInTheDocument();
    expect(screen.queryByTestId('clear-cart')).not.toBeInTheDocument();
  });

  it('calls onClose when close button clicked', async () => {
    const onClose = vi.fn();
    render(<Cart {...defaultProps} onClose={onClose} />);
    await userEvent.click(screen.getByTestId('close-cart'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when overlay clicked', () => {
    const onClose = vi.fn();
    render(<Cart {...defaultProps} onClose={onClose} />);
    fireEvent.click(screen.getByTestId('cart-overlay'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose on Escape key', () => {
    const onClose = vi.fn();
    render(<Cart {...defaultProps} onClose={onClose} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClearCart when clear clicked', async () => {
    const onClearCart = vi.fn();
    render(<Cart {...defaultProps} onClearCart={onClearCart} />);
    await userEvent.click(screen.getByTestId('clear-cart'));
    expect(onClearCart).toHaveBeenCalledTimes(1);
  });

  it('has correct aria attributes', () => {
    render(<Cart {...defaultProps} />);
    const drawer = screen.getByTestId('cart-drawer');
    expect(drawer).toHaveAttribute('role', 'dialog');
    expect(drawer).toHaveAttribute('aria-modal', 'true');
    expect(drawer).toHaveAttribute('aria-label', 'Shopping cart');
  });

  it('is not open when isOpen is false', () => {
    render(<Cart {...defaultProps} isOpen={false} />);
    expect(screen.getByTestId('cart-drawer')).not.toHaveClass('cart-drawer--open');
  });

  it('shows overlay when open', () => {
    render(<Cart {...defaultProps} />);
    expect(screen.getByTestId('cart-overlay')).toHaveClass('cart-overlay--visible');
  });
});