import { getLocale, getTranslations } from 'next-intl/server';
import { isLocale } from '@/lib/i18n';
import { listSplitImages } from '@/lib/services/split-images.server';
import { Hero } from './Hero';
import { SplitCarousel } from './SplitCarousel';

export async function SplitGallery() {
  const localeValue = await getLocale();
  const locale = isLocale(localeValue) ? localeValue : 'en';
  const hero = await getTranslations('hero');
  const result = await listSplitImages(locale);

  if (!result.success || result.data.length === 0) return <Hero />;

  return (
    <SplitCarousel
      images={result.data}
      ctaLabel={hero('ctaContact')}
      fallbackTitle={hero('title')}
    />
  );
}
