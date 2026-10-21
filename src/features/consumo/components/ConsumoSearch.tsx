import * as React from 'react'
import { SearchWrapper } from '@/components/ui/SearchWrapper'
import { cn } from '@/lib/utils'

export interface ConsumoSearchProps {
  value?: string
  onChange?: (value: string) => void
  onSearch?: (value: string) => void
  onFilterClick?: () => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

/**
 * Componente modular ConsumoSearch
 * Fiel a CONSUMO.svg:
 * - Campo de búsqueda integrado con lupa
 * - Botón lateral de filtros con FiltersIcon
 */
export const ConsumoSearch = React.forwardRef<HTMLInputElement, ConsumoSearchProps>(
  (
    {
      value,
      onChange,
      onSearch,
      onFilterClick,
      placeholder = 'Buscar...',
      className,
      disabled = false,
    },
    ref,
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.value)
    }

    return (
      <div className={cn('w-full max-w-[342px] mx-auto', className)}>
        <SearchWrapper
          ref={ref}
          value={value}
          onChange={handleChange}
          onSearch={onSearch}
          onFilterClick={onFilterClick}
          placeholder={placeholder}
          disabled={disabled}
          filterAriaLabel="Filtrar reactivos"
          className="w-full max-w-none"
        />
      </div>
    )
  },
)

ConsumoSearch.displayName = 'ConsumoSearch'

export default ConsumoSearch
