import {
  Calendar,
  FileUp,
  Hash,
  Link as LinkIcon,
  Mail,
  Palette,
  Phone,
  Search,
  TextCursorInput,
} from 'lucide-react';

function iconForInput({ type, name = '', placeholder = '' }) {
  const key = `${name} ${placeholder}`.toLowerCase();
  if (type === 'file') return <FileUp size={16} />;
  if (type === 'date') return <Calendar size={16} />;
  if (type === 'number') return <Hash size={16} />;
  if (type === 'color') return <Palette size={16} />;
  if (type === 'email' || key.includes('email')) return <Mail size={16} />;
  if (type === 'url' || key.includes('url') || key.includes('website') || key.includes('maps')) return <LinkIcon size={16} />;
  if (key.includes('phone') || key.includes('telepon') || key.includes('whatsapp')) return <Phone size={16} />;
  if (key.includes('cari') || key.includes('search')) return <Search size={16} />;
  return <TextCursorInput size={16} />;
}

export default function Input({ label, error, className = '', id, icon: IconProp, required, type = 'text', ...props }) {
  const icon = IconProp ? <IconProp size={16} /> : iconForInput({ type, name: props.name, placeholder: props.placeholder });
  const isColor = type === 'color';

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
          {icon}
        </span>
        <input
          id={id}
          type={type}
          required={required}
          className={`w-full rounded-lg border py-2.5 pl-10 pr-4 text-sm text-dark placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 ${
            error ? 'border-red-400' : 'border-border'
          } ${className} ${isColor ? 'h-11 py-1 pl-10 pr-2' : ''}`}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
