import { ArrowUpRight, ExternalLink, FolderKanban } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PortfolioCard({ portfolio, featured = false }) {
  return (
    <Link
      to={`/portofolio/${portfolio.slug}`}
      className={`group relative flex min-h-full flex-col overflow-hidden rounded-[1.35rem] border border-border bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        featured ? 'sm:col-span-2 lg:col-span-2' : ''
      }`}
    >
      <div className={`${featured ? 'h-64' : 'h-48'} relative w-full overflow-hidden bg-background`}>
        {portfolio.cover_image ? (
          <img
            src={portfolio.cover_image}
            alt={portfolio.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 via-surface to-accent/20 text-5xl font-bold text-primary/25">
            {portfolio.title.charAt(0)}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/20 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
          <div>
            {portfolio.category && (
              <span className="mb-2 inline-flex rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-primary">
                {portfolio.category.name}
              </span>
            )}
            <h3 className="font-heading text-xl font-bold leading-tight text-white">{portfolio.title}</h3>
          </div>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-dark shadow-sm transition-colors group-hover:bg-accent group-hover:text-white">
            <ArrowUpRight size={18} />
          </span>
        </div>
        {portfolio.is_featured && (
          <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-bold text-white">
            <FolderKanban size={13} />
            Pilihan
          </span>
        )}
      </div>
      <div className="grid gap-3 p-5">
        {portfolio.client_name && <p className="text-sm font-semibold text-dark">{portfolio.client_name}</p>}
        <p className="line-clamp-2 text-sm leading-6 text-muted">
          {portfolio.short_description || portfolio.description || 'Lihat detail proyek dan hasil kerja yang sudah dibuat.'}
        </p>
        {portfolio.website_url && (
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">
            <ExternalLink size={13} />
            Ada link website
          </span>
        )}
      </div>
    </Link>
  );
}
