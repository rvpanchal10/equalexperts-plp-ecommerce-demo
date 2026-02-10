import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from '../components/Header';

describe('Header', () => {
  const defaultProps = { totalItems: 0, onCartClick: vi.fn() };

  it('renders logo and title', () => {
    render(<Header {...defaultProps} />);

    expect(
      screen.getByRole('img', { name: 'Equal Experts' })
    ).toBeInTheDocument();

    expect(screen.getByText('Product Catalogue')).toBeInTheDocument();
  });

  it('renders the cart button', () => {
    render(<Header {...defaultProps} />);
    expect(screen.getByTestId('cart-button')).toBeInTheDocument();
  });

  it('does not show badge when cart is empty', () => {
    render(<Header {...defaultProps} />);
    expect(screen.queryByTestId('cart-badge')).not.toBeInTheDocument();
  });

  it('shows badge with correct count', () => {
    render(<Header {...defaultProps} totalItems={3} />);
    expect(screen.getByTestId('cart-badge')).toHaveTextContent('3');
  });

  it('calls onCartClick when cart button clicked', async () => {
    const onCartClick = vi.fn();
    render(<Header {...defaultProps} onCartClick={onCartClick} />);

    await userEvent.click(screen.getByTestId('cart-button'));
    expect(onCartClick).toHaveBeenCalledTimes(1);
  });

  it('has correct aria-label with plural items', () => {
    render(<Header {...defaultProps} totalItems={5} />);
    expect(screen.getByTestId('cart-button')).toHaveAttribute(
      'aria-label',
      'Shopping cart with 5 items'
    );
  });

  it('uses singular item when count is 1', () => {
    render(<Header {...defaultProps} totalItems={1} />);
    expect(screen.getByTestId('cart-button')).toHaveAttribute(
      'aria-label',
      'Shopping cart with 1 item'
    );
  });

  it('renders banner role', () => {
    render(<Header {...defaultProps} />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });
});
