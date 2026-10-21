import type { RomboValues } from '@/components/ui/RomboBadge'
import type { LabOption } from '@/features/auth/types'

/**
 * Estados posibles de un préstamo en el laboratorio
 */
export type PrestamoEstado = 'pendiente' | 'aprobado' | 'devuelto' | 'vencido'

/**
 * Modalidad de préstamo según HU09 y HU10:
 * - FRASCO_COMPLETO: Se presta el envase físico completo (se marca como EN_PRESTAMO en stock)
 * - FRACCION: Se entrega una cantidad específica o alícuota, descontándose esa porción del stock
 */
export type ModalidadPrestamo = 'FRASCO_COMPLETO' | 'FRACCION'

/**
 * Representa un reactivo disponible para préstamo en el laboratorio
 */
export interface PrestamoReactivo {
  id: string
  stockId?: string
  nombre: string
  codigo: string
  stock: number | string
  unidad?: string
  detalles?: string
  ubicacion?: string
  fechaVencimiento?: string
  usoCompartido?: boolean
  rombo?: RomboValues
  salud?: number | string
  inflamabilidad?: number | string
  reactividad?: number | string
  especial?: string
}

/**
 * Representa una solicitud de préstamo registrada
 */
export interface SolicitudPrestamo {
  id?: string
  reactivoId: string
  reactivoNombre: string
  reactivoCodigo?: string
  cantidad: number
  unidad?: string
  fechaSolicitud: string
  registrarOtra?: boolean
  responsable?: string
  observaciones?: string
  estado?: PrestamoEstado
}

/**
 * Representa un registro completo de préstamo para la tabla de escritorio y bandeja de devolución (HU09 y HU10)
 */
export interface PrestamoItem {
  id: string
  reactivoId?: string
  laboratorioCodigo?: LabOption
  responsable: string
  solicitanteCedula?: string
  solicitanteContacto?: string
  responsableRol?: string
  material: string
  codigoReactivo?: string
  modalidad?: ModalidadPrestamo
  modalidadLabel?: string
  cantidad: number | string
  cantidadDevuelta?: number
  unidad?: string
  fechaSolicitud: string
  rawFechaSolicitud?: string
  fechaLimite: string
  rawFechaLimite?: string
  fechaDevolucionReal?: string
  estado: PrestamoEstado
  estadoOriginal?: string
  departamento?: string
  observaciones?: string
  incidenciaDevolucion?: string
}

/**
 * Datos del formulario de solicitud de préstamo (HU09)
 */
export interface DesktopPrestamoSolicitudFormData {
  reactivoId: string
  reactivoNombre: string
  reactivoCodigo?: string
  modalidad?: ModalidadPrestamo
  cantidad: number
  unidad?: string
  responsable: string
  cedula?: string
  contacto?: string
  departamento?: string
  fechaSolicitud: string
  fechaLimite: string
  observaciones?: string
  registrarOtra: boolean
}

/**
 * Opciones de filtrado para la lista de préstamos
 */
export interface PrestamosFilterOptions {
  query: string
  ubicacion?: string
  estado?: PrestamoEstado | 'todos'
}

/**
 * Estado transmitido por navegación hacia la página de detalle de préstamo
 */
export interface PrestamosDetalleLocationState {
  reactivo?: PrestamoReactivo
  prestamoActivo?: PrestamoItem
  mode?: 'solicitar' | 'devolver'
}

/**
 * Estado transmitido por navegación hacia la lista de préstamos tras una acción
 */
export interface PrestamosListLocationState {
  successMessage?: string
}
