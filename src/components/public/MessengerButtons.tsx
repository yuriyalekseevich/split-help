'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { site } from '@/content/site';
import {
  buildMessengerLink,
  type MessengerChannel,
} from '@/lib/messaging';
import { Toast } from '@/components/ui/Toast';
import {
  EmailIcon,
  FacebookIcon,
  TelegramIcon,
  WhatsAppIcon,
} from './icons';

const defaultChannels: MessengerChannel[] = [
  'telegram',
  'whatsapp',
  'facebook',
  'email',
];

const channelClass: Record<MessengerChannel, string> = {
  whatsapp: 'bg-[#0f6b4c] text-white hover:bg-[#0c5840]',
  telegram: 'bg-[#1877a8] text-white hover:bg-[#14648d]',
  facebook: 'bg-[#1b4f9c] text-white hover:bg-[#163f7d]',
  email: 'bg-ink text-paper hover:bg-[#2a261f]',
};

function ChannelIcon({ channel }: { channel: MessengerChannel }) {
  const className = 'size-5 shrink-0';
  if (channel === 'whatsapp') return <WhatsAppIcon className={className} />;
  if (channel === 'telegram') return <TelegramIcon className={className} />;
  if (channel === 'facebook') return <FacebookIcon className={className} />;
  return <EmailIcon className={className} />;
}

type Props = {
  message: string;
  subject?: string;
  layout?: 'icon' | 'bar';
  channels?: MessengerChannel[];
  className?: string;
};

export function MessengerButtons({
  message,
  subject,
  layout = 'bar',
  channels = defaultChannels,
  className = '',
}: Props) {
  const tChannels = useTranslations('channels');
  const tToast = useTranslations('toast');
  const tA11y = useTranslations('a11y');
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(message);
      setToast({ id: Date.now(), text: tToast('copied') });
    } catch {
      setToast({ id: Date.now(), text: tToast('copyFailed') });
    }
  }

  return (
    <>
      <div
        role="group"
        aria-label={tA11y('messengers')}
        className={
          layout === 'icon'
            ? `flex items-center gap-2 ${className}`
            : `grid gap-3 sm:grid-cols-2 ${className}`
        }
      >
        {channels.map((channel) => {
          const link = buildMessengerLink({
            channel,
            message,
            contacts: site.contacts,
            subject,
          });
          const label = tChannels(channel);
          const external = link.url.startsWith('http') && !link.sameTab;

          return (
            <a
              key={channel}
              href={link.url}
              aria-label={label}
              target={external ? '_blank' : undefined}
              rel={external ? 'noopener noreferrer' : undefined}
              onClick={
                link.sameTab
                  ? (event) => {
                      event.preventDefault();
                      if (link.copyToClipboard) void copyMessage();
                      window.location.href = link.url;
                    }
                  : link.copyToClipboard
                    ? () => {
                        void copyMessage();
                      }
                    : undefined
              }
              className={
                layout === 'icon'
                  ? `inline-flex size-11 items-center justify-center rounded-full transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea ${channelClass[channel]}`
                  : `flex items-center justify-between gap-3 rounded-2xl px-4 py-4 text-base font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea ${channelClass[channel]}`
              }
            >
              <span className="flex items-center gap-3">
                <ChannelIcon channel={channel} />
                {layout === 'bar' ? <span>{label}</span> : null}
              </span>
              {layout === 'bar' ? <span aria-hidden="true">→</span> : null}
            </a>
          );
        })}
      </div>
      <Toast message={toast?.text ?? null} />
    </>
  );
}
