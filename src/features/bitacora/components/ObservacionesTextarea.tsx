import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ObservacionesTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const ObservacionesTextarea = React.forwardRef<
  HTMLTextAreaElement,
  ObservacionesTextareaProps
>(({ className, label, error, id, disabled, placeholder = 'Observaciones', rows = 5, ...props }, ref) => {
  const generatedId = React.useId()
  const textareaId = id || generatedId

  return (
    <div className="w-full space-y-1.5 font-sans">
      {label && (
        <label
          htmlFor={textareaId}
          className={cn(
            'block text-sm font-medium text-text-main',
            disabled && 'opacity-60 cursor-not-allowed',
          )}
        >
          {label}
        </label>
      )}

      <textarea
        id={textareaId}
        ref={ref}
        rows={rows}
        disabled={disabled}
        placeholder={placeholder}
        aria-label={label || placeholder}
        className={cn(
          'w-full min-h-[135px] rounded-input border border-[#4A4E4A] bg-white p-3 font-sans text-sm text-text-main shadow-sm transition-all',
          'placeholder:text-text-muted hover:border-primary',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary',
          'resize-none',
          error && 'border-alert-danger-border focus-visible:ring-alert-danger-border',
          disabled && 'bg-surface/50 border-border-subtle cursor-not-allowed opacity-60',
          className,
        )}
        {...props}
      />

      {error && (
        <p className="text-xs text-alert-danger-border font-medium">{error}</p>
      )}
    </div>
  )
})

ObservacionesTextarea.displayName = 'ObservacionesTextarea'
