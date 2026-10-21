import * as React from 'react'
import { RadioCheckIcon } from '@/assets/icons'
import { cn } from '@/lib/utils'

export interface RadioButtonProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode
}

export const RadioButton = React.forwardRef<HTMLInputElement, RadioButtonProps>(
  ({ className, label, id, checked, defaultChecked, disabled, ...props }, ref) => {
    const generatedId = React.useId()
    const inputId = id || generatedId

    return (
      <label
        htmlFor={inputId}
        className={cn(
          'group inline-flex items-center gap-3 cursor-pointer select-none text-left',
          disabled && 'cursor-not-allowed opacity-50',
          className,
        )}
      >
        <div className="relative flex items-center justify-center shrink-0">
          <input
            id={inputId}
            ref={ref}
            type="radio"
            checked={checked}
            defaultChecked={defaultChecked}
            disabled={disabled}
            className="peer sr-only"
            {...props}
          />

          {/* Círculo base de 24x24 con aro perimetral de aislamiento en color de fondo (#FAF7F2/surface) */}
          <div
            className={cn(
              'relative h-6 w-6 rounded-full transition-colors duration-150 flex items-center justify-center',
              // Borde de separación perimetral de 2px
              'ring-2 ring-background',
              // Estado NO seleccionado (fill: #655D52)
              'bg-[#655D52] peer-hover:opacity-90',
              // Estado SELECCIONADO (fill: #4A7C59 / primary)
              'peer-checked:bg-primary',
              // Focus accesible
              'peer-focus-visible:ring-4 peer-focus-visible:ring-primary/30',
              // Regla directa: cuando el peer input está checked, sus hijos SVG [data-radio-check] se muestran
              '[&>[data-radio-check]]:peer-checked:opacity-100',
            )}
          >
            {/* Ícono de check blanco exacto al SVG de Figma */}
            <RadioCheckIcon
              data-radio-check
              className="absolute inset-0 h-6 w-6 text-white opacity-0 transition-opacity duration-150 pointer-events-none"
            />
          </div>
        </div>

        {/* Texto de un solo nivel */}
        {label && (
          <span className="font-sans text-sm font-medium text-text-main group-hover:text-primary transition-colors">
            {label}
          </span>
        )}
      </label>
    )
  },
)

RadioButton.displayName = 'RadioButton'
