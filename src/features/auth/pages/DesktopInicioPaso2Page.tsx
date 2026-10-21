import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  DesktopCard,
  DesktopCardHeader,
  DesktopCardTitle,
  DesktopCardDescription,
  DesktopCardContent,
  DesktopCardFooter,
} from '@/components/desktop'
import { Button, InputField, StepIndicator, type StepItem } from '@/components/ui'
import { AuthLogo } from '../components'
import { useAuth } from '../hooks'
import type { LabOption } from '../types'

const ONBOARDING_STEPS: StepItem[] = [
  { id: 1, title: 'Laboratorio' },
  { id: 2, title: 'Datos' },
  { id: 3, title: 'Confirmación' },
]

export interface DesktopInicioPaso2PageProps {
  onBack?: () => void
  onNext?: (data: {
    username: string
    cedula: string
    contacto: string
    lab: LabOption
    password: string
    confirmPassword: string
  }) => void
}

export function DesktopInicioPaso2Page({ onBack, onNext }: DesktopInicioPaso2PageProps) {
  const navigate = useNavigate()
  const { onboardingData, setOnboardingData } = useAuth()

  const [username, setUsername] = React.useState(onboardingData.username || '')
  const [cedula, setCedula] = React.useState(onboardingData.cedula || '')
  const [contacto, setContacto] = React.useState(onboardingData.contacto || '')
  const [lab, setLab] = React.useState<LabOption>(onboardingData.lab || 'LEPA')
  const [password, setPassword] = React.useState(onboardingData.password || '')
  const [confirmPassword, setConfirmPassword] = React.useState(
    onboardingData.confirmPassword || '',
  )
  const [error, setError] = React.useState<string | null>(null)

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      navigate('/auth/paso-1')
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!username.trim()) {
      setError('Por favor ingresa tu nombre o usuario.')
      return
    }
    if (!cedula.trim()) {
      setError('Por favor ingresa tu cédula de identidad.')
      return
    }
    if (!contacto.trim()) {
      setError('Por favor ingresa tu teléfono o correo de contacto.')
      return
    }
    if (!password) {
      setError('Por favor ingresa una clave.')
      return
    }
    if (password.length < 6) {
      setError('La clave debe tener al menos 6 caracteres.')
      return
    }
    if (password !== confirmPassword) {
      setError('Las claves no coinciden.')
      return
    }

    setError(null)
    const payload = {
      username: username.trim(),
      cedula: cedula.trim(),
      contacto: contacto.trim(),
      lab,
      password,
      confirmPassword,
    }

    setOnboardingData((prev) => ({
      ...prev,
      ...payload,
    }))

    if (onNext) {
      onNext(payload)
    } else {
      navigate('/auth/paso-3')
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#FAF6F0] flex flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8 select-none">
      <div className="mb-6 flex justify-center">
        <AuthLogo size={112} />
      </div>

      <DesktopCard maxWidth="lg" className="w-full max-w-[640px] bg-[#FAF6F0]">
        <div className="w-full mb-8 px-2 sm:px-4">
          <StepIndicator
            steps={ONBOARDING_STEPS}
            currentStep={2}
            onStepClick={(step) => {
              if (step === 1) navigate('/auth/paso-1')
              if (step === 3 && onboardingData.username) navigate('/auth/paso-3')
            }}
          />
        </div>

        <DesktopCardHeader className="text-center mb-6">
          <DesktopCardTitle className="font-serif text-3xl font-bold text-primary tracking-tight">
            ¿Cómo debemos recordarte?
          </DesktopCardTitle>
          <DesktopCardDescription className="text-sm sm:text-base text-[#4A4E4A] mt-2 leading-relaxed">
            Ingresa tus datos personales, laboratorio y credenciales de inicio de sesión.
          </DesktopCardDescription>
        </DesktopCardHeader>

        {error && (
          <div
            role="alert"
            className="mb-4 p-3.5 text-xs font-medium rounded-input bg-alert-danger-bg text-alert-danger-border border border-alert-danger-border text-center"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <DesktopCardContent className="space-y-4 p-0">
            <InputField
              label="Nombre y apellido / Usuario"
              name="username"
              placeholder="Ej. Dra. María Rodríguez"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                setError(null)
              }}
              required
              autoComplete="username"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Cédula de Identidad"
                name="cedula"
                placeholder="Ej. V-12345678"
                value={cedula}
                onChange={(e) => {
                  setCedula(e.target.value)
                  setError(null)
                }}
                required
              />

              <InputField
                label="Teléfono o Correo"
                name="contacto"
                placeholder="Ej. 0414-1234567 o correo@ucv.ve"
                value={contacto}
                onChange={(e) => {
                  setContacto(e.target.value)
                  setError(null)
                }}
                required
              />
            </div>

            <div>
              <label
                htmlFor="paso2-select-lab"
                className="block text-sm font-medium text-text-main mb-1.5"
              >
                Laboratorio
              </label>
              <select
                id="paso2-select-lab"
                value={lab}
                onChange={(e) => setLab(e.target.value as LabOption)}
                className="h-12 w-full rounded-input border border-border bg-white px-3.5 text-sm font-semibold text-text-main focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="LEPA">LEPA - Laboratorio de Ecología de Plantas Acuáticas</option>
                <option value="LEM">LEM - Laboratorio de Ecología de Microorganismos</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Clave"
                name="password"
                variant="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError(null)
                }}
                required
                autoComplete="new-password"
              />

              <InputField
                label="Confirma tu clave"
                name="confirmPassword"
                variant="password"
                placeholder="Confirma tu clave"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  setError(null)
                }}
                required
                autoComplete="new-password"
              />
            </div>
          </DesktopCardContent>

          <DesktopCardFooter className="pt-6 flex flex-row gap-3 sm:gap-4 w-full">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={handleBack}
            >
              Volver
            </Button>

            <Button
              type="submit"
              size="lg"
              className="flex-1"
            >
              Continuar
            </Button>
          </DesktopCardFooter>
        </form>
      </DesktopCard>
    </div>
  )
}

export default DesktopInicioPaso2Page
