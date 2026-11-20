import { Link } from '@/i18n/navigation';
import type { UsefulInfo } from '@/lib/types/database';

export function RelatedGuides({ title, items }: { title: string; items: UsefulInfo[] }) {
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="related-guides-title" className="mt-10">
      <h2 id="related-guides-title" className="text-2xl text-ink">
        {title}
      </h2>
      <ul className="mt-4 overflow-hidden rounded-3xl border border-line bg-paper">
        {items.map((item) => (
          <li key={item.id} className="border-t border-line first:border-t-0">
            <Link
              href={`/info/${item.slug}`}
              className="group flex items-start justify-between gap-4 px-5 py-4 transition hover:bg-sea-soft focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-sea"
            >
              <span className="min-w-0">
                <span className="block font-semibold leading-6 break-words text-ink group-hover:text-sea">
                  {item.title}
                </span>
                {item.subtitle ? (
                  <span className="mt-1 block text-sm leading-6 break-words text-muted">{item.subtitle}</span>
                ) : null}
              </span>
              <span aria-hidden="true" className="mt-0.5 shrink-0 text-sea">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
