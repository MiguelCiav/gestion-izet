import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  DesktopLayout,
  DesktopActionToolbar,
  DesktopFilterButton,
  DesktopNewButton,
  DesktopCard,
  DesktopTable,
  type DesktopTableColumn,
} from '@/components/desktop'
import { Alert } from '@/components/ui/Alert'
import { useAuth } from '@/features/auth/hooks'
import {
  fetchInventarioLaboratorio,
  fetchBitacoraMovimientos,
  construirAlertasReactivos,
  tieneAlertaStockMinimo,
  LABORATORIOS_INFO,
} from '@/lib/izetService'
import {
  DEFAULT_REACTIVO_ALERTS,
  DEFAULT_RECENT_CONSUMOS,
} from '../data/mockData'
import type {
  ConsumoReciente,
  DashboardAlert,
  DesktopDashboardPageProps,
} from '../types'

export function DesktopDashboardPage({
  onRegistrarConsumoClick,
  onFilterClick,
  onExportClick: _onExportClick,
  reactivoAlerts: propReactivoAlerts,
  className,
}: DesktopDashboardPageProps): React.JSX.Element {
  const navigate = useNavigate()
  const { activeLab, user } = useAuth()
  const [filterActive, setFilterActive] = React.useState<boolean>(false)
  const [selectedCategory, setSelectedCategory] = React.useState<'todos' | 'warning' | 'danger'>('todos')

  const [reactivoAlerts, setReactivoAlerts] = React.useState<DashboardAlert[]>(
    propReactivoAlerts ?? DEFAULT_REACTIVO_ALERTS,
  )
  const [recentConsumos, setRecentConsumos] = React.useState<ConsumoReciente[]>(
    DEFAULT_RECENT_CONSUMOS,
  )
  const [totalReactivosCount, setTotalReactivosCount] = React.useState<number>(0)
  const [escasezCount, setEscasezCount] = React.useState<number>(0)

  React.useEffect(() => {
    let mounted = true
    async function loadDashboardData() {
      const [inv, bitacora] = await Promise.all([
        fetchInventarioLaboratorio(activeLab),
        fetchBitacoraMovimientos(activeLab),
      ])

      if (!mounted) return

      if (inv.length > 0 && !propReactivoAlerts) {
        const dynamicAlerts = construirAlertasReactivos(inv)
        setReactivoAlerts(dynamicAlerts)
        setTotalReactivosCount(inv.length)
        setEscasezCount(
          inv.filter((i) =>
            tieneAlertaStockMinimo(Number(i.stock) || 0, Number(i.umbral) || 0),
          ).length,
        )
      }

      if (bitacora.consumosRecientes.length > 0) {
        setRecentConsumos(bitacora.consumosRecientes)
      }
    }

    void loadDashboardData()
    return () => {
      mounted = false
    }
  }, [activeLab, propReactivoAlerts])

  const handleNavChange = (id: string): void => {
    if (id === 'dashboard') {
      navigate('/dashboard')
    } else {
      navigate(`/${id}`)
    }
  }

  const handleRegistrarConsumo = (): void => {
    if (onRegistrarConsumoClick) {
      onRegistrarConsumoClick()
    } else {
      navigate('/consumo')
    }
  }

  const handleVerTodosLosConsumos = (): void => {
    navigate('/bitacora?tipo=consumo', { state: { initialCategory: 'consumo', tipo: 'consumo' } })
  }

  const handleFilterToggle = (): void => {
    setFilterActive((prev) => !prev)
    onFilterClick?.()
  }

  const filteredReactivoAlerts = React.useMemo<DashboardAlert[]>(() => {
    if (selectedCategory === 'todos') return reactivoAlerts
    return reactivoAlerts.filter((a) => a.variant === selectedCategory)
  }, [reactivoAlerts, selectedCategory])

  const consumoColumns: DesktopTableColumn<ConsumoReciente>[] = [
    {
      key: 'reactivoName',
      header: 'Reactivo',
      width: '28%',
      render: (row) => (
        <div className="flex flex-col py-1">
          <span className="font-serif font-bold text-[#181C1B] text-base leading-tight">
            {row.reactivoName}
          </span>
          <span className="font-sans text-xs text-[#655D52]">
            Código: {row.code}
          </span>
        </div>
      ),
    },
    {
      key: 'cantidad',
      header: 'Cantidad consumida',
      width: '20%',
      render: (row) => (
        <span className="font-sans font-semibold text-[#181C1B]">
          {row.cantidad}
        </span>
      ),
    },
    {
      key: 'usuario',
      header: 'Responsable',
      width: '22%',
      render: (row) => (
        <span className="font-sans text-sm text-[#181C1B]">
          {row.usuario}
        </span>
      ),
    },
    {
      key: 'fecha',
      header: 'Fecha y hora',
      width: '18%',
      render: (row) => (
        <span className="font-sans text-xs text-[#655D52]">
          {row.fecha}
        </span>
      ),
    },
    {
      key: 'estado',
      header: 'Estado',
      width: '12%',
      align: 'center',
      render: (row) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-sans bg-[#4A7C59]/15 text-[#4A7C59]">
          {row.estado === 'confirmado' ? 'Registrado' : 'Pendiente'}
        </span>
      ),
    },
  ]

  return (
    <DesktopLayout
      activeNavId="dashboard"
      onNavChange={handleNavChange}
      contentClassName={className}
    >
      <div className="w-full max-w-[1240px] mx-auto flex flex-col space-y-6">
        {/* Cabecera principal del módulo */}
        <div className="flex items-center justify-between flex-wrap gap-4 select-none">
          <h1 className="font-serif text-[32px] sm:text-4xl font-bold text-primary tracking-tight">
            ¡Hola, {user?.username || 'Usuario'}!
          </h1>
        </div>

        {/* 1. Barra de herramientas superior */}
        <DesktopActionToolbar align="between" className="w-full">
          <div className="flex items-center gap-3">
            <DesktopFilterButton
              onClick={handleFilterToggle}
              className={filterActive ? 'bg-[#4A7C59]/15 border-[#4A7C59]' : ''}
              aria-expanded={filterActive}
              aria-controls="filter-panel"
            />
            {filterActive && (
              <div
                id="filter-panel"
                className="flex items-center gap-2 bg-[#FAF6F0] border border-[#655D52]/40 rounded-[15px] px-3 py-1.5 animate-in fade-in duration-150"
              >
                <span className="text-xs font-sans text-[#655D52] font-medium">
                  Mostrar:
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('todos')}
                  className={`text-xs px-2.5 py-1 rounded-[10px] transition-colors ${
                    selectedCategory === 'todos'
                      ? 'bg-[#4A7C59] text-white font-semibold'
                      : 'text-[#181C1B] hover:bg-[#655D52]/10'
                  }`}
                >
                  Todas
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('warning')}
                  className={`text-xs px-2.5 py-1 rounded-[10px] transition-colors ${
                    selectedCategory === 'warning'
                      ? 'bg-[#6A572B] text-white font-semibold'
                      : 'text-[#6A572B] hover:bg-[#FBDFA8]/40'
                  }`}
                >
                  Atención
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('danger')}
                  className={`text-xs px-2.5 py-1 rounded-[10px] transition-colors ${
                    selectedCategory === 'danger'
                      ? 'bg-[#B83230] text-white font-semibold'
                      : 'text-[#B83230] hover:bg-[#FFDAD6]/40'
                  }`}
                >
                  Críticas
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <DesktopNewButton
              label="Registrar consumo"
              onClick={handleRegistrarConsumo}
              className="bg-[#4A7C59] text-white hover:bg-[#4A7C59]/90 border-[#4A7C59] shadow-sm font-medium"
            />
          </div>
        </DesktopActionToolbar>

        {/* 2. Panel principal de Alertas del Dashboard (HU07 y HU08) */}
        <DesktopCard
          variant="default"
          padding="none"
          maxWidth="full"
          className="overflow-hidden"
        >
          {/* Alertas de reactivos */}
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="font-serif font-bold text-xl md:text-2xl text-[#181C1B] shrink-0">
                Alertas de reactivos ({activeLab})
              </h2>
              <div className="flex-1 h-[2px] bg-[#181C1B]/80 rounded-full" />
            </div>

            <div className="flex flex-col space-y-4">
              {filteredReactivoAlerts.length > 0 ? (
                filteredReactivoAlerts.map((alert) => (
                  <Alert
                    key={alert.id}
                    variant={alert.variant}
                    title={alert.title}
                    description={alert.description}
                    iconPosition="right"
                    className="border border-[#655D52]/30 shadow-none rounded-[12px]"
                  />
                ))
              ) : (
                <div className="py-6 text-center text-sm font-sans text-[#655D52]">
                  No hay alertas de escasez ni vencimiento con los filtros seleccionados.
                </div>
              )}
            </div>
          </div>
        </DesktopCard>

        {/* 3. Métricas de existencias y resumen del laboratorio */}
        <section
          aria-label="Resumen de existencias del laboratorio"
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full"
        >
          <div className="bg-[#FAF6F0] border-2 border-[#655D52]/40 rounded-[16px] p-5 shadow-[4px_4px_6px_0px_rgba(0,0,0,0.06)] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs font-semibold uppercase tracking-wider text-[#655D52]">
                Existencias ({activeLab})
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#4A7C59]" aria-hidden="true" />
            </div>
            <div className="mt-3">
              <span className="font-serif font-bold text-3xl text-[#181C1B]">
                {totalReactivosCount || 6}
              </span>
              <p className="font-sans text-xs text-[#655D52] mt-0.5">
                Reactivos activos en inventario local
              </p>
            </div>
          </div>

          <div className="bg-[#FAF6F0] border-2 border-[#655D52]/40 rounded-[16px] p-5 shadow-[4px_4px_6px_0px_rgba(0,0,0,0.06)] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs font-semibold uppercase tracking-wider text-[#655D52]">
                Escasez (0 &lt; Stock &le; Umbral)
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#6A572B]" aria-hidden="true" />
            </div>
            <div className="mt-3">
              <span className="font-serif font-bold text-3xl text-[#6A572B]">
                {escasezCount || reactivoAlerts.length}
              </span>
              <p className="font-sans text-xs text-[#655D52] mt-0.5">
                Reactivos requieren reposición
              </p>
            </div>
          </div>

          <div className="bg-[#FAF6F0] border-2 border-[#655D52]/40 rounded-[16px] p-5 shadow-[4px_4px_6px_0px_rgba(0,0,0,0.06)] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs font-semibold uppercase tracking-wider text-[#655D52]">
                Consumos recientes
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#4A7C59]" aria-hidden="true" />
            </div>
            <div className="mt-3">
              <span className="font-serif font-bold text-3xl text-[#181C1B]">
                {recentConsumos.length}
              </span>
              <p className="font-sans text-xs text-[#655D52] mt-0.5">
                Tomas registradas en bitácora
              </p>
            </div>
          </div>
        </section>

        {/* 4. Tabla de actividad reciente de consumos */}
        <section aria-labelledby="recent-activity-heading">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3
                id="recent-activity-heading"
                className="font-serif font-bold text-xl text-[#181C1B]"
              >
                Actividad reciente de consumos
              </h3>
              <p className="font-sans text-xs text-[#655D52]">
                Historial de tomas registradas en {LABORATORIOS_INFO[activeLab].nombre}
              </p>
            </div>
            <button
              type="button"
              onClick={handleVerTodosLosConsumos}
              className="text-xs font-sans font-semibold text-[#4A7C59] hover:underline cursor-pointer"
            >
              Ver todos los consumos &rarr;
            </button>
          </div>

          <DesktopTable<ConsumoReciente>
            columns={consumoColumns}
            data={recentConsumos}
            keyExtractor={(row) => row.id}
            emptyMessage="No se han registrado consumos recientes."
          />
        </section>
      </div>
    </DesktopLayout>
  )
}

export default DesktopDashboardPage
