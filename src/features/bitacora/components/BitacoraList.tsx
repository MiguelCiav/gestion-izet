import { SectionHeader } from '@/components/ui/SectionCard'
import { BitacoraCard } from './BitacoraCard'
import type { BitacoraDateGroup, BitacoraEntry } from '../types'

export interface BitacoraListProps {
  groups: BitacoraDateGroup[]
  onEntryClick?: (entry: BitacoraEntry) => void
  emptyMessage?: string
}

export function BitacoraList({
  groups,
  onEntryClick,
  emptyMessage = 'No se encontraron registros en la bitácora',
}: BitacoraListProps) {
  if (groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-text-muted font-sans text-sm">
        <p>{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 w-full">
      {groups.map((group) => (
        <section key={group.date} className="space-y-4 w-full">
          {/* Encabezado de fecha con separador horizontal idéntico al diseño */}
          <SectionHeader
            title={
              <span className="font-serif font-bold text-lg sm:text-xl text-text-main">
                {group.date}
              </span>
            }
          />

          {/* Lista de registros */}
          <div className="space-y-4 w-full">
            {group.entries.map((entry) => (
              <BitacoraCard
                key={entry.id}
                entry={entry}
                onClick={onEntryClick}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
