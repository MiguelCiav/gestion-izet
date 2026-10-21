import * as React from 'react'
import { cn } from '@/lib/utils'

export interface RomboValues {
  /** Riesgo a la salud (0 - 4), cuadrante izquierdo azul */
  health?: number | string
  /** Inflamabilidad (0 - 4), cuadrante superior rojo */
  flammability?: number | string
  /** Inestabilidad / Reactividad (0 - 4), cuadrante derecho amarillo */
  reactivity?: number | string
  /** Riesgo específico (W, OX, SA, COR, BIO, RAD, etc.), cuadrante inferior blanco */
  special?: string
}

export type RomboSize = 'xs' | 'sm' | 'md' | 'lg' | number

export interface RomboBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Objeto estructurado con los valores NFPA 704 */
  values?: RomboValues
  /** Riesgo a la salud (0-4, alias español) */
  salud?: number | string
  /** Inflamabilidad (0-4, alias español) */
  inflamabilidad?: number | string
  /** Reactividad (0-4, alias español) */
  reactividad?: number | string
  /** Riesgo específico (alias español: 'W', 'OX', 'COR', etc.) */
  especial?: string
  /** Tamaño del rombo: 'xs' (28px), 'sm' (44px), 'md' (68px), 'lg' (92px), o valor en píxeles */
  size?: RomboSize
  /** Mostrar u ocultar números dentro de los cuadrantes (por defecto true si hay valores) */
  showValues?: boolean
  /** Mostrar leyenda explicativa de los cuadrantes al lado o debajo */
  showLegend?: boolean
  /** Orientación de la leyenda cuando showLegend es true */
  legendPosition?: 'bottom' | 'right'
}

const SIZE_MAP: Record<'xs' | 'sm' | 'md' | 'lg', number> = {
  xs: 28,
  sm: 44,
  md: 68,
  lg: 92,
}

/**
 * RomboBadge - Componente que implementa el rombo de seguridad NFPA 704
 * basado en `COMPONENTE_ROMBO.svg` (68x68 viewBox).
 *
 * Cuadrantes:
 * - Superior (Rojo #EF4444): Inflamabilidad (0 - 4)
 * - Izquierdo (Azul #3B82F6): Salud (0 - 4)
 * - Derecho (Amarillo #EAB308): Inestabilidad/Reactividad (0 - 4)
 * - Inferior (Blanco #FFFFFF): Riesgo Específico (W, OX, SA, COR, etc.)
 */
