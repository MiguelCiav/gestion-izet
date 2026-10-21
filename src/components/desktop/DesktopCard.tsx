import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const desktopCardVariants = cva(
  'w-full rounded-[16px] transition-all',
  {
    variants: {
      variant: {
        /**
         * Variante oficial fiel a `COMPONENTE_CARD.svg`:
         * Fondo #FAF6F0, borde de 2px en #655D52/40 con acabado nítido y sombra proyectada suave y transparente.
         */
        default:
          'bg-[#FAF6F0] border-2 border-[#655D52]/40 shadow-[4px_4px_6px_0px_rgba(0,0,0,0.08)]',
        /**
         * Variante plana con el mismo fondo y borde, pero sin sombra.
         */
        flat: 'bg-[#FAF6F0] border-2 border-[#655D52]/40 shadow-none',
        /**
         * Variante sutil con borde fino y fondo de tarjeta.
         */
        outline: 'bg-[#FAF6F0] border border-border-subtle shadow-none',
        /**
         * Variante elevada con mayor profundidad de sombra para modales o superposiciones.
         */
        elevated: 'bg-[#FAF6F0] border-2 border-[#655D52]/40 shadow-lg',
      },
      padding: {
        none: 'p-0',
        sm: 'p-4 sm:p-6',
        default: 'px-6 py-8 sm:px-12 sm:py-10 md:px-14 md:py-12',
        lg: 'px-8 py-10 sm:px-16 sm:py-14 md:px-20 md:py-16',
      },
      maxWidth: {
        default: 'max-w-[540px]',
        sm: 'max-w-md',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'default',
      maxWidth: 'default',
    },
  },
)

export interface DesktopCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof desktopCardVariants> {}

/**
 * DesktopCard - Tarjeta / contenedor genérico para vistas de escritorio.
 *
 * Basado fielmente en el diseño de `src/DESKTOP_CARD/COMPONENTE_CARD.svg`:
 * - Contenedor con ancho amplio (`max-w-[540px]`)
 * - Esquinas redondeadas de 16px (`rounded-[16px]`)
 * - Fondo cálido institucional `#FAF6F0`
 * - Borde nítido de 2px `border-2 border-[#655D52]/40`
 * - Sombra proyectada suave y translúcida (`shadow-[4px_4px_6px_0px_rgba(0,0,0,0.08)]`)
 */
export const DesktopCard = React.forwardRef<HTMLDivElement, DesktopCardProps>(
  ({ className, variant, padding, maxWidth, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(desktopCardVariants({ variant, padding, maxWidth, className }))}
        {...props}
      >
        {children}
      </div>
    )
  },
)
DesktopCard.displayName = 'DesktopCard'

export interface DesktopCardHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * DesktopCardHeader - Cabecera modular de la tarjeta con espaciado vertical
 * y alineación centrada por defecto para títulos y descripciones.
 */
export const DesktopCardHeader = React.forwardRef<
  HTMLDivElement,
  DesktopCardHeaderProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-2 text-center mb-6', className)}
    {...props}
  />
))
DesktopCardHeader.displayName = 'DesktopCardHeader'

export interface DesktopCardTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

/**
 * DesktopCardTitle - Título principal con tipografía Serif (`font-serif`)
 * en color primario institucional (`text-primary`), negrita y tracking ajustado.
 */
export const DesktopCardTitle = React.forwardRef<
  HTMLHeadingElement,
  DesktopCardTitleProps
>(({ className, as: Component = 'h2', ...props }, ref) => (
  <Component
    ref={ref}
    className={cn(
      'font-serif text-2xl font-bold text-primary tracking-tight',
      className,
    )}
    {...props}
  />
))
DesktopCardTitle.displayName = 'DesktopCardTitle'

export interface DesktopCardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

/**
 * DesktopCardDescription - Subtítulo o texto descriptivo en tipografía Sans (`font-sans`),
 * tamaño de texto legible (`text-sm`) y color `#4A4E4A`.
 */
export const DesktopCardDescription = React.forwardRef<
  HTMLParagraphElement,
  DesktopCardDescriptionProps
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('font-sans text-sm text-[#4A4E4A] leading-relaxed', className)}
    {...props}
  />
))
DesktopCardDescription.displayName = 'DesktopCardDescription'

export interface DesktopCardContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * DesktopCardContent - Contenedor central para el contenido principal (formularios,
 * listas, inputs o widgets), con espaciado vertical configurable (`space-y-4`).
 */
export const DesktopCardContent = React.forwardRef<
  HTMLDivElement,
  DesktopCardContentProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('w-full space-y-4', className)}
    {...props}
  />
))
DesktopCardContent.displayName = 'DesktopCardContent'

export interface DesktopCardFooterProps
  extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * DesktopCardFooter - Espacio inferior para botones de acción o enlaces secundarios,
 * con disposición flexible y espaciado superior (`pt-6`).
 */
export const DesktopCardFooter = React.forwardRef<
  HTMLDivElement,
  DesktopCardFooterProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col gap-3 pt-6 w-full items-center', className)}
    {...props}
  />
))
DesktopCardFooter.displayName = 'DesktopCardFooter'

export default DesktopCard
