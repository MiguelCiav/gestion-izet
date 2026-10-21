import type { LabOption } from '@/features/auth/types'

export type BitacoraEntryType = 'consumo' | 'ajuste' | 'prestamo'

export interface BitacoraEntry {
  id: string
  type: BitacoraEntryType
  title: string
  reactivoCode?: string
  reactivoName?: string
  date: string
  timestamp?: string
  user?: string
  quantity?: string
  observations?: string
}

export interface BitacoraDateGroup {
  date: string
  entries: BitacoraEntry[]
}

export interface ReactivoSummary {
  id?: string
  name: string
  code: string
  stock: string
  unit?: string
  details?: string
  salud?: number | string
  inflamabilidad?: number | string
  reactividad?: number | string
  especial?: string
}

export interface BitacoraAjusteFormData {
  fecha: string
  cantidad: string
  observaciones: string
}

export interface BitacoraConsumoFormData {
  responsable: string
  fecha: string
  cantidad: string
  observaciones: string
}

export interface BitacoraPrestamoFormData {
  responsable: string
  fecha: string
  cantidad: string
  tipo: string
  estado: string
  observaciones: string
}

export type BitacoraCategoryFilter = 'todos' | 'consumo' | 'ajuste' | 'prestamo'

export interface DesktopBitacoraItem {
  id: string
  tipo: BitacoraEntryType
  tipoLabel: string
  tipoMovimientoOriginal?: string
  reactivoName: string
  reactivoCode: string
  responsable: string
  laboratorioCodigo?: LabOption
  fecha: string
  fechaHora?: string
  rawDate?: string
  cantidad: string
  stockAnterior?: string
  stockPosterior?: string
  observaciones: string
  reactivo?: ReactivoSummary
  tipoPrestamo?: string
  estadoPrestamo?: string
}
