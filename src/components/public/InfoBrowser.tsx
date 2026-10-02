'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { matchedLinkLabels, searchInfoTopics } from '@/domain/info-search';
import type { InfoSearchDocument } from '@/domain/info-topic';
import type { Locale } from '@/lib/i18n';

export type InfoCard = InfoSearchDocument & {
  id: string;
  slug: string;
};

export function InfoBrowser({
  topics,
  locale,
}: {
  topics: InfoCard[];
  locale: Locale;
}) {
  const t = useTranslations('info');
  const [query, setQuery] = useState('');
  const results = searchInfoTopics(topics, query);
  const searching = query.trim().length > 0;

  return (
    <div>
      <search className="mt-8">
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

      {results.length === 0 ? (
        <p className="mt-8 text-muted">{t('empty')}</p>
      ) : (
        <ul className="mt-8 grid gap-5 sm:grid-cols-2">
          {results.map((topic) => {
            const mentioned = searching ? matchedLinkLabels(topic, query).slice(0, 3) : [];
            return (
              <li key={topic.id} className="h-full">
                <Link
                  href={`/info/${topic.slug}`}
                  className="group flex h-full flex-col rounded-3xl border border-line bg-paper p-5 shadow-sm transition motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sea"
                >
                  <h2 className="font-serif text-2xl leading-snug text-ink group-hover:text-sea">
                    {topic.title[locale]}
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-6 text-muted">
                    {topic.summary[locale]}
                  </p>
                  {mentioned.length > 0 ? (
                    <p className="mt-4 text-sm text-sea">
                      {t('matches')}: {mentioned.join(', ')}
                    </p>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
