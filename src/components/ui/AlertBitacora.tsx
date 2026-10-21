import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const alertBitacoraVariants = cva(
  'relative w-full rounded-input border-l-4 bg-surface-card border border-border-subtle/50 shadow-sm transition-all px-4 py-3 min-h-[58px] flex gap-3 text-text-main',
  {
    variants: {
      variant: {
        warning: 'border-l-alert-warning-border',
        danger: 'border-l-alert-danger-border',
        success: 'border-l-primary',
        info: 'border-l-[#2E6F8E]',
        neutral: 'border-l-border-subtle',
      },
    },
    defaultVariants: {
      variant: 'warning',
    },
  },
)

export const AlertBitacoraTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h6
    ref={ref}
    className={cn(
      'font-sans font-semibold text-sm leading-snug text-text-main',
      className,
    )}
    {...props}
  />
))
AlertBitacoraTitle.displayName = 'AlertBitacoraTitle'

export const AlertBitacoraDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      'font-sans text-xs text-text-muted mt-0.5 leading-normal',
      className,
    )}
    {...props}
  />
))
AlertBitacoraDescription.displayName = 'AlertBitacoraDescription'

export interface AlertBitacoraProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>,
    VariantProps<typeof alertBitacoraVariants> {
  title?: React.ReactNode
  description?: React.ReactNode
  timestamp?: React.ReactNode
  user?: React.ReactNode
  badge?: React.ReactNode
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  indicatorColor?: string
  isInteractive?: boolean
}

export const AlertBitacora = React.forwardRef<
  HTMLDivElement,
  AlertBitacoraProps
>(
  (
    {
      className,
      variant = 'warning',
      title,
      description,
      timestamp,
      user,
      badge,
      icon,
      iconPosition = 'left',
      indicatorColor,
      isInteractive,
      onClick,
      style,
      children,
      role = 'article',
      ...props
    },
    ref,
  ) => {
    const isClickable = Boolean(onClick || isInteractive)
    const hasDetails = Boolean(
      description || user || timestamp || (children && title),
    )

    return (
      <div
        ref={ref}
        role={role}
        tabIndex={isClickable ? 0 : undefined}
        onClick={onClick}
        onKeyDown={
          isClickable && onClick
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onClick(e as unknown as React.MouseEvent<HTMLDivElement>)
                }
              }
            : undefined
        }
        className={cn(
          alertBitacoraVariants({ variant }),
          hasDetails ? 'items-start' : 'items-center',
          isClickable &&
            'cursor-pointer hover:bg-primary-light/20 hover:shadow-md active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
          className,
        )}
        style={
          indicatorColor
            ? { borderLeftColor: indicatorColor, ...style }
            : style
        }
        {...props}
      >
        {icon && iconPosition === 'left' && (
          <div
            className={cn(
              'shrink-0 text-text-muted',
              hasDetails ? 'mt-0.5' : 'self-center',
            )}
            aria-hidden="true"
          >
            {icon}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            {title && <AlertBitacoraTitle>{title}</AlertBitacoraTitle>}
            {badge && <div className="shrink-0">{badge}</div>}
          </div>

          {description && (
            <AlertBitacoraDescription>{description}</AlertBitacoraDescription>
          )}

          {(user || timestamp) && (
            <div className="flex items-center gap-2.5 mt-1.5 text-xs text-text-muted">
              {user && (
                <span className="inline-flex items-center gap-1 font-medium text-text-main/80">
                  {user}
                </span>
              )}
              {user && timestamp && (
                <span className="text-border-subtle" aria-hidden="true">
                  •
                </span>
              )}
              {timestamp && <span>{timestamp}</span>}
            </div>
          )}

          {children}
        </div>

        {icon && iconPosition === 'right' && (
          <div
            className={cn(
              'shrink-0 text-text-muted ml-2',
              hasDetails ? 'mt-0.5' : 'self-center',
            )}
            aria-hidden="true"
          >
            {icon}
          </div>
        )}
      </div>
    )
  },
)

AlertBitacora.displayName = 'AlertBitacora'
