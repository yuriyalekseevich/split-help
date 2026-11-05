import { emails } from '@/content/site';

/**
 * Inbox for contact mail. `CONTACT_EMAIL` wins on the server;
 * otherwise the public support address, which itself falls back to support@split-help.com.
 */
export function supportRecipient() {
  const configured = process.env.CONTACT_EMAIL?.trim();
  return configured || emails.support;
}
