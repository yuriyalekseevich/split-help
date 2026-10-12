'use client';

import { useState, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { site } from '@/content/site';
import { buildMessengerLink } from '@/lib/messaging';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

export function ContactForm() {
  const t = useTranslations('contact');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get('name') ?? '').trim();
    const contact = String(data.get('contact') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();
    const link = buildMessengerLink({
      channel: 'whatsapp',
      message: t('formMessage', { name, contact, message }),
      contacts: site.contacts,
    });

    const opened = window.open(link.url, '_blank');
    if (!opened) {
      window.location.assign(link.url);
      return;
    }
    opened.opener = null;
    form.reset();
    setStatus('success');
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input id="contact-name" name="name" label={t('name')} required autoComplete="name" />
        <Input
          id="contact-reach"
          name="contact"
          label={t('contact')}
          required
          autoComplete="on"
        />
      </div>
      <Textarea
        id="contact-message"
        name="message"
        label={t('message')}
        placeholder={t('messagePlaceholder')}
        required
        rows={5}
      />
      <div className="pt-2 text-center">
        <Button type="submit" variant="light" className="min-w-40">
          {t('submit')}
        </Button>
      </div>
      {status === 'success' ? (
        <p role="status" className="flex items-start justify-center gap-2 text-sm text-ink">
          <span className="success-check mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-night text-white" aria-hidden="true">
            <svg viewBox="0 0 16 16" className="size-3.5" fill="none">
              <path d="M3.5 8.5 6.5 11.5 12.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span>{t('success')}</span>
        </p>
      ) : null}
      {status === 'error' ? (
        <p role="alert" className="text-sm text-coral">
          {t('error')}
        </p>
      ) : null}
    </form>
  );
}
