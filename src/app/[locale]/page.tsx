import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { site } from '@/content/site';
import { routing } from '@/i18n/routing';
import { isLocale, pageMetadata } from '@/lib/i18n';
import { serviceRepository } from '@/infrastructure/repositories';
import { ContactSection } from '@/components/public/ContactSection';
import { Hero } from '@/components/public/Hero';
import { ReviewsTeaser } from '@/components/public/ReviewsTeaser';
import { ServicesGrid } from '@/components/public/ServicesGrid';

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
  const services = await serviceRepository.getAllVisible();

  return (
    <main id="content">
      <Hero />
      <ServicesGrid services={services} locale={locale} />
      <ReviewsTeaser />
      <ContactSection />
    </main>
  );
}
