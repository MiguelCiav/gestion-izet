import * as React from 'react'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { ReactivoCard } from '@/components/ui/ReactivoCard'
import { Stepper } from '@/components/ui/Stepper'
import { evaluarCaducidad } from '@/lib/izetService'
import { cn } from '@/lib/utils'
import type { ConsumoFormValues, Reactivo } from '../types'

export interface ConsumoFormProps {
  reactivo: Reactivo
  initialCantidad?: number
  onBack?: () => void
  onConfirm?: (values: ConsumoFormValues) => void
  disabled?: boolean
  className?: string
}

export function ConsumoForm({
  reactivo,
  initialCantidad = 1,
  onBack,
  onConfirm,
  disabled = false,
  className,
}: ConsumoFormProps) {
  const [cantidad, setCantidad] = React.useState<number>(initialCantidad)
  const [registrarOtro, setRegistrarOtro] = React.useState<boolean>(false)
  const [confirmarVencido, setConfirmarVencido] = React.useState<boolean>(false)

  const maxStock = React.useMemo(() => {
    if (typeof reactivo.stockNumeric === 'number') return reactivo.stockNumeric
    if (typeof reactivo.stock === 'number') return reactivo.stock
    const parsed = parseFloat(String(reactivo.stock))
    return Number.isNaN(parsed) ? 5000 : parsed
  }, [reactivo])

  const caducidad = React.useMemo(() => {
    if (reactivo.caducidadEstado) {
      return {
        estado: reactivo.caducidadEstado,
        label: reactivo.caducidadLabel || 'Vencido',
      }
    }
    return evaluarCaducidad(reactivo.rawExpirationDate || reactivo.expirationDate)
  }, [reactivo])

  const isVencido = caducidad.estado === 'vencido'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (cantidad <= 0 || cantidad > maxStock) return
    if (isVencido && !confirmarVencido) return
    onConfirm?.({ cantidad, registrarOtro, confirmarVencido })
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={cn('flex flex-col w-full max-w-[348px] mx-auto space-y-6', className)}
    >
      {/* 1. Tarjeta informativa del reactivo seleccionado */}
      <div className="w-full">
        <ReactivoCard
          name={reactivo.name}
          code={reactivo.code}
          stock={reactivo.stock}
          unit={reactivo.unit}
          details={reactivo.details}
          location={reactivo.location}
          expirationDate={reactivo.expirationDate}
          rombo={reactivo.rombo}
          salud={reactivo.salud}
          inflamabilidad={reactivo.inflamabilidad}
          reactividad={reactivo.reactividad}
          especial={reactivo.especial}
          className="cursor-default pointer-events-none"
        />
      </div>

      {/* Advertencia de Uso Crítico y Confirmación Explícita si el reactivo está vencido (HU08.3) */}
      {isVencido && (
        <div className="space-y-3">
          <Alert
            variant="danger"
            title="Advertencia Crítica: Reactivo Vencido"
            description={`Este lote se encuentra vencido (${caducidad.label}). Su uso puede comprometer resultados analíticos.`}
          />
          <Checkbox
            id="confirmar-reactivo-vencido-mobile"
            checked={confirmarVencido}
            onChange={(e) => setConfirmarVencido(e.target.checked)}
            disabled={disabled}
            label="Confirmo explícitamente el uso bajo responsabilidad técnica de este reactivo vencido."
            className="text-[#B83230] font-semibold text-xs"
          />
        </div>
      )}

      {/* 2. Stepper selector de cantidad consumida */}
      <div className="flex flex-col items-center justify-center py-2">
        <Stepper
          value={cantidad}
          onChange={setCantidad}
          min={0.01}
          max={maxStock}
          step={1}
          size="lg"
          disabled={disabled}
          ariaLabel="Cantidad de reactivo consumido"
        />
        <span className="text-xs text-[#655D52] mt-2">
          Máx. disponible: <strong>{maxStock} {reactivo.unit || 'ml'}</strong> (acepta decimales)
        </span>
      </div>

      {/* 3. Botones de acción en fila */}
      <div className="flex items-center gap-4 w-full">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={onBack}
          disabled={disabled}
          className="flex-1"
        >
          Volver
        </Button>

        <Button
          type="submit"
          variant="default"
          size="lg"
          disabled={
            disabled ||
            cantidad <= 0 ||
            cantidad > maxStock ||
            (isVencido && !confirmarVencido)
          }
          className="flex-1"
        >
          Confirmar
        </Button>
      </div>

      {/* 4. Checkbox: "Registrar otro consumo después de confirmar este." */}
      <div className="pt-1 flex items-start">
        <Checkbox
          id="registrar-otro-consumo"
          checked={registrarOtro}
          onChange={(e) => setRegistrarOtro(e.target.checked)}
          disabled={disabled}
          label="Registrar otro consumo después de confirmar este."
          className="text-text-main text-sm select-none"
        />
      </div>
    </form>
  )
}

export default ConsumoForm
