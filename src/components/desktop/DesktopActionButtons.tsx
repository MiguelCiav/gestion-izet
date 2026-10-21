import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

export type DesktopActionVariant = 'filter' | 'export' | 'new'

/* -------------------------------------------------------------------------- */
/*                                Íconos SVG                                  */
/* -------------------------------------------------------------------------- */

/**
 * Ícono de filtros / sliders de escritorio extraído de COMPONENT_FILTRAR.svg
 */
export function DesktopFilterIcon({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>): React.JSX.Element {
  return (
    <svg
      width="24"
      height="22"
      viewBox="43 34 26 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0', className)}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M44.3 36.75H67.7M44.3 45H59.9M44.3 53.25H52.1"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M61.2 36.75C61.2 38.2678 62.3651 39.5 63.8 39.5C65.2349 39.5 66.4 38.2678 66.4 36.75C66.4 35.2322 65.2349 34 63.8 34C62.3651 34 61.2 35.2322 61.2 36.75Z"
        fill="currentColor"
      />
      <path
        d="M53.4 45C53.4 46.5178 54.565 47.75 56 47.75C57.4349 47.75 58.6 46.5178 58.6 45C58.6 43.4822 57.4349 42.25 56 42.25C54.565 42.25 53.4 43.4822 53.4 45Z"
        fill="currentColor"
      />
      <path
        d="M45.6 53.25C45.6 54.7677 46.765 56 48.2 56C49.635 56 50.8 54.7677 50.8 53.25C50.8 51.7323 49.635 50.5 48.2 50.5C46.765 50.5 45.6 51.7323 45.6 53.25Z"
        fill="currentColor"
      />
    </svg>
  )
}

/**
 * Ícono de exportación de reporte / documento extraído de COMPONENT_FILTRAR.svg
 */
export function DesktopExportIcon({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>): React.JSX.Element {
  return (
    <svg
      width="20"
      height="25"
      viewBox="40 101 22 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0', className)}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M61.6777 107.239L55.6277 101.316C55.4209 101.113 55.1415 101 54.85 101H42.2C40.9845 101 40 101.964 40 103.154V126.846C40 128.036 40.9845 129 42.2 129H59.8C61.0155 129 62 128.036 62 126.846V108C62 107.715 61.8845 107.441 61.6777 107.239ZM53.2 123.615H45.5C44.8928 123.615 44.4 123.133 44.4 122.538C44.4 121.944 44.8928 121.462 45.5 121.462H53.2C53.8072 121.462 54.3 121.944 54.3 122.538C54.3 123.133 53.8072 123.615 53.2 123.615ZM56.5 119.308H45.5C44.8928 119.308 44.4 118.825 44.4 118.231C44.4 117.636 44.8928 117.154 45.5 117.154H56.5C57.1072 117.154 57.6 117.636 57.6 118.231C57.6 118.825 57.1072 119.308 56.5 119.308ZM56.5 115H45.5C44.8928 115 44.4 114.518 44.4 113.923C44.4 113.329 44.8928 112.846 45.5 112.846H56.5C57.1072 112.846 57.6 113.329 57.6 113.923C57.6 114.518 57.1072 115 56.5 115ZM55.4 108.538C54.7928 108.538 54.3 108.056 54.3 107.462V103.05L59.9056 108.538H55.4Z"
        fill="currentColor"
      />
    </svg>
  )
}

/**
 * Ícono de creación / suma circular extraído de COMPONENT_FILTRAR.svg
 */
export function DesktopNewIcon({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>): React.JSX.Element {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 90 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0', className)}
      aria-hidden="true"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M45 9C25.1177 9 9 25.1177 9 45C9 64.8823 25.1177 81 45 81C64.8823 81 81 64.8823 81 45C81 25.1177 64.8823 9 45 9ZM42 27V42H27V48H42V63H48V48H63V42H48V27H42Z"
        fill="currentColor"
      />
    </svg>
  )
}

/* -------------------------------------------------------------------------- */
/*                         Variantes y Estilos CVA                            */
/* -------------------------------------------------------------------------- */

export const desktopActionButtonVariants = cva(
  'inline-flex items-center justify-center gap-3 font-sans font-semibold text-base whitespace-nowrap select-none cursor-pointer border-2 border-[#4A7C59] text-[#4A7C59] rounded-[15px] transition-all duration-150 ease-in-out hover:bg-[#4A7C59]/10 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:active:scale-100',
  {
    variants: {
      variant: {
        filter: 'min-w-[130px] h-12 px-5',
        export: 'min-w-[140px] h-12 px-5',
        new: 'min-w-[130px] h-12 px-5',
      },
      bgVariant: {
        transparent: 'bg-transparent',
        surface: 'bg-[#FAF6F0]',
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },
    },
    defaultVariants: {
      variant: 'filter',
      bgVariant: 'transparent',
      fullWidth: false,
    },
  },
)

/* -------------------------------------------------------------------------- */
/*                     Componente Principal Unificado                         */
/* -------------------------------------------------------------------------- */

const defaultLabels: Record<DesktopActionVariant, string> = {
  filter: 'Filtrar',
  export: 'Exportar',
  new: 'Nuevo',
}

export interface DesktopActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof desktopActionButtonVariants> {
  variant?: DesktopActionVariant
  label?: React.ReactNode
  icon?: React.ReactNode
  showIcon?: boolean
}

export const DesktopActionButton = React.forwardRef<
  HTMLButtonElement,
  DesktopActionButtonProps
>(
  (
    {
      variant = 'filter',
      bgVariant,
      fullWidth,
      label,
      icon,
      showIcon = true,
      className,
      children,
      type = 'button',
      ...props
    },
    ref,
  ) => {
    const renderDefaultIcon = () => {
      switch (variant) {
        case 'export':
          return <DesktopExportIcon className="w-5 h-6 text-current" />
        case 'new':
          return <DesktopNewIcon className="w-6 h-6 text-current" />
        case 'filter':
        default:
          return <DesktopFilterIcon className="w-6 h-5 text-current" />
      }
    }

    const iconContent = icon !== undefined ? icon : renderDefaultIcon()
    const textContent = children ?? label ?? defaultLabels[variant]

    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          desktopActionButtonVariants({ variant, bgVariant, fullWidth, className }),
        )}
        {...props}
      >
        {showIcon && iconContent && (
          <span className="inline-flex shrink-0 items-center justify-center">
            {iconContent}
          </span>
        )}
        <span>{textContent}</span>
      </button>
    )
  },
)

