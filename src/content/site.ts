const SUPPORT_EMAIL = 'support@split-help.com';

function publicAddress(value: string | undefined, fallback: string) {
  const trimmed = value?.trim();
  return trimmed || fallback;
}

/** Public inboxes. Unset env vars fall back to these domain aliases. */
export const emails = {
  info: publicAddress(process.env.NEXT_PUBLIC_INFO_EMAIL, 'info@split-help.com'),
  support: publicAddress(process.env.NEXT_PUBLIC_CONTACT_EMAIL, SUPPORT_EMAIL),
  billing: publicAddress(process.env.NEXT_PUBLIC_BILLING_EMAIL, 'billing@split-help.com'),
  partners: publicAddress(process.env.NEXT_PUBLIC_PARTNERS_EMAIL, 'partners@split-help.com'),
};

export const site = {
  brandName: 'Split Help',
  domain: 'https://split-help.com',
  emails,
  contacts: {
    whatsapp: '+380955948402',
    telegram: '@Yuriy_Maliyov',
    facebook: 'yuriymaliyov',
    email: emails.info,
  },
} as const;
