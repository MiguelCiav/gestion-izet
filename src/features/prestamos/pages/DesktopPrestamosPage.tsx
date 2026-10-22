import * as React from 'react'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import {
  DesktopLayout,
  DesktopTable,
  DesktopTableActionButton,
  DesktopFilterButton,
  DesktopNewButton,
  DesktopCard,
  type DesktopTableColumn,
} from '@/components/desktop'
import { Button, InputField, Stepper } from '@/components/ui'
import { cn } from '@/lib/utils'
import { useAuth } from '@/features/auth/hooks'
import {
  fetchPrestamosLaboratorio,
  registrarDevolucionPrestamoEnSupabase,
} from '@/lib/izetService'
import type { PrestamoItem, PrestamoEstado, PrestamosListLocationState } from '../types'

export interface DesktopPrestamosPageProps {
  /**
   * Datos iniciales de préstamos (por defecto se cargan de Supabase con fallback a MOCK_PRESTAMOS_TABLA)
   */
  initialData?: PrestamoItem[]
  /**
   * Callback invocado al hacer clic en "Nuevo Préstamo"
   */
  onNuevoPrestamo?: () => void
  /**
   * Callback invocado al hacer clic en "Exportar reporte"
   */
  onExportarReporte?: () => void
  /**
   * Callback invocado al hacer clic en una fila de la tabla
   */
  onRowClick?: (item: PrestamoItem) => void
  /**
   * ID del ítem activo en el sidebar (por defecto 'prestamos')
   */
  activeNavId?: string
  /**
   * Callback de cambio de navegación
   */
  onNavChange?: (id: string) => void
}

/**
 * Renderiza el badge visual de estado según el design system institucional de Gestión IZET.
 */
function renderStatusBadge(estado: PrestamoEstado, estadoOriginal?: string): React.JSX.Element {
  switch (estado) {
    case 'aprobado':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#4A7C59]/15 text-[#4A7C59] border border-[#4A7C59]/30">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4A7C59] mr-1.5" />
          Activo
        </span>
      )
    case 'pendiente':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FAF0E6] text-[#B45309] border border-[#F59E0B]/30">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] mr-1.5" />
          Pendiente
        </span>
      )
    case 'devuelto':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#EBF7EE] text-[#2E7D32] border border-[#2E7D32]/25">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] mr-1.5" />
          {estadoOriginal === 'DEVUELTO_PARCIAL' ? 'Dev. Parcial' : 'Devuelto'}
        </span>
      )
    case 'vencido':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-alert-danger-bg text-alert-danger-border border border-alert-danger-border/30">
          <span className="w-1.5 h-1.5 rounded-full bg-alert-danger-border mr-1.5" />
          Vencido
        </span>
      )
  }
}

/**
 * DesktopPrestamosPage - Pantalla principal de gestión y devolución de préstamos (HU09 y HU10).
 */
