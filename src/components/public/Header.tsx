import { getLocale, getTranslations } from 'next-intl/server';
import { site } from '@/content/site';
import { isLocale } from '@/lib/i18n';
import { Link } from '@/i18n/navigation';
import { Badge } from '@/components/ui/Badge';
import { LanguageSwitcher } from './LanguageSwitcher';

export async function Header() {
  const t = await getTranslations('nav');
  const hero = await getTranslations('hero');
  const localeValue = await getLocale();
  const locale = isLocale(localeValue) ? localeValue : 'en';

  const links = (
    <>
      <Link href="/#services" className="transition hover:text-mint">
        {t('services')}
      </Link>
      <Link href="/info" className="transition hover:text-mint">
        {t('info')}
      </Link>
      <Link href="/#reviews" className="inline-flex items-center gap-2 transition hover:text-mint">
        {t('reviews')}
        <Badge>{t('soon')}</Badge>
      </Link>
      <Link href="/#contact" className="transition hover:text-mint">
        {t('contact')}
      </Link>
    </>
  );

  return (
    <header className="z-30 bg-night text-white md:sticky md:top-0">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 text-base font-extrabold tracking-tight whitespace-nowrap text-white sm:text-lg"
        >
          <img
            src="/brand-icon.jpg"
            alt=""
            width={40}
            height={40}
            className="size-9 rounded-md sm:size-10"
          />
          {site.brandName}
        </Link>
        <nav
          aria-label={t('primary')}
          className="hidden items-center gap-7 text-sm font-medium text-white/75 md:flex"
        >
          {links}
        </nav>
        <div className="flex items-center gap-3 sm:gap-4">
          <LanguageSwitcher locale={locale} label={t('language')} tone="light" />
          <Link
            href="/#contact"
            className="hidden items-center justify-center rounded-full border border-mint px-4 py-2 text-sm font-semibold whitespace-nowrap text-mint transition duration-200 ease-out hover:bg-mint hover:text-night motion-safe:hover:scale-[1.03] motion-safe:active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint sm:inline-flex"
          >
            {hero('ctaContact')}
          </Link>
        </div>
      </div>
      <nav
        aria-label={t('primary')}
        className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-5 pb-3 text-sm font-medium text-white/75 md:hidden"
      >
        {links}
      </nav>
    </header>
  );
}
