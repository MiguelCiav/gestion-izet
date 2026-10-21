import * as React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AppHeader, Navbar } from '@/components/layout'
import { useAuth } from '@/features/auth/hooks'
import { registrarConsumoEnSupabase } from '@/lib/izetService'
import { ConsumoForm } from '../components/ConsumoForm'
import { DEFAULT_REACTIVOS } from '../data/mockData'
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
  const currentReactivo: Reactivo =
    propReactivo || locationState?.reactivo || DEFAULT_REACTIVOS[0]

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
