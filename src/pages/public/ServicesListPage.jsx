import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchPublicCategories } from '../../api/publicCategoryApi';
import { fetchPublicServices } from '../../api/publicServiceApi';
import EmptyState from '../../components/common/EmptyState';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import Pagination from '../../components/common/Pagination';
import Seo from '../../components/common/Seo';
import SectionHeading from '../../components/public/SectionHeading';
import ServiceCard from '../../components/public/ServiceCard';

export default function ServicesListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [meta, setMeta] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const search = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const featured = searchParams.get('featured') === '1';
  const sort = searchParams.get('sort') || '';
  const page = Number(searchParams.get('page') || 1);

  useEffect(() => {
    fetchPublicCategories().then(({ data }) => setCategories(data));
  }, []);

  useEffect(() => {
    let isMounted = true;
    // Resetting the loading flag at the start of each fetch (React's documented data-fetching pattern).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);

    fetchPublicServices({
      q: search || undefined,
      category: category || undefined,
      featured: featured ? 1 : undefined,
      sort: sort || undefined,
      page,
      per_page: 9,
    })
      .then(({ data, meta: responseMeta }) => {
        if (isMounted) {
          setServices(data);
          setMeta(responseMeta);
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [search, category, featured, sort, page]);

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
        title="Layanan — Apapun Bisa"
        description="Jelajahi seluruh katalog layanan Apapun Bisa, mulai dari teknologi, pendidikan, kreatif, hingga konsultasi bisnis."
        path={`/layanan${searchParams.toString() ? `?${searchParams.toString()}` : ''}`}
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading label="Katalog Layanan" title="Semua Layanan Apapun Bisa" align="left" />

        <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <form onSubmit={handleSearchSubmit} className="flex w-full max-w-md gap-2">
            <input
              name="q"
              defaultValue={search}
              placeholder="Cari layanan..."
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

            <select
              value={sort}
              onChange={(event) => updateParam('sort', event.target.value)}
              className="rounded-lg border border-border px-3 py-2 text-sm"
            >
              <option value="">Urutan Default</option>
              <option value="name">Nama A-Z</option>
              <option value="latest">Terbaru</option>
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
          ) : services.length === 0 ? (
            <EmptyState title="Layanan tidak ditemukan" description="Coba ubah kata kunci atau filter pencarian Anda." />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}
        </div>

        <Pagination meta={meta} onPageChange={handlePageChange} />
      </section>
    </>
  );
}
