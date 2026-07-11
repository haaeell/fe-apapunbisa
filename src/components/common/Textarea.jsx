import { AlignLeft } from 'lucide-react';

export default function Textarea({ label, error, className = '', id, rows = 4, icon: Icon = AlignLeft, required, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-dark">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-3 flex h-5 w-5 items-center justify-center text-muted">
          <Icon size={16} />
        </span>
        <textarea
          id={id}
          rows={rows}
          required={required}
          className={`w-full rounded-lg border py-2.5 pl-10 pr-4 text-sm text-dark placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 ${
            error ? 'border-red-400' : 'border-border'
          } ${className}`}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
