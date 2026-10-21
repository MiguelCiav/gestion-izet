import * as React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { StepIndicator } from '@/components/ui/Stepper'
import { AuthLogo, StepConfirmacion, StepDatos, StepLaboratorio } from '../components'
import type { StepDatosPayload } from '../components/StepDatos'
import { useAuth } from '../hooks'
import type { AuthStep, LabOption } from '../types'

const STEPS = [
  { title: 'Laboratorio' },
  { title: 'Datos' },
  { title: 'Confirmación' },
]

export function OnboardingWizardPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { onboardingData, setOnboardingData, registerUser } = useAuth()
  const [registerError, setRegisterError] = React.useState<string | null>(null)

  const stepParam = Number(searchParams.get('step')) || 1
  const currentStep: AuthStep =
    stepParam >= 1 && stepParam <= 3 ? (stepParam as AuthStep) : 1

  const goToStep = (step: AuthStep) => {
    setSearchParams({ step: String(step) })
  }

  const handleSelectLab = (lab: LabOption) => {
    setOnboardingData((prev) => ({ ...prev, lab }))
    goToStep(2)
  }

  const handleStepDatosNext = (data: StepDatosPayload) => {
    setOnboardingData((prev) => ({
      ...prev,
      lab: data.lab,
      username: data.username,
      cedula: data.cedula,
      contacto: data.contacto,
      password: data.password,
      confirmPassword: data.confirmPassword,
    }))
    goToStep(3)
  }

  const handleFinish = async () => {
    setRegisterError(null)
    const res = await registerUser(onboardingData)
    if (!res.success) {
      setRegisterError(res.error || 'No se pudo completar el registro.')
      return
    }
    navigate('/login')
  }

  return (
    <div className="min-h-screen w-full bg-[#FAF6F0] flex flex-col items-center justify-between px-8 py-10 sm:py-16">
      <div className="w-full max-w-[348px] flex flex-col items-center space-y-8 my-auto">
        {/* Logotipo Vectorial */}
        <div className="flex justify-center">
          <AuthLogo size={128} />
        </div>

        {/* Indicador de Pasos del Flujo */}
        <div className="w-full">
          <StepIndicator
            steps={STEPS}
            currentStep={currentStep}
            onStepClick={(step) => {
              if (step === 1) goToStep(1)
              if (step === 2 && onboardingData.lab) goToStep(2)
              if (step === 3 && onboardingData.username) goToStep(3)
            }}
          />
        </div>

        {/* Encabezado según el paso */}
        <h1 className="font-serif text-[32px] sm:text-4xl font-bold text-primary text-center tracking-tight leading-tight">
          {currentStep === 1 && '¡Bienvenido!'}
          {currentStep === 2 && '¿Cómo debemos recordarte?'}
          {currentStep === 3 && '¡Todo listo!'}
        </h1>

        {registerError && (
          <div className="w-full p-3 text-xs rounded-input bg-alert-danger-bg text-alert-danger-border border border-alert-danger-border text-center">
            {registerError}
          </div>
        )}

        {/* Contenido según el paso */}
        {currentStep === 1 && (
          <StepLaboratorio
            selectedLab={onboardingData.lab}
            onSelectLab={handleSelectLab}
          />
        )}

        {currentStep === 2 && (
          <StepDatos
            initialUsername={onboardingData.username || ''}
            initialCedula={onboardingData.cedula || ''}
            initialContacto={onboardingData.contacto || ''}
            initialLab={onboardingData.lab || 'LEPA'}
            initialPassword={onboardingData.password || ''}
            initialConfirmPassword={onboardingData.confirmPassword || ''}
            onBack={() => goToStep(1)}
            onNext={handleStepDatosNext}
          />
        )}

        {currentStep === 3 && (
          <StepConfirmacion
            lab={onboardingData.lab || 'LEPA'}
            onLoginClick={() => void handleFinish()}
          />
        )}
      </div>
    </div>
  )
}

export default OnboardingWizardPage
