import * as React from 'react'
import { Button } from '@/components/ui/Button'
import { InputField } from '@/components/ui/InputField'
import type { LabOption } from '../types'

export interface StepDatosPayload {
  username: string
  cedula: string
  contacto: string
  lab: LabOption
  password: string
  confirmPassword: string
}

export interface StepDatosProps {
  initialUsername?: string
  initialCedula?: string
  initialContacto?: string
  initialLab?: LabOption
  initialPassword?: string
  initialConfirmPassword?: string
  onBack: () => void
  onNext: (data: StepDatosPayload) => void
  isLoading?: boolean
  error?: string
}

export function StepDatos({
  initialUsername = '',
  initialCedula = '',
  initialContacto = '',
  initialLab = 'LEPA',
  initialPassword = '',
  initialConfirmPassword = '',
  onBack,
  onNext,
  isLoading = false,
  error,
}: StepDatosProps) {
  const [username, setUsername] = React.useState(initialUsername)
  const [cedula, setCedula] = React.useState(initialCedula)
  const [contacto, setContacto] = React.useState(initialContacto)
  const [lab, setLab] = React.useState<LabOption>(initialLab)
  const [password, setPassword] = React.useState(initialPassword)
  const [confirmPassword, setConfirmPassword] = React.useState(initialConfirmPassword)
  const [localError, setLocalError] = React.useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim()) {
      setLocalError('Por favor ingresa tu nombre o usuario.')
      return
    }
    if (!cedula.trim()) {
      setLocalError('Por favor ingresa tu cédula de identidad.')
      return
    }
    if (!contacto.trim()) {
      setLocalError('Por favor ingresa tu teléfono o correo de contacto.')
      return
    }
    if (!password || password.length < 6) {
      setLocalError('La clave debe tener al menos 6 caracteres.')
      return
    }
    if (password !== confirmPassword) {
      setLocalError('Las claves no coinciden.')
      return
    }
    setLocalError(null)
    onNext({
      username: username.trim(),
      cedula: cedula.trim(),
      contacto: contacto.trim(),
      lab,
      password,
      confirmPassword,
    })
  }

  const displayedError = error || localError

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-5">
      <p className="font-sans text-base text-[#4A4E4A] leading-relaxed text-left">
        Ingresa tus datos personales y credenciales de acceso.
      </p>

      {displayedError && (
        <div className="p-3 text-xs rounded-input bg-alert-danger-bg text-alert-danger-border border border-alert-danger-border">
          {displayedError}
        </div>
      )}

      {/* Inputs */}
      <div className="space-y-3.5">
        <InputField
          name="username"
          placeholder="Nombre y apellido / Usuario"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value)
            setLocalError(null)
          }}
          required
        />

        <InputField
          name="cedula"
          placeholder="Cédula de identidad (Ej. V-12345678)"
          value={cedula}
          onChange={(e) => {
            setCedula(e.target.value)
            setLocalError(null)
          }}
          required
        />

        <InputField
          name="contacto"
          placeholder="Teléfono o correo electrónico"
          value={contacto}
          onChange={(e) => {
            setContacto(e.target.value)
            setLocalError(null)
          }}
          required
        />

        <div>
          <label
            htmlFor="step-datos-lab"
            className="block text-xs font-semibold text-[#4A4E4A] mb-1"
          >
            Laboratorio asignado
          </label>
          <select
            id="step-datos-lab"
            value={lab}
            onChange={(e) => setLab(e.target.value as LabOption)}
            className="h-12 w-full rounded-input border border-[#655D52]/40 bg-white px-3.5 text-sm font-semibold text-[#181C1B] focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="LEPA">LEPA - Lab. de Ecología de Plantas Acuáticas</option>
            <option value="LEM">LEM - Lab. de Ecología de Microorganismos</option>
          </select>
        </div>

        <InputField
          name="password"
          variant="password"
          placeholder="Clave (mínimo 6 caracteres)"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            setLocalError(null)
          }}
          required
        />

        <InputField
          name="confirmPassword"
          variant="password"
          placeholder="Confirma tu clave"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value)
            setLocalError(null)
          }}
          required
        />
      </div>

      {/* Botones de acción en fila: Volver y Continuar */}
      <div className="flex items-center gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="flex-1"
          onClick={onBack}
          disabled={isLoading}
        >
          Volver
        </Button>

        <Button
          type="submit"
          size="lg"
          className="flex-1"
          disabled={isLoading}
        >
          {isLoading ? 'Guardando...' : 'Continuar'}
        </Button>
      </div>
    </form>
  )
}
