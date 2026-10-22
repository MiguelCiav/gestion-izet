import * as React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FlaskConical } from 'lucide-react'
import {
  DesktopLayout,
  DesktopCard,
} from '@/components/desktop'
import {
  Button,
  InputField,
  Stepper,
  Checkbox,
  ReactivoCard,
  SearchWrapper,
  SectionHeader,
} from '@/components/ui'
import { cn } from '@/lib/utils'
import { useAuth } from '@/features/auth/hooks'
import {
  fetchInventarioLaboratorio,
  mapInventarioToPrestamoReactivos,
  registrarPrestamoEnSupabase,
  LABORATORIOS_INFO,
} from '@/lib/izetService'
import type {
  PrestamoReactivo,
  ModalidadPrestamo,
  DesktopPrestamoSolicitudFormData,
  PrestamosDetalleLocationState,
} from '../types'

export interface DesktopPrestamosSolicitarPageProps {
  /**
   * Reactivo preseleccionado inicial (opcional)
   */
  initialReactivo?: PrestamoReactivo
  /**
   * Callback invocado al confirmar la solicitud de préstamo
   */
  onSubmit?: (data: DesktopPrestamoSolicitudFormData) => void
  /**
   * Callback invocado al cancelar o volver
   */
  onVolver?: () => void
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
 * Obtiene la fecha actual formateada como YYYY-MM-DD para inputs de tipo date.
 */
function getTodayString(): string {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Obtiene una fecha desplazada en días respecto a hoy (por defecto +7 días).
 */
function getFutureDateString(daysAhead: number = 7): string {
  const date = new Date()
  date.setDate(date.getDate() + daysAhead)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * DesktopPrestamosSolicitarPage - Pantalla de solicitud y creación de nuevos préstamos (HU09).
 */
export function DesktopPrestamosSolicitarPage({
  initialReactivo,
  onSubmit,
  onVolver,
  activeNavId = 'prestamos',
  onNavChange,
}: DesktopPrestamosSolicitarPageProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { activeLab, user } = useAuth()
  const isAdmin = user?.rol === 'admin'
  const locationState = location.state as PrestamosDetalleLocationState | null

  // Reactivos disponibles cargados de Supabase
  const [reactivosList, setReactivosList] = React.useState<PrestamoReactivo[]>([])
  const [isLoading, setIsLoading] = React.useState<boolean>(true)

  // Reactivo seleccionado
  const [selectedReactivo, setSelectedReactivo] = React.useState<PrestamoReactivo | null>(
    initialReactivo ?? locationState?.reactivo ?? null,
  )

  // Búsqueda de reactivos en la columna izquierda
  const [searchReactivo, setSearchReactivo] = React.useState<string>('')

  // Estado del formulario de préstamo (HU09.1, HU09.2, HU09.3)
  const [modalidad, setModalidad] = React.useState<ModalidadPrestamo>('FRACCION')
  const [responsable, setResponsable] = React.useState<string>('')
  const [cedula, setCedula] = React.useState<string>('')
  const [departamento, setDepartamento] = React.useState<string>('')
  const [contacto, setContacto] = React.useState<string>('')
  const [cantidad, setCantidad] = React.useState<number>(1)
  const [fechaSolicitud, setFechaSolicitud] = React.useState<string>(getTodayString())
  const [fechaLimite, setFechaLimite] = React.useState<string>(getFutureDateString(7))
  const [observaciones, setObservaciones] = React.useState<string>('')
  const [registrarOtra, setRegistrarOtra] = React.useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  // Errores de validación
  const [errors, setErrors] = React.useState<{
    responsable?: string
    cedula?: string
    departamento?: string
    cantidad?: string
    submit?: string
  }>({})

  // Mensaje de éxito tras confirmación cuando registrarOtra=true
  const [successBanner, setSuccessBanner] = React.useState<string | null>(null)

  const loadReactivos = React.useCallback(async () => {
    setIsLoading(true)
    const inv = await fetchInventarioLaboratorio(activeLab)
    const mapped = mapInventarioToPrestamoReactivos(inv)
    setReactivosList(mapped)
    if (!initialReactivo && !locationState?.reactivo) {
      setSelectedReactivo(mapped[0] || null)
    } else {
      const currentId = (initialReactivo ?? locationState?.reactivo)?.id
      const found = mapped.find((r) => r.id === currentId)
      setSelectedReactivo(found || mapped[0] || null)
    }
    setIsLoading(false)
  }, [activeLab, initialReactivo, locationState?.reactivo])

  React.useEffect(() => {
    void loadReactivos()
  }, [loadReactivos])

  // Filtrado de reactivos disponibles
  const filteredReactivos = React.useMemo(() => {
    if (!searchReactivo.trim()) return reactivosList
    const query = searchReactivo.toLowerCase().trim()
    return reactivosList.filter(
      (r) =>
        r.nombre.toLowerCase().includes(query) ||
        r.codigo.toLowerCase().includes(query) ||
        (r.ubicacion && r.ubicacion.toLowerCase().includes(query)),
    )
  }, [reactivosList, searchReactivo])

  // Límite de stock numérico
  const stockDisponible = React.useMemo(() => {
    if (!selectedReactivo) return 0
    if (typeof selectedReactivo.stock === 'number') {
      return selectedReactivo.stock
    }
    const parsed = Number.parseFloat(String(selectedReactivo.stock))
    return Number.isNaN(parsed) ? 1000 : parsed
  }, [selectedReactivo])

  const handleSelectReactivo = (item: PrestamoReactivo) => {
    setSelectedReactivo(item)
    const maxStock =
      typeof item.stock === 'number'
        ? item.stock
        : Number.parseFloat(String(item.stock)) || 1
    if (modalidad === 'FRASCO_COMPLETO') {
      setCantidad(maxStock)
    } else {
      setCantidad(1)
    }
  }

  const handleModalidadChange = (nuevaModalidad: ModalidadPrestamo) => {
    setModalidad(nuevaModalidad)
    if (nuevaModalidad === 'FRASCO_COMPLETO') {
      setCantidad(stockDisponible)
    } else {
      setCantidad(Math.min(10, stockDisponible))
    }
  }

  const handleVolver = () => {
    if (onVolver) {
      onVolver()
    } else if (isAdmin) {
      navigate('/prestamos')
    } else {
      setCantidad(1)
      setObservaciones('')
      setErrors({})
    }
  }

  const validateForm = (): boolean => {
    const newErrors: {
      responsable?: string
      cedula?: string
      departamento?: string
      cantidad?: string
      submit?: string
    } = {}

    if (!selectedReactivo) {
      newErrors.submit = 'Debes seleccionar un reactivo para solicitar el préstamo.'
      setErrors(newErrors)
      return false
    }

    if (isAdmin) {
      if (!responsable.trim()) {
        newErrors.responsable = 'El nombre del solicitante es obligatorio.'
      }
      if (!cedula.trim()) {
        newErrors.cedula = 'La cédula o identificación es obligatoria.'
      }
      if (!departamento.trim()) {
        newErrors.departamento = 'El laboratorio o institución de procedencia es obligatorio.'
      }
    }
    if (cantidad <= 0) {
      newErrors.cantidad = 'La cantidad debe ser mayor a 0.'
    } else if (cantidad > stockDisponible) {
      newErrors.cantidad = `La cantidad excede el stock disponible (${stockDisponible} ${selectedReactivo?.unidad ?? ''}).`
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleConfirmar = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedReactivo) {
      setErrors({ submit: 'Debes seleccionar un reactivo para solicitar el préstamo.' })
      return
    }

    if (!validateForm()) return

    const autoNombre = user?.username || 'Usuario Registrado'
    const autoCedula = user?.cedula || 'S/C'
    const autoLab = user?.lab
      ? `${LABORATORIOS_INFO[user.lab].nombre} (${user.lab})`
      : `${LABORATORIOS_INFO[activeLab].nombre} (${activeLab})`
    const autoContacto = user?.contacto || user?.email || undefined

    const finalResponsable = isAdmin ? responsable.trim() : autoNombre
    const finalCedula = isAdmin ? cedula.trim() : autoCedula
    const finalDepartamento = isAdmin ? departamento.trim() : autoLab
    const finalContacto = isAdmin ? contacto.trim() || undefined : autoContacto

    const formData: DesktopPrestamoSolicitudFormData = {
      reactivoId: selectedReactivo.id,
      reactivoNombre: selectedReactivo.nombre,
      reactivoCodigo: selectedReactivo.codigo,
      modalidad,
      cantidad: modalidad === 'FRASCO_COMPLETO' ? stockDisponible : cantidad,
      unidad: selectedReactivo.unidad,
      responsable: finalResponsable,
      cedula: finalCedula,
      contacto: finalContacto,
      departamento: finalDepartamento,
      fechaSolicitud,
      fechaLimite,
      observaciones: observaciones.trim() || undefined,
      registrarOtra,
    }

    if (onSubmit) {
      onSubmit(formData)
      return
    }

    setIsSubmitting(true)
    setErrors({})

    const res = await registrarPrestamoEnSupabase({
      reactivoId: selectedReactivo.id,
      lab: activeLab,
      solicitanteNombre: formData.responsable,
      solicitanteCedula: formData.cedula || 'S/C',
      solicitanteInstitucion: formData.departamento || activeLab,
      solicitanteContacto: formData.contacto,
      tipoPrestamo: modalidad,
      cantidad: formData.cantidad,
      fechaPrestamo: fechaSolicitud,
      fechaEstimadaDevolucion: fechaLimite,
      observaciones: formData.observaciones,
      nombreRegistrador: user?.username || 'Personal de Laboratorio',
    })

    setIsSubmitting(false)

    if (!res.success) {
      setErrors({
        submit: res.error || 'No se pudo registrar el préstamo en el servidor.',
      })
      return
    }

    await loadReactivos()

    const unidadLabel = selectedReactivo.unidad ? ` ${selectedReactivo.unidad}` : ''
    const modText = modalidad === 'FRASCO_COMPLETO' ? 'Frasco completo' : `${formData.cantidad}${unidadLabel}`

    if (registrarOtra || !isAdmin) {
      setSuccessBanner(
        `Préstamo (${modText}) de "${selectedReactivo.nombre}" registrado exitosamente para ${finalResponsable}.`,
      )
      setCantidad(1)
      setObservaciones('')
    } else {
      navigate('/prestamos', {
        state: {
          successMessage: `Préstamo (${modText}) de "${selectedReactivo.nombre}" registrado exitosamente y asentado en la Bitácora.`,
        },
      })
    }
  }

  const cantidadEfectiva = modalidad === 'FRASCO_COMPLETO' ? stockDisponible : cantidad
  const restanteEstimado = Number(Math.max(0, stockDisponible - cantidadEfectiva).toFixed(4))
  const unidadLabel = selectedReactivo?.unidad || 'ml'

  return (
    <DesktopLayout
      activeNavId={activeNavId}
      onNavChange={onNavChange}
    >
      <div className="w-full max-w-[1240px] mx-auto flex flex-col space-y-6">
        {/* Banner de éxito al registrar solicitudes consecutivas */}
        {successBanner && (
          <div
            role="status"
            className="flex items-center justify-between rounded-input border border-primary/25 bg-primary-light px-5 py-3.5 text-sm text-text-main shadow-sm animate-in fade-in"
          >
            <div className="flex items-center gap-3">
              <span className="text-primary font-bold">✓</span>
              <span className="font-sans font-medium text-sm">
                {successBanner}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSuccessBanner(null)}
              className="ml-4 text-text-muted hover:text-text-main text-sm font-semibold p-1"
              aria-label="Cerrar notificación"
            >
              ✕
            </button>
          </div>
        )}

        {errors.submit && (
          <div
            role="alert"
            className="rounded-input border border-alert-danger-border bg-alert-danger-bg px-5 py-3.5 text-sm text-alert-danger-border font-semibold"
          >
            {errors.submit}
          </div>
        )}

        {/* Encabezado Principal */}
        <div className="flex items-center justify-between flex-wrap gap-4 select-none">
          <h1 className="font-serif text-[32px] sm:text-4xl font-bold text-primary tracking-tight">
            Solicitar Préstamo
          </h1>

          {isAdmin && (
            <Button
              variant="outline"
              size="default"
              onClick={handleVolver}
            >
              Volver al listado
            </Button>
          )}
        </div>

        {/* Tarjeta Contenedora Principal */}
        {isLoading ? (
          <DesktopCard
            variant="default"
            padding="lg"
            maxWidth="full"
            className="flex items-center justify-center py-24"
          >
            <div className="flex flex-col items-center space-y-3">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="font-sans text-sm text-[#655D52]">
                Cargando reactivos de {activeLab}...
              </p>
            </div>
          </DesktopCard>
        ) : reactivosList.length === 0 ? (
          <DesktopCard
            variant="default"
            padding="lg"
            maxWidth="full"
            className="py-16 text-center"
          >
            <div className="max-w-md mx-auto flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                <FlaskConical className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-text-main mb-2">
                No hay reactivos en inventario
              </h3>
              <p className="font-sans text-sm text-[#655D52] mb-6">
                Actualmente no existen reactivos registrados en el inventario del laboratorio {activeLab} para solicitar préstamos.
              </p>
              <div className="flex items-center gap-3">
                {isAdmin ? (
                  <Button variant="default" onClick={() => navigate('/inventario')}>
                    Ir al Inventario
                  </Button>
                ) : (
                  <Button variant="default" onClick={() => navigate('/dashboard')}>
                    Volver al Dashboard
                  </Button>
                )}
                {isAdmin && (
                  <Button variant="outline" onClick={handleVolver}>
                    Volver a Préstamos
                  </Button>
                )}
              </div>
            </div>
          </DesktopCard>
        ) : (
          <DesktopCard
            variant="default"
            padding="none"
            maxWidth="full"
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[#655D52]/30">
              {/* ============================================================= */}
              {/* COLUMNA IZQUIERDA: Escoge el reactivo                         */}
              {/* ============================================================= */}
              <div className="p-6 md:p-8 flex flex-col space-y-6">
                <SectionHeader title="Escoge el reactivo" />

                <SearchWrapper
                  value={searchReactivo}
                  onChange={(e) => setSearchReactivo(e.target.value)}
                  placeholder="Buscar reactivo..."
                  showFilterButton={false}
                  className="w-full max-w-none"
                />

                {/* Lista de tarjetas de reactivos */}
                <div
                  role="radiogroup"
                  aria-label="Lista de reactivos disponibles para préstamo"
                  className="flex flex-col space-y-3 select-none"
                >
                  {filteredReactivos.length === 0 ? (
                    <div className="py-12 text-center text-sm font-sans text-[#655D52]">
                      No se encontraron reactivos disponibles con ese criterio.
                    </div>
                  ) : (
                    filteredReactivos.map((reactivo) => {
                      const isSelected = selectedReactivo ? selectedReactivo.id === reactivo.id : false
                      return (
                        <div
                          key={reactivo.id}
                          onClick={() => handleSelectReactivo(reactivo)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              handleSelectReactivo(reactivo)
                            }
                          }}
                          tabIndex={0}
                          role="radio"
                          aria-checked={isSelected}
                          className={cn(
                            'cursor-pointer transition-all duration-150 rounded-[12px]',
                            isSelected
                              ? 'ring-2 ring-[#4A7C59] shadow-md bg-white'
                              : 'hover:ring-1 hover:ring-[#4A7C59]/40 hover:bg-white/60',
                          )}
                        >
                          <ReactivoCard
                            name={reactivo.nombre}
                            code={reactivo.codigo}
                            stock={`${reactivo.stock} ${reactivo.unidad ?? 'ml'}`}
                            expirationDate={reactivo.fechaVencimiento}
                            salud={reactivo.salud}
                            inflamabilidad={reactivo.inflamabilidad}
                            reactividad={reactivo.reactividad}
                            especial={reactivo.especial}
                            selected={isSelected}
                            accentColor={isSelected ? '#4A7C59' : '#655D52'}
                            romboSize={48}
                            className="bg-transparent border-0"
                          />
                        </div>
                      )
                    })
                  )}
                </div>
              </div>

              {/* ============================================================= */}
              {/* COLUMNA DERECHA: Datos del préstamo                           */}
              {/* ============================================================= */}
              <div className="p-6 md:p-8 flex flex-col justify-between space-y-6 bg-[#FAF6F0]">
                {selectedReactivo ? (
                  <form
                    onSubmit={(e) => void handleConfirmar(e)}
                    noValidate
                    className="flex flex-col h-full justify-between space-y-6"
                  >
                    <div className="space-y-6">
                      <SectionHeader title="Datos del préstamo" />

                      {/* Modalidad de Préstamo */}
                      <div className="space-y-2">
                        <span className="block text-xs font-sans font-semibold text-[#4A4E4A]">
                          Modalidad de préstamo
                        </span>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => handleModalidadChange('FRACCION')}
                            className={cn(
                              'h-11 px-4 rounded-input border text-sm font-sans font-semibold transition-all cursor-pointer',
                              modalidad === 'FRACCION'
                                ? 'bg-primary text-white border-primary'
                                : 'bg-white border-[#655D52]/40 text-text-main hover:bg-primary-light/40',
                            )}
                          >
                            Porción
                          </button>

                          <button
                            type="button"
                            onClick={() => handleModalidadChange('FRASCO_COMPLETO')}
                            className={cn(
                              'h-11 px-4 rounded-input border text-sm font-sans font-semibold transition-all cursor-pointer',
                              modalidad === 'FRASCO_COMPLETO'
                                ? 'bg-primary text-white border-primary'
                                : 'bg-white border-[#655D52]/40 text-text-main hover:bg-primary-light/40',
                            )}
                          >
                            Frasco completo
                          </button>
                        </div>
                      </div>

                      {/* Tabla / Grid de asignación de cantidad (Congruente con Consumo) */}
                      <div className="bg-white border-2 border-[#4A4E4A] rounded-[16px] overflow-hidden shadow-sm">
                        <div className="grid grid-cols-2 bg-[#FAF6F0] border-b border-[#4A4E4A] px-6 py-3 font-serif font-bold text-sm text-[#181C1B]">
                          <div>Reactivo</div>
                          <div className="text-right">Cantidad ({unidadLabel})</div>
                        </div>

                        <div className="grid grid-cols-2 items-center px-6 py-5 border-b border-[#655D52]/20">
                          <div>
                            <span className="font-serif font-bold text-lg text-[#181C1B] block">
                              {selectedReactivo.nombre}
                            </span>
                            <span className="font-sans text-xs text-[#655D52] block mt-0.5">
                              Código: {selectedReactivo.codigo} &bull; Stock: {selectedReactivo.stock} {unidadLabel}
                            </span>
                          </div>

                          <div className="flex items-center justify-end">
                            <Stepper
                              id="prestamo-stepper"
                              value={cantidadEfectiva}
                              onChange={(val) => {
                                if (modalidad === 'FRASCO_COMPLETO') return
                                setCantidad(val)
                                if (errors.cantidad) {
                                  setErrors((prev) => ({ ...prev, cantidad: undefined }))
                                }
                              }}
                              min={0.01}
                              max={Math.max(0.01, stockDisponible)}
                              step={1}
                              size="sm"
                              disabled={modalidad === 'FRASCO_COMPLETO'}
                              ariaLabel={`Cantidad a prestar en ${unidadLabel}`}
                            />
                          </div>
                        </div>

                        <div className="px-6 py-4 bg-[#FAF6F0]/60 flex items-center justify-between text-xs font-sans text-[#655D52]">
                          <span>Stock disponible restante tras préstamo:</span>
                          <strong className="text-[#181C1B] font-semibold text-sm">
                            {restanteEstimado} {unidadLabel}
                          </strong>
                        </div>
                      </div>

                      {errors.cantidad && (
                        <p className="text-xs text-alert-danger-border font-medium">
                          {errors.cantidad}
                        </p>
                      )}

                      {/* Datos del Solicitante: Solo visibles cuando el administrador registra el préstamo por su cuenta (HU09) */}
                      {isAdmin && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <InputField
                            id="prestamo-responsable"
                            label="Nombre del Solicitante *"
                            placeholder="Ej. Dra. Carmen Morales"
                            value={responsable}
                            onChange={(e) => {
                              setResponsable(e.target.value)
                              if (errors.responsable) {
                                setErrors((prev) => ({ ...prev, responsable: undefined }))
                              }
                            }}
                            error={errors.responsable}
                            className="bg-white"
                          />

                          <InputField
                            id="prestamo-cedula"
                            label="Cédula / Identificación *"
                            placeholder="Ej. V-14892103"
                            value={cedula}
                            onChange={(e) => {
                              setCedula(e.target.value)
                              if (errors.cedula) {
                                setErrors((prev) => ({ ...prev, cedula: undefined }))
                              }
                            }}
                            error={errors.cedula}
                            className="bg-white"
                          />

                          <InputField
                            id="prestamo-departamento"
                            label="Laboratorio / Institución Destino *"
                            placeholder="Ej. Lab. de Ecología de Microorganismos (LEM)"
                            value={departamento}
                            onChange={(e) => {
                              setDepartamento(e.target.value)
                              if (errors.departamento) {
                                setErrors((prev) => ({ ...prev, departamento: undefined }))
                              }
                            }}
                            error={errors.departamento}
                            className="bg-white"
                          />

                          <InputField
                            id="prestamo-contacto"
                            label="Teléfono o Correo de Contacto"
                            placeholder="Ej. 0414-5551234 / correo@ucv.ve"
                            value={contacto}
                            onChange={(e) => setContacto(e.target.value)}
                            className="bg-white"
                          />
                        </div>
                      )}

                      {/* Fila de Fechas */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="prestamo-fecha-solicitud"
                            className="block text-xs font-sans font-semibold text-[#4A4E4A] mb-1.5"
                          >
                            Fecha del préstamo
                          </label>
                          <input
                            id="prestamo-fecha-solicitud"
                            type="date"
                            value={fechaSolicitud}
                            onChange={(e) => setFechaSolicitud(e.target.value)}
                            onClick={(e) => {
                              try {
                                e.currentTarget.showPicker?.()
                              } catch {}
                            }}
                            className="h-11 w-full rounded-input border border-[#655D52]/40 bg-white px-3.5 text-sm text-[#181C1B] focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="prestamo-fecha-limite"
                            className="block text-xs font-sans font-semibold text-[#4A4E4A] mb-1.5"
                          >
                            Fecha estimada de retorno
                          </label>
                          <input
                            id="prestamo-fecha-limite"
                            type="date"
                            value={fechaLimite}
                            onChange={(e) => setFechaLimite(e.target.value)}
                            onClick={(e) => {
                              try {
                                e.currentTarget.showPicker?.()
                              } catch {}
                            }}
                            className="h-11 w-full rounded-input border border-[#655D52]/40 bg-white px-3.5 text-sm text-[#181C1B] focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                          />
                        </div>
                      </div>

                      {/* Motivo / Observaciones */}
                      <div>
                        <label
                          htmlFor="prestamo-observaciones"
                          className="block text-xs font-sans font-semibold text-[#4A4E4A] mb-1.5"
                        >
                          Observaciones / Motivo de préstamo (opcional)
                        </label>
                        <input
                          id="prestamo-observaciones"
                          type="text"
                          value={observaciones}
                          onChange={(e) => setObservaciones(e.target.value)}
                          placeholder="Detalles sobre el ensayo, práctica o proyecto destino..."
                          className="h-11 w-full rounded-input border border-[#655D52]/40 bg-white px-3.5 text-sm text-[#181C1B] focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      {/* Checkbox para Registrar Otra Solicitud */}
                      <div className="pt-1">
                        <Checkbox
                          id="prestamo-registrar-otra"
                          checked={registrarOtra}
                          onChange={(e) => setRegistrarOtra(e.target.checked)}
                          label="Registrar otra solicitud después de confirmar esta."
                          description="Te mantendrá en esta pantalla tras guardar los cambios."
                        />
                      </div>
                    </div>

                    {/* Botón inferior Confirmar */}
                    <div className="pt-4">
                      <Button
                        type="submit"
                        variant="default"
                        size="lg"
                        fullWidth
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Registrando...' : 'Confirmar'}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="py-20 text-center flex flex-col items-center justify-center space-y-3">
                    <FlaskConical className="w-12 h-12 text-[#655D52]/40" />
                    <p className="font-sans text-sm font-medium text-[#655D52]">
                      Selecciona un reactivo de la columna izquierda para configurar la solicitud de préstamo.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </DesktopCard>
        )}
      </div>
    </DesktopLayout>
  )
}

export default DesktopPrestamosSolicitarPage
