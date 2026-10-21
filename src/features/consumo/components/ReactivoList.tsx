import { ReactivoCard } from '@/components/ui/ReactivoCard'
import { cn } from '@/lib/utils'
import type { Reactivo } from '../types'

export interface ReactivoListProps {
  reactivos: Reactivo[]
  selectedReactivoId?: string
  onSelectReactivo?: (reactivo: Reactivo) => void
  emptyMessage?: string
  className?: string
}

/**
 * Componente modular ReactivoList
 * Fiel a CONSUMO.svg:
 * - Lista de tarjetas ReactivoCard con diseño plano y barra lateral de acento verde
 * - Rombo de seguridad NFPA 704 integrado a la derecha
 * - Interacción táctil optimizada para selección móvil
 */
export function ReactivoList({
  reactivos,
  selectedReactivoId,
  onSelectReactivo,
  emptyMessage = 'No se encontraron reactivos coincidentes.',
  className,
}: ReactivoListProps) {
  if (reactivos.length === 0) {
    return (
      <div
        role="status"
        className={cn(
          'w-full max-w-[342px] mx-auto py-12 text-center text-text-muted font-sans text-sm',
          className,
        )}
      >
        <p>{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div
      role="list"
      aria-label="Catálogo de reactivos disponibles"
      className={cn('flex flex-col space-y-5 w-full max-w-[342px] mx-auto', className)}
    >
      {reactivos.map((reactivo) => {
        const isSelected = reactivo.id === selectedReactivoId

        return (
          <div key={reactivo.id} role="listitem">
            <ReactivoCard
              name={reactivo.name}
              code={reactivo.code}
              stock={reactivo.stock}
              unit={reactivo.unit}
              details={reactivo.details}
              location={reactivo.location}
              expirationDate={reactivo.expirationDate}
              rombo={reactivo.rombo}
              salud={reactivo.salud}
              inflamabilidad={reactivo.inflamabilidad}
              reactividad={reactivo.reactividad}
              especial={reactivo.especial}
              selected={isSelected}
              onClick={() => onSelectReactivo?.(reactivo)}
              className={cn(
                'cursor-pointer transition-all duration-150 active:scale-[0.99] hover:border-primary/50',
                isSelected && 'ring-2 ring-primary ring-offset-2',
              )}
            />
          </div>
        )
      })}
    </div>
  )
}

export default ReactivoList
