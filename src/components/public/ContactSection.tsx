import { getTranslations } from 'next-intl/server';
import { ContactForm } from './ContactForm';
import { MessengerButtons } from './MessengerButtons';

export async function ContactSection() {
  const t = await getTranslations('contact');

  return (
    <section id="contact" className="scroll-mt-24 mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sea">
            {t('eyebrow')}
          </p>
          <h2 className="mt-3 font-serif text-4xl text-ink">{t('title')}</h2>
          <p className="mt-3 max-w-md text-base leading-7 text-muted">{t('lead')}</p>
          <div className="mt-6">
            <MessengerButtons message={t('greeting')} layout="bar" />
          </div>
        </div>
        <div className="rounded-3xl border border-line bg-paper p-5 shadow-sm sm:p-7">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
