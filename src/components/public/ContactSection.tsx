import { getTranslations } from 'next-intl/server';
import { ContactForm } from './ContactForm';
import { MessengerButtons } from './MessengerButtons';

export async function ContactSection() {
  const t = await getTranslations('contact');

  return (
    <section id="contact" className="reveal md:scroll-mt-24 lg:grid lg:grid-cols-2">
      <div className="px-5 py-16 sm:px-8 sm:py-20 lg:py-24 lg:pr-16 lg:pl-[max(2rem,calc((100vw-72rem)/2+2rem))]">
        <p className="text-sm font-semibold tracking-[0.16em] text-sea uppercase">{t('eyebrow')}</p>
        <h2 className="mt-3 max-w-md text-4xl text-ink sm:text-5xl">{t('title')}</h2>
        <p className="mt-4 max-w-md text-base leading-7 text-muted">{t('lead')}</p>
        <div className="mt-8">
          <MessengerButtons message={t('greeting')} layout="plain" />
        </div>
      </div>
      <div className="mx-5 mb-8 rounded-[2rem] bg-mint px-6 py-10 sm:mx-8 sm:px-10 lg:mx-0 lg:mb-0 lg:rounded-none lg:rounded-l-[4.5rem] lg:px-14 lg:py-20">
        <ContactForm />
      </div>
    </section>
  );
}
