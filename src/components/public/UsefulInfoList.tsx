'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { track } from '@/lib/analytics';
import { infoExcerpt } from '@/lib/info-content';
import { filterUsefulInfo, infoFilters, type InfoFilter } from '@/lib/info-list';
import type { UsefulInfo } from '@/lib/types/database';

function cardLead(item: UsefulInfo): string {
  return item.subtitle?.trim() || infoExcerpt(item.description);
}

const pillClass = (active: boolean) =>
  [
    'inline-flex rounded-full px-4 py-2 text-sm font-semibold transition',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea',
    active
      ? 'bg-sea text-white'
      : 'border border-line bg-paper text-ink hover:border-sea hover:text-sea',
  ].join(' ');

export function UsefulInfoList({ items }: { items: UsefulInfo[] }) {
  const t = useTranslations('info');
  const [category, setCategory] = useState<InfoFilter>('all');
  const [query, setQuery] = useState('');
  const visible = filterUsefulInfo(items, category, query);

  return (
    <div>
      <div className="mt-8 flex flex-col gap-4">
        <fieldset className="min-w-0 border-0 p-0">
          <legend className="sr-only">{t('filterLabel')}</legend>
          <div className="flex flex-wrap gap-2">
            {infoFilters.map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={category === value}
                onClick={() => setCategory(value)}
                className={pillClass(category === value)}
              >
                {t(`categories.${value}`)}
              </button>
            ))}
          </div>
        </fieldset>

        <search>
          <label htmlFor="info-search" className="mb-1.5 block text-sm font-medium text-ink">
            {t('searchLabel')}
          </label>
          <input
            id="info-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('searchPlaceholder')}
            autoComplete="off"
            className="w-full rounded-2xl border border-line bg-paper px-4 py-3 text-base text-ink outline-none transition placeholder:text-muted/70 focus:border-sea focus:ring-2 focus:ring-sea/15"
          />
        </search>
      </div>

      {visible.length === 0 ? (
        <p className="mt-8 rounded-3xl border border-line bg-paper px-5 py-8 text-muted">{t('empty')}</p>
      ) : (
        <ul className="mt-8 grid gap-5 sm:grid-cols-2">
          {visible.map((item) => {
            const lead = cardLead(item);
            return (
              <li key={item.id} className="h-full">
                <Link
                  href={`/info/${item.slug}`}
                  onClick={() => track('click_info_card', { info_name: item.title, info_id: item.id })}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-paper shadow-sm transition motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sea"
                >
                  {item.image_url ? (
                    <span className="block aspect-[16/9] overflow-hidden bg-sea-soft">
                      {/* The title below names the link, so the image stays decorative. */}
                      {/* Host is chosen per row. The image optimizer would need an open remote allowlist. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.image_url} alt="" className="h-full w-full object-cover" />
                    </span>
                  ) : null}
                  <span className="flex min-w-0 flex-1 flex-col p-5">
                    <span className="inline-flex w-fit rounded-full bg-sea-soft px-2.5 py-1 text-xs font-semibold text-sea">
                      {t(`categories.${item.category}`)}
                    </span>
                    <h2 className="mt-3 font-serif text-2xl leading-snug break-words text-ink group-hover:text-sea">
                      {item.title}
                    </h2>
                    {lead ? (
                      <p className="mt-2 line-clamp-2 text-sm leading-6 break-words text-muted">{lead}</p>
                    ) : null}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
