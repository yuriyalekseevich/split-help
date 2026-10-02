import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Link } from '@/i18n/navigation';
import { isLocale, pageMetadata } from '@/lib/i18n';
import { splitLines } from '@/lib/format';
import { serviceRepository } from '@/infrastructure/repositories';
import { ServiceImage } from '@/components/public/ServiceImage';
import { ServiceOrderForm } from '@/components/public/ServiceOrderForm';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const services = await serviceRepository.getAllVisible();
  return routing.locales.flatMap((locale) =>
    services.map((service) => ({
      locale,
      slug: service.slug,
    })),
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};

  const service = await serviceRepository.getBySlug(slug);
  if (!service || !service.visible) return {};

  return pageMetadata({
    locale,
    title: service.title[locale],
    description: service.shortDescription[locale],
    path: `/service/${service.slug}`,
    image: service.imageUrl,
  });
}

export default async function ServicePage({ params }: Props) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const service = await serviceRepository.getBySlug(slug);
  if (!service || !service.visible) {
    notFound();
  }

  const t = await getTranslations('service');
  const nav = await getTranslations('nav');
  const a11y = await getTranslations('a11y');
  const title = service.title[locale];
  const included = splitLines(service.included[locale]);
  const priceHint = service.priceHint?.[locale];

  return (
    <main id="content" className="mx-auto max-w-3xl px-5 py-8 sm:px-8 sm:py-12">
      <nav aria-label={a11y('breadcrumb')}>
        <ol className="flex flex-wrap items-center gap-2 text-sm text-muted">
          <li>
            <Link href="/" className="hover:text-sea">
              {nav('home')}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/#services" className="hover:text-sea">
              {nav('services')}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-ink">
            {title}
          </li>
        </ol>
      </nav>

      <ServiceImage
        src={service.imageUrl}
        alt={title}
        priority
        className="mt-6 aspect-[16/10] w-full rounded-3xl"
      />

      <h1 className="mt-6 font-serif text-4xl leading-tight text-ink sm:text-5xl">
        {title}
      </h1>

      <h2 className="mt-8 font-serif text-2xl text-ink">{t('included')}</h2>
      <ul className="mt-4 grid gap-3">
        {included.map((item) => (
          <li key={item} className="flex gap-3 text-base leading-6 text-ink">
            <span aria-hidden="true" className="mt-1 text-sea">
              ✓
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      {priceHint ? (
        <p className="mt-6 inline-flex rounded-full bg-sea-soft px-3 py-1 text-sm font-semibold text-sea">
          {priceHint}
        </p>
      ) : null}

      <ServiceOrderForm locale={locale} service={{ title: service.title }} />

      <p className="mt-8">
        <Link href="/" className="text-sm font-semibold text-sea hover:underline">
          ← {t('back')}
        </Link>
      </p>
    </main>
  );
}
