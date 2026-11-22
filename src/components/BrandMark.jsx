export function BrandMark({ service, className = '' }) {
  return (
    <span className={`brand-badge ${className}`.trim()} aria-hidden="true">
      <span className="brand-symbol" style={{ '--brand-logo': `url('/assets/brands/${service.id}.svg')` }} />
    </span>
  );
}
