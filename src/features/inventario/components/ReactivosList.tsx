import { ReactivoCard } from '@/components/ui/ReactivoCard'
import type { ReactivoItem } from '../types'
import { cn } from '@/lib/utils'

export interface ReactivosListProps {
  items: ReactivoItem[]
  onItemClick?: (item: ReactivoItem) => void
  selectedId?: string
  className?: string
  emptyMessage?: string
}

/**
 * Lista de tarjetas de reactivos según INVENTARIO _ REACTIVOS.svg:
 * - Espaciado vertical de 20px (space-y-5)
 * - Tarjetas ReactivoCard con diseño plano, borde sutil y rombo NFPA integrado
 */
export function ReactivosList({
  items,
  onItemClick,
  selectedId,
  className,
  emptyMessage = 'No se encontraron reactivos en el inventario.',
}: ReactivosListProps) {
  if (items.length === 0) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="w-full py-12 px-4 text-center rounded-xl border border-dashed border-border-subtle bg-surface-card/60"
      >
        <p className="font-sans text-sm text-text-muted">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div
      role="list"
      aria-label="Catálogo de reactivos"
      className={cn('w-full space-y-5', className)}
    >
      {items.map((item) => {
        const isSelected = selectedId === item.id

        return (
          <div key={item.id} role="listitem">
            <ReactivoCard
              name={item.nombre}
              code={item.codigo}
              stock={item.stock}
              unit={item.unidad}
              location={item.ubicacion}
              expirationDate={item.fechaVencimiento}
              rombo={item.rombo}
              selected={isSelected}
              onClick={onItemClick ? () => onItemClick(item) : undefined}
              className="w-full"
            />
          </div>
        )
      })}
    </div>
  )
}

export default ReactivosList
