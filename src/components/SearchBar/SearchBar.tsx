import { useState, useEffect } from 'react';
import './SearchBar.css';

interface SearchBarProps {
  value: string;
  onChange: (query: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);

  // Debounce search input
  useEffect(() => {
    const timeout = setTimeout(() => onChange(localValue), 300);
    return () => clearTimeout(timeout);
  }, [localValue, onChange]);

  // Sync external resets
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <div className="search-bar">
      <svg className="search-bar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        className="search-bar__input"
        type="search"
        placeholder="Search products…"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        aria-label="Search products"
        data-testid="search-input"
      />
      {localValue && (
        <button
          className="search-bar__clear"
          onClick={() => setLocalValue('')}
          aria-label="Clear search"
          data-testid="search-clear"
        >
          ✕
        </button>
      )}
    </div>
  );
}