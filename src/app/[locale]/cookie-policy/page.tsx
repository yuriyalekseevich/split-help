import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { LegalArticle } from '@/components/public/LegalArticle';
import { routing } from '@/i18n/routing';
import { isLocale, noIndexMetadata, pageMetadata } from '@/lib/i18n';
import { getLegalPage } from '@/lib/services/legal-pages.server';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const [t, result] = await Promise.all([
    getTranslations({ locale, namespace: 'policies' }),
    getLegalPage('cookie-policy', locale),
  ]);
  if (!result.success) return noIndexMetadata();
  if (!result.data) notFound();

  return pageMetadata({
    locale,
    title: result.data.title,
    description: t('cookiesDescription'),
    path: '/cookie-policy',
    contentLocale: result.data.contentLocale,
    publishedLocales: result.data.publishedLocales,
  });
}

export default async function CookiePolicyPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const [result, t] = await Promise.all([
    getLegalPage('cookie-policy', locale),
    getTranslations('policies'),
  ]);

  return <LegalArticle result={result} loadError={t('loadError')} />;
}
