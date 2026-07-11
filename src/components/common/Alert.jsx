const VARIANTS = {
  info: 'bg-primary/5 text-primary border-primary/20',
  success: 'bg-success/5 text-success border-success/20',
  warning: 'bg-accent/5 text-accent border-accent/20',
  danger: 'bg-red-50 text-red-600 border-red-200',
};

export default function Alert({ variant = 'info', children }) {
  return <div className={`rounded-lg border px-4 py-3 text-sm ${VARIANTS[variant]}`}>{children}</div>;
}
