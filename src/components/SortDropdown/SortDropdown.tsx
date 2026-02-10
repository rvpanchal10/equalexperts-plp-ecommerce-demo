import { SortOption, SORT_LABELS } from '../../types';
import './SortDropdown.css';

interface SortDropdownProps {
  value: SortOption;
  onChange: (option: SortOption) => void;
}

const OPTIONS = Object.keys(SORT_LABELS) as SortOption[];

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <div className="sort-dropdown">
      <label className="sort-dropdown__label" htmlFor="sort-select">
        Sort by
      </label>
      <select
        id="sort-select"
        className="sort-dropdown__select"
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        data-testid="sort-select"
      >
        {OPTIONS.map((opt) => (
          <option key={opt} value={opt}>
            {SORT_LABELS[opt]}
          </option>
        ))}
      </select>
    </div>
  );
}