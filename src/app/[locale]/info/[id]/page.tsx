import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { splitParagraphs } from '@/lib/format';
import { isLocale, pageMetadata } from '@/lib/i18n';
import { getUsefulInfoById } from '@/lib/services/useful-info.server';
import { parseUsefulInfoId } from '@/lib/services/useful-info.schema';
import type { UsefulInfo } from '@/lib/types/database';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

function metaDescription(item: UsefulInfo) {
  const source = item.subtitle ?? item.description;
  return source.length > 180 ? `${source.slice(0, 177)}…` : source;
}

export async function generateMetadata({ params }: Props) {
  const { locale, id: rawId } = await params;
  if (!isLocale(locale)) return {};

  const id = parseUsefulInfoId(rawId);
  if (id === null) return {};

  const result = await getUsefulInfoById(id, locale);
  if (!result.success || !result.data) return {};

  return pageMetadata({
    locale,
    title: result.data.title,
    description: metaDescription(result.data),
    path: `/info/${result.data.id}`,
    ...(result.data.image_url?.startsWith('https:') ? { image: result.data.image_url } : {}),
  });
}

export default async function UsefulInfoPage({ params }: Props) {
  const { locale, id: rawId } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const id = parseUsefulInfoId(rawId);
  if (id === null) notFound();

  setRequestLocale(locale);
  const [result, t, nav, a11y] = await Promise.all([
    getUsefulInfoById(id, locale),
    getTranslations('info'),
    getTranslations('nav'),
    getTranslations('a11y'),
  ]);

  if (!result.success) {
    return (
      <main id="content" className="mx-auto max-w-3xl px-5 py-8 sm:px-8 sm:py-12">
        <h1 className="font-serif text-4xl text-ink">{t('pageTitle')}</h1>
        <p className="mt-8 rounded-3xl border border-line bg-paper px-5 py-8 text-muted">{t('loadError')}</p>
      </main>
    );
  }

  if (!result.data) notFound();

  const item = result.data;
  const paragraphs = splitParagraphs(item.description);

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
          <li aria-current="page" className="break-words text-ink">
            {item.title}
          </li>
        </ol>
      </nav>

      {item.image_url ? (
        <div className="mt-6 overflow-hidden rounded-3xl border border-line bg-sea-soft">
          {/* Host is chosen per row. The image optimizer would need an open remote allowlist. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.image_url} alt="" className="aspect-[16/9] w-full object-cover" />
        </div>
      ) : null}

      <h1 className="mt-6 font-serif text-4xl leading-tight break-words text-ink sm:text-5xl">{item.title}</h1>
      {item.subtitle ? <p className="mt-4 text-lg leading-8 break-words text-muted">{item.subtitle}</p> : null}

      {paragraphs.length > 0 ? (
        <div className="mt-8 grid gap-4">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="text-base leading-7 break-words text-ink">
              {paragraph}
            </p>
          ))}
        </div>
      ) : null}

      <p className="mt-10">
        <Link href="/info" className="text-sm font-semibold text-sea hover:underline">
          ← {t('back')}
        </Link>
      </p>
    </main>
  );
}
