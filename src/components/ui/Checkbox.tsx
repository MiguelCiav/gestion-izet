import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { CheckIcon } from '@/assets/icons'
import { cn } from '@/lib/utils'

export const checkboxBoxVariants = cva(
  'relative flex shrink-0 items-center justify-center border-2 transition-all duration-150 peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background',
  {
    variants: {
      variant: {
        default: [
          'border-[#C1C9BF] bg-surface-card',
          'peer-checked:border-primary peer-checked:bg-primary',
          'peer-indeterminate:border-primary peer-indeterminate:bg-primary',
        ],
        error: [
          'border-alert-danger-border bg-surface-card',
          'peer-checked:border-alert-danger-border peer-checked:bg-alert-danger-border',
          'peer-indeterminate:border-alert-danger-border peer-indeterminate:bg-alert-danger-border',
        ],
      },
      size: {
        sm: 'h-4 w-4 rounded-[3px]',
        // Exactamente 18x18px con rx=3px (rounded-[4px]) según COMPONENTE_CHECK.svg
        default: 'h-[18px] w-[18px] rounded-[4px]',
        lg: 'h-5 w-5 rounded-[4px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'>,
    VariantProps<typeof checkboxBoxVariants> {
  /** Texto o contenido que acompaña al checkbox (un solo nivel o reactivo) */
  label?: React.ReactNode
  /** Descripción o texto de ayuda secundario */
  description?: React.ReactNode
  /** Estado indeterminado para selecciones parciales */
  indeterminate?: boolean
  /** Estado o mensaje de error */
  error?: boolean | string
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      label,
      description,
      id,
      checked,
      defaultChecked,
      disabled,
      indeterminate,
      error,
      variant = error ? 'error' : 'default',
      size = 'default',
      onChange,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId()
    const inputId = id || generatedId
    const innerRef = React.useRef<HTMLInputElement>(null)

    React.useImperativeHandle(ref, () => innerRef.current!)

    React.useEffect(() => {
      if (innerRef.current) {
        innerRef.current.indeterminate = Boolean(indeterminate)
      }
    }, [indeterminate])

    const iconSizeClasses = {
      sm: 'h-3 w-3',
      default: 'h-3.5 w-3.5',
      lg: 'h-4 w-4',
    }[size || 'default']

    return (
      <div className={cn('inline-flex flex-col', className)}>
        <label
          htmlFor={inputId}
          className={cn(
            'group inline-flex items-center gap-3 select-none text-left',
            disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
          )}
        >
          <div className="relative flex items-center justify-center shrink-0">
            <input
              id={inputId}
              ref={innerRef}
              type="checkbox"
              checked={checked}
              defaultChecked={defaultChecked}
              disabled={disabled}
              onChange={onChange}
              className="peer sr-only"
              {...props}
            />

            {/* Caja cuadrada de 18x18px fiel a COMPONENTE_CHECK.svg */}
            <div
              className={cn(
                checkboxBoxVariants({ variant, size }),
                // Hover interactivo cuando no está deshabilitado
                !disabled &&
                  variant !== 'error' && [
                    'group-hover:border-primary/80',
                    'group-hover:peer-checked:border-primary-hover group-hover:peer-checked:bg-primary-hover',
                    'group-hover:peer-indeterminate:border-primary-hover group-hover:peer-indeterminate:bg-primary-hover',
                  ],
                // Reglas de visibilidad entre checkmark e indeterminate
                '[&>[data-checkbox-check]]:peer-checked:opacity-100',
                '[&>[data-checkbox-check]]:peer-indeterminate:opacity-0',
                '[&>[data-checkbox-dash]]:peer-indeterminate:opacity-100',
              )}
              aria-hidden="true"
            >
              {/* Ícono de checkmark blanco centrado */}
              <CheckIcon
                data-checkbox-check
                className={cn(
                  'pointer-events-none absolute inset-0 m-auto text-white opacity-0 transition-opacity duration-150',
                  iconSizeClasses,
                )}
              />

              {/* Ícono de guión blanco para estado indeterminado */}
              <svg
                data-checkbox-dash
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={cn(
                  'pointer-events-none absolute inset-0 m-auto text-white opacity-0 transition-opacity duration-150',
                  iconSizeClasses,
                )}
              >
                <path
                  d="M3 7H11"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {/* Texto de un solo nivel (label a la derecha según COMPONENTE_CHECK.svg) */}
          {label && (
            <span
              className={cn(
                'font-sans text-sm font-medium text-text-main transition-colors',
                !disabled && 'group-hover:text-primary',
              )}
            >
              {label}
            </span>
          )}
        </label>

        {/* Descripción secundaria opcional */}
        {description && (
          <p className="ml-7 text-xs text-text-muted mt-0.5">{description}</p>
        )}

        {/* Mensaje de error si se proporciona como string */}
        {typeof error === 'string' && (
          <p className="ml-7 text-xs text-alert-danger-border mt-0.5 font-medium">{error}</p>
        )}
      </div>
    )
  },
)

Checkbox.displayName = 'Checkbox'
