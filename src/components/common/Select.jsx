import { ListFilter } from 'lucide-react';

export default function Select({ label, error, className = '', id, children, icon: Icon = ListFilter, required, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-dark">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center text-muted">
          <Icon size={16} />
        </span>
        <select
          id={id}
          required={required}
          className={`w-full rounded-lg border bg-white py-2.5 pl-10 pr-4 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/30 ${
            error ? 'border-red-400' : 'border-border'
          } ${className}`}
          {...props}
        >
          {children}
        </select>
      </div>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
