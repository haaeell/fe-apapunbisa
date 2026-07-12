import { useEffect, useState } from 'react';
import { CalendarDays, Share2, Sparkles, Tag, UserRound } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { fetchPublicArticleBySlug } from '../../api/publicArticleApi';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import ArticleCard from '../../components/public/ArticleCard';
import Seo from '../../components/common/Seo';
import { formatDate } from '../../utils/format';
import NotFoundPage from './NotFoundPage';

function shareUrl(platform, url, title) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  switch (platform) {
    case 'whatsapp':
      return `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    case 'twitter':
      return `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
    default:
      return '#';
  }
}

export default function ArticleDetailPage() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let isMounted = true;
    // Resetting the loading flag at the start of each fetch (React's documented data-fetching pattern).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    setNotFound(false);

    fetchPublicArticleBySlug(slug)
      .then(({ data }) => {
        if (isMounted) setArticle(data);
      })
      .catch((error) => {
        if (isMounted && error.response?.status === 404) setNotFound(true);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8">
        <LoadingSkeleton rows={8} />
      </div>
    );
  }

  if (notFound || !article) return <NotFoundPage />;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const relatedArticles = article.related_articles || [];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.meta_description || article.summary,
    image: article.thumbnail ? [article.thumbnail] : undefined,
    author: {
      '@type': 'Person',
      name: article.author || 'Apapun Bisa',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Apapun Bisa',
      logo: {
        '@type': 'ImageObject',
        url: 'https://apapunbisa.id/favicon.ico',
      },
    },
    datePublished: article.published_at,
    mainEntityOfPage: `https://apapunbisa.id/artikel/${article.slug}`,
  };

  return (
    <>
      <Seo
        title={article.meta_title || `${article.title} — Apapun Bisa`}
        description={article.meta_description || article.summary}
        keywords={article.meta_keywords}
        image={article.thumbnail}
        path={`/artikel/${article.slug}`}
        type="article"
        jsonLd={jsonLd}
      />

      <section className="relative overflow-hidden bg-dark py-20 text-white sm:py-24">
        <div className="absolute inset-0 hero-grid-pattern opacity-40" />
        <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />

        <div className="reveal-up relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {article.category && (
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
              <Sparkles size={16} />
              {article.category.name}
            </span>
          )}
          <h1 className="mt-4 font-heading text-3xl font-extrabold leading-tight text-white sm:text-4xl">{article.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/70">
            {article.author && (
              <span className="inline-flex items-center gap-1.5">
                <UserRound size={14} />
                {article.author}
              </span>
            )}
            {article.published_at && (
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays size={14} />
                {formatDate(article.published_at)}
              </span>
            )}
          </div>
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        {article.thumbnail && (
          <img src={article.thumbnail} alt={article.title} className="reveal-up -mt-20 w-full rounded-3xl object-cover shadow-xl" />
        )}

        <div className="prose prose-sm mt-10 max-w-none text-dark" dangerouslySetInnerHTML={{ __html: article.content }} />

        {article.tags?.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs font-medium text-muted">
                <Tag size={11} />
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-border pt-6">
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-dark">
            <Share2 size={15} />
            Bagikan:
          </span>
          {['whatsapp', 'facebook', 'twitter'].map((platform) => (
            <a
              key={platform}
              href={shareUrl(platform, currentUrl, article.title)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium capitalize text-dark transition-colors hover:border-primary hover:text-primary"
            >
              {platform}
            </a>
          ))}
        </div>
      </article>

      {relatedArticles.length > 0 && (
        <section className="bg-surface py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 font-heading text-2xl font-bold text-dark">Artikel Terkait</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {relatedArticles.map((related) => (
                <ArticleCard key={related.id} article={related} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
