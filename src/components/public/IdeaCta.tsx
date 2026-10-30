import { getTranslations } from 'next-intl/server';
import { buttonClass } from '@/components/ui/Button';
import { ContactHashLink } from './ContactHashLink';

export async function IdeaCta() {
  const t = await getTranslations('idea');

  return (
    <section className="reveal border-t border-line bg-sea-soft">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-10 sm:px-8 sm:py-12 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-2xl text-ink sm:text-3xl">{t('title')}</h2>
          <p className="mt-3 text-base leading-7 text-muted">{t('body')}</p>
        </div>
        <ContactHashLink
          placement="idea"
          className={buttonClass('secondary', 'shrink-0 self-start lg:self-center')}
        >
          {t('cta')}
        </ContactHashLink>
      </div>
    </section>
  );
}
