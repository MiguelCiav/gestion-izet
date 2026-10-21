import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { AppHeader, Navbar } from '@/components/layout'
import { useAuth } from '@/features/auth/hooks'
import { fetchInventarioLaboratorio, mapInventarioToConsumoReactivos } from '@/lib/izetService'
import { ConsumoSearch } from '../components/ConsumoSearch'
import { ReactivoList } from '../components/ReactivoList'
import { DEFAULT_REACTIVOS } from '../data/mockData'
import type { ConsumoPageProps, Reactivo } from '../types'

export function ConsumoPage({
  reactivos: propReactivos,
  onSelectReactivo,
  onFilterClick,
  className,
}: ConsumoPageProps) {
  const navigate = useNavigate()
  const { activeLab, user } = useAuth()
  const [searchTerm, setSearchTerm] = React.useState<string>('')
  const [reactivos, setReactivos] = React.useState<Reactivo[]>(
    propReactivos ?? DEFAULT_REACTIVOS,
  )

  React.useEffect(() => {
    let mounted = true
    async function load() {
      if (propReactivos) return
      const inv = await fetchInventarioLaboratorio(activeLab)
      const mapped = mapInventarioToConsumoReactivos(inv)
      if (mounted && mapped.length > 0) {
        setReactivos(mapped)
      }
    }
    void load()
    return () => {
      mounted = false
    }
  }, [activeLab, propReactivos])

  const filteredReactivos = React.useMemo(() => {
    if (!searchTerm.trim()) return reactivos
    const lower = searchTerm.toLowerCase().trim()
    return reactivos.filter(
      (r) =>
        r.name.toLowerCase().includes(lower) ||
        r.code.toLowerCase().includes(lower),
    )
  }, [reactivos, searchTerm])

  const handleSelect = (reactivo: Reactivo) => {
    if (onSelectReactivo) {
      onSelectReactivo(reactivo)
    } else {
      navigate('/consumo/detalle', { state: { reactivo } })
    }
  }

  const handleNavbarItemChange = (id: string) => {
    if (id === 'dashboard') {
      navigate('/dashboard')
    } else {
      navigate(`/${id}`)
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#FAF6F0] flex flex-col justify-between selection:bg-primary-light">
      <AppHeader />

      <main className="flex-1 w-full max-w-[412px] mx-auto px-6 pt-4 pb-28 flex flex-col space-y-6">
        <header className="w-full max-w-[342px] mx-auto pt-2">
          <h1 className="font-serif text-[32px] sm:text-4xl font-bold text-primary leading-[1.15] tracking-tight">
            ¿Qué reactivo
            <br />
            consumiste?
          </h1>
        </header>

        <ConsumoSearch
          value={searchTerm}
          onChange={setSearchTerm}
          onFilterClick={onFilterClick}
          placeholder="Buscar reactivo..."
        />

        <section aria-label="Lista de reactivos" className={className}>
          <ReactivoList
            reactivos={filteredReactivos}
            onSelectReactivo={handleSelect}
            emptyMessage={
              searchTerm
                ? `No se encontraron resultados para "${searchTerm}".`
                : 'No hay reactivos disponibles en este momento.'
            }
          />
        </section>
      </main>

      <Navbar
        activeId={user?.rol === 'admin' ? 'dashboard' : 'consumo'}
        fixed={true}
        onItemChange={handleNavbarItemChange}
      />
    </div>
  )
}

export default ConsumoPage
