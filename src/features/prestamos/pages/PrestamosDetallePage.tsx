import * as React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AppHeader, Navbar } from '@/components/layout'
import { ReactivoCard } from '@/components/ui/ReactivoCard'
import { Stepper } from '@/components/ui/Stepper'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { InputField } from '@/components/ui/InputField'
import { cn } from '@/lib/utils'
import { useAuth } from '@/features/auth/hooks'
import {
  registrarPrestamoEnSupabase,
  registrarDevolucionPrestamoEnSupabase,
  LABORATORIOS_INFO,
} from '@/lib/izetService'
import type {
  PrestamoReactivo,
  ModalidadPrestamo,
  PrestamosDetalleLocationState,
} from '../types'

function getFutureDateString(daysAhead: number = 7): string {
  const date = new Date()
  date.setDate(date.getDate() + daysAhead)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Pantalla de Detalle de Préstamo (Móvil) - Soporta "¿Cuánto solicitarás?" (HU09) y "¿Cuánto devolverás?" (HU10)
 */
export function PrestamosDetallePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { activeLab, user } = useAuth()
  const isAdmin = user?.rol === 'admin'
  const locationState = location.state as PrestamosDetalleLocationState | null

  const mode = locationState?.mode ?? 'solicitar'
  const prestamoActivo = locationState?.prestamoActivo
  const reactivo: PrestamoReactivo | undefined = locationState?.reactivo || (prestamoActivo ? {
    id: prestamoActivo.reactivoId || prestamoActivo.id,
    nombre: prestamoActivo.material,
    codigo: prestamoActivo.codigoReactivo || 'S/C',
    stock: prestamoActivo.cantidad,
    unidad: prestamoActivo.unidad,
  } : undefined)

  // Estado del contador Stepper
  const [cantidad, setCantidad] = React.useState<number>(
    mode === 'devolver' && prestamoActivo
      ? Number(prestamoActivo.cantidad) || 1
      : 1,
  )

  // Campos de Solicitud (HU09)
  const [modalidad, setModalidad] = React.useState<ModalidadPrestamo>('FRACCION')
  const [solicitanteNombre, setSolicitanteNombre] = React.useState<string>('')
  const [solicitanteCedula, setSolicitanteCedula] = React.useState<string>('')
  const [solicitanteInstitucion, setSolicitanteInstitucion] = React.useState<string>('')
  const [solicitanteContacto, setSolicitanteContacto] = React.useState<string>('')
  const [fechaEstimada, setFechaEstimada] = React.useState<string>(getFutureDateString(7))

  // Campos de Devolución (HU10: Solo devolver completo o devolver una parte)
  const [tipoDevolucion, setTipoDevolucion] = React.useState<'DEVUELTO' | 'DEVUELTO_PARCIAL'>('DEVUELTO')
  const [incidenciaDevolucion, setIncidenciaDevolucion] = React.useState<string>('')

  // Estado del Checkbox para registrar múltiples solicitudes
  const [registrarOtra, setRegistrarOtra] = React.useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [feedbackSuccess, setFeedbackSuccess] = React.useState<string | null>(null)

  if (!reactivo) {
    return (
      <div className="min-h-screen w-full bg-[#FAF6F0] flex flex-col justify-between">
        <AppHeader />
        <main className="w-full max-w-[412px] mx-auto px-6 pt-12 flex-1 text-center">
          <p className="font-sans text-sm text-[#655D52] mb-6">
            No se ha seleccionado ningún reactivo o préstamo para gestionar.
          </p>
          <Button variant="default" onClick={() => navigate('/prestamos')}>
            Ir al listado de préstamos
          </Button>
        </main>
        <Navbar activeId="prestamos" fixed />
      </div>
    )
  }

  const maxStockNum =
    typeof reactivo.stock === 'number'
      ? reactivo.stock
      : Number.parseFloat(String(reactivo.stock)) || 100

  const handleBack = () => {
    navigate('/prestamos')
  }

  const handleConfirm = async () => {
    setErrorMessage(null)

    if (mode === 'devolver' && prestamoActivo) {
      setIsSubmitting(true)
      const cantOriginal = Number(prestamoActivo.cantidad) || 0
      const cantFinal =
        tipoDevolucion === 'DEVUELTO'
          ? cantOriginal
          : Math.min(Math.max(0.01, cantidad), cantOriginal)
      const estadoCierre: 'DEVUELTO' | 'DEVUELTO_PARCIAL' =
        cantFinal < cantOriginal ? 'DEVUELTO_PARCIAL' : 'DEVUELTO'

      const res = await registrarDevolucionPrestamoEnSupabase({
        prestamoId: prestamoActivo.id,
        cantidadDevuelta: cantFinal,
        estadoCierre,
        incidencia:
          incidenciaDevolucion.trim() ||
          (estadoCierre === 'DEVUELTO'
            ? 'Devolución completa del préstamo'
            : 'Devolución parcial del préstamo'),
        nombreResponsable: user?.username || 'Personal de Laboratorio',
      })
      setIsSubmitting(false)

      if (!res.success) {
        setErrorMessage(res.error || 'Error al registrar devolución.')
        return
      }

      navigate('/prestamos', {
        state: {
          successMessage: `Devolución de "${reactivo.nombre}" procesada exitosamente.`,
        },
      })
      return
    }

    // Modo solicitar (HU09): Datos tomados del usuario salvo cuando el administrador registra por su cuenta
    const finalNombre = isAdmin ? solicitanteNombre.trim() : user?.username || 'Usuario Registrado'
    const finalCedula = isAdmin ? solicitanteCedula.trim() : user?.cedula || 'S/C'
    const finalInstitucion = isAdmin
      ? solicitanteInstitucion.trim() || activeLab
      : user?.lab
        ? `${LABORATORIOS_INFO[user.lab].nombre} (${user.lab})`
        : `${LABORATORIOS_INFO[activeLab].nombre} (${activeLab})`
    const finalContacto = isAdmin
      ? solicitanteContacto.trim() || undefined
      : user?.contacto || user?.email || undefined

    if (isAdmin && (!finalNombre || !finalCedula)) {
      setErrorMessage('Ingresa el nombre y cédula del solicitante.')
      return
    }

    setIsSubmitting(true)
    const cantSolicitada = modalidad === 'FRASCO_COMPLETO' ? maxStockNum : cantidad

    const res = await registrarPrestamoEnSupabase({
      reactivoId: reactivo.id,
      lab: activeLab,
      solicitanteNombre: finalNombre,
      solicitanteCedula: finalCedula,
      solicitanteInstitucion: finalInstitucion,
      solicitanteContacto: finalContacto,
      tipoPrestamo: modalidad,
      cantidad: cantSolicitada,
      fechaEstimadaDevolucion: fechaEstimada,
      nombreRegistrador: user?.username || 'Personal de Laboratorio',
    })
    setIsSubmitting(false)

    if (!res.success) {
      setErrorMessage(res.error || 'No se pudo registrar el préstamo.')
      return
    }

    const unidadText = reactivo.unidad ? ` ${reactivo.unidad}` : ''
    if (registrarOtra) {
      setFeedbackSuccess(
        `Solicitud de ${cantSolicitada}${unidadText} de "${reactivo.nombre}" confirmada con éxito. Puedes registrar la siguiente solicitud.`,
      )
      setCantidad(1)
    } else {
      navigate('/prestamos', {
        state: {
          successMessage: `Préstamo de ${cantSolicitada}${unidadText} de "${reactivo.nombre}" registrado exitosamente.`,
        },
      })
    }
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
        <h1 className="font-serif text-[32px] sm:text-4xl font-bold text-primary tracking-tight mb-5 select-none">
          {mode === 'devolver' ? '¿Cuánto devolverás?' : '¿Cuánto solicitarás?'}
        </h1>

        {errorMessage && (
          <div
            role="alert"
            className="mb-4 rounded-input border border-alert-danger-border bg-alert-danger-bg px-4 py-3 text-xs font-semibold text-alert-danger-border"
          >
            {errorMessage}
          </div>
        )}

        {/* Mensaje de éxito si se registró una solicitud previa con "Registrar otra" activado */}
        {feedbackSuccess && (
          <div
            role="status"
            className="mb-4 flex items-center justify-between rounded-input border border-primary/20 bg-primary-light px-4 py-3 text-sm text-text-main shadow-sm animate-in fade-in"
          >
            <span className="font-sans font-medium text-xs sm:text-sm">
              {feedbackSuccess}
            </span>
            <button
              type="button"
              onClick={() => setFeedbackSuccess(null)}
              className="ml-2 text-text-muted hover:text-text-main text-xs font-semibold"
              aria-label="Cerrar notificación"
            >
              ✕
            </button>
          </div>
        )}

        {/* Tarjeta del Reactivo Seleccionado */}
        <div className="w-full mb-5">
          <ReactivoCard
            name={reactivo.nombre}
            code={reactivo.codigo}
            stock={reactivo.stock}
            unit={reactivo.unidad}
            details={reactivo.detalles}
            location={reactivo.ubicacion}
            expirationDate={reactivo.fechaVencimiento}
            salud={reactivo.salud ?? reactivo.rombo?.health}
            inflamabilidad={reactivo.inflamabilidad ?? reactivo.rombo?.flammability}
            reactividad={reactivo.reactividad ?? reactivo.rombo?.reactivity}
            especial={reactivo.especial ?? reactivo.rombo?.special}
            rombo={reactivo.rombo}
            showRombo={true}
            romboSize={54}
            className="w-full"
          />
        </div>

        {mode === 'solicitar' ? (
          <div className="w-full space-y-3 mb-4 bg-white p-4 rounded-2xl border border-[#655D52]/20">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setModalidad('FRACCION')}
                className={cn(
                  'py-2 px-3 rounded-xl border text-xs font-bold transition-all',
                  modalidad === 'FRACCION'
                    ? 'bg-primary text-white border-primary'
                    : 'bg-[#FAF6F0] text-text-main border-[#655D52]/25',
                )}
              >
                Porción
              </button>
              <button
                type="button"
                onClick={() => {
                  setModalidad('FRASCO_COMPLETO')
                  setCantidad(maxStockNum)
                }}
                className={cn(
                  'py-2 px-3 rounded-xl border text-xs font-bold transition-all',
                  modalidad === 'FRASCO_COMPLETO'
                    ? 'bg-primary text-white border-primary'
                    : 'bg-[#FAF6F0] text-text-main border-[#655D52]/25',
                )}
              >
                Frasco completo
              </button>
            </div>

            {isAdmin && (
              <>
                <InputField
                  id="movil-solicitante-nombre"
                  label="Nombre del Solicitante *"
                  placeholder="Ej. Dra. Carmen Morales"
                  value={solicitanteNombre}
                  onChange={(e) => setSolicitanteNombre(e.target.value)}
                />

                <div className="grid grid-cols-2 gap-2">
                  <InputField
                    id="movil-solicitante-cedula"
                    label="Cédula *"
                    placeholder="V-14892103"
                    value={solicitanteCedula}
                    onChange={(e) => setSolicitanteCedula(e.target.value)}
                  />
                  <InputField
                    id="movil-solicitante-institucion"
                    label="Laboratorio Destino"
                    placeholder="Ej. LEM / LEPA"
                    value={solicitanteInstitucion}
                    onChange={(e) => setSolicitanteInstitucion(e.target.value)}
                  />
                </div>

                <InputField
                  id="movil-solicitante-contacto"
                  label="Teléfono o Correo"
                  placeholder="0414-5551234 / correo@ucv.ve"
                  value={solicitanteContacto}
                  onChange={(e) => setSolicitanteContacto(e.target.value)}
                />
              </>
            )}

            <div>
              <label
                htmlFor="movil-fecha-estimada"
                className="block text-xs font-semibold text-text-main mb-1"
              >
                Fecha Estimada de Retorno
              </label>
              <input
                id="movil-fecha-estimada"
                type="date"
                value={fechaEstimada}
                onChange={(e) => setFechaEstimada(e.target.value)}
                className="h-10 w-full rounded-input border border-border bg-[#FAF6F0] px-3 text-xs text-text-main"
              />
            </div>
          </div>
        ) : (
          <div className="w-full space-y-3 mb-4 bg-white p-4 rounded-2xl border border-[#655D52]/20">
            <p className="text-xs text-text-main font-semibold">
              Solicitante: {prestamoActivo?.responsable} ({prestamoActivo?.solicitanteCedula})
            </p>
            <p className="text-xs text-text-muted">
              Cantidad prestada: {prestamoActivo?.cantidad} {prestamoActivo?.unidad ?? 'ml'} (
              {prestamoActivo?.modalidad === 'FRASCO_COMPLETO' ? 'Frasco completo' : 'Porción'})
            </p>

            {/* HU10: Solo devolver completo o devolver una parte */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setTipoDevolucion('DEVUELTO')
                  setCantidad(Number(prestamoActivo?.cantidad) || maxStockNum)
                }}
                className={cn(
                  'py-2 px-3 rounded-xl border text-xs font-bold transition-all',
                  tipoDevolucion === 'DEVUELTO'
                    ? 'bg-primary text-white border-primary'
                    : 'bg-[#FAF6F0] text-text-main border-[#655D52]/25',
                )}
              >
                Devolver completo
              </button>
              <button
                type="button"
                onClick={() => {
                  setTipoDevolucion('DEVUELTO_PARCIAL')
                  const total = Number(prestamoActivo?.cantidad) || maxStockNum
                  setCantidad(Number(Math.max(0.01, total / 2).toFixed(2)))
                }}
                className={cn(
                  'py-2 px-3 rounded-xl border text-xs font-bold transition-all',
                  tipoDevolucion === 'DEVUELTO_PARCIAL'
                    ? 'bg-primary text-white border-primary'
                    : 'bg-[#FAF6F0] text-text-main border-[#655D52]/25',
                )}
              >
                Devolver una parte
              </button>
            </div>

            <InputField
              id="movil-incidencia-devolucion"
              label="Incidencia o Nota de Retorno (Opcional)"
              placeholder="Ej. Parte consumida en ensayo / Devolución completa"
              value={incidenciaDevolucion}
              onChange={(e) => setIncidenciaDevolucion(e.target.value)}
            />
          </div>
        )}

        {/* Selector Numérico Stepper Centrado en Pantalla */}
        <div className="w-full flex justify-center items-center my-4 py-2">
          <Stepper
            value={
              (modalidad === 'FRASCO_COMPLETO' && mode === 'solicitar') ||
              (mode === 'devolver' && tipoDevolucion === 'DEVUELTO')
                ? mode === 'devolver'
                  ? Number(prestamoActivo?.cantidad) || maxStockNum
                  : maxStockNum
                : cantidad
            }
            onChange={(val) => {
              if (modalidad === 'FRASCO_COMPLETO' && mode === 'solicitar') return
              setCantidad(val)
              if (mode === 'devolver' && prestamoActivo) {
                const total = Number(prestamoActivo.cantidad) || maxStockNum
                setTipoDevolucion(val < total ? 'DEVUELTO_PARCIAL' : 'DEVUELTO')
              }
            }}
            min={0.01}
            max={
              mode === 'devolver' && prestamoActivo
                ? Number(prestamoActivo.cantidad) || maxStockNum
                : maxStockNum
            }
            size="lg"
            ariaLabel="Cantidad de reactivo"
            decrementAriaLabel="Disminuir cantidad"
            incrementAriaLabel="Aumentar cantidad"
          />
        </div>

        {/* Fila de Botones de Acción (60px de altura, rounded-[24px]) */}
        <div className="w-full grid grid-cols-2 gap-4 mb-6 pt-2">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={handleBack}
            className="w-full"
          >
            Volver
          </Button>

          <Button
            type="button"
            variant="default"
            size="lg"
            disabled={isSubmitting}
            onClick={() => void handleConfirm()}
            className="w-full"
          >
            {isSubmitting ? 'Procesando...' : 'Confirmar'}
          </Button>
        </div>

        {/* Checkbox para Registrar Otra Solicitud */}
        {mode === 'solicitar' && (
          <div className="w-full px-1">
            <Checkbox
              id="checkbox-registrar-otra"
              checked={registrarOtra}
              onChange={(e) => setRegistrarOtra(e.target.checked)}
              label="Registrar otra solicitud después de confirmar esta."
            />
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

export default PrestamosDetallePage
