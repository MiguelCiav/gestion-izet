import type { RomboValues } from '@/components/ui/RomboBadge'
import type { CaducidadEstado } from '@/features/inventario/types'

/**
 * Representa la información de un reactivo de laboratorio para consumo (HU05 y HU08)
 */
export interface Reactivo {
  id: string
  stockId?: string
  name: string
  code: string
  stock: string | number
  stockNumeric?: number
  unit?: string
  location?: string
  expirationDate?: string
  rawExpirationDate?: string
  caducidadEstado?: CaducidadEstado
  caducidadLabel?: string
  rombo?: RomboValues
  salud?: number | string
  inflamabilidad?: number | string
  reactividad?: number | string
  especial?: string
  details?: string
}

/**
 * Notificación o advertencia del Dashboard para reactivos o equipos (HU07 y HU08)
 */
export interface DashboardAlert {
  id: string
  category: 'reactivo' | 'equipo'
  variant: 'warning' | 'danger'
  title: string
  description?: string
}

/**
 * Registro de consumo confirmado de un reactivo
 */
export interface ConsumoRegistro {
  id: string
  reactivoId: string
  reactivoName: string
  code: string
  cantidad: number
  unit: string
  timestamp: string
  userId?: string
}

/**
 * Valores del formulario de registro de consumo
 */
export interface ConsumoFormValues {
  cantidad: number
  registrarOtro: boolean
  motivo?: string
  confirmarVencido?: boolean
}

/**
 * Props para la página Dashboard
 */
export interface DashboardPageProps {
  onRegistrarConsumoClick?: () => void
  reactivoAlerts?: DashboardAlert[]
  equipoAlerts?: DashboardAlert[]
  className?: string
}

/**
 * Props para la página Consumo
 */
export interface ConsumoPageProps {
  reactivos?: Reactivo[]
  onSelectReactivo?: (reactivo: Reactivo) => void
  onFilterClick?: () => void
  className?: string
}

/**
 * Props para la página Consumo Detalle
 */
export interface ConsumoDetallePageProps {
  reactivo?: Reactivo
  onBack?: () => void
  onConfirm?: (values: ConsumoFormValues, reactivo: Reactivo) => void
  className?: string
}

/**
 * Registro de consumo reciente para visualización en tablas de escritorio
 */
export interface ConsumoReciente {
  id: string
  reactivoId: string
  reactivoName: string
  code: string
  cantidad: string
  usuario: string
  fecha: string
  estado?: 'confirmado' | 'pendiente'
}

/**
 * Props para la página DesktopDashboardPage
 */
export interface DesktopDashboardPageProps {
  onRegistrarConsumoClick?: () => void
  onFilterClick?: () => void
  onExportClick?: () => void
  reactivoAlerts?: DashboardAlert[]
  equipoAlerts?: DashboardAlert[]
  className?: string
}

/**
 * Props para la página DesktopConsumoPage
 */
export interface DesktopConsumoPageProps {
  reactivos?: Reactivo[]
  initialReactivoId?: string
  onSelectReactivo?: (reactivo: Reactivo) => void
  onBack?: () => void
  onConfirm?: (values: ConsumoFormValues, reactivo: Reactivo) => void
  onFilterClick?: () => void
  className?: string
}

/**
 * Props para la página DesktopConsumoDetallePage
 */
export interface DesktopConsumoDetallePageProps {
  reactivo?: Reactivo
  onBack?: () => void
  onConfirm?: (values: ConsumoFormValues, reactivo: Reactivo) => void
  className?: string
}
