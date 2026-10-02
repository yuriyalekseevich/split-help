import { Link } from '@/i18n/navigation';
import { ServiceImage } from './ServiceImage';

type Props = {
  href: string;
  title: string;
  description: string;
  priceHint?: string;
  imageUrl: string;
};

export function ServiceCard({
  href,
  title,
  description,
  priceHint,
  imageUrl,
}: Props) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-paper shadow-sm transition motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sea"
    >
      <ServiceImage
        src={imageUrl}
        alt=""
        className="aspect-[16/10] w-full"
      />
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-serif text-2xl leading-snug text-ink group-hover:text-sea">
          {title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-6 text-muted">{description}</p>
        {priceHint ? (
          <p className="mt-4 text-sm font-semibold text-sea">{priceHint}</p>
        ) : null}
      </div>
    </Link>
  );
}
