import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Loading from '../components/Loading';

describe('Loading', () => {
  it('renders loading indicator', () => {
    render(<Loading />);
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('has appropriate role and aria-label', () => {
    render(<Loading />);
    const el = screen.getByTestId('loading');
    expect(el).toHaveAttribute('role', 'status');
    expect(el).toHaveAttribute('aria-label', 'Loading products');
  });

  it('renders 8 skeleton placeholders', () => {
    render(<Loading />);
    const skeletons = screen.getByTestId('loading').querySelectorAll('.loading__skeleton');
    expect(skeletons.length).toBe(8);
  });

  it('has screen reader text', () => {
    render(<Loading />);
    expect(screen.getByText('Loading products…')).toBeInTheDocument();
  });
});