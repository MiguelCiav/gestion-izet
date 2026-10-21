import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export interface BitacoraFormActionsProps {
  onVolver?: () => void
  onGuardar?: () => void
  isSubmitting?: boolean
  guardarLabel?: string
  volverLabel?: string
  className?: string
}

export function BitacoraFormActions({
  onVolver,
  isSubmitting = false,
  volverLabel = 'Volver',
  className,
}: BitacoraFormActionsProps) {
  return (
    <div className={cn('flex items-center gap-6 w-full pt-2', className)}>
      <Button
        type="button"
        variant="outline"
        size="lg"
        onClick={onVolver}
        disabled={isSubmitting}
        className="w-full"
      >
        {volverLabel}
      </Button>
    </div>
  )
}
