import * as React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  DesktopLayout,
  DesktopCard,
  DesktopActionButton,
} from '@/components/desktop'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { ReactivoCard } from '@/components/ui/ReactivoCard'
import { Stepper } from '@/components/ui/Stepper'
import { SearchWrapper } from '@/components/ui/SearchWrapper'
import { SectionHeader } from '@/components/ui/SectionCard'
import { useAuth } from '@/features/auth/hooks'
import {
  fetchInventarioLaboratorio,
  mapInventarioToConsumoReactivos,
  registrarConsumoEnSupabase,
  evaluarCaducidad,
} from '@/lib/izetService'
import type {
  ConsumoFormValues,
  DesktopConsumoPageProps,
  Reactivo,
} from '../types'

function ConfirmCheckIcon({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>): React.JSX.Element {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M3.75 9.75L7.5 13.5L14.25 4.5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function BackArrowIcon({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>): React.JSX.Element {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M19 12H5M5 12L12 19M5 12L12 5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function DesktopConsumoPage({
  reactivos: propReactivos,
  initialReactivoId,
  onSelectReactivo,
  onBack,
  onConfirm,
  onFilterClick,
  className,
}: DesktopConsumoPageProps): React.JSX.Element {
  const navigate = useNavigate()
  const location = useLocation()
  const { activeLab, user } = useAuth()

  const stateReactivo = (location.state as { reactivo?: Reactivo } | null)?.reactivo

  const [reactivos, setReactivos] = React.useState<Reactivo[]>(
    propReactivos ?? [],
  )
  const [selectedReactivo, setSelectedReactivo] = React.useState<Reactivo | null>(() => {
    if (stateReactivo) return stateReactivo
    if (initialReactivoId && propReactivos) {
      const found = propReactivos.find((r) => r.id === initialReactivoId)
      if (found) return found
    }
    return (propReactivos ?? [])[0] ?? null
  })

  const [cantidad, setCantidad] = React.useState<number>(10)
  const [motivo, setMotivo] = React.useState<string>('')
  const [registrarOtro, setRegistrarOtro] = React.useState<boolean>(false)
  const [confirmarVencido, setConfirmarVencido] = React.useState<boolean>(false)
  const [searchTerm, setSearchTerm] = React.useState<string>('')
  const [isConfirmed, setIsConfirmed] = React.useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null)

  const loadReactivosFromSupabase = React.useCallback(async () => {
    if (propReactivos) return
    const inv = await fetchInventarioLaboratorio(activeLab)
    const mapped = mapInventarioToConsumoReactivos(inv)
    setReactivos(mapped)
    setSelectedReactivo((prev) => {
      if (stateReactivo) return stateReactivo
      const match = mapped.find((m) => m.id === prev?.id)
      return match || mapped[0] || null
    })
  }, [activeLab, propReactivos, stateReactivo])

  React.useEffect(() => {
    void loadReactivosFromSupabase()
  }, [loadReactivosFromSupabase])

  const filteredReactivos = React.useMemo<Reactivo[]>(() => {
    if (!searchTerm.trim()) return reactivos
    const lower = searchTerm.toLowerCase().trim()
    return reactivos.filter(
      (r) =>
        r.name.toLowerCase().includes(lower) ||
        r.code.toLowerCase().includes(lower),
    )
  }, [reactivos, searchTerm])

  const stockNumeric = React.useMemo(() => {
    if (!selectedReactivo) return 0
    if (typeof selectedReactivo.stockNumeric === 'number') {
      return selectedReactivo.stockNumeric
    }
    const parsed = parseFloat(String(selectedReactivo.stock))
    return Number.isNaN(parsed) ? 500 : parsed
  }, [selectedReactivo])

  const caducidad = React.useMemo(() => {
    if (!selectedReactivo) return { estado: 'sin_vencimiento' as const, label: '' }
    if (selectedReactivo.caducidadEstado) {
      return {
        estado: selectedReactivo.caducidadEstado,
        label: selectedReactivo.caducidadLabel || 'Vencido',
      }
    }
    return evaluarCaducidad(
      selectedReactivo.rawExpirationDate || selectedReactivo.expirationDate,
    )
  }, [selectedReactivo])

  const isSelectedVencido = caducidad.estado === 'vencido'

  const handleNavChange = (id: string): void => {
    if (id === 'dashboard') {
      navigate('/dashboard')
    } else {
      navigate(`/${id}`)
    }
  }

  const handleBackToDashboard = (): void => {
    if (onBack) {
      onBack()
    } else {
      navigate('/dashboard')
    }
  }

  const handleCardSelect = (reactivo: Reactivo): void => {
    setSelectedReactivo(reactivo)
    setConfirmarVencido(false)
    setErrorMsg(null)
    const maxS = reactivo.stockNumeric ?? (parseFloat(String(reactivo.stock)) || 100)
    if (cantidad > maxS) {
      setCantidad(Number(Math.max(0.01, Math.min(10, maxS)).toFixed(2)))
    }
    onSelectReactivo?.(reactivo)
  }

  const handleConfirmSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (!selectedReactivo) return

    if (cantidad <= 0 || cantidad > stockNumeric) {
      setErrorMsg(`La cantidad debe ser positiva y no exceder el stock disponible (${stockNumeric} ${selectedReactivo.unit || 'ml'}).`)
      return
    }

    if (isSelectedVencido && !confirmarVencido) {
      setErrorMsg('Debe confirmar explícitamente el uso del reactivo vencido antes de continuar.')
      return
    }

    setErrorMsg(null)
    setIsSubmitting(true)

    const values: ConsumoFormValues = {
      cantidad,
      registrarOtro,
      motivo: motivo.trim() || undefined,
      confirmarVencido,
    }

    // Si es un UUID real de Supabase, ejecutar RPC atómico registrar_consumo_reactivo
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-/i.test(selectedReactivo.id)) {
      const res = await registrarConsumoEnSupabase({
        reactivoId: selectedReactivo.id,
        lab: activeLab,
        cantidad,
        motivo:
          motivo.trim() ||
          `Consumo registrado en ${activeLab}${isSelectedVencido ? ' (Lote vencido autorizado)' : ''}`,
        responsable: user?.username || 'Personal de Laboratorio',
      })

      if (!res.success) {
        setIsSubmitting(false)
        setErrorMsg(res.error || 'No se pudo registrar el consumo.')
        return
      }
      await loadReactivosFromSupabase()
    }

    setIsSubmitting(false)
    onConfirm?.(values, selectedReactivo)
    setIsConfirmed(true)

    if (registrarOtro || user?.rol !== 'admin') {
      setTimeout(() => {
        setIsConfirmed(false)
        setCantidad(1)
        setMotivo('')
        setConfirmarVencido(false)
      }, 1000)
    } else {
      setTimeout(() => {
        navigate('/dashboard')
      }, 1000)
    }
  }

  const restanteEstimado = Number(Math.max(0, stockNumeric - cantidad).toFixed(4))
  const unidadLabel = selectedReactivo?.unit || 'ml'
  const isAdmin = user?.rol === 'admin'

  return (
    <DesktopLayout
      activeNavId={isAdmin ? 'dashboard' : 'consumo'}
      onNavChange={handleNavChange}
      contentClassName={className}
    >
      <div className="w-full max-w-[1240px] mx-auto flex flex-col space-y-6">
        {/* Cabecera principal de la sección */}
        <div className="flex items-center justify-between flex-wrap gap-4 select-none">
          <div>
            {isAdmin && (
              <button
                type="button"
                onClick={handleBackToDashboard}
                className="inline-flex items-center gap-1.5 text-sm font-sans font-medium text-[#655D52] hover:text-primary transition-colors mb-1 cursor-pointer"
              >
                <BackArrowIcon className="w-4 h-4" />
                <span>Volver al Dashboard</span>
              </button>
            )}
            <h1 className="font-serif text-[32px] sm:text-4xl font-bold text-primary tracking-tight">
              Registrar Consumo
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <DesktopActionButton
              variant="new"
              label="Nuevo consumo"
              onClick={() => {
                setSelectedReactivo(reactivos[0] || null)
                setCantidad(10)
                setMotivo('')
                setConfirmarVencido(false)
                setIsConfirmed(false)
                setErrorMsg(null)
              }}
              className="text-sm font-semibold"
            />
          </div>
        </div>

        {/* Tarjeta principal contenedor en 2 columnas */}
        <DesktopCard
          variant="default"
          padding="none"
          maxWidth="full"
          className="overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[#655D52]/30">
            {/* Columna Izquierda: Escoge el reactivo */}
            <div className="p-6 md:p-8 flex flex-col space-y-6">
              <SectionHeader title="Escoge el reactivo" />

              <SearchWrapper
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar reactivo..."
                onFilterClick={onFilterClick}
                showFilterButton={Boolean(onFilterClick)}
                className="w-full max-w-none"
              />

              <div
                role="radiogroup"
                aria-label="Catálogo de reactivos para consumo"
                className="flex flex-col space-y-3 select-none"
              >
                {filteredReactivos.length > 0 ? (
                  filteredReactivos.map((reactivo) => {
                    const isSelected = selectedReactivo?.id === reactivo.id
                    return (
                      <div
                        key={reactivo.id}
                        onClick={() => handleCardSelect(reactivo)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            handleCardSelect(reactivo)
                          }
                        }}
                        role="radio"
                        aria-checked={isSelected}
                        tabIndex={0}
                        className={`cursor-pointer transition-all duration-150 rounded-[12px] ${
                          isSelected
                            ? 'ring-2 ring-[#4A7C59] shadow-md bg-white'
                            : 'hover:ring-1 hover:ring-[#4A7C59]/40 hover:bg-white/60'
                        }`}
                      >
                        <ReactivoCard
                          name={reactivo.name}
                          code={reactivo.code}
                          stock={reactivo.stock}
                          expirationDate={reactivo.expirationDate}
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
                ) : (
                  <div className="py-12 text-center text-sm font-sans text-[#655D52]">
                    No se encontraron reactivos que coincidan con &ldquo;{searchTerm}&rdquo;.
                  </div>
                )}
              </div>
            </div>

            {/* Columna Derecha: Indica la cantidad */}
            <div className="p-6 md:p-8 flex flex-col justify-between space-y-6 bg-[#FAF6F0]">
              <form
                onSubmit={handleConfirmSubmit}
                noValidate
                className="flex flex-col h-full justify-between space-y-6"
              >
                <div className="space-y-6">
                  <SectionHeader title="Indica la cantidad" />

                  {/* Advertencia Crítica si el reactivo seleccionado está VENCIDO (HU08.3) */}
                  {isSelectedVencido && (
                    <div className="space-y-3">
                      <Alert
                        variant="danger"
                        title={`Advertencia de Uso Crítico: ${selectedReactivo?.name} Vencido`}
                        description={`Este reactivo se encuentra vencido (${caducidad.label}). Se requiere confirmación explícita del investigador responsable para autorizar su consumo.`}
                      />
                      <div className="p-3 bg-[#FFDAD6]/30 border border-[#B83230]/40 rounded-xl">
                        <Checkbox
                          id="desktop-confirmar-reactivo-vencido"
                          checked={confirmarVencido}
                          onChange={(e) => setConfirmarVencido(e.target.checked)}
                          label="Confirmo explícitamente el uso bajo responsabilidad técnica de este reactivo vencido."
                        />
                      </div>
                    </div>
                  )}

                  {errorMsg && (
                    <div className="p-3.5 rounded-xl bg-alert-danger-bg text-alert-danger-border border border-alert-danger-border text-xs font-semibold">
                      {errorMsg}
                    </div>
                  )}

                  {/* Tabla / Grid de asignación de consumo */}
                  <div className="bg-white border-2 border-[#4A4E4A] rounded-[16px] overflow-hidden shadow-sm">
                    <div className="grid grid-cols-2 bg-[#FAF6F0] border-b border-[#4A4E4A] px-6 py-3 font-serif font-bold text-sm text-[#181C1B]">
                      <div>Reactivo</div>
                      <div className="text-right">Cantidad ({unidadLabel})</div>
                    </div>

                    <div className="grid grid-cols-2 items-center px-6 py-5 border-b border-[#655D52]/20">
                      <div>
                        <span className="font-serif font-bold text-lg text-[#181C1B] block">
                          {selectedReactivo?.name || 'Seleccione un reactivo'}
                        </span>
                        <span className="font-sans text-xs text-[#655D52] block mt-0.5">
                          Código: {selectedReactivo?.code || '—'} &bull; Stock: {selectedReactivo?.stock || '—'}
                        </span>
                      </div>

                      <div className="flex items-center justify-end">
                        <Stepper
                          value={cantidad}
                          onChange={setCantidad}
                          min={0.01}
                          max={Math.max(0.01, stockNumeric)}
                          step={1}
                          size="sm"
                          aria-label={`Cantidad a consumir en ${unidadLabel}`}
                        />
                      </div>
                    </div>

                    <div className="px-6 py-4 bg-[#FAF6F0]/60 flex items-center justify-between text-xs font-sans text-[#655D52]">
                      <span>Stock disponible restante tras consumo:</span>
                      <strong className="text-[#181C1B] font-semibold text-sm">
                        {restanteEstimado} {unidadLabel}
                      </strong>
                    </div>
                  </div>

                  {/* Motivo / Observaciones del consumo */}
                  <div>
                    <label
                      htmlFor="desktop-motivo-consumo"
                      className="block text-xs font-sans font-semibold text-[#4A4E4A] mb-1.5"
                    >
                      Motivo / Ensayo experimental (opcional)
                    </label>
                    <input
                      id="desktop-motivo-consumo"
                      type="text"
                      value={motivo}
                      onChange={(e) => setMotivo(e.target.value)}
                      placeholder="Ej. Titulación volumétrica de muestras de agua..."
                      className="h-11 w-full rounded-input border border-[#655D52]/40 bg-white px-3.5 text-sm text-[#181C1B] focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Checkbox institucional */}
                  <div className="pt-1">
                    <Checkbox
                      id="desktop-registrar-otro"
                      checked={registrarOtro}
                      onChange={(e) => setRegistrarOtro(e.target.checked)}
                      label="Registrar otro consumo después de confirmar este."
                      description="Te mantendrá en esta pantalla tras guardar los cambios."
                    />
                  </div>

                  {/* Mensaje de confirmación instantánea */}
                  {isConfirmed && (
                    <div className="p-4 rounded-[12px] bg-[#4A7C59]/15 border border-[#4A7C59] text-[#4A7C59] font-sans text-sm flex items-center gap-3 animate-in fade-in duration-200">
                      <ConfirmCheckIcon className="w-5 h-5 shrink-0" />
                      <span>
                        ¡Consumo de <strong>{cantidad} {unidadLabel}</strong> de{' '}
                        <strong>{selectedReactivo?.name}</strong> registrado en bitácora con éxito!
                      </span>
                    </div>
                  )}
                </div>

                {/* Botón inferior Confirmar (usando exclusivamente el componente oficial Button) */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    variant="default"
                    size="lg"
                    fullWidth
                    disabled={
                      !selectedReactivo ||
                      cantidad <= 0 ||
                      cantidad > stockNumeric ||
                      isSubmitting ||
                      (isSelectedVencido && !confirmarVencido)
                    }
                    rightIcon={<ConfirmCheckIcon className="w-5 h-5" />}
                  >
                    {isSubmitting ? 'Registrando...' : 'Confirmar'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </DesktopCard>
      </div>
    </DesktopLayout>
  )
}

export default DesktopConsumoPage
