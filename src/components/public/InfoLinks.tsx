import { getTranslations } from 'next-intl/server';
import type { InfoLink } from '@/domain/info-topic';
import type { Locale } from '@/lib/i18n';

function linkHint(url: string) {
  try {
    const parsed = new URL(url);
    const host = parsed.host.replace(/^www\./, '');
    if (host === 'facebook.com') {
      return `${host}${parsed.pathname.replace(/\/$/, '')}`;
    }
    return host;
  } catch {
    return url;
  }
}

function featuredFirst(links: InfoLink[]) {
  return links
    .map((link, index) => ({ link, index }))
    .sort((a, b) => Number(Boolean(b.link.featured)) - Number(Boolean(a.link.featured)) || a.index - b.index)
    .map((item) => item.link);
}

export async function InfoLinks({
  links,
  locale,
}: {
  links: InfoLink[];
  locale: Locale;
}) {
  const t = await getTranslations('info');
  const sites = featuredFirst(links.filter((link) => link.kind === 'site'));
  const groups = links.filter((link) => link.kind === 'group');
  const showSiteHeading = groups.length > 0 || sites.length > 1;

  return (
    <div className="mt-10 grid gap-10">
      {sites.length > 0 ? (
        <section>
          {showSiteHeading ? (
            <h2 className="font-serif text-2xl text-ink">{t('sites')}</h2>
          ) : null}
          <ul className={`grid gap-3 ${showSiteHeading ? 'mt-4' : ''}`}>
            {sites.map((link) => (
              <li key={link.id}>
                <LinkCard link={link} locale={locale} featuredLabel={t('featured')} newTab={t('newTab')} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {groups.length > 0 ? (
        <section>
          <h2 className="font-serif text-2xl text-ink">{t('groups')}</h2>
          <ul className="mt-4 grid gap-3">
            {groups.map((link) => (
              <li key={link.id}>
                <LinkCard link={link} locale={locale} featuredLabel={t('featured')} newTab={t('newTab')} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function LinkCard({
  link,
  locale,
  featuredLabel,
  newTab,
}: {
  link: InfoLink;
  locale: Locale;
  featuredLabel: string;
  newTab: string;
}) {
  const note = link.note?.[locale];

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`block rounded-2xl border px-4 py-4 transition hover:border-sea focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sea ${
        link.featured ? 'border-sea bg-sea-soft' : 'border-line bg-paper'
      }`}
    >
      <span className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="font-semibold text-ink">{link.label}</span>
        {link.featured ? (
          <span className="text-xs font-semibold uppercase tracking-wide text-sea">
            {featuredLabel}
          </span>
        ) : null}
      </span>
      <span className="mt-1 block text-sm text-sea">{linkHint(link.url)}</span>
      {note ? <span className="mt-2 block text-sm leading-6 text-muted">{note}</span> : null}
      <span className="sr-only"> ({newTab})</span>
    </a>
  );
}
