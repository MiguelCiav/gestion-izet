import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

export const iconWrapperVariants = cva(
  'group inline-flex flex-col items-center justify-center select-none transition-all duration-200 outline-none',
  {
    variants: {
      active: {
        true: 'text-primary font-medium',
        false: 'text-[#655D52] hover:text-text-main font-normal',
      },
      size: {
        sm: 'gap-0.5 text-[11px]',
        default: 'gap-1 text-xs',
        lg: 'gap-1.5 text-sm',
      },
      disabled: {
        true: 'opacity-50 pointer-events-none cursor-not-allowed',
        false: 'cursor-pointer',
      },
    },
    defaultVariants: {
      active: false,
      size: 'default',
      disabled: false,
    },
  },
)

export const iconPillVariants = cva(
  'relative inline-flex items-center justify-center rounded-full transition-all duration-200 shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        primary: 'bg-primary text-primary-foreground',
        secondary: 'bg-primary-light text-primary',
        subtle: 'bg-primary/10 text-primary',
        ghost: 'bg-transparent',
      },
      active: {
        true: '',
        false: '',
      },
      size: {
        sm: 'h-5 w-10 [&>svg]:h-3.5 [&>svg]:w-3.5',
        // Medidas exactas de COMPONENTE_ICON_WRAPPER.svg: 52px de ancho x 24px de alto (rx=12px)
        default: 'h-6 w-[52px] [&>svg]:h-4 [&>svg]:w-4',
        lg: 'h-8 w-16 [&>svg]:h-5 [&>svg]:w-5',
      },
    },
    compoundVariants: [
      {
        variant: 'default',
        active: true,
        className: 'bg-primary/10 text-primary',
      },
      {
        variant: 'default',
        active: false,
        className: 'bg-transparent text-[#655D52] group-hover:bg-primary-light/40 group-hover:text-text-main',
      },
    ],
    defaultVariants: {
      variant: 'default',
      active: false,
      size: 'default',
    },
  },
)

export interface IconWrapperProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconPillVariants> {
  /** Ícono a envolver */
  icon?: React.ReactNode
  /** Etiqueta o texto inferior (ej: 'Inventario' en COMPONENTE_ICON_WRAPPER.svg) */
  label?: React.ReactNode
  /** Indicador o contador flotante (badge) */
  badge?: React.ReactNode
  /** Estado activo / seleccionado */
  active?: boolean
  /** Renderizar como contenedor div no interactivo */
  asDiv?: boolean
}

export const IconWrapper = React.forwardRef<
  HTMLButtonElement | HTMLDivElement,
  IconWrapperProps
>(
  (
    {
      className,
      icon,
      label,
      badge,
      active = false,
      variant = 'default',
      size = 'default',
      disabled = false,
      asDiv = false,
      type = 'button',
      children,
      ...props
    },
    ref,
  ) => {
    const iconContent = icon || children

    const content = (
      <>
        {/* Contenedor tipo píldora (52x24px en estado default según COMPONENTE_ICON_WRAPPER.svg) */}
        <div className={cn(iconPillVariants({ variant, active, size }))}>
          {iconContent}
          {badge && (
            <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-alert-danger-border px-1 text-[10px] font-bold text-white shadow-xs">
              {badge}
            </span>
          )}
        </div>

        {/* Texto opcional en la parte inferior */}
        {label && (
          <span className="font-sans leading-none tracking-normal transition-colors">
            {label}
          </span>
        )}
      </>
    )

    if (asDiv) {
      const { ...divProps } = props as React.HTMLAttributes<HTMLDivElement>
      return (
        <div
          ref={ref as React.Ref<HTMLDivElement>}
          className={cn(
            iconWrapperVariants({ active, size, disabled }),
            className,
          )}
          {...divProps}
        >
          {content}
        </div>
      )
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type}
        disabled={disabled}
        className={cn(
          iconWrapperVariants({ active, size, disabled }),
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          !disabled && 'active:scale-95',
          className,
        )}
        {...props}
      >
        {content}
      </button>
    )
  },
)

IconWrapper.displayName = 'IconWrapper'
