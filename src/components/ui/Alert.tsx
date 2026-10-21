import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import {
  AlertTriangleIcon,
  AlertCircleIcon,
} from '@/assets/icons'

const alertVariants = cva(
  'relative w-full rounded-input border-l-4 transition-all flex items-center justify-between gap-3 px-4 py-3 min-h-[58px]',
  {
    variants: {
      variant: {
        warning:
          'bg-alert-warning-bg border-l-alert-warning-border text-text-main',
        danger:
          'bg-alert-danger-bg border-l-alert-danger-border text-text-main',
      },
    },
    defaultVariants: {
      variant: 'warning',
    },
  },
)

const variantIconMap = {
  warning: AlertTriangleIcon,
  danger: AlertCircleIcon,
}

const variantIconColorMap = {
  warning: 'text-alert-warning-border',
  danger: 'text-alert-danger-border',
}

export const AlertTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn(
      'font-sans font-semibold text-sm leading-tight text-text-main',
      className,
    )}
    {...props}
  />
))
AlertTitle.displayName = 'AlertTitle'

export const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      'font-sans text-xs text-text-muted mt-1 leading-normal',
      className,
    )}
    {...props}
  />
))
AlertDescription.displayName = 'AlertDescription'

export interface AlertProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>,
    VariantProps<typeof alertVariants> {
  title?: React.ReactNode
  description?: React.ReactNode
  icon?: React.ReactNode | null
  showIcon?: boolean
  iconPosition?: 'left' | 'right'
}

/**
 * Componente Alert
 * Fiel a COMPONENTE_ALERT.svg:
 * - Variantes oficiales del tema: warning y danger
 * - Icono en el extremo izquierdo o derecho
 * - Sin botones de borrado o descarte
 */
export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      className,
      variant = 'warning',
      title,
      description,
      icon,
      showIcon = true,
      iconPosition = 'left',
      children,
      role = 'alert',
      ...props
    },
    ref,
  ) => {
    const activeVariant = variant ?? 'warning'
    const DefaultIcon = variantIconMap[activeVariant]
    const iconColor = variantIconColorMap[activeVariant]

    let renderedIcon: React.ReactNode = null
    if (showIcon) {
      if (icon !== undefined) {
        renderedIcon = icon
      } else if (DefaultIcon) {
        renderedIcon = <DefaultIcon className={cn('h-5 w-5', iconColor)} />
      }
    }

    const hasDescription = Boolean(description || children)

    return (
      <div
        ref={ref}
        role={role}
        className={cn(
          alertVariants({ variant: activeVariant }),
          hasDescription ? 'items-start' : 'items-center',
          className,
        )}
        {...props}
      >
        {iconPosition === 'left' && renderedIcon && (
          <div className={cn('shrink-0 mr-1', hasDescription && 'mt-0.5')}>
            {renderedIcon}
          </div>
        )}

        <div className="flex-1 min-w-0">
          {title && <AlertTitle>{title}</AlertTitle>}
          {description && <AlertDescription>{description}</AlertDescription>}
          {children}
        </div>

        {iconPosition === 'right' && renderedIcon && (
          <div className={cn('shrink-0 ml-3', hasDescription && 'mt-0.5')}>
            {renderedIcon}
          </div>
        )}
      </div>
    )
  },
)

Alert.displayName = 'Alert'

export default Alert
