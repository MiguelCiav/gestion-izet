import { useNavigate } from 'react-router-dom'
import { StepIndicator } from '@/components/ui/Stepper'
import { AuthLogo, StepDatos } from '../components'
import type { StepDatosPayload } from '../components/StepDatos'
import { useAuth } from '../hooks'

const STEPS = [
  { title: 'Laboratorio' },
  { title: 'Datos' },
  { title: 'Confirmación' },
]

export function InicioPaso2Page() {
  const navigate = useNavigate()
  const { onboardingData, setOnboardingData } = useAuth()

  const handleBack = () => {
    navigate('/auth/paso-1')
  }

  const handleNext = (data: StepDatosPayload) => {
    setOnboardingData((prev) => ({
      ...prev,
      lab: data.lab,
      username: data.username,
      cedula: data.cedula,
      contacto: data.contacto,
      password: data.password,
      confirmPassword: data.confirmPassword,
    }))
    navigate('/auth/paso-3')
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
            currentStep={2}
            onStepClick={(step) => {
              if (step === 1) navigate('/auth/paso-1')
              if (step === 3 && onboardingData.username) navigate('/auth/paso-3')
            }}
          />
        </div>

        {/* Título de Pregunta de Identidad */}
        <h1 className="font-serif text-[32px] sm:text-4xl font-bold text-primary text-center tracking-tight leading-tight">
          ¿Cómo debemos recordarte?
        </h1>

        {/* Formulario de Datos */}
        <StepDatos
          initialUsername={onboardingData.username || ''}
          initialCedula={onboardingData.cedula || ''}
          initialContacto={onboardingData.contacto || ''}
          initialLab={onboardingData.lab || 'LEPA'}
          initialPassword={onboardingData.password || ''}
          initialConfirmPassword={onboardingData.confirmPassword || ''}
          onBack={handleBack}
          onNext={handleNext}
        />
      </div>
    </div>
  )
}

export default InicioPaso2Page
