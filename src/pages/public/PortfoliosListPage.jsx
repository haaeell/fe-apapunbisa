import { useEffect, useState } from 'react';
import { Search, Sparkles, Star } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { fetchPublicCategories } from '../../api/publicCategoryApi';
import { fetchPublicPortfolios } from '../../api/publicPortfolioApi';
import EmptyState from '../../components/common/EmptyState';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import Pagination from '../../components/common/Pagination';
import Seo from '../../components/common/Seo';
import PortfolioCard from '../../components/public/PortfolioCard';

export default function PortfoliosListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [meta, setMeta] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const search = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const featured = searchParams.get('featured') === '1';
  const page = Number(searchParams.get('page') || 1);

  useEffect(() => {
    fetchPublicCategories().then(({ data }) => setCategories(data));
  }, []);

  useEffect(() => {
    let isMounted = true;
    // Resetting the loading flag at the start of each fetch (React's documented data-fetching pattern).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);

    fetchPublicPortfolios({
      q: search || undefined,
      category: category || undefined,
      featured: featured ? 1 : undefined,
      page,
      per_page: 9,
    })
      .then(({ data, meta: responseMeta }) => {
        if (isMounted) {
          setPortfolios(data);
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
        title="Portofolio — Apapun Bisa"
        description="Lihat proyek dan pekerjaan yang telah diselesaikan oleh tim Apapun Bisa."
        path={`/portofolio${searchParams.toString() ? `?${searchParams.toString()}` : ''}`}
      />

      <section className="relative overflow-hidden bg-dark py-20 text-white sm:py-24">
        <div className="absolute inset-0 hero-grid-pattern opacity-40" />
        <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <span className="reveal-up mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
            <Sparkles size={16} />
            Portofolio
          </span>
          <h1 className="reveal-up reveal-delay-2 font-heading text-4xl font-extrabold leading-tight text-white sm:text-5xl">
            Proyek yang Telah Kami Kerjakan
          </h1>
          <p className="reveal-up reveal-delay-3 mx-auto mt-5 max-w-2xl text-base leading-8 text-white/75">
            Lihat hasil kerja nyata tim kami di berbagai bidang, dari teknologi hingga kreatif.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="reveal-up -mt-24 rounded-[1.75rem] border border-border bg-surface p-5 shadow-xl sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <form onSubmit={handleSearchSubmit} className="flex w-full max-w-md gap-2">
              <div className="relative w-full">
                <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  name="q"
                  defaultValue={search}
                  placeholder="Cari portofolio..."
                  className="w-full rounded-xl border border-border bg-background py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <button type="submit" className="shrink-0 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark">
                Cari
              </button>
            </form>

            <div className="flex flex-wrap gap-2">
              <select
                value={category}
                onChange={(event) => updateParam('category', event.target.value)}
                className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
              >
                <option value="">Semua Kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 text-sm font-medium text-dark">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(event) => updateParam('featured', event.target.checked ? '1' : '')}
                  className="accent-primary"
                />
                <Star size={14} className="text-accent" />
                Unggulan
              </label>
            </div>
          </div>
        </div>

        <div className="mt-10">
          {isLoading ? (
            <LoadingSkeleton rows={6} />
          ) : portfolios.length === 0 ? (
            <EmptyState title="Portofolio tidak ditemukan" description="Coba ubah kata kunci atau filter pencarian Anda." />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {portfolios.map((portfolio) => (
                <PortfolioCard key={portfolio.id} portfolio={portfolio} />
              ))}
            </div>
          )}
        </div>

        <Pagination meta={meta} onPageChange={handlePageChange} />
      </section>
    </>
  );
}
