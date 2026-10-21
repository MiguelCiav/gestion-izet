import * as React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  ArchiveBoxIcon,
  ArrowsLeftRightIcon,
  ClipboardListIcon,
  DashboardBlocksIcon,
  FlaskIcon,
  SettingsIcon,
} from '@/assets/icons'
import logoImg from '@/assets/LOGO.png'
import { useAuth } from '@/features/auth/hooks'
import { cn } from '@/lib/utils'

export interface DesktopSidebarItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }> | React.ReactNode
  href?: string
  badge?: string | number
  disabled?: boolean
  onClick?: () => void
}

export interface DesktopSidebarProps extends React.HTMLAttributes<HTMLElement> {
  items?: DesktopSidebarItem[]
  activeId?: string
  defaultActiveId?: string
  onItemChange?: (id: string, item: DesktopSidebarItem) => void
  labLabel?: string
  logoHref?: string
  logoSrc?: string
  showActionButton?: boolean
  actionLabel?: string
  onActionClick?: () => void
  actionHref?: string
  actionButton?: React.ReactNode
  onLogoutClick?: () => void
  onSettingsClick?: () => void
  settingsHref?: string
  settingsLabel?: string
  logoutLabel?: string
  footerAction?: 'settings' | 'logout' | 'both'
  footerContent?: React.ReactNode
  className?: string
}

export const DEFAULT_SIDEBAR_ITEMS: DesktopSidebarItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: DashboardBlocksIcon,
    href: '/dashboard',
  },
  {
    id: 'inventario',
    label: 'Inventario',
    icon: ArchiveBoxIcon,
    href: '/inventario',
  },
  {
    id: 'bitacora',
    label: 'Bitácora',
    icon: ClipboardListIcon,
    href: '/bitacora',
  },
  {
    id: 'prestamos',
    label: 'Préstamos',
    icon: ArrowsLeftRightIcon,
    href: '/prestamos',
  },
]

const USER_SIDEBAR_ITEMS: DesktopSidebarItem[] = [
  {
    id: 'consumo',
    label: 'Consumos',
    icon: FlaskIcon,
    href: '/consumo',
  },
  {
    id: 'prestamos',
    label: 'Préstamos',
    icon: ArrowsLeftRightIcon,
    href: '/prestamos/solicitar',
  },
]

function LogoutIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M5 21C4.45 21 3.979 20.804 3.588 20.413C3.196 20.021 3 19.55 3 19V5C3 4.45 3.196 3.979 3.588 3.587C3.979 3.196 4.45 3 5 3H12V5H5V19H12V21H5ZM16 17L14.6 15.55L17.15 13H9V11H17.15L14.6 8.45L16 7L21 12L16 17Z" />
    </svg>
  )
}

function renderIcon(
  IconComponent: React.ComponentType<{ className?: string }> | React.ReactNode,
  isActive: boolean,
) {
  const iconClasses = cn(
    'w-5 h-5 flex-shrink-0 transition-colors duration-150',
    isActive ? 'text-white' : 'text-[#655D52] group-hover:text-primary',
  )

  if (React.isValidElement(IconComponent)) {
    return React.cloneElement(
      IconComponent as React.ReactElement<{ className?: string }>,
      {
        className: cn(iconClasses, (IconComponent.props as { className?: string }).className),
      },
    )
  }

  if (typeof IconComponent === 'function') {
    const Component = IconComponent as React.ComponentType<{ className?: string }>
    return <Component className={iconClasses} />
  }

  return null
}

export const DesktopSidebar = React.forwardRef<HTMLElement, DesktopSidebarProps>(
  (
    {
      items,
      activeId: controlledActiveId,
      defaultActiveId = 'dashboard',
      onItemChange,
      labLabel,
      logoHref,
      logoSrc,
      showActionButton = true,
      actionLabel = 'Registrar consumo',
      onActionClick,
      actionHref = '/consumo',
      actionButton,
      onLogoutClick,
      onSettingsClick,
      settingsHref = '/settings',
      settingsLabel = 'Configuración',
      logoutLabel = 'Cerrar sesión',
      footerAction,
      footerContent,
      className,
      ...props
    },
    ref,
  ) => {
    const location = useLocation()
    const navigate = useNavigate()
    const { user, activeLab, logout } = useAuth()

    const isAdmin = user?.rol === 'admin'
    const resolvedItems = items ?? (isAdmin ? DEFAULT_SIDEBAR_ITEMS : USER_SIDEBAR_ITEMS)
    const resolvedLabLabel = labLabel ?? activeLab
    const resolvedLogoHref = logoHref ?? (isAdmin ? '/dashboard' : '/consumo')

    const isControlled = controlledActiveId !== undefined
    const [uncontrolledActiveId, setUncontrolledActiveId] = React.useState<string>(defaultActiveId)

    const activeFromPath = React.useMemo(() => {
      const currentPath = location.pathname
      if (!isAdmin && currentPath.startsWith('/consumo')) return 'consumo'
      if (!isAdmin && currentPath.startsWith('/prestamos')) return 'prestamos'
      const matched = resolvedItems.find((item) => {
        if (!item.href) return false
        if (item.href === '/') return currentPath === '/'
        return currentPath === item.href || currentPath.startsWith(`${item.href}/`)
      })
      return matched?.id
    }, [resolvedItems, location.pathname, isAdmin])

    const currentActiveId =
      !isAdmin && activeFromPath
        ? activeFromPath
        : (controlledActiveId ?? activeFromPath ?? uncontrolledActiveId)

    const handleItemClick = (item: DesktopSidebarItem) => {
      if (item.disabled) return
      if (!isControlled) {
        setUncontrolledActiveId(item.id)
      }
      item.onClick?.()
      onItemChange?.(item.id, item)
      if (item.href && !item.onClick) {
        navigate(item.href)
      }
    }

    const handleActionClick = () => {
      if (onActionClick) {
        onActionClick()
      } else if (actionHref) {
        navigate(actionHref)
      }
    }

    const handleSettingsClick = () => {
      if (onSettingsClick) {
        onSettingsClick()
      } else if (settingsHref) {
        navigate(settingsHref)
      }
    }

    const handleLogoutClick = async () => {
      if (onLogoutClick) {
        onLogoutClick()
      } else {
        await logout()
        navigate('/login')
      }
    }

    let shouldShowSettings = false
    let shouldShowLogout = true

    if (footerAction === 'both') {
      shouldShowSettings = isAdmin
      shouldShowLogout = true
    } else if (footerAction === 'logout') {
      shouldShowLogout = true
    } else if (footerAction === 'settings') {
      shouldShowSettings = isAdmin
    }

    return (
      <aside
        ref={ref}
        aria-label="Navegación de escritorio"
        className={cn(
          'w-[206px] min-w-[206px] max-w-[206px] h-full min-h-screen',
          'bg-[#FAF6F0] border-r border-[#655D52]/40',
          'flex flex-col justify-between py-7 select-none flex-shrink-0',
          className,
        )}
        {...props}
      >
        <div>
          {/* Logotipo e Insignia de Laboratorio */}
          <div className="px-5 mb-8">
            <div className="pl-3">
              <Link
                to={resolvedLogoHref}
                className="flex items-center gap-2.5 hover:opacity-90 transition-opacity select-none group"
                aria-label="Gestión IZET - Ir al inicio"
              >
                <img
                  src={logoSrc ?? logoImg}
                  alt="Logo IZET"
                  className="w-9 h-9 object-contain drop-shadow-sm shrink-0 transition-transform duration-150 group-hover:scale-105"
                />
                <span className="font-serif text-[22px] font-bold text-primary tracking-tight">
                  IZET
                </span>
              </Link>
              <div
                className="mt-2.5 inline-flex items-center justify-between min-w-[56px] h-[19px] rounded-full border border-[#4A4E4A] px-2 gap-1.5"
                role="status"
                aria-label={`Laboratorio activo: ${resolvedLabLabel}`}
              >
                <span className="font-sans text-[11px] font-medium text-[#4A4E4A] leading-none select-none">
                  {resolvedLabLabel}
                </span>
                <span
                  className="w-1.5 h-1.5 rounded-full bg-[#4A7C59] flex-shrink-0"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>

          {/* Elementos de Navegación */}
          <nav aria-label="Menú principal" className="flex flex-col gap-3.5 px-5">
            {resolvedItems.map((item) => {
              const isActive = item.id === currentActiveId

              return (
                <button
                  key={item.id}
                  type="button"
                  disabled={item.disabled}
                  onClick={() => handleItemClick(item)}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'w-full h-[39px] px-4 rounded-full font-medium text-sm flex items-center gap-3 transition-colors duration-150 select-none text-left cursor-pointer group',
                    isActive
                      ? 'bg-[#4A7C59] text-white shadow-none'
                      : 'text-[#655D52] hover:text-primary hover:bg-primary/5',
                    item.disabled &&
                      'opacity-50 cursor-not-allowed hover:bg-transparent hover:text-[#655D52]',
                  )}
                >
                  {renderIcon(item.icon, isActive)}
                  <span className="truncate flex-1 font-sans">{item.label}</span>
                  {item.badge !== undefined && (
                    <span
                      className={cn(
                        'ml-auto text-xs px-2 py-0.5 rounded-full font-semibold',
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-primary/10 text-primary',
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>

          {/* Botón de Acción Rápida (CTA) solo para admin cuando 'Consumos' no está como ítem directo */}
          {showActionButton && isAdmin && (
            <div className="mt-5 px-5">
              {actionButton ? (
                actionButton
              ) : (
                <button
                  type="button"
                  onClick={handleActionClick}
                  className="w-full h-[39px] rounded-full bg-[#4A7C59] hover:bg-primary-hover text-white text-xs font-semibold tracking-wide flex items-center justify-center transition-colors cursor-pointer shadow-none select-none"
                >
                  {actionLabel}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Sección Inferior: Footer / Cerrar Sesión */}
        <div className="px-5 pt-4 mt-auto">
          {footerContent ? (
            footerContent
          ) : (
            <div className="flex flex-col gap-2 w-full">
              {shouldShowSettings && (
                <button
                  type="button"
                  onClick={handleSettingsClick}
                  className="w-full h-[39px] px-4 rounded-full text-[#655D52] hover:text-primary hover:bg-primary/5 flex items-center gap-3 font-medium text-sm transition-colors duration-150 select-none group cursor-pointer text-left"
                >
                  <SettingsIcon className="w-5 h-5 flex-shrink-0 text-[#655D52] group-hover:text-primary transition-colors" />
                  <span className="truncate flex-1 font-sans">{settingsLabel}</span>
                </button>
              )}

              {shouldShowLogout && (
                <button
                  type="button"
                  onClick={() => void handleLogoutClick()}
                  className="w-full h-[39px] px-4 rounded-full text-[#655D52] hover:text-alert-danger-border hover:bg-alert-danger-bg/50 flex items-center gap-3 font-medium text-sm transition-colors duration-150 select-none group cursor-pointer text-left"
                >
                  <LogoutIcon className="w-5 h-5 flex-shrink-0 text-[#655D52] group-hover:text-alert-danger-border transition-colors" />
                  <span className="truncate flex-1 font-sans">{logoutLabel}</span>
                </button>
              )}
            </div>
          )}
        </div>
      </aside>
    )
  },
)

DesktopSidebar.displayName = 'DesktopSidebar'
