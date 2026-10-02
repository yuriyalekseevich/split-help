import { Link } from '@/i18n/navigation';
import type { UsefulInfo } from '@/lib/types/database';

function cardLead(item: UsefulInfo): string {
  if (item.subtitle) return item.subtitle;
  const text = item.description.replace(/\s+/g, ' ').trim();
  return text.length > 160 ? `${text.slice(0, 157)}…` : text;
}

export function UsefulInfoList({ items }: { items: UsefulInfo[] }) {
  return (
    <ul className="mt-8 grid gap-5 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item.id} className="h-full">
          <Link
            href={`/info/${item.id}`}
            className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-paper shadow-sm transition motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sea"
          >
            {item.image_url ? (
              <span className="block aspect-[16/9] overflow-hidden bg-sea-soft">
                {/* The title below names the link, so the image stays decorative. */}
                {/* Host is chosen per row. The image optimizer would need an open remote allowlist. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image_url} alt="" className="h-full w-full object-cover" />
              </span>
            ) : null}
            <span className="flex flex-1 flex-col p-5">
              <h2 className="font-serif text-2xl leading-snug break-words text-ink group-hover:text-sea">
                {item.title}
              </h2>
              <p className="mt-2 text-sm leading-6 break-words text-muted">{cardLead(item)}</p>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
