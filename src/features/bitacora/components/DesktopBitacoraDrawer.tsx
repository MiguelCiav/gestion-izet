import * as React from 'react'
import { cn } from '@/lib/utils'
import { RomboBadge } from '@/components/ui/RomboBadge'
import type { ReactivoSummary } from '../types'

export interface DesktopBitacoraDrawerProps {
  /** Indica si el panel drawer está abierto */
  isOpen: boolean
  /** Callback para cerrar el drawer (backdrop o botón volver) */
  onClose: () => void
  /** Información del reactivo mostrado en la cabecera del drawer */
  reactivo?: ReactivoSummary
  /** Título alternativo si no hay reactivo */
  title?: string
  /** Subtítulo o código alternativo */
  subtitle?: string
  /** Contenido del formulario dentro del drawer */
  children: React.ReactNode
  /** Clases CSS adicionales para el contenedor del drawer */
  className?: string
  /** Acciones al pie del formulario (ej. botones Volver y Guardar) */
  actions?: React.ReactNode
}

/**
 * DesktopBitacoraDrawer - Panel lateral deslizante (Drawer / Modal lateral)
 *
 * Basado fielmente en los diseños oficiales:
 * - `BITACORA _ AJUSTE.svg`
 * - `BITACORA _ CONSUMO.svg`
 * - `BITACORA _ PRÉSTAMO.svg`
 *
 * Características:
 * - Superposición difuminada con efecto blur (`bg-black/40 backdrop-blur-sm`)
 * - Panel lateral derecho de ancho exacto (`max-w-[534px]`) con fondo institucional `#FAF6F0`
 * - Cabecera con Nombre en serif institucional, código de reactivo y Rombo NFPA 704
 * - Contenedor scrollable para campos de formulario y botones de acción al pie
 */
export const DesktopBitacoraDrawer: React.FC<DesktopBitacoraDrawerProps> = ({
  isOpen,
  onClose,
  reactivo,
  title,
  subtitle,
  children,
  className,
  actions,
}) => {
  // Manejo de tecla Escape para accesibilidad
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Bloqueo de scroll global cuando el drawer está abierto
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const resolvedName = reactivo?.name ?? title ?? 'Reactivo'
  const resolvedCode = reactivo?.code ?? subtitle ?? ''

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={resolvedName}
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* Telón de fondo con desenfoque (backdrop blur) fiel a Figma */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ease-out"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel lateral deslizante derecho */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10 pointer-events-none">
        <div
          className={cn(
            'pointer-events-auto w-screen max-w-[534px] bg-[#FAF6F0]',
            'border-l border-[#655D52]/30 shadow-2xl flex flex-col justify-between',
            'p-8 md:p-12 overflow-y-auto transition-transform duration-300 ease-out',
            className,
          )}
        >
          {/* Cabecera del Reactivo: Nombre, Código y Rombo NFPA 704 */}
          <div className="w-full flex items-start justify-between gap-4 mb-6 pb-2">
            <div className="flex-1 min-w-0 pr-2">
              <h2 className="font-serif text-[28px] md:text-[32px] font-bold text-[#181C1B] leading-tight break-words">
                {resolvedName}
              </h2>
              {resolvedCode && (
                <p className="font-sans text-sm text-[#655D52] font-medium mt-1">
                  {resolvedCode}
                </p>
              )}
            </div>

            {/* Rombo NFPA 704 institucional */}
            <div className="shrink-0 pt-1">
              <RomboBadge
                salud={reactivo?.salud ?? 2}
                inflamabilidad={reactivo?.inflamabilidad ?? 1}
                reactividad={reactivo?.reactividad ?? 0}
                especial={reactivo?.especial ?? ''}
                size={80}
              />
            </div>
          </div>

          {/* Formulario / Campos dinámicos */}
          <div className="flex-1 flex flex-col space-y-4 md:space-y-5">
            {children}
          </div>

          {/* Botones de acción al pie */}
          {actions && <div className="mt-8 pt-4">{actions}</div>}
        </div>
      </div>
    </div>
  )
}
