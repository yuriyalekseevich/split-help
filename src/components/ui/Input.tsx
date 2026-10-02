const fieldClass =
  'w-full rounded-2xl border border-line bg-paper px-4 py-3 text-base text-ink outline-none transition placeholder:text-muted/70 focus:border-sea focus:ring-2 focus:ring-sea/15';

type Props = {
  id: string;
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
};

export function Input({
  id,
  label,
  name,
  type = 'text',
  required,
  placeholder,
  autoComplete,
}: Props) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={fieldClass}
      />
    </div>
  );
}
