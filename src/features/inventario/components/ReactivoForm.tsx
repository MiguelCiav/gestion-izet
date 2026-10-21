import * as React from 'react'
import { RomboBadge, type RomboValues } from '@/components/ui/RomboBadge'
import { InputField } from '@/components/ui/InputField'
import { RadioButton } from '@/components/ui/RadioButton'
import { Checkbox } from '@/components/ui/Checkbox'
import { Button } from '@/components/ui/Button'
import { verificarDisponibilidadCodigo } from '@/lib/izetService'
import type { ReactivoFormData } from '../types'
import { cn } from '@/lib/utils'

const ENTIDADES_FISCALIZADORAS = ['CICPC'] as const

export interface ReactivoFormProps {
  initialData?: Partial<ReactivoFormData>
  reactivoId?: string
  onSubmit?: (data: ReactivoFormData) => void
  onCancel?: () => void
  onDeactivate?: () => void
  isSubmitting?: boolean
  submitLabel?: string
  className?: string
}

const DEFAULT_FORM_DATA: ReactivoFormData = {
  nombre: '',
  codigo: '',
  formulaQuimica: '',
  clasificacionRiesgo: '',
  umbral: '50',
  stockDisponible: '500',
  unidadMedida: 'ml',
  fechaVencimiento: '',
  ubicacion: '',
  lote: '',
  usoCompartido: false,
  esRegulado: false,
  entidadesRegulatorias: [],
  ultimoPrecio: '',
  monedaPrecio: 'USD',
  fechaUltimoPrecio: new Date().toISOString().slice(0, 10),
  rombo: {
    health: 2,
    flammability: 0,
    reactivity: 1,
    special: '',
  },
}

