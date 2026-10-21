import * as React from 'react'
import { CheckIcon, MinusIcon, PlusIcon } from '@/assets/icons'
import { cn } from '@/lib/utils'

export interface StepperProps {
  /** Valor numérico actual (modo controlado) */
  value?: number
  /** Valor inicial (modo no controlado) */
  defaultValue?: number
  /** Callback cuando cambia el valor */
  onChange?: (value: number) => void
  /** Valor mínimo permitido (por defecto 0) */
  min?: number
  /** Valor máximo permitido (por defecto Infinity) */
  max?: number
  /** Incremento/decremento por paso (por defecto 1) */
  step?: number
  /** Deshabilita la interacción */
  disabled?: boolean
  /** Si es true, no permite escribir directamente en el campo central */
  readOnly?: boolean
  /**
   * Tamaño del stepper:
   * - 'lg': 224x96px exacto a COMPONENTE_STEPPER.svg (caja 96x96, botones 48x48)
   * - 'md': tamaño compacto (caja 64x64, botones 40x40)
   * - 'sm': tamaño pequeño (caja 48x48, botones 32x32)
   */
  size?: 'sm' | 'md' | 'lg'
  /** Nombre del campo para formularios */
  name?: string
  /** Identificador HTML */
  id?: string
  /** Clases CSS adicionales para el contenedor principal */
  className?: string
  /** Clases CSS adicionales para la caja central de número */
  inputClassName?: string
  /** Etiqueta accesible para el stepper */
  ariaLabel?: string
  /** Etiqueta accesible para el botón de decrementar */
  decrementAriaLabel?: string
  /** Etiqueta accesible para el botón de incrementar */
  incrementAriaLabel?: string
}

export const Stepper = React.forwardRef<HTMLInputElement, StepperProps>(
  (
    {
      value: controlledValue,
      defaultValue = 1,
      onChange,
      min = 0,
      max = Number.POSITIVE_INFINITY,
      step = 1,
      disabled = false,
      readOnly = false,
      size = 'lg',
      name,
      id,
      className,
      inputClassName,
      ariaLabel = 'Control de cantidad',
      decrementAriaLabel = 'Disminuir valor',
      incrementAriaLabel = 'Aumentar valor',
    },
    ref,
  ) => {
    const isControlled = controlledValue !== undefined
    const [uncontrolledValue, setUncontrolledValue] = React.useState<number>(defaultValue)

    const currentValue = isControlled ? controlledValue : uncontrolledValue
    const [inputText, setInputText] = React.useState<string>(String(currentValue))
    const [isFocused, setIsFocused] = React.useState<boolean>(false)

    React.useEffect(() => {
      if (!isFocused) {
        setInputText(String(currentValue))
      }
    }, [currentValue, isFocused])

    const clamp = (val: number): number => {
      if (Number.isNaN(val)) return min
      const clamped = Math.min(Math.max(val, min), max)
      return Number(clamped.toFixed(4))
    }

    const updateValue = (newValue: number) => {
      const clamped = clamp(newValue)
      if (!isControlled) {
        setUncontrolledValue(clamped)
      }
      setInputText(String(clamped))
      onChange?.(clamped)
    }

    const handleDecrement = () => {
      if (disabled || currentValue <= min) return
      updateValue(Number((currentValue - step).toFixed(4)))
    }

    const handleIncrement = () => {
      if (disabled || currentValue >= max) return
      updateValue(Number((currentValue + step).toFixed(4)))
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(',', '.')
      setInputText(raw)
      if (raw === '' || raw === '-' || raw === '.' || raw.endsWith('.')) {
        return
      }
      const parsed = Number(raw)
      if (!Number.isNaN(parsed)) {
        const clamped = clamp(parsed)
        if (!isControlled) {
          setUncontrolledValue(clamped)
        }
        onChange?.(clamped)
      }
    }

    const handleBlur = () => {
      setIsFocused(false)
      const parsed = Number(inputText.replace(',', '.'))
      if (inputText.trim() === '' || Number.isNaN(parsed)) {
        updateValue(min)
      } else {
        updateValue(parsed)
      }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (disabled) return
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        handleIncrement()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        handleDecrement()
      } else if (e.key === 'Home' && Number.isFinite(min)) {
        e.preventDefault()
        updateValue(min)
      } else if (e.key === 'End' && Number.isFinite(max)) {
        e.preventDefault()
        updateValue(max)
      }
    }

    const canDecrement = !disabled && currentValue > min
    const canIncrement = !disabled && currentValue < max

    // Dimensiones según COMPONENTE_STEPPER.svg
    const sizeConfig = {
      lg: {
        container: 'h-24 gap-4', // 96px total height, gap 16px (224px total width)
        button: 'w-12 h-12', // 48x48px circle
        icon: 'w-6 h-6',
        box: 'w-24 h-24 rounded-[16px]', // 96x96px rx=16
        text: 'text-3xl md:text-4xl',
      },
      md: {
        container: 'h-16 gap-3',
        button: 'w-10 h-10', // 40x40px
        icon: 'w-5 h-5',
        box: 'w-16 h-16 rounded-[12px]',
        text: 'text-2xl',
      },
      sm: {
        container: 'h-12 gap-2',
        button: 'w-8 h-8', // 32x32px
        icon: 'w-4 h-4',
        box: 'w-12 h-12 rounded-[8px]',
        text: 'text-lg',
      },
    }[size]

    return (
      <div
        className={cn(
          'inline-flex items-center justify-center select-none',
          sizeConfig.container,
          disabled && 'opacity-60 cursor-not-allowed',
          className,
        )}
        role="group"
        aria-label={ariaLabel}
      >
        {/* Botón Decrementar (-) basado en rect 48x48 rx=24 fill="#4A7C59" */}
        <button
          type="button"
          onClick={handleDecrement}
          disabled={!canDecrement}
          aria-label={decrementAriaLabel}
          className={cn(
            'flex items-center justify-center shrink-0 rounded-full',
            'bg-primary text-[#FAF6F0]',
            'transition-all duration-150',
            'hover:bg-primary-hover active:scale-95',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
            !canDecrement && 'opacity-40 cursor-not-allowed active:scale-100 pointer-events-none',
            sizeConfig.button,
          )}
        >
          <MinusIcon className={sizeConfig.icon} />
        </button>

        {/* Caja central numérica basada en rect 96x96 rx=16 border 2px #4A4E4A fill=white */}
        <div
          className={cn(
            'relative flex items-center justify-center bg-white',
            'border-2 border-[#4A4E4A]',
            'shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]',
            sizeConfig.box,
            inputClassName,
          )}
        >
          <input
            ref={ref}
            id={id}
            name={name}
            type="number"
            inputMode="decimal"
            value={isFocused ? inputText : currentValue}
            onFocus={() => {
              setIsFocused(true)
              setInputText(String(currentValue))
            }}
            onBlur={handleBlur}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            min={min}
            max={max}
            step="any"
            disabled={disabled}
            readOnly={readOnly}
            aria-valuenow={currentValue}
            aria-valuemin={Number.isFinite(min) ? min : undefined}
            aria-valuemax={Number.isFinite(max) ? max : undefined}
            className={cn(
              'w-full h-full bg-transparent text-center font-serif font-medium text-[#181C1B]',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:rounded-[14px]',
              '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
              readOnly && 'cursor-default',
              sizeConfig.text,
            )}
          />
        </div>

        {/* Botón Incrementar (+) basado en rect 48x48 rx=24 fill="#4A7C59" */}
        <button
          type="button"
          onClick={handleIncrement}
          disabled={!canIncrement}
          aria-label={incrementAriaLabel}
          className={cn(
            'flex items-center justify-center shrink-0 rounded-full',
            'bg-primary text-[#FAF6F0]',
            'transition-all duration-150',
            'hover:bg-primary-hover active:scale-95',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
            !canIncrement && 'opacity-40 cursor-not-allowed active:scale-100 pointer-events-none',
            sizeConfig.button,
          )}
        >
          <PlusIcon className={sizeConfig.icon} />
        </button>
      </div>
    )
  },
)

