import { Button } from '@/components/ui/Button'
import type { LabOption } from '../types'

export interface StepLaboratorioProps {
  selectedLab?: LabOption
  onSelectLab: (lab: LabOption) => void
  isLoading?: boolean
}

export function StepLaboratorio({
  selectedLab,
  onSelectLab,
  isLoading = false,
}: StepLaboratorioProps) {
  return (
    <div className="w-full space-y-6">
      <p className="font-sans text-base text-[#4A4E4A] leading-relaxed text-left">
        Antes de comenzar, escoge el laboratorio en el que será usada esta instancia del sistema:
      </p>

      <div className="space-y-4 pt-2">
        <Button
          type="button"
          size="lg"
          fullWidth
          disabled={isLoading}
          onClick={() => onSelectLab('LEPA')}
          title="Laboratorio de Ecología de Plantas Acuáticas (LEPA)"
          className={selectedLab === 'LEPA' ? 'ring-2 ring-primary ring-offset-2' : ''}
        >
          LEPA
        </Button>

        <Button
          type="button"
          size="lg"
          fullWidth
          disabled={isLoading}
          onClick={() => onSelectLab('LEM')}
          title="Laboratorio de Ecología de Microorganismos (LEM)"
          className={selectedLab === 'LEM' ? 'ring-2 ring-primary ring-offset-2' : ''}
        >
          LEM
        </Button>
      </div>
    </div>
  )
}
