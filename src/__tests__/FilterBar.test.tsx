import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FilterBar from '../components/FilterBar';

describe('FilterBar', () => {
  const defaultProps = {
    categories: ['electronics', 'jewelery', "men's clothing"],
    activeCategory: 'all',
    onCategoryChange: vi.fn(),
  };

  it('renders All button plus each category', () => {
    render(<FilterBar {...defaultProps} />);
    expect(screen.getByTestId('filter-all')).toBeInTheDocument();
    expect(screen.getByTestId('filter-electronics')).toBeInTheDocument();
    expect(screen.getByTestId('filter-jewelery')).toBeInTheDocument();
    expect(screen.getByTestId("filter-men's clothing")).toBeInTheDocument();
  });

  it('marks active category as pressed', () => {
    render(<FilterBar {...defaultProps} activeCategory="electronics" />);
    expect(screen.getByTestId('filter-electronics')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByTestId('filter-all')).toHaveAttribute('aria-pressed', 'false');
  });

  it('calls onCategoryChange when a filter is clicked', async () => {
    const onCategoryChange = vi.fn();
    render(<FilterBar {...defaultProps} onCategoryChange={onCategoryChange} />);
    await userEvent.click(screen.getByTestId('filter-electronics'));
    expect(onCategoryChange).toHaveBeenCalledWith('electronics');
  });

  it('has correct group role and label', () => {
    render(<FilterBar {...defaultProps} />);
    expect(screen.getByRole('group', { name: 'Filter by category' })).toBeInTheDocument();
  });
});