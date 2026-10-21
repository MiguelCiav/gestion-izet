import * as React from 'react'
import { useIsDesktop } from '@/hooks/useMediaQuery'

export interface ResponsiveViewProps {
  /**
   * Componente o elemento a renderizar en resoluciones de escritorio (>= 1024px).
   */
  desktop: React.ReactNode | React.ComponentType
  /**
   * Componente o elemento a renderizar en resoluciones móviles y tablets (< 1024px).
   */
  mobile: React.ReactNode | React.ComponentType
  /**
   * Breakpoint en píxeles para conmutar entre móvil y escritorio.
   * @default 1024
   */
  breakpoint?: number
}

/**
 * ResponsiveView - Conmuta de forma reactiva y fluida entre las variantes
 * de escritorio y móvil para una misma ruta al achicar o agrandar la pantalla.
 */
export function ResponsiveView({
  desktop,
  mobile,
  breakpoint = 1024,
}: ResponsiveViewProps) {
  const isDesktop = useIsDesktop(breakpoint)

  const renderContent = (content: React.ReactNode | React.ComponentType) => {
    if (React.isValidElement(content)) {
      return content
    }
    if (typeof content === 'function') {
      const Component = content as React.ComponentType
      return <Component />
    }
    return content as React.ReactNode
  }

  return <>{isDesktop ? renderContent(desktop) : renderContent(mobile)}</>
}

export default ResponsiveView
