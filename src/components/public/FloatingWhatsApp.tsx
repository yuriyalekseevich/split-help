import { getTranslations } from 'next-intl/server';
import { site } from '@/content/site';
import { buildMessengerLink } from '@/lib/messaging';
import { FloatingWhatsAppLink } from './FloatingWhatsAppLink';
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
    <FloatingWhatsAppLink href={link.url} label={channels('whatsapp')}>
      <WhatsAppIcon className="size-7" />
    </FloatingWhatsAppLink>
  );
}
