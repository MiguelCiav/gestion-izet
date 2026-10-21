import * as React from 'react'
import { cn } from '@/lib/utils'
import { RomboBadge, type RomboValues } from '@/components/ui/RomboBadge'

export interface ReactivoCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Nombre del reactivo (ej. "Reactivo Name", "Ácido Clorhídrico") */
  name: string
  /** Código de identificación (ej. "XX-123", "RC-049") */
  code?: string
  /** Cantidad disponible en stock (ej. "500ml", "100 g", 500) */
  stock?: string | number
  /** Unidad de medida (ej. "ml", "L", "g", "kg") */
  unit?: string
  /** Texto compuesto de detalles (alternativa directa a `code` y `stock`) */
  details?: string
  /** Ubicación física en el laboratorio (ej. "Estante 3", "Armario A") */
  location?: string
  /** Fecha de vencimiento (ej. "12/2026") */
  expirationDate?: string
  /** Valores del rombo NFPA 704 */
  rombo?: RomboValues
  /** Acceso directo a valores del rombo en español */
  salud?: number | string
  inflamabilidad?: number | string
  reactividad?: number | string
  especial?: string
  /** Mostrar u ocultar el rombo de seguridad (por defecto true) */
  showRombo?: boolean
  /** Tamaño del rombo en la tarjeta (por defecto 54px) */
  romboSize?: number | 'xs' | 'sm' | 'md'
  /** Estado seleccionado / activo */
  selected?: boolean
  /** Estado deshabilitado */
  disabled?: boolean
  /** Color de acento personalizado para la barra lateral izquierda (por defecto #4A7C59) */
  accentColor?: string
  /** Acción o componente secundario (ej. botón de menú, icono o checkbox) */
  action?: React.ReactNode
}

/**
 * Componente ReactivoCard
 * Fiel a COMPONENTE_REACTIVO.svg:
 * - Tarjeta limpia sin sombras (border sutil)
 * - Dimensiones de referencia: 342px de ancho, min-h de 92px, rx de 12px
 * - Barra lateral izquierda redondeada en color de acento (#4A7C59)
 * - Nombre en fuente Serif (Literata) y detalles en fuente Sans (Nunito)
 * - Rombo de seguridad NFPA 704 integrado a la derecha
 */
export const ReactivoCard = React.forwardRef<HTMLDivElement, ReactivoCardProps>(
  (
    {
      name,
      code,
      stock,
      unit,
      details,
      location,
      expirationDate,
      rombo,
      salud,
      inflamabilidad,
      reactividad,
      especial,
      showRombo = true,
      romboSize = 54,
      selected = false,
      disabled = false,
      accentColor = '#4A7C59',
      action,
      className,
      onClick,
      ...props
    },
    ref,
  ) => {
    const isInteractive = Boolean(onClick && !disabled)

    // Componer texto de detalles secundario ("Cod: XX-123 / Stock: 500ml")
    const formattedDetails = React.useMemo(() => {
      if (details) return details

      const parts: string[] = []
      if (code) {
        parts.push(`Cod: ${code}`)
      }
      if (stock !== undefined) {
        const stockText = unit ? `${stock}${unit}` : `${stock}`
        parts.push(`Stock: ${stockText}`)
      }
      return parts.join(' / ') || 'Sin información de stock'
    }, [details, code, stock, unit])

    // Valores para el RomboBadge
    const romboValues: RomboValues = {
      health: salud ?? rombo?.health,
      flammability: inflamabilidad ?? rombo?.flammability,
      reactivity: reactividad ?? rombo?.reactivity,
      special: especial ?? rombo?.special,
    }

    return (
      <div
        ref={ref}
        role={isInteractive ? 'button' : undefined}
        tabIndex={isInteractive ? 0 : undefined}
        onClick={disabled ? undefined : onClick}
        onKeyDown={
          isInteractive
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>)
                }
              }
            : undefined
        }
        className={cn(
          // Dimensiones base de referencia del SVG (342px x 92px) - Sin sombras
          'relative flex items-center justify-between min-h-[92px] w-full max-w-[342px] sm:max-w-none',
          'rounded-xl border border-border-subtle bg-surface-card text-text-main',
          'overflow-hidden px-4 py-3 transition-colors duration-150',
          isInteractive && 'cursor-pointer hover:border-primary/50',
          selected && 'ring-2 ring-primary border-primary bg-primary-light/10',
          disabled && 'opacity-60 cursor-not-allowed pointer-events-none',
          className,
        )}
        {...props}
      >
        {/* Barra de acento lateral izquierda basada en COMPONENTE_REACTIVO.svg:
            fill="#4A7C59", redondeada en el extremo izquierdo */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1.5 transition-colors"
          style={{ backgroundColor: accentColor }}
          aria-hidden="true"
        />

        {/* Sección de información (Izquierda) */}
        <div className="flex-1 min-w-0 pr-3 pl-1.5 space-y-1">
          <h4
            className="font-serif font-semibold text-base leading-tight text-text-main truncate"
            title={name}
          >
            {name}
          </h4>

          {/* Línea de código y stock */}
          <p className="font-sans text-xs text-text-muted leading-tight truncate">
            {formattedDetails}
          </p>

          {/* Metadatos adicionales opcionales */}
          {(location || expirationDate) && (
            <div className="flex flex-wrap items-center gap-2 pt-0.5 text-[11px] text-text-muted/80">
              {location && <span>Ubicación: {location}</span>}
              {location && expirationDate && <span>•</span>}
              {expirationDate && <span>Vence: {expirationDate}</span>}
            </div>
          )}
        </div>

        {/* Sección Derecha: Rombo NFPA y acción */}
        <div className="flex items-center gap-2 shrink-0">
          {action && <div className="shrink-0">{action}</div>}

          {showRombo && (
            <div className="shrink-0 flex items-center justify-center">
              <RomboBadge values={romboValues} size={romboSize} />
            </div>
          )}
        </div>
      </div>
    )
  },
)

ReactivoCard.displayName = 'ReactivoCard'

export default ReactivoCard
