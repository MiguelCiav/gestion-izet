import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import {
  DesktopLayout,
  DesktopTable,
  DesktopTableActionButton,
  DesktopFilterButton,
  DesktopExportButton,
  DesktopNewButton,
  type DesktopTableColumn,
} from '@/components/desktop'
import { InputField } from '@/components/ui'
import { useAuth } from '@/features/auth/hooks'
import {
  fetchInventarioLaboratorio,
  guardarReactivoEnSupabase,
  darBajaLogicaReactivo,
  eliminarReactivo,
  evaluarCaducidad,
  tieneAlertaStockMinimo,
  formatDateDisplay,
} from '@/lib/izetService'
import { ReactivoForm } from '../components/ReactivoForm'
import type { ReactivoItem, ReactivoFormData } from '../types'
import { cn } from '@/lib/utils'

export type InventarioCategoriaTab = 'reactivos' | 'vidrios' | 'equipos'
export type InventarioQuickFilter =
  | 'todos'
  | 'bajo_stock'
  | 'vencimiento'
  | 'vencidos'
  | 'compartido'
  | 'regulados'

export interface DesktopInventarioPageProps {
  initialReactivos?: ReactivoItem[]
  onAddReactivo?: (nuevo: ReactivoFormData) => void
  onUpdateReactivo?: (id: string, actualizado: ReactivoFormData) => void
}

