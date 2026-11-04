'use client';

import type { MouseEvent } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useCookieConsent } from './CookieConsentProvider';

const choiceButton =
  'inline-flex w-full cursor-pointer items-center justify-center rounded-full border border-mint bg-transparent px-5 py-3 text-sm font-semibold text-ink transition hover:bg-mint/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea';

/** The form is the no-JS fallback. With JS, stay on the page so PostHog can finish sending. */
function chooseWithoutNavigation(choose: () => void) {
  return (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    choose();
  };
}

export function CookieBanner() {
  const { bannerOpen, accept, reject } = useCookieConsent();
  const pathname = usePathname();
  const t = useTranslations('consent');

  if (!bannerOpen) return null;

  return (
    <>
      <div aria-hidden="true" className="h-56 md:h-40" />
      <div
        role="dialog"
        aria-modal="false"
        aria-labelledby="cookie-banner-title"
        aria-describedby="cookie-banner-body"
        className="fixed inset-x-0 bottom-0 z-[70] border-t border-line bg-paper px-5 py-4 shadow-[0_-8px_30px_rgba(16,17,20,0.08)] max-md:pr-24 sm:px-8"
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h2 id="cookie-banner-title" className="text-base font-extrabold text-ink">
              {t('title')}
            </h2>
            <p id="cookie-banner-body" className="mt-1 text-sm leading-6 text-muted">
              {t('body')}
            </p>
            <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold">
              <Link href="/privacy-policy" className="text-sea underline decoration-mint decoration-2 underline-offset-4">
                {t('privacy')}
              </Link>
              <Link href="/cookie-policy" className="text-sea underline decoration-mint decoration-2 underline-offset-4">
                {t('cookies')}
              </Link>
            </p>
          </div>
          <div className="flex w-full gap-3 sm:w-80">
            <form action="/api/consent" method="post" className="flex flex-1">
              <input type="hidden" name="redirect" value={pathname} />
              <input type="hidden" name="choice" value="rejected" />
              <button type="submit" onClick={chooseWithoutNavigation(reject)} className={choiceButton}>
                {t('reject')}
              </button>
            </form>
            <form action="/api/consent" method="post" className="flex flex-1">
              <input type="hidden" name="redirect" value={pathname} />
              <input type="hidden" name="choice" value="accepted" />
              <button type="submit" onClick={chooseWithoutNavigation(accept)} className={choiceButton}>
                {t('accept')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
