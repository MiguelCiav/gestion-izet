import * as React from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import {
  DesktopLayout,
  DesktopTable,
  DesktopTableActionButton,
  DesktopExportButton,
  type DesktopTableColumn,
} from '@/components/desktop'
import { useAuth } from '@/features/auth/hooks'
import { fetchBitacoraMovimientos } from '@/lib/izetService'
import {
  DesktopBitacoraToolbar,
  DesktopBitacoraAjusteModal,
  DesktopBitacoraConsumoModal,
  DesktopBitacoraPrestamoModal,
} from '../components'
import type {
  BitacoraCategoryFilter,
  BitacoraEntryType,
  DesktopBitacoraItem,
} from '../types'
import { cn } from '@/lib/utils'

export const DEFAULT_DESKTOP_BITACORA_ITEMS: DesktopBitacoraItem[] = [
  {
    id: '1',
    tipo: 'consumo',
    tipoLabel: 'Consumo',
    reactivoName: 'Ácido Benzóico',
    reactivoCode: 'XY-223',
    responsable: 'Dra. María Fernanda Pérez',
    laboratorioCodigo: 'LEPA',
    fecha: '10/06/2026',
    fechaHora: '10/06/2026 09:30',
    cantidad: '250 ml',
    stockAnterior: '750 ml',
    stockPosterior: '500 ml',
    observaciones: 'Consumo para titulación volumétrica',
    reactivo: {
      name: 'Ácido Benzóico',
      code: 'XY-223',
      stock: '500 ml',
      salud: 2,
      inflamabilidad: 1,
      reactividad: 0,
      especial: '',
    },
  },
]

export interface DesktopBitacoraPageProps {
  initialItems?: DesktopBitacoraItem[]
  initialCategory?: BitacoraCategoryFilter
  onItemClick?: (item: DesktopBitacoraItem) => void
  onFilterClick?: () => void
  onExportClick?: () => void
  defaultOpenModal?: {
    type: BitacoraEntryType
    item?: DesktopBitacoraItem
  }
}

