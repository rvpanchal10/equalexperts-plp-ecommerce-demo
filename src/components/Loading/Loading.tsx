import './Loading.css';

export default function Loading() {
  return (
    <div className="loading" role="status" aria-label="Loading products" data-testid="loading">
      <div className="loading__grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="loading__skeleton" aria-hidden="true">
            <div className="loading__skeleton-image" />
            <div className="loading__skeleton-body">
              <div className="loading__skeleton-line loading__skeleton-line--short" />
              <div className="loading__skeleton-line" />
              <div className="loading__skeleton-line loading__skeleton-line--long" />
              <div className="loading__skeleton-line loading__skeleton-line--medium" />
            </div>
          </div>
        ))}
      </div>
      <span className="sr-only">Loading products…</span>
    </div>
  );
}