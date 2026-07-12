import { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, Layers3, Sparkles, Users2, Wrench } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { fetchPublicServiceBySlug } from '../../api/publicServiceApi';
import Button from '../../components/common/Button';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import Seo from '../../components/common/Seo';
import CtaBanner from '../../components/public/CtaBanner';
import FaqAccordion from '../../components/public/FaqAccordion';
import PortfolioCard from '../../components/public/PortfolioCard';
import SectionHeading from '../../components/public/SectionHeading';
import TestimonialCard from '../../components/public/TestimonialCard';
import NotFoundPage from './NotFoundPage';
import { packagePriceLabel } from '../../utils/format';

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let isMounted = true;
    // Resetting the loading flag at the start of each fetch (React's documented data-fetching pattern).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    setNotFound(false);

    fetchPublicServiceBySlug(slug)
      .then(({ data }) => {
        if (isMounted) setService(data);
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

  if (notFound || !service) return <NotFoundPage />;

  const { sections = {}, features = [], targets = [], processes = [], packages = [], galleries = [], faqs = [], testimonials = [], portfolios = [] } = service;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.meta_description || service.short_description,
    image: service.cover_image,
    provider: {
      '@type': 'Organization',
      name: 'Apapun Bisa',
      url: 'https://apapunbisa.id',
    },
    areaServed: 'Indonesia',
    serviceType: service.category?.name || service.name,
    url: `https://apapunbisa.id/layanan/${service.slug}`,
  };

  return (
    <>
      <Seo
        title={service.meta_title || `${service.name} — Apapun Bisa`}
        description={service.meta_description || service.short_description}
        keywords={service.meta_keywords}
        image={service.cover_image}
        path={`/layanan/${service.slug}`}
        type="article"
        jsonLd={jsonLd}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-dark py-20 text-white sm:py-24">
        <div className="absolute inset-0 hero-grid-pattern opacity-40" />
        <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="reveal-up flex flex-col items-start gap-4 text-left">
            {service.category && (
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
                <Sparkles size={16} />
                {service.category.name}
              </span>
            )}
            <h1 className="font-heading text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">{service.name}</h1>
            <p className="text-base leading-7 text-white/75 sm:text-lg">{service.short_description}</p>
            <div className="flex flex-wrap gap-3">
              <Button as={Link} to="/konsultasi" className="rounded-xl shadow-lg shadow-primary/20">
                Konsultasi Sekarang
                <ArrowRight size={17} />
              </Button>
              <Button
                as="a"
                href="#paket-layanan"
                variant="secondary"
                className="rounded-xl border-white/20 bg-white/10 text-white hover:bg-white/15"
              >
                Lihat Paket
              </Button>
            </div>
          </div>
          <div className="reveal-up reveal-delay-2">
            {service.cover_image ? (
              <img src={service.cover_image} alt={service.name} className="aspect-[4/3] w-full rounded-[2rem] object-cover shadow-xl" />
            ) : (
              <div className="flex aspect-[4/3] w-full items-center justify-center rounded-[2rem] bg-gradient-to-br from-white/10 to-accent/10">
                <Layers3 size={48} className="text-white/40" />
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto flex max-w-5xl flex-col gap-16 px-4 py-16 sm:px-6 lg:px-8">
        {/* About */}
        {(sections.about?.content || service.description) && (
          <section className="reveal-up">
            <h2 className="mb-4 font-heading text-2xl font-bold text-dark">{sections.about?.title || 'Tentang Layanan'}</h2>
            <div
              className="prose prose-sm max-w-none text-muted"
              dangerouslySetInnerHTML={{ __html: sections.about?.content || service.description }}
            />
          </section>
        )}

        {/* Problem & Solution */}
        {(sections.problem?.content || sections.solution?.content) && (
          <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {sections.problem?.content && (
              <div className="reveal-up rounded-2xl border border-border bg-surface p-6 shadow-sm">
                <h3 className="font-heading text-lg font-semibold text-dark">{sections.problem.title}</h3>
                <div className="prose prose-sm mt-3 max-w-none text-muted" dangerouslySetInnerHTML={{ __html: sections.problem.content }} />
              </div>
            )}
            {sections.solution?.content && (
              <div className="reveal-up reveal-delay-2 rounded-2xl border border-border bg-surface p-6 shadow-sm">
                <h3 className="font-heading text-lg font-semibold text-dark">{sections.solution.title}</h3>
                <div className="prose prose-sm mt-3 max-w-none text-muted" dangerouslySetInnerHTML={{ __html: sections.solution.content }} />
              </div>
            )}
          </section>
        )}

        {/* Features */}
        {features.length > 0 && (
          <section>
            <SectionHeading label="Cakupan Layanan" title="Apa Saja yang Anda Dapatkan" align="left" />
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {features.map((feature) => (
                <div key={feature.id} className="reveal-up flex items-start gap-3 rounded-xl border border-border bg-surface p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <CheckCircle2 size={16} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-dark">{feature.title}</p>
                    {feature.description && <p className="mt-1 text-sm text-muted">{feature.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Targets */}
        {targets.length > 0 && (
          <section>
            <SectionHeading label="Cocok Untuk" title="Siapa yang Cocok Menggunakan Layanan Ini?" align="left" />
            <div className="mt-6 flex flex-wrap gap-3">
              {targets.map((target) => (
                <span key={target.id} className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-dark">
                  <Users2 size={14} className="text-primary" />
                  {target.title}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Process */}
        {processes.length > 0 && (
          <section>
            <SectionHeading label="Alur Kerja" title="Proses Pengerjaan" align="left" />
            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
              {processes.map((step) => (
                <div key={step.id} className="reveal-up relative flex flex-col gap-2 pl-14">
                  <span className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-primary font-heading text-lg font-bold text-white shadow-lg shadow-primary/20">
                    {step.step_number}
                  </span>
                  <h3 className="font-heading text-base font-semibold text-dark">{step.title}</h3>
                  {step.description && <p className="text-sm text-muted">{step.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Packages */}
        {packages.length > 0 && (
          <section id="paket-layanan">
            <SectionHeading label="Investasi" title="Paket Layanan" align="left" />
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`reveal-up flex flex-col gap-4 rounded-2xl border p-6 transition-all hover:-translate-y-1 ${
                    pkg.is_recommended ? 'border-primary shadow-xl ring-2 ring-primary/20' : 'border-border bg-surface shadow-sm hover:shadow-lg'
                  }`}
                >
                  {pkg.is_recommended && (
                    <span className="inline-flex w-fit items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                      <Sparkles size={12} />
                      Rekomendasi
                    </span>
                  )}
                  <h3 className="font-heading text-lg font-bold text-dark">{pkg.name}</h3>
                  <p className="font-heading text-xl font-extrabold text-primary">{packagePriceLabel(pkg)}</p>
                  {pkg.description && <p className="text-sm text-muted">{pkg.description}</p>}
                  <ul className="flex flex-col gap-2 text-sm text-dark">
                    {(pkg.items || []).map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Button as={Link} to="/konsultasi" variant={pkg.is_recommended ? 'primary' : 'secondary'} className="mt-auto justify-center rounded-xl">
                    Konsultasi Paket Ini
                  </Button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Gallery */}
        {galleries.length > 0 && (
          <section>
            <SectionHeading label="Dokumentasi" title="Galeri" align="left" />
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {galleries.map((item, index) => (
                <img key={index} src={item.image} alt={item.caption || service.name} className="aspect-square w-full rounded-xl object-cover shadow-sm" />
              ))}
            </div>
          </section>
        )}

        {/* Technology */}
        {sections.technology?.items?.length > 0 && (
          <section>
            <SectionHeading label="Teknologi" title={sections.technology.title || 'Teknologi yang Digunakan'} align="left" />
            <div className="mt-6 flex flex-wrap gap-3">
              {sections.technology.items.map((tech) => (
                <span key={tech.name} className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-dark">
                  <Wrench size={14} className="text-primary" />
                  {tech.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Related Portfolios */}
        {portfolios.length > 0 && (
          <section>
            <SectionHeading label="Bukti Kerja" title="Portofolio Terkait" align="left" />
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {portfolios.map((portfolio) => (
                <PortfolioCard key={portfolio.id} portfolio={portfolio} />
              ))}
            </div>
          </section>
        )}

        {/* FAQ */}
        {faqs.length > 0 && (
          <section>
            <SectionHeading label="FAQ" title="Pertanyaan Umum" align="left" />
            <div className="mt-8">
              <FaqAccordion faqs={faqs} />
            </div>
          </section>
        )}

        {/* Testimonials */}
        {testimonials.length > 0 && (
          <section>
            <SectionHeading title="Apa Kata Klien Kami" />
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {testimonials.map((testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <CtaBanner
          title={sections.cta?.title || `Siap Menggunakan Layanan ${service.name}?`}
          subtitle={sections.cta?.subtitle || 'Konsultasikan kebutuhan Anda, gratis tanpa komitmen.'}
        />
      </div>
    </>
  );
}
