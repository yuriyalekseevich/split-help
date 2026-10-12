import { getTranslations } from 'next-intl/server';
import { buttonClass } from '@/components/ui/Button';
import { Link } from '@/i18n/navigation';

export async function InfoTeaser() {
  const t = await getTranslations('info');

  return (
    <section id="info" className="reveal md:scroll-mt-24 border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-16 sm:px-8 sm:py-20 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold tracking-[0.16em] text-sea uppercase">{t('eyebrow')}</p>
          <h2 className="mt-3 text-4xl text-ink sm:text-5xl">{t('title')}</h2>
          <p className="mt-4 text-base leading-7 text-muted">{t('teaser')}</p>
        </div>
        <Link href="/info" className={buttonClass('secondary')}>
          {t('cta')}
        </Link>
      </div>
    </section>
  );
}
