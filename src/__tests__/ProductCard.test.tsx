import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductCard from '../components/ProductCard';
import { createMockProduct } from './fixtures';

describe('ProductCard', () => {
  const product = createMockProduct({
    id: 1, title: 'Test Backpack', price: 109.95,
    description: 'A great backpack for everyday use and walks in the forest.',
    category: "men's clothing", rating: { rate: 4, count: 120 },
  });

  const defaultProps = { product, onAddToCart: vi.fn(), cartQuantity: 0 };

  it('renders product title', () => {
    render(<ProductCard {...defaultProps} />);
    expect(screen.getByText('Test Backpack')).toBeInTheDocument();
  });

  it('renders price formatted as GBP', () => {
    render(<ProductCard {...defaultProps} />);
    expect(screen.getByTestId('product-price-1')).toHaveTextContent('£109.95');
  });

  it('renders category', () => {
    render(<ProductCard {...defaultProps} />);
    expect(screen.getByText("men's clothing")).toBeInTheDocument();
  });

  it('renders image with alt text', () => {
    render(<ProductCard {...defaultProps} />);
    const img = screen.getByAltText('Test Backpack');
    expect(img).toHaveAttribute('src', product.image);
  });

  it('renders truncated description', () => {
    render(<ProductCard {...defaultProps} />);
    expect(screen.getByText(/A great backpack/)).toBeInTheDocument();
  });

  it('calls onAddToCart with product when clicked', async () => {
    const onAddToCart = vi.fn();
    render(<ProductCard {...defaultProps} onAddToCart={onAddToCart} />);
    await userEvent.click(screen.getByTestId('add-to-cart-1'));
    expect(onAddToCart).toHaveBeenCalledWith(product);
  });

  it('allows adding to cart multiple times', async () => {
    const onAddToCart = vi.fn();
    render(<ProductCard {...defaultProps} onAddToCart={onAddToCart} />);
    const btn = screen.getByTestId('add-to-cart-1');
    await userEvent.click(btn);
    await userEvent.click(btn);
    await userEvent.click(btn);
    expect(onAddToCart).toHaveBeenCalledTimes(3);
  });

  it('does not show in-cart badge when quantity is 0', () => {
    render(<ProductCard {...defaultProps} cartQuantity={0} />);
    expect(screen.queryByTestId('in-cart-badge-1')).not.toBeInTheDocument();
  });

  it('shows in-cart badge with quantity', () => {
    render(<ProductCard {...defaultProps} cartQuantity={3} />);
    expect(screen.getByTestId('in-cart-badge-1')).toHaveTextContent('3 in cart');
  });

  it('renders star rating accessibility label', () => {
    render(<ProductCard {...defaultProps} />);
    expect(screen.getByLabelText('Rated 4 out of 5 from 120 reviews')).toBeInTheDocument();
  });

  it('has accessible add to cart button', () => {
    render(<ProductCard {...defaultProps} />);
    expect(screen.getByTestId('add-to-cart-1')).toHaveAttribute('aria-label', 'Add Test Backpack to cart');
  });

  it('shows loaded class after image loads', () => {
    render(<ProductCard {...defaultProps} />);
    const img = screen.getByAltText('Test Backpack');
    expect(img).not.toHaveClass('product-card__image--loaded');
    fireEvent.load(img);
    expect(img).toHaveClass('product-card__image--loaded');
  });

  it('shows error state when image fails', () => {
    render(<ProductCard {...defaultProps} />);
    fireEvent.error(screen.getByAltText('Test Backpack'));
    expect(screen.getByText('Image unavailable')).toBeInTheDocument();
  });

  it('uses lazy loading', () => {
    render(<ProductCard {...defaultProps} />);
    expect(screen.getByAltText('Test Backpack')).toHaveAttribute('loading', 'lazy');
  });

  it('renders as an article', () => {
    render(<ProductCard {...defaultProps} />);
    expect(screen.getByTestId('product-card-1').tagName).toBe('ARTICLE');
  });
});