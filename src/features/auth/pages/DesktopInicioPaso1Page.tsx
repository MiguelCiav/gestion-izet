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
import { Button, RadioButton, StepIndicator, type StepItem } from '@/components/ui'
import { cn } from '@/lib/utils'
import { AuthLogo } from '../components'
import { useAuth } from '../hooks'
import type { LabOption } from '../types'

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

export interface DesktopInicioPaso1PageProps {
  onNext?: (lab: LabOption) => void
}

/**
 * DesktopInicioPaso1Page - Pantalla de escritorio para el Paso 1 de configuración inicial.
 * Basada en `src/features/DESKTOP_INICIO_DE_SESION/CONFIGURACIÓN INICIAL 1.svg`:
 * - StepIndicator con Paso 1 activo
 * - Selección de laboratorio con RadioButton
 * - Botón de confirmación para avanzar al Paso 2
 */
export function DesktopInicioPaso1Page({ onNext }: DesktopInicioPaso1PageProps) {
  const navigate = useNavigate()
  const { onboardingData, setOnboardingData } = useAuth()
  const [selectedLab, setSelectedLab] = React.useState<LabOption>(
    onboardingData.lab || 'LEPA',
  )

  const handleContinue = () => {
    setOnboardingData((prev) => ({ ...prev, lab: selectedLab }))
    if (onNext) {
      onNext(selectedLab)
    } else {
      navigate('/auth/paso-2')
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
            currentStep={1}
            onStepClick={(step) => {
              if (step === 2 && onboardingData.lab) navigate('/auth/paso-2')
              if (step === 3 && onboardingData.username) navigate('/auth/paso-3')
            }}
          />
        </div>

        <DesktopCardHeader className="text-center mb-6">
          <DesktopCardTitle className="font-serif text-3xl font-bold text-primary tracking-tight">
            ¡Bienvenido!
          </DesktopCardTitle>
          <DesktopCardDescription className="text-sm sm:text-base text-[#4A4E4A] mt-2 max-w-lg mx-auto leading-relaxed">
            Antes de comenzar, escoge el laboratorio en el que será usada esta instancia del sistema:
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
                  name="desktop-lab-radio"
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
            onClick={handleContinue}
          >
            Continuar
          </Button>
        </DesktopCardFooter>
      </DesktopCard>
    </div>
  )
}

export default DesktopInicioPaso1Page
