import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchPublicArticleCategories } from '../../api/publicArticleCategoryApi';
import { fetchPublicArticles } from '../../api/publicArticleApi';
import EmptyState from '../../components/common/EmptyState';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import Pagination from '../../components/common/Pagination';
import ArticleCard from '../../components/public/ArticleCard';
import Seo from '../../components/common/Seo';
import SectionHeading from '../../components/public/SectionHeading';

export default function ArticlesListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [articles, setArticles] = useState([]);
  const [meta, setMeta] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const search = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const featured = searchParams.get('featured') === '1';
  const page = Number(searchParams.get('page') || 1);

  useEffect(() => {
    fetchPublicArticleCategories().then(({ data }) => setCategories(data));
  }, []);

  useEffect(() => {
    let isMounted = true;
    // Resetting the loading flag at the start of each fetch (React's documented data-fetching pattern).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);

    fetchPublicArticles({
      q: search || undefined,
      category: category || undefined,
      featured: featured ? 1 : undefined,
      page,
      per_page: 9,
    })
      .then(({ data, meta: responseMeta }) => {
        if (isMounted) {
          setArticles(data);
          setMeta(responseMeta);
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [search, category, featured, page]);

  function updateParam(key, value) {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    next.delete('page');
    setSearchParams(next);
  }

  function handleSearchSubmit(event) {
    event.preventDefault();
    updateParam('q', event.target.elements.q.value);
  }

  function handlePageChange(nextPage) {
    const next = new URLSearchParams(searchParams);
    next.set('page', nextPage);
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <>
      <Seo
        title="Artikel — Apapun Bisa"
        description="Tips, panduan, dan berita seputar layanan Apapun Bisa."
        path={`/artikel${searchParams.toString() ? `?${searchParams.toString()}` : ''}`}
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading label="Blog" title="Artikel & Panduan" align="left" />

        <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <form onSubmit={handleSearchSubmit} className="flex w-full max-w-md gap-2">
            <input
              name="q"
              defaultValue={search}
              placeholder="Cari artikel..."
              className="w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button type="submit" className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium hover:bg-background">
              Cari
            </button>
          </form>

          <div className="flex flex-wrap gap-2">
            <select
              value={category}
              onChange={(event) => updateParam('category', event.target.value)}
              className="rounded-lg border border-border px-3 py-2 text-sm"
            >
              <option value="">Semua Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>

            <label className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm">
              <input type="checkbox" checked={featured} onChange={(event) => updateParam('featured', event.target.checked ? '1' : '')} />
              Unggulan
            </label>
          </div>
        </div>

        <div className="mt-10">
          {isLoading ? (
            <LoadingSkeleton rows={6} />
          ) : articles.length === 0 ? (
            <EmptyState title="Artikel tidak ditemukan" description="Coba ubah kata kunci atau filter pencarian Anda." />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>

        <Pagination meta={meta} onPageChange={handlePageChange} />
      </section>
    </>
  );
}
