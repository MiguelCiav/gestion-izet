import * as React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { DesktopLayout, DesktopCard } from '@/components/desktop'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { ReactivoCard } from '@/components/ui/ReactivoCard'
import { Stepper, StepIndicator, type StepItem } from '@/components/ui/Stepper'
import { useAuth } from '@/features/auth/hooks'
import { registrarConsumoEnSupabase } from '@/lib/izetService'
import type {
  ConsumoFormValues,
  DesktopConsumoDetallePageProps,
  Reactivo,
} from '../types'

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

const PASOS_DETALLE: StepItem[] = [
  { id: 1, title: 'Escoger reactivo' },
  { id: 2, title: 'Indicar cantidad' },
  { id: 3, title: 'Confirmar consumo' },
]

/**
 * DesktopConsumoDetallePage - Vista de escritorio para el detalle de cantidad de consumo.
 *
 * Estructurada con `DesktopLayout` (`activeNavId="dashboard"`) y `DesktopCard`:
 * - Indicador de pasos `StepIndicator`.
 * - Tarjeta del reactivo seleccionado con Rombo NFPA 704.
 * - Ingreso de cantidad con `Stepper`.
 * - Acciones de navegación "Volver" y "Confirmar" con icono de check.
 * - Opción de registrar otro consumo.
 * - Tipado estricto sin `any`.
 */
