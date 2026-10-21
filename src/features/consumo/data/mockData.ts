import type { ConsumoReciente, DashboardAlert, Reactivo } from '../types'

/**
 * Lista por defecto de reactivos para el catálogo de Consumo (vacía por defecto)
 */
export const DEFAULT_REACTIVOS: Reactivo[] = []

/**
 * Alertas de reactivos (vacía por defecto)
 */
export const DEFAULT_REACTIVO_ALERTS: DashboardAlert[] = []

/**
 * Alertas de equipos extraídas del diseño base
 */
export const DEFAULT_EQUIPO_ALERTS: DashboardAlert[] = []

/**
 * Registros de consumo recientes para visualización en tablas de escritorio (vacío por defecto)
 */
export const DEFAULT_RECENT_CONSUMOS: ConsumoReciente[] = []
