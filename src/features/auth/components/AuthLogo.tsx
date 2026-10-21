import * as React from 'react'
import logoImg from '@/assets/LOGO.png'
import { cn } from '@/lib/utils'

export interface AuthLogoProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  size?: number
  imgClassName?: string
}

/**
 * Componente oficial de Logotipo Institucional para el flujo de autenticación y bienvenida.
 * Utiliza el emblema oficial de Gestión IZET (src/assets/LOGO.png).
 */
export function AuthLogo({
  className,
  size = 128,
  style,
  imgClassName,
  ...props
}: AuthLogoProps) {
  return (
    <div
      role="img"
      aria-label="Logo Institucional IZET"
      className={cn(
        'relative inline-flex items-center justify-center select-none',
        className,
      )}
      style={{ width: `${size}px`, height: `${size}px`, ...style }}
      {...props}
    >
      <img
        src={logoImg}
        alt="Logo Institucional IZET"
        width={size}
        height={size}
        className={cn(
          'w-full h-full object-contain drop-shadow-md transition-transform duration-200 hover:scale-105 pointer-events-none',
          imgClassName,
        )}
      />
    </div>
  )
}

export default AuthLogo
