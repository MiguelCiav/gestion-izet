import * as React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  DesktopCard,
  DesktopCardHeader,
  DesktopCardTitle,
  DesktopCardDescription,
  DesktopCardContent,
  DesktopCardFooter,
} from '@/components/desktop'
import { Button, InputField, RadioButton, StepIndicator, type StepItem } from '@/components/ui'
import { cn } from '@/lib/utils'
import { AuthLogo } from '../components'
import { useAuth } from '../hooks'
import type { AuthStep, LabOption } from '../types'

export interface DesktopOnboardingWizardPageProps {
  initialStep?: AuthStep
  onFinish?: () => void
}

const ONBOARDING_STEPS: StepItem[] = [
  { id: 1, title: 'Laboratorio' },
  { id: 2, title: 'Datos' },
  { id: 3, title: 'Confirmación' },
]

interface LabChoice {
  id: LabOption
  name: string
  description: string
}

const LAB_OPTIONS: LabChoice[] = [
  {
    id: 'LEPA',
    name: 'LEPA',
    description: 'Laboratorio de Ecología de Plantas Acuáticas (LEPA)',
  },
  {
    id: 'LEM',
    name: 'LEM',
    description: 'Laboratorio de Ecología de Microorganismos (LEM)',
  },
]

export function DesktopOnboardingWizardPage({
  initialStep = 1,
  onFinish,
}: DesktopOnboardingWizardPageProps) {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { onboardingData, setOnboardingData, registerUser } = useAuth()

  const stepParam = Number(searchParams.get('step')) || initialStep
  const currentStep: AuthStep =
    stepParam >= 1 && stepParam <= 3 ? (stepParam as AuthStep) : 1

  const goToStep = (step: AuthStep) => {
    setSearchParams({ step: String(step) })
  }

  // Estado del Paso 1: Selección de laboratorio
  const [selectedLab, setSelectedLab] = React.useState<LabOption>(
    onboardingData.lab || 'LEPA',
  )

  // Estado del Paso 2: Credenciales y datos personales (HU01)
  const [username, setUsername] = React.useState(onboardingData.username || '')
  const [cedula, setCedula] = React.useState(onboardingData.cedula || '')
  const [contacto, setContacto] = React.useState(onboardingData.contacto || '')
  const [password, setPassword] = React.useState(onboardingData.password || '')
  const [confirmPassword, setConfirmPassword] = React.useState(
    onboardingData.confirmPassword || '',
  )
  const [step2Error, setStep2Error] = React.useState<string | null>(null)
  const [isRegistering, setIsRegistering] = React.useState(false)

  // Handlers
  const handleContinueStep1 = () => {
    setOnboardingData((prev) => ({ ...prev, lab: selectedLab }))
    goToStep(2)
  }

  const handleStep2Submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!username.trim()) {
      setStep2Error('Por favor ingresa tu nombre o usuario.')
      return
    }
    if (!cedula.trim()) {
      setStep2Error('Por favor ingresa tu cédula de identidad.')
      return
    }
    if (!contacto.trim()) {
      setStep2Error('Por favor ingresa tu teléfono o correo de contacto.')
      return
    }
    if (!password) {
      setStep2Error('Por favor ingresa una contraseña.')
      return
    }
    if (password.length < 6) {
      setStep2Error('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    if (password !== confirmPassword) {
      setStep2Error('Las contraseñas no coinciden.')
      return
    }

    setStep2Error(null)
    setOnboardingData((prev) => ({
      ...prev,
      lab: selectedLab,
      username: username.trim(),
      cedula: cedula.trim(),
      contacto: contacto.trim(),
      password,
      confirmPassword,
    }))
    goToStep(3)
  }

  const handleFinish = async () => {
    setIsRegistering(true)
    setStep2Error(null)
    const res = await registerUser({
      ...onboardingData,
      lab: onboardingData.lab || selectedLab,
      username: onboardingData.username || username.trim(),
      cedula: onboardingData.cedula || cedula.trim(),
      contacto: onboardingData.contacto || contacto.trim(),
      password: onboardingData.password || password,
    })
    setIsRegistering(false)

    if (!res.success) {
      setStep2Error(res.error || 'Error al registrar el usuario.')
      return
    }

    if (onFinish) {
      onFinish()
    } else {
      navigate('/login')
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#FAF6F0] flex flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8 select-none">
      {/* Logotipo Vectorial Institucional Centrado */}
      <div className="mb-6 flex justify-center">
        <AuthLogo size={112} />
      </div>

      {/* Contenedor Oficial DesktopCard */}
      <DesktopCard maxWidth="lg" className="w-full max-w-[640px] bg-[#FAF6F0]">
        {/* Indicador de Pasos Oficial Desktop */}
        <div className="w-full mb-8 px-2 sm:px-4">
          <StepIndicator
            steps={ONBOARDING_STEPS}
            currentStep={currentStep}
            onStepClick={(step) => {
              if (step === 1) goToStep(1)
              if (step === 2 && onboardingData.lab) goToStep(2)
              if (step === 3 && onboardingData.username) goToStep(3)
            }}
          />
        </div>

        {/* PASO 1: SELECCIÓN DE LABORATORIO */}
        {currentStep === 1 && (
          <div>
            <DesktopCardHeader className="text-center mb-6">
              <DesktopCardTitle className="font-serif text-3xl font-bold text-primary tracking-tight">
                ¡Bienvenido!
              </DesktopCardTitle>
              <DesktopCardDescription className="text-sm sm:text-base text-[#4A4E4A] mt-2 max-w-lg mx-auto leading-relaxed">
                Antes de comenzar, escoge el laboratorio al que perteneces:
              </DesktopCardDescription>
            </DesktopCardHeader>

            <DesktopCardContent className="space-y-3 p-0">
              {LAB_OPTIONS.map((lab) => {
                const isSelected = selectedLab === lab.id
                return (
                  <label
                    key={lab.id}
                    className={cn(
                      'flex items-center gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer select-none',
                      isSelected
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-[#655D52]/20 hover:border-[#655D52]/40 bg-surface-card',
                    )}
                  >
                    <RadioButton
                      name="selected-lab"
                      value={lab.id}
                      checked={isSelected}
                      onChange={() => setSelectedLab(lab.id)}
                    />
                    <div className="flex flex-col text-left">
                      <span className="font-bold text-base text-text-main">
                        {lab.name}
                      </span>
                      <span className="text-xs text-text-muted">
                        {lab.description}
                      </span>
                    </div>
                  </label>
                )
              })}
            </DesktopCardContent>

            <DesktopCardFooter className="pt-6 w-full">
              <Button
                type="button"
                size="lg"
                fullWidth
                onClick={handleContinueStep1}
              >
                Continuar
              </Button>
            </DesktopCardFooter>
          </div>
        )}

        {/* PASO 2: DATOS DEL USUARIO (HU01) */}
        {currentStep === 2 && (
          <div>
            <DesktopCardHeader className="text-center mb-6">
              <DesktopCardTitle className="font-serif text-3xl font-bold text-primary tracking-tight">
                ¿Cómo debemos recordarte?
              </DesktopCardTitle>
              <DesktopCardDescription className="text-sm sm:text-base text-[#4A4E4A] mt-2 leading-relaxed">
                Ingresa tus datos personales, laboratorio y credenciales de acceso.
              </DesktopCardDescription>
            </DesktopCardHeader>

            {step2Error && (
              <div
                role="alert"
                className="mb-4 p-3.5 text-xs font-medium rounded-input bg-alert-danger-bg text-alert-danger-border border border-alert-danger-border text-center"
              >
                {step2Error}
              </div>
            )}

            <form onSubmit={handleStep2Submit} className="w-full space-y-4">
              <DesktopCardContent className="space-y-4 p-0">
                <InputField
                  label="Nombre y apellido / Usuario"
                  name="username"
                  placeholder="Ej. Dra. María Rodríguez"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value)
                    setStep2Error(null)
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
                      setStep2Error(null)
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
                      setStep2Error(null)
                    }}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="desktop-wizard-lab"
                    className="block text-sm font-medium text-text-main mb-1.5"
                  >
                    Laboratorio
                  </label>
                  <select
                    id="desktop-wizard-lab"
                    value={selectedLab}
                    onChange={(e) => setSelectedLab(e.target.value as LabOption)}
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
                      setStep2Error(null)
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
                      setStep2Error(null)
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
                  onClick={() => goToStep(1)}
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
          </div>
        )}

        {/* PASO 3: CONFIRMACIÓN */}
        {currentStep === 3 && (
          <div>
            <DesktopCardHeader className="text-center mb-6">
              <DesktopCardTitle className="font-serif text-3xl font-bold text-primary tracking-tight">
                ¡Todo listo!
              </DesktopCardTitle>
              <DesktopCardDescription className="text-sm sm:text-base text-[#4A4E4A] mt-2 leading-relaxed">
                Tu registro para el laboratorio{' '}
                <strong className="font-semibold text-text-main">
                  {onboardingData.lab || selectedLab}
                </strong>{' '}
                está listo. Confirma para crear tu cuenta e iniciar sesión:
              </DesktopCardDescription>
            </DesktopCardHeader>

            {step2Error && (
              <div
                role="alert"
                className="mb-4 p-3.5 text-xs font-medium rounded-input bg-alert-danger-bg text-alert-danger-border border border-alert-danger-border text-center"
              >
                {step2Error}
              </div>
            )}

            <DesktopCardContent className="py-2 p-0">
              <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-xs uppercase font-bold text-primary tracking-wider block">
                    Laboratorio asignado: {onboardingData.lab || selectedLab}
                  </span>
                  <span className="text-base font-bold text-text-main block">
                    {onboardingData.username || username}
                  </span>
                  <p className="text-xs text-text-muted">
                    Cédula: {onboardingData.cedula || cedula} • Contacto: {onboardingData.contacto || contacto}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-lg">
                  ✓
                </div>
              </div>
            </DesktopCardContent>

            <DesktopCardFooter className="pt-6 w-full">
              <Button
                type="button"
                size="lg"
                fullWidth
                disabled={isRegistering}
                onClick={() => void handleFinish()}
              >
                {isRegistering ? 'Creando cuenta...' : 'Iniciar Sesión'}
              </Button>
            </DesktopCardFooter>
          </div>
        )}
      </DesktopCard>
    </div>
  )
}

export default DesktopOnboardingWizardPage