export const DesktopBitacoraPage: React.FC<DesktopBitacoraPageProps> = ({
  initialItems,
  initialCategory = 'todos',
  onItemClick,
  onFilterClick,
  onExportClick,
  defaultOpenModal,
}) => {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const { activeLab } = useAuth()

  const resolvedInitialCategory = React.useMemo<BitacoraCategoryFilter>(() => {
    const param = searchParams.get('tipo') || searchParams.get('categoria')
    if (param === 'consumo' || param === 'consumos') return 'consumo'
    if (param === 'ajuste' || param === 'ajustes') return 'ajuste'
    if (param === 'prestamo' || param === 'prestamos') return 'prestamo'

    const state = location.state as { initialCategory?: BitacoraCategoryFilter; tipo?: string } | null
    if (state?.initialCategory) return state.initialCategory
    if (state?.tipo === 'consumo' || state?.tipo === 'consumos') return 'consumo'
    if (state?.tipo === 'ajuste' || state?.tipo === 'ajustes') return 'ajuste'
    if (state?.tipo === 'prestamo' || state?.tipo === 'prestamos') return 'prestamo'

    return initialCategory
  }, [searchParams, location.state, initialCategory])

  const [items, setItems] = React.useState<DesktopBitacoraItem[]>(
    initialItems ?? DEFAULT_DESKTOP_BITACORA_ITEMS,
  )
  const [isLoading, setIsLoading] = React.useState<boolean>(!initialItems)
  const [userCategory, setUserCategory] =
    React.useState<BitacoraCategoryFilter | null>(null)
  const selectedCategory = userCategory ?? resolvedInitialCategory
  const [searchQuery, setSearchQuery] = React.useState<string>('')
  const [showAdvancedFilters, setShowAdvancedFilters] = React.useState<boolean>(false)
  const [fechaDesde, setFechaDesde] = React.useState<string>('')
  const [fechaHasta, setFechaHasta] = React.useState<string>('')

  // Cargar movimientos desde Supabase según el laboratorio global activo
  React.useEffect(() => {
    if (initialItems) return
    let mounted = true
    async function load() {
      setIsLoading(true)
      const res = await fetchBitacoraMovimientos(activeLab)
      if (mounted) {
        setItems(res.desktopItems)
        setIsLoading(false)
      }
    }
    void load()
    return () => {
      mounted = false
    }
  }, [activeLab, initialItems])

  const [activeModal, setActiveModal] = React.useState<{
    isOpen: boolean
    type: BitacoraEntryType
    item: DesktopBitacoraItem | null
  }>({
    isOpen: Boolean(defaultOpenModal),
    type: defaultOpenModal?.type ?? 'consumo',
    item: defaultOpenModal?.item ?? ((initialItems ?? DEFAULT_DESKTOP_BITACORA_ITEMS)[0] || null),
  })

  // Filtrado reactivo por categoría, texto y rango de fechas (HU06.4)
  const filteredData = React.useMemo(() => {
    return items.filter((item) => {
      if (selectedCategory !== 'todos' && item.tipo !== selectedCategory) {
        return false
      }

      if (fechaDesde && item.rawDate && item.rawDate < fechaDesde) {
        return false
      }
      if (fechaHasta && item.rawDate && item.rawDate > fechaHasta) {
        return false
      }

      if (!searchQuery.trim()) return true
      const q = searchQuery.toLowerCase()
      return (
        item.reactivoName.toLowerCase().includes(q) ||
        item.reactivoCode.toLowerCase().includes(q) ||
        item.responsable.toLowerCase().includes(q) ||
        item.tipoLabel.toLowerCase().includes(q) ||
        (item.laboratorioCodigo && item.laboratorioCodigo.toLowerCase().includes(q)) ||
        item.observaciones.toLowerCase().includes(q)
      )
    })
  }, [items, selectedCategory, searchQuery, fechaDesde, fechaHasta])

  const handleOpenDetail = (item: DesktopBitacoraItem) => {
    onItemClick?.(item)
    setActiveModal({
      isOpen: true,
      type: item.tipo,
      item,
    })
  }

  const handleCloseModal = () => {
    setActiveModal((prev) => ({ ...prev, isOpen: false }))
  }

  const handleExportCsv = () => {
    if (onExportClick) {
      onExportClick()
      return
    }
    const csv =
      'Fecha y Hora,Laboratorio,Tipo,Responsable,Reactivo,Código,Cantidad,Stock Anterior,Stock Posterior,Observaciones\n' +
      filteredData
        .map(
          (r) =>
            `"${r.fechaHora || r.fecha}","${r.laboratorioCodigo || activeLab}","${r.tipoLabel}","${r.responsable}","${r.reactivoName}","${r.reactivoCode}","${r.cantidad}","${r.stockAnterior || ''}","${r.stockPosterior || ''}","${r.observaciones}"`,
        )
        .join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `bitacora_movimientos_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Definición tipada de las columnas de DesktopTable (Inmutable y de solo lectura - HU06.2 y HU06.3)
  const columns: DesktopTableColumn<DesktopBitacoraItem>[] = [
    {
      key: 'tipo',
      header: 'Tipo',
      width: '145px',
      render: (row) => {
        const typeClasses: Record<BitacoraEntryType, string> = {
          consumo: 'bg-[#4A7C59]/15 text-[#4A7C59] border-[#4A7C59]/30',
          ajuste: 'bg-amber-500/15 text-amber-800 border-amber-500/30',
          prestamo: 'bg-blue-500/15 text-blue-800 border-blue-500/30',
        }
        return (
          <div className="flex flex-col items-start gap-1">
            <span
              className={cn(
                'inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold border whitespace-nowrap',
                typeClasses[row.tipo],
              )}
            >
              {row.tipoLabel}
            </span>
            {row.laboratorioCodigo && (
              <span className="text-[10px] font-mono font-bold text-[#655D52] px-1.5">
                Lab: {row.laboratorioCodigo}
              </span>
            )}
          </div>
        )
      },
    },
    {
      key: 'responsable',
      header: 'Responsable',
      width: '160px',
      render: (row) => (
        <span className="font-sans font-medium text-[#181C1B]">
          {row.responsable}
        </span>
      ),
    },
    {
      key: 'reactivo',
      header: 'Reactivo / Material',
      minWidth: '200px',
      render: (row) => (
        <div className="flex flex-col py-0.5">
          <span className="font-sans font-semibold text-[#181C1B]">
            {row.reactivoName}
          </span>
          <span className="font-sans text-xs text-[#655D52] font-mono">
            {row.reactivoCode}
          </span>
        </div>
      ),
    },
    {
      key: 'fecha',
      header: 'Fecha y Hora',
      width: '140px',
      render: (row) => (
        <span className="font-sans text-xs text-[#181C1B]">
          {row.fechaHora || row.fecha}
        </span>
      ),
    },
    {
      key: 'cantidad',
      header: 'Cantidad / Trazabilidad',
      width: '155px',
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-sans font-semibold text-[#181C1B]">
            {row.cantidad}
          </span>
          {row.stockAnterior && row.stockPosterior && (
            <span className="font-sans text-[11px] text-[#655D52]">
              {row.stockAnterior} &rarr; {row.stockPosterior}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'observaciones',
      header: 'Observaciones (Inmutable)',
      className: 'text-[#655D52] text-sm max-w-[240px] truncate',
      render: (row) => (
        <span title={row.observaciones}>
          {row.observaciones || '-'}
        </span>
      ),
    },
    {
      key: 'acciones',
      header: 'Auditar',
      width: '80px',
      align: 'center',
      render: (row) => (
        <DesktopTableActionButton
          label={`Inspeccionar registro de ${row.reactivoName}`}
          onClick={() => handleOpenDetail(row)}
        />
      ),
    },
  ]

  return (
    <DesktopLayout
      activeNavId="bitacora"
      contentClassName={activeModal.isOpen ? 'overflow-hidden' : undefined}
    >
      <div className="w-full flex flex-col space-y-6 max-w-[1240px] mx-auto">
        {/* Cabecera de la sección: Título y Exportar */}
        <div className="flex items-center justify-between flex-wrap gap-4 select-none">
          <h1 className="font-serif text-[32px] sm:text-4xl font-bold text-primary tracking-tight">
            Bitácora
          </h1>

          <div className="flex items-center gap-3">
            <DesktopExportButton onClick={handleExportCsv}>
              Exportar
            </DesktopExportButton>
          </div>
        </div>

        {/* Barra de herramientas integrada (Tabs píldora, Buscador y Filtrar) */}
        <DesktopBitacoraToolbar
          selectedCategory={selectedCategory}
          onCategoryChange={setUserCategory}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          onFilterClick={() => {
            setShowAdvancedFilters((prev) => !prev)
            onFilterClick?.()
          }}
        />

        {/* Filtros por rango de fechas */}
        {showAdvancedFilters && (
          <div className="p-4 bg-white rounded-2xl border border-[#655D52]/30 shadow-xs flex items-center justify-between flex-wrap gap-4 animate-in fade-in duration-150">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-xs font-sans font-bold uppercase tracking-wider text-[#181C1B]">
                Rango de fechas:
              </span>
              <div className="flex items-center gap-2">
                <label htmlFor="bitacora-desde" className="text-xs text-[#655D52]">
                  Desde:
                </label>
                <input
                  id="bitacora-desde"
                  type="date"
                  value={fechaDesde}
                  onChange={(e) => setFechaDesde(e.target.value)}
                  onClick={(e) => {
                    try {
                      e.currentTarget.showPicker?.()
                    } catch {}
                  }}
                  className="h-9 rounded-lg border border-[#655D52]/30 px-2.5 text-xs cursor-pointer bg-white"
                />
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="bitacora-hasta" className="text-xs text-[#655D52]">
                  Hasta:
                </label>
                <input
                  id="bitacora-hasta"
                  type="date"
                  value={fechaHasta}
                  onChange={(e) => setFechaHasta(e.target.value)}
                  onClick={(e) => {
                    try {
                      e.currentTarget.showPicker?.()
                    } catch {}
                  }}
                  className="h-9 rounded-lg border border-[#655D52]/30 px-2.5 text-xs cursor-pointer bg-white"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setFechaDesde('')
                setFechaHasta('')
                setSearchQuery('')
                setUserCategory('todos')
              }}
              className="text-xs font-semibold text-primary hover:underline cursor-pointer"
            >
              Restablecer filtros
            </button>
          </div>
        )}

        {/* Tabla principal de bitácora */}
        <div className="w-full pt-2">
          <DesktopTable<DesktopBitacoraItem>
            columns={columns}
            data={filteredData}
            keyExtractor={(row) => row.id}
            onRowClick={(row) => handleOpenDetail(row)}
            emptyMessage={
              isLoading
                ? 'Cargando historial de movimientos desde Supabase...'
                : searchQuery
                  ? `No se encontraron registros que coincidan con "${searchQuery}"`
                  : 'No hay movimientos registrados en la bitácora.'
            }
          />
        </div>
      </div>

      {/* Modales de auditoría de solo lectura (HU06.3: registros inmutables) */}
      {activeModal.type === 'ajuste' && (
        <DesktopBitacoraAjusteModal
          key={activeModal.item?.id ?? 'ajuste-default'}
          isOpen={activeModal.isOpen}
          onClose={handleCloseModal}
          reactivo={activeModal.item?.reactivo}
          initialData={{
            fecha: activeModal.item?.fechaHora || activeModal.item?.fecha,
            cantidad: activeModal.item?.cantidad,
            observaciones: activeModal.item?.observaciones,
          }}
          onSubmit={() => handleCloseModal()}
        />
      )}

      {activeModal.type === 'consumo' && (
        <DesktopBitacoraConsumoModal
          key={activeModal.item?.id ?? 'consumo-default'}
          isOpen={activeModal.isOpen}
          onClose={handleCloseModal}
          reactivo={activeModal.item?.reactivo}
          initialData={{
            responsable: activeModal.item?.responsable,
            fecha: activeModal.item?.fechaHora || activeModal.item?.fecha,
            cantidad: activeModal.item?.cantidad,
            observaciones: activeModal.item?.observaciones,
          }}
          onSubmit={() => handleCloseModal()}
        />
      )}

      {activeModal.type === 'prestamo' && (
        <DesktopBitacoraPrestamoModal
          key={activeModal.item?.id ?? 'prestamo-default'}
          isOpen={activeModal.isOpen}
          onClose={handleCloseModal}
          reactivo={activeModal.item?.reactivo}
          initialData={{
            responsable: activeModal.item?.responsable,
            fecha: activeModal.item?.fechaHora || activeModal.item?.fecha,
            tipo: activeModal.item?.tipoPrestamo ?? 'Interno',
            estado: activeModal.item?.estadoPrestamo ?? 'Activo',
            cantidad: activeModal.item?.cantidad,
            observaciones: activeModal.item?.observaciones,
          }}
          onSubmit={() => handleCloseModal()}
        />
      )}
    </DesktopLayout>
  )
}

export default DesktopBitacoraPage
