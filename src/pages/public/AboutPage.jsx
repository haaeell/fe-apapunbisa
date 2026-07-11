import { useEffect, useState } from 'react';
import { fetchPublicPage } from '../../api/publicPageApi';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import CtaBanner from '../../components/public/CtaBanner';
import Seo from '../../components/common/Seo';
import SectionHeading from '../../components/public/SectionHeading';
import StatBlock from '../../components/public/StatBlock';

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
        <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <SectionHeading label={hero.subtitle} title={hero.title} description={hero.description} />
        </section>
      )}

      {story && (
        <section className="bg-surface py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-6 text-center font-heading text-2xl font-bold text-dark">{story.title}</h2>
            <div
              className="prose prose-sm mx-auto max-w-none text-muted"
              dangerouslySetInnerHTML={{ __html: story.description }}
            />
          </div>
        </section>
      )}

      {(vision || mission) && (
        <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {vision && (
              <div className="rounded-2xl border border-border bg-surface p-8">
                <h3 className="font-heading text-xl font-bold text-primary">{vision.title}</h3>
                <p className="mt-3 text-muted">{vision.description}</p>
              </div>
            )}
            {mission && (
              <div className="rounded-2xl border border-border bg-surface p-8">
                <h3 className="font-heading text-xl font-bold text-primary">{mission.title}</h3>
                <ul className="mt-3 flex flex-col gap-2">
                  {(mission.items || []).map((item) => (
                    <li key={item} className="flex gap-2 text-sm text-muted">
                      <span className="text-primary">&#10003;</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {values?.items?.length > 0 && (
        <section className="bg-surface py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <SectionHeading title={values.title} />
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {values.items.map((item) => (
                <div key={item.title} className="rounded-2xl border border-border bg-background p-6">
                  <h4 className="font-heading text-base font-semibold text-dark">{item.title}</h4>
                  <p className="mt-2 text-sm text-muted">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {advantages?.items?.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading title={advantages.title} />
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {advantages.items.map((item) => (
              <div key={item.title} className="rounded-2xl border border-border bg-surface p-6 text-center">
                <h4 className="font-heading text-base font-semibold text-dark">{item.title}</h4>
                <p className="mt-2 text-sm text-muted">{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {statistics?.length > 0 && (
        <section className="bg-surface py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <StatBlock statistics={statistics} />
          </div>
        </section>
      )}

      {teams?.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading title="Tim Kami" description="Orang-orang di balik layanan Apapun Bisa." />
          <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {teams.map((member) => (
              <div key={member.id} className="flex flex-col items-center gap-3 text-center">
                {member.photo ? (
                  <img src={member.photo} alt={member.name} className="h-24 w-24 rounded-full object-cover" />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                    {member.name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-heading text-sm font-semibold text-dark">{member.name}</p>
                  <p className="text-xs text-muted">{member.position}</p>
                </div>
              </div>
            ))}
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
