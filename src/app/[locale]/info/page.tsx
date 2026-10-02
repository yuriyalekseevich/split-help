import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Link } from '@/i18n/navigation';
import { isLocale, pageMetadata } from '@/lib/i18n';
import { infoRepository } from '@/infrastructure/repositories';
import { InfoBrowser } from '@/components/public/InfoBrowser';

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
  const stored = await infoRepository.getAllVisible();
  const topics = stored.map((topic) => ({
    id: topic.id,
    slug: topic.slug,
    title: topic.title,
    summary: topic.summary,
    body: topic.body,
    links: topic.links.map((link) => ({
      label: link.label,
      url: link.url,
      note: link.note,
    })),
  }));
  const t = await getTranslations('info');
  const nav = await getTranslations('nav');
  const a11y = await getTranslations('a11y');

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
      <p className="mt-6 text-sm font-semibold uppercase tracking-[0.16em] text-sea">
        {t('eyebrow')}
      </p>
      <h1 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">{t('pageTitle')}</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">{t('growing')}</p>
      <InfoBrowser topics={topics} locale={locale} />
    </main>
  );
}
