import { ReactivoCard } from '@/components/ui/ReactivoCard'
import type { PrestamoReactivo } from '../types'
import { cn } from '@/lib/utils'

export interface PrestamosListProps {
  /** Colección de reactivos disponibles para solicitar préstamo */
  items: PrestamoReactivo[]
  /** Callback al hacer clic en una tarjeta de reactivo */
  onItemClick?: (item: PrestamoReactivo) => void
  /** Mensaje mostrado cuando la lista está vacía */
  emptyMessage?: string
  /** Clases CSS adicionales */
  className?: string
}

/**
 * Lista de Reactivos para Préstamos
 * Fiel a PRÉSTAMOS.svg:
 * - Tarjetas ReactivoCard con diseño plano, borde sutil y rombo NFPA 704 integrado a la derecha
 * - Barra lateral izquierda con acento verde institucional (#4A7C59)
 * - Títulos en fuente Serif (Literata) y detalles de stock en fuente Sans (Nunito)
 * - Espaciado vertical entre tarjetas de 20px (gap-5)
 */
export function PrestamosList({
  items,
  onItemClick,
  emptyMessage = 'No hay reactivos disponibles para préstamo.',
  className,
}: PrestamosListProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <p className="font-sans text-sm text-text-muted">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div
      role="list"
      aria-label="Lista de reactivos para préstamo"
      className={cn('flex flex-col gap-5 w-full items-center', className)}
    >
      {items.map((item) => (
        <ReactivoCard
          key={item.id}
          name={item.nombre}
          code={item.codigo}
          stock={item.stock}
          unit={item.unidad}
          details={item.detalles}
          location={item.ubicacion}
          expirationDate={item.fechaVencimiento}
          salud={item.salud ?? item.rombo?.health}
          inflamabilidad={item.inflamabilidad ?? item.rombo?.flammability}
          reactividad={item.reactividad ?? item.rombo?.reactivity}
          especial={item.especial ?? item.rombo?.special}
          rombo={item.rombo}
          showRombo={true}
          romboSize={54}
          onClick={onItemClick ? () => onItemClick(item) : undefined}
          className="w-full"
        />
      ))}
    </div>
  )
}

export default PrestamosList
