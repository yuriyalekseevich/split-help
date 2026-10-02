import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export async function InfoTeaser() {
  const t = await getTranslations('info');

  return (
    <section id="info" className="scroll-mt-24 mx-auto max-w-6xl px-5 py-6 sm:px-8">
      <Link
        href="/info"
        className="group block rounded-3xl border border-line bg-paper px-6 py-8 shadow-sm transition motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sea sm:px-10 sm:py-10"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sea">
          {t('eyebrow')}
        </p>
        <h2 className="mt-3 font-serif text-4xl text-ink group-hover:text-sea">{t('title')}</h2>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted">{t('teaser')}</p>
        <span className="mt-6 inline-flex text-sm font-semibold text-sea">
          {t('cta')} →
        </span>
      </Link>
    </section>
  );
}