export function DesktopPrestamosPage({
  initialData,
  onNuevoPrestamo,
  onExportarReporte: _onExportarReporte,
  onRowClick,
  activeNavId = 'prestamos',
  onNavChange,
}: DesktopPrestamosPageProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { activeLab, user } = useAuth()
  const locationState = location.state as PrestamosListLocationState | null

  // Notificación de éxito si proviene de una confirmación previa
  const [feedbackMessage, setFeedbackMessage] = React.useState<string | null>(
    locationState?.successMessage ?? null,
  )
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  // Conjunto de datos de préstamos desde Supabase
  const [prestamos, setPrestamos] = React.useState<PrestamoItem[]>(
    initialData ?? [],
  )

  // Estado de búsqueda y filtros (HU10.1: solicitante, reactivo, fecha de entrega y estado)
  const [searchQuery, setSearchQuery] = React.useState<string>('')
  const [selectedEstadoFilter, setSelectedEstadoFilter] = React.useState<PrestamoEstado | 'todos'>('todos')
  const [fechaFiltro, setFechaFiltro] = React.useState<string>('')
  const [showFiltersModal, setShowFiltersModal] = React.useState<boolean>(false)

  // Elemento seleccionado para inspección de detalle y devolución en modal (HU10.2 - HU10.4)
  const [selectedItem, setSelectedItem] = React.useState<PrestamoItem | null>(null)
  const [cantidadDevuelta, setCantidadDevuelta] = React.useState<number>(0)
  const [estadoCierre, setEstadoCierre] = React.useState<'DEVUELTO' | 'DEVUELTO_PARCIAL'>('DEVUELTO')
  const [incidenciaDevolucion, setIncidenciaDevolucion] = React.useState<string>('')
  const [isSubmittingReturn, setIsSubmittingReturn] = React.useState<boolean>(false)

  const loadPrestamos = React.useCallback(async () => {
    if (initialData) return
    const rows = await fetchPrestamosLaboratorio(activeLab)
    setPrestamos(rows)
  }, [activeLab, initialData])

  React.useEffect(() => {
    void loadPrestamos()
  }, [loadPrestamos])

  // Filtrado de préstamos (HU10.1)
  const filteredPrestamos = React.useMemo(() => {
    return prestamos.filter((item) => {
      // Filtro por estado
      if (selectedEstadoFilter !== 'todos' && item.estado !== selectedEstadoFilter) {
        return false
      }

      // Filtro por fecha de solicitud/entrega
      if (fechaFiltro && item.rawFechaSolicitud && item.rawFechaSolicitud !== fechaFiltro) {
        return false
      }

      // Filtro por texto (solicitante, cédula, reactivo, código, departamento)
      if (!searchQuery.trim()) return true
      const query = searchQuery.toLowerCase().trim()
      const matchResponsable = item.responsable.toLowerCase().includes(query)
      const matchCedula = item.solicitanteCedula?.toLowerCase().includes(query) ?? false
      const matchMaterial = item.material.toLowerCase().includes(query)
      const matchCodigo = item.codigoReactivo?.toLowerCase().includes(query) ?? false
      const matchDepartamento = item.departamento?.toLowerCase().includes(query) ?? false

      return (
        matchResponsable ||
        matchCedula ||
        matchMaterial ||
        matchCodigo ||
        matchDepartamento
      )
    })
  }, [prestamos, searchQuery, selectedEstadoFilter, fechaFiltro])

  // Contadores para píldoras de estado
  const counts = React.useMemo(() => {
    return {
      todos: prestamos.length,
      pendientes: prestamos.filter((p) => p.estado === 'pendiente').length,
      aprobados: prestamos.filter((p) => p.estado === 'aprobado').length,
      devueltos: prestamos.filter((p) => p.estado === 'devuelto').length,
      vencidos: prestamos.filter((p) => p.estado === 'vencido').length,
    }
  }, [prestamos])

  const handleNuevoPrestamo = () => {
    if (onNuevoPrestamo) {
      onNuevoPrestamo()
    } else {
      navigate('/prestamos/solicitar')
    }
  }

  const handleRowSelect = (item: PrestamoItem) => {
    setSelectedItem(item)
    const cantNum = Number(item.cantidad) || 0
    setCantidadDevuelta(item.estado === 'devuelto' ? Number(item.cantidadDevuelta ?? cantNum) : cantNum)
    setEstadoCierre('DEVUELTO')
    setIncidenciaDevolucion(item.incidenciaDevolucion ?? '')
    setErrorMessage(null)
    onRowClick?.(item)
  }

  const handleConfirmarDevolucion = async () => {
    if (!selectedItem) return
    setIsSubmittingReturn(true)
    setErrorMessage(null)

    const cantOriginal = Number(selectedItem.cantidad) || 0
    const cantFinal =
      estadoCierre === 'DEVUELTO'
        ? cantOriginal
        : Math.min(Math.max(0.01, cantidadDevuelta), cantOriginal)
    const cierreCalculado: 'DEVUELTO' | 'DEVUELTO_PARCIAL' =
      cantFinal < cantOriginal ? 'DEVUELTO_PARCIAL' : 'DEVUELTO'

    const res = await registrarDevolucionPrestamoEnSupabase({
      prestamoId: selectedItem.id,
      cantidadDevuelta: cantFinal,
      estadoCierre: cierreCalculado,
      incidencia:
        incidenciaDevolucion.trim() ||
        (cierreCalculado === 'DEVUELTO'
          ? 'Devolución completa del préstamo'
          : 'Devolución parcial del préstamo'),
      nombreResponsable: user?.username || 'Personal de Laboratorio',
    })

    setIsSubmittingReturn(false)

    if (!res.success) {
      setErrorMessage(res.error || 'No se pudo procesar la devolución del préstamo.')
      return
    }

    await loadPrestamos()
    setSelectedItem(null)
    setFeedbackMessage(
      `Devolución registrada con éxito (${selectedItem.material}). El inventario y la bitácora han sido actualizados.`,
    )
  }

  // Un usuario que no sea administrador solo puede solicitar préstamos (HU01)
  if (user && user.rol !== 'admin' && !initialData) {
    return <Navigate to="/prestamos/solicitar" replace />
  }

  // Definición tipada estricta de columnas para DesktopTable
  const columns: DesktopTableColumn<PrestamoItem>[] = [
    {
      key: 'responsable',
      header: 'Responsable / Solicitante',
      width: '22%',
      render: (row: PrestamoItem) => (
        <div className="flex flex-col py-1">
          <span className="font-sans font-semibold text-text-main text-sm">
            {row.responsable}
          </span>
          {row.responsableRol && (
            <span className="font-sans text-xs text-text-muted">
              {row.responsableRol}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'material',
      header: 'Material / Reactivo',
      width: '24%',
      render: (row: PrestamoItem) => (
        <div className="flex flex-col py-1">
          <span className="font-serif font-medium text-text-main text-sm">
            {row.material}
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            {row.codigoReactivo && (
              <span className="font-mono text-xs text-primary font-semibold tracking-wide">
                {row.codigoReactivo}
              </span>
            )}
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FAF6F0] border border-[#655D52]/25 text-text-muted">
              {row.modalidad === 'FRASCO_COMPLETO' ? 'Frasco completo' : 'Porción'}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'cantidad',
      header: 'Cantidad',
      width: '11%',
      align: 'center',
      render: (row: PrestamoItem) => (
        <span className="font-sans font-semibold text-text-main text-sm whitespace-nowrap">
          {row.cantidad} {row.unidad ?? ''}
        </span>
      ),
    },
    {
      key: 'fechaSolicitud',
      header: 'Fecha Entrega',
      width: '12%',
      align: 'center',
      render: (row: PrestamoItem) => (
        <span className="font-sans text-xs text-text-main whitespace-nowrap">
          {row.fechaSolicitud}
        </span>
      ),
    },
    {
      key: 'fechaLimite',
      header: 'Fecha Límite',
      width: '12%',
      align: 'center',
      render: (row: PrestamoItem) => (
        <span
          className={cn(
            'font-sans text-xs whitespace-nowrap',
            row.estado === 'vencido'
              ? 'text-alert-danger-border font-bold'
              : 'text-text-main',
          )}
        >
          {row.fechaLimite}
        </span>
      ),
    },
    {
      key: 'estado',
      header: 'Estado',
      width: '11%',
      align: 'center',
      render: (row: PrestamoItem) => renderStatusBadge(row.estado, row.estadoOriginal),
    },
    {
      key: 'acciones',
      header: 'Acciones',
      width: '8%',
      align: 'center',
      render: (row: PrestamoItem) => (
        <div className="flex items-center justify-center">
          <DesktopTableActionButton
            label={`Acciones para préstamo de ${row.responsable}`}
            onClick={() => handleRowSelect(row)}
          />
        </div>
      ),
    },
  ]

  return (
    <DesktopLayout
      activeNavId={activeNavId}
      onNavChange={onNavChange}
    >
      <div className="w-full max-w-[1240px] mx-auto space-y-6">
        {/* Notificación de feedback */}
        {feedbackMessage && (
          <div
            role="status"
            className="flex items-center justify-between rounded-input border border-primary/20 bg-primary-light px-5 py-3.5 text-sm text-text-main shadow-sm animate-in fade-in"
          >
            <span className="font-sans font-medium text-sm">
              {feedbackMessage}
            </span>
            <button
              type="button"
              onClick={() => setFeedbackMessage(null)}
              className="ml-4 text-text-muted hover:text-text-main text-sm font-semibold p-1"
              aria-label="Cerrar notificación"
            >
              ✕
            </button>
          </div>
        )}

        {/* Encabezado Principal fiel al diseño oficial */}
        <div className="flex items-center justify-between select-none">
          <h1 className="font-serif text-[32px] sm:text-4xl font-bold text-primary tracking-tight">
            Préstamos
          </h1>
        </div>

        {/* Barra de herramientas: Buscador oficial, Filtrar, Nuevo */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="w-full max-w-[347px]">
            <InputField
              variant="search"
              placeholder="Buscar solicitante, cédula o reactivo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-[49px] w-full bg-white rounded-[7.5px] border-[#4A4E4A] text-sm text-[#181C1B] placeholder:text-[#4A4E4A] focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <DesktopFilterButton
            onClick={() => setShowFiltersModal((prev) => !prev)}
            className={cn(
              'h-12 rounded-[15px]',
              (showFiltersModal || selectedEstadoFilter !== 'todos' || Boolean(fechaFiltro)) &&
                'bg-[#4A7C59]/15',
            )}
          />

          <DesktopNewButton
            onClick={handleNuevoPrestamo}
            className="h-12 rounded-[15px]"
          >
            Nuevo
          </DesktopNewButton>
        </div>

        {/* Píldoras de filtrado por estado y fecha de entrega (HU10.1) */}
        {showFiltersModal && (
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 pb-1 select-none bg-[#FAF6F0]/60 p-3 rounded-xl border border-[#655D52]/20">
            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="text-xs font-semibold text-text-muted uppercase tracking-wider mr-2 shrink-0">
                Estado:
              </span>
              <button
                type="button"
                onClick={() => setSelectedEstadoFilter('todos')}
                className={cn(
                  'px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0',
                  selectedEstadoFilter === 'todos'
                    ? 'bg-[#4A7C59] text-white shadow-xs'
                    : 'bg-[#FAF6F0] text-text-main hover:bg-[#655D52]/10 border border-[#655D52]/20',
                )}
              >
                Todos ({counts.todos})
              </button>
              <button
                type="button"
                onClick={() => setSelectedEstadoFilter('aprobado')}
                className={cn(
                  'px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0',
                  selectedEstadoFilter === 'aprobado'
                    ? 'bg-[#4A7C59] text-white shadow-xs'
                    : 'bg-[#FAF6F0] text-[#4A7C59] hover:bg-[#4A7C59]/10 border border-[#4A7C59]/30',
                )}
              >
                Activos ({counts.aprobados})
              </button>
              <button
                type="button"
                onClick={() => setSelectedEstadoFilter('vencido')}
                className={cn(
                  'px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0',
                  selectedEstadoFilter === 'vencido'
                    ? 'bg-alert-danger-border text-white shadow-xs'
                    : 'bg-[#FAF6F0] text-alert-danger-border hover:bg-red-50 border border-alert-danger-border/30',
                )}
              >
                Vencidos ({counts.vencidos})
              </button>
              <button
                type="button"
                onClick={() => setSelectedEstadoFilter('devuelto')}
                className={cn(
                  'px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0',
                  selectedEstadoFilter === 'devuelto'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-[#FAF6F0] text-emerald-800 hover:bg-emerald-50 border border-emerald-300/60',
                )}
              >
                Devueltos / Cerrados ({counts.devueltos})
              </button>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="filtro-fecha-prestamo" className="text-xs font-semibold text-text-muted">
                Fecha de entrega:
              </label>
              <input
                id="filtro-fecha-prestamo"
                type="date"
                value={fechaFiltro}
                onChange={(e) => setFechaFiltro(e.target.value)}
                onClick={(e) => {
                  try {
                    e.currentTarget.showPicker?.()
                  } catch {}
                }}
                className="h-8 rounded-lg border border-[#655D52]/30 bg-white px-2.5 text-xs text-text-main cursor-pointer"
              />
              {fechaFiltro && (
                <button
                  type="button"
                  onClick={() => setFechaFiltro('')}
                  className="text-xs text-primary font-semibold hover:underline"
                >
                  Limpiar
                </button>
              )}
            </div>
          </div>
        )}

        {/* Tabla Principal de Escritorio */}
        <DesktopTable<PrestamoItem>
          columns={columns}
          data={filteredPrestamos}
          keyExtractor={(row) => row.id}
          onRowClick={handleRowSelect}
          emptyMessage={
            <div className="py-12 flex flex-col items-center justify-center space-y-3">
              <span className="text-3xl">📋</span>
              <p className="font-serif text-lg font-bold text-text-main">
                No se encontraron préstamos
              </p>
              <p className="font-sans text-xs text-text-muted max-w-sm text-center">
                Intenta ajustar la búsqueda o seleccionar otro estado en los filtros superiores.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery('')
                  setSelectedEstadoFilter('todos')
                  setFechaFiltro('')
                }}
              >
                Restablecer filtros
              </Button>
            </div>
          }
        />

        {/* Modal de Detalle y Devolución del Préstamo Seleccionado (HU10.2, HU10.3, HU10.4) */}
        {selectedItem && (
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
            role="dialog"
            aria-modal="true"
            aria-labelledby="detalle-prestamo-titulo"
          >
            <DesktopCard
              maxWidth="lg"
              className="w-full max-w-xl bg-[#FAF6F0] relative overflow-y-auto max-h-[90vh]"
            >
              {/* Encabezado del modal */}
              <div className="flex items-center justify-between border-b border-[#655D52]/20 pb-4 mb-5">
                <div>
                  <h3
                    id="detalle-prestamo-titulo"
                    className="font-serif text-2xl font-bold text-text-main"
                  >
                    {selectedItem.estado === 'devuelto'
                      ? 'Detalle de Préstamo Cerrado'
                      : 'Gestionar Devolución de Préstamo'}
                  </h3>
                  <p className="font-mono text-xs text-primary font-semibold mt-0.5">
                    Modalidad: {selectedItem.modalidadLabel ?? 'Porción'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-text-muted hover:text-text-main hover:bg-[#655D52]/10 transition-colors"
                  aria-label="Cerrar modal"
                >
                  ✕
                </button>
              </div>

              {errorMessage && (
                <div className="mb-4 rounded-xl border border-alert-danger-border bg-alert-danger-bg px-4 py-2.5 text-xs text-alert-danger-border font-semibold">
                  {errorMessage}
                </div>
              )}

              {/* Contenido del modal */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-3.5 rounded-xl border border-[#655D52]/20">
                    <span className="text-xs text-text-muted font-bold uppercase tracking-wider block">
                      Solicitante / Responsable
                    </span>
                    <p className="font-sans font-semibold text-text-main text-base mt-1">
                      {selectedItem.responsable}
                    </p>
                    <p className="font-sans text-xs text-text-muted">
                      {selectedItem.responsableRol ?? 'Sin identificación adicional'}
                    </p>
                    {selectedItem.solicitanteContacto && (
                      <p className="font-sans text-xs text-primary font-medium mt-0.5">
                        Contacto: {selectedItem.solicitanteContacto}
                      </p>
                    )}
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-[#655D52]/20">
                    <span className="text-xs text-text-muted font-bold uppercase tracking-wider block">
                      Estado del Préstamo
                    </span>
                    <div className="mt-2">
                      {renderStatusBadge(selectedItem.estado, selectedItem.estadoOriginal)}
                    </div>
                    {selectedItem.fechaDevolucionReal && (
                      <p className="text-[11px] text-text-muted mt-1.5">
                        Devuelto el: {selectedItem.fechaDevolucionReal}
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#655D52]/20 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs text-text-muted font-bold uppercase tracking-wider block">
                        Reactivo Prestado
                      </span>
                      <p className="font-serif text-lg font-bold text-primary mt-0.5">
                        {selectedItem.material}
                      </p>
                    </div>
                    {selectedItem.codigoReactivo && (
                      <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-primary-light text-primary font-semibold">
                        {selectedItem.codigoReactivo}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#655D52]/10 text-xs">
                    <div>
                      <span className="text-text-muted block">Cantidad Prestada:</span>
                      <span className="font-semibold text-text-main">
                        {selectedItem.cantidad} {selectedItem.unidad ?? ''}
                      </span>
                    </div>
                    <div>
                      <span className="text-text-muted block">Fecha Entrega:</span>
                      <span className="font-semibold text-text-main">
                        {selectedItem.fechaSolicitud}
                      </span>
                    </div>
                    <div>
                      <span className="text-text-muted block">Fecha Límite:</span>
                      <span
                        className={cn(
                          'font-semibold',
                          selectedItem.estado === 'vencido'
                            ? 'text-alert-danger-border'
                            : 'text-text-main',
                        )}
                      >
                        {selectedItem.fechaLimite}
                      </span>
                    </div>
                  </div>

                  {selectedItem.observaciones && (
                    <div className="pt-2 border-t border-[#655D52]/10 text-xs">
                      <span className="text-text-muted block">Observaciones de salida:</span>
                      <p className="text-text-main italic mt-0.5">{selectedItem.observaciones}</p>
                    </div>
                  )}

                  {selectedItem.incidenciaDevolucion && (
                    <div className="pt-2 border-t border-[#655D52]/10 text-xs">
                      <span className="text-text-muted block">Incidencia / Nota de devolución:</span>
                      <p className="text-text-main font-medium mt-0.5">
                        {selectedItem.incidenciaDevolucion} (Devuelto: {selectedItem.cantidadDevuelta ?? 0}{' '}
                        {selectedItem.unidad ?? ''})
                      </p>
                    </div>
                  )}
                </div>

                {/* Formulario interactivo de devolución cuando el préstamo sigue abierto (HU10.2 - HU10.4) */}
                {selectedItem.estado !== 'devuelto' && (
                  <div className="bg-white p-4 rounded-xl border-2 border-primary/30 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif text-base font-bold text-primary">
                        Registrar Retorno al Inventario
                      </h4>
                      <span className="text-xs font-semibold text-text-muted">
                        Máx: {selectedItem.cantidad} {selectedItem.unidad ?? ''}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label
                          htmlFor="select-estado-cierre"
                          className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1"
                        >
                          Resultado de Devolución
                        </label>
                        <select
                          id="select-estado-cierre"
                          value={estadoCierre}
                          onChange={(e) => {
                            const val = e.target.value as 'DEVUELTO' | 'DEVUELTO_PARCIAL'
                            setEstadoCierre(val)
                            const cantTotal = Number(selectedItem.cantidad) || 0
                            if (val === 'DEVUELTO') {
                              setCantidadDevuelta(cantTotal)
                            } else {
                              setCantidadDevuelta(
                                Number(Math.max(0.01, cantTotal / 2).toFixed(2)),
                              )
                            }
                          }}
                          className="h-10 w-full rounded-input border border-border bg-[#FAF6F0] px-3 text-xs font-semibold text-text-main"
                        >
                          <option value="DEVUELTO">Devolver préstamo completo</option>
                          <option value="DEVUELTO_PARCIAL">Devolver una parte del préstamo</option>
                        </select>
                      </div>

                      <div className="flex flex-col items-center justify-center">
                        <span className="text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
                          ¿Cuánto devuelve? ({selectedItem.unidad ?? 'ml'})
                        </span>
                        <Stepper
                          value={
                            estadoCierre === 'DEVUELTO'
                              ? Number(selectedItem.cantidad) || 0
                              : cantidadDevuelta
                          }
                          onChange={(val) => {
                            const cantTotal = Number(selectedItem.cantidad) || 0
                            setCantidadDevuelta(val)
                            if (val < cantTotal) {
                              setEstadoCierre('DEVUELTO_PARCIAL')
                            } else {
                              setEstadoCierre('DEVUELTO')
                            }
                          }}
                          min={0.01}
                          max={Number(selectedItem.cantidad) || 1000}
                          size="sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="incidencia-devolucion"
                        className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1"
                      >
                        Incidencia o Justificación de Retorno (Opcional si devuelve completo)
                      </label>
                      <textarea
                        id="incidencia-devolucion"
                        rows={2}
                        value={incidenciaDevolucion}
                        onChange={(e) => setIncidenciaDevolucion(e.target.value)}
                        placeholder="Ej. Se consumió 50 ml en práctica docente, se reintegra el remanente al estante..."
                        className="w-full rounded-input border border-border bg-[#FAF6F0] p-2.5 text-xs text-text-main resize-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Botones de acción del modal */}
              <div className="flex items-center justify-between gap-3 pt-5 mt-5 border-t border-[#655D52]/20">
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => setSelectedItem(null)}
                >
                  Cerrar
                </Button>

                {selectedItem.estado !== 'devuelto' && (
                  <Button
                    variant="default"
                    size="default"
                    disabled={isSubmittingReturn}
                    onClick={() => void handleConfirmarDevolucion()}
                  >
                    {isSubmittingReturn
                      ? 'Procesando devolución...'
                      : 'Confirmar Devolución y Reintegrar Stock'}
                  </Button>
                )}
              </div>
            </DesktopCard>
          </div>
        )}
      </div>
    </DesktopLayout>
  )
}

export default DesktopPrestamosPage
