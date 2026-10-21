import * as React from 'react'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { AppHeader, Navbar } from '@/components/layout'
import { SearchWrapper } from '@/components/ui/SearchWrapper'
import { useAuth } from '@/features/auth/hooks'
import { fetchBitacoraMovimientos } from '@/lib/izetService'
import { BitacoraList } from '../components/BitacoraList'
import type { BitacoraDateGroup, BitacoraEntry, BitacoraCategoryFilter } from '../types'
import { cn } from '@/lib/utils'

export interface BitacoraPageProps {
  initialGroups?: BitacoraDateGroup[]
  onEntryClick?: (entry: BitacoraEntry) => void
  onSettingsClick?: () => void
  onFilterClick?: () => void
}

const DEFAULT_GROUPS: BitacoraDateGroup[] = [
  {
    date: '20 de octubre de 2026',
    entries: [
      {
        id: '1',
        type: 'consumo',
        title: 'Consumo: Ácido Clorhídrico 37% (RCT-HCL-01)',
        reactivoCode: 'RCT-HCL-01',
        reactivoName: 'Ácido Clorhídrico 37%',
        date: '20 de octubre de 2026',
      },
    ],
  },
]

export function BitacoraPage({
  initialGroups,
  onEntryClick,
  onSettingsClick,
  onFilterClick,
}: BitacoraPageProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const { activeLab } = useAuth()
  const [searchQuery, setSearchQuery] = React.useState('')
  const [groups, setGroups] = React.useState<BitacoraDateGroup[]>(
    initialGroups ?? DEFAULT_GROUPS,
  )
  const [selectedType, setSelectedType] = React.useState<BitacoraCategoryFilter>(() => {
    const param = searchParams.get('tipo') || searchParams.get('categoria')
    if (param === 'consumo' || param === 'consumos') return 'consumo'
    if (param === 'ajuste' || param === 'ajustes') return 'ajuste'
    if (param === 'prestamo' || param === 'prestamos') return 'prestamo'
    const state = location.state as { initialCategory?: string; tipo?: string } | null
    const st = state?.tipo || state?.initialCategory
    if (st === 'consumo' || st === 'ajuste' || st === 'prestamo') return st
    return 'todos'
  })

  React.useEffect(() => {
    if (initialGroups) return
    let mounted = true
    async function load() {
      const res = await fetchBitacoraMovimientos(activeLab)
      if (mounted) {
        setGroups(res.mobileGroups)
      }
    }
    void load()
    return () => {
      mounted = false
    }
  }, [activeLab, initialGroups])

  const handleEntryClick = (entry: BitacoraEntry) => {
    if (onEntryClick) {
      onEntryClick(entry)
      return
    }

    if (entry.type === 'consumo') {
      navigate('/bitacora/consumo', { state: { entry } })
    } else if (entry.type === 'ajuste') {
      navigate('/bitacora/ajuste', { state: { entry } })
    } else if (entry.type === 'prestamo') {
      navigate('/bitacora/prestamo', { state: { entry } })
    }
  }

  const filteredGroups = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return groups
      .map((group) => {
        const matchingEntries = group.entries.filter((entry) => {
          if (selectedType !== 'todos' && entry.type !== selectedType) {
            return false
          }
          if (!query) return true
          return (
            entry.title.toLowerCase().includes(query) ||
            entry.type.toLowerCase().includes(query) ||
            (entry.user && entry.user.toLowerCase().includes(query)) ||
            (entry.reactivoCode && entry.reactivoCode.toLowerCase().includes(query)) ||
            (entry.reactivoName && entry.reactivoName.toLowerCase().includes(query))
          )
        })
        return {
          ...group,
          entries: matchingEntries,
        }
      })
      .filter((group) => group.entries.length > 0)
  }, [groups, searchQuery, selectedType])

  return (
    <div className="min-h-screen w-full bg-[#FAF6F0] flex flex-col items-center">
      <AppHeader onSettingsClick={onSettingsClick} />

      <main className="w-full max-w-[412px] px-6 sm:px-8 flex-1 flex flex-col space-y-5 pt-2 pb-28">
        <div className="pt-1">
          <h1 className="font-serif text-[32px] sm:text-4xl font-bold text-primary tracking-tight">
            Bitácora
          </h1>
        </div>

        {/* Píldoras de filtro por tipo de movimiento (HU06.4) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {(
            [
              { id: 'todos', label: 'Todos' },
              { id: 'consumo', label: 'Consumos' },
              { id: 'ajuste', label: 'Ajustes' },
              { id: 'prestamo', label: 'Préstamos' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedType(tab.id)}
              className={cn(
                'px-3.5 py-1.5 rounded-full text-xs font-sans font-semibold border transition-colors shrink-0',
                selectedType === tab.id
                  ? 'bg-[#4A7C59] text-white border-[#4A7C59]'
                  : 'bg-white text-[#181C1B] border-[#655D52]/30',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="w-full">
          <SearchWrapper
            placeholder="Buscar por reactivo, código o usuario..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFilterClick={onFilterClick}
            className="w-full max-w-none"
          />
        </div>

        <div className="w-full pt-1">
          <BitacoraList
            groups={filteredGroups}
            onEntryClick={handleEntryClick}
            emptyMessage={
              searchQuery
                ? `No se encontraron resultados para "${searchQuery}"`
                : 'No hay movimientos registrados en la bitácora.'
            }
          />
        </div>
      </main>

      <Navbar activeId="bitacora" fixed />
    </div>
  )
}

export default BitacoraPage
