import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { PlusIcon } from '@/assets/icons'
import { cn } from '@/lib/utils'

export const floatingButtonVariants = cva(
  'relative inline-flex items-center justify-center rounded-full transition-all duration-200 select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none active:scale-95',
  {
    variants: {
      variant: {
        // Color #316342 y sombra exacta de COMPONENT_FLOATING_BUTTON.svg
        default:
          'bg-[#316342] text-white hover:bg-[#274f35] shadow-[0_4px_16px_rgba(46,50,48,0.2)] hover:shadow-[0_6px_20px_rgba(46,50,48,0.25)]',
        primary:
          'bg-primary text-primary-foreground hover:bg-primary-hover shadow-[0_4px_16px_rgba(68,110,83,0.25)] hover:shadow-[0_6px_20px_rgba(68,110,83,0.3)]',
        secondary:
          'bg-primary-light text-primary hover:bg-primary-light/80 shadow-md hover:shadow-lg',
      },
      size: {
        sm: 'h-11 w-11 [&>svg]:h-4 [&>svg]:w-4',
        // Medida exacta de 56x56px según COMPONENT_FLOATING_BUTTON.svg
        default: 'h-14 w-14 [&>svg]:h-5 [&>svg]:w-5',
        lg: 'h-16 w-16 [&>svg]:h-6 [&>svg]:w-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface FloatingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof floatingButtonVariants> {
  /** Texto o contenido de la tarjeta/tooltip (ej: 'Registrar reactivo' en COMPONENT_FLOATING_BUTTON.svg) */
  label?: React.ReactNode
  /** Ícono personalizado (por defecto usa el PlusIcon extraído de Figma) */
  icon?: React.ReactNode
  /** Posición de la etiqueta con respecto al botón circular */
  labelPosition?: 'left' | 'right'
  /** Si debe flotar fijo en la pantalla con posición fixed */
  fixed?: boolean
  /** Ubicación en pantalla cuando fixed={true} */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'none'
  /** Clase personalizada para el contenedor exterior */
  containerClassName?: string
}

export const FloatingButton = React.forwardRef<HTMLButtonElement, FloatingButtonProps>(
  (
    {
      className,
      containerClassName,
      label,
      icon,
      labelPosition = 'left',
      fixed = false,
      position = fixed ? 'bottom-right' : 'none',
      variant = 'default',
      size = 'default',
      disabled = false,
      onClick,
      'aria-label': ariaLabel,
      ...props
    },
    ref,
  ) => {
    const positionClasses: Record<string, string> = {
      'bottom-right': 'fixed bottom-6 right-6 z-50',
      'bottom-left': 'fixed bottom-6 left-6 z-50',
      'top-right': 'fixed top-6 right-6 z-50',
      'top-left': 'fixed top-6 left-6 z-50',
      none: '',
    }

    const defaultAriaLabel =
      ariaLabel || (typeof label === 'string' ? label : 'Acción flotante')

    // Contenido del ícono: por defecto el PlusIcon centrado
    const iconElement = icon || <PlusIcon className="h-5 w-5" />

    // Tarjeta/Píldora descriptiva de 30px de alto con sombra suave según COMPONENT_FLOATING_BUTTON.svg
    const labelCard = label ? (
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={(e) => {
          if (!disabled && onClick) {
            onClick(e as unknown as React.MouseEvent<HTMLButtonElement>)
          }
        }}
        onKeyDown={(e) => {
          if (!disabled && (e.key === 'Enter' || e.key === ' ') && onClick) {
            e.preventDefault()
            onClick(e as unknown as React.MouseEvent<HTMLButtonElement>)
          }
        }}
        className={cn(
          'flex h-[30px] items-center justify-center rounded-[4px] bg-white px-3.5 shadow-[0_4px_4px_rgba(0,0,0,0.05)] border border-black/[0.04]',
          'font-sans text-sm font-medium text-text-main whitespace-nowrap select-none transition-all duration-150',
          !disabled && 'cursor-pointer hover:bg-[#FAF7F2] active:scale-[0.98]',
          disabled && 'opacity-50 cursor-not-allowed',
        )}
      >
        {label}
      </div>
    ) : null

    return (
      <div
        className={cn(
          'inline-flex items-center gap-4',
          positionClasses[position] || '',
          labelPosition === 'right' && 'flex-row-reverse',
          containerClassName,
        )}
      >
        {/* Etiqueta a la izquierda según la disposición original de Figma */}
        {labelPosition === 'left' && labelCard}

        {/* Botón circular principal (56x56px, fill: #316342, sombra 4px/16px) */}
        <button
          ref={ref}
          type="button"
          disabled={disabled}
          onClick={onClick}
          aria-label={defaultAriaLabel}
          className={cn(floatingButtonVariants({ variant, size }), className)}
          {...props}
        >
          {iconElement}
        </button>

        {/* Etiqueta a la derecha si fue configurada */}
        {labelPosition === 'right' && labelCard}
      </div>
    )
  },
)

FloatingButton.displayName = 'FloatingButton'
