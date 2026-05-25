'use client';
import { type InputHTMLAttributes, forwardRef, useState } from 'react';
import { Icon } from '@/components/ui';
import { cn } from '@/lib/cn';

export interface PasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  hint?: string;
  error?: string;
}

/** PasswordInput — input de contraseña con botón mostrar/ocultar. */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(
    {
      label,
      hint,
      error,
      required,
      className,
      onFocus,
      onBlur,
      placeholder = '••••••••',
      autoComplete = 'current-password',
      ...rest
    },
    ref
  ) {
    const [show, setShow] = useState(false);
    const [focus, setFocus] = useState(false);

    return (
      <label className="flex flex-col gap-1.5">
        {label && (
          <span className="font-display font-semibold text-[13px] text-text">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </span>
        )}
        <div
          className={cn(
            'flex items-center h-[52px] pl-4 pr-1.5 rounded-md bg-surface',
            'border-[1.5px] transition duration-base ease-out',
            error
              ? 'border-error'
              : focus
                ? 'border-brand-500 ring-4 ring-brand-500/15'
                : 'border-border-strong'
          )}
        >
          <input
            ref={ref}
            type={show ? 'text' : 'password'}
            placeholder={placeholder}
            autoComplete={autoComplete}
            required={required}
            aria-invalid={!!error}
            onFocus={(e) => {
              setFocus(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocus(false);
              onBlur?.(e);
            }}
            className={cn(
              'flex-1 min-w-0 h-full bg-transparent outline-none text-[15px]',
              className
            )}
            {...rest}
          />
          <button
            type="button"
            aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            aria-pressed={show}
            onClick={() => setShow(!show)}
            className="size-11 inline-flex items-center justify-center rounded-full bg-transparent border-0 text-text-soft cursor-pointer hover:text-text"
          >
            <Icon name="eye" size={18} strokeWidth={1.8} />
          </button>
        </div>
        {error ? (
          <span className="text-xs text-error inline-flex items-center gap-1">
            <Icon name="err" size={13} strokeWidth={2} /> {error}
          </span>
        ) : hint ? (
          <span className="text-xs text-text-soft">{hint}</span>
        ) : null}
      </label>
    );
  }
);
