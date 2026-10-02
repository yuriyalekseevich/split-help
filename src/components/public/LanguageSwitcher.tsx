'use client';

import { locales, type Locale } from '@/lib/i18n';
import { Link, usePathname } from '@/i18n/navigation';

export function LanguageSwitcher({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  const pathname = usePathname();

  return (
    <nav aria-label={label}>
      <ul className="flex items-center text-xs font-semibold tracking-wide">
        {locales.map((code, index) => (
          <li key={code} className="flex items-center">
            {index > 0 ? (
              <span aria-hidden="true" className="px-1.5 text-line">
                |
              </span>
            ) : null}
            <Link
              href={pathname}
              locale={code}
              hrefLang={code}
              aria-current={code === locale ? 'page' : undefined}
              className={
                code === locale
                  ? 'text-ink'
                  : 'text-muted transition hover:text-ink'
              }
            >
              {code.toUpperCase()}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
