import { Link } from '@/i18n/navigation';
import { buttonClass } from '@/components/ui/Button';
import { ServiceImage } from './ServiceImage';

type Props = {
  href: string;
  title: string;
  description: string;
  moreLabel: string;
  priceDescription?: string | null;
  imageUrl: string;
  reverse?: boolean;
};

export function ServiceCard({
  href,
  title,
  description,
  moreLabel,
  priceDescription,
  imageUrl,
  reverse = false,
}: Props) {
  return (
    <Link
      href={href}
      className="group grid items-center gap-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-sea lg:grid-cols-2 lg:gap-16"
    >
      <ServiceImage
        src={imageUrl}
        alt=""
        className={`aspect-[16/10] w-full rounded-[1.75rem] [&_img]:transition [&_img]:duration-700 group-hover:[&_img]:scale-105 ${
          reverse ? 'lg:order-2' : ''
        }`}
      />
      <div className={reverse ? 'lg:order-1' : ''}>
        {priceDescription ? (
          <p className="text-sm font-semibold text-sea">{priceDescription}</p>
        ) : null}
        <h3 className="mt-3 text-3xl leading-tight text-ink sm:text-4xl">{title}</h3>
        <p className="mt-4 max-w-xl text-base leading-7 text-muted">{description}</p>
        <span className={buttonClass('secondary', 'mt-6')}>{moreLabel}</span>
      </div>
    </Link>
  );
}
