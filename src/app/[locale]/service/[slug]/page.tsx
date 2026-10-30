import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Link } from '@/i18n/navigation';
import { isLocale, pageMetadata } from '@/lib/i18n';
import { splitLines } from '@/lib/format';
import { gallerySlides } from '@/lib/services/gallery-images.schema';
import { listServiceImages } from '@/lib/services/gallery-images.server';
import { getCatalogServiceBySlug } from '@/lib/services/service-catalog.server';
import { parseServiceSlug } from '@/lib/services/service-catalog.schema';
import { ImageCarousel } from '@/components/public/ImageCarousel';
import { ServiceImage } from '@/components/public/ServiceImage';
import { ServiceOrderForm } from '@/components/public/ServiceOrderForm';

const SERVICE_IMAGE_FALLBACK = '/placeholder-service.svg';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

function metaDescription(subtitle: string | null, description: string) {
  const source = subtitle ?? description;
  return source.length > 180 ? `${source.slice(0, 177)}…` : source;
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug: rawSlug } = await params;
  if (!isLocale(locale)) return {};

  const slug = parseServiceSlug(rawSlug);
  if (slug === null) return {};

  const result = await getCatalogServiceBySlug(slug, locale);
  if (!result.success || !result.data) return {};

  return pageMetadata({
    locale,
    title: result.data.title,
    description: metaDescription(result.data.subtitle, result.data.description),
    path: `/service/${result.data.slug}`,
    image: result.data.imageUrl ?? SERVICE_IMAGE_FALLBACK,
  });
}

export default async function ServicePage({ params }: Props) {
  const { locale, slug: rawSlug } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const slug = parseServiceSlug(rawSlug);
  if (slug === null) notFound();

  setRequestLocale(locale);
  const [result, t, nav, a11y] = await Promise.all([
    getCatalogServiceBySlug(slug, locale),
    getTranslations('service'),
    getTranslations('nav'),
    getTranslations('a11y'),
  ]);

  if (!result.success) {
    return (
      <main id="content" className="mx-auto max-w-3xl px-5 py-8 sm:px-8 sm:py-12">
        <h1 className="font-serif text-4xl text-ink">{nav('services')}</h1>
        <p className="mt-8 rounded-3xl border border-line bg-paper px-5 py-8 text-muted">{t('loadError')}</p>
      </main>
    );
  }

  if (!result.data) notFound();

  const service = result.data;
  const included = splitLines(service.description);
  const gallery = await listServiceImages(service.id);
  const slides = gallery.success ? gallerySlides(gallery.data, service.title) : [];

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
            {service.title}
          </li>
        </ol>
      </nav>

      {slides.length > 0 ? (
        <ImageCarousel slides={slides} className="mt-6 aspect-[16/10] w-full rounded-3xl" />
      ) : (
        <ServiceImage
          src={service.imageUrl ?? SERVICE_IMAGE_FALLBACK}
          alt={service.title}
          className="mt-6 aspect-[16/10] w-full rounded-3xl"
        />
      )}

      <h1 className="mt-6 font-serif text-4xl leading-tight text-ink sm:text-5xl">{service.title}</h1>

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

      {service.priceDescription ? (
        <p className="mt-6 inline-flex rounded-full bg-sea-soft px-3 py-1 text-sm font-semibold text-sea">
          {service.priceDescription}
        </p>
      ) : null}

      <ServiceOrderForm locale={locale} title={service.title} />

      <p className="mt-8">
        <Link href="/" className="text-sm font-semibold text-sea hover:underline">
          ← {t('back')}
        </Link>
      </p>
    </main>
  );
}
