type Props = {
  src: string;
  alt: string;
  className?: string;
};

/** `src` is the address stored on the Supabase row. */
export function ServiceImage({ src, alt, className = '' }: Props) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Hosts come from the database, so these stay plain images. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="absolute inset-0 size-full object-cover" />
    </div>
  );
}
