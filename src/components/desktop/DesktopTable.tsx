import * as React from 'react'
import { cn } from '@/lib/utils'

export type DesktopTableColumnAlign = 'left' | 'center' | 'right'

/**
 * Definición de una columna para `DesktopTable`.
 */
export interface DesktopTableColumn<T> {
  /** Clave identificadora única de la columna */
  key: string
  /** Contenido o título de la cabecera */
  header: React.ReactNode
  /** Función para renderizar el contenido personalizado de la celda */
  render?: (row: T, index: number) => React.ReactNode
  /** Ancho fijo o porcentual de la columna (ej: '200px', '25%', 160) */
  width?: string | number
  /** Ancho mínimo de la columna */
  minWidth?: string | number
  /** Ancho máximo de la columna */
  maxWidth?: string | number
  /** Alineación del texto en la columna ('left' | 'center' | 'right') */
  align?: DesktopTableColumnAlign
  /** Clases CSS adicionales para la celda <td> */
  className?: string
  /** Clases CSS adicionales para el encabezado <th> */
  headerClassName?: string
}

/**
 * Propiedades del componente `DesktopTable`.
 */
export interface DesktopTableProps<T> {
  /** Lista de columnas a renderizar */
  columns: DesktopTableColumn<T>[]
  /** Conjunto de datos a mostrar */
  data: T[]
  /** Función para extraer la clave única de cada fila */
  keyExtractor?: (row: T, index: number) => string | number
  /** Callback al hacer clic en una fila */
  onRowClick?: (row: T, index: number) => void
  /** Mensaje o contenido cuando no hay datos */
  emptyMessage?: React.ReactNode
  /** Indica si la tabla está en estado de carga (muestra skeleton rows) */
  loading?: boolean
  /** Cantidad de filas skeleton durante la carga (por defecto 5) */
  skeletonRowCount?: number
  /** Clases CSS adicionales para el contenedor exterior de la tabla */
  className?: string
  /** Clases CSS adicionales para la etiqueta <table> */
  tableClassName?: string
  /** Clases CSS adicionales para la fila del encabezado (<tr> de <thead>) */
  headerRowClassName?: string
  /** Clases CSS o función generadora de clases para cada fila de datos */
  rowClassName?: string | ((row: T, index: number) => string)
}

function formatDimension(dim?: string | number): string | undefined {
  if (dim === undefined || dim === null) return undefined
  return typeof dim === 'number' ? `${dim}px` : dim
}

function getAlignmentClass(align?: DesktopTableColumnAlign): string {
  switch (align) {
    case 'center':
      return 'text-center'
    case 'right':
      return 'text-right'
    case 'left':
    default:
      return 'text-left'
  }
}

function renderCellContent<T>(
  column: DesktopTableColumn<T>,
  row: T,
  rowIndex: number
): React.ReactNode {
  if (column.render) {
    return column.render(row, rowIndex)
  }

  if (typeof row === 'object' && row !== null && column.key in row) {
    const value = (row as Record<string, unknown>)[column.key]
    if (value === null || value === undefined) {
      return null
    }
    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    ) {
      return String(value)
    }
    if (React.isValidElement(value)) {
      return value
    }
  }

  return null
}

/**
 * Componente `DesktopTable`:
 * Tabla con estilo institucional de escritorio basada en `src/DESKTOP_TABLA/Frame 58.svg`.
 * 
 * Características:
 * - Esquinas redondeadas de 20px (`rounded-[20px]`) con borde `#655D52]/40` y fondo blanco.
 * - Header de ~59px de altura con fondo `#FAF6F0` y borde separador `#655D52]/30`.
 * - Filas de datos de 60px de altura con borde inferior `#655D52]/20` y hover `#FAF6F0]/40`.
 * - Cero `any` con soporte genérico total `<T>`.
 */
