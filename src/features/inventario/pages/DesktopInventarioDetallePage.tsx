import * as React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  DesktopLayout,
  DesktopCard,
  DesktopCardHeader,
  DesktopCardTitle,
  DesktopCardDescription,
  DesktopCardContent,
  DesktopCardFooter,
} from '@/components/desktop'
import {
  Button,
  InputField,
  RadioButton,
  RomboBadge,
  type RomboValues,
} from '@/components/ui'
import { useAuth } from '@/features/auth/hooks'
import { guardarReactivoEnSupabase } from '@/lib/izetService'
import type { ReactivoItem, ReactivoFormData } from '../types'
import { DesktopInventarioPage } from './DesktopInventarioPage'

interface LocationState {
  reactivo?: ReactivoItem
}

export interface DesktopInventarioDetallePageProps {
  /**
   * Reactivo a mostrar/editar. Si no se provee, intenta obtenerlo de router state o mock default.
   */
  reactivo?: ReactivoItem
  /**
   * Modalidad de renderizado:
   * - 'drawer': Renderiza sobre el layout de escritorio con fondo desenfocado y panel lateral (fiel a INVENTARIO _ DETALLE.svg).
   * - 'card': Renderiza centrado dentro de una DesktopCard.
   * @default 'drawer'
   */
  mode?: 'drawer' | 'card'
  /**
   * Callback invocado al guardar cambios
   */
  onSave?: (data: ReactivoFormData) => void
  /**
   * Callback invocado al presionar Volver o cerrar
   */
  onClose?: () => void
}

const DEFAULT_REACTIVO_DETALLE: ReactivoItem = {
  id: 'rc-001',
  nombre: 'Reactivo Name',
  codigo: 'XX-123',
  stock: '500ml',
  unidad: 'ml',
  umbral: 50,
  fechaVencimiento: '12/2026',
  ubicacion: 'Estante 3',
  usoCompartido: false,
  rombo: {
    health: 3,
    flammability: 0,
    reactivity: 1,
    special: 'COR',
  },
}

/**
 * Pantalla de Detalle de Reactivo de Escritorio (Desktop)
 *
 * Basada fielmente en `src/features/DESKTOP_INVENTARIO/INVENTARIO _ DETALLE.svg`:
 * - Estructura institucional con `DesktopLayout` (`activeNavId="inventario"`).
 * - Rombo de seguridad NFPA 704 `RomboBadge` en tamaño grande (136px).
 * - Formulario completo de especificaciones técnicas:
 *   - Nombre (InputField)
 *   - Código (InputField)
 *   - Umbral (InputField)
 *   - Stock disponible (InputField)
 *   - Fecha de vencimiento (InputField)
 *   - Ubicación (InputField)
 *   - RadioButton: "De uso compartido entre laboratorios"
 * - Botones inferiores de acción: Volver (outline, lg) y Guardar (default, lg).
 */
