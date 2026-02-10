import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from '../components/SearchBar';

describe('SearchBar', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  it('renders search input', () => {
    render(<SearchBar value="" onChange={vi.fn()} />);
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
  });

  it('has accessible label', () => {
    render(<SearchBar value="" onChange={vi.fn()} />);
    expect(screen.getByLabelText('Search products')).toBeInTheDocument();
  });

  it('does not show clear button when empty', () => {
    render(<SearchBar value="" onChange={vi.fn()} />);
    expect(screen.queryByTestId('search-clear')).not.toBeInTheDocument();
  });

  it('shows clear button when has value', () => {
    render(<SearchBar value="test" onChange={vi.fn()} />);
    expect(screen.getByTestId('search-clear')).toBeInTheDocument();
  });

  it('calls onChange after debounce', async () => {
    const onChange = vi.fn();
    render(<SearchBar value="" onChange={onChange} />);

    await userEvent.type(screen.getByTestId('search-input'), 'backpack');
    vi.advanceTimersByTime(350);

    expect(onChange).toHaveBeenCalled();
    vi.useRealTimers();
  });

  it('clears input on clear button click', async () => {
    const onChange = vi.fn();
    render(<SearchBar value="test" onChange={onChange} />);
    await userEvent.click(screen.getByTestId('search-clear'));
    expect(screen.getByTestId('search-input')).toHaveValue('');
    vi.useRealTimers();
  });
});