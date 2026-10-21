import { Button } from '@/components/ui/Button'
import type { LabOption } from '../types'

export interface StepConfirmacionProps {
  lab?: LabOption | string
  onLoginClick: () => void
  isLoading?: boolean
}

export function StepConfirmacion({
  lab = '<laboratorio>',
  onLoginClick,
  isLoading = false,
}: StepConfirmacionProps) {
  return (
    <div className="w-full space-y-6">
      <p className="font-sans text-base text-[#4A4E4A] leading-relaxed text-left">
        Ya el sistema para el laboratorio <strong className="font-semibold text-text-main">{lab}</strong> está configurado, puedes iniciar sesión:
      </p>

      <div className="pt-2">
        <Button
          type="button"
          size="lg"
          fullWidth
          disabled={isLoading}
          onClick={onLoginClick}
        >
          Iniciar Sesión
        </Button>
      </div>
    </div>
  )
}