Stepper.displayName = 'Stepper'

/**
 * Componente complementario para flujos de pasos secuenciales (Wizard / Step Flow),
 * con barra continua institucional, círculos con checkmark y etiquetas inferiores
 * fiel a las especificaciones vectoriales de Figma (INICIO_PASO_1/2/3).
 */
export interface StepItem {
  id?: string | number
  title: string
  description?: string
}

export interface StepIndicatorProps {
  steps: StepItem[]
  currentStep: number
  onStepClick?: (stepIndex: number) => void
  className?: string
}

export function StepIndicator({
  steps,
  currentStep,
  onStepClick,
  className,
}: StepIndicatorProps) {
  const total = steps.length
  const progressPercent =
    currentStep >= total
      ? 100
      : currentStep <= 1 && total === 3
        ? 18
        : Math.max(10, Math.min(100, Math.round(((currentStep - 0.5) / Math.max(1, total)) * 100)))

  return (
    <nav aria-label="Progreso de pasos" className={cn('w-full select-none', className)}>
      <div className="relative w-full">
        {/* Línea base completa (#655D52) */}
        <div className="absolute top-3 left-0 right-0 h-1 bg-[#655D52] rounded-full -translate-y-1/2" />

        {/* Línea activa verde (#4A7C59 / bg-primary) */}
        <div
          className="absolute top-3 left-0 h-1 bg-primary rounded-full -translate-y-1/2 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />

        {/* Círculos y etiquetas de pasos */}
        <ol className="relative flex items-start justify-around w-full">
          {steps.map((step, index) => {
            const stepNumber = index + 1
            const isCompleted = stepNumber <= currentStep

            return (
              <li
                key={step.id ?? index}
                className="flex flex-col items-center z-10"
              >
                <button
                  type="button"
                  disabled={!onStepClick}
                  onClick={() => onStepClick?.(stepNumber)}
                  className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ring-4 ring-[#FAF6F0]',
                    isCompleted
                      ? 'bg-primary text-white'
                      : 'bg-[#655D52] text-transparent',
                    onStepClick && 'cursor-pointer hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                  )}
                  aria-current={stepNumber === currentStep ? 'step' : undefined}
                  aria-label={`Paso ${stepNumber}: ${step.title}`}
                >
                  {isCompleted ? (
                    <CheckIcon className="w-3.5 h-3.5 stroke-[3]" />
                  ) : null}
                </button>

                <span
                  className={cn(
                    'mt-2 text-xs text-center font-sans font-medium text-[#4A4E4A] max-w-[90px]',
                  )}
                >
                  {step.title}
                </span>
              </li>
            )
          })}
        </ol>
      </div>
    </nav>
  )
}

export default Stepper
