'use client';

import { locales, type Locale } from '@/lib/i18n';
import { Link, usePathname } from '@/i18n/navigation';

export function LanguageSwitcher({
  locale,
  label,
  tone = 'dark',
}: {
  locale: Locale;
  label: string;
  tone?: 'dark' | 'light';
}) {
  const pathname = usePathname();
  const current = tone === 'light' ? 'text-white' : 'text-ink';
  const idle = tone === 'light' ? 'text-white/50 hover:text-white' : 'text-muted hover:text-ink';
  const divider = tone === 'light' ? 'text-white/30' : 'text-line';

  return (
    <nav aria-label={label}>
      <ul className="flex items-center text-xs font-semibold tracking-wide">
        {locales.map((code, index) => (
          <li key={code} className="flex items-center">
            {index > 0 ? (
              <span aria-hidden="true" className={`px-1.5 ${divider}`}>
                |
              </span>
            ) : null}
            <Link
              href={pathname}
              locale={code}
              hrefLang={code}
              aria-current={code === locale ? 'page' : undefined}
              className={code === locale ? current : `transition ${idle}`}
            >
              {code.toUpperCase()}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
