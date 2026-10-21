import * as React from 'react'
import { cn } from '@/lib/utils'

export type DesktopProfileIconSize = 'sm' | 'default' | 'lg'

export interface DesktopProfileInstitutionalIconProps
  extends React.SVGProps<SVGSVGElement> {
  size?: DesktopProfileIconSize
}

/**
 * Ícono institucional oficial extraído del diseño SVG de Desktop (NAVBAR.svg).
 * Representa la silueta estilizada de usuario con trazo verde (#4A7C59).
 */
export function DesktopProfileInstitutionalIcon({
  className,
  size = 'default',
  ...props
}: DesktopProfileInstitutionalIconProps) {
  const iconDimensions: Record<DesktopProfileIconSize, string> = {
    sm: 'w-8 h-8',
    default: 'w-10 h-10',
    lg: 'w-12 h-12',
  }

  return (
    <svg
      viewBox="85.216 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0 text-[#4A7C59]', iconDimensions[size], className)}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M118.549 35V31.6667C118.549 29.8986 117.847 28.2029 116.597 26.9526C115.347 25.7024 113.651 25 111.883 25H98.5495C96.7814 25 95.0857 25.7024 93.8354 26.9526C92.5852 28.2029 91.8828 29.8986 91.8828 31.6667V35M111.883 11.6667C111.883 15.3486 108.898 18.3333 105.216 18.3333C101.534 18.3333 98.5495 15.3486 98.5495 11.6667C98.5495 7.98477 101.534 5 105.216 5C108.898 5 111.883 7.98477 111.883 11.6667Z"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export interface DesktopProfileIconProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Nombre de usuario a mostrar en la parte izquierda.
   * @default "John Doe"
   */
  name?: string
  /**
   * Rol o cargo del usuario (ej: "Administrador", "Docente", "Laboratorista").
   * Se muestra como texto secundario debajo del nombre.
   */
  role?: string
  /**
   * Correo electrónico institucional del usuario.
   * Se muestra como texto secundario si no se especifica rol.
   */
  email?: string
  /**
   * URL de la imagen de avatar del usuario.
   * Si no se especifica o falla la carga, se renderiza el ícono institucional.
   */
  avatarUrl?: string
  /**
   * Callback invocado al hacer clic en el componente.
   * Al proveerse, añade accesibilidad interactiva (role="button", tabIndex=0).
   */
  onClick?: () => void
  /**
   * Determina si se visualiza el texto del nombre en el lateral izquierdo.
   * @default true
   */
  showName?: boolean
  /**
   * Tamaño del componente.
   * - sm: 32px de altura
   * - default: 40px de altura (referencia oficial del navbar 126x40px)
   * - lg: 48px de altura
   * @default "default"
   */
  size?: DesktopProfileIconSize
  /**
   * Clases CSS adicionales.
   */
  className?: string
}

/**
 * Componente de perfil para el Navbar de Desktop de Gestión IZET.
 * Basado en la especificación de diseño oficial `src/DESKTOP_PROFILE_ICON/NAVBAR.svg`.
 * 
 * - Izquierda: Nombre de usuario en tipografía Sans (`font-sans font-medium text-sm text-[#181C1B]`).
 * - Derecha: Ícono de usuario con trazo verde institucional `#4A7C59` o avatar fotográfico.
 */
export const DesktopProfileIcon = React.forwardRef<
  HTMLDivElement,
  DesktopProfileIconProps
>(
  (
    {
      name = 'John Doe',
      role,
      email,
      avatarUrl,
      onClick,
      showName = true,
      size = 'default',
      className,
      role: roleProp,
      tabIndex: tabIndexProp,
      onKeyDown: onKeyDownProp,
      ...props
    },
    ref,
  ) => {
    const [failedAvatarUrl, setFailedAvatarUrl] = React.useState<string | null>(null)

    const isClickable = Boolean(onClick)
    const subtitleText = role || email
    const hasValidAvatar = Boolean(avatarUrl && failedAvatarUrl !== avatarUrl)

    const containerSizeClasses: Record<DesktopProfileIconSize, string> = {
      sm: 'h-8 gap-2',
      default: 'h-10 gap-3',
      lg: 'h-12 gap-3.5',
    }

    const nameSizeClasses: Record<DesktopProfileIconSize, string> = {
      sm: 'text-xs',
      default: 'text-sm',
      lg: 'text-base',
    }

    const subtitleSizeClasses: Record<DesktopProfileIconSize, string> = {
      sm: 'text-[10px]',
      default: 'text-xs',
      lg: 'text-xs',
    }

    const avatarBoxSizes: Record<DesktopProfileIconSize, string> = {
      sm: 'w-8 h-8',
      default: 'w-10 h-10',
      lg: 'w-12 h-12',
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault()
        onClick?.()
      }
      onKeyDownProp?.(e)
    }

    return (
      <div
        ref={ref}
        role={roleProp ?? (isClickable ? 'button' : undefined)}
        tabIndex={tabIndexProp ?? (isClickable ? 0 : undefined)}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        aria-label={props['aria-label'] || (isClickable ? `Perfil de ${name}` : undefined)}
        className={cn(
          'relative inline-flex items-center justify-end select-none transition-all duration-150',
          containerSizeClasses[size],
          isClickable &&
            'cursor-pointer rounded-lg p-1 -m-1 hover:bg-black/[0.04] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          className,
        )}
        {...props}
      >
        {/* Lateral Izquierdo: Información del usuario */}
        {showName ? (
          <div className="flex flex-col items-end text-right justify-center leading-tight min-w-0">
            <span
              className={cn(
                'font-sans font-medium text-[#181C1B] truncate max-w-[200px]',
                nameSizeClasses[size],
              )}
            >
              {name}
            </span>
            {subtitleText ? (
              <span
                className={cn(
                  'font-sans text-text-muted truncate max-w-[200px] mt-0.5',
                  subtitleSizeClasses[size],
                )}
              >
                {subtitleText}
              </span>
            ) : null}
          </div>
        ) : (
          <span className="sr-only">{name}</span>
        )}

        {/* Lateral Derecho: Avatar / Ícono institucional */}
        {hasValidAvatar ? (
          <div
            className={cn(
              'relative shrink-0 rounded-full overflow-hidden flex items-center justify-center bg-primary-light/40 border border-[#4A7C59]/30 select-none',
              avatarBoxSizes[size],
            )}
          >
            <img
              src={avatarUrl}
              alt={name}
              onError={() => {
                if (avatarUrl) {
                  setFailedAvatarUrl(avatarUrl)
                }
              }}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        ) : (
          <div
            className={cn(
              'shrink-0 flex items-center justify-center select-none',
              avatarBoxSizes[size],
            )}
          >
            <DesktopProfileInstitutionalIcon size={size} />
          </div>
        )}
      </div>
    )
  },
)

DesktopProfileIcon.displayName = 'DesktopProfileIcon'

export default DesktopProfileIcon
