import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'light';

const variants: Record<Variant, string> = {
  primary: 'bg-mint text-ink hover:bg-[#25c4b0]',
  secondary: 'border border-mint bg-transparent text-ink hover:bg-mint/15',
  light: 'bg-white text-ink hover:bg-night hover:text-white',
};

export function buttonClass(variant: Variant = 'primary', className = '') {
  return [
    'inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition duration-200 ease-out',
    'motion-safe:hover:scale-[1.03] motion-safe:active:scale-[0.98]',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea',
    'disabled:cursor-not-allowed disabled:opacity-60',
    variants[variant],
    className,
  ]
    .filter(Boolean)
    .join(' ');
}

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  children: ReactNode;
};

export function Button({
  variant = 'primary',
  className = '',
  type = 'button',
  children,
  ...props
}: Props) {
  return (
    <button type={type} className={buttonClass(variant, className)} {...props}>
      {children}
    </button>
  );
}
