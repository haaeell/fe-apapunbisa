import { useEffect, useState } from 'react';
import {
  Building2,
  CalendarDays,
  Clock3,
  ExternalLink,
  MapPin,
  Sparkles,
  Target,
  Trophy,
  Wrench,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { fetchPublicPortfolioBySlug } from '../../api/publicPortfolioApi';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import CtaBanner from '../../components/public/CtaBanner';
import Seo from '../../components/common/Seo';
import SectionHeading from '../../components/public/SectionHeading';
import TestimonialCard from '../../components/public/TestimonialCard';
import { formatDate } from '../../utils/format';
import { externalUrl } from '../../utils/url';
import NotFoundPage from './NotFoundPage';

const INFO_ICONS = { Klien: Building2, 'Tanggal Proyek': CalendarDays, Durasi: Clock3, Lokasi: MapPin };

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

      <section className="relative overflow-hidden bg-dark py-20 text-white sm:py-24">
        <div className="absolute inset-0 hero-grid-pattern opacity-40" />
        <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />

        <div className="reveal-up relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {portfolio.category && (
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
              <Sparkles size={16} />
              {portfolio.category.name}
            </span>
          )}
          <h1 className="mt-4 font-heading text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">{portfolio.title}</h1>
          {portfolio.summary && <p className="mt-3 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">{portfolio.summary}</p>}

          {infoItems.length > 0 && (
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {infoItems.map((item) => {
                const Icon = INFO_ICONS[item.label] || Building2;

                return (
                  <div key={item.label} className="rounded-xl border border-white/10 bg-white/[0.06] p-4">
                    <Icon size={16} className="text-accent" />
                    <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-white/50">{item.label}</p>
                    <p className="mt-1 text-sm font-medium text-white">{item.value}</p>
                  </div>
                );
              })}
            </div>
          )}

          {portfolio.website_url && (
            <a
              href={externalUrl(portfolio.website_url)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
            >
              Kunjungi Website
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      </section>

      <div className="mx-auto flex max-w-5xl flex-col gap-16 px-4 py-16 sm:px-6 lg:px-8">
        {portfolio.cover_image && (
          <img src={portfolio.cover_image} alt={portfolio.title} className="reveal-up -mt-20 w-full rounded-3xl object-cover shadow-xl" />
        )}

        {portfolio.description && (
          <section className="reveal-up">
            <h2 className="mb-4 font-heading text-2xl font-bold text-dark">Tentang Proyek</h2>
            <div className="prose prose-sm max-w-none text-muted" dangerouslySetInnerHTML={{ __html: portfolio.description }} />
          </section>
        )}

        {(portfolio.challenge || portfolio.solution || portfolio.result) && (
          <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {portfolio.challenge && (
              <div className="reveal-up rounded-2xl border border-border bg-surface p-6 shadow-sm">
                <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Target size={18} />
                </span>
                <h3 className="font-heading text-base font-semibold text-dark">Tantangan</h3>
                <div className="prose prose-sm mt-2 max-w-none text-muted" dangerouslySetInnerHTML={{ __html: portfolio.challenge }} />
              </div>
            )}
            {portfolio.solution && (
              <div className="reveal-up reveal-delay-2 rounded-2xl border border-border bg-surface p-6 shadow-sm">
                <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Wrench size={18} />
                </span>
                <h3 className="font-heading text-base font-semibold text-dark">Solusi</h3>
                <div className="prose prose-sm mt-2 max-w-none text-muted" dangerouslySetInnerHTML={{ __html: portfolio.solution }} />
              </div>
            )}
            {portfolio.result && (
              <div className="reveal-up reveal-delay-3 rounded-2xl border border-border bg-surface p-6 shadow-sm">
                <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Trophy size={18} />
                </span>
                <h3 className="font-heading text-base font-semibold text-dark">Hasil</h3>
                <div className="prose prose-sm mt-2 max-w-none text-muted" dangerouslySetInnerHTML={{ __html: portfolio.result }} />
              </div>
            )}
          </section>
        )}

        {galleries.length > 0 && (
          <section>
            <SectionHeading label="Dokumentasi" title="Galeri" align="left" />
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {galleries.map((item, index) => (
                <img key={index} src={item.image} alt={item.caption || portfolio.title} className="aspect-square w-full rounded-xl object-cover shadow-sm" />
              ))}
            </div>
          </section>
        )}

        {technologies.length > 0 && (
          <section>
            <SectionHeading label="Stack" title="Teknologi & Tools" align="left" />
            <div className="mt-6 flex flex-wrap gap-3">
              {technologies.map((tech) => (
                <span key={tech} className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-dark">
                  <Wrench size={14} className="text-primary" />
                  {tech}
                </span>
              ))}
            </div>
          </section>
        )}

        {services.length > 0 && (
          <section>
            <SectionHeading label="Terkait" title="Layanan Terkait" align="left" />
            <div className="mt-6 flex flex-wrap gap-3">
              {services.map((service) => (
                <Link
                  key={service.id}
                  to={`/layanan/${service.slug}`}
                  className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-dark transition-colors hover:border-primary hover:text-primary"
                >
                  {service.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        {testimonials.length > 0 && (
          <section>
            <SectionHeading title="Testimoni Klien" />
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
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
