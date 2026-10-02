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
      <Input id="contact-name" name="name" label={t('name')} required autoComplete="name" />
      <Input
        id="contact-reach"
        name="contact"
        label={t('contact')}
        required
        autoComplete="on"
      />
      <Textarea
        id="contact-message"
        name="message"
        label={t('message')}
        placeholder={t('messagePlaceholder')}
        required
        rows={5}
      />
      <div>
        <Button type="submit">{t('submit')}</Button>
      </div>
      {status === 'success' ? (
        <p role="status" className="text-sm text-sea">
          {t('success')}
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
