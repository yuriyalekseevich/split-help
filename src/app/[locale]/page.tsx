import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { site } from '@/content/site';
import { routing } from '@/i18n/routing';
import { isLocale, pageMetadata } from '@/lib/i18n';
import { listCatalogServices } from '@/lib/services/service-catalog.server';
import { ContactSection } from '@/components/public/ContactSection';
import { SplitGallery } from '@/components/public/SplitGallery';
import { IdeaCta } from '@/components/public/IdeaCta';
import { InfoTeaser } from '@/components/public/InfoTeaser';
import { ServicesGrid } from '@/components/public/ServicesGrid';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: 'meta' });

  return pageMetadata({
    locale,
    title: `${site.brandName} — ${t('homeTitle')}`,
    description: t('homeDescription'),
    path: '',
    absoluteTitle: true,
  });
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const services = await listCatalogServices(locale);

  return (
    <main id="content">
      <SplitGallery />
      <ServicesGrid services={services.success ? services.data : []} failed={!services.success} />
      <IdeaCta />
      <InfoTeaser />
      <ContactSection />
    </main>
  );
}
