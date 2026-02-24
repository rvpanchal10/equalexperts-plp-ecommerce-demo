import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProductDetail from '../components/ProductDetail';
import { mockProducts } from './fixtures';

const renderPDP = (id: string, props = {}) => {
  const defaultProps = {
    products: mockProducts,
    onAddToCart: vi.fn(),
    getItemQuantity: vi.fn().mockReturnValue(0),
    isInWishlist: vi.fn().mockReturnValue(false),
    onToggleWishlist: vi.fn(),
    ...props,
  };

  return render(
    <MemoryRouter initialEntries={[`/product/${id}`]}>
      <Routes>
        <Route path="/product/:id" element={<ProductDetail {...defaultProps} />} />
        <Route path="/" element={<div data-testid="home">Home</div>} />
      </Routes>
    </MemoryRouter>
  );
};

describe('ProductDetail', () => {
  it('renders product details for a valid id', () => {
    renderPDP('1');
    expect(screen.getByTestId('pdp-1')).toBeInTheDocument();
    expect(screen.getByTestId('pdp-title')).toHaveTextContent(mockProducts[0].title);
    expect(screen.getByTestId('pdp-price')).toHaveTextContent('£109.95');
    expect(screen.getByTestId('pdp-description')).toHaveTextContent(mockProducts[0].description);
  });

  it('renders product image', () => {
    renderPDP('1');
    expect(screen.getByTestId('pdp-image')).toHaveAttribute('src', mockProducts[0].image);
  });

  it('renders category label', () => {
    renderPDP('1');
    expect(screen.getByText("men's clothing")).toBeInTheDocument();
  });

  it('renders rating with aria-label', () => {
    renderPDP('1');
    expect(screen.getByLabelText(/Rated 3.9 out of 5/)).toBeInTheDocument();
  });

  it('shows Top Rated badge for high-rated products', () => {
    renderPDP('11'); // rating 4.8
    expect(screen.getByTestId('top-rated-badge')).toBeInTheDocument();
  });

  it('does not show Top Rated badge for lower-rated products', () => {
    renderPDP('1'); // rating 3.9
    expect(screen.queryByTestId('top-rated-badge')).not.toBeInTheDocument();
  });

  it('calls onAddToCart when button is clicked', async () => {
    const onAddToCart = vi.fn();
    renderPDP('1', { onAddToCart });
    await userEvent.click(screen.getByTestId('pdp-add-to-cart'));
    expect(onAddToCart).toHaveBeenCalledWith(mockProducts[0]);
  });

  it('shows cart quantity when item is in cart', () => {
    const getItemQuantity = vi.fn().mockReturnValue(3);
    renderPDP('1', { getItemQuantity });
    expect(screen.getByTestId('pdp-cart-info')).toHaveTextContent('3 already in cart');
  });

  it('does not show cart info when quantity is 0', () => {
    renderPDP('1');
    expect(screen.queryByTestId('pdp-cart-info')).not.toBeInTheDocument();
  });

  it('shows not-found state for invalid product id', () => {
    renderPDP('9999');
    expect(screen.getByTestId('product-not-found')).toBeInTheDocument();
    expect(screen.getByText('Product not found')).toBeInTheDocument();
  });

  it('navigates back to products on back button click', async () => {
    renderPDP('1');
    await userEvent.click(screen.getByTestId('back-to-products'));
    expect(screen.getByTestId('home')).toBeInTheDocument();
  });

  it('navigates back from not-found page', async () => {
    renderPDP('9999');
    await userEvent.click(screen.getByText('← Back to Products'));
    expect(screen.getByTestId('home')).toBeInTheDocument();
  });
});