import type { ChangeEvent } from 'react';

const fieldClass =
  'w-full rounded-2xl border border-line bg-paper px-4 py-3 text-base text-ink outline-none transition placeholder:text-muted/70 focus:border-sea focus:ring-2 focus:ring-sea/15';

type Props = {
  id: string;
  label: string;
  name?: string;
  hint?: string;
  required?: boolean;
  placeholder?: string;
  rows?: number;
  value?: string;
  onChange?: (value: string) => void;
};

export function Textarea({
  id,
  label,
  name,
  hint,
  required,
  placeholder,
  rows = 4,
  value,
  onChange,
}: Props) {
  const controlled =
    value !== undefined
      ? {
          value,
          onChange: (event: ChangeEvent<HTMLTextAreaElement>) =>
            onChange?.(event.target.value),
        }
      : {};

  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label}
        </label>
        {hint ? <span className="text-xs text-muted">{hint}</span> : null}
      </div>
      <textarea
        id={id}
        name={name}
        required={required}
        rows={rows}
        placeholder={placeholder}
        className={fieldClass}
        {...controlled}
      />
    </div>
  );
}
