import type { LocalizedString } from '@/domain/service';
import { site } from '@/content/site';
import type { Locale } from '@/lib/i18n';

export type MessengerChannel = 'telegram' | 'whatsapp' | 'facebook' | 'email';

export type ContactChannels = {
  whatsapp: string;
  telegram: string;
  facebook: string;
  email: string;
};

const orderTemplates: Record<
  Locale,
  { lead: (title: string) => string; notes: (comments: string) => string }
> = {
  en: {
    lead: (title) => `Hi! I'd like to order: ${title}.`,
    notes: (comments) => ` Notes: ${comments}`,
  },
  ru: {
    lead: (title) => `Здравствуйте! Хочу заказать: ${title}.`,
    notes: (comments) => ` Комментарии: ${comments}`,
  },
  hr: {
    lead: (title) => `Bok! Želim naručiti: ${title}.`,
    notes: (comments) => ` Napomene: ${comments}`,
  },
  uk: {
    lead: (title) => `Вітаю! Хочу замовити: ${title}.`,
    notes: (comments) => ` Коментарі: ${comments}`,
  },
};

export function buildOrderMessage({
  locale,
  service,
  comments,
}: {
  locale: Locale;
  service: { title: LocalizedString };
  comments?: string;
}): string {
  const template = orderTemplates[locale];
  const title = service.title[locale];
  const note = comments?.trim();
  if (!note) return template.lead(title);
  return `${template.lead(title)}${template.notes(note)}`;
}

function digitsOnly(value: string) {
  return value.replace(/\D/g, '');
}

function telegramHandle(value: string) {
  return value.replace(/^@/, '');
}

function looksLikePhone(value: string) {
  const trimmed = value.trim();
  const digits = digitsOnly(trimmed);
  return digits.length >= 8 && digits.length <= 15 && /^[+\d][\d\s()-]*$/.test(trimmed);
}

function facebookProfileUrl(id: string) {
  return `fb://profile/${encodeURIComponent(id)}`;
}

function facebookChatUrl(value: string) {
  const trimmed = value.trim();
  const existing = trimmed.match(
    /(?:m\.me|messenger\.com\/t|facebook\.com\/messages\/t|fb:\/\/profile)\/([^/?#]+)/i,
  );
  if (existing?.[1]) return facebookProfileUrl(existing[1]);

  const profile = trimmed.match(
    /facebook\.com\/(?:profile\.php\?id=(\d+)|([A-Za-z0-9.]+))(?:[/?#]|$)/i,
  );
  const id = profile?.[1] || profile?.[2];
  const reserved = new Set([
    'search',
    'people',
    'messages',
    'share',
    'watch',
    'groups',
    'pages',
  ]);
  if (id && !reserved.has(id.toLowerCase())) return facebookProfileUrl(id);

  if (/^[A-Za-z0-9.]+$/.test(trimmed)) return facebookProfileUrl(trimmed);

  return 'fb://profile';
}

export function buildMessengerLink({
  channel,
  message,
  contacts,
  subject,
}: {
  channel: MessengerChannel;
  message: string;
  contacts: ContactChannels;
  subject?: string;
}): { url: string; copyToClipboard?: boolean; sameTab?: boolean } {
  const encoded = encodeURIComponent(message);
  const textQuery = message.trim() ? `text=${encoded}` : '';

  switch (channel) {
    case 'whatsapp': {
      const phone = digitsOnly(contacts.whatsapp);
      const query = textQuery ? `?${textQuery}` : '';
      return { url: `https://wa.me/${phone}${query}` };
    }
    case 'telegram': {
      if (looksLikePhone(contacts.telegram)) {
        const phone = digitsOnly(contacts.telegram);
        return {
          url: `tg://resolve?phone=${phone}`,
          copyToClipboard: Boolean(message.trim()),
        };
      }
      const handle = telegramHandle(contacts.telegram);
      const query = textQuery ? `?${textQuery}` : '';
      return { url: `https://t.me/${handle}${query}` };
    }
    case 'email': {
      const emailSubject = subject?.trim() || site.brandName;
      return {
        url: `mailto:${contacts.email}?subject=${encodeURIComponent(emailSubject)}&body=${encoded}`,
      };
    }
    case 'facebook':
      return {
        url: facebookChatUrl(contacts.facebook),
        copyToClipboard: true,
        sameTab: true,
      };
  }
}
