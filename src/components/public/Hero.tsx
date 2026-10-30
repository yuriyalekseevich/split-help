import { getTranslations } from 'next-intl/server';
import { buttonClass } from '@/components/ui/Button';
import { DiscussIdeaLink } from './DiscussIdeaLink';

/** Shown when the photo carousel has nothing to display. */
export async function Hero() {
  const t = await getTranslations('hero');

  return (
    <section className="bg-night px-5 py-24 text-center text-white sm:px-8 sm:py-32">
      <p className="text-sm font-semibold tracking-[0.16em] text-mint uppercase">{t('eyebrow')}</p>
      <h1 className="mx-auto mt-4 max-w-3xl text-4xl leading-[1.05] sm:text-6xl">
        {t('title')} {t('titleEmphasis')}
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">{t('subtitle')}</p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a href="#services" className={buttonClass('primary')}>
          {t('ctaServices')}
        </a>
        <DiscussIdeaLink
          placement="hero"
          className="inline-flex items-center justify-center rounded-full border border-mint px-5 py-3 text-sm font-semibold text-mint transition duration-200 ease-out hover:bg-mint hover:text-night"
        >
          {t('ctaContact')}
        </DiscussIdeaLink>
      </div>
    </section>
  );
}
