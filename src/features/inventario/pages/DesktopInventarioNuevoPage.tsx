import * as React from 'react'
import { useNavigate } from 'react-router-dom'
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
import type { ReactivoFormData } from '../types'
import { DesktopInventarioPage } from './DesktopInventarioPage'

export interface DesktopInventarioNuevoPageProps {
  /**
   * Modalidad de renderizado:
   * - 'drawer': Renderiza sobre el layout de escritorio con fondo desenfocado y panel lateral (fiel a INVENTARIO _ NUEVO REACTIVO.svg).
   * - 'card': Renderiza centrado dentro de una DesktopCard.
   * @default 'drawer'
   */
  mode?: 'drawer' | 'card'
  /**
   * Callback invocado al crear exitosamente el reactivo
   */
  onCreate?: (data: ReactivoFormData) => void
  /**
   * Callback invocado al presionar Volver o cancelar
   */
  onClose?: () => void
}

const DEFAULT_NEW_FORM_DATA: ReactivoFormData = {
  nombre: '',
  codigo: '',
  umbral: '',
  stockDisponible: '',
  fechaVencimiento: '',
  ubicacion: '',
  usoCompartido: false,
  rombo: {
    health: 0,
    flammability: 0,
    reactivity: 0,
  },
}

/**
 * Pantalla de Creación de Nuevo Reactivo en Escritorio (Desktop)
 *
 * Basada fielmente en `src/features/DESKTOP_INVENTARIO/INVENTARIO _ NUEVO REACTIVO.svg`:
 * - Estructura con `DesktopLayout` (`activeNavId="inventario"`).
 * - Rombo de seguridad NFPA 704 `RomboBadge` en tamaño grande (136px).
 * - Formulario para ingresar las especificaciones técnicas del nuevo insumo:
 *   - Nombre (InputField)
 *   - Código (InputField)
 *   - Umbral (InputField)
 *   - Stock disponible (InputField)
 *   - Fecha de vencimiento (InputField)
 *   - Ubicación (InputField)
 *   - RadioButton: "De uso compartido entre laboratorios"
 * - Botones de acción: Volver (outline, lg) y Añadir Reactivo (default, lg).
 */
export function DesktopInventarioNuevoPage({
  mode = 'drawer',
  onCreate,
  onClose,
}: DesktopInventarioNuevoPageProps): React.JSX.Element {
  const navigate = useNavigate()
  const { activeLab, user } = useAuth()

  const [formData, setFormData] = React.useState<ReactivoFormData>(DEFAULT_NEW_FORM_DATA)
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
      responsable: user?.username || 'Personal de Laboratorio',
    })
    onCreate?.(formData)
    setIsSubmitting(false)
    handleBack()
  }

  const romboValues: RomboValues = formData.rombo ?? {
    health: 0,
    flammability: 0,
    reactivity: 0,
  }

  // Contenido común del formulario de nuevo reactivo
  const formContent = (
    <form
      id="desktop-nuevo-reactivo-form"
      onSubmit={handleSubmit}
      className="space-y-4 w-full"
    >
      <InputField
        id="nuevo-reactivo-nombre"
        name="nombre"
        label="Nombre"
        placeholder="Ej. Ácido Nítrico 65%"
        value={formData.nombre}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, nombre: e.target.value }))
        }
        required
        disabled={isSubmitting}
      />

      <InputField
        id="nuevo-reactivo-codigo"
        name="codigo"
        label="Código único (opcional)"
        placeholder="Ej. RC-115"
        value={formData.codigo}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, codigo: e.target.value }))
        }
        disabled={isSubmitting}
      />

      <InputField
        id="nuevo-reactivo-clasificacion"
        name="clasificacionRiesgo"
        label="Clasificación de riesgo (opcional)"
        placeholder="Ej. Corrosivo / Inflamable"
        value={formData.clasificacionRiesgo || ''}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, clasificacionRiesgo: e.target.value }))
        }
        disabled={isSubmitting}
      />

      <InputField
        id="nuevo-reactivo-umbral"
        name="umbral"
        label="Umbral"
        placeholder="Ej. 100"
        value={formData.umbral}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, umbral: e.target.value }))
        }
        disabled={isSubmitting}
      />

      <InputField
        id="nuevo-reactivo-stock"
        name="stockDisponible"
        label="Stock disponible"
        placeholder="Ej. 500ml"
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
        id="nuevo-reactivo-vencimiento"
        name="fechaVencimiento"
        label="Fecha de vencimiento"
        placeholder="MM/AAAA (Ej. 12/2027)"
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
        id="nuevo-reactivo-ubicacion"
        name="ubicacion"
        label="Ubicación física (opcional)"
        placeholder="Ej. Armario de Ácidos - Estante 2"
        value={formData.ubicacion}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, ubicacion: e.target.value }))
        }
        disabled={isSubmitting}
      />

      <div className="pt-2">
        <RadioButton
          id="nuevo-reactivo-uso-compartido"
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
                Nuevo Reactivo
              </p>
              <DesktopCardDescription>
                Registrar nuevo insumo o sustancia química en el catálogo
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
                  form="desktop-nuevo-reactivo-form"
                  variant="default"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? 'Añadiendo...' : 'Añadir Reactivo'}
                </Button>
              </div>
            </DesktopCardFooter>
          </DesktopCard>
        </div>
      </DesktopLayout>
    )
  }

  // 2. Modo Drawer lateral sobre DesktopLayout (Fiel a INVENTARIO _ NUEVO REACTIVO.svg)
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
        aria-label="Añadir nuevo reactivo"
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
                  Nuevo Reactivo
                </p>
                <p className="font-sans text-xs text-[#4A4E4A] mt-0.5">
                  Registrar nuevo insumo o sustancia química en el catálogo
                </p>
              </div>

              {/* Botón Cerrar (X) */}
              <button
                type="button"
                onClick={handleBack}
                aria-label="Cerrar panel de nuevo reactivo"
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

          {/* Botones de acción inferior: Volver (outline, lg) y Añadir Reactivo (default, lg) */}
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
              form="desktop-nuevo-reactivo-form"
              variant="default"
              size="lg"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Añadiendo...' : 'Añadir Reactivo'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DesktopInventarioNuevoPage