export const RomboBadge = React.forwardRef<HTMLDivElement, RomboBadgeProps>(
  (
    {
      values,
      salud,
      inflamabilidad,
      reactividad,
      especial,
      size = 'md',
      showValues = true,
      showLegend = false,
      legendPosition = 'right',
      className,
      ...props
    },
    ref,
  ) => {
    // Normalizar valores entre props individuales y objeto values
    const healthVal = salud ?? values?.health
    const flammabilityVal = inflamabilidad ?? values?.flammability
    const reactivityVal = reactividad ?? values?.reactivity
    const specialVal = especial ?? values?.special

    const hasAnyValue =
      healthVal !== undefined ||
      flammabilityVal !== undefined ||
      reactivityVal !== undefined ||
      specialVal !== undefined

    const shouldRenderText = showValues && hasAnyValue

    const pixelSize = typeof size === 'number' ? size : SIZE_MAP[size] || 68

    // Detección de reactivo al agua (W con barra / W tachada)
    const isWaterReactive =
      typeof specialVal === 'string' &&
      (specialVal.toUpperCase() === 'W' ||
        specialVal === '<s>W</s>' ||
        specialVal === 'W_' ||
        specialVal === '₩')

    const accessibleDescription = `Rombo NFPA 704: Inflamabilidad ${
      flammabilityVal ?? 'N/A'
    }, Salud ${healthVal ?? 'N/A'}, Reactividad ${
      reactivityVal ?? 'N/A'
    }, Riesgo Específico ${specialVal ?? 'Ninguno'}`

    return (
      <div
        ref={ref}
        role="img"
        aria-label={accessibleDescription}
        className={cn(
          'inline-flex items-center gap-3',
          legendPosition === 'bottom' && 'flex-col items-center',
          className,
        )}
        {...props}
      >
        <svg
          width={pixelSize}
          height={pixelSize}
          viewBox="0 0 68 68"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0 drop-shadow-sm select-none"
        >
          {/* Cuadrante Izquierdo: Salud (Azul) */}
          <path
            d="M0.70711 33.9411L16.97 17.6782L33.2329 33.9411L16.97 50.204L0.70711 33.9411Z"
            fill="#3B82F6"
            stroke="#181C1B"
            strokeWidth="1.2"
          />

          {/* Cuadrante Superior: Inflamabilidad (Rojo) */}
          <path
            d="M17.6771 16.9711L33.94 0.708236L50.2029 16.9711L33.94 33.234L17.6771 16.9711Z"
            fill="#EF4444"
            stroke="#181C1B"
            strokeWidth="1.2"
          />

          {/* Cuadrante Derecho: Reactividad / Inestabilidad (Amarillo) */}
          <path
            d="M34.6471 33.9411L50.9099 17.6782L67.1728 33.9411L50.9099 50.204L34.6471 33.9411Z"
            fill="#EAB308"
            stroke="#181C1B"
            strokeWidth="1.2"
          />

          {/* Cuadrante Inferior: Riesgo Específico (Blanco) */}
          <path
            d="M17.6771 50.9111L33.94 34.6482L50.2029 50.9111L33.94 67.174L17.6771 50.9111Z"
            fill="white"
            stroke="#181C1B"
            strokeWidth="1.2"
          />

          {/* Textos de los cuadrantes si están disponibles */}
          {shouldRenderText && (
            <>
              {/* Salud (Izquierda - Azul) */}
              {healthVal !== undefined && (
                <text
                  x="16.97"
                  y="34.5"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="white"
                  fontSize="13"
                  fontWeight="bold"
                  fontFamily="system-ui, sans-serif"
                >
                  {healthVal}
                </text>
              )}

              {/* Inflamabilidad (Superior - Rojo) */}
              {flammabilityVal !== undefined && (
                <text
                  x="33.94"
                  y="17.5"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="white"
                  fontSize="13"
                  fontWeight="bold"
                  fontFamily="system-ui, sans-serif"
                >
                  {flammabilityVal}
                </text>
              )}

              {/* Reactividad (Derecha - Amarillo) */}
              {reactivityVal !== undefined && (
                <text
                  x="50.91"
                  y="34.5"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#181C1B"
                  fontSize="13"
                  fontWeight="bold"
                  fontFamily="system-ui, sans-serif"
                >
                  {reactivityVal}
                </text>
              )}

              {/* Riesgo Específico (Inferior - Blanco) */}
              {specialVal !== undefined && (
                <g>
                  <text
                    x="33.94"
                    y="51.5"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#181C1B"
                    fontSize={
                      String(specialVal).length > 2
                        ? '8.5'
                        : String(specialVal).length === 2
                        ? '10'
                        : '12'
                    }
                    fontWeight="bold"
                    fontFamily="system-ui, sans-serif"
                  >
                    {isWaterReactive ? 'W' : specialVal}
                  </text>
                  {isWaterReactive && (
                    <line
                      x1="27"
                      y1="51.5"
                      x2="41"
                      y2="51.5"
                      stroke="#181C1B"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  )}
                </g>
              )}
            </>
          )}
        </svg>

        {/* Leyenda opcional */}
        {showLegend && (
          <div className="flex flex-col text-xs space-y-1 font-sans text-text-muted">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#EF4444]" />
              <strong className="text-text-main font-medium">Inflamabilidad:</strong>{' '}
              {flammabilityVal ?? '0'}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#3B82F6]" />
              <strong className="text-text-main font-medium">Salud:</strong>{' '}
              {healthVal ?? '0'}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#EAB308]" />
              <strong className="text-text-main font-medium">Reactividad:</strong>{' '}
              {reactivityVal ?? '0'}
            </span>
            {specialVal && (
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-white border border-border" />
                <strong className="text-text-main font-medium">Especial:</strong>{' '}
                {isWaterReactive ? 'Reactivo con agua (<s>W</s>)' : specialVal}
              </span>
            )}
          </div>
        )}
      </div>
    )
  },
)

RomboBadge.displayName = 'RomboBadge'

/**
 * RomboIcon - Versión icono compacta pura sin textos, basada en `COMPONENTE_ROMBO.svg`
 */
export function RomboIcon({
  size = 24,
  className,
  ...props
}: React.SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 68 68"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0 select-none', className)}
      {...props}
    >
      <path
        d="M0.70711 33.9411L16.97 17.6782L33.2329 33.9411L16.97 50.204L0.70711 33.9411Z"
        fill="#3B82F6"
        stroke="#181C1B"
      />
      <path
        d="M17.6771 16.9711L33.94 0.708236L50.2029 16.9711L33.94 33.234L17.6771 16.9711Z"
        fill="#EF4444"
        stroke="#181C1B"
      />
      <path
        d="M34.6471 33.9411L50.9099 17.6782L67.1728 33.9411L50.9099 50.204L34.6471 33.9411Z"
        fill="#EAB308"
        stroke="#181C1B"
      />
      <path
        d="M17.6771 50.9111L33.94 34.6482L50.2029 50.9111L33.94 67.174L17.6771 50.9111Z"
        fill="white"
        stroke="#181C1B"
      />
    </svg>
  )
}
