import { Link } from 'react-router-dom';

const VARIANTS = {
  primary: 'text-primary hover:border-primary/30 hover:bg-primary/10 hover:text-primary',
  danger: 'text-red-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600',
  neutral: 'text-muted hover:border-border hover:bg-background hover:text-dark',
};

export default function ActionIconButton({ label, icon: Icon, to, href, onClick, variant = 'neutral' }) {
  const className = `group relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-transparent transition-colors ${VARIANTS[variant]}`;
  const content = (
    <>
      <Icon size={17} strokeWidth={2.2} />
      <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-dark px-2 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
        {label}
      </span>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={className} aria-label={label} title={label}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} aria-label={label} title={label}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className} aria-label={label} title={label}>
      {content}
    </button>
  );
}
