import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CartItemComponent from '../components/CartItem';
import { createMockProduct } from './fixtures';

describe('CartItem', () => {
  const product = createMockProduct({ id: 1, title: 'Test Product', price: 25 });

  const defaultProps = {
    item: { product, quantity: 2 },
    onUpdateQuantity: vi.fn(),
    onRemove: vi.fn(),
  };

  it('renders product title', () => {
    render(<CartItemComponent {...defaultProps} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('renders unit price', () => {
    render(<CartItemComponent {...defaultProps} />);
    expect(screen.getByText('£25.00 each')).toBeInTheDocument();
  });

  it('renders quantity', () => {
    render(<CartItemComponent {...defaultProps} />);
    expect(screen.getByTestId('cart-qty-1')).toHaveTextContent('2');
  });

  it('renders line total (price * quantity)', () => {
    render(<CartItemComponent {...defaultProps} />);
    expect(screen.getByTestId('cart-line-total-1')).toHaveTextContent('£50.00');
  });

  it('calls onUpdateQuantity with incremented value', async () => {
    const onUpdateQuantity = vi.fn();

    render(<CartItemComponent {...defaultProps} onUpdateQuantity={onUpdateQuantity} />);
    await userEvent.click(screen.getByTestId('increase-qty-1'));

    expect(onUpdateQuantity).toHaveBeenCalledWith(1, 3);
  });

  it('calls onUpdateQuantity with decremented value', async () => {
    const onUpdateQuantity = vi.fn();

    render(<CartItemComponent {...defaultProps} onUpdateQuantity={onUpdateQuantity} />);
    await userEvent.click(screen.getByTestId('decrease-qty-1'));

    expect(onUpdateQuantity).toHaveBeenCalledWith(1, 1);
  });

  it('calls onRemove when remove clicked', async () => {
    const onRemove = vi.fn();

    render(<CartItemComponent {...defaultProps} onRemove={onRemove} />);
    await userEvent.click(screen.getByTestId('remove-item-1'));

    expect(onRemove).toHaveBeenCalledWith(1);
  });

  it('renders product image', () => {
    render(<CartItemComponent {...defaultProps} />);

    expect(
      screen.getByAltText('Test Product')
    ).toHaveAttribute('src', product.image);
  });

  it('has accessible labels on quantity buttons', () => {
    render(<CartItemComponent {...defaultProps} />);

    expect(screen.getByTestId('decrease-qty-1')).toHaveAttribute(
      'aria-label',
      'Decrease quantity of Test Product'
    );

    expect(screen.getByTestId('increase-qty-1')).toHaveAttribute(
      'aria-label',
      'Increase quantity of Test Product'
    );
  });

  it('has accessible label on remove button', () => {
    render(<CartItemComponent {...defaultProps} />);

    expect(screen.getByTestId('remove-item-1')).toHaveAttribute(
      'aria-label',
      'Remove Test Product from cart'
    );
  });
});
