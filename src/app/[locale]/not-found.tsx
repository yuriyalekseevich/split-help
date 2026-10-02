import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export default async function NotFound() {
  const t = await getTranslations('notFound');

  return (
    <main id="content" className="mx-auto max-w-3xl px-5 py-20 sm:px-8">
      <h1 className="font-serif text-4xl text-ink">{t('title')}</h1>
      <p className="mt-4 text-base leading-7 text-muted">{t('body')}</p>
      <p className="mt-6">
        <Link href="/" className="text-sm font-semibold text-sea hover:underline">
          ← {t('back')}
        </Link>
      </p>
    </main>
  );
}