export function DesktopInventarioPage({
  initialReactivos,
  onAddReactivo,
  onUpdateReactivo,
}: DesktopInventarioPageProps): React.JSX.Element {
  const navigate = useNavigate()
  const { activeLab, user } = useAuth()

  const [reactivos, setReactivos] = React.useState<ReactivoItem[]>(
    initialReactivos ?? [],
  )
  const [isLoading, setIsLoading] = React.useState<boolean>(!initialReactivos)
  const [isSaving, setIsSaving] = React.useState<boolean>(false)
  const [activeTab, setActiveTab] = React.useState<InventarioCategoriaTab>('reactivos')
  const [searchQuery, setSearchQuery] = React.useState<string>('')
  const [quickFilter, setQuickFilter] = React.useState<InventarioQuickFilter>('todos')
  const [sortByVencimiento, setSortByVencimiento] = React.useState<'none' | 'asc' | 'desc'>('none')
  const [filterPanelOpen, setFilterPanelOpen] = React.useState<boolean>(false)

  // Estado del drawer de Detalle y Nuevo Reactivo
  const [selectedReactivo, setSelectedReactivo] = React.useState<ReactivoItem | null>(null)
  const [isNewDrawerOpen, setIsNewDrawerOpen] = React.useState<boolean>(false)
  const [feedbackMessage, setFeedbackMessage] = React.useState<string | null>(null)

  const loadInventario = React.useCallback(async () => {
    if (initialReactivos) return
    setIsLoading(true)
    const items = await fetchInventarioLaboratorio(activeLab)
    setReactivos(items)
    setIsLoading(false)
  }, [activeLab, initialReactivos])

  React.useEffect(() => {
    void loadInventario()
  }, [loadInventario])

  // Filtrado y ordenamiento reactivo (HU03, HU04, HU07, HU08)
  const filteredReactivos = React.useMemo(() => {
    const filtered = reactivos.filter((item) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim()
        const matchesName = item.nombre.toLowerCase().includes(query)
        const matchesCode = item.codigo.toLowerCase().includes(query)
        const matchesFormula = item.formulaQuimica
          ? item.formulaQuimica.toLowerCase().includes(query)
          : false
        const matchesLocation = item.ubicacion
          ? item.ubicacion.toLowerCase().includes(query)
          : false
        if (!matchesName && !matchesCode && !matchesFormula && !matchesLocation) {
          return false
        }
      }

      const stockNum =
        typeof item.stock === 'number'
          ? item.stock
          : parseFloat(String(item.stock)) || 0
      const umbralNum =
        item.umbral !== undefined
          ? typeof item.umbral === 'number'
            ? item.umbral
            : parseFloat(String(item.umbral)) || 0
          : 0

      const cad = evaluarCaducidad(item.fechaVencimiento)

      // HU07: estrictamente 0 < stock_actual <= umbral_minimo
      if (quickFilter === 'bajo_stock') {
        return tieneAlertaStockMinimo(stockNum, umbralNum)
      }
      if (quickFilter === 'compartido') {
        return Boolean(item.usoCompartido)
      }
      if (quickFilter === 'regulados') {
        return Boolean(item.esRegulado)
      }
      // HU08: próximos a vencer (<= 30 días) o vencidos
      if (quickFilter === 'vencimiento') {
        return cad.estado === 'proximo_a_vencer' || cad.estado === 'vencido'
      }
      if (quickFilter === 'vencidos') {
        return cad.estado === 'vencido'
      }

      return true
    })

    if (sortByVencimiento !== 'none') {
      return [...filtered].sort((a, b) => {
        const cadA = evaluarCaducidad(a.fechaVencimiento).diasRestantes ?? 999999
        const cadB = evaluarCaducidad(b.fechaVencimiento).diasRestantes ?? 999999
        return sortByVencimiento === 'asc' ? cadA - cadB : cadB - cadA
      })
    }

    return filtered
  }, [reactivos, searchQuery, quickFilter, sortByVencimiento])

  const handleNavChange = (id: string) => {
    if (id === 'dashboard') navigate('/dashboard')
    else if (id === 'inventario') navigate('/inventario')
    else if (id === 'bitacora') navigate('/bitacora')
    else if (id === 'prestamos') navigate('/prestamos')
  }

  const handleOpenDetail = (item: ReactivoItem) => {
    setSelectedReactivo(item)
    setIsNewDrawerOpen(false)
  }

  const handleCloseDrawers = () => {
    setSelectedReactivo(null)
    setIsNewDrawerOpen(false)
  }

  const handleOpenNew = () => {
    setIsNewDrawerOpen(true)
    setSelectedReactivo(null)
  }

  const handleSaveDetail = async (formData: ReactivoFormData) => {
    if (!selectedReactivo) return
    setIsSaving(true)

    const result = await guardarReactivoEnSupabase(activeLab, formData, {
      reactivoId: selectedReactivo.reactivoId,
      responsable: user?.username || 'Personal de Laboratorio',
    })

    setIsSaving(false)

    if (!result.success) {
      setFeedbackMessage(`Error al actualizar: ${result.error}`)
      setTimeout(() => setFeedbackMessage(null), 4000)
      return
    }

    await loadInventario()
    onUpdateReactivo?.(selectedReactivo.id, formData)
    setFeedbackMessage(`Reactivo "${formData.nombre}" actualizado en ${activeLab} con éxito.`)
    setTimeout(() => setFeedbackMessage(null), 3500)
    handleCloseDrawers()
  }

  const handleDeactivateSelected = async () => {
    if (!selectedReactivo?.reactivoId) return
    setIsSaving(true)
    const result = await darBajaLogicaReactivo(
      selectedReactivo.reactivoId,
      activeLab,
      `Baja lógica de ${selectedReactivo.nombre} (${selectedReactivo.codigo})`,
      user?.username || 'Administrador',
    )
    setIsSaving(false)

    if (result.success) {
      await loadInventario()
      setFeedbackMessage(`Reactivo "${selectedReactivo.nombre}" dado de baja lógica del catálogo.`)
      setTimeout(() => setFeedbackMessage(null), 3500)
      handleCloseDrawers()
    }
  }

  const handleDeleteSelected = async (itemToDelete?: ReactivoItem) => {
    const target = itemToDelete || selectedReactivo
    if (!target) return
    const idToDelete = target.reactivoId || target.id
    if (!idToDelete) return

    const confirmDelete = window.confirm(
      `¿Estás seguro de que deseas eliminar permanentemente el reactivo "${target.nombre}" (${target.codigo})? Esta acción eliminará su stock y registros asociados.`
    )
    if (!confirmDelete) return

    setIsSaving(true)
    const result = await eliminarReactivo(idToDelete, activeLab)
    setIsSaving(false)

    if (result.success) {
      await loadInventario()
      setFeedbackMessage(`Reactivo "${target.nombre}" eliminado exitosamente.`)
      setTimeout(() => setFeedbackMessage(null), 3500)
      if (selectedReactivo?.id === target.id) {
        handleCloseDrawers()
      }
    } else {
      setFeedbackMessage(`Error al eliminar: ${result.error || 'No se pudo eliminar el reactivo'}`)
      setTimeout(() => setFeedbackMessage(null), 4000)
    }
  }

  const handleCreateNew = async (formData: ReactivoFormData) => {
    setIsSaving(true)
    const result = await guardarReactivoEnSupabase(activeLab, formData, {
      responsable: user?.username || 'Personal de Laboratorio',
      motivoAjuste: 'Registro de nuevo reactivo y stock físico inicial',
    })
    setIsSaving(false)

    if (!result.success) {
      setFeedbackMessage(`Error al registrar: ${result.error}`)
      setTimeout(() => setFeedbackMessage(null), 4000)
      return
    }

    await loadInventario()
    onAddReactivo?.(formData)
    setFeedbackMessage(`Reactivo "${formData.nombre}" registrado exitosamente en ${activeLab}.`)
    setTimeout(() => setFeedbackMessage(null), 3500)
    handleCloseDrawers()
  }

  const handleExport = () => {
    const csvContent =
      'Código,Nombre,Fórmula,Stock,Unidad,Umbral,Vencimiento,Ubicación,Precio,Moneda,Regulado,Estado\n' +
      filteredReactivos
        .map(
          (r) =>
            `"${r.codigo}","${r.nombre}","${r.formulaQuimica ?? ''}","${r.stock}","${r.unidad ?? 'ml'}","${r.umbral ?? ''}","${r.fechaVencimiento ?? ''}","${r.ubicacion ?? ''}","${r.ultimoPrecio ?? ''}","${r.monedaPrecio ?? 'USD'}","${r.esRegulado ? 'Sí' : 'No'}","${r.estado ?? 'Disponible'}"`,
        )
        .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `inventario_${activeLab.toLowerCase()}_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    setFeedbackMessage(`Reporte de inventario (${activeLab}) exportado correctamente (CSV).`)
    setTimeout(() => setFeedbackMessage(null), 3500)
  }

  // Helper para resolver el badge de estado (HU07 y HU08)
  const renderEstadoBadge = (item: ReactivoItem) => {
    const stockNum =
      typeof item.stock === 'number'
        ? item.stock
        : parseFloat(String(item.stock)) || 0
    const umbralNum =
      item.umbral !== undefined
        ? typeof item.umbral === 'number'
          ? item.umbral
          : parseFloat(String(item.umbral)) || 0
        : 0

    const bajoStock = tieneAlertaStockMinimo(stockNum, umbralNum)
    const cad = evaluarCaducidad(item.fechaVencimiento)

    return (
      <div className="flex flex-col items-center gap-1">
        {item.estadoFisico === 'EN_PRESTAMO' ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-900 border border-blue-300">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
            En préstamo
          </span>
        ) : bajoStock ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0" />
            Bajo stock
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#4A7C59]/15 text-[#4A7C59] border border-[#4A7C59]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4A7C59] shrink-0" />
            Disponible
          </span>
        )}

        {cad.estado === 'vencido' && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#FFDAD6] text-[#B83230] border border-[#B83230]/40">
            Vencido
          </span>
        )}
        {cad.estado === 'proximo_a_vencer' && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#FBDFA8] text-[#6A572B] border border-[#6A572B]/30">
            Próx. a vencer
          </span>
        )}
      </div>
    )
  }

  const columns: DesktopTableColumn<ReactivoItem>[] = [
    {
      key: 'nombre',
      header: 'Nombre',
      width: '23%',
      render: (row) => (
        <span className="font-serif font-bold text-[#181C1B] text-base leading-snug">
          {row.nombre}
        </span>
      ),
    },
    {
      key: 'codigo',
      header: 'Código',
      width: '12%',
      render: (row) => (
        <span className="inline-block whitespace-nowrap font-mono text-xs font-semibold px-2.5 py-1 bg-white border border-[#655D52]/30 rounded text-[#181C1B] shadow-xs">
          {row.codigo}
        </span>
      ),
    },
    {
      key: 'umbral',
      header: 'Umbral',
      width: '10%',
      render: (row) => (
        <span className="font-sans text-sm text-[#4A4E4A] whitespace-nowrap">
          {row.umbral !== undefined
            ? `${row.umbral} ${row.unidad ?? ''}`
            : '—'}
        </span>
      ),
    },
    {
      key: 'stock',
      header: 'Stock',
      width: '11%',
      render: (row) => (
        <span className="font-sans text-sm font-semibold text-[#181C1B] whitespace-nowrap">
          {row.stock} {row.unidad ?? ''}
        </span>
      ),
    },
    {
      key: 'fechaVencimiento',
      header: 'Vencimiento',
      width: '13%',
      render: (row) => {
        const cad = evaluarCaducidad(row.fechaVencimiento)
        return (
          <div className="flex flex-col">
            <span
              className={cn(
                'font-sans text-sm whitespace-nowrap',
                cad.estado === 'vencido'
                  ? 'text-[#B83230] font-bold'
                  : cad.estado === 'proximo_a_vencer'
                    ? 'text-[#6A572B] font-semibold'
                    : 'text-[#4A4E4A]',
              )}
            >
              {row.fechaVencimiento ? formatDateDisplay(row.fechaVencimiento) : '—'}
            </span>
            {cad.estado !== 'sin_vencimiento' && cad.estado !== 'vigente' && (
              <span className="text-[10px] text-[#655D52]">{cad.label}</span>
            )}
          </div>
        )
      },
    },
    {
      key: 'ubicacion',
      header: 'Ubicación',
      width: '13%',
      render: (row) => (
        <span className="font-sans text-sm text-[#4A4E4A]">
          {row.ubicacion ?? '—'}
        </span>
      ),
    },
    {
      key: 'estado',
      header: 'Estado',
      width: '11%',
      align: 'center',
      render: (row) => renderEstadoBadge(row),
    },
    {
      key: 'acciones',
      header: 'Acciones',
      width: '9%',
      align: 'center',
      render: (row) => (
        <div className="flex items-center justify-center gap-1.5">
          <DesktopTableActionButton
            label={`Ver detalle de ${row.nombre}`}
            onClick={() => handleOpenDetail(row)}
          />
          <button
            type="button"
            title={`Eliminar ${row.nombre}`}
            aria-label={`Eliminar reactivo ${row.nombre}`}
            onClick={(e) => {
              e.stopPropagation()
              void handleDeleteSelected(row)
            }}
            className="p-1.5 text-[#B83230] hover:bg-[#B83230]/10 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <DesktopLayout
      activeNavId="inventario"
      onNavChange={handleNavChange}
      contentClassName={selectedReactivo || isNewDrawerOpen ? 'overflow-hidden' : undefined}
    >
      {/* Notificación de feedback flotante */}
      {feedbackMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-24 right-8 z-40 bg-[#4A7C59] text-white px-5 py-3 rounded-xl shadow-lg border border-white/20 font-sans text-sm font-medium flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      <div className="w-full max-w-[1240px] mx-auto flex flex-col space-y-6">
        {/* 1. Cabecera principal: Título y Botón "Exportar" */}
        <div className="flex items-center justify-between flex-wrap gap-4 select-none">
          <h1 className="font-serif text-[32px] sm:text-4xl font-bold text-primary tracking-tight">
            Control de Inventario
          </h1>

          <DesktopExportButton onClick={handleExport}>
            Exportar
          </DesktopExportButton>
        </div>

        {/* 2. Selector de Categorías (Equipos y Vidrios deshabilitados) */}
        <div
          role="tablist"
          aria-label="Categorías de inventario"
          className="flex items-center gap-3 flex-wrap select-none"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'reactivos'}
            onClick={() => setActiveTab('reactivos')}
            className={cn(
              'h-11 px-8 rounded-full font-sans font-medium text-sm transition-all duration-150',
              activeTab === 'reactivos'
                ? 'bg-[#4A7C59] text-white'
                : 'bg-transparent text-[#181C1B] border border-[#4A4E4A] hover:bg-[#4A7C59]/10',
            )}
          >
            Reactivos
          </button>

          <button
            type="button"
            role="tab"
            disabled
            aria-disabled="true"
            aria-selected={false}
            className="h-11 px-8 rounded-full font-sans font-medium text-sm bg-transparent text-[#181C1B] border border-[#4A4E4A] opacity-50 cursor-not-allowed pointer-events-none"
          >
            Equipos
          </button>

          <button
            type="button"
            role="tab"
            disabled
            aria-disabled="true"
            aria-selected={false}
            className="h-11 px-8 rounded-full font-sans font-medium text-sm bg-transparent text-[#181C1B] border border-[#4A4E4A] opacity-50 cursor-not-allowed pointer-events-none"
          >
            Vidrios
          </button>
        </div>

        {/* 3. Barra de Herramientas: Buscador, Filtrar y Nuevo */}
        <div className="w-full flex items-center gap-4 flex-wrap bg-[#FAF6F0]">
          <div className="w-full sm:w-[347px]">
            <InputField
              variant="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, código, fórmula o ubicación..."
              className="h-[49px] w-full bg-white rounded-[7.5px] border-[#4A4E4A]"
            />
          </div>

          <div className="flex items-center gap-3">
            <DesktopFilterButton
              onClick={() => setFilterPanelOpen(!filterPanelOpen)}
              className={filterPanelOpen || quickFilter !== 'todos' ? 'bg-[#4A7C59]/15' : ''}
            >
              Filtrar
            </DesktopFilterButton>

            <DesktopNewButton onClick={handleOpenNew}>
              Nuevo
            </DesktopNewButton>
          </div>
        </div>

        {/* Panel secundario de filtros por escasez, caducidad, uso común y regulación (HU03, HU07, HU08) */}
        {filterPanelOpen && (
          <div className="w-full p-4 bg-white rounded-2xl border border-[#655D52]/30 shadow-sm flex flex-col gap-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-sans text-xs font-bold text-[#181C1B] uppercase tracking-wider mr-1">
                  Filtrar por:
                </span>
                {(
                  [
                    { id: 'todos', label: 'Todos' },
                    { id: 'bajo_stock', label: 'Bajo Stock (Escasez)' },
                    { id: 'vencimiento', label: 'Próximos a Vencer / Vencidos' },
                    { id: 'vencidos', label: 'Solo Vencidos' },
                    { id: 'compartido', label: 'Uso Común (LEPA/LEM)' },
                    { id: 'regulados', label: 'Sustancias Reguladas' },
                  ] as const
                ).map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setQuickFilter(f.id)}
                    className={cn(
                      'px-3 py-1 rounded-full text-xs font-sans font-semibold transition-colors cursor-pointer',
                      quickFilter === f.id
                        ? 'bg-[#4A7C59] text-white'
                        : 'bg-[#FAF6F0] text-[#181C1B] hover:bg-[#655D52]/10 border border-[#655D52]/20',
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-sans text-[#655D52]">Ordenar caducidad:</span>
                <button
                  type="button"
                  onClick={() =>
                    setSortByVencimiento((prev) =>
                      prev === 'asc' ? 'desc' : prev === 'desc' ? 'none' : 'asc',
                    )
                  }
                  className="px-2.5 py-1 rounded-lg border border-[#655D52]/30 text-xs font-semibold text-[#181C1B] hover:bg-[#FAF6F0] cursor-pointer"
                >
                  {sortByVencimiento === 'asc'
                    ? 'Más próximos primero ↑'
                    : sortByVencimiento === 'desc'
                      ? 'Más lejanos primero ↓'
                      : 'Sin orden'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('')
                    setQuickFilter('todos')
                    setSortByVencimiento('none')
                  }}
                  className="text-xs font-semibold text-primary hover:underline ml-2 cursor-pointer"
                >
                  Limpiar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 4. Tabla de Datos Técnica DesktopTable */}
        <div className="w-full">
          <DesktopTable<ReactivoItem>
            columns={columns}
            data={filteredReactivos}
            keyExtractor={(item) => item.id}
            onRowClick={(item) => handleOpenDetail(item)}
            emptyMessage={
              <div className="py-12 flex flex-col items-center justify-center space-y-2 select-none">
                <p className="font-serif text-lg font-semibold text-[#181C1B]">
                  {isLoading ? 'Cargando inventario desde Supabase...' : 'No se encontraron reactivos'}
                </p>
                <p className="font-sans text-sm text-[#4A4E4A]">
                  {searchQuery
                    ? `No hay coincidencias para la búsqueda "${searchQuery}".`
                    : 'No hay reactivos registrados con los filtros seleccionados.'}
                </p>
              </div>
            }
          />
        </div>
      </div>

      {/* 5. DRAWER LATERAL: DETALLE DE REACTIVO */}
      {selectedReactivo && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Detalle del reactivo ${selectedReactivo.nombre}`}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200"
          onClick={handleCloseDrawers}
        >
          <div
            className="w-full max-w-[534px] h-full bg-[#FAF6F0] rounded-l-[32px] p-8 md:p-10 shadow-2xl overflow-y-auto flex flex-col justify-between border-l border-[#655D52]/30 animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-serif text-3xl font-bold text-primary tracking-tight">
                    Inventario ({activeLab})
                  </h2>
                  <p className="font-sans text-xl font-bold text-[#181C1B] mt-1">
                    {selectedReactivo.nombre}
                  </p>
                  <p className="font-sans text-xs text-[#4A4E4A] mt-0.5">
                    Especificaciones técnicas, regulación legal y stock físico
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCloseDrawers}
                  aria-label="Cerrar panel de detalle"
                  className="p-2 rounded-full text-[#4A4E4A] hover:text-[#181C1B] hover:bg-[#655D52]/10 transition-colors"
                >
                  ✕
                </button>
              </div>

              <ReactivoForm
                key={selectedReactivo.id}
                reactivoId={selectedReactivo.reactivoId}
                initialData={{
                  nombre: selectedReactivo.nombre,
                  codigo: selectedReactivo.codigo,
                  formulaQuimica: selectedReactivo.formulaQuimica || 'N/A',
                  clasificacionRiesgo: selectedReactivo.clasificacionRiesgo || 'Sustancia de Laboratorio',
                  umbral: selectedReactivo.umbral !== undefined ? String(selectedReactivo.umbral) : '50',
                  stockDisponible: String(selectedReactivo.stock),
                  unidadMedida: selectedReactivo.unidad || 'ml',
                  fechaVencimiento: selectedReactivo.fechaVencimiento ?? '',
                  ubicacion: selectedReactivo.ubicacion ?? '',
                  usoCompartido: Boolean(selectedReactivo.usoCompartido),
                  esRegulado: Boolean(selectedReactivo.esRegulado),
                  entidadesRegulatorias: selectedReactivo.entidadesRegulatorias ?? [],
                  ultimoPrecio:
                    selectedReactivo.ultimoPrecio !== undefined
                      ? String(selectedReactivo.ultimoPrecio)
                      : '',
                  monedaPrecio: selectedReactivo.monedaPrecio || 'USD',
                  rombo: selectedReactivo.rombo,
                }}
                onCancel={handleCloseDrawers}
                onSubmit={handleSaveDetail}
                onDeactivate={handleDeactivateSelected}
                onDelete={() => handleDeleteSelected()}
                isSubmitting={isSaving}
                submitLabel="Guardar"
              />
            </div>
          </div>
        </div>
      )}

      {/* 6. DRAWER LATERAL: NUEVO REACTIVO */}
      {isNewDrawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Añadir nuevo reactivo"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200"
          onClick={handleCloseDrawers}
        >
          <div
            className="w-full max-w-[534px] h-full bg-[#FAF6F0] rounded-l-[32px] p-8 md:p-10 shadow-2xl overflow-y-auto flex flex-col justify-between border-l border-[#655D52]/30 animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-serif text-3xl font-bold text-primary tracking-tight">
                    Inventario ({activeLab})
                  </h2>
                  <p className="font-sans text-xl font-bold text-[#181C1B] mt-1">
                    Nuevo Reactivo
                  </p>
                  <p className="font-sans text-xs text-[#4A4E4A] mt-0.5">
                    Registrar sustancia química en catálogo centralizado y stock físico
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCloseDrawers}
                  aria-label="Cerrar panel de nuevo reactivo"
                  className="p-2 rounded-full text-[#4A4E4A] hover:text-[#181C1B] hover:bg-[#655D52]/10 transition-colors"
                >
                  ✕
                </button>
              </div>

              <ReactivoForm
                onCancel={handleCloseDrawers}
                onSubmit={handleCreateNew}
                isSubmitting={isSaving}
                submitLabel="Añadir Reactivo"
              />
            </div>
          </div>
        </div>
      )}
    </DesktopLayout>
  )
}

export default DesktopInventarioPage
