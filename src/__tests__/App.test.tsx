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
    localStorage.clear();
    mockedFetch.mockResolvedValue(mockProducts);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  // ── Loading & Error ──

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

  // ── Toolbar ──

  it('renders toolbar with search, sort, and filters', async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByTestId('toolbar')).toBeInTheDocument());
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.getByTestId('sort-select')).toBeInTheDocument();
    expect(screen.getByTestId('filter-bar')).toBeInTheDocument();
  });

  // ── Category Filtering ──

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

  // ── Sorting ──

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

  // ── Top Rated Badge ──

  it('shows Top Rated badge on highly rated products', async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByTestId('product-card-11')).toBeInTheDocument());
    const badges = screen.getAllByTestId('top-rated-badge');
    expect(badges.length).toBe(3); // ids 5 (4.6), 11 (4.8), 18 (4.7)
  });

  // ── Add to Cart → inline controls flow ──

  it('shows Add to Cart button initially, then qty controls after adding', async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByTestId('add-to-cart-1')).toBeInTheDocument());

    // Initially shows Add to Cart
    expect(screen.queryByTestId('qty-controls-1')).not.toBeInTheDocument();

    // Add to cart
    await userEvent.click(screen.getByTestId('add-to-cart-1'));

    // Now shows qty controls with quantity 1
    expect(screen.getByTestId('qty-controls-1')).toBeInTheDocument();
    expect(screen.getByTestId('card-qty-1')).toHaveTextContent('1');
    expect(screen.queryByTestId('add-to-cart-1')).not.toBeInTheDocument();

    // Badge updates
    expect(screen.getByTestId('cart-badge')).toHaveTextContent('1');
  });

  it('increments quantity via + button on card', async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByTestId('add-to-cart-1')).toBeInTheDocument());
    await userEvent.click(screen.getByTestId('add-to-cart-1'));
    await userEvent.click(screen.getByTestId('card-increase-1'));
    await userEvent.click(screen.getByTestId('card-increase-1'));

    expect(screen.getByTestId('card-qty-1')).toHaveTextContent('3');
    expect(screen.getByTestId('cart-badge')).toHaveTextContent('3');
    expect(screen.getByTestId('in-cart-badge-1')).toHaveTextContent('3 in cart');
  });

  it('decrements quantity via − button on card', async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByTestId('add-to-cart-1')).toBeInTheDocument());
    await userEvent.click(screen.getByTestId('add-to-cart-1'));
    await userEvent.click(screen.getByTestId('card-increase-1')); // qty = 2
    await userEvent.click(screen.getByTestId('card-decrease-1')); // qty = 1

    expect(screen.getByTestId('card-qty-1')).toHaveTextContent('1');
    expect(screen.getByTestId('cart-badge')).toHaveTextContent('1');
  });

  it('removes item and shows Add to Cart again when decreasing from 1', async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByTestId('add-to-cart-1')).toBeInTheDocument());
    await userEvent.click(screen.getByTestId('add-to-cart-1')); // qty = 1
    await userEvent.click(screen.getByTestId('card-decrease-1')); // remove

    // Back to Add to Cart button
    expect(screen.getByTestId('add-to-cart-1')).toBeInTheDocument();
    expect(screen.queryByTestId('qty-controls-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('cart-badge')).not.toBeInTheDocument();
  });

  // ── Cart drawer with inline controls interaction ──

  it('opens cart and shows items added via inline controls', async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByTestId('add-to-cart-1')).toBeInTheDocument());

    // Add product 1 then increase to 3
    await userEvent.click(screen.getByTestId('add-to-cart-1'));
    await userEvent.click(screen.getByTestId('card-increase-1'));
    await userEvent.click(screen.getByTestId('card-increase-1'));

    // Add product 2
    await userEvent.click(screen.getByTestId('add-to-cart-2'));

    // Open cart
    await userEvent.click(screen.getByTestId('cart-button'));
    expect(screen.getByTestId('cart-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('cart-qty-1')).toHaveTextContent('3');
    expect(screen.getByTestId('cart-item-2')).toBeInTheDocument();
    expect(screen.getByTestId('cart-badge')).toHaveTextContent('4');
  });

  it('cart drawer quantity changes reflect on product card', async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByTestId('add-to-cart-1')).toBeInTheDocument());
    await userEvent.click(screen.getByTestId('add-to-cart-1'));
    await userEvent.click(screen.getByTestId('card-increase-1')); // qty = 2

    // Open cart and increase via cart drawer
    await userEvent.click(screen.getByTestId('cart-button'));
    await userEvent.click(screen.getByTestId('increase-qty-1')); // qty = 3

    // Card should reflect updated quantity
    expect(screen.getByTestId('card-qty-1')).toHaveTextContent('3');
    expect(screen.getByTestId('in-cart-badge-1')).toHaveTextContent('3 in cart');
  });

  it('removes item from cart drawer and card reverts to Add to Cart', async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByTestId('add-to-cart-1')).toBeInTheDocument());
    await userEvent.click(screen.getByTestId('add-to-cart-1'));
    await userEvent.click(screen.getByTestId('cart-button'));
    await userEvent.click(screen.getByTestId('remove-item-1'));

    // Card should show Add to Cart again
    await userEvent.click(screen.getByTestId('close-cart'));
    expect(screen.getByTestId('add-to-cart-1')).toBeInTheDocument();
    expect(screen.queryByTestId('qty-controls-1')).not.toBeInTheDocument();
  });

  it('clears cart and all cards revert to Add to Cart', async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByTestId('add-to-cart-1')).toBeInTheDocument());
    await userEvent.click(screen.getByTestId('add-to-cart-1'));
    await userEvent.click(screen.getByTestId('add-to-cart-2'));
    await userEvent.click(screen.getByTestId('cart-button'));
    await userEvent.click(screen.getByTestId('clear-cart'));

    await userEvent.click(screen.getByTestId('close-cart'));
    expect(screen.getByTestId('add-to-cart-1')).toBeInTheDocument();
    expect(screen.getByTestId('add-to-cart-2')).toBeInTheDocument();
  });

  // ── localStorage persistence ──

  it('persists cart to localStorage', async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByTestId('add-to-cart-1')).toBeInTheDocument());
    await userEvent.click(screen.getByTestId('add-to-cart-1'));
    await userEvent.click(screen.getByTestId('card-increase-1'));

    const stored = JSON.parse(localStorage.getItem('ee-plp:cart')!);
    expect(stored).toHaveLength(1);
    expect(stored[0].quantity).toBe(2);
  });

  it('hydrates cart from localStorage on mount', async () => {
    // Pre-populate localStorage with product 1 qty 3
    const savedCart = [{
      product: mockProducts[0],
      quantity: 3,
    }];
    localStorage.setItem('ee-plp:cart', JSON.stringify(savedCart));

    render(<App />);
    await waitFor(() => expect(screen.getByTestId('product-card-1')).toBeInTheDocument());

    // Should show qty controls immediately, not Add to Cart
    expect(screen.getByTestId('qty-controls-1')).toBeInTheDocument();
    expect(screen.getByTestId('card-qty-1')).toHaveTextContent('3');
    expect(screen.getByTestId('cart-badge')).toHaveTextContent('3');
    expect(screen.getByTestId('in-cart-badge-1')).toHaveTextContent('3 in cart');
  });

  // ── Result count ──

  it('shows result count', async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByTestId('results-count')).toBeInTheDocument());
    expect(screen.getByTestId('results-count')).toHaveTextContent('Showing 5 of 5 products');
  });


  it('toggles wishlist heart on product card', async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByTestId('wishlist-toggle-1')).toBeInTheDocument());

    // Initially not wishlisted
    expect(screen.getByTestId('wishlist-toggle-1')).toHaveAttribute('aria-pressed', 'false');

    // Add to wishlist
    await userEvent.click(screen.getByTestId('wishlist-toggle-1'));
    expect(screen.getByTestId('wishlist-toggle-1')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByTestId('wishlist-badge')).toHaveTextContent('1');

    // Remove from wishlist
    await userEvent.click(screen.getByTestId('wishlist-toggle-1'));
    expect(screen.getByTestId('wishlist-toggle-1')).toHaveAttribute('aria-pressed', 'false');
    expect(screen.queryByTestId('wishlist-badge')).not.toBeInTheDocument();
  });

  it('shows multiple wishlisted items in header badge', async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByTestId('wishlist-toggle-1')).toBeInTheDocument());
    await userEvent.click(screen.getByTestId('wishlist-toggle-1'));
    await userEvent.click(screen.getByTestId('wishlist-toggle-2'));
    expect(screen.getByTestId('wishlist-badge')).toHaveTextContent('2');
  });

  // ── Wishlist drawer ──

  it('opens wishlist drawer and shows items', async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByTestId('wishlist-toggle-1')).toBeInTheDocument());
    await userEvent.click(screen.getByTestId('wishlist-toggle-1'));
    await userEvent.click(screen.getByTestId('wishlist-toggle-2'));

    await userEvent.click(screen.getByTestId('wishlist-button'));
    expect(screen.getByTestId('wishlist-drawer')).toHaveClass('wishlist-drawer--open');
    expect(screen.getByTestId('wishlist-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('wishlist-item-2')).toBeInTheDocument();
  });

  it('shows empty wishlist state', async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByTestId('product-card-1')).toBeInTheDocument());
    await userEvent.click(screen.getByTestId('wishlist-button'));
    expect(screen.getByTestId('wishlist-empty')).toBeInTheDocument();
  });

  it('removes item from wishlist drawer', async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByTestId('wishlist-toggle-1')).toBeInTheDocument());
    await userEvent.click(screen.getByTestId('wishlist-toggle-1'));
    await userEvent.click(screen.getByTestId('wishlist-button'));
    await userEvent.click(screen.getByTestId('remove-wishlist-1'));
    expect(screen.queryByTestId('wishlist-item-1')).not.toBeInTheDocument();
    expect(screen.getByTestId('wishlist-empty')).toBeInTheDocument();
  });

  it('moves item from wishlist to cart', async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByTestId('wishlist-toggle-1')).toBeInTheDocument());
    await userEvent.click(screen.getByTestId('wishlist-toggle-1'));
    await userEvent.click(screen.getByTestId('wishlist-button'));
    await userEvent.click(screen.getByTestId('move-to-cart-1'));

    // Item removed from wishlist
    expect(screen.queryByTestId('wishlist-item-1')).not.toBeInTheDocument();
    // Item added to cart
    expect(screen.getByTestId('cart-badge')).toHaveTextContent('1');
  });

  it('clears entire wishlist', async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByTestId('wishlist-toggle-1')).toBeInTheDocument());
    await userEvent.click(screen.getByTestId('wishlist-toggle-1'));
    await userEvent.click(screen.getByTestId('wishlist-toggle-2'));
    await userEvent.click(screen.getByTestId('wishlist-button'));
    await userEvent.click(screen.getByTestId('clear-wishlist'));
    expect(screen.getByTestId('wishlist-empty')).toBeInTheDocument();
    expect(screen.queryByTestId('wishlist-badge')).not.toBeInTheDocument();
  });

  // ── Wishlist + Cart independence ──

  it('wishlist and cart operate independently', async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByTestId('add-to-cart-1')).toBeInTheDocument());

    // Add to cart and wishlist
    await userEvent.click(screen.getByTestId('add-to-cart-1'));
    await userEvent.click(screen.getByTestId('wishlist-toggle-1'));

    expect(screen.getByTestId('cart-badge')).toHaveTextContent('1');
    expect(screen.getByTestId('wishlist-badge')).toHaveTextContent('1');

    // Remove from wishlist — cart unaffected
    await userEvent.click(screen.getByTestId('wishlist-toggle-1'));
    expect(screen.queryByTestId('wishlist-badge')).not.toBeInTheDocument();
    expect(screen.getByTestId('cart-badge')).toHaveTextContent('1');
    expect(screen.getByTestId('qty-controls-1')).toBeInTheDocument();
  });

  // ── Wishlist localStorage persistence ──

  it('persists wishlist to localStorage', async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByTestId('wishlist-toggle-1')).toBeInTheDocument());
    await userEvent.click(screen.getByTestId('wishlist-toggle-1'));
    const stored = JSON.parse(localStorage.getItem('ee-plp:wishlist')!);
    expect(stored).toHaveLength(1);
    expect(stored[0].id).toBe(1);
  });

  it('hydrates wishlist from localStorage', async () => {
    localStorage.setItem('ee-plp:wishlist', JSON.stringify([mockProducts[0]]));
    render(<App />);
    await waitFor(() => expect(screen.getByTestId('product-card-1')).toBeInTheDocument());
    expect(screen.getByTestId('wishlist-toggle-1')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByTestId('wishlist-badge')).toHaveTextContent('1');
  });

  // ── Accessibility ──

  it('renders skip to content link', () => {
    render(<App />);
    expect(screen.getByText('Skip to main content')).toBeInTheDocument();
  });
});