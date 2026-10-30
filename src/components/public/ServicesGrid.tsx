import type { CatalogService } from '@/lib/services/service-catalog.schema';
import { getTranslations } from 'next-intl/server';
import { AiSearchPlaceholder } from './AiSearchPlaceholder';
import { ServiceCard } from './ServiceCard';

const SERVICE_IMAGE_FALLBACK = '/placeholder-service.svg';

export async function ServicesGrid({
  services,
  failed,
}: {
  services: CatalogService[];
  failed: boolean;
}) {
  const t = await getTranslations('services');

  return (
    <section id="services" className="reveal md:scroll-mt-24 mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
      <p className="text-sm font-semibold tracking-[0.16em] text-sea uppercase">
        {t('eyebrow')}
      </p>
      <h2 className="mt-3 max-w-xl text-4xl text-ink sm:text-5xl">{t('title')}</h2>
      <AiSearchPlaceholder />
      {failed ? (
        <p className="mt-10 rounded-3xl border border-line px-5 py-8 text-muted">{t('loadError')}</p>
      ) : services.length === 0 ? (
        <p className="mt-10 text-muted">{t('empty')}</p>
      ) : (
        <ul className="mt-14 flex flex-col gap-16 sm:gap-20">
          {services.map((service, index) => (
            <li key={service.id}>
              <ServiceCard
                href={`/service/${service.slug}`}
                title={service.title}
                slug={service.slug}
                description={service.subtitle ?? ''}
                moreLabel={t('more')}
                priceDescription={service.priceDescription}
                imageUrl={service.imageUrl ?? SERVICE_IMAGE_FALLBACK}
                reverse={index % 2 === 1}
              />
            </li>
          ))}
        </ul>
      )}
      <p className="mt-16 max-w-2xl text-base leading-7 text-muted">{t('missing')}</p>
    </section>
  );
}
