import type { LaboratorioCodigo } from '@/lib/izetService'

export type UserRole = 'admin' | 'investigador' | 'analista' | 'invitado'

export interface AdminUsuarioItem {
  id: string
  email: string
  nombreCompleto: string
  cedula: string
  contacto?: string | null
  rol: UserRole
  laboratorioId?: string | null
  laboratorioCodigo?: LaboratorioCodigo | null
  createdAt?: string
}

export interface AdminUsuarioFormData {
  nombreCompleto: string
  cedula: string
  email: string
  password?: string
  rol: UserRole
  laboratorioCodigo: LaboratorioCodigo
  contacto?: string
}

export interface AdminUbicacionFormData {
  nombre: string
  descripcion?: string
  laboratorioCodigo: LaboratorioCodigo
  activo?: boolean
}
