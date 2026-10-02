import Image from 'next/image';

type Props = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
};

export function ServiceImage({ src, alt, className = '', priority = false }: Props) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(min-width: 1024px) 720px, 100vw"
        className="object-cover"
      />
    </div>
  );
}
