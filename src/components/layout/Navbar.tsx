import * as React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  ArchiveBoxIcon,
  ArrowsLeftRightIcon,
  ClipboardListIcon,
  DashboardBlocksIcon,
  FlaskIcon,
} from '@/assets/icons'
import { useAuth } from '@/features/auth/hooks'
import { cn } from '@/lib/utils'

export interface NavItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }> | React.ReactNode
  href?: string
  badge?: string | number
  disabled?: boolean
  onClick?: () => void
}

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  items?: NavItem[]
  activeId?: string
  defaultActiveId?: string
  onItemChange?: (id: string, item: NavItem) => void
  fixed?: boolean
  containerClassName?: string
}

export const DEFAULT_NAV_ITEMS: NavItem[] = [
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
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: DashboardBlocksIcon,
    href: '/dashboard',
  },
]

const USER_NAV_ITEMS: NavItem[] = [
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
    href: '/prestamos',
  },
]

export const Navbar = React.forwardRef<HTMLElement, NavbarProps>(
  (
    {
      items,
      activeId: controlledActiveId,
      defaultActiveId = 'inventario',
      onItemChange,
      fixed = false,
      className,
      containerClassName,
      ...props
    },
    ref,
  ) => {
    const navigate = useNavigate()
    const location = useLocation()
    const { user } = useAuth()
    const isAdmin = user?.rol === 'admin'

    const resolvedItems = items ?? (isAdmin ? DEFAULT_NAV_ITEMS : USER_NAV_ITEMS)

    const isControlled = controlledActiveId !== undefined
    const [uncontrolledActiveId, setUncontrolledActiveId] = React.useState<string>(defaultActiveId)

    const activeFromPath = React.useMemo(() => {
      const currentPath = location.pathname
      const matched = resolvedItems.find((item) => {
        if (!item.href) return false
        if (item.href === '/') return currentPath === '/'
        return currentPath === item.href || currentPath.startsWith(`${item.href}/`)
      })
      return matched?.id
    }, [location.pathname, resolvedItems])

    const currentActiveId = isControlled
      ? controlledActiveId
      : (activeFromPath ?? uncontrolledActiveId)

    const handleItemClick = (item: NavItem) => {
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

    const renderIcon = (
      IconComponent: React.ComponentType<{ className?: string }> | React.ReactNode,
      isActive: boolean,
    ) => {
      const iconClasses = cn(
        'w-5 h-5 transition-colors duration-150',
        isActive ? 'text-primary' : 'text-[#655D52] group-hover:text-primary',
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

    return (
      <nav
        ref={ref}
        aria-label="Navegación principal"
        className={cn(
          'w-full h-[88px] bg-[#FAF6F0] rounded-t-[8px]',
          'border-t border-border-subtle/80 shadow-[0_-2px_10px_rgba(0,0,0,0.03)]',
          'flex items-center justify-around px-2',
          fixed && 'fixed bottom-0 left-0 right-0 z-40',
          containerClassName,
          className,
        )}
        {...props}
      >
        <div
          className={cn(
            'grid w-full max-w-[412px] h-full items-center mx-auto',
            resolvedItems.length === 2 ? 'grid-cols-2' : 'grid-cols-4',
          )}
        >
          {resolvedItems.map((item) => {
            const isActive = item.id === currentActiveId

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleItemClick(item)}
                disabled={item.disabled}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'group flex flex-col items-center justify-center h-full w-full py-2',
                  'transition-all duration-150 select-none cursor-pointer',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 rounded-md',
                  item.disabled && 'opacity-40 cursor-not-allowed pointer-events-none',
                )}
              >
                <div
                  className={cn(
                    'relative flex items-center justify-center w-[52px] h-6 rounded-full transition-all duration-150',
                    isActive
                      ? 'bg-primary/10'
                      : 'bg-transparent group-hover:bg-primary/5',
                  )}
                >
                  {renderIcon(item.icon, isActive)}

                  {item.badge !== undefined && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full text-[10px] font-bold bg-alert-danger-border text-white">
                      {item.badge}
                    </span>
                  )}
                </div>

                <span
                  className={cn(
                    'mt-1 font-sans text-xs tracking-tight text-center leading-none transition-colors duration-150',
                    isActive
                      ? 'text-primary font-semibold'
                      : 'text-[#655D52] font-medium group-hover:text-primary',
                  )}
                >
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      </nav>
    )
  },
)

Navbar.displayName = 'Navbar'

export default Navbar
