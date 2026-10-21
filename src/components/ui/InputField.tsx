import * as React from 'react'
import { EyeIcon, EyeOffIcon, SearchIcon } from '@/assets/icons'
import { cn } from '@/lib/utils'

export type InputFieldVariant = 'text' | 'password' | 'search'

export interface InputFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  variant?: InputFieldVariant
  label?: string
  error?: string
  hint?: string
}

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      variant = 'text',
      label,
      error,
      hint,
      className,
      disabled,
      id,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId()
    const inputId = id || generatedId
    const [showPassword, setShowPassword] = React.useState(false)

    const isPassword = variant === 'password'
    const isSearch = variant === 'search'

    const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : 'text'

    return (
      <div className="w-full space-y-1.5 font-sans">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'block text-sm font-medium text-text-main',
              disabled && 'opacity-60 cursor-not-allowed',
            )}
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          <input
            id={inputId}
            ref={ref}
            type={resolvedType}
            disabled={disabled}
            className={cn(
              'h-11 w-full rounded-input border bg-surface-card px-3.5 py-2 text-sm text-text-main shadow-sm transition-all',
              'placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary',
              'border-[#4A4E4A] hover:border-primary',
              isPassword && 'pr-11',
              isSearch && 'pr-11',
              error && 'border-alert-danger-border focus-visible:ring-alert-danger-border',
              disabled && 'bg-surface/50 border-border-subtle cursor-not-allowed opacity-60',
              className,
            )}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              tabIndex={-1}
              disabled={disabled}
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              className="absolute right-3 flex h-7 w-7 items-center justify-center text-text-main hover:text-primary transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none"
            >
              {showPassword ? (
                <EyeIcon className="h-5 w-5 shrink-0 block" />
              ) : (
                <EyeOffIcon className="h-5 w-5 shrink-0 block" />
              )}
            </button>
          )}

          {isSearch && (
            <div className="absolute right-3 pointer-events-none p-1 text-text-main">
              <SearchIcon className="h-5 w-5" />
            </div>
          )}
        </div>

        {error && (
          <p className="text-xs text-alert-danger-border font-medium">{error}</p>
        )}

        {hint && !error && (
          <p className="text-xs text-text-muted">{hint}</p>
        )}
      </div>
    )
  },
)

InputField.displayName = 'InputField'
