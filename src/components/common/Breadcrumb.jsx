import { Link } from 'react-router-dom';

export default function Breadcrumb({ items }) {
  return (
    <nav className="mb-4 flex items-center gap-1.5 text-sm text-muted" aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span key={item.label} className="flex items-center gap-1.5">
            {index > 0 && <span className="text-border">/</span>}
            {item.to && !isLast ? (
              <Link to={item.to} className="hover:text-primary">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? 'font-medium text-dark' : ''}>{item.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
