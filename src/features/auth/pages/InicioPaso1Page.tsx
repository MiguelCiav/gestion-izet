import { useNavigate } from 'react-router-dom'
import { StepIndicator } from '@/components/ui/Stepper'
import { AuthLogo, StepLaboratorio } from '../components'
import { useAuth } from '../hooks'
import type { LabOption } from '../types'

const STEPS = [
  { title: 'Laboratorio' },
  { title: 'Datos' },
  { title: 'Confirmación' },
]

export function InicioPaso1Page() {
  const navigate = useNavigate()
  const { onboardingData, setOnboardingData } = useAuth()

  const handleSelectLab = (lab: LabOption) => {
    setOnboardingData((prev) => ({ ...prev, lab }))
    navigate('/auth/paso-2')
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
            currentStep={1}
            onStepClick={(step) => {
              if (step === 2 && onboardingData.lab) navigate('/auth/paso-2')
              if (step === 3 && onboardingData.username) navigate('/auth/paso-3')
            }}
          />
        </div>

        {/* Título de Bienvenida */}
        <h1 className="font-serif text-[32px] sm:text-4xl font-bold text-primary text-center tracking-tight">
          ¡Bienvenido!
        </h1>

        {/* Selección de Laboratorio */}
        <StepLaboratorio
          selectedLab={onboardingData.lab}
          onSelectLab={handleSelectLab}
        />
      </div>
    </div>
  )
}

export default InicioPaso1Page
