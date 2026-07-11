const VARIANTS = {
  neutral: 'bg-background text-muted border border-border',
  primary: 'bg-primary/10 text-primary',
  success: 'bg-success/10 text-success',
  warning: 'bg-accent/10 text-accent',
  danger: 'bg-red-50 text-red-600',
};

export default function Badge({ variant = 'neutral', children }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${VARIANTS[variant]}`}>
      {children}
    </span>
  );
}
