import * as React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AppHeader, Navbar } from '@/components/layout'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/features/auth/hooks'
import { registrarConsumoEnSupabase } from '@/lib/izetService'
import { ConsumoForm } from '../components/ConsumoForm'
import type { ConsumoDetallePageProps, ConsumoFormValues, Reactivo } from '../types'

export function ConsumoDetallePage({
  reactivo: propReactivo,
  onBack,
  onConfirm,
  className,
}: ConsumoDetallePageProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { activeLab, user } = useAuth()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const locationState = location.state as { reactivo?: Reactivo } | null
  const currentReactivo: Reactivo | undefined =
    propReactivo || locationState?.reactivo

  if (!currentReactivo) {
    return (
      <div className="min-h-screen w-full bg-[#FAF6F0] flex flex-col justify-between">
        <AppHeader />
        <main className="w-full max-w-[412px] mx-auto px-6 pt-12 flex-1 text-center">
          <p className="font-sans text-sm text-[#655D52] mb-6">
            No se ha seleccionado ningún reactivo para registrar consumo.
          </p>
          <Button variant="default" onClick={() => navigate('/consumo')}>
            Ir al inventario de reactivos
          </Button>
        </main>
        <Navbar activeId="consumo" fixed />
      </div>
    )
  }

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      navigate('/consumo')
    }
  }

  const handleConfirm = async (values: ConsumoFormValues) => {
    setIsSubmitting(true)
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-/i.test(currentReactivo.id)) {
      await registrarConsumoEnSupabase({
        reactivoId: currentReactivo.id,
        lab: activeLab,
        cantidad: values.cantidad,
        motivo: values.motivo || 'Consumo registrado desde vista móvil',
        responsable: user?.username || 'Personal de Laboratorio',
      })
    }
    setIsSubmitting(false)

    if (onConfirm) {
      onConfirm(values, currentReactivo)
    }

    if (values.registrarOtro || user?.rol !== 'admin') {
      navigate('/consumo')
    } else {
      navigate('/dashboard')
    }
  }

  const handleNavbarItemChange = (id: string) => {
    if (id === 'dashboard') {
      navigate('/dashboard')
    } else {
      navigate(`/${id}`)
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#FAF6F0] flex flex-col justify-between selection:bg-primary-light">
      <AppHeader />

      <main className="flex-1 w-full max-w-[412px] mx-auto px-6 pt-4 pb-28 flex flex-col space-y-6">
        <header className="w-full max-w-[348px] mx-auto pt-2">
          <h1 className="font-serif text-[32px] sm:text-4xl font-bold text-primary leading-[1.15] tracking-tight">
            ¿Cuánto
            <br />
            consumiste?
          </h1>
        </header>

        <div className={className}>
          <ConsumoForm
            reactivo={currentReactivo}
            onBack={handleBack}
            onConfirm={handleConfirm}
            disabled={isSubmitting}
          />
        </div>
      </main>

      <Navbar
        activeId={user?.rol === 'admin' ? 'dashboard' : 'consumo'}
        fixed={true}
        onItemChange={handleNavbarItemChange}
      />
    </div>
  )
}

export default ConsumoDetallePage
