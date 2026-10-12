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
    <section id="services" className="md:scroll-mt-24 mx-auto max-w-6xl px-5 py-6 sm:px-8 sm:py-10">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sea">
        {t('eyebrow')}
      </p>
      <h2 className="mt-3 font-serif text-4xl text-ink">{t('title')}</h2>
      <AiSearchPlaceholder />
      {failed ? (
        <p className="mt-8 rounded-3xl border border-line bg-paper px-5 py-8 text-muted">{t('loadError')}</p>
      ) : services.length === 0 ? (
        <p className="mt-8 text-muted">{t('empty')}</p>
      ) : (
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <li key={service.id} className="h-full">
              <ServiceCard
                href={`/service/${service.slug}`}
                title={service.title}
                description={service.subtitle ?? ''}
                priceDescription={service.priceDescription}
                imageUrl={service.imageUrl ?? SERVICE_IMAGE_FALLBACK}
              />
            </li>
          ))}
        </ul>
      )}
      <p className="mt-8 max-w-2xl text-base leading-7 text-muted">{t('missing')}</p>
    </section>
  );
}
