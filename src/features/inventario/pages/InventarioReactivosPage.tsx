import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { AppHeader, Navbar } from '@/components/layout'
import { SearchWrapper } from '@/components/ui/SearchWrapper'
import { FloatingButton } from '@/components/ui/FloatingButton'
import { useAuth } from '@/features/auth/hooks'
import { fetchInventarioLaboratorio, evaluarCaducidad, tieneAlertaStockMinimo } from '@/lib/izetService'
import { ReactivosList } from '../components'
import { MOCK_REACTIVOS } from '../data/mockReactivos'
import type { ReactivoItem } from '../types'
import { cn } from '@/lib/utils'

export function InventarioReactivosPage() {
  const navigate = useNavigate()
  const { activeLab } = useAuth()
  const [searchQuery, setSearchQuery] = React.useState<string>('')
  const [reactivos, setReactivos] = React.useState<ReactivoItem[]>(MOCK_REACTIVOS)
  const [filterMode, setFilterMode] = React.useState<'todos' | 'bajo_stock' | 'vencimiento'>('todos')
  const [showFilters, setShowFilters] = React.useState(false)

  React.useEffect(() => {
    let mounted = true
    async function load() {
      const items = await fetchInventarioLaboratorio(activeLab)
      if (mounted && items.length > 0) {
        setReactivos(items)
      }
    }
    void load()
    return () => {
      mounted = false
    }
  }, [activeLab])

  // Filtrado de reactivos según consulta y estado de alerta (HU07 y HU08)
  const filteredReactivos = React.useMemo(() => {
    return reactivos.filter((r) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim()
        const matchName = r.nombre.toLowerCase().includes(query)
        const matchCode = r.codigo.toLowerCase().includes(query)
        const matchLocation = r.ubicacion?.toLowerCase().includes(query)
        if (!matchName && !matchCode && !matchLocation) return false
      }

      if (filterMode === 'bajo_stock') {
        return tieneAlertaStockMinimo(Number(r.stock) || 0, Number(r.umbral) || 0)
      }
      if (filterMode === 'vencimiento') {
        const cad = evaluarCaducidad(r.fechaVencimiento)
        return cad.estado === 'proximo_a_vencer' || cad.estado === 'vencido'
      }
      return true
    })
  }, [reactivos, searchQuery, filterMode])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleFilterClick = () => {
    setShowFilters((prev) => !prev)
  }

  const handleCardClick = (item: ReactivoItem) => {
    navigate(`/inventario/reactivos/detalle`, {
      state: { reactivo: item },
    })
  }

  const handleAddClick = () => {
    navigate('/inventario/reactivos/detalle')
  }

  const handleNavbarChange = (_id: string, item: { href?: string }) => {
    if (item.href) {
      navigate(item.href)
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#FAF6F0] flex flex-col pb-28 relative">
      {/* Encabezado Superior */}
      <AppHeader />

      {/* Contenido Principal */}
      <main className="w-full max-w-[412px] mx-auto px-6 pt-4 flex-1 flex flex-col">
        <h1 className="font-serif text-[32px] sm:text-4xl font-bold text-primary tracking-tight mb-6 select-none">
          Inventario ({activeLab})
        </h1>

        <div className="w-full mb-4">
          <SearchWrapper
            value={searchQuery}
            onChange={handleSearchChange}
            onFilterClick={handleFilterClick}
            placeholder="Buscar..."
            filterAriaLabel="Abrir filtros de reactivos"
            className="w-full"
          />
        </div>

        {showFilters && (
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {(
              [
                { id: 'todos', label: 'Todos' },
                { id: 'bajo_stock', label: 'Bajo Stock' },
                { id: 'vencimiento', label: 'Por Vencer / Vencidos' },
              ] as const
            ).map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilterMode(f.id)}
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-sans font-semibold border transition-colors',
                  filterMode === f.id
                    ? 'bg-[#4A7C59] text-white border-[#4A7C59]'
                    : 'bg-white text-[#181C1B] border-[#655D52]/30',
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}

        <div className="w-full flex-1">
          <ReactivosList
            items={filteredReactivos}
            onItemClick={handleCardClick}
            emptyMessage={
              searchQuery
                ? `No se encontraron reactivos para "${searchQuery}"`
                : 'No hay reactivos registrados.'
            }
          />
        </div>
      </main>

      <div className="fixed bottom-24 right-4 sm:right-6 z-30 max-w-[412px]">
        <FloatingButton
          label="Añadir Reactivo"
          onClick={handleAddClick}
          aria-label="Añadir nuevo reactivo"
        />
      </div>

      <Navbar
        activeId="inventario"
        fixed
        onItemChange={handleNavbarChange}
      />
    </div>
  )
}

export default InventarioReactivosPage
