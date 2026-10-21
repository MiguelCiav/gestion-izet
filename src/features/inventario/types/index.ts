import type { RomboValues } from '@/components/ui/RomboBadge'

/**
 * Identificadores de las categorías del Hub de Inventario
 */
export type InventarioCategoriaId = 'reactivos' | 'vidrios' | 'equipos' | 'reporte'

/**
 * Estados técnicos posibles para un reactivo de inventario
 */
export type ReactivoEstado = 'Disponible' | 'Bajo stock' | 'Agotado'

/**
 * Estados de caducidad evaluados dinámicamente (HU08)
 */
export type CaducidadEstado = 'vigente' | 'proximo_a_vencer' | 'vencido' | 'sin_vencimiento'

/**
 * Representa una tarjeta de categoría en la vista principal (Hub) de Inventario
 */
export interface InventarioCategoria {
  id: InventarioCategoriaId
  label: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  description?: string
}

/**
 * Representa un reactivo dentro del catálogo e inventario físico (HU02, HU03, HU04, HU07, HU08)
 */
export interface ReactivoItem {
  id: string
  reactivoId?: string
  laboratorioId?: string
  nombre: string
  codigo: string
  formulaQuimica?: string
  clasificacionRiesgo?: string
  stock: string | number
  unidad?: string
  umbral?: string | number
  fechaVencimiento?: string
  ubicacion?: string
  lote?: string
  usoCompartido?: boolean
  esRegulado?: boolean
  entidadesRegulatorias?: string[]
  ultimoPrecio?: string | number
  monedaPrecio?: 'USD' | 'VES'
  fechaUltimoPrecio?: string
  estadoFisico?: 'DISPONIBLE' | 'EN_PRESTAMO' | 'AGOTADO'
  rombo?: RomboValues
  detalles?: string
  estado?: ReactivoEstado
  caducidadEstado?: CaducidadEstado
  diasParaVencer?: number | null
  caducidadLabel?: string
}

/**
 * Estructura de datos para el formulario de detalle / edición / creación de reactivo (HU02, HU03, HU04)
 */
export interface ReactivoFormData {
  nombre: string
  codigo: string
  formulaQuimica?: string
  clasificacionRiesgo?: string
  umbral: string
  stockDisponible: string
  unidadMedida?: string
  fechaVencimiento: string
  ubicacion: string
  lote?: string
  usoCompartido: boolean
  esRegulado?: boolean
  entidadesRegulatorias?: string[]
  ultimoPrecio?: string
  monedaPrecio?: 'USD' | 'VES'
  fechaUltimoPrecio?: string
  rombo?: RomboValues
}

/**
 * Opciones de filtrado y búsqueda de reactivos
 */
export interface ReactivosFilterOptions {
  query: string
  ubicacion?: string
  soloBajoStock?: boolean
}
