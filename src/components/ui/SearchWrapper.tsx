import * as React from 'react'
import { FiltersIcon } from '@/assets/icons'
import { InputField } from '@/components/ui/InputField'
import { cn } from '@/lib/utils'

export interface SearchWrapperProps {
  value?: string
  defaultValue?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSearch?: (value: string) => void
  onFilterClick?: () => void
  placeholder?: string
  disabled?: boolean
  className?: string
  filterAriaLabel?: string
  showFilterButton?: boolean
}

export const SearchWrapper = React.forwardRef<HTMLInputElement, SearchWrapperProps>(
  (
    {
      value,
      defaultValue,
      onChange,
      onSearch,
      onFilterClick,
      placeholder = 'Buscar...',
      disabled = false,
      className,
      filterAriaLabel = 'Abrir filtros',
      showFilterButton = true,
    },
    ref,
  ) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && onSearch) {
        onSearch((e.target as HTMLInputElement).value)
      }
    }

    return (
      <div className={cn('flex items-center gap-4 w-full max-w-md', className)}>
        {/* Barra de búsqueda con icono de lupa a la derecha según COMPONENTE_SEARCH_WRAPPER.svg */}
        <div className="flex-1">
          <InputField
            ref={ref}
            variant="search"
            value={value}
            defaultValue={defaultValue}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className="h-12 bg-white"
          />
        </div>

        {/* Botón de acción con el ícono personalizado de filtros: toque limpio sin sombreados */}
        {showFilterButton && (
          <button
            type="button"
            disabled={disabled}
            onClick={onFilterClick}
            aria-label={filterAriaLabel}
            className={cn(
              'flex items-center justify-center h-12 w-12 shrink-0 bg-transparent text-primary select-none cursor-pointer',
              'transition-transform duration-100 active:scale-90 focus-visible:outline-none',
              disabled && 'opacity-40 cursor-not-allowed pointer-events-none',
            )}
          >
            <FiltersIcon className="h-8 w-10 text-primary" />
          </button>
        )}
      </div>
    )
  },
)

SearchWrapper.displayName = 'SearchWrapper'
