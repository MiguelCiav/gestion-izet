import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SectionHeaderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Título de la sección (por defecto "SECCIÓN") */
  title?: React.ReactNode
  /** Subtítulo o descripción breve */
  subtitle?: React.ReactNode
  /** Conteo numérico o badge mostrado junto al título */
  count?: number | string
  /** Badge o elemento personalizado */
  badge?: React.ReactNode
  /** Acción a la derecha (ej. botón "Ver todos", enlace o icono) */
  action?: React.ReactNode
  /** Si la sección es colapsable */
  collapsible?: boolean
  /** Estado expandido (para modo controlado) */
  isExpanded?: boolean
  /** Callback al hacer click en el toggle */
  onToggle?: () => void
}

/**
 * SectionHeader - Encabezado de sección basado en `COMPONENT_SECTION.svg`.
 * Renderiza el título en fuente Serif (Literata) y la línea divisoria horizontal
 * de 2px con puntas redondeadas y opacidad del 20% (#181C1B / 0.2).
 */
export const SectionHeader = React.forwardRef<HTMLDivElement, SectionHeaderProps>(
  (
    {
      title = 'SECCIÓN',
      subtitle,
      count,
      badge,
      action,
      collapsible,
      isExpanded = true,
      onToggle,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn('flex flex-col gap-1 w-full', className)}
        {...props}
      >
        <div className="flex items-center gap-3 w-full min-h-[32px]">
          {/* Título en tipografía Serif (Literata) */}
          <div className="flex items-center gap-2.5 shrink-0">
            {typeof title === 'string' ? (
              <h2 className="font-serif font-bold text-lg md:text-xl tracking-wider uppercase text-text-main">
                {title}
              </h2>
            ) : (
              title
            )}

            {/* Contador */}
            {count !== undefined && (
              <span className="inline-flex items-center px-2 py-0 text-xs font-sans rounded-full bg-primary-light text-primary font-medium">
                {count}
              </span>
            )}
            {badge}
          </div>

          {/* Línea divisoria horizontal idéntica a COMPONENT_SECTION.svg:
              height: 2px, rounded-full (rx=1), fill: #181C1B con opacidad 0.2 */}
          <div
            className="h-0.5 flex-1 rounded-full bg-[#181C1B]/20"
            role="separator"
            aria-orientation="horizontal"
          />

          {/* Acción secundaria o botón de expandir/colapsar */}
          {(action || collapsible) && (
            <div className="flex items-center gap-2 shrink-0">
              {action}
              {collapsible && (
                <button
                  type="button"
                  onClick={onToggle}
                  className="p-1 rounded-lg hover:bg-black/5 text-text-muted hover:text-text-main transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
                  aria-expanded={isExpanded}
                  aria-label={isExpanded ? 'Colapsar sección' : 'Expandir sección'}
                >
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 transition-transform duration-200',
                      !isExpanded && '-rotate-90',
                    )}
                  />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Subtítulo opcional */}
        {subtitle && (
          <p className="text-xs md:text-sm text-text-muted font-sans pl-0.5">
            {subtitle}
          </p>
        )}
      </div>
    )
  },
)

SectionHeader.displayName = 'SectionHeader'

export interface SectionCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Título de la sección */
  title?: React.ReactNode
  /** Subtítulo o descripción breve */
  subtitle?: React.ReactNode
  /** Conteo numérico o badge mostrado junto al título */
  count?: number | string
  /** Badge o elemento personalizado */
  badge?: React.ReactNode
  /** Acción secundaria en el encabezado */
  action?: React.ReactNode
  /** Si la sección permite colapsar su contenido */
  collapsible?: boolean
  /** Si está expandido por defecto en modo colapsable */
  defaultExpanded?: boolean
  /** Estilo del contenedor: 'plain' (sin tarjeta exterior), 'card' (tarjeta con borde y fondo blanco), 'contained' */
  variant?: 'plain' | 'card' | 'contained'
  /** Clases personalizadas para el contenedor de contenido */
  contentClassName?: string
  /** Contenido agrupado (tarjetas ReactivoCard, listas, etc.) */
  children?: React.ReactNode
}

/**
 * SectionCard - Componente para agrupar tarjetas de reactivos y elementos de laboratorio
 * con el encabezado de diseño oficial `COMPONENT_SECTION.svg`.
 */
export const SectionCard = React.forwardRef<HTMLDivElement, SectionCardProps>(
  (
    {
      title = 'SECCIÓN',
      subtitle,
      count,
      badge,
      action,
      collapsible = false,
      defaultExpanded = true,
      variant = 'plain',
      className,
      contentClassName,
      children,
      ...props
    },
    ref,
  ) => {
    const [isExpanded, setIsExpanded] = React.useState(defaultExpanded)

    const handleToggle = () => {
      if (collapsible) {
        setIsExpanded((prev) => !prev)
      }
    }

    const variantStyles = {
      plain: 'w-full space-y-4',
      card: 'w-full bg-surface-card rounded-card border border-border-subtle p-5 md:p-6 space-y-4 transition-all',
      contained:
        'w-full bg-[#FAF7F2] rounded-card border border-border-subtle/80 p-5 md:p-6 space-y-4',
    }

    return (
      <section
        ref={ref}
        className={cn(variantStyles[variant], className)}
        {...props}
      >
        <SectionHeader
          title={title}
          subtitle={subtitle}
          count={count}
          badge={badge}
          action={action}
          collapsible={collapsible}
          isExpanded={isExpanded}
          onToggle={handleToggle}
        />

        {isExpanded && children && (
          <div
            className={cn(
              'pt-1 animate-in fade-in-50 duration-200',
              contentClassName,
            )}
          >
            {children}
          </div>
        )}
      </section>
    )
  },
)

SectionCard.displayName = 'SectionCard'
