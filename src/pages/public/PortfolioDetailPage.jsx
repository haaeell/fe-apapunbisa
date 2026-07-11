import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchPublicPortfolioBySlug } from '../../api/publicPortfolioApi';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import CtaBanner from '../../components/public/CtaBanner';
import Seo from '../../components/common/Seo';
import TestimonialCard from '../../components/public/TestimonialCard';
import { formatDate } from '../../utils/format';
import { externalUrl } from '../../utils/url';
import NotFoundPage from './NotFoundPage';

export default function PortfolioDetailPage() {
  const { slug } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let isMounted = true;
    // Resetting the loading flag at the start of each fetch (React's documented data-fetching pattern).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    setNotFound(false);

    fetchPublicPortfolioBySlug(slug)
      .then(({ data }) => {
        if (isMounted) setPortfolio(data);
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
      <div className="mx-auto max-w-5xl px-4 py-24 sm:px-6 lg:px-8">
        <LoadingSkeleton rows={10} />
      </div>
    );
  }

  if (notFound || !portfolio) return <NotFoundPage />;

  const { galleries = [], services = [], testimonials = [], technologies = [] } = portfolio;

  const infoItems = [
    { label: 'Klien', value: portfolio.client_name },
    { label: 'Tanggal Proyek', value: portfolio.project_date ? formatDate(portfolio.project_date) : null },
    { label: 'Durasi', value: portfolio.duration },
    { label: 'Lokasi', value: portfolio.location },
  ].filter((item) => item.value);

  return (
    <>
      <Seo
        title={portfolio.meta_title || `${portfolio.title} — Portofolio Apapun Bisa`}
        description={portfolio.meta_description || portfolio.summary}
        image={portfolio.cover_image}
        path={`/portofolio/${portfolio.slug}`}
      />

      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          {portfolio.category && (
            <span className="rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
              {portfolio.category.name}
            </span>
          )}
          <h1 className="mt-4 font-heading text-3xl font-bold text-dark sm:text-4xl">{portfolio.title}</h1>
          {portfolio.summary && <p className="mt-3 max-w-2xl text-lg text-muted">{portfolio.summary}</p>}

          {infoItems.length > 0 && (
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {infoItems.map((item) => (
                <div key={item.label}>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">{item.label}</p>
                  <p className="mt-1 text-sm font-medium text-dark">{item.value}</p>
                </div>
              ))}
            </div>
          )}

          {portfolio.website_url && (
            <a
              href={externalUrl(portfolio.website_url)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              Kunjungi Website &rarr;
            </a>
          )}
        </div>
      </section>

      <div className="mx-auto flex max-w-5xl flex-col gap-16 px-4 py-16 sm:px-6 lg:px-8">
        {portfolio.cover_image && (
          <img src={portfolio.cover_image} alt={portfolio.title} className="w-full rounded-3xl object-cover shadow-lg" />
        )}

        {portfolio.description && (
          <section>
            <h2 className="mb-4 font-heading text-2xl font-bold text-dark">Tentang Proyek</h2>
            <div className="prose prose-sm max-w-none text-muted" dangerouslySetInnerHTML={{ __html: portfolio.description }} />
          </section>
        )}

        {(portfolio.challenge || portfolio.solution || portfolio.result) && (
          <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {portfolio.challenge && (
              <div className="rounded-2xl border border-border bg-surface p-6">
                <h3 className="font-heading text-base font-semibold text-dark">Tantangan</h3>
                <div className="prose prose-sm mt-2 max-w-none text-muted" dangerouslySetInnerHTML={{ __html: portfolio.challenge }} />
              </div>
            )}
            {portfolio.solution && (
              <div className="rounded-2xl border border-border bg-surface p-6">
                <h3 className="font-heading text-base font-semibold text-dark">Solusi</h3>
                <div className="prose prose-sm mt-2 max-w-none text-muted" dangerouslySetInnerHTML={{ __html: portfolio.solution }} />
              </div>
            )}
            {portfolio.result && (
              <div className="rounded-2xl border border-border bg-surface p-6">
                <h3 className="font-heading text-base font-semibold text-dark">Hasil</h3>
                <div className="prose prose-sm mt-2 max-w-none text-muted" dangerouslySetInnerHTML={{ __html: portfolio.result }} />
              </div>
            )}
          </section>
        )}

        {galleries.length > 0 && (
          <section>
            <h2 className="mb-6 font-heading text-2xl font-bold text-dark">Galeri</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {galleries.map((item, index) => (
                <img key={index} src={item.image} alt={item.caption || portfolio.title} className="aspect-square w-full rounded-xl object-cover" />
              ))}
            </div>
          </section>
        )}

        {technologies.length > 0 && (
          <section>
            <h2 className="mb-6 font-heading text-2xl font-bold text-dark">Teknologi & Tools</h2>
            <div className="flex flex-wrap gap-3">
              {technologies.map((tech) => (
                <span key={tech} className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-dark">
                  {tech}
                </span>
              ))}
            </div>
          </section>
        )}

        {services.length > 0 && (
          <section>
            <h2 className="mb-6 font-heading text-2xl font-bold text-dark">Layanan Terkait</h2>
            <div className="flex flex-wrap gap-3">
              {services.map((service) => (
                <Link
                  key={service.id}
                  to={`/layanan/${service.slug}`}
                  className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-dark hover:border-primary hover:text-primary"
                >
                  {service.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        {testimonials.length > 0 && (
          <section>
            <h2 className="mb-6 font-heading text-2xl font-bold text-dark">Testimoni Klien</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard key={index} testimonial={testimonial} />
              ))}
            </div>
          </section>
        )}

        <CtaBanner
          title="Tertarik dengan Hasil Serupa?"
          subtitle="Ceritakan kebutuhan Anda, kami bantu wujudkan proyek Anda berikutnya."
        />
      </div>
    </>
  );
}
