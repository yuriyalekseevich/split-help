import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { UsefulInfoList } from '@/components/public/UsefulInfoList';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { isLocale, pageMetadata } from '@/lib/i18n';
import { listUsefulInfo } from '@/lib/services/useful-info.server';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: 'info' });

  return pageMetadata({
    locale,
    title: t('pageTitle'),
    description: t('growing'),
    path: '/info',
  });
}

export default async function InfoPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const [result, t, nav, a11y] = await Promise.all([
    listUsefulInfo(locale),
    getTranslations('info'),
    getTranslations('nav'),
    getTranslations('a11y'),
  ]);

  return (
    <main id="content" className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <nav aria-label={a11y('breadcrumb')}>
        <ol className="flex flex-wrap items-center gap-2 text-sm text-muted">
          <li>
            <Link href="/" className="hover:text-sea">
              {nav('home')}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-ink">
            {t('pageTitle')}
          </li>
        </ol>
      </nav>
      <p className="mt-6 text-sm font-semibold uppercase tracking-[0.16em] text-sea">{t('eyebrow')}</p>
      <h1 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">{t('pageTitle')}</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">{t('growing')}</p>

      {result.success ? (
        result.data.length === 0 ? (
          <p className="mt-8 rounded-3xl border border-line bg-paper px-5 py-8 text-muted">{t('emptyList')}</p>
        ) : (
          <UsefulInfoList items={result.data} />
        )
      ) : (
        <p className="mt-8 rounded-3xl border border-line bg-paper px-5 py-8 text-muted">{t('loadError')}</p>
      )}
    </main>
  );
}
