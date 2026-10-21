import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { DesktopBitacoraPage } from './DesktopBitacoraPage'
import type { BitacoraConsumoFormData, ReactivoSummary } from '../types'

export interface DesktopBitacoraConsumoPageProps {
  reactivo?: ReactivoSummary
  initialData?: Partial<BitacoraConsumoFormData>
  onSubmit?: (data: BitacoraConsumoFormData) => void
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
 * DesktopBitacoraConsumoPage - Vista de escritorio para el registro / consumo en Bitácora
 *
 * Basada fielmente en el diseño oficial `BITACORA _ CONSUMO.svg`.
 */
export const DesktopBitacoraConsumoPage: React.FC<DesktopBitacoraConsumoPageProps> = ({
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
      initialCategory="consumo"
      defaultOpenModal={{
        type: 'consumo',
        item: {
          id: 'consumo-active',
          tipo: 'consumo',
          tipoLabel: 'Consumo',
          reactivoName: reactivo.name,
          reactivoCode: reactivo.code,
          responsable: initialData?.responsable ?? 'John Doe',
          fecha: initialData?.fecha ?? '10/06/2026',
          cantidad: initialData?.cantidad ?? '250 ml',
          observaciones:
            initialData?.observaciones ??
            'Consumo para titulación volumétrica en laboratorio',
          reactivo,
        },
      }}
      onItemClick={handleVolver}
    />
  )
}

export default DesktopBitacoraConsumoPage
