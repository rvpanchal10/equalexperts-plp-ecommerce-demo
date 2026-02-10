import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { mockProducts } from './fixtures';

vi.mock('../services/productService');

import { fetchProducts } from '../services/productService';

const mockedFetch = vi.mocked(fetchProducts);

describe('App Integration', () => {
  beforeEach(() => {
    mockedFetch.mockResolvedValue(mockProducts);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('shows loading then products', async () => {
    render(<App />);
    expect(screen.getByTestId('loading')).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByTestId('loading')).not.toBeInTheDocument());
    expect(screen.getByTestId('product-card-1')).toBeInTheDocument();
  });

  it('shows error state when API fails', async () => {
    mockedFetch.mockRejectedValue(new Error('API error'));
    render(<App />);
    await waitFor(() => expect(screen.getByTestId('error-message')).toBeInTheDocument());
    expect(screen.getByText('API error')).toBeInTheDocument();
  });

  it('retries on retry click', async () => {
    mockedFetch.mockRejectedValueOnce(new Error('Temporary'));
    render(<App />);
    await waitFor(() => expect(screen.getByTestId('error-message')).toBeInTheDocument());
    mockedFetch.mockResolvedValueOnce(mockProducts);
    await userEvent.click(screen.getByText('Retry'));
    await waitFor(() => expect(screen.getByTestId('product-card-1')).toBeInTheDocument());
  });

  it('adds item to cart and shows badge', async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByTestId('add-to-cart-1')).toBeInTheDocument());
    expect(screen.queryByTestId('cart-badge')).not.toBeInTheDocument();
    await userEvent.click(screen.getByTestId('add-to-cart-1'));
    expect(screen.getByTestId('cart-badge')).toHaveTextContent('1');
  });

  it('adds same item multiple times', async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByTestId('add-to-cart-1')).toBeInTheDocument());
    await userEvent.click(screen.getByTestId('add-to-cart-1'));
    await userEvent.click(screen.getByTestId('add-to-cart-1'));
    await userEvent.click(screen.getByTestId('add-to-cart-1'));
    expect(screen.getByTestId('cart-badge')).toHaveTextContent('3');
  });

  it('opens cart and shows items with correct total', async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByTestId('add-to-cart-1')).toBeInTheDocument());
    await userEvent.click(screen.getByTestId('add-to-cart-1'));
    await userEvent.click(screen.getByTestId('add-to-cart-2'));
    await userEvent.click(screen.getByTestId('cart-button'));
    expect(screen.getByTestId('cart-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('cart-total')).toHaveTextContent('£132.25');
  });

  it('removes item from cart', async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByTestId('add-to-cart-1')).toBeInTheDocument());
    await userEvent.click(screen.getByTestId('add-to-cart-1'));
    await userEvent.click(screen.getByTestId('cart-button'));
    await userEvent.click(screen.getByTestId('remove-item-1'));
    expect(screen.getByTestId('cart-empty')).toBeInTheDocument();
  });

  it('renders toolbar with search, sort, and filters', async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByTestId('toolbar')).toBeInTheDocument());
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.getByTestId('sort-select')).toBeInTheDocument();
    expect(screen.getByTestId('filter-bar')).toBeInTheDocument();
  });

  it('filters products by category', async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByTestId('filter-bar')).toBeInTheDocument());
    await userEvent.click(screen.getByTestId('filter-electronics'));
    expect(screen.getByTestId('product-card-11')).toBeInTheDocument();
    expect(screen.queryByTestId('product-card-1')).not.toBeInTheDocument();
    expect(screen.getByTestId('results-count')).toHaveTextContent('Showing 1 of 1 product');
  });

  it('shows all products when All filter is clicked', async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByTestId('filter-bar')).toBeInTheDocument());
    await userEvent.click(screen.getByTestId('filter-electronics'));
    await userEvent.click(screen.getByTestId('filter-all'));
    expect(screen.getByTestId('results-count')).toHaveTextContent('of 5 products');
  });

  it('sorts products by price low to high', async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByTestId('sort-select')).toBeInTheDocument());
    await userEvent.selectOptions(screen.getByTestId('sort-select'), 'price-asc');
    const cards = screen.getAllByTestId(/^product-card-/);
    expect(cards[0]).toHaveAttribute('data-testid', 'product-card-18');
  });

  it('sorts products by top rated', async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByTestId('sort-select')).toBeInTheDocument());
    await userEvent.selectOptions(screen.getByTestId('sort-select'), 'rating-desc');
    const cards = screen.getAllByTestId(/^product-card-/);
    expect(cards[0]).toHaveAttribute('data-testid', 'product-card-11');
  });

  it('shows Top Rated badge on highly rated products', async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByTestId('product-card-11')).toBeInTheDocument());
    const badges = screen.getAllByTestId('top-rated-badge');
    expect(badges.length).toBe(3);
  });

  it('shows result count', async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByTestId('results-count')).toBeInTheDocument());
    expect(screen.getByTestId('results-count')).toHaveTextContent('Showing 5 of 5 products');
  });

  it('renders skip to content link', () => {
    render(<App />);
    expect(screen.getByText('Skip to main content')).toBeInTheDocument();
  });
});