import { ALL_CATEGORIES } from '../../types';
import './FilterBar.css';

interface FilterBarProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function FilterBar({ categories, activeCategory, onCategoryChange }: FilterBarProps) {
  const allCategories = [ALL_CATEGORIES, ...categories];

  return (
    <div className="filter-bar" role="group" aria-label="Filter by category" data-testid="filter-bar">
      {allCategories.map((cat) => (
        <button
          key={cat}
          className={`filter-bar__btn ${activeCategory === cat ? 'filter-bar__btn--active' : ''}`}
          onClick={() => onCategoryChange(cat)}
          aria-pressed={activeCategory === cat}
          data-testid={`filter-${cat}`}
        >
          {cat === ALL_CATEGORIES ? 'All' : cat}
        </button>
      ))}
    </div>
  );
}