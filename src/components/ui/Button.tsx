import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2.5 whitespace-nowrap font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer',
  {
    variants: {
      variant: {
        // Variante primaria según COMPONENTE_BOTON.svg (#4A7C59 / #446E53)
        default:
          'bg-primary text-primary-foreground hover:bg-primary-hover active:scale-[0.99]',
        // Variante outline según COMPONENTE_BOTON.svg (border #4A4E4A)
        outline:
          'border border-border bg-transparent text-text-main hover:bg-primary-light/40 hover:border-primary active:scale-[0.99]',
        // Variantes complementarias del design system
        secondary:
          'bg-primary-light text-primary hover:bg-primary-light/80 active:scale-[0.99]',
        ghost:
          'text-text-main hover:bg-primary-light/40 active:scale-[0.99]',
        danger:
          'bg-alert-danger-bg text-alert-danger-border border border-alert-danger-border hover:opacity-90 active:scale-[0.99]',
      },
      size: {
        sm: 'h-9 px-4 text-xs rounded-full',
        // Tamaño base de 44px
        default: 'h-11 px-6 text-sm rounded-full',
        // Tamaño principal de Figma: h=60px, rounded-[24px], texto legible
        lg: 'h-[60px] px-8 text-base font-semibold rounded-[24px]',
        icon: 'h-11 w-11 rounded-full p-0',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      fullWidth: false,
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, leftIcon, rightIcon, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        {...props}
      >
        {leftIcon && <span className="inline-flex shrink-0 items-center">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="inline-flex shrink-0 items-center">{rightIcon}</span>}
      </button>
    )
  },
)

Button.displayName = 'Button'
