'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { LocalizedString } from '@/domain/service';
import { site } from '@/content/site';
import type { Locale } from '@/lib/i18n';
import { buildOrderMessage } from '@/lib/messaging';
import { Textarea } from '@/components/ui/Textarea';
import { MessengerButtons } from './MessengerButtons';

export function ServiceOrderForm({
  locale,
  service,
}: {
  locale: Locale;
  service: { title: LocalizedString };
}) {
  const t = useTranslations('service');
  const [comments, setComments] = useState('');
  const title = service.title[locale];
  const message = buildOrderMessage({ locale, service, comments });

  return (
    <div className="mt-8">
      <Textarea
        id="service-comments"
        label={t('comments')}
        hint={t('optional')}
        placeholder={t('commentsPlaceholder')}
        rows={4}
        value={comments}
        onChange={setComments}
      />
      <div className="mt-4">
        <MessengerButtons
          message={message}
          subject={`${site.brandName}: ${title}`}
          layout="bar"
        />
      </div>
      <p className="mt-4 text-sm leading-6 text-muted">{t('reassure')}</p>
    </div>
  );
}
