import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { AppHeader, Navbar } from '@/components/layout'
import { ReactivoCard } from '@/components/ui/ReactivoCard'
import { InputField } from '@/components/ui/InputField'
import { ObservacionesTextarea, BitacoraFormActions } from '../components'
import type { BitacoraPrestamoFormData, ReactivoSummary } from '../types'

export interface BitacoraPrestamoPageProps {
  reactivo?: ReactivoSummary
  initialData?: Partial<BitacoraPrestamoFormData>
  onSubmit?: (data: BitacoraPrestamoFormData) => void
  onVolver?: () => void
  onSettingsClick?: () => void
}

const DEFAULT_REACTIVO: ReactivoSummary = {
  name: 'Reactivo Name',
  code: 'XY-123',
  stock: '500ml',
}

export function BitacoraPrestamoPage({
  reactivo = DEFAULT_REACTIVO,
  initialData,
  onSubmit,
  onVolver,
  onSettingsClick,
}: BitacoraPrestamoPageProps) {
  const navigate = useNavigate()

  const [formData] = React.useState<BitacoraPrestamoFormData>({
    responsable: initialData?.responsable || '',
    fecha: initialData?.fecha || '',
    cantidad: initialData?.cantidad || '',
    tipo: initialData?.tipo || '',
    estado: initialData?.estado || '',
    observaciones: initialData?.observaciones || '',
  })

  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleVolver = () => {
    if (onVolver) {
      onVolver()
    } else {
      navigate(-1)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    if (onSubmit) {
      onSubmit(formData)
    } else {
      navigate('/bitacora')
    }
    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen w-full bg-[#FAF6F0] flex flex-col items-center">
      {/* Encabezado Superior Oficial */}
      <AppHeader onSettingsClick={onSettingsClick} />

      {/* Contenedor Principal del Formulario */}
      <main className="w-full max-w-[412px] px-6 sm:px-8 flex-1 flex flex-col space-y-6 pt-2 pb-28">
        {/* Título de la Sección */}
        <div className="pt-1">
          <h1 className="font-serif text-[32px] sm:text-4xl font-bold text-primary tracking-tight">
            Bitácora
          </h1>
        </div>

        {/* Tarjeta del Reactivo Seleccionado */}
        <div className="w-full">
          <ReactivoCard
            name={reactivo.name}
            code={reactivo.code}
            stock={reactivo.stock}
            unit={reactivo.unit}
            details={reactivo.details}
            salud={reactivo.salud}
            inflamabilidad={reactivo.inflamabilidad}
            reactividad={reactivo.reactividad}
            especial={reactivo.especial}
            showRombo
            className="w-full max-w-none"
          />
        </div>

        {/* Campos del Formulario de Préstamo */}
        <form onSubmit={handleSubmit} className="w-full space-y-6 flex-1 flex flex-col justify-between">
          <div className="space-y-6 w-full">
            {/* Campo Responsable */}
            <InputField
              label="Responsable"
              placeholder="Responsable"
              aria-label="Responsable del préstamo"
              value={formData.responsable}
              readOnly
              disabled
              className="h-11 bg-white/80 cursor-default opacity-100"
            />

            {/* Campo Fecha */}
            <InputField
              label="Fecha"
              placeholder="Fecha"
              aria-label="Fecha de préstamo"
              value={formData.fecha}
              readOnly
              disabled
              className="h-11 bg-white/80 cursor-default opacity-100"
            />

            {/* Campo Cantidad */}
            <InputField
              label="Cantidad"
              placeholder="Cantidad"
              aria-label="Cantidad prestada"
              value={formData.cantidad}
              readOnly
              disabled
              className="h-11 bg-white/80 cursor-default opacity-100"
            />

            {/* Campo Tipo */}
            <InputField
              label="Tipo"
              placeholder="Tipo"
              aria-label="Tipo de préstamo"
              value={formData.tipo}
              readOnly
              disabled
              className="h-11 bg-white/80 cursor-default opacity-100"
            />

            {/* Campo Estado */}
            <InputField
              label="Estado"
              placeholder="Estado"
              aria-label="Estado del préstamo"
              value={formData.estado}
              readOnly
              disabled
              className="h-11 bg-white/80 cursor-default opacity-100"
            />

            {/* Campo Observaciones */}
            <ObservacionesTextarea
              placeholder="Observaciones"
              aria-label="Observaciones del préstamo"
              value={formData.observaciones}
              readOnly
              disabled
              className="bg-white/80 cursor-default opacity-100"
            />
          </div>

          {/* Botones Volver y Guardar */}
          <BitacoraFormActions
            onVolver={handleVolver}
            isSubmitting={isSubmitting}
            className="mt-6"
          />
        </form>
      </main>

      {/* Barra de Navegación Móvil Fija */}
      <Navbar activeId="bitacora" fixed />
    </div>
  )
}

export default BitacoraPrestamoPage
