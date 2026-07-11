import { ArrowUpRight, BadgeCheck, Layers3 } from 'lucide-react';
import { Link } from 'react-router-dom';

const ACCENTS = ['#2563eb', '#f59e0b', '#16a34a', '#0f172a'];

export default function ServiceCard({ service, index = 0 }) {
  const accent = ACCENTS[index % ACCENTS.length];

  return (
    <Link
      to={`/layanan/${service.slug}`}
      className="group relative flex min-h-full flex-col overflow-hidden rounded-[1.35rem] border border-border bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      style={{ '--service-accent': accent }}
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-[var(--service-accent)]" />
      <div className="relative h-40 w-full overflow-hidden bg-background">
        {service.cover_image ? (
          <img
            src={service.cover_image}
            alt={service.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-[linear-gradient(135deg,var(--service-accent),#e2e8f0)] text-5xl font-bold text-white/70">
            {service.name.charAt(0)}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-dark/55 via-dark/10 to-transparent opacity-70" />
        <span className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 text-dark shadow-sm">
          <Layers3 size={18} />
        </span>
        {service.is_featured && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-bold text-white">
            <BadgeCheck size={13} />
            Unggulan
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        {service.category && (
          <span className="w-fit rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-primary">
            {service.category.name}
          </span>
        )}
        <h3 className="font-heading text-lg font-bold leading-snug text-dark">{service.name}</h3>
        <p className="line-clamp-3 flex-1 text-sm leading-6 text-muted">{service.short_description}</p>
        <span className="mt-1 inline-flex items-center justify-between rounded-xl border border-border bg-background px-3 py-2 text-sm font-bold text-dark transition-colors group-hover:border-primary/30 group-hover:bg-primary group-hover:text-white">
          Lihat Detail
          <ArrowUpRight size={16} />
        </span>
      </div>
    </Link>
  );
}
