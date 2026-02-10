import { describe, it, expect } from 'vitest';
import { formatPrice, truncateText } from '../utils/format';

describe('formatPrice', () => {
  it('formats a whole number price with currency symbol', () => {
    expect(formatPrice(100)).toBe('£100.00');
  });

  it('formats a decimal price correctly', () => {
    expect(formatPrice(109.95)).toBe('£109.95');
  });

  it('formats zero', () => {
    expect(formatPrice(0)).toBe('£0.00');
  });

  it('formats large prices with comma separators', () => {
    expect(formatPrice(1999.99)).toBe('£1,999.99');
  });

  it('rounds to 2 decimal places', () => {
    expect(formatPrice(10.999)).toBe('£11.00');
  });
});

describe('truncateText', () => {
  it('returns text unchanged when shorter than maxLength', () => {
    expect(truncateText('Hello', 10)).toBe('Hello');
  });

  it('returns text unchanged when exactly maxLength', () => {
    expect(truncateText('Hello', 5)).toBe('Hello');
  });

  it('truncates and adds ellipsis when longer than maxLength', () => {
    const result = truncateText('Hello World', 5);
    expect(result).toBe('Hello…');
  });

  it('handles empty string', () => {
    expect(truncateText('', 10)).toBe('');
  });

  it('trims trailing spaces before ellipsis', () => {
    expect(truncateText('Hello World is great', 6)).toBe('Hello…');
  });
});