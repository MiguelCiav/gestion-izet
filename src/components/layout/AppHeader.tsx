import * as React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SettingsIcon } from '@/assets/icons'
import logoImg from '@/assets/LOGO.png'
import { useAuth } from '@/features/auth/hooks'
import { LABORATORIOS_INFO } from '@/lib/izetService'
import { cn } from '@/lib/utils'

export interface AppHeaderProps extends React.HTMLAttributes<HTMLElement> {
  onSettingsClick?: () => void
  settingsHref?: string
  logoHref?: string
  logoSrc?: string
  rightContent?: React.ReactNode
}

export function AppHeader({
  className,
  onSettingsClick,
  settingsHref,
  logoHref,
  logoSrc,
  rightContent,
  ...props
}: AppHeaderProps) {
  const navigate = useNavigate()
  const { user, activeLab, setActiveLab, logout } = useAuth()
  const [menuOpen, setMenuOpen] = React.useState(false)

  const isAdmin = user?.rol === 'admin'
  const resolvedLogoHref = logoHref ?? (isAdmin ? '/dashboard' : '/consumo')

  const handleSettings = () => {
    if (onSettingsClick) {
      onSettingsClick()
    } else if (settingsHref) {
      navigate(settingsHref)
    } else {
      setMenuOpen((prev) => !prev)
    }
  }

  const handleLogout = async () => {
    setMenuOpen(false)
    await logout()
    navigate('/login')
  }

  return (
    <header
      className={cn(
        'relative w-full max-w-[412px] mx-auto h-16 flex items-center justify-between px-6 pt-2 select-none',
        className,
      )}
      {...props}
    >
      {/* Logotipo Oficial */}
      <Link
        to={resolvedLogoHref}
        className="flex items-center gap-2 hover:opacity-90 transition-opacity select-none group"
        aria-label="Gestión IZET - Ir al inicio"
      >
        <img
          src={logoSrc ?? logoImg}
          alt="Logo IZET"
          className="w-8 h-8 object-contain drop-shadow-sm shrink-0 transition-transform duration-150 group-hover:scale-105"
        />
        <span className="font-serif text-[22px] font-bold text-primary tracking-tight">
          IZET
        </span>
      </Link>

      {/* Configuración y sesión (Selector de laboratorio solo para administrador) */}
      <div className="flex items-center gap-2">
        {isAdmin && (
          <div
            role="group"
            aria-label="Cambiar laboratorio activo"
            className="inline-flex items-center rounded-full border border-[#655D52]/30 bg-white p-0.5"
          >
            {(['LEPA', 'LEM'] as const).map((lab) => (
              <button
                key={lab}
                type="button"
                onClick={() => setActiveLab(lab)}
                className={cn(
                  'px-2.5 py-0.5 rounded-full text-[11px] font-sans font-bold transition-colors cursor-pointer',
                  activeLab === lab
                    ? 'bg-[#4A7C59] text-white'
                    : 'text-[#4A4E4A] hover:text-[#181C1B]',
                )}
              >
                {lab}
              </button>
            ))}
          </div>
        )}

        {rightContent ? (
          rightContent
        ) : settingsHref ? (
          <Link
            to={settingsHref}
            className="p-2 -mr-2 text-[#414942] hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full"
            aria-label="Configuración"
          >
            <SettingsIcon className="w-5 h-5" />
          </Link>
        ) : (
          <button
            type="button"
            onClick={handleSettings}
            className="p-2 -mr-2 text-[#414942] hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full cursor-pointer"
            aria-label="Perfil y sesión"
            title="Perfil y sesión"
          >
            <SettingsIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Menú desplegable de perfil y cierre de sesión (sin correo ficticio @izet.ucv.ve) */}
      {menuOpen && (
        <div className="absolute right-6 top-14 z-50 w-64 rounded-2xl bg-white border border-[#655D52]/30 shadow-lg p-4 space-y-3 animate-in fade-in duration-150">
          <div className="border-b border-[#655D52]/15 pb-2.5">
            <p className="font-sans text-xs font-bold uppercase tracking-wider text-primary">
              {LABORATORIOS_INFO[activeLab].nombre} ({activeLab})
            </p>
            <p className="font-sans text-sm font-semibold text-[#181C1B] mt-1 truncate">
              {user?.username || 'Personal de Laboratorio'}
            </p>
            <p className="font-sans text-xs text-[#655D52] truncate">
              {isAdmin ? 'Administrador' : 'Investigador'}
              {user?.cedula ? ` • ${user.cedula}` : ''}
            </p>
          </div>
          <button
            type="button"
            onClick={() => void handleLogout()}
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-sans font-bold text-[#B83230] hover:bg-[#FFDAD6]/30 transition-colors cursor-pointer"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </header>
  )
}

export default AppHeader
