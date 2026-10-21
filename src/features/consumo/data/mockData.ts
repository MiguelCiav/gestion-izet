import type { ConsumoReciente, DashboardAlert, Reactivo } from '../types'

/**
 * Lista por defecto de reactivos para el catálogo de Consumo
 * Fiel a las tarjetas presentadas en CONSUMO.svg
 */
export const DEFAULT_REACTIVOS: Reactivo[] = [
  {
    id: 'reactivo-1',
    name: 'Reactivo 1',
    code: 'XX-123',
    stock: '500ml',
    salud: 2,
    inflamabilidad: 1,
    reactividad: 0,
    especial: 'W',
  },
  {
    id: 'reactivo-2',
    name: 'Reactivo 2',
    code: 'XX-123',
    stock: '500ml',
    salud: 3,
    inflamabilidad: 0,
    reactividad: 1,
  },
  {
    id: 'reactivo-3',
    name: 'Reactivo 3',
    code: 'XX-123',
    stock: '500ml',
    salud: 1,
    inflamabilidad: 2,
    reactividad: 0,
  },
  {
    id: 'reactivo-4',
    name: 'Reactivo 4',
    code: 'XX-123',
    stock: '500ml',
    salud: 2,
    inflamabilidad: 3,
    reactividad: 1,
  },
  {
    id: 'reactivo-5',
    name: 'Reactivo 5',
    code: 'XX-123',
    stock: '500ml',
    salud: 0,
    inflamabilidad: 1,
    reactividad: 0,
  },
  {
    id: 'reactivo-6',
    name: 'Reactivo 6',
    code: 'XX-123',
    stock: '500ml',
    salud: 1,
    inflamabilidad: 0,
    reactividad: 0,
  },
]

/**
 * Alertas de reactivos (solo escasez, sin notificaciones de inexistencia)
 */
export const DEFAULT_REACTIVO_ALERTS: DashboardAlert[] = [
  {
    id: 'alert-reactivo-1',
    category: 'reactivo',
    variant: 'warning',
    title: 'DCA03 escasea',
  },
]

/**
 * Alertas de equipos exactas extraídas de DASHBOARD.svg
 */
export const DEFAULT_EQUIPO_ALERTS: DashboardAlert[] = [
  {
    id: 'alert-equipo-1',
    category: 'equipo',
    variant: 'warning',
    title: 'Equipo 7 tiene que limpiarse pronto',
  },
  {
    id: 'alert-equipo-2',
    category: 'equipo',
    variant: 'danger',
    title: 'Equipo 18 tiene una calibración',
    description: 'atrasada',
  },
]

/**
 * Registros de consumo recientes para visualización en tablas de escritorio
 */
export const DEFAULT_RECENT_CONSUMOS: ConsumoReciente[] = [
  {
    id: 'c-1',
    reactivoId: 'reactivo-1',
    reactivoName: 'Reactivo 1',
    code: 'XX-123',
    cantidad: '25 ml',
    usuario: 'John Doe',
    fecha: 'Hoy, 10:45 AM',
    estado: 'confirmado',
  },
  {
    id: 'c-2',
    reactivoId: 'reactivo-3',
    reactivoName: 'Reactivo 3',
    code: 'XX-123',
    cantidad: '50 ml',
    usuario: 'María González',
    fecha: 'Hoy, 09:15 AM',
    estado: 'confirmado',
  },
  {
    id: 'c-3',
    reactivoId: 'reactivo-2',
    reactivoName: 'Reactivo 2',
    code: 'XX-123',
    cantidad: '10 ml',
    usuario: 'Carlos Ruiz',
    fecha: 'Ayer, 04:30 PM',
    estado: 'confirmado',
  },
  {
    id: 'c-4',
    reactivoId: 'reactivo-4',
    reactivoName: 'Reactivo 4',
    code: 'XX-123',
    cantidad: '100 ml',
    usuario: 'John Doe',
    fecha: 'Ayer, 02:10 PM',
    estado: 'confirmado',
  },
]

