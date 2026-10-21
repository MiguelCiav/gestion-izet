import * as React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AppHeader, Navbar } from '@/components/layout'
import { useAuth } from '@/features/auth/hooks'
import { guardarReactivoEnSupabase, darBajaLogicaReactivo } from '@/lib/izetService'
import { ReactivoForm } from '../components'
import type { ReactivoFormData, ReactivoItem } from '../types'

interface LocationState {
  reactivo?: ReactivoItem
}

export function InventarioReactivoDetallePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { activeLab, user } = useAuth()
  const state = location.state as LocationState | undefined
  const item = state?.reactivo

  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null)

  const initialFormData: Partial<ReactivoFormData> = item
    ? {
        nombre: item.nombre,
        codigo: item.codigo,
        formulaQuimica: item.formulaQuimica || 'N/A',
        clasificacionRiesgo: item.clasificacionRiesgo || 'Sustancia de Laboratorio',
        umbral: item.umbral !== undefined ? String(item.umbral) : '50',
        stockDisponible: String(item.stock),
        unidadMedida: item.unidad || 'ml',
        fechaVencimiento: item.fechaVencimiento || '',
        ubicacion: item.ubicacion || 'Estante 1',
        usoCompartido: Boolean(item.usoCompartido),
        esRegulado: Boolean(item.esRegulado),
        entidadesRegulatorias: item.entidadesRegulatorias ?? [],
        ultimoPrecio: item.ultimoPrecio !== undefined ? String(item.ultimoPrecio) : '',
        monedaPrecio: item.monedaPrecio || 'USD',
        rombo: item.rombo,
      }
    : {
        nombre: '',
        codigo: '',
        formulaQuimica: '',
        clasificacionRiesgo: 'Sustancia de Laboratorio',
        umbral: '50',
        stockDisponible: '500',
        unidadMedida: 'ml',
        fechaVencimiento: '',
        ubicacion: 'Estante 1',
        usoCompartido: false,
        esRegulado: false,
        entidadesRegulatorias: [],
        ultimoPrecio: '',
        monedaPrecio: 'USD',
        rombo: {
          health: 2,
          flammability: 0,
          reactivity: 1,
          special: '',
        },
      }

  const handleBack = () => {
    navigate('/inventario/reactivos')
  }

  const handleSubmit = async (data: ReactivoFormData) => {
    setIsSubmitting(true)
    setErrorMsg(null)
    const res = await guardarReactivoEnSupabase(activeLab, data, {
      reactivoId: item?.reactivoId,
      responsable: user?.username || 'Personal de Laboratorio',
    })
    setIsSubmitting(false)

    if (!res.success) {
      setErrorMsg(res.error || 'Error al guardar el reactivo')
      return
    }
    navigate('/inventario/reactivos')
  }

  const handleDeactivate = async () => {
    if (!item?.reactivoId) return
    setIsSubmitting(true)
    await darBajaLogicaReactivo(
      item.reactivoId,
      activeLab,
      `Baja lógica de ${item.nombre}`,
      user?.username || 'Administrador',
    )
    setIsSubmitting(false)
    navigate('/inventario/reactivos')
  }

  const handleNavbarChange = (_id: string, navItem: { href?: string }) => {
    if (navItem.href) {
      navigate(navItem.href)
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#FAF6F0] flex flex-col pb-28">
      <AppHeader />

      <main className="w-full max-w-[412px] mx-auto px-6 pt-4 flex-1 flex flex-col">
        <h1 className="font-serif text-[32px] sm:text-4xl font-bold text-primary tracking-tight mb-2 select-none">
          Inventario ({activeLab})
        </h1>

        {errorMsg && (
          <div className="mb-3 p-3 rounded-xl bg-alert-danger-bg text-alert-danger-border border border-alert-danger-border text-xs font-medium">
            {errorMsg}
          </div>
        )}

        <div className="w-full pb-6">
          <ReactivoForm
            initialData={initialFormData}
            reactivoId={item?.reactivoId}
            onCancel={handleBack}
            onSubmit={handleSubmit}
            onDeactivate={item?.reactivoId ? handleDeactivate : undefined}
            isSubmitting={isSubmitting}
          />
        </div>
      </main>

      <Navbar
        activeId="inventario"
        fixed
        onItemChange={handleNavbarChange}
      />
    </div>
  )
}

export default InventarioReactivoDetallePage
