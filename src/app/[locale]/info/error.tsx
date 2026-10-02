'use client';

import { useTranslations } from 'next-intl';

export default function InfoError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('info');

  return (
    <main id="content" className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <h1 className="font-serif text-4xl text-ink sm:text-5xl">{t('pageTitle')}</h1>
      <p className="mt-8 rounded-3xl border border-line bg-paper px-5 py-8 text-muted">{t('loadError')}</p>
      <button type="button" onClick={() => reset()} className="mt-4 text-sm font-semibold text-sea hover:underline">
        {t('retry')}
      </button>
    </main>
  );
}
