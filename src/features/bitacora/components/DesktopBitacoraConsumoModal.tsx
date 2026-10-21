import * as React from 'react'
import { InputField } from '@/components/ui/InputField'
import { ObservacionesTextarea } from './ObservacionesTextarea'
import { DesktopBitacoraDrawer } from './DesktopBitacoraDrawer'
import type { BitacoraConsumoFormData, ReactivoSummary } from '../types'

export interface DesktopBitacoraConsumoModalProps {
  isOpen: boolean
  onClose: () => void
  reactivo?: ReactivoSummary
  initialData?: Partial<BitacoraConsumoFormData>
  onSubmit?: (data: BitacoraConsumoFormData) => void
  isSubmitting?: boolean
}

const DEFAULT_REACTIVO: ReactivoSummary = {
  name: 'Ácido Benzóico',
  code: 'XY-223',
  stock: '500 ml',
  salud: 2,
  inflamabilidad: 1,
  reactividad: 0,
  especial: '',
}

export const DesktopBitacoraConsumoModal: React.FC<DesktopBitacoraConsumoModalProps> = ({
  isOpen,
  onClose,
  reactivo = DEFAULT_REACTIVO,
  initialData,
  onSubmit,
  isSubmitting = false,
}) => {
  const [formData] = React.useState<BitacoraConsumoFormData>({
    responsable: initialData?.responsable ?? '',
    fecha: initialData?.fecha ?? '',
    cantidad: initialData?.cantidad ?? '',
    observaciones: initialData?.observaciones ?? '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(formData)
  }

  return (
    <DesktopBitacoraDrawer
      isOpen={isOpen}
      onClose={onClose}
      reactivo={reactivo}
      actions={
        <div className="flex items-center gap-4 w-full">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-full h-[58px] rounded-[24px] border-2 border-[#4A4E4A] bg-transparent text-[#181C1B] font-semibold text-base transition-colors hover:bg-[#655D52]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 cursor-pointer"
          >
            Volver
          </button>
        </div>
      }
    >
      <form
        id="form-desktop-consumo"
        onSubmit={handleSubmit}
        className="w-full flex flex-col space-y-4"
      >
        {/* Campo Responsable (Solo lectura) */}
        <div>
          <InputField
            label="Responsable"
            placeholder="Responsable"
            value={formData.responsable}
            readOnly
            disabled
            className="h-[43px] rounded-[7.5px] border-[#4A4E4A] bg-white/80 text-[#181C1B] cursor-default opacity-100"
          />
        </div>

        {/* Campo Fecha (Solo lectura) */}
        <div>
          <InputField
            label="Fecha y hora"
            placeholder="Fecha"
            value={formData.fecha}
            readOnly
            disabled
            className="h-[43px] rounded-[7.5px] border-[#4A4E4A] bg-white/80 text-[#181C1B] cursor-default opacity-100"
          />
        </div>

        {/* Campo Cantidad (Solo lectura) */}
        <div>
          <InputField
            label="Cantidad"
            placeholder="Cantidad"
            value={formData.cantidad}
            readOnly
            disabled
            className="h-[43px] rounded-[7.5px] border-[#4A4E4A] bg-white/80 text-[#181C1B] cursor-default opacity-100"
          />
        </div>

        {/* Campo Observaciones (Solo lectura) */}
        <div>
          <label className="block text-sm font-medium text-text-main mb-1.5">
            Observaciones
          </label>
          <ObservacionesTextarea
            placeholder="Observaciones"
            value={formData.observaciones}
            readOnly
            disabled
            className="min-h-[135px] rounded-[7.5px] border-[#4A4E4A] bg-white/80 text-[#181C1B] cursor-default opacity-100"
          />
        </div>
      </form>
    </DesktopBitacoraDrawer>
  )
}
