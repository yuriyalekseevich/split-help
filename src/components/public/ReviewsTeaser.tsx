import { getTranslations } from 'next-intl/server';
import { Badge } from '@/components/ui/Badge';

export async function ReviewsTeaser() {
  const t = await getTranslations('reviews');

  return (
    <section id="reviews" className="scroll-mt-24 mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <div className="rounded-3xl border border-dashed border-line bg-paper/70 px-6 py-10 sm:px-10">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sea">
          {t('eyebrow')}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <h2 className="font-serif text-4xl text-ink">{t('title')}</h2>
          <Badge>{t('badge')}</Badge>
        </div>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted">{t('body')}</p>
      </div>
    </section>
  );
}
