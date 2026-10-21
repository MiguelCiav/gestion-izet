import * as React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AppHeader, Navbar } from '@/components/layout'
import { SearchWrapper } from '@/components/ui/SearchWrapper'
import { cn } from '@/lib/utils'
import { useAuth } from '@/features/auth/hooks'
import {
  fetchInventarioLaboratorio,
  fetchPrestamosLaboratorio,
  mapInventarioToPrestamoReactivos,
} from '@/lib/izetService'
import { PrestamosList } from '../components'
import type {
  PrestamoReactivo,
  PrestamoItem,
  PrestamosListLocationState,
} from '../types'

/**
 * Pantalla Principal de Préstamos (Móvil) - Soporta Solicitar (HU09) y Devolver (HU10)
 */
export function PrestamosPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { activeLab, user } = useAuth()
  const isAdmin = user?.rol === 'admin'
  const locationState = location.state as PrestamosListLocationState | null

  const [activeTab, setActiveTab] = React.useState<'solicitar' | 'devolver'>('solicitar')
  const [searchQuery, setSearchQuery] = React.useState<string>('')
  const [reactivos, setReactivos] = React.useState<PrestamoReactivo[]>([])
  const [prestamosActivos, setPrestamosActivos] = React.useState<PrestamoItem[]>([])
  const [feedbackMessage, setFeedbackMessage] = React.useState<string | null>(
    locationState?.successMessage ?? null,
  )

  React.useEffect(() => {
    let isMounted = true
    const load = async () => {
      const [inv, prestamos] = await Promise.all([
        fetchInventarioLaboratorio(activeLab),
        fetchPrestamosLaboratorio(activeLab),
      ])
      if (!isMounted) return
      const mapped = mapInventarioToPrestamoReactivos(inv)
      setReactivos(mapped)
      setPrestamosActivos(prestamos)
    }
    void load()
    return () => {
      isMounted = false
    }
  }, [activeLab])

  // Filtrado de reactivos según la consulta de búsqueda
  const filteredReactivos = React.useMemo(() => {
    if (!searchQuery.trim()) {
      return reactivos
    }
    const query = searchQuery.toLowerCase().trim()
    return reactivos.filter((r) => {
      const matchName = r.nombre.toLowerCase().includes(query)
      const matchCode = r.codigo.toLowerCase().includes(query)
      const matchLocation = r.ubicacion?.toLowerCase().includes(query)
      return matchName || matchCode || matchLocation
    })
  }, [reactivos, searchQuery])

  // Filtrado de préstamos activos para devolver (HU10.1)
  const filteredPrestamos = React.useMemo(() => {
    const pendientesDevolucion = prestamosActivos.filter(
      (p) => p.estado !== 'devuelto',
    )
    if (!searchQuery.trim()) return pendientesDevolucion
    const query = searchQuery.toLowerCase().trim()
    return pendientesDevolucion.filter(
      (p) =>
        p.responsable.toLowerCase().includes(query) ||
        p.material.toLowerCase().includes(query) ||
        (p.codigoReactivo?.toLowerCase().includes(query) ?? false) ||
        (p.departamento?.toLowerCase().includes(query) ?? false),
    )
  }, [prestamosActivos, searchQuery])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleFilterClick = () => {
    if (!isAdmin) return
    setActiveTab((prev) => (prev === 'solicitar' ? 'devolver' : 'solicitar'))
  }

  const handleCardClick = (item: PrestamoReactivo) => {
    navigate('/prestamos/detalle', {
      state: { reactivo: item, mode: 'solicitar' },
    })
  }

  const handlePrestamoActivoClick = (prestamo: PrestamoItem) => {
    const reactivoAsociado = reactivos.find((r) => r.id === prestamo.reactivoId) ?? {
      id: prestamo.reactivoId || prestamo.id,
      nombre: prestamo.material,
      codigo: prestamo.codigoReactivo || 'RC-000',
      stock: prestamo.cantidad,
      unidad: prestamo.unidad || 'ml',
      ubicacion: prestamo.departamento,
    }
    navigate('/prestamos/detalle', {
      state: {
        reactivo: reactivoAsociado,
        prestamoActivo: prestamo,
        mode: 'devolver',
      },
    })
  }

  const handleNavbarChange = (_id: string, item: { href?: string }) => {
    if (item.href) {
      navigate(item.href)
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#FAF6F0] flex flex-col pb-28 relative">
      {/* Encabezado Superior */}
      <AppHeader />

      {/* Contenido Principal */}
      <main className="w-full max-w-[412px] mx-auto px-6 pt-4 flex-1 flex flex-col">
        {/* Título en tipografía Serif (Literata) estandarizado */}
        <h1 className="font-serif text-[32px] sm:text-4xl font-bold text-primary tracking-tight mb-4 select-none">
          Préstamos
        </h1>

        {/* Pestañas Solicitar / Devolver (Devolver visible solo para administrador - HU01) */}
        {isAdmin && (
          <div className="grid grid-cols-2 gap-2 p-1 bg-white rounded-full border border-[#655D52]/25 mb-5">
            <button
              type="button"
              onClick={() => setActiveTab('solicitar')}
              className={cn(
                'py-2 rounded-full text-xs font-bold transition-all',
                activeTab === 'solicitar'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-text-muted hover:text-text-main',
              )}
            >
              Solicitar ({reactivos.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('devolver')}
              className={cn(
                'py-2 rounded-full text-xs font-bold transition-all',
                activeTab === 'devolver'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-text-muted hover:text-text-main',
              )}
            >
              Devolver ({prestamosActivos.filter((p) => p.estado !== 'devuelto').length})
            </button>
          </div>
        )}

        {/* Notificación de éxito si proviene de una confirmación previa */}
        {feedbackMessage && (
          <div
            role="status"
            className="mb-4 flex items-center justify-between rounded-input border border-primary/20 bg-primary-light px-4 py-3 text-sm text-text-main shadow-sm animate-in fade-in"
          >
            <span className="font-sans font-medium text-xs sm:text-sm">
              {feedbackMessage}
            </span>
            <button
              type="button"
              onClick={() => setFeedbackMessage(null)}
              className="ml-2 text-text-muted hover:text-text-main text-xs font-semibold"
              aria-label="Cerrar notificación"
            >
              ✕
            </button>
          </div>
        )}

        {/* Barra de Búsqueda y Filtros SearchWrapper */}
        <div className="w-full mb-5">
          <SearchWrapper
            value={searchQuery}
            onChange={handleSearchChange}
            onFilterClick={handleFilterClick}
            placeholder={
              activeTab === 'solicitar'
                ? 'Buscar reactivo disponible...'
                : 'Buscar préstamo por solicitante o reactivo...'
            }
            filterAriaLabel="Alternar vista de préstamos"
            className="w-full"
          />
        </div>

        {/* Contenido según pestaña activa */}
        {activeTab === 'solicitar' ? (
          <div className="w-full flex-1">
            <PrestamosList
              items={filteredReactivos}
              onItemClick={handleCardClick}
              emptyMessage={
                searchQuery
                  ? `No se encontraron reactivos para "${searchQuery}".`
                  : 'No hay reactivos disponibles para préstamo.'
              }
            />
          </div>
        ) : (
          <div className="w-full flex-1 space-y-3">
            {filteredPrestamos.length === 0 ? (
              <div className="py-10 text-center bg-white/70 rounded-2xl border border-[#655D52]/20 p-6">
                <p className="font-serif font-bold text-text-main text-base">
                  No hay préstamos pendientes de devolución
                </p>
                <p className="font-sans text-xs text-text-muted mt-1">
                  Todos los préstamos de {activeLab} han sido devueltos o cerrados.
                </p>
              </div>
            ) : (
              filteredPrestamos.map((prestamo) => (
                <button
                  key={prestamo.id}
                  type="button"
                  onClick={() => handlePrestamoActivoClick(prestamo)}
                  className="w-full text-left bg-white p-4 rounded-2xl border border-[#655D52]/25 shadow-2xs hover:border-primary transition-all space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-primary text-base">
                      {prestamo.material}
                    </span>
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-full bg-primary-light text-primary">
                      {prestamo.cantidad} {prestamo.unidad ?? 'ml'}
                    </span>
                  </div>
                  <p className="font-sans text-xs font-semibold text-text-main">
                    Solicitante: {prestamo.responsable} ({prestamo.solicitanteCedula})
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-text-muted pt-1">
                    <span>
                      Modalidad:{' '}
                      {prestamo.modalidad === 'FRASCO_COMPLETO'
                        ? 'Frasco Completo'
                        : 'Fracción'}
                    </span>
                    <span>Límite: {prestamo.fechaLimite}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </main>

      {/* Barra de Navegación Inferior */}
      <Navbar
        activeId="prestamos"
        fixed
        onItemChange={handleNavbarChange}
      />
    </div>
  )
}

export default PrestamosPage