export function DesktopConsumoDetallePage({
  reactivo: propReactivo,
  onBack,
  onConfirm,
  className,
}: DesktopConsumoDetallePageProps): React.JSX.Element {
  const navigate = useNavigate()
  const location = useLocation()
  const { activeLab, user } = useAuth()

  const locationState = location.state as { reactivo?: Reactivo } | null
  const currentReactivo: Reactivo | undefined =
    propReactivo || locationState?.reactivo

  const [cantidad, setCantidad] = React.useState<number>(10)
  const [registrarOtro, setRegistrarOtro] = React.useState<boolean>(false)
  const [isConfirmed, setIsConfirmed] = React.useState<boolean>(false)

  const handleNavChange = (id: string): void => {
    if (id === 'dashboard') {
      navigate('/dashboard')
    } else {
      navigate(`/${id}`)
    }
  }

  if (!currentReactivo) {
    return (
      <DesktopLayout activeNavId="consumo" onNavChange={handleNavChange}>
        <div className="w-full max-w-[800px] mx-auto py-16 text-center space-y-4">
          <p className="font-sans text-base text-[#655D52]">
            No se ha seleccionado ningún reactivo para registrar consumo.
          </p>
          <Button variant="default" onClick={() => navigate('/consumo')}>
            Volver a la selección de reactivo
          </Button>
        </div>
      </DesktopLayout>
    )
  }

  const handleBack = (): void => {
    if (onBack) {
      onBack()
    } else {
      navigate('/consumo')
    }
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    const values: ConsumoFormValues = {
      cantidad,
      registrarOtro,
    }

    if (/^[0-9a-f]{8}-[0-9a-f]{4}-/i.test(currentReactivo.id)) {
      await registrarConsumoEnSupabase({
        reactivoId: currentReactivo.id,
        lab: activeLab,
        cantidad,
        motivo: 'Consumo registrado desde detalle de escritorio',
        responsable: user?.username || 'Personal de Laboratorio',
      })
    }

    onConfirm?.(values, currentReactivo)
    setIsConfirmed(true)

    if (registrarOtro) {
      setTimeout(() => {
        navigate('/consumo')
      }, 700)
    } else {
      setTimeout(() => {
        navigate('/dashboard')
      }, 700)
    }
  }

  return (
    <DesktopLayout
      activeNavId="dashboard"
      onNavChange={handleNavChange}
      contentClassName={className}
    >
      <div className="max-w-[760px] mx-auto flex flex-col space-y-6">
        {/* Cabecera principal de la sección */}
        <div className="select-none">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 text-sm font-sans font-medium text-[#655D52] hover:text-primary transition-colors mb-1 cursor-pointer"
          >
            <BackArrowIcon className="w-4 h-4" />
            <span>Volver a reactivos</span>
          </button>
          <h1 className="font-serif text-[32px] sm:text-4xl font-bold text-primary tracking-tight">
            Indicar cantidad
          </h1>
        </div>

        {/* Indicador de pasos */}
        <div className="bg-[#FAF6F0] border-2 border-[#655D52]/40 rounded-[16px] p-5 shadow-[4px_4px_6px_0px_rgba(0,0,0,0.06)]">
          <StepIndicator
            steps={PASOS_DETALLE}
            currentStep={isConfirmed ? 3 : 2}
            className="max-w-xl mx-auto"
          />
        </div>

        {/* Tarjeta de detalle de consumo */}
        <DesktopCard
          variant="default"
          padding="default"
          maxWidth="full"
          className="flex flex-col space-y-6"
        >
          <div className="border-b border-[#655D52]/30 pb-4">
            <h2 className="font-serif font-bold text-3xl text-primary">
              ¿Cuánto consumiste?
            </h2>
            <p className="font-sans text-sm text-[#655D52] mt-1">
              Ajusta la cantidad exacta tomada del inventario del laboratorio.
            </p>
          </div>

          {/* Tarjeta del reactivo seleccionado */}
          <div className="bg-white border-2 border-[#4A7C59] rounded-[14px] p-4 shadow-sm">
            <ReactivoCard
              name={currentReactivo.name}
              code={currentReactivo.code}
              stock={currentReactivo.stock}
              salud={currentReactivo.salud}
              inflamabilidad={currentReactivo.inflamabilidad}
              reactividad={currentReactivo.reactividad}
              especial={currentReactivo.especial}
              selected={true}
              accentColor="#4A7C59"
              romboSize={52}
              className="bg-transparent border-0"
            />
          </div>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col space-y-6">
            {/* Control de cantidad Stepper */}
            <div className="flex flex-col items-center justify-center py-6 bg-white border border-[#4A4E4A]/30 rounded-[16px]">
              <span className="font-sans text-xs uppercase tracking-wider font-semibold text-[#655D52] mb-3">
                Volumen / Cantidad a descontar ({currentReactivo.unit || 'ml'})
              </span>
              <Stepper
                value={cantidad}
                onChange={setCantidad}
                min={0.01}
                max={5000}
                step={1}
                size="lg"
                aria-label="Cantidad consumida"
              />
              <span className="font-sans text-xs text-[#655D52] mt-3">
                Stock actual: <strong>{currentReactivo.stock}</strong> &bull;
                Restante estimado: <strong>Aprox. 490 ml</strong>
              </span>
            </div>

            {/* Checkbox */}
            <Checkbox
              id="detalle-registrar-otro"
              checked={registrarOtro}
              onChange={(e) => setRegistrarOtro(e.target.checked)}
              label="Registrar otro consumo después de confirmar este."
              description="Te llevará de vuelta a la selección de reactivo al completar el registro."
            />

            {/* Confirmación instantánea */}
            {isConfirmed && (
              <div className="p-4 rounded-[12px] bg-[#4A7C59]/15 border border-[#4A7C59] text-[#4A7C59] font-sans text-sm flex items-center gap-3">
                <ConfirmCheckIcon className="w-5 h-5 shrink-0" />
                <span>¡Consumo confirmado exitosamente! Redirigiendo...</span>
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex items-center gap-4 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                className="w-1/2 h-[56px] rounded-[15px] border-2 border-[#655D52] text-[#655D52] hover:bg-[#655D52]/10 font-bold"
              >
                Volver
              </Button>
              <Button
                type="submit"
                variant="default"
                disabled={cantidad <= 0}
                className="w-1/2 h-[56px] rounded-[15px] bg-[#4A7C59] hover:bg-[#4A7C59]/90 text-white font-bold flex items-center justify-center gap-2"
              >
                <span>Confirmar</span>
                <ConfirmCheckIcon className="w-5 h-5" />
              </Button>
            </div>
          </form>
        </DesktopCard>
      </div>
    </DesktopLayout>
  )
}

export default DesktopConsumoDetallePage
