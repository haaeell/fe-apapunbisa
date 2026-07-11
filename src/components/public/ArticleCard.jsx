import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/format';

export default function ArticleCard({ article }) {
  return (
    <Link
      to={`/artikel/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative h-44 w-full overflow-hidden bg-background">
        {article.thumbnail ? (
          <img
            src={article.thumbnail}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl font-bold text-primary/20">
            {article.title.charAt(0)}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-center gap-2 text-xs text-muted">
          {article.category && <span className="font-semibold uppercase tracking-wide text-primary">{article.category.name}</span>}
          {article.published_at && <span>&middot; {formatDate(article.published_at)}</span>}
        </div>
        <h3 className="line-clamp-2 font-heading text-lg font-semibold text-dark">{article.title}</h3>
        <p className="line-clamp-2 flex-1 text-sm text-muted">{article.summary}</p>
      </div>
    </Link>
  );
}
