import { getTranslations } from 'next-intl/server';
import { site } from '@/content/site';
import { buildMessengerLink } from '@/lib/messaging';
import { WhatsAppIcon } from './icons';

export async function FloatingWhatsApp() {
  const t = await getTranslations('contact');
  const channels = await getTranslations('channels');
  const link = buildMessengerLink({
    channel: 'whatsapp',
    message: t('greeting'),
    contacts: site.contacts,
  });

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={channels('whatsapp')}
      className="fixed right-4 bottom-4 z-40 inline-flex size-14 items-center justify-center rounded-full bg-[#0f6b4c] text-white shadow-lg md:hidden"
    >
      <WhatsAppIcon className="size-7" />
    </a>
  );
}
