import { getLocale, getTranslations } from 'next-intl/server';
import { site } from '@/content/site';
import { isLocale } from '@/lib/i18n';
import { Link } from '@/i18n/navigation';
import { Badge } from '@/components/ui/Badge';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MessengerButtons } from './MessengerButtons';

export async function Header() {
  const t = await getTranslations('nav');
  const contact = await getTranslations('contact');
  const localeValue = await getLocale();
  const locale = isLocale(localeValue) ? localeValue : 'en';
  const greeting = contact('greeting');

  return (
    <header className="sticky top-0 z-30 border-b border-line/80 bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-3 sm:px-8">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/"
            className="font-serif text-xl font-semibold tracking-tight text-ink"
          >
            {site.brandName}
          </Link>
          <nav
            aria-label={t('primary')}
            className="hidden items-center gap-6 text-sm font-medium md:flex"
          >
            <Link href="/#services" className="transition hover:text-sea">
              {t('services')}
            </Link>
            <Link href="/info" className="transition hover:text-sea">
              {t('info')}
            </Link>
            <Link
              href="/#reviews"
              className="inline-flex items-center gap-2 transition hover:text-sea"
            >
              {t('reviews')}
              <Badge>{t('soon')}</Badge>
            </Link>
            <Link href="/#contact" className="transition hover:text-sea">
              {t('contact')}
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <LanguageSwitcher locale={locale} label={t('language')} />
            <MessengerButtons
              message={greeting}
              layout="icon"
              channels={['whatsapp', 'telegram', 'facebook']}
              className="hidden md:flex"
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 md:hidden">
          <nav aria-label={t('primary')} className="flex items-center gap-4 text-sm font-medium">
            <Link href="/#services" className="hover:text-sea">
              {t('services')}
            </Link>
            <Link href="/info" className="hover:text-sea">
              {t('info')}
            </Link>
            <Link href="/#reviews" className="inline-flex items-center gap-1.5 hover:text-sea">
              {t('reviews')}
              <Badge>{t('soon')}</Badge>
            </Link>
            <Link href="/#contact" className="hover:text-sea">
              {t('contact')}
            </Link>
          </nav>
          <MessengerButtons
            message={greeting}
            layout="icon"
            channels={['whatsapp', 'telegram', 'facebook']}
            className="lg:hidden"
          />
        </div>
      </div>
    </header>
  );
}
