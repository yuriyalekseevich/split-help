import { getTranslations } from 'next-intl/server';
import { site } from '@/content/site';
import { Link } from '@/i18n/navigation';

export async function Footer() {
  const t = await getTranslations('footer');
  const nav = await getTranslations('nav');
  const year = new Date().getFullYear();

  return (
    <footer className="bg-night text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-12 sm:px-8 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-2xl font-extrabold tracking-tight">{site.brandName}</p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-white/65">{t('tagline')}</p>
        </div>
        <nav aria-label={nav('primary')} className="flex flex-col gap-3 text-sm font-medium text-white/80">
          <Link href="/#services" className="transition hover:text-mint">
            {nav('services')}
          </Link>
          <Link href="/info" className="transition hover:text-mint">
            {nav('info')}
          </Link>
          <Link href="/#contact" className="transition hover:text-mint">
            {nav('contact')}
          </Link>
        </nav>
        <p className="text-sm text-white/50">
          © {year} {site.brandName}. {t('rights')}
        </p>
      </div>
    </footer>
  );
}
