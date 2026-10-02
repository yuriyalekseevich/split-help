import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Link } from '@/i18n/navigation';
import { isLocale, pageMetadata } from '@/lib/i18n';
import { splitParagraphs } from '@/lib/format';
import { infoRepository } from '@/infrastructure/repositories';
import { InfoLinks } from '@/components/public/InfoLinks';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const topics = await infoRepository.getAllVisible();
  return routing.locales.flatMap((locale) =>
    topics.map((topic) => ({
      locale,
      slug: topic.slug,
    })),
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};

  const topic = await infoRepository.getBySlug(slug);
  if (!topic || !topic.visible) return {};

  return pageMetadata({
    locale,
    title: topic.title[locale],
    description: topic.summary[locale],
    path: `/info/${topic.slug}`,
  });
}

export default async function InfoTopicPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const topic = await infoRepository.getBySlug(slug);
  if (!topic || !topic.visible) {
    notFound();
  }

  const t = await getTranslations('info');
  const nav = await getTranslations('nav');
  const a11y = await getTranslations('a11y');
  const paragraphs = topic.body ? splitParagraphs(topic.body[locale]) : [];

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
            <Link href="/info" className="hover:text-sea">
              {t('pageTitle')}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-ink">
            {topic.title[locale]}
          </li>
        </ol>
      </nav>

      <h1 className="mt-6 font-serif text-4xl leading-tight text-ink sm:text-5xl">
        {topic.title[locale]}
      </h1>
      <p className="mt-4 text-lg leading-8 text-muted">{topic.summary[locale]}</p>

      {paragraphs.length > 0 ? (
        <div className="mt-8 grid gap-4">
          {paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-base leading-7 text-ink">
              {paragraph}
            </p>
          ))}
        </div>
      ) : null}

      <InfoLinks links={topic.links} locale={locale} />

      <p className="mt-10">
        <Link href="/info" className="text-sm font-semibold text-sea hover:underline">
          ← {t('back')}
        </Link>
      </p>
    </main>
  );
}
