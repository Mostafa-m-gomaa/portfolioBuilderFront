import { forwardRef, useImperativeHandle, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getEmailValidationError } from '@/lib/emailValidation';
import { cn } from '@/lib/utils';

export type EmailInputHandle = {
  validate: () => boolean;
};

type EmailInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'onChange'
> & {
  className?: string;
  inputClassName?: string;
  onChange?: (value: string) => void;
};

export const EmailInput = forwardRef<EmailInputHandle, EmailInputProps>(function EmailInput(
  { className, inputClassName, value = '', onChange, onBlur, ...props },
  ref,
) {
  const { t } = useLanguage();
  const [error, setError] = useState<string | null>(null);

  const runValidate = (raw: string) => {
    const message = getEmailValidationError(String(raw), t);
    setError(message);
    return !message;
  };

  useImperativeHandle(ref, () => ({
    validate: () => runValidate(String(value)),
  }));

  return (
    <div className={className}>
      <input
        {...props}
        type="email"
        inputMode="email"
        autoComplete="email"
        value={value}
        aria-invalid={error ? true : undefined}
        onChange={(e) => {
          const next = e.target.value;
          onChange?.(next);
          if (error && !getEmailValidationError(next, t)) {
            setError(null);
          }
        }}
        onBlur={(e) => {
          onBlur?.(e);
          if (String(value).trim()) {
            runValidate(String(value));
          }
        }}
        className={cn(
          'w-full glass rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 bg-transparent',
          error && 'ring-2 ring-destructive/50 focus:ring-destructive/50',
          inputClassName,
        )}
      />
      {error ? (
        <p className="mt-1.5 text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
});
