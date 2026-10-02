import { getTranslations } from 'next-intl/server';
import { site } from '@/content/site';
import { Link } from '@/i18n/navigation';

export async function Footer() {
  const t = await getTranslations('footer');
  const nav = await getTranslations('nav');
  const year = new Date().getFullYear();

  return (
    <footer className="mt-8 border-t border-line bg-paper">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:px-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-serif text-2xl text-ink">{site.brandName}</p>
          <p className="mt-2 max-w-sm text-sm leading-6 text-muted">{t('tagline')}</p>
        </div>
        <div className="flex flex-col gap-3 text-sm">
          <nav aria-label={nav('primary')} className="flex gap-4 font-medium">
            <Link href="/#services" className="hover:text-sea">
              {nav('services')}
            </Link>
            <Link href="/#contact" className="hover:text-sea">
              {nav('contact')}
            </Link>
          </nav>
          <p className="text-muted">
            © {year} {site.brandName}. {t('rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}
