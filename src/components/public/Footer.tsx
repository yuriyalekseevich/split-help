import { getTranslations } from 'next-intl/server';
import { CookieSettingsButton } from '@/components/consent/CookieSettingsButton';
import { emails, site } from '@/content/site';
import { Link } from '@/i18n/navigation';
import { ContactHashLink } from './ContactHashLink';

export async function Footer() {
  const t = await getTranslations('footer');
  const nav = await getTranslations('nav');
  const year = new Date().getFullYear();

  return (
    <footer className="bg-night text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-12 sm:px-8 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="flex items-center gap-3 text-2xl font-extrabold tracking-tight">
            <img src="/brand-icon.jpg" alt="" width={40} height={40} className="size-10 rounded-md" />
            {site.brandName}
          </p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-white/65">{t('tagline')}</p>
          <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <a
              href={`mailto:${emails.info}`}
              className="text-sm text-white/80 underline decoration-mint/70 underline-offset-4 transition hover:text-mint"
            >
              {emails.info}
            </a>
            <ContactHashLink
              placement="footer"
              className="text-sm text-white/80 underline decoration-mint/70 underline-offset-4 transition hover:text-mint"
            >
              {t('idea')}
            </ContactHashLink>
          </div>
        </div>
        <nav aria-label={nav('primary')} className="flex flex-col gap-3 text-sm font-medium text-white/80">
          <Link href="/#services" className="transition hover:text-mint">
            {nav('services')}
          </Link>
          <Link href="/info" className="transition hover:text-mint">
            {nav('info')}
          </Link>
          <ContactHashLink className="transition hover:text-mint">{nav('contact')}</ContactHashLink>
          <Link href="/privacy-policy" className="transition hover:text-mint">
            {t('privacy')}
          </Link>
          <Link href="/cookie-policy" className="transition hover:text-mint">
            {t('cookies')}
          </Link>
          <CookieSettingsButton label={t('cookieSettings')} />
        </nav>
        <p className="text-sm text-white/50">
          © {year} {site.brandName}. {t('rights')}
        </p>
      </div>
    </footer>
  );
}
