import * as React from 'react'

/**
 * useMediaQuery - Hook reactivo para evaluar media queries de CSS en tiempo real.
 * Se actualiza inmediatamente al redimensionar la ventana del navegador.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches
    }
    return false
  })

  React.useEffect(() => {
    if (typeof window === 'undefined') return

    const media = window.matchMedia(query)
    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches)
    }

    if (media.addEventListener) {
      media.addEventListener('change', listener)
      return () => media.removeEventListener('change', listener)
    } else {
      // Compatibilidad con navegadores legacy
      media.addListener(listener)
      return () => media.removeListener(listener)
    }
  }, [query])

  return matches
}

/**
 * useIsDesktop - Detecta si el viewport actual corresponde a escritorio.
 * Por defecto usa 1024px (breakpoint 'lg' de Tailwind).
 */
export function useIsDesktop(breakpoint = 1024): boolean {
  return useMediaQuery(`(min-width: ${breakpoint}px)`)
}
