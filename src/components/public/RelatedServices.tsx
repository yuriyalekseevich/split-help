import { Link } from '@/i18n/navigation';
import type { CatalogService } from '@/lib/services/service-catalog.schema';
import { ServiceImage } from './ServiceImage';

const SERVICE_IMAGE_FALLBACK = '/placeholder-service.svg';

export function RelatedServices({ title, services }: { title: string; services: CatalogService[] }) {
  if (services.length === 0) return null;

  return (
    <section aria-labelledby="related-services-title" className="mt-10 rounded-3xl bg-sea-soft px-5 py-6 sm:px-6 sm:py-7">
      <h2 id="related-services-title" className="text-2xl text-ink sm:text-3xl">
        {title}
      </h2>
      <ul className="mt-5 grid gap-4 sm:grid-cols-2">
        {services.map((service) => (
          <li key={service.id} className="h-full">
            <Link
              href={`/service/${service.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-paper shadow-sm transition motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sea"
            >
              <ServiceImage
                src={service.imageUrl ?? SERVICE_IMAGE_FALLBACK}
                alt={service.title}
                className="aspect-[16/10] w-full"
              />
              <span className="flex flex-1 flex-col p-4">
                <h3 className="text-lg leading-snug break-words text-ink group-hover:text-sea">{service.title}</h3>
                {service.subtitle ? (
                  <p className="mt-1 text-sm leading-6 break-words text-muted">{service.subtitle}</p>
                ) : null}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
