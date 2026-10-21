import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InventarioCategoryCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string; strokeWidth?: number | string }>
  onClick?: () => void
  disabled?: boolean
}

/**
 * Tarjeta táctil del grid 2x2 en el Hub de Inventario
 * Fiel a las dimensiones y estilos de INVENTARIO.svg:
 * - Dimensiones: 163px x 92px de referencia, rx=11.5px (rounded-xl)
 * - Fondo: #FAF6F0, Borde: #4A4E4A
 * - Ícono centrado en color #316342
 * - Etiqueta inferior en font-sans font-medium text-sm text-[#4A4E4A]
 */
export const InventarioCategoryCard = React.forwardRef<
  HTMLDivElement,
  InventarioCategoryCardProps
>(({ id, label, icon: IconComponent, onClick, disabled = false, className, ...props }, ref) => {
  const isInteractive = Boolean(onClick && !disabled)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      onClick?.()
    }
  }

  return (
    <div
      ref={ref}
      id={`categoria-${id}`}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={disabled ? undefined : onClick}
      onKeyDown={handleKeyDown}
      aria-label={`Categoría ${label}`}
      aria-disabled={disabled}
      className={cn(
        // Dimensiones exactas del diseño de referencia: 163px de ancho, 92px de alto
        'group relative flex flex-col items-center justify-center',
        'w-full min-h-[92px] h-[92px] p-3 rounded-xl',
        'bg-[#FAF6F0] border border-[#4A4E4A]',
        'transition-all duration-150 select-none text-center',
        isInteractive &&
          'cursor-pointer hover:border-primary hover:bg-white/40 hover:shadow-sm active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        className,
      )}
      {...props}
    >
      {/* Ícono institucional centrado en color #316342 con grosor natural y proporcionado */}
      <div className="flex items-center justify-center w-8 h-8 shrink-0 text-[#316342] group-hover:scale-105 transition-transform duration-150">
        <IconComponent className="w-6 h-6 transition-transform" />
      </div>

      {/* Etiqueta de la categoría */}
      <span className="mt-1 font-sans text-sm font-medium text-[#4A4E4A] group-hover:text-primary transition-colors duration-150 leading-tight">
        {label}
      </span>
    </div>
  )
})

InventarioCategoryCard.displayName = 'InventarioCategoryCard'

export default InventarioCategoryCard
