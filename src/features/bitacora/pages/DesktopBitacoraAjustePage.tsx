import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { DesktopBitacoraPage } from './DesktopBitacoraPage'
import type { BitacoraAjusteFormData, ReactivoSummary } from '../types'

export interface DesktopBitacoraAjustePageProps {
  reactivo?: ReactivoSummary
  initialData?: Partial<BitacoraAjusteFormData>
  onSubmit?: (data: BitacoraAjusteFormData) => void
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
 * DesktopBitacoraAjustePage - Vista de escritorio para el registro / ajuste en Bitácora
 *
 * Basada fielmente en el diseño oficial `BITACORA _ AJUSTE.svg`.
 */
export const DesktopBitacoraAjustePage: React.FC<DesktopBitacoraAjustePageProps> = ({
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
      initialCategory="ajuste"
      defaultOpenModal={{
        type: 'ajuste',
        item: {
          id: 'ajuste-active',
          tipo: 'ajuste',
          tipoLabel: 'Ajuste',
          reactivoName: reactivo.name,
          reactivoCode: reactivo.code,
          responsable: 'John Doe',
          fecha: initialData?.fecha ?? '09/06/2026',
          cantidad: initialData?.cantidad ?? '50 ml',
          observaciones:
            initialData?.observaciones ??
            'Ajuste de inventario por merma de almacenamiento',
          reactivo,
        },
      }}
      onItemClick={handleVolver}
    />
  )
}

export default DesktopBitacoraAjustePage
