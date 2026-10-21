export type LabOption = 'LEPA' | 'LEM'

export interface AuthUser {
  id?: string
  username: string
  email?: string
  cedula?: string
  contacto?: string
  rol?: 'admin' | 'investigador' | 'analista' | 'invitado'
  lab: LabOption
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface RegisterStepData {
  lab?: LabOption
  username?: string
  cedula?: string
  contacto?: string
  password?: string
  confirmPassword?: string
}

export type AuthStep = 1 | 2 | 3