export function ReactivoForm({
  initialData,
  reactivoId,
  onSubmit,
  onCancel,
  onDeactivate,
  isSubmitting = false,
  submitLabel = 'Guardar',
  className,
}: ReactivoFormProps) {
  const [formData, setFormData] = React.useState<ReactivoFormData>(() => ({
    ...DEFAULT_FORM_DATA,
    ...initialData,
    entidadesRegulatorias: initialData?.entidadesRegulatorias ?? [],
    monedaPrecio: initialData?.monedaPrecio ?? 'USD',
    unidadMedida: initialData?.unidadMedida ?? 'ml',
    rombo: initialData?.rombo ?? DEFAULT_FORM_DATA.rombo,
  }))

  const [codeCheckStatus, setCodeCheckStatus] = React.useState<{
    checking: boolean
    disponible: boolean
    existingName?: string
  }>({ checking: false, disponible: true })

  // Validación en tiempo real de unicidad de código (HU03.2)
  React.useEffect(() => {
    const code = formData.codigo.trim()
    if (!code || code.length < 2) {
      setCodeCheckStatus({ checking: false, disponible: true })
      return
    }

    let cancelled = false
    setCodeCheckStatus((prev) => ({ ...prev, checking: true }))

    const timer = setTimeout(async () => {
      const result = await verificarDisponibilidadCodigo(code, reactivoId)
      if (cancelled) return
      setCodeCheckStatus({
        checking: false,
        disponible: result.disponible,
        existingName: result.reactivoExistente?.nombre,
      })
    }, 280)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [formData.codigo, reactivoId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleRomboChange = (
    field: keyof RomboValues,
    value: number | string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      rombo: {
        health: prev.rombo?.health ?? 0,
        flammability: prev.rombo?.flammability ?? 0,
        reactivity: prev.rombo?.reactivity ?? 0,
        special: prev.rombo?.special,
        [field]: value,
      },
    }))
  }

  const toggleEntidadRegulatoria = (entidad: string) => {
    setFormData((prev) => {
      const current = prev.entidadesRegulatorias ?? []
      const exists = current.includes(entidad)
      const next = exists
        ? current.filter((e) => e !== entidad)
        : [...current, entidad]
      return {
        ...prev,
        entidadesRegulatorias: next,
        esRegulado: next.length > 0 ? true : prev.esRegulado,
      }
    })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit?.(formData)
  }

  const romboValues: RomboValues = formData.rombo ?? {
    health: 2,
    flammability: 0,
    reactivity: 1,
    special: '',
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('w-full flex flex-col space-y-5', className)}
      noValidate
    >
      {/* 1. Rombo de Seguridad NFPA 704 centrado en tamaño grande (136px) + Controles de cuadrantes (HU02.3) */}
      <div className="bg-white/70 border border-[#655D52]/25 rounded-2xl p-4 space-y-3">
        <div className="flex justify-center items-center py-1 select-none">
          <RomboBadge
            size={136}
            values={romboValues}
            className="drop-shadow-sm"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-sans">
          <div>
            <label htmlFor="nfpa-salud" className="block font-semibold text-blue-900 mb-1">
              Salud (0-4)
            </label>
            <select
              id="nfpa-salud"
              value={Number(romboValues.health ?? 0)}
              onChange={(e) => handleRomboChange('health', Number(e.target.value))}
              className="w-full h-9 rounded-lg border border-[#655D52]/30 bg-white px-2 text-xs font-semibold"
              disabled={isSubmitting}
            >
              {[0, 1, 2, 3, 4].map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="nfpa-inflamabilidad" className="block font-semibold text-red-900 mb-1">
              Inflamab. (0-4)
            </label>
            <select
              id="nfpa-inflamabilidad"
              value={Number(romboValues.flammability ?? 0)}
              onChange={(e) => handleRomboChange('flammability', Number(e.target.value))}
              className="w-full h-9 rounded-lg border border-[#655D52]/30 bg-white px-2 text-xs font-semibold"
              disabled={isSubmitting}
            >
              {[0, 1, 2, 3, 4].map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="nfpa-reactividad" className="block font-semibold text-amber-900 mb-1">
              Inestab. (0-4)
            </label>
            <select
              id="nfpa-reactividad"
              value={Number(romboValues.reactivity ?? 0)}
              onChange={(e) => handleRomboChange('reactivity', Number(e.target.value))}
              className="w-full h-9 rounded-lg border border-[#655D52]/30 bg-white px-2 text-xs font-semibold"
              disabled={isSubmitting}
            >
              {[0, 1, 2, 3, 4].map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="nfpa-especial" className="block font-semibold text-[#181C1B] mb-1">
              Riesgo Esp.
            </label>
            <select
              id="nfpa-especial"
              value={String(romboValues.special ?? '')}
              onChange={(e) => handleRomboChange('special', e.target.value)}
              className="w-full h-9 rounded-lg border border-[#655D52]/30 bg-white px-2 text-xs font-semibold"
              disabled={isSubmitting}
            >
              <option value="">Ninguno</option>
              <option value="COR">COR (Corrosivo)</option>
              <option value="OX">OX (Oxidante)</option>
              <option value="W">W (No usar agua)</option>
              <option value="ACID">ACID (Ácido)</option>
              <option value="ALK">ALK (Alcalino)</option>
              <option value="BIO">BIO (Biológico)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Campos del formulario InputField (HU02, HU03, HU04) */}
      <div className="space-y-3.5 w-full">
        {/* Nombre */}
        <InputField
          id="reactivo-nombre"
          name="nombre"
          label="Nombre *"
          placeholder="Ej. Ácido Clorhídrico 37%"
          value={formData.nombre}
          onChange={handleChange}
          required
          disabled={isSubmitting}
        />

        {/* Código Único con validación en tiempo real (HU03) - Opcional */}
        <div>
          <InputField
            id="reactivo-codigo"
            name="codigo"
            label="Código único institucional (opcional)"
            placeholder="Ej. RCT-HCL-01"
            value={formData.codigo}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {formData.codigo.trim().length >= 2 && (
            <p
              className={cn(
                'mt-1 text-xs font-sans font-medium',
                codeCheckStatus.checking
                  ? 'text-[#655D52]'
                  : codeCheckStatus.disponible
                    ? 'text-[#4A7C59]'
                    : 'text-amber-800',
              )}
            >
              {codeCheckStatus.checking
                ? 'Verificando disponibilidad del código...'
                : codeCheckStatus.disponible
                  ? '✓ Código único disponible en el catálogo centralizado'
                  : `Código compartido existente en catálogo: "${codeCheckStatus.existingName}" (se vinculará el stock al laboratorio activo)`}
            </p>
          )}
        </div>

        {/* Fórmula Química y Clasificación de Riesgo (HU02.2) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InputField
            id="reactivo-formula"
            name="formulaQuimica"
            label="Fórmula química *"
            placeholder="Ej. HCl, C2H5OH"
            value={formData.formulaQuimica || ''}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
          <InputField
            id="reactivo-clasificacion"
            name="clasificacionRiesgo"
            label="Clasificación de riesgo (opcional)"
            placeholder="Ej. Corrosivo / Inflamable"
            value={formData.clasificacionRiesgo || ''}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>

        {/* Stock disponible, Unidad de medida y Umbral (HU04.2) */}
        <div className="grid grid-cols-3 gap-3">
          <InputField
            id="reactivo-stock"
            name="stockDisponible"
            label="Stock disponible *"
            placeholder="Ej. 500"
            value={formData.stockDisponible}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />

          <div>
            <label
              htmlFor="reactivo-unidad"
              className="block text-sm font-medium text-text-main mb-1.5"
            >
              Unidad *
            </label>
            <select
              id="reactivo-unidad"
              name="unidadMedida"
              value={formData.unidadMedida || 'ml'}
              onChange={handleChange}
              disabled={isSubmitting}
              className="h-12 w-full rounded-input border border-border bg-white px-3 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="ml">ml</option>
              <option value="L">L</option>
              <option value="g">g</option>
              <option value="kg">kg</option>
              <option value="unid">unid</option>
            </select>
          </div>

          <InputField
            id="reactivo-umbral"
            name="umbral"
            label="Umbral mín. *"
            placeholder="Ej. 50"
            value={formData.umbral}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>

        {/* Fecha de vencimiento y Ubicación física detallada (HU04.2 y HU04.4) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InputField
            id="reactivo-vencimiento"
            name="fechaVencimiento"
            label="Fecha de vencimiento"
            placeholder="AAAA-MM-DD o MM/AAAA"
            value={formData.fechaVencimiento}
            onChange={handleChange}
            disabled={isSubmitting}
          />

          <InputField
            id="reactivo-ubicacion"
            name="ubicacion"
            label="Ubicación física (opcional)"
            placeholder="Ej. Gabinete Ácidos 1 - Estante A"
            value={formData.ubicacion}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>

        {/* Último precio adquirido y Moneda USD/VES (HU02.5 y HU04.3) */}
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <InputField
              id="reactivo-precio"
              name="ultimoPrecio"
              label="Último precio adquirido"
              placeholder="Ej. 45.00"
              value={formData.ultimoPrecio || ''}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label
              htmlFor="reactivo-moneda"
              className="block text-sm font-medium text-text-main mb-1.5"
            >
              Moneda
            </label>
            <select
              id="reactivo-moneda"
              name="monedaPrecio"
              value={formData.monedaPrecio || 'USD'}
              onChange={handleChange}
              disabled={isSubmitting}
              className="h-12 w-full rounded-input border border-border bg-white px-3 text-sm font-semibold text-text-main focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="USD">USD ($)</option>
              <option value="VES">VES (Bs.)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Clasificación de Sustancia Regulada y Uso Común (HU02.4 y HU03.3) */}
      <div className="space-y-3 pt-1 pb-1 border-t border-[#655D52]/15">
        <RadioButton
          id="reactivo-uso-compartido"
          name="usoCompartido"
          label="Insumo de uso común / compartido entre laboratorios (LEPA y LEM)"
          checked={formData.usoCompartido}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, usoCompartido: e.target.checked }))
          }
          disabled={isSubmitting}
        />

        <div className="space-y-2">
          <Checkbox
            id="reactivo-es-regulado"
            checked={Boolean(formData.esRegulado)}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                esRegulado: e.target.checked,
                entidadesRegulatorias: e.target.checked
                  ? prev.entidadesRegulatorias?.includes('CICPC')
                    ? ['CICPC']
                    : ['CICPC']
                  : [],
              }))
            }
            label="Sustancia Regulada / Controlada por entes fiscalizadores"
          />

          {formData.esRegulado && (
            <div className="flex flex-wrap gap-2 pl-6 pt-1">
              {ENTIDADES_FISCALIZADORAS.map((entidad) => {
                const active = (formData.entidadesRegulatorias ?? []).includes(entidad)
                return (
                  <button
                    key={entidad}
                    type="button"
                    onClick={() => toggleEntidadRegulatoria(entidad)}
                    className={cn(
                      'px-2.5 py-1 rounded-full text-xs font-sans font-semibold border transition-colors cursor-pointer',
                      active
                        ? 'bg-[#B83230] text-white border-[#B83230]'
                        : 'bg-white text-[#4A4E4A] border-[#655D52]/30 hover:bg-[#FAF6F0]',
                    )}
                  >
                    {entidad}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* 4. Botones de acción: Volver y Guardar (+ Baja lógica si existe reactivoId) */}
      <div className="space-y-3 pt-2">
        <div className="grid grid-cols-2 gap-4">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={onCancel}
            disabled={isSubmitting}
            className="w-full"
          >
            Volver
          </Button>

          <Button
            type="submit"
            variant="default"
            size="lg"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Guardando...' : submitLabel}
          </Button>
        </div>

        {onDeactivate && reactivoId && (
          <button
            type="button"
            onClick={onDeactivate}
            disabled={isSubmitting}
            className="w-full py-2 text-xs font-sans font-semibold text-[#B83230] hover:underline cursor-pointer"
          >
            Dar de baja lógica en el catálogo centralizado
          </button>
        )}
      </div>
    </form>
  )
}

export default ReactivoForm
