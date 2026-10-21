import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { AppHeader, Navbar } from '@/components/layout'
import { FloatingButton } from '@/components/ui/FloatingButton'
import { useAuth } from '@/features/auth/hooks'
import { fetchInventarioLaboratorio, construirAlertasReactivos } from '@/lib/izetService'
import { DashboardAlerts } from '../components/DashboardAlerts'
import {
  DEFAULT_EQUIPO_ALERTS,
} from '../data/mockData'
import type { DashboardAlert, DashboardPageProps } from '../types'

export function DashboardPage({
  onRegistrarConsumoClick,
  reactivoAlerts: propReactivoAlerts,
  equipoAlerts = DEFAULT_EQUIPO_ALERTS,
  className,
}: DashboardPageProps) {
  const navigate = useNavigate()
  const { activeLab, user } = useAuth()
  const [reactivoAlerts, setReactivoAlerts] = React.useState<DashboardAlert[]>(
    propReactivoAlerts ?? [],
  )

  React.useEffect(() => {
    let mounted = true
    async function load() {
      if (propReactivoAlerts) return
      const inv = await fetchInventarioLaboratorio(activeLab)
      if (mounted) {
        setReactivoAlerts(construirAlertasReactivos(inv))
      }
    }
    void load()
    return () => {
      mounted = false
    }
  }, [activeLab, propReactivoAlerts])

  const handleRegistrarConsumo = () => {
    if (onRegistrarConsumoClick) {
      onRegistrarConsumoClick()
    } else {
      navigate('/consumo')
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

      <main className="flex-1 w-full max-w-[412px] mx-auto px-6 pt-4 pb-28 flex flex-col">
        <h1 className="font-serif text-[32px] sm:text-4xl font-bold text-primary tracking-tight mb-6 select-none">
          ¡Hola, {user?.username || 'Usuario'}!
        </h1>

        <DashboardAlerts
          reactivoAlerts={reactivoAlerts}
          equipoAlerts={equipoAlerts}
          className={className}
        />

        <div className="fixed bottom-24 right-4 sm:right-auto sm:left-[calc(50%+40px)] z-30">
          <FloatingButton
            label="Registrar consumo"
            onClick={handleRegistrarConsumo}
            aria-label="Registrar consumo"
          />
        </div>
      </main>

      <Navbar
        activeId="dashboard"
        fixed={true}
        onItemChange={handleNavbarItemChange}
      />
    </div>
  )
}

export default DashboardPage
