import { getTranslations } from 'next-intl/server';
import { buttonClass } from '@/components/ui/Button';

export async function Hero() {
  const t = await getTranslations('hero');

  return (
    <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
      <div>
        <p className="inline-flex items-center gap-2.5 text-lg text-ink sm:text-xl">
          <span className="wave-hand text-3xl leading-none" aria-hidden="true">
            👋
          </span>
          <span>{t('greeting')}</span>
        </p>
        <p className="mt-5 text-sm font-semibold uppercase tracking-[0.16em] text-sea">
          {t('eyebrow')}
        </p>
        <h1 className="mt-4 max-w-xl font-serif text-4xl leading-tight text-ink sm:text-6xl sm:leading-[1.05]">
          {t('title')}
          <span className="mt-2 block italic text-sea">{t('titleEmphasis')}</span>
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-muted">{t('subtitle')}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a href="#services" className={buttonClass('primary')}>
            {t('ctaServices')}
          </a>
          <a href="#contact" className={buttonClass('secondary')}>
            {t('ctaContact')}
          </a>
        </div>
      </div>
      <aside className="rounded-3xl border border-line bg-paper p-6 shadow-sm sm:p-8">
        <p className="font-serif text-2xl text-ink">{t('noteTitle')}</p>
        <p className="mt-3 text-base leading-7 text-muted">{t('noteBody')}</p>
      </aside>
    </section>
  );
}
