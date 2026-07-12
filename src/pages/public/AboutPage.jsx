import { useEffect, useState } from 'react';
import {
  Award,
  ArrowRight,
  BadgeCheck,
  Compass,
  HeartHandshake,
  Layers3,
  Quote,
  Shield,
  ShieldCheck,
  Sparkles,
  Target,
  UsersRound,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchPublicPage } from '../../api/publicPageApi';
import Button from '../../components/common/Button';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import CtaBanner from '../../components/public/CtaBanner';
import Seo from '../../components/common/Seo';
import SectionHeading from '../../components/public/SectionHeading';
import StatBlock from '../../components/public/StatBlock';

const VALUE_ICONS = [ShieldCheck, Award, HeartHandshake, Zap];
const ADVANTAGE_ICONS = [Layers3, UsersRound, BadgeCheck];

export default function AboutPage() {
  const [page, setPage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    fetchPublicPage('tentang-kami')
      .then(({ data }) => {
        if (isMounted) setPage(data);
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
      <div className="mx-auto max-w-5xl px-4 py-24 sm:px-6 lg:px-8">
        <LoadingSkeleton rows={8} />
      </div>
    );
  }

  if (!page) return null;

  const { sections, statistics, teams } = page;
  const { hero, story, vision, mission, values, advantages, cta } = sections;

  return (
    <>
      <Seo
        title="Tentang Kami — Apapun Bisa"
        description={hero?.description}
        image={hero?.image}
        path="/tentang-kami"
      />

      {hero && (
        <section className="relative overflow-hidden bg-dark py-24 text-white sm:py-28">
          <div className="absolute inset-0 hero-grid-pattern opacity-40" />
          <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
          <div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />

          <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            {hero.subtitle && (
              <span className="reveal-up mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
                <Sparkles size={16} />
                {hero.subtitle}
              </span>
            )}
            <h1 className="reveal-up reveal-delay-2 font-heading text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
              {hero.title}
            </h1>
            {hero.description && (
              <p className="reveal-up reveal-delay-3 mx-auto mt-5 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">
                {hero.description}
              </p>
            )}
            <div className="reveal-up reveal-delay-3 mt-9 flex flex-wrap items-center justify-center gap-3">
              <Button as={Link} to="/konsultasi" className="rounded-xl shadow-lg shadow-primary/20">
                Konsultasikan Kebutuhan
                <ArrowRight size={17} />
              </Button>
              <Button
                as={Link}
                to="/layanan"
                variant="secondary"
                className="rounded-xl border-white/20 bg-white/10 text-white hover:bg-white/15"
              >
                Lihat Layanan Kami
              </Button>
            </div>
          </div>
        </section>
      )}

      {story && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[0.85fr,1.15fr]">
            <div className="reveal-up relative">
              {story.image ? (
                <img
                  src={story.image}
                  alt={story.title}
                  className="aspect-[4/3] max-h-[420px] w-full rounded-[2rem] object-cover shadow-xl sm:aspect-[4/5]"
                />
              ) : (
                <div className="relative flex aspect-[4/3] max-h-[420px] w-full flex-col justify-between overflow-hidden rounded-[2rem] bg-gradient-to-br from-dark via-primary/90 to-accent/70 p-8 text-white shadow-xl sm:aspect-[4/5]">
                  <Quote size={40} className="text-white/60" />
                  <p className="font-heading text-xl font-semibold leading-snug text-white/90">
                    Satu pintu, berbagai solusi — dari teknologi hingga kebutuhan bisnis sehari-hari.
                  </p>
                </div>
              )}
              <div className="absolute -bottom-6 -right-4 max-w-[260px] rounded-2xl border border-border bg-surface p-4 shadow-lg sm:-right-6">
                <p className="text-xs font-bold uppercase tracking-wide text-primary">Sejak awal</p>
                <p className="mt-1 text-sm font-semibold text-dark">
                  Membantu individu, UMKM, hingga institusi menyelesaikan kebutuhan mereka.
                </p>
              </div>
            </div>

            <div className="reveal-up reveal-delay-2 flex flex-col gap-4">
              <SectionHeading label="Cerita Kami" title={story.title} align="left" />
              <div
                className="prose prose-sm max-w-none text-muted"
                dangerouslySetInnerHTML={{ __html: story.description }}
              />
            </div>
          </div>
        </section>
      )}

      {(vision || mission) && (
        <section className="bg-surface py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {vision && (
                <div className="reveal-up group relative overflow-hidden rounded-[1.75rem] border border-border bg-background p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                  <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <Target size={22} />
                  </span>
                  <h3 className="font-heading text-xl font-bold text-dark">{vision.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted">{vision.description}</p>
                </div>
              )}
              {mission && (
                <div className="reveal-up reveal-delay-2 group relative overflow-hidden rounded-[1.75rem] border border-border bg-background p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                  <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                    <Compass size={22} />
                  </span>
                  <h3 className="font-heading text-xl font-bold text-dark">{mission.title}</h3>
                  <ul className="mt-4 flex flex-col gap-3">
                    {(mission.items || []).map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm leading-6 text-muted">
                        <ShieldCheck size={16} className="mt-0.5 shrink-0 text-accent" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {values?.items?.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading label="Prinsip Kerja" title={values.title} />
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.items.map((item, index) => {
              const Icon = VALUE_ICONS[index % VALUE_ICONS.length];

              return (
                <div
                  key={item.title}
                  className="reveal-up group rounded-2xl border border-border bg-surface p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:-translate-y-1">
                    <Icon size={20} />
                  </span>
                  <h4 className="font-heading text-base font-semibold text-dark">{item.title}</h4>
                  <p className="mt-2 text-sm leading-6 text-muted">{item.description}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {advantages?.items?.length > 0 && (
        <section className="bg-dark py-16 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.8fr,1.4fr]">
              <div className="reveal-up">
                <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/70">
                  <Shield size={16} />
                  Kenapa Kami
                </p>
                <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl">{advantages.title}</h2>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {advantages.items.map((item, index) => {
                  const Icon = ADVANTAGE_ICONS[index % ADVANTAGE_ICONS.length];

                  return (
                    <div
                      key={item.title}
                      className="group rounded-2xl border border-white/10 bg-white/[0.06] p-5 transition-colors hover:bg-white/[0.1] reveal-up"
                    >
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

      {statistics?.length > 0 && (
        <section className="stats-band py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <SectionHeading title="Apapun Bisa dalam Angka" />
            <div className="mt-8">
              <StatBlock statistics={statistics} />
            </div>
          </div>
        </section>
      )}

      {teams?.length > 0 && (
        <section className="bg-surface py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading title="Tim Kami" description="Orang-orang di balik layanan Apapun Bisa." />
            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {teams.map((member) => (
                <div
                  key={member.id}
                  className="reveal-up group rounded-2xl border border-border bg-background p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative mx-auto mb-4 h-24 w-24">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-accent opacity-0 blur transition-opacity group-hover:opacity-40" />
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="relative h-24 w-24 rounded-full border-4 border-surface object-cover shadow-md"
                      />
                    ) : (
                      <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-4 border-surface bg-primary/10 text-2xl font-bold text-primary shadow-md">
                        {member.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <p className="font-heading text-sm font-semibold text-dark">{member.name}</p>
                  <p className="mt-0.5 text-xs font-medium text-primary">{member.position}</p>
                  {member.description && (
                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted">{member.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {cta && (
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <CtaBanner title={cta.title} subtitle={cta.subtitle} buttonText={cta.button_text} buttonUrl={cta.button_url} />
        </section>
      )}
    </>
  );
}
