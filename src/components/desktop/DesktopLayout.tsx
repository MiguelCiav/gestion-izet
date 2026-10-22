import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useAuth } from '@/features/auth/hooks'
import { DesktopSidebar } from './DesktopSidebar'
import { DesktopProfileIcon } from './DesktopProfileIcon'

export interface DesktopTopbarProps extends React.HTMLAttributes<HTMLElement> {
  left?: React.ReactNode
  right?: React.ReactNode
  profile?: React.ReactNode
  className?: string
  children?: React.ReactNode
}

export const DesktopTopbar = React.forwardRef<HTMLElement, DesktopTopbarProps>(
  ({ left, right, profile, className, children, ...props }, ref) => {
    const navigate = useNavigate()
    const { user, activeLab, setActiveLab, logout } = useAuth()
    const isAdmin = user?.rol === 'admin'

    const displayName = user?.username || 'Personal de Laboratorio'
    const displaySubtitle = user?.cedula || ''

    const handleLogout = async () => {
      await logout()
      navigate('/login')
    }

    const defaultRightContent = (
      <div className="flex items-center gap-3">
        {isAdmin && (
          <div
            role="group"
            aria-label="Cambiar laboratorio activo"
            className="inline-flex items-center rounded-xl border border-[#655D52]/30 bg-white p-1"
          >
            {(['LEPA', 'LEM'] as const).map((lab) => (
              <button
                key={lab}
                type="button"
                onClick={() => setActiveLab(lab)}
                className={cn(
                  'px-3 py-1 rounded-lg text-xs font-sans font-bold transition-colors cursor-pointer',
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

        <DesktopProfileIcon
          name={displayName}
          role={displaySubtitle}
        />

        <button
          type="button"
          onClick={() => void handleLogout()}
          title="Cerrar sesión"
          className="px-3 py-1.5 rounded-lg border border-[#655D52]/30 text-xs font-sans font-semibold text-[#4A4E4A] hover:text-[#B83230] hover:border-[#B83230]/40 hover:bg-[#FFDAD6]/20 transition-colors cursor-pointer"
        >
          Salir
        </button>
      </div>
    )

    const rightContent = right ?? profile ?? defaultRightContent

    return (
      <header
        ref={ref}
        aria-label="Cabecera superior de escritorio"
        className={cn(
          'w-full h-[88px] min-h-[88px] max-h-[88px] bg-[#FAF6F0]',
          'border-b border-[#655D52]/40 px-8 flex items-center justify-between shrink-0 select-none',
          className,
        )}
        {...props}
      >
        {children ? (
          children
        ) : (
          <>
            <div className="flex items-center gap-4 flex-1 min-w-0 mr-6">
              {left}
            </div>
            <div className="flex items-center gap-4 shrink-0">
              {rightContent}
            </div>
          </>
        )}
      </header>
    )
  },
)

DesktopTopbar.displayName = 'DesktopTopbar'

export interface DesktopContentProps extends React.HTMLAttributes<HTMLElement> {
  className?: string
  children?: React.ReactNode
}

export const DesktopContent = React.forwardRef<HTMLElement, DesktopContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <main
        ref={ref}
        role="main"
        className={cn(
          'relative flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-8 bg-[#FAF6F0]',
          className,
        )}
        {...props}
      >
        {children}
      </main>
    )
  },
)

DesktopContent.displayName = 'DesktopContent'

export interface DesktopLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  sidebar?: React.ReactNode
  activeNavId?: string
  onNavChange?: (id: string) => void
  topbarLeft?: React.ReactNode
  topbarRight?: React.ReactNode
  profile?: React.ReactNode
  topbar?: React.ReactNode
  topbarClassName?: string
  sidebarClassName?: string
  contentClassName?: string
  children: React.ReactNode
  className?: string
}

export const DesktopLayout = React.forwardRef<HTMLDivElement, DesktopLayoutProps>(
  (
    {
      sidebar,
      activeNavId,
      onNavChange,
      topbarLeft,
      topbarRight,
      profile,
      topbar,
      topbarClassName,
      sidebarClassName,
      contentClassName,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const { activeLab } = useAuth()

    const renderSidebar = () => {
      if (sidebar) {
        if (
          React.isValidElement(sidebar) &&
          (sidebar.type === DesktopSidebar ||
            Boolean(
              (sidebar.props as { className?: string } | undefined)?.className?.includes('w-[206px]'),
            ))
        ) {
          return sidebar
        }

        return (
          <aside
            aria-label="Barra lateral de escritorio"
            className={cn(
              'w-[206px] min-w-[206px] max-w-[206px] h-full shrink-0 flex flex-col',
              'bg-[#FAF6F0] border-r border-[#655D52]/40',
              sidebarClassName,
            )}
          >
            {sidebar}
          </aside>
        )
      }

      return (
        <DesktopSidebar
          activeId={activeNavId}
          labLabel={activeLab}
          onItemChange={onNavChange ? (id) => onNavChange(id) : undefined}
          className={sidebarClassName}
        />
      )
    }

    return (
      <div
        ref={ref}
        className={cn(
          'relative w-full h-screen min-h-screen max-h-screen flex flex-row overflow-hidden',
          'bg-[#FAF6F0] text-text-main font-sans select-auto',
          className,
        )}
        {...props}
      >
        {renderSidebar()}

        <div className="relative flex-1 min-w-0 h-full flex flex-col overflow-hidden">
          {topbar ? (
            topbar
          ) : (
            <DesktopTopbar
              left={topbarLeft}
              right={topbarRight}
              profile={profile}
              className={topbarClassName}
            />
          )}

          <DesktopContent className={contentClassName}>
            {children}
          </DesktopContent>
        </div>
      </div>
    )
  },
)

DesktopLayout.displayName = 'DesktopLayout'

export default DesktopLayout
