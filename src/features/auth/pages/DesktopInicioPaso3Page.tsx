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
import { Button, StepIndicator, type StepItem } from '@/components/ui'
import { AuthLogo } from '../components'
import { useAuth } from '../hooks'

const ONBOARDING_STEPS: StepItem[] = [
  { id: 1, title: 'Laboratorio' },
  { id: 2, title: 'Datos' },
  { id: 3, title: 'Confirmación' },
]

export interface DesktopInicioPaso3PageProps {
  onLoginClick?: () => void
}

export function DesktopInicioPaso3Page({ onLoginClick }: DesktopInicioPaso3PageProps) {
  const navigate = useNavigate()
  const { onboardingData, registerUser } = useAuth()
  const [error, setError] = React.useState<string | null>(null)
  const [isRegistering, setIsRegistering] = React.useState(false)

  const lab = onboardingData.lab || 'LEPA'

  const handleFinish = async () => {
    setError(null)
    setIsRegistering(true)
    const res = await registerUser(onboardingData)
    setIsRegistering(false)

    if (!res.success) {
      setError(res.error || 'No se pudo completar el registro.')
      return
    }

    if (onLoginClick) {
      onLoginClick()
    } else {
      navigate('/login')
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
            currentStep={3}
            onStepClick={(step) => {
              if (step === 1) navigate('/auth/paso-1')
              if (step === 2) navigate('/auth/paso-2')
            }}
          />
        </div>

        <DesktopCardHeader className="text-center mb-6">
          <DesktopCardTitle className="font-serif text-3xl font-bold text-primary tracking-tight">
            ¡Todo listo!
          </DesktopCardTitle>
          <DesktopCardDescription className="text-sm sm:text-base text-[#4A4E4A] mt-2 leading-relaxed">
            Tu usuario para el laboratorio{' '}
            <strong className="font-semibold text-text-main">{lab}</strong> está listo para registrarse:
          </DesktopCardDescription>
        </DesktopCardHeader>

        {error && (
          <div className="mb-4 p-3.5 text-xs font-medium rounded-input bg-alert-danger-bg text-alert-danger-border border border-alert-danger-border text-center">
            {error}
          </div>
        )}

        <DesktopCardContent className="py-2 p-0">
          <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-bold text-primary tracking-wider block">
                Laboratorio asignado: {lab}
              </span>
              {onboardingData.username && (
                <span className="text-base font-bold text-text-main block mt-0.5">
                  {onboardingData.username}
                </span>
              )}
              {(onboardingData.cedula || onboardingData.contacto) && (
                <p className="text-xs text-text-muted mt-0.5">
                  {onboardingData.cedula}
                  {onboardingData.contacto ? ` • ${onboardingData.contacto}` : ''}
                </p>
              )}
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
      </DesktopCard>
    </div>
  )
}

export default DesktopInicioPaso3Page
