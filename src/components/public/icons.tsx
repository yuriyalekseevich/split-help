type IconProps = { className?: string };

export function WhatsAppIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="currentColor"
        d="M12.04 2C6.58 2 2.15 6.4 2.15 11.83c0 1.74.46 3.44 1.34 4.94L2 22l5.39-1.41a10 10 0 0 0 4.65 1.18h.01c5.46 0 9.89-4.4 9.89-9.83C21.94 6.4 17.5 2 12.04 2Zm5.76 14.15c-.24.68-1.4 1.3-1.94 1.38-.5.08-1.12.1-1.81-.11-.42-.13-.95-.31-1.63-.61-2.85-1.23-4.7-4.1-4.84-4.29-.14-.19-1.16-1.54-1.16-2.94s.73-2.09 1-2.37c.24-.26.55-.33.74-.33h.54c.18 0 .42-.06.65.5.24.57.82 2 .88 2.14.07.15.12.32.02.5-.1.19-.14.31-.28.48-.14.16-.29.36-.42.49-.13.13-.27.28-.12.54.16.27.7 1.16 1.5 1.88 1.04.93 1.92 1.22 2.19 1.35.27.14.42.12.58-.07.16-.19.67-.77.84-1.04.18-.26.35-.22.59-.13.23.08 1.5.71 1.76.84.26.13.43.19.49.3.07.1.07.61-.17 1.29Z"
      />
    </svg>
  );
}

export function TelegramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="currentColor"
        d="M21.5 4.4 2.7 11.2c-1.3.5-1.2 1.2-.2 1.5l4.8 1.5 1.9 5.8c.2.7.1.9.8.9.5 0 .7-.2 1-.5l2.6-2.5 5.4 4c1 .5 1.7.3 1.9-.9l3.5-16.2c.3-1.4-.5-2-1.9-1.4ZM8.8 14.6l9.3-5.8c.4-.3.8-.1.5.2l-7.7 7-.3 3.3-1.8-4.7Z"
      />
    </svg>
  );
}

export function FacebookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="currentColor"
        d="M14.2 21v-7.1h2.4l.4-2.8h-2.8V9.3c0-.8.2-1.4 1.4-1.4H17V5.4c-.3 0-1.1-.1-2.1-.1-2.1 0-3.5 1.3-3.5 3.6v2h-2.3v2.8H11.4V21h2.8Z"
      />
    </svg>
  );
}

export function EmailIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="currentColor"
        d="M3 6.8A2.8 2.8 0 0 1 5.8 4h12.4A2.8 2.8 0 0 1 21 6.8v10.4a2.8 2.8 0 0 1-2.8 2.8H5.8A2.8 2.8 0 0 1 3 17.2V6.8Zm2.2-.3 6.5 4.7c.2.1.5.1.7 0l6.4-4.7H5.2Zm13.6 1.6-5.7 4.2a2.4 2.4 0 0 1-2.9 0L4.4 8.1v9.1c0 .5.4.8.8.8h13.6c.4 0 .8-.3.8-.8V8.1Z"
      />
    </svg>
  );
}
