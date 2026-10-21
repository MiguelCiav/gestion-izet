import * as React from 'react'
import { cn } from '@/lib/utils'
import { InputField } from '@/components/ui/InputField'
import { DesktopFilterButton } from '@/components/desktop'
import type { BitacoraCategoryFilter } from '../types'

export interface DesktopBitacoraToolbarProps {
  /** Categoría seleccionada actualmente */
  selectedCategory: BitacoraCategoryFilter
  /** Callback al cambiar la categoría */
  onCategoryChange: (category: BitacoraCategoryFilter) => void
  /** Valor actual del buscador */
  searchValue?: string
  /** Callback al cambiar el valor del buscador */
  onSearchChange?: (value: string) => void
  /** Placeholder para el buscador */
  searchPlaceholder?: string
  /** Callback al pulsar el botón de Filtrar */
  onFilterClick?: () => void
  /** Clases CSS adicionales para el contenedor */
  className?: string
}

const CATEGORY_TABS: Array<{ id: BitacoraCategoryFilter; label: string }> = [
  { id: 'todos', label: 'Todo' },
  { id: 'consumo', label: 'Consumos' },
  { id: 'ajuste', label: 'Ajustes' },
  { id: 'prestamo', label: 'Préstamos' },
]

export const DesktopBitacoraToolbar: React.FC<DesktopBitacoraToolbarProps> = ({
  selectedCategory,
  onCategoryChange,
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Buscar...',
  onFilterClick,
  className,
}) => {
  return (
    <div className={cn('w-full flex flex-col gap-6', className)}>
      {/* 1. Pestañas píldora de categoría fieles a BITACORA.svg */}
      <div
        role="tablist"
        aria-label="Filtrar por tipo de movimiento"
        className="flex items-center gap-3 flex-wrap select-none"
      >
        {CATEGORY_TABS.map((tab) => {
          const isActive = selectedCategory === tab.id

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onCategoryChange(tab.id)}
              className={cn(
                'h-11 px-8 rounded-full font-sans font-medium text-sm transition-all duration-150 select-none cursor-pointer',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                isActive
                  ? 'bg-[#4A7C59] text-white shadow-sm'
                  : 'bg-transparent text-[#181C1B] hover:bg-[#4A7C59]/10 border border-[#4A4E4A]',
              )}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* 2. Barra de búsqueda y botón Filtrar fieles a BITACORA.svg */}
      <div className="w-full flex items-center gap-4 flex-wrap bg-[#FAF6F0]">
        <div className="w-full sm:w-[347px]">
          <InputField
            variant="search"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="h-[49px] w-full bg-white rounded-[7.5px] border-[#4A4E4A]"
          />
        </div>

        <DesktopFilterButton onClick={onFilterClick}>
          Filtrar
        </DesktopFilterButton>
      </div>
    </div>
  )
}
