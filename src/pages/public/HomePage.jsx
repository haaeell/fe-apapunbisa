import { useEffect, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardCheck,
  Compass,
  Globe2,
  Layers3,
  MessageCircle,
  MousePointer2,
  PlayCircle,
  Route,
  Sparkles,
  Target,
  TimerReset,
  UsersRound,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchHome } from '../../api/homeApi';
import Button from '../../components/common/Button';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import Seo from '../../components/common/Seo';
import CategoryCard from '../../components/public/CategoryCard';
import CtaBanner from '../../components/public/CtaBanner';
import PortfolioCard from '../../components/public/PortfolioCard';
import SectionHeading from '../../components/public/SectionHeading';
import ServiceCard from '../../components/public/ServiceCard';
import StatBlock from '../../components/public/StatBlock';
import TestimonialCard from '../../components/public/TestimonialCard';

const WHY_ICONS = [BadgeCheck, Layers3, TimerReset, Compass, Target, Zap];
const PROCESS_ICONS = [MessageCircle, ClipboardCheck, Route, BriefcaseBusiness, CheckCircle2, Sparkles];

export default function HomePage() {
  const [home, setHome] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    fetchHome()
      .then(({ data }) => {
        if (isMounted) setHome(data);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <LoadingSkeleton rows={10} />
      </div>
    );
  }

  if (!home) return null;

  const {
    hero,
    categories,
    featured_services: featuredServices,
    about,
    why_us: whyUs,
    process,
    portfolios,
    statistics,
    testimonials,
    cta,
  } = home;

  const safeCategories = categories || [];
  const safeServices = featuredServices || [];
  const safePortfolios = portfolios || [];
  const categoryMidpoint = Math.ceil(safeCategories.length / 2);
  const topCategories = safeCategories.slice(0, categoryMidpoint);
  const bottomCategories = safeCategories.slice(categoryMidpoint).length
    ? safeCategories.slice(categoryMidpoint)
    : topCategories;
  const heroStats = [
    { label: 'Kategori Aktif', value: `${safeCategories.length}+`, icon: Layers3 },
    { label: 'Layanan Siap', value: `${safeServices.length}+`, icon: BriefcaseBusiness },
    { label: 'Karya Tayang', value: `${safePortfolios.length}+`, icon: Globe2 },
  ];

  return (
    <>
      <Seo
        title="Apapun Bisa — Semua Bisa Diatur"
        description="Apapun Bisa adalah platform penyedia berbagai layanan mulai dari pembuatan website, aplikasi, bimbingan belajar, konseling, videografi, hingga kebutuhan bisnis lainnya."
        image={hero?.image}
        path="/"
      />

      <section className="relative min-h-[calc(100vh-4.5rem)] overflow-hidden bg-dark text-white">
        {hero?.image && (
          <img src={hero.image} alt="Apapun Bisa" className="absolute inset-0 h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.96),rgba(15,23,42,0.74),rgba(15,23,42,0.42))]" />
        <div className="absolute inset-0 hero-grid-pattern opacity-45" />

        <div className="relative mx-auto grid min-h-[calc(100vh-4.5rem)] max-w-7xl grid-cols-1 items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr,0.95fr] lg:px-8">
          <div className="reveal-up">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              {hero?.items?.label && (
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
                  <Sparkles size={16} />
                  {hero.items.label}
                </span>
              )}
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/80">
                <MousePointer2 size={16} />
                Solusi digital, kreatif, dan bisnis
              </span>
            </div>

            <h1 className="max-w-4xl font-heading text-5xl font-extrabold leading-tight text-white sm:text-6xl lg:text-7xl">
              {hero?.title} <span className="text-accent">{hero?.subtitle}</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/78 sm:text-lg">{hero?.description}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              {hero?.button_text && (
                <Button as={Link} to={hero.button_url || '/konsultasi'} className="rounded-xl shadow-lg shadow-primary/20">
                  {hero.button_text}
                  <ArrowRight size={17} />
                </Button>
              )}
              {hero?.button_text_two && (
                <Button
                  as={Link}
                  to={hero.button_url_two || '/layanan'}
                  variant="secondary"
                  className="rounded-xl border-white/20 bg-white/10 text-white hover:bg-white/15"
                >
                  {hero.button_text_two}
                </Button>
              )}
            </div>

            {safeServices.length > 0 && (
              <div className="mt-8 flex max-w-4xl flex-wrap gap-2">
                {safeServices.slice(0, 5).map((service) => (
                  <Link
                    key={service.id}
                    to={`/layanan/${service.slug}`}
                    className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white/80 backdrop-blur transition-colors hover:bg-white hover:text-dark"
                  >
                    {service.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-3 px-4 py-4 sm:grid-cols-3 sm:px-6 lg:px-8">
          {[
            ['Konsultasi cepat', 'Ceritakan kebutuhan, kami bantu petakan solusi.', MessageCircle],
            ['Tim fleksibel', 'Setiap proyek ditangani sesuai bidangnya.', UsersRound],
            ['Proses jelas', 'Timeline, scope, dan output dibuat transparan.', ClipboardCheck],
          ].map(([title, description, Icon]) => (
            <div key={title} className="flex items-start gap-3 rounded-2xl border border-border bg-surface p-4 shadow-sm reveal-up">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon size={18} />
              </span>
              <div>
                <p className="font-heading text-sm font-bold text-dark">{title}</p>
                <p className="mt-1 text-sm text-muted">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {safeCategories.length > 0 && (
        <section className="overflow-hidden bg-surface py-12">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
            <SectionHeading
              title={home.categories_section?.title || 'Kategori Layanan Kami'}
              description={home.categories_section?.subtitle}
              align="left"
            />
            <div className="rounded-2xl border border-border bg-background px-4 py-3 text-sm font-semibold text-muted">
              2 arah slider, cari kategori yang paling cocok
            </div>
          </div>

          <div className="category-marquee mt-8 flex flex-col gap-4">
            <div className="category-marquee-track category-marquee-right">
              {[...topCategories, ...topCategories].map((category, index) => (
                <div key={`${category.id}-top-${index}`} className="w-[230px] shrink-0 sm:w-[260px]">
                  <CategoryCard category={category} />
                </div>
              ))}
            </div>
            <div className="category-marquee-track category-marquee-left">
              {[...bottomCategories, ...bottomCategories].map((category, index) => (
                <div key={`${category.id}-bottom-${index}`} className="w-[230px] shrink-0 sm:w-[260px]">
                  <CategoryCard category={category} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {safeServices.length > 0 && (
        <section className="service-ribbon-bg py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.85fr,1.6fr] lg:items-end">
              <SectionHeading
                title={home.featured_services_section?.title || 'Layanan Unggulan'}
                description={home.featured_services_section?.subtitle}
                align="left"
              />
              <div className="flex flex-wrap gap-2 lg:justify-end">
                {safeServices.slice(0, 4).map((service, index) => (
                  <span key={service.id} className="rounded-full border border-primary/15 bg-surface px-3 py-1.5 text-xs font-bold text-primary">
                    0{index + 1} {service.category?.name || 'Layanan'}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {safeServices.map((service, index) => (
                <ServiceCard key={service.id} service={service} index={index} />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Button as={Link} to="/layanan" variant="secondary">
                Lihat Semua Layanan
                <ArrowUpRight size={16} />
              </Button>
            </div>
          </div>
        </section>
      )}

      {about && (
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.05fr,0.95fr]">
            <div className="relative reveal-up">
              {about.image ? (
                <img src={about.image} alt={about.title} className="aspect-[4/3] w-full rounded-[2rem] object-cover shadow-xl" />
              ) : (
                <div className="aspect-[4/3] w-full rounded-[2rem] bg-gradient-to-br from-primary/10 via-surface to-accent/10" />
              )}
              <div className="absolute bottom-4 left-4 max-w-[280px] rounded-2xl border border-white/40 bg-white/90 p-4 shadow-lg backdrop-blur">
                <p className="text-xs font-bold uppercase tracking-wide text-primary">Cara kami bekerja</p>
                <p className="mt-1 text-sm font-semibold text-dark">Menyesuaikan tim, scope, dan paket dengan kebutuhan yang benar-benar terjadi.</p>
              </div>
            </div>
            <div className="flex flex-col items-start gap-4 text-left reveal-up reveal-delay-2">
              <SectionHeading label={about.subtitle} title={about.title} align="left" />
              <div
                className="prose prose-sm max-w-none text-muted"
                dangerouslySetInnerHTML={{ __html: about.description }}
              />
              <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
                {['Solusi lintas bidang', 'Pendampingan dari awal', 'Scope kerja transparan', 'Output siap dipakai'].map((item) => (
                  <div key={item} className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-sm font-semibold text-dark">
                    <CheckCircle2 size={16} className="text-success" />
                    {item}
                  </div>
                ))}
              </div>
              <Button as={Link} to="/tentang-kami" variant="secondary">
                Selengkapnya Tentang Kami
                <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </section>
      )}

      {whyUs?.items?.length > 0 && (
        <section className="bg-dark py-14 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.8fr,1.4fr]">
              <div className="reveal-up">
                <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/70">
                  <Zap size={16} />
                  Diferensiasi
                </p>
                <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl">{whyUs.title}</h2>
                {whyUs.subtitle && <p className="mt-4 text-sm leading-7 text-white/65">{whyUs.subtitle}</p>}
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {whyUs.items.map((item, index) => {
                  const Icon = WHY_ICONS[index % WHY_ICONS.length];

                  return (
                    <div key={item.title} className="group rounded-2xl border border-white/10 bg-white/[0.06] p-5 transition-colors hover:bg-white/[0.1] reveal-up">
                      <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-accent transition-transform group-hover:-translate-y-1">
                        <Icon size={21} />
                      </span>
                      <h3 className="font-heading text-base font-semibold text-white">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-white/60">{item.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {process?.items?.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.8fr,1.4fr]">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <SectionHeading title={process.title} description={process.subtitle} align="left" />
              <Button as={Link} to="/konsultasi" className="mt-5">
                Mulai Konsultasi
                <ArrowRight size={16} />
              </Button>
            </div>
            <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2">
              {process.items.map((item, index) => {
                const Icon = PROCESS_ICONS[index % PROCESS_ICONS.length];

                return (
                  <div key={item.title} className="process-card group rounded-2xl border border-border bg-surface p-5 shadow-sm reveal-up">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon size={21} />
                      </span>
                      <span className="font-heading text-3xl font-extrabold text-primary/15">0{index + 1}</span>
                    </div>
                    <h3 className="font-heading text-base font-semibold text-dark">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {safePortfolios.length > 0 && (
        <section className="bg-surface py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading
                title={home.portfolio_section?.title || 'Portofolio Pilihan'}
                description={home.portfolio_section?.subtitle}
                align="left"
              />
              <Button as={Link} to="/portofolio" variant="secondary">
                Lihat Semua Portofolio
                <ArrowUpRight size={16} />
              </Button>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {safePortfolios.map((portfolio, index) => (
                <PortfolioCard key={portfolio.id} portfolio={portfolio} featured={index === 0} />
              ))}
            </div>
          </div>
        </section>
      )}

      {statistics?.length > 0 && (
        <section className="stats-band py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title={home.statistics_section?.title || 'Apapun Bisa dalam Angka'}
              description={home.statistics_section?.subtitle}
            />
            <div className="mt-8">
              <StatBlock statistics={statistics} />
            </div>
          </div>
        </section>
      )}

      {testimonials?.length > 0 && (
        <section className="overflow-hidden bg-background py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title={home.testimonial_section?.title || 'Apa Kata Klien Kami'}
              description={home.testimonial_section?.subtitle}
            />
            <div className="testimonial-marquee mt-8">
              <div className="testimonial-marquee-track">
                {[...testimonials, ...testimonials].map((testimonial, index) => (
                  <div key={`${testimonial.id || testimonial.client_name}-${index}`} className="w-[300px] shrink-0 sm:w-[360px]">
                    <TestimonialCard testimonial={testimonial} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {cta && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <CtaBanner title={cta.title} subtitle={cta.subtitle} buttonText={cta.button_text} buttonUrl={cta.button_url} />
        </section>
      )}
    </>
  );
}