export function DesktopInventarioDetallePage({
  reactivo: propReactivo,
  mode = 'drawer',
  onSave,
  onClose,
}: DesktopInventarioDetallePageProps): React.JSX.Element {
  const navigate = useNavigate()
  const location = useLocation()
  const { activeLab, user } = useAuth()
  const state = location.state as LocationState | undefined

  const reactivoItem = propReactivo ?? state?.reactivo ?? DEFAULT_REACTIVO_DETALLE

  const [formData, setFormData] = React.useState<ReactivoFormData>({
    nombre: reactivoItem.nombre,
    codigo: reactivoItem.codigo,
    umbral:
      reactivoItem.umbral !== undefined ? String(reactivoItem.umbral) : '50',
    stockDisponible: reactivoItem.unidad
      ? `${reactivoItem.stock}${reactivoItem.unidad}`
      : String(reactivoItem.stock),
    fechaVencimiento: reactivoItem.fechaVencimiento ?? '12/2026',
    ubicacion: reactivoItem.ubicacion ?? 'Estante 3',
    usoCompartido: Boolean(reactivoItem.usoCompartido),
    rombo: reactivoItem.rombo ?? {
      health: 3,
      flammability: 0,
      reactivity: 1,
      special: 'COR',
    },
  })

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const handleBack = () => {
    if (onClose) {
      onClose()
    } else {
      navigate('/inventario')
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    await guardarReactivoEnSupabase(activeLab, formData, {
      reactivoId: reactivoItem.reactivoId,
      responsable: user?.username || 'Personal de Laboratorio',
    })
    onSave?.(formData)
    setIsSubmitting(false)
    handleBack()
  }

  const romboValues: RomboValues = formData.rombo ?? {
    health: 3,
    flammability: 0,
    reactivity: 1,
    special: 'COR',
  }

  // Contenido común del formulario
  const formContent = (
    <form
      id="desktop-reactivo-detalle-form"
      onSubmit={handleSubmit}
      className="space-y-4 w-full"
    >
      <InputField
        id="detalle-reactivo-nombre"
        name="nombre"
        label="Nombre"
        value={formData.nombre}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, nombre: e.target.value }))
        }
        required
        disabled={isSubmitting}
      />

      <InputField
        id="detalle-reactivo-codigo"
        name="codigo"
        label="Código"
        value={formData.codigo}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, codigo: e.target.value }))
        }
        required
        disabled={isSubmitting}
      />

      <InputField
        id="detalle-reactivo-umbral"
        name="umbral"
        label="Umbral"
        value={formData.umbral}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, umbral: e.target.value }))
        }
        disabled={isSubmitting}
      />

      <InputField
        id="detalle-reactivo-stock"
        name="stockDisponible"
        label="Stock disponible"
        value={formData.stockDisponible}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            stockDisponible: e.target.value,
          }))
        }
        required
        disabled={isSubmitting}
      />

      <InputField
        id="detalle-reactivo-vencimiento"
        name="fechaVencimiento"
        label="Fecha de vencimiento"
        value={formData.fechaVencimiento}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            fechaVencimiento: e.target.value,
          }))
        }
        disabled={isSubmitting}
      />

      <InputField
        id="detalle-reactivo-ubicacion"
        name="ubicacion"
        label="Ubicación"
        value={formData.ubicacion}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, ubicacion: e.target.value }))
        }
        disabled={isSubmitting}
      />

      <div className="pt-2">
        <RadioButton
          id="detalle-reactivo-uso-compartido"
          name="usoCompartido"
          label="De uso compartido entre laboratorios"
          checked={formData.usoCompartido}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              usoCompartido: e.target.checked,
            }))
          }
          disabled={isSubmitting}
        />
      </div>
    </form>
  )

  // 1. Modo Tarjeta centrada con DesktopCard
  if (mode === 'card') {
    return (
      <DesktopLayout activeNavId="inventario" onNavChange={handleBack}>
        <div className="w-full flex justify-center py-6">
          <DesktopCard maxWidth="lg" className="w-full max-w-[540px]">
            <DesktopCardHeader className="text-left space-y-1">
              <DesktopCardTitle>Inventario</DesktopCardTitle>
              <p className="font-sans text-xl font-bold text-[#181C1B]">
                {formData.nombre}
              </p>
              <DesktopCardDescription>
                Especificaciones técnicas y riesgos de seguridad del reactivo
              </DesktopCardDescription>
            </DesktopCardHeader>

            <DesktopCardContent>
              {/* Rombo NFPA 704 en tamaño 136px */}
              <div className="flex justify-center items-center py-4 select-none">
                <RomboBadge
                  size={136}
                  values={romboValues}
                  className="drop-shadow-md"
                />
              </div>

              {formContent}
            </DesktopCardContent>

            <DesktopCardFooter className="pt-6">
              <div className="grid grid-cols-2 gap-4 w-full">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={handleBack}
                  disabled={isSubmitting}
                  className="w-full"
                >
                  Volver
                </Button>

                <Button
                  type="submit"
                  form="desktop-reactivo-detalle-form"
                  variant="default"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar'}
                </Button>
              </div>
            </DesktopCardFooter>
          </DesktopCard>
        </div>
      </DesktopLayout>
    )
  }

  // 2. Modo Drawer lateral sobre DesktopLayout (Fiel al SVG de Figma)
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Fondo con la vista de inventario */}
      <div className="pointer-events-none select-none filter blur-[2px] opacity-80 h-full">
        <DesktopInventarioPage />
      </div>

      {/* Capa de superposición con desenfoque exacto a Figma */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Detalle del reactivo ${formData.nombre}`}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[5px] flex justify-end animate-in fade-in duration-200"
        onClick={handleBack}
      >
        <div
          className="w-full max-w-[534px] h-full bg-[#FAF6F0] rounded-l-[32px] p-8 md:p-10 shadow-2xl overflow-y-auto flex flex-col justify-between border-l border-[#655D52]/30 animate-in slide-in-from-right duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Cabecera del Panel */}
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="font-serif text-3xl font-bold text-primary tracking-tight">
                  Inventario
                </h1>
                <p className="font-sans text-xl font-bold text-[#181C1B] mt-1">
                  {formData.nombre}
                </p>
                <p className="font-sans text-xs text-[#4A4E4A] mt-0.5">
                  Especificaciones técnicas y riesgos de seguridad
                </p>
              </div>

              {/* Botón Cerrar (X) */}
              <button
                type="button"
                onClick={handleBack}
                aria-label="Cerrar panel de detalle"
                className="p-2 rounded-full text-[#4A4E4A] hover:text-[#181C1B] hover:bg-[#655D52]/10 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Rombo NFPA 704 tamaño grande 136px */}
            <div className="flex justify-center items-center py-2 select-none">
              <RomboBadge
                size={136}
                values={romboValues}
                className="drop-shadow-md"
              />
            </div>

            {/* Formulario de especificaciones técnicas */}
            {formContent}
          </div>

          {/* Botones de acción inferior: Volver (outline, lg) y Guardar (default, lg) */}
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-[#655D52]/20 mt-6">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleBack}
              disabled={isSubmitting}
              className="w-full"
            >
              Volver
            </Button>

            <Button
              type="submit"
              form="desktop-reactivo-detalle-form"
              variant="default"
              size="lg"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DesktopInventarioDetallePage
