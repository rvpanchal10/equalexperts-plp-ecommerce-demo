import './TopRatedBadge.css';

export default function TopRatedBadge() {
  return (
    <span className="top-rated-badge" data-testid="top-rated-badge">
      <svg className="top-rated-badge__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
      Top Rated
    </span>
  );
}