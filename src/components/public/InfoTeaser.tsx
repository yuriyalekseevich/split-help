import { getTranslations } from 'next-intl/server';
import { buttonClass } from '@/components/ui/Button';
import { Link } from '@/i18n/navigation';
import { infoExcerpt } from '@/lib/info-content';
import type { UsefulInfo } from '@/lib/types/database';

const HOME_GUIDE_COUNT = 4;

function cardLead(item: UsefulInfo): string {
  const text = item.subtitle?.trim() || infoExcerpt(item.description);
  return text.length > 140 ? `${text.slice(0, 137)}…` : text;
}

export async function InfoTeaser({ articles }: { articles: UsefulInfo[] }) {
  const t = await getTranslations('info');
  const shown = articles.slice(0, HOME_GUIDE_COUNT);

  return (
    <section id="info" className="reveal md:scroll-mt-24 border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold tracking-[0.16em] text-sea uppercase">{t('eyebrow')}</p>
            <h2 className="mt-3 text-4xl text-ink sm:text-5xl">{t('homeSectionTitle')}</h2>
            <p className="mt-4 text-base leading-7 text-muted">{t('teaser')}</p>
          </div>
          <Link href="/info" className={buttonClass('secondary')}>
            {t('allArticles')}
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {shown.length > 0 ? (
          <ul className="mt-10 grid gap-5 sm:grid-cols-2">
            {shown.map((item) => (
              <li key={item.id} className="h-full">
                <Link
                  href={`/info/${item.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-paper shadow-sm transition motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sea"
                >
                  {item.image_url ? (
                    <span className="block aspect-[16/9] overflow-hidden bg-sea-soft">
                      {/* Host is chosen per row. The image optimizer would need an open remote allowlist. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.image_url} alt={item.title} className="h-full w-full object-cover" />
                    </span>
                  ) : null}
                  <span className="flex flex-1 flex-col p-5">
                    <h3 className="text-2xl leading-snug break-words text-ink group-hover:text-sea">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 break-words text-muted">{cardLead(item)}</p>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