export function DesktopTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  emptyMessage,
  loading = false,
  skeletonRowCount = 5,
  className,
  tableClassName,
  headerRowClassName,
  rowClassName,
}: DesktopTableProps<T>): React.ReactElement {
  const isClickable = Boolean(onRowClick)

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-[20px] border border-[#655D52]/40 bg-white shadow-none',
        className
      )}
    >
      <div className="w-full overflow-x-auto overflow-y-hidden">
        <table className={cn('w-full border-collapse text-left', tableClassName)}>
          <thead>
            <tr
              className={cn(
                'h-[59px] border-b border-[#655D52]/30 bg-[#FAF6F0]',
                headerRowClassName
              )}
            >
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  style={{
                    width: formatDimension(column.width),
                    minWidth: formatDimension(column.minWidth),
                    maxWidth: formatDimension(column.maxWidth),
                  }}
                  className={cn(
                    'px-6 py-3 font-sans font-semibold text-sm text-[#181C1B] tracking-wider uppercase select-none',
                    getAlignmentClass(column.align),
                    column.headerClassName
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: skeletonRowCount }).map((_, index) => (
                <tr
                  key={`skeleton-row-${index}`}
                  className="h-[60px] bg-white border-b border-[#655D52]/20 last:border-b-0"
                >
                  {columns.map((column) => (
                    <td
                      key={`skeleton-cell-${column.key}`}
                      style={{
                        width: formatDimension(column.width),
                        minWidth: formatDimension(column.minWidth),
                        maxWidth: formatDimension(column.maxWidth),
                      }}
                      className={cn(
                        'px-6 py-3.5 align-middle',
                        getAlignmentClass(column.align)
                      )}
                    >
                      <div
                        className={cn(
                          'h-4 animate-pulse rounded bg-[#655D52]/10',
                          column.align === 'center'
                            ? 'mx-auto w-16'
                            : column.align === 'right'
                            ? 'ml-auto w-20'
                            : 'w-3/4'
                        )}
                      />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="h-44 text-center font-sans text-sm text-text-muted px-6 py-8 align-middle"
                >
                  {emptyMessage ?? 'No hay registros disponibles.'}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => {
                const rowKey = keyExtractor
                  ? keyExtractor(row, rowIndex)
                  : typeof row === 'object' && row !== null && 'id' in row
                  ? String((row as Record<string, unknown>).id)
                  : rowIndex

                const customRowClass =
                  typeof rowClassName === 'function'
                    ? rowClassName(row, rowIndex)
                    : rowClassName

                return (
                  <tr
                    key={rowKey}
                    onClick={onRowClick ? () => onRowClick(row, rowIndex) : undefined}
                    onKeyDown={
                      onRowClick
                        ? (e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              onRowClick(row, rowIndex)
                            }
                          }
                        : undefined
                    }
                    tabIndex={isClickable ? 0 : undefined}
                    role={isClickable ? 'button' : undefined}
                    className={cn(
                      'h-[60px] bg-white border-b border-[#655D52]/20 last:border-b-0 transition-colors duration-150',
                      'hover:bg-[#FAF6F0]/40',
                      isClickable &&
                        'cursor-pointer focus:outline-none focus-visible:bg-[#FAF6F0]/60',
                      customRowClass
                    )}
                  >
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        style={{
                          width: formatDimension(column.width),
                          minWidth: formatDimension(column.minWidth),
                          maxWidth: formatDimension(column.maxWidth),
                        }}
                        className={cn(
                          'px-6 py-3.5 align-middle font-sans text-sm text-text-main',
                          getAlignmentClass(column.align),
                          column.className
                        )}
                      >
                        {renderCellContent(column, row, rowIndex)}
                      </td>
                    ))}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/**
 * Ícono de menú de acciones de tres barras horizontales redondeadas
 * extraído del diseño de `src/DESKTOP_TABLA/Frame 58.svg`.
 */
export function DesktopTableMenuIcon({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>): React.ReactElement {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
      {...props}
    >
      <rect x="3" y="4" width="14" height="2.5" rx="1.25" />
      <rect x="3" y="8.75" width="14" height="2.5" rx="1.25" />
      <rect x="3" y="13.5" width="14" height="2.5" rx="1.25" />
    </svg>
  )
}

export interface DesktopTableActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode
  label?: string
  variant?: 'default' | 'danger'
}

/**
 * Botón de acción para celdas de la columna de acciones en `DesktopTable`.
 * Detiene automáticamente la propagación de eventos para evitar activar `onRowClick`.
 */
export const DesktopTableActionButton = React.forwardRef<
  HTMLButtonElement,
  DesktopTableActionButtonProps
>(({ className, icon, label = 'Acciones', variant = 'default', onClick, ...props }, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onClick?.(e)
      }}
      aria-label={label}
      className={cn(
        'relative inline-flex items-center justify-center p-2 rounded-lg transition-colors duration-150',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        variant === 'danger'
          ? 'text-alert-danger-border hover:bg-alert-danger-bg'
          : 'text-[#655D52] hover:text-[#181C1B] hover:bg-[#655D52]/10',
        className
      )}
      {...props}
    >
      {icon ?? <DesktopTableMenuIcon className="w-5 h-5" />}
      {label && <span className="sr-only">{label}</span>}
    </button>
  )
})
DesktopTableActionButton.displayName = 'DesktopTableActionButton'
