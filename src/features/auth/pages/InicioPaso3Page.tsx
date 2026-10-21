import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { StepIndicator } from '@/components/ui/Stepper'
import { AuthLogo, StepConfirmacion } from '../components'
import { useAuth } from '../hooks'

const STEPS = [
  { title: 'Laboratorio' },
  { title: 'Datos' },
  { title: 'Confirmación' },
]

export function InicioPaso3Page() {
  const navigate = useNavigate()
  const { onboardingData, registerUser } = useAuth()
  const [error, setError] = React.useState<string | null>(null)

  const handleLoginRedirect = async () => {
    setError(null)
    const res = await registerUser(onboardingData)
    if (!res.success) {
      setError(res.error || 'No se pudo completar el registro.')
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
            currentStep={3}
            onStepClick={(step) => {
              if (step === 1) navigate('/auth/paso-1')
              if (step === 2) navigate('/auth/paso-2')
            }}
          />
        </div>

        {/* Título de Confirmación */}
        <h1 className="font-serif text-[32px] sm:text-4xl font-bold text-primary text-center tracking-tight">
          ¡Todo listo!
        </h1>

        {error && (
          <div className="w-full p-3 text-xs rounded-input bg-alert-danger-bg text-alert-danger-border border border-alert-danger-border text-center">
            {error}
          </div>
        )}

        {/* Confirmación y Acción Final */}
        <StepConfirmacion
          lab={onboardingData.lab || 'LEPA'}
          onLoginClick={() => void handleLoginRedirect()}
        />
      </div>
    </div>
  )
}

export default InicioPaso3Page