DesktopActionButton.displayName = 'DesktopActionButton'

/* -------------------------------------------------------------------------- */
/*                       Componentes de Conveniencia                          */
/* -------------------------------------------------------------------------- */

export interface DesktopFilterButtonProps
  extends Omit<DesktopActionButtonProps, 'variant'> {}

export const DesktopFilterButton = React.forwardRef<
  HTMLButtonElement,
  DesktopFilterButtonProps
>((props, ref) => {
  return <DesktopActionButton ref={ref} variant="filter" {...props} />
})

DesktopFilterButton.displayName = 'DesktopFilterButton'

export interface DesktopExportButtonProps
  extends Omit<DesktopActionButtonProps, 'variant'> {}

export const DesktopExportButton = React.forwardRef<
  HTMLButtonElement,
  DesktopExportButtonProps
>((props, ref) => {
  return <DesktopActionButton ref={ref} variant="export" {...props} />
})

DesktopExportButton.displayName = 'DesktopExportButton'

export interface DesktopNewButtonProps
  extends Omit<DesktopActionButtonProps, 'variant'> {}

export const DesktopNewButton = React.forwardRef<
  HTMLButtonElement,
  DesktopNewButtonProps
>((props, ref) => {
  return <DesktopActionButton ref={ref} variant="new" {...props} />
})

DesktopNewButton.displayName = 'DesktopNewButton'

/* -------------------------------------------------------------------------- */
/*                       Toolbar Contenedor Desktop                           */
/* -------------------------------------------------------------------------- */

export interface DesktopActionToolbarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  align?: 'left' | 'center' | 'right' | 'between'
}

export const DesktopActionToolbar = React.forwardRef<
  HTMLDivElement,
  DesktopActionToolbarProps
>(({ className, children, align = 'left', role = 'toolbar', ...props }, ref) => {
  const alignClass = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between',
  }[align]

  return (
    <div
      ref={ref}
      role={role}
      className={cn('flex items-center gap-4 flex-wrap', alignClass, className)}
      {...props}
    >
      {children}
    </div>
  )
})

DesktopActionToolbar.displayName = 'DesktopActionToolbar'
