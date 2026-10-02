import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary';

const variants: Record<Variant, string> = {
  primary: 'bg-sea text-paper hover:bg-[#0c3340]',
  secondary: 'border border-line bg-paper text-ink hover:border-sea/40',
};

export function buttonClass(variant: Variant = 'primary', className = '') {
  return [
    'inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition',
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
