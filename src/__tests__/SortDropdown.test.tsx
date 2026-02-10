import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SortDropdown from '../components/SortDropdown';

describe('SortDropdown', () => {
  const defaultProps = { value: 'default' as const, onChange: vi.fn() };

  it('renders the select with all sort options', () => {
    render(<SortDropdown {...defaultProps} />);
    const select = screen.getByTestId('sort-select');
    expect(select).toBeInTheDocument();
    expect(select.querySelectorAll('option')).toHaveLength(5);
  });

  it('shows current value as selected', () => {
    render(<SortDropdown {...defaultProps} value="price-asc" />);
    expect(screen.getByTestId('sort-select')).toHaveValue('price-asc');
  });

  it('calls onChange when a new option is selected', async () => {
    const onChange = vi.fn();
    render(<SortDropdown {...defaultProps} onChange={onChange} />);
    await userEvent.selectOptions(screen.getByTestId('sort-select'), 'rating-desc');
    expect(onChange).toHaveBeenCalledWith('rating-desc');
  });

  it('has an associated label', () => {
    render(<SortDropdown {...defaultProps} />);
    expect(screen.getByLabelText('Sort by')).toBeInTheDocument();
  });
});