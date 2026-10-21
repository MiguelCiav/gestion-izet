import { useNavigate } from 'react-router-dom'
import { AppHeader, Navbar } from '@/components/layout'
import {
  FlaskIcon,
  BottleIcon,
  MicroscopeIcon,
  FileTextIcon,
} from '@/assets/icons'
import { InventarioCategoryCard } from '../components'
import type { InventarioCategoria } from '../types'

/**
 * Categorías oficiales del Hub de Inventario según INVENTARIO.svg
 */
const INVENTARIO_CATEGORIAS: InventarioCategoria[] = [
  {
    id: 'reactivos',
    label: 'Reactivos',
    icon: FlaskIcon,
    href: '/inventario/reactivos',
  },
  {
    id: 'vidrios',
    label: 'Vidrios',
    icon: BottleIcon,
    href: '/inventario/vidrios',
  },
  {
    id: 'equipos',
    label: 'Equipos',
    icon: MicroscopeIcon,
    href: '/inventario/equipos',
  },
  {
    id: 'reporte',
    label: 'Reporte',
    icon: FileTextIcon,
    href: '/inventario/reporte',
  },
]

/**
 * Pantalla Principal de Inventario (Hub)
 * Fiel a INVENTARIO.svg:
 * - AppHeader con logotipo y configuración
 * - Título principal "Inventario" en tipografía Serif institucional
 * - Grid 2x2 de tarjetas táctiles redondeadas (163x92px)
 * - Navbar inferior con pestaña activa en "inventario"
 */
export function InventarioHubPage() {
  const navigate = useNavigate()

  const handleCategoryClick = (categoria: InventarioCategoria) => {
    navigate(categoria.href)
  }

  const handleNavbarChange = (_id: string, item: { href?: string }) => {
    if (item.href) {
      navigate(item.href)
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#FAF6F0] flex flex-col justify-between pb-28">
      {/* Encabezado Superior Oficial */}
      <AppHeader />

      {/* Contenido Principal */}
      <main className="w-full max-w-[412px] mx-auto px-6 pt-4 flex-1 flex flex-col">
        {/* Título de la Sección estandarizado en tipografía Serif institucional (#4A7C59) */}
        <h1 className="font-serif text-[32px] sm:text-4xl font-bold text-primary tracking-tight mb-8 select-none">
          Inventario
        </h1>

        {/* Grid 2x2 de Módulos de Inventario */}
        <section
          aria-label="Categorías de inventario"
          className="grid grid-cols-2 gap-5 w-full"
        >
          {INVENTARIO_CATEGORIAS.map((cat) => {
            const isDisabled = cat.id === 'equipos' || cat.id === 'vidrios'
            return (
              <InventarioCategoryCard
                key={cat.id}
                id={cat.id}
                label={cat.label}
                icon={cat.icon}
                disabled={isDisabled}
                onClick={isDisabled ? undefined : () => handleCategoryClick(cat)}
              />
            )
          })}
        </section>
      </main>

      {/* Navegación Inferior Móvil */}
      <Navbar
        activeId="inventario"
        fixed
        onItemChange={handleNavbarChange}
      />
    </div>
  )
}

export default InventarioHubPage
