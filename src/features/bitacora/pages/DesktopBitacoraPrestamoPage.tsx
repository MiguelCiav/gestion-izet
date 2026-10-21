import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { DesktopBitacoraPage } from './DesktopBitacoraPage'
import type { BitacoraPrestamoFormData, ReactivoSummary } from '../types'

export interface DesktopBitacoraPrestamoPageProps {
  reactivo?: ReactivoSummary
  initialData?: Partial<BitacoraPrestamoFormData>
  onVolver?: () => void
}

const DEFAULT_REACTIVO: ReactivoSummary = {
  name: 'Ácido Benzóico',
  code: 'XY-223',
  stock: '500 ml',
  salud: 2,
  inflamabilidad: 1,
  reactividad: 0,
  especial: '',
}

/**
 * DesktopBitacoraPrestamoPage - Vista de escritorio para el registro / préstamo en Bitácora
 *
 * Basada fielmente en el diseño oficial `BITACORA _ PRÉSTAMO.svg`.
 */
export const DesktopBitacoraPrestamoPage: React.FC<DesktopBitacoraPrestamoPageProps> = ({
  reactivo = DEFAULT_REACTIVO,
  initialData,
  onVolver,
}) => {
  const navigate = useNavigate()

  const handleVolver = () => {
    if (onVolver) {
      onVolver()
    } else {
      navigate('/bitacora')
    }
  }

  return (
    <DesktopBitacoraPage
      initialCategory="prestamo"
      defaultOpenModal={{
        type: 'prestamo',
        item: {
          id: 'prestamo-active',
          tipo: 'prestamo',
          tipoLabel: 'Préstamo',
          reactivoName: reactivo.name,
          reactivoCode: reactivo.code,
          responsable: initialData?.responsable ?? 'John Doe',
          fecha: initialData?.fecha ?? '05/06/2026',
          tipoPrestamo: initialData?.tipo ?? 'Interno',
          estadoPrestamo: initialData?.estado ?? 'Activo',
          cantidad: initialData?.cantidad ?? '100 ml',
          observaciones:
            initialData?.observaciones ??
            'Préstamo temporal a Laboratorio de Docencia',
          reactivo,
        },
      }}
      onItemClick={handleVolver}
    />
  )
}

export default DesktopBitacoraPrestamoPage
