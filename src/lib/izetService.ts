import { supabase } from './supabase'
import type { LabOption } from '@/features/auth/types'
import type { ReactivoItem, ReactivoFormData, CaducidadEstado, UbicacionItem } from '@/features/inventario/types'
import type { DashboardAlert, ConsumoReciente, Reactivo } from '@/features/consumo/types'
import type { DesktopBitacoraItem, BitacoraDateGroup, BitacoraEntry, BitacoraEntryType } from '@/features/bitacora/types'
import type { PrestamoItem, PrestamoReactivo, PrestamoEstado, ModalidadPrestamo } from '@/features/prestamos/types'
import type { AdminUsuarioItem, AdminUsuarioFormData } from '@/features/admin/types'

export type LaboratorioCodigo = LabOption

export const LABORATORIOS_INFO: Record<
  LabOption,
  { id: string; codigo: LabOption; nombre: string; nombreCorto: string }
> = {
  LEPA: {
    id: '43e531e5-6073-430e-ba2d-3f06bdc5a21a',
    codigo: 'LEPA',
    nombre: 'Laboratorio de Ecología de Plantas Acuáticas',
    nombreCorto: 'LEPA - Ecología de Plantas Acuáticas',
  },
  LEM: {
    id: 'e6cfa5a8-8aa6-4947-b58e-cec41591ceb1',
    codigo: 'LEM',
    nombre: 'Laboratorio de Ecología de Microorganismos',
    nombreCorto: 'LEM - Ecología de Microorganismos',
  },
}

export function getLabId(lab: LabOption): string {
  return LABORATORIOS_INFO[lab]?.id ?? LABORATORIOS_INFO.LEPA.id
}

export function getLabCodeById(id?: string | null): LabOption {
  if (id === LABORATORIOS_INFO.LEM.id) return 'LEM'
  return 'LEPA'
}

/**
 * Evalúa dinámicamente el estado de vencimiento frente a la fecha actual (HU08)
 * - Ignora reactivos sin fecha de vencimiento ('sin_vencimiento')
 * - 'vencido': fecha_vencimiento < hoy
 * - 'proximo_a_vencer': 0 <= días restantes <= 30
 * - 'vigente': > 30 días restantes
 */
export function evaluarCaducidad(fechaVencimiento?: string | null): {
  estado: CaducidadEstado
  diasRestantes: number | null
  label: string
} {
  if (!fechaVencimiento || !fechaVencimiento.trim() || fechaVencimiento === '—') {
    return { estado: 'sin_vencimiento', diasRestantes: null, label: 'Sin caducidad' }
  }

  const raw = fechaVencimiento.trim()
  let targetDate: Date | null = null

  // Soportar YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) {
    const [y, m, d] = raw.slice(0, 10).split('-').map(Number)
    targetDate = new Date(y, m - 1, d)
  } else if (/^\d{2}\/\d{4}$/.test(raw)) {
    // Soportar MM/YYYY
    const [m, y] = raw.split('/').map(Number)
    targetDate = new Date(y, m, 0) // último día del mes
  } else if (/^\d{2}\/\d{2}\/\d{4}$/.test(raw)) {
    // Soportar DD/MM/YYYY
    const [d, m, y] = raw.split('/').map(Number)
    targetDate = new Date(y, m - 1, d)
  } else {
    const parsed = new Date(raw)
    if (!Number.isNaN(parsed.getTime())) {
      targetDate = parsed
    }
  }

  if (!targetDate || Number.isNaN(targetDate.getTime())) {
    return { estado: 'sin_vencimiento', diasRestantes: null, label: 'Sin caducidad' }
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  targetDate.setHours(0, 0, 0, 0)

  const diffMs = targetDate.getTime() - today.getTime()
  const diasRestantes = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  if (diasRestantes < 0) {
    return {
      estado: 'vencido',
      diasRestantes,
      label: `Vencido hace ${Math.abs(diasRestantes)} día${Math.abs(diasRestantes) === 1 ? '' : 's'}`,
    }
  }

  if (diasRestantes <= 30) {
    return {
      estado: 'proximo_a_vencer',
      diasRestantes,
      label: diasRestantes === 0 ? 'Vence hoy' : `Vence en ${diasRestantes} día${diasRestantes === 1 ? '' : 's'}`,
    }
  }

  return {
    estado: 'vigente',
    diasRestantes,
    label: 'Vigente',
  }
}

/**
 * Evalúa estrictamente la condición de alerta de stock mínimo (HU07):
 * 0 < stock_actual <= umbral_minimo
 * (Nunca alerta sobre stock = 0 para evitar alertas sobre insumos sin existencia).
 */
export function tieneAlertaStockMinimo(stockActual: number, umbralMinimo: number): boolean {
  return stockActual > 0 && stockActual <= umbralMinimo
}

export function formatDateDisplay(isoOrDate?: string | null): string {
  if (!isoOrDate) return '—'
  if (/^\d{4}-\d{2}-\d{2}$/.test(isoOrDate)) {
    const [y, m, d] = isoOrDate.split('-')
    return `${d}/${m}/${y}`
  }
  const d = new Date(isoOrDate)
  if (Number.isNaN(d.getTime())) return isoOrDate
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}

export function formatDateTimeDisplay(iso?: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  const hours = String(d.getHours()).padStart(2, '0')
  const mins = String(d.getMinutes()).padStart(2, '0')
  return `${day}/${month}/${year} ${hours}:${mins}`
}

export function formatSpanishLongDate(iso?: string | null): string {
  if (!iso) return 'Fecha reciente'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('es-VE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

/**
 * Obtiene el inventario completo del laboratorio activo desde Supabase (HU02, HU03, HU04, HU07, HU08)
 */
export async function fetchInventarioLaboratorio(lab: LabOption): Promise<ReactivoItem[]> {
  const labId = getLabId(lab)

  const { data, error } = await supabase
    .from('stock_reactivos')
    .select(
      `
      id,
      reactivo_id,
      laboratorio_id,
      cantidad_actual,
      unidad_medida,
      ubicacion_fisica,
      umbral_minimo,
      fecha_vencimiento,
      lote,
      ultimo_precio_adquirido,
      moneda_precio,
      es_uso_comun,
      estado_fisico,
      updated_at,
      catalogo_reactivos (
        id,
        codigo_unico,
        nombre,
        formula_quimica,
        nfpa_salud,
        nfpa_inflamabilidad,
        nfpa_inestabilidad,
        nfpa_especial,
        es_regulado,
        entidades_regulatorias,
        es_uso_comun,
        ultimo_precio,
        moneda_precio,
        fecha_ultimo_precio,
        activo
      )
    `,
    )
    .eq('laboratorio_id', labId)
    .order('updated_at', { ascending: false })

  if (error || !data) {
    console.error('Error al cargar inventario desde Supabase:', error)
    return []
  }

  const items: ReactivoItem[] = []

  for (const row of data) {
    const cat = Array.isArray(row.catalogo_reactivos)
      ? row.catalogo_reactivos[0]
      : row.catalogo_reactivos

    if (!cat || !cat.activo) continue

    const stockNum = Number(row.cantidad_actual) || 0
    const umbralNum = Number(row.umbral_minimo) || 0
    const caducidad = evaluarCaducidad(row.fecha_vencimiento)
    const bajoStock = tieneAlertaStockMinimo(stockNum, umbralNum)

    items.push({
      id: row.id,
      reactivoId: cat.id,
      laboratorioId: row.laboratorio_id,
      nombre: cat.nombre,
      codigo: cat.codigo_unico,
      formulaQuimica: cat.formula_quimica ?? '',
      stock: stockNum,
      unidad: row.unidad_medida || 'ml',
      umbral: umbralNum,
      fechaVencimiento: row.fecha_vencimiento ?? '',
      ubicacion: row.ubicacion_fisica || 'Estante General',
      lote: row.lote ?? '',
      usoCompartido: Boolean(cat.es_uso_comun || row.es_uso_comun),
      esRegulado: Boolean(cat.es_regulado),
      entidadesRegulatorias: cat.entidades_regulatorias ?? [],
      ultimoPrecio: row.ultimo_precio_adquirido ?? cat.ultimo_precio ?? undefined,
      monedaPrecio: (row.moneda_precio || cat.moneda_precio || 'USD') as 'USD' | 'VES',
      fechaUltimoPrecio: cat.fecha_ultimo_precio ?? undefined,
      estadoFisico: (row.estado_fisico || 'DISPONIBLE') as 'DISPONIBLE' | 'EN_PRESTAMO' | 'AGOTADO',
      estado: bajoStock ? 'Bajo stock' : 'Disponible',
      caducidadEstado: caducidad.estado,
      diasParaVencer: caducidad.diasRestantes,
      caducidadLabel: caducidad.label,
      rombo: {
        health: (cat.nfpa_salud ?? 0) as 0 | 1 | 2 | 3 | 4,
        flammability: (cat.nfpa_inflamabilidad ?? 0) as 0 | 1 | 2 | 3 | 4,
        reactivity: (cat.nfpa_inestabilidad ?? 0) as 0 | 1 | 2 | 3 | 4,
        special: cat.nfpa_especial ?? undefined,
      },
      detalles: `${cat.formula_quimica ? `${cat.formula_quimica} • ` : ''}${row.ubicacion_fisica}${
        cat.es_regulado ? ` • Regulado (${(cat.entidades_regulatorias || []).join(', ')})` : ''
      }`,
    })
  }

  return items
}

/**
 * Obtiene el catálogo maestro unificado de reactivos de todos los laboratorios (HU02 y HU03)
 */
export async function fetchCatalogoMaestro() {
  const { data, error } = await supabase
    .from('catalogo_reactivos')
    .select('*')
    .eq('activo', true)
    .order('codigo_unico', { ascending: true })

  if (error || !data) {
    return []
  }
  return data
}

/**
 * Verifica en tiempo real si un código único ya existe en el catálogo centralizado (HU03.2)
 */
export async function verificarDisponibilidadCodigo(
  codigoUnico: string,
  excludeReactivoId?: string,
): Promise<{
  disponible: boolean
  reactivoExistente?: {
    id: string
    codigo_unico: string
    nombre: string
    formula_quimica: string | null
    es_uso_comun: boolean
    es_regulado: boolean
    entidades_regulatorias: string[]
    ultimo_precio: number | null
    moneda_precio: string | null
    nfpa_salud: number
    nfpa_inflamabilidad: number
    nfpa_inestabilidad: number
    nfpa_especial: string | null
  }
}> {
  const clean = codigoUnico.trim().toUpperCase()
  if (!clean) return { disponible: true }

  const { data, error } = await supabase
    .from('catalogo_reactivos')
    .select(
      'id, codigo_unico, nombre, formula_quimica, es_uso_comun, es_regulado, entidades_regulatorias, ultimo_precio, moneda_precio, nfpa_salud, nfpa_inflamabilidad, nfpa_inestabilidad, nfpa_especial',
    )
    .ilike('codigo_unico', clean)
    .limit(1)

  if (error || !data || data.length === 0) {
    return { disponible: true }
  }

  const found = data[0]
  if (excludeReactivoId && found.id === excludeReactivoId) {
    return { disponible: true }
  }

  return {
    disponible: false,
    reactivoExistente: found,
  }
}

/**
 * Guarda (crea o actualiza) un reactivo en el catálogo centralizado y su stock físico en el laboratorio activo (HU02, HU03, HU04)
 */
export async function guardarReactivoEnSupabase(
  lab: LabOption,
  formData: ReactivoFormData,
  options?: {
    reactivoId?: string
    responsable?: string
    motivoAjuste?: string
  },
): Promise<{ success: boolean; error?: string; reactivoId?: string }> {
  const labId = getLabId(lab)

  // Parsear stock y unidad si viene como "500ml" o separado
  const rawStock = String(formData.stockDisponible || '0').trim()
  const numericMatch = rawStock.match(/^([0-9]+(?:\.[0-9]+)?)\s*([a-zA-Z]+)?$/)
  const cantidadActual = numericMatch
    ? parseFloat(numericMatch[1])
    : parseFloat(rawStock) || 0
  const unidadExtraida =
    formData.unidadMedida ||
    (numericMatch && numericMatch[2] ? numericMatch[2] : 'ml')

  const umbralMinimo = parseFloat(String(formData.umbral || '0')) || 0
  const ultimoPrecio =
    formData.ultimoPrecio !== undefined && String(formData.ultimoPrecio).trim() !== ''
      ? parseFloat(String(formData.ultimoPrecio))
      : null

  // Normalizar fecha de vencimiento a YYYY-MM-DD o null
  let fechaVencimientoIso: string | null = null
  if (formData.fechaVencimiento && formData.fechaVencimiento.trim()) {
    const fv = formData.fechaVencimiento.trim()
    if (/^\d{4}-\d{2}-\d{2}$/.test(fv)) {
      fechaVencimientoIso = fv
    } else if (/^\d{2}\/\d{4}$/.test(fv)) {
      const [m, y] = fv.split('/')
      fechaVencimientoIso = `${y}-${m.padStart(2, '0')}-28`
    } else if (/^\d{2}\/\d{2}\/\d{4}$/.test(fv)) {
      const [d, m, y] = fv.split('/')
      fechaVencimientoIso = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`
    }
  }

  const { data, error } = await supabase.rpc('guardar_reactivo_inventario', {
    p_laboratorio_id: labId,
    p_codigo_unico: (formData.codigo || '').trim().toUpperCase(),
    p_nombre: formData.nombre.trim(),
    p_formula_quimica: formData.formulaQuimica?.trim() || 'N/A',
    p_nfpa_salud: Number(formData.rombo?.health ?? 0),
    p_nfpa_inflamabilidad: Number(formData.rombo?.flammability ?? 0),
    p_nfpa_inestabilidad: Number(formData.rombo?.reactivity ?? 0),
    p_nfpa_especial: formData.rombo?.special ? String(formData.rombo.special) : undefined,
    p_es_regulado: Boolean(formData.esRegulado),
    p_entidades_regulatorias: (formData.entidadesRegulatorias ?? []).filter(
      (e) => e === 'CICPC',
    ),
    p_es_uso_comun: Boolean(formData.usoCompartido),
    p_ultimo_precio: ultimoPrecio ?? undefined,
    p_moneda_precio: formData.monedaPrecio || 'USD',
    p_fecha_ultimo_precio: formData.fechaUltimoPrecio || new Date().toISOString().slice(0, 10),
    p_cantidad_actual: cantidadActual,
    p_unidad_medida: unidadExtraida,
    p_ubicacion_fisica: formData.ubicacion?.trim() || 'Sin ubicación especificada',
    p_umbral_minimo: umbralMinimo,
    p_fecha_vencimiento: fechaVencimientoIso ?? undefined,
    p_lote: formData.lote?.trim() || undefined,
    p_reactivo_id: options?.reactivoId,
    p_nombre_responsable: options?.responsable || 'Personal de Laboratorio',
    p_motivo_ajuste: options?.motivoAjuste,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  const res = data as { reactivo_id?: string } | null
  return { success: true, reactivoId: res?.reactivo_id }
}

/**
 * Baja lógica de un reactivo en el catálogo centralizado (HU02.1 y HU02.7)
 */
export async function darBajaLogicaReactivo(
  reactivoId: string,
  lab: LabOption,
  motivo: string,
  responsable?: string,
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.rpc('dar_baja_logica_reactivo', {
    p_reactivo_id: reactivoId,
    p_laboratorio_id: getLabId(lab),
    p_motivo: motivo,
    p_nombre_responsable: responsable || 'Administrador',
  })

  if (error) {
    return { success: false, error: error.message }
  }
  return { success: true }
}

/**
 * Elimina un reactivo del inventario/catálogo (y su stock en el laboratorio actual).
 */
export async function eliminarReactivo(
  reactivoId: string,
  lab?: LabOption,
): Promise<{ success: boolean; error?: string }> {
  const labId = lab ? getLabId(lab) : null
  const { data, error } = await (supabase.rpc as any)('eliminar_reactivo', {
    p_reactivo_id: reactivoId,
    p_laboratorio_id: labId,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  const res = data as { success?: boolean; error?: string } | null
  if (res && res.success === false) {
    return { success: false, error: res.error || 'Error al eliminar el reactivo' }
  }

  return { success: true }
}

/**
 * Genera las alertas activas del Dashboard para el laboratorio seleccionado:
 * - HU07: Alertas de stock mínimo estrictamente 0 < stock_actual <= umbral_minimo (una única advertencia fija por reactivo)
 * - HU08: Alertas de vencimiento ("Próximo a Vencer" <= 30 días como warning, y "Vencido" < 0 días como danger)
 */
export function construirAlertasReactivos(inventario: ReactivoItem[]): DashboardAlert[] {
  const alerts: DashboardAlert[] = []

  for (const item of inventario) {
    const stockNum = Number(item.stock) || 0
    const umbralNum = Number(item.umbral) || 0

    // 1. Alerta de Vencimiento (HU08)
    const caducidad = evaluarCaducidad(item.fechaVencimiento)
    if (caducidad.estado === 'vencido') {
      alerts.push({
        id: `exp-vencido-${item.reactivoId || item.id}`,
        category: 'reactivo',
        variant: 'danger',
        title: `Reactivo Vencido: ${item.nombre} (${item.codigo})`,
        description: `${caducidad.label} (Venció: ${formatDateDisplay(item.fechaVencimiento)}). Ubicación: ${item.ubicacion || 'Laboratorio'}. Requiere confirmación crítica antes de usarse.`,
      })
    } else if (caducidad.estado === 'proximo_a_vencer') {
      alerts.push({
        id: `exp-proximo-${item.reactivoId || item.id}`,
        category: 'reactivo',
        variant: 'warning',
        title: `Próximo a Vencer: ${item.nombre} (${item.codigo})`,
        description: `${caducidad.label} (Fecha límite: ${formatDateDisplay(item.fechaVencimiento)}). Stock actual: ${stockNum} ${item.unidad || 'ml'}.`,
      })
    }

    // 2. Alerta única y persistente de Stock Mínimo (HU07: estrictamente 0 < stock <= umbral)
    if (tieneAlertaStockMinimo(stockNum, umbralNum)) {
      alerts.push({
        id: `low-stock-${item.reactivoId || item.id}`,
        category: 'reactivo',
        variant: 'warning',
        title: `Escasez de Stock: ${item.nombre} (${item.codigo})`,
        description: `Existencia actual: ${stockNum} ${item.unidad || 'ml'} (Umbral mínimo: ${umbralNum} ${item.unidad || 'ml'}). Ubicación: ${item.ubicacion || 'Estante'}.`,
      })
    }
  }

  return alerts
}

/**
 * Convierte el inventario del laboratorio al formato `Reactivo` utilizado en las vistas de Consumo (HU05 y HU08)
 */
export function mapInventarioToConsumoReactivos(inventario: ReactivoItem[]): Reactivo[] {
  return inventario
    .filter((item) => Number(item.stock) > 0 && item.estadoFisico !== 'EN_PRESTAMO')
    .map((item) => {
      const cad = evaluarCaducidad(item.fechaVencimiento)
      return {
        id: item.reactivoId || item.id,
        stockId: item.id,
        name: item.nombre,
        code: item.codigo,
        stock: `${item.stock} ${item.unidad || 'ml'}`,
        stockNumeric: Number(item.stock) || 0,
        unit: item.unidad || 'ml',
        location: item.ubicacion,
        expirationDate: item.fechaVencimiento ? formatDateDisplay(item.fechaVencimiento) : undefined,
        rawExpirationDate: item.fechaVencimiento,
        caducidadEstado: cad.estado,
        caducidadLabel: cad.label,
        rombo: item.rombo,
        salud: item.rombo?.health ?? 0,
        inflamabilidad: item.rombo?.flammability ?? 0,
        reactividad: item.rombo?.reactivity ?? 0,
        especial: item.rombo?.special ? String(item.rombo.special) : undefined,
        details: `${item.formulaQuimica ? `${item.formulaQuimica} • ` : ''}${item.ubicacion || 'Estante'}`,
      }
    })
}

/**
 * Registra un consumo atómico de reactivo en Supabase (HU05)
 */
export async function registrarConsumoEnSupabase(params: {
  reactivoId: string
  lab: LabOption
  cantidad: number
  motivo?: string
  responsable?: string
}): Promise<{
  success: boolean
  error?: string
  stockPosterior?: number
}> {
  const { data, error } = await supabase.rpc('registrar_consumo_reactivo', {
    p_reactivo_id: params.reactivoId,
    p_laboratorio_id: getLabId(params.lab),
    p_cantidad: params.cantidad,
    p_motivo: params.motivo || 'Consumo operativo en ensayo de laboratorio',
    p_nombre_responsable: params.responsable || 'Personal de Laboratorio',
  })

  if (error) {
    return { success: false, error: error.message }
  }

  const result = data as { stock_posterior?: number } | null
  return {
    success: true,
    stockPosterior: result?.stock_posterior,
  }
}

/**
 * Obtiene el historial cronológico inmutable de la Bitácora desde Supabase (HU06)
 */
export async function fetchBitacoraMovimientos(
  labFilter: LabOption | 'TODOS' = 'LEPA',
): Promise<{
  desktopItems: DesktopBitacoraItem[]
  mobileGroups: BitacoraDateGroup[]
  consumosRecientes: ConsumoReciente[]
}> {
  let query = supabase
    .from('bitacora_movimientos')
    .select(
      `
      id,
      laboratorio_id,
      reactivo_id,
      usuario_id,
      nombre_responsable,
      tipo_movimiento,
      cantidad,
      unidad_medida,
      stock_anterior,
      stock_posterior,
      motivo,
      created_at,
      catalogo_reactivos (
        id,
        codigo_unico,
        nombre,
        formula_quimica,
        nfpa_salud,
        nfpa_inflamabilidad,
        nfpa_inestabilidad,
        nfpa_especial
      ),
      laboratorios (
        id,
        codigo,
        nombre
      )
    `,
    )
    .order('created_at', { ascending: false })

  if (labFilter !== 'TODOS') {
    query = query.eq('laboratorio_id', getLabId(labFilter))
  }

  const { data, error } = await query

  if (error || !data) {
    console.error('Error al consultar bitácora:', error)
    return { desktopItems: [], mobileGroups: [], consumosRecientes: [] }
  }

  const desktopItems: DesktopBitacoraItem[] = []
  const consumosRecientes: ConsumoReciente[] = []
  const groupMap = new Map<string, BitacoraEntry[]>()

  for (const row of data) {
    const cat = Array.isArray(row.catalogo_reactivos)
      ? row.catalogo_reactivos[0]
      : row.catalogo_reactivos
    const labObj = Array.isArray(row.laboratorios)
      ? row.laboratorios[0]
      : row.laboratorios

    const rawTipo = (row.tipo_movimiento || 'CONSUMO').toUpperCase()
    let tipo: BitacoraEntryType = 'consumo'
    let tipoLabel = 'Consumo'

    if (rawTipo === 'CONSUMO') {
      tipo = 'consumo'
      tipoLabel = 'Consumo'
    } else if (rawTipo === 'PRESTAMO_SALIDA') {
      tipo = 'prestamo'
      tipoLabel = 'Préstamo (Salida)'
    } else if (rawTipo === 'PRESTAMO_RETORNO') {
      tipo = 'prestamo'
      tipoLabel = 'Préstamo (Retorno)'
    } else if (rawTipo === 'INGRESO') {
      tipo = 'ajuste'
      tipoLabel = 'Ingreso de Stock'
    } else if (rawTipo === 'BAJA') {
      tipo = 'ajuste'
      tipoLabel = 'Baja Lógica'
    } else {
      tipo = 'ajuste'
      tipoLabel = 'Ajuste de Stock'
    }

    const reactivoName = cat?.nombre ?? 'Reactivo'
    const reactivoCode = cat?.codigo_unico ?? 'RC-000'
    const responsable = row.nombre_responsable || 'Personal de Laboratorio'
    const labCodigo = (labObj?.codigo as LabOption) || getLabCodeById(row.laboratorio_id)
    const cantidadStr = `${row.cantidad} ${row.unidad_medida}`
    const fechaCorta = formatDateDisplay(row.created_at)
    const fechaHora = formatDateTimeDisplay(row.created_at)
    const rawDateIso = row.created_at ? row.created_at.slice(0, 10) : ''

    const desktopItem: DesktopBitacoraItem = {
      id: row.id,
      tipo,
      tipoLabel,
      tipoMovimientoOriginal: rawTipo,
      reactivoName,
      reactivoCode,
      responsable,
      laboratorioCodigo: labCodigo,
      fecha: fechaCorta,
      fechaHora,
      rawDate: rawDateIso,
      cantidad: cantidadStr,
      stockAnterior: `${row.stock_anterior} ${row.unidad_medida}`,
      stockPosterior: `${row.stock_posterior} ${row.unidad_medida}`,
      observaciones:
        row.motivo ||
        `${tipoLabel} en ${labCodigo} (Stock: ${row.stock_anterior} → ${row.stock_posterior} ${row.unidad_medida})`,
      tipoPrestamo: rawTipo === 'PRESTAMO_RETORNO' ? 'Devolución' : 'Préstamo',
      estadoPrestamo: rawTipo === 'PRESTAMO_RETORNO' ? 'Devuelto / Cerrado' : 'Activo',
      reactivo: {
        id: cat?.id,
        name: reactivoName,
        code: reactivoCode,
        stock: `${row.stock_posterior} ${row.unidad_medida}`,
        unit: row.unidad_medida,
        salud: cat?.nfpa_salud ?? 0,
        inflamabilidad: cat?.nfpa_inflamabilidad ?? 0,
        reactividad: cat?.nfpa_inestabilidad ?? 0,
        especial: cat?.nfpa_especial ?? '',
      },
    }

    desktopItems.push(desktopItem)

    if (rawTipo === 'CONSUMO' && consumosRecientes.length < 10) {
      consumosRecientes.push({
        id: row.id,
        reactivoId: row.reactivo_id,
        reactivoName,
        code: reactivoCode,
        cantidad: cantidadStr,
        usuario: responsable,
        fecha: fechaHora,
        estado: 'confirmado',
      })
    }

    const groupDateLabel = formatSpanishLongDate(row.created_at)
    const entry: BitacoraEntry = {
      id: row.id,
      type: tipo,
      title: `${tipoLabel}: ${reactivoName} (${reactivoCode})`,
      reactivoCode,
      reactivoName,
      date: groupDateLabel,
      timestamp: fechaHora,
      user: `${responsable} (${labCodigo})`,
      quantity: `${cantidadStr} (Stock: ${row.stock_anterior} → ${row.stock_posterior} ${row.unidad_medida})`,
      observations: row.motivo || undefined,
    }

    const existing = groupMap.get(groupDateLabel) || []
    existing.push(entry)
    groupMap.set(groupDateLabel, existing)
  }

  const mobileGroups: BitacoraDateGroup[] = Array.from(groupMap.entries()).map(
    ([date, entries]) => ({
      date,
      entries,
    }),
  )

  return { desktopItems, mobileGroups, consumosRecientes }
}

/**
 * Obtiene la lista de préstamos desde Supabase para el laboratorio activo (HU09 y HU10)
 */
export async function fetchPrestamosLaboratorio(
  labFilter: LabOption | 'TODOS' = 'LEPA',
): Promise<PrestamoItem[]> {
  let query = supabase
    .from('prestamos')
    .select(
      `
      id,
      reactivo_id,
      laboratorio_origen_id,
      solicitante_nombre,
      solicitante_cedula,
      solicitante_institucion,
      solicitante_contacto,
      tipo_prestamo,
      cantidad_prestada,
      cantidad_devuelta,
      unidad_medida,
      fecha_prestamo,
      fecha_estimada_devolucion,
      fecha_devolucion_real,
      estado,
      observaciones,
      incidencia_devolucion,
      nombre_registrador,
      created_at,
      catalogo_reactivos (
        id,
        codigo_unico,
        nombre,
        nfpa_salud,
        nfpa_inflamabilidad,
        nfpa_inestabilidad,
        nfpa_especial
      ),
      laboratorios (
        id,
        codigo,
        nombre
      )
    `,
    )
    .order('created_at', { ascending: false })

  if (labFilter !== 'TODOS') {
    query = query.eq('laboratorio_origen_id', getLabId(labFilter))
  }

  const { data, error } = await query

  if (error || !data) {
    console.error('Error al cargar préstamos:', error)
    return []
  }

  const today = new Date().toISOString().slice(0, 10)

  return data.map((row) => {
    const cat = Array.isArray(row.catalogo_reactivos)
      ? row.catalogo_reactivos[0]
      : row.catalogo_reactivos
    const labObj = Array.isArray(row.laboratorios)
      ? row.laboratorios[0]
      : row.laboratorios

    const rawEstado = (row.estado || 'ACTIVO').toUpperCase()
    let estadoUi: PrestamoEstado = 'aprobado'

    if (
      rawEstado === 'DEVUELTO' ||
      rawEstado === 'DEVUELTO_PARCIAL' ||
      rawEstado === 'CONSUMIDO_TOTAL' ||
      rawEstado === 'EXTRAVIADO'
    ) {
      estadoUi = 'devuelto'
    } else if (rawEstado === 'VENCIDO') {
      estadoUi = 'vencido'
    } else if (rawEstado === 'PENDIENTE') {
      estadoUi = 'pendiente'
    } else {
      // Si está ACTIVO pero la fecha estimada ya pasó, mostrar como vencido
      if (row.fecha_estimada_devolucion && row.fecha_estimada_devolucion < today) {
        estadoUi = 'vencido'
      } else {
        estadoUi = 'aprobado'
      }
    }

    const modalidad: ModalidadPrestamo =
      row.tipo_prestamo === 'FRASCO_COMPLETO' ? 'FRASCO_COMPLETO' : 'FRACCION'

    return {
      id: row.id,
      reactivoId: row.reactivo_id,
      laboratorioCodigo: (labObj?.codigo as LabOption) || getLabCodeById(row.laboratorio_origen_id),
      responsable: row.solicitante_nombre,
      solicitanteCedula: row.solicitante_cedula,
      solicitanteContacto: row.solicitante_contacto ?? undefined,
      responsableRol: `${row.solicitante_cedula} • ${row.solicitante_institucion}`,
      material: cat?.nombre ?? 'Reactivo de Laboratorio',
      codigoReactivo: cat?.codigo_unico ?? 'RC-000',
      modalidad,
      modalidadLabel: modalidad === 'FRASCO_COMPLETO' ? 'Frasco completo' : 'Porción',
      cantidad: Number(row.cantidad_prestada) || 0,
      cantidadDevuelta: Number(row.cantidad_devuelta) || 0,
      unidad: row.unidad_medida || 'ml',
      fechaSolicitud: formatDateDisplay(row.fecha_prestamo),
      rawFechaSolicitud: row.fecha_prestamo ? row.fecha_prestamo.slice(0, 10) : '',
      fechaLimite: formatDateDisplay(row.fecha_estimada_devolucion),
      rawFechaLimite: row.fecha_estimada_devolucion ?? '',
      fechaDevolucionReal: row.fecha_devolucion_real
        ? formatDateDisplay(row.fecha_devolucion_real)
        : undefined,
      estado: estadoUi,
      estadoOriginal: rawEstado,
      departamento: row.solicitante_institucion,
      observaciones: row.observaciones ?? undefined,
      incidenciaDevolucion: row.incidencia_devolucion ?? undefined,
    }
  })
}

/**
 * Convierte el inventario disponible del laboratorio a `PrestamoReactivo[]` (HU09)
 */
export function mapInventarioToPrestamoReactivos(inventario: ReactivoItem[]): PrestamoReactivo[] {
  return inventario
    .filter((item) => Number(item.stock) > 0 && item.estadoFisico !== 'EN_PRESTAMO')
    .map((item) => ({
      id: item.reactivoId || item.id,
      stockId: item.id,
      nombre: item.nombre,
      codigo: item.codigo,
      stock: Number(item.stock) || 0,
      unidad: item.unidad || 'ml',
      detalles: item.detalles,
      ubicacion: item.ubicacion,
      fechaVencimiento: item.fechaVencimiento ? formatDateDisplay(item.fechaVencimiento) : undefined,
      usoCompartido: item.usoCompartido,
      rombo: item.rombo,
      salud: item.rombo?.health ?? 0,
      inflamabilidad: item.rombo?.flammability ?? 0,
      reactividad: item.rombo?.reactivity ?? 0,
      especial: item.rombo?.special ? String(item.rombo.special) : undefined,
    }))
}

/**
 * Registra un nuevo préstamo (Frasco Completo o Fracción) en Supabase (HU09)
 */
export async function registrarPrestamoEnSupabase(params: {
  reactivoId: string
  lab: LabOption
  solicitanteNombre: string
  solicitanteCedula: string
  solicitanteInstitucion: string
  solicitanteContacto?: string
  tipoPrestamo: ModalidadPrestamo
  cantidad: number
  fechaPrestamo?: string
  fechaEstimadaDevolucion: string
  observaciones?: string
  nombreRegistrador?: string
}): Promise<{ success: boolean; error?: string; prestamoId?: string }> {
  const { data, error } = await supabase.rpc('registrar_prestamo_reactivo', {
    p_reactivo_id: params.reactivoId,
    p_laboratorio_id: getLabId(params.lab),
    p_solicitante_nombre: params.solicitanteNombre,
    p_solicitante_cedula: params.solicitanteCedula || 'V-00000000',
    p_solicitante_institucion: params.solicitanteInstitucion || 'Laboratorio Interno',
    p_solicitante_contacto: params.solicitanteContacto,
    p_tipo_prestamo: params.tipoPrestamo,
    p_cantidad: params.cantidad,
    p_fecha_prestamo: params.fechaPrestamo
      ? new Date(params.fechaPrestamo).toISOString()
      : new Date().toISOString(),
    p_fecha_estimada_devolucion: params.fechaEstimadaDevolucion,
    p_observaciones: params.observaciones,
    p_nombre_registrador: params.nombreRegistrador,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  const res = data as { prestamo_id?: string } | null
  return { success: true, prestamoId: res?.prestamo_id }
}

/**
 * Registra la devolución y cierre de un préstamo activo en Supabase (HU10)
 */
export async function registrarDevolucionPrestamoEnSupabase(params: {
  prestamoId: string
  cantidadDevuelta: number
  estadoCierre?: 'DEVUELTO' | 'DEVUELTO_PARCIAL'
  incidencia?: string
  nombreResponsable?: string
}): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.rpc('registrar_devolucion_prestamo', {
    p_prestamo_id: params.prestamoId,
    p_cantidad_devuelta: params.cantidadDevuelta,
    p_estado_cierre: params.estadoCierre || 'DEVUELTO',
    p_incidencia: params.incidencia,
    p_nombre_responsable: params.nombreResponsable,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

// =========================================================================
// GESTIÓN DE UBICACIONES FÍSICAS (ADMIN / INVENTARIO)
// =========================================================================

export async function fetchUbicacionesLaboratorio(
  lab?: LabOption,
): Promise<UbicacionItem[]> {
  let query = supabase
    .from('ubicaciones' as any)
    .select('id, laboratorio_id, nombre, descripcion, activo, created_at, updated_at, laboratorios(codigo)')
    .order('nombre', { ascending: true })

  if (lab) {
    const labId = getLabId(lab)
    query = query.eq('laboratorio_id', labId)
  }

  const { data, error } = await query

  if (error || !data) {
    console.error('Error al cargar ubicaciones:', error)
    return []
  }

  return (data as any[]).map((row) => ({
    id: row.id,
    laboratorioId: row.laboratorio_id,
    laboratorioCodigo: row.laboratorios?.codigo as LabOption,
    nombre: row.nombre,
    descripcion: row.descripcion,
    activo: Boolean(row.activo),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }))
}

export async function crearUbicacionLaboratorio(
  lab: LabOption,
  nombre: string,
  descripcion?: string,
): Promise<{ success: boolean; error?: string; id?: string }> {
  const labId = getLabId(lab)
  const cleanNombre = nombre.trim()
  if (!cleanNombre) {
    return { success: false, error: 'El nombre de la ubicación es obligatorio.' }
  }

  const { data, error } = await supabase
    .from('ubicaciones' as any)
    .insert({
      laboratorio_id: labId,
      nombre: cleanNombre,
      descripcion: descripcion?.trim() || null,
      activo: true,
    })
    .select('id')
    .single()

  if (error) {
    if ((error as any).code === '23505') {
      return { success: false, error: 'Ya existe una ubicación con ese nombre en este laboratorio.' }
    }
    return { success: false, error: error.message }
  }

  return { success: true, id: (data as any)?.id }
}

export async function actualizarUbicacionLaboratorio(
  id: string,
  data: {
    nombre?: string
    descripcion?: string
    activo?: boolean
    laboratorioCodigo?: LabOption
  },
): Promise<{ success: boolean; error?: string }> {
  const updatePayload: Record<string, any> = {
    updated_at: new Date().toISOString(),
  }

  if (data.nombre !== undefined) {
    const clean = data.nombre.trim()
    if (!clean) return { success: false, error: 'El nombre no puede estar vacío.' }
    updatePayload.nombre = clean
  }
  if (data.descripcion !== undefined) {
    updatePayload.descripcion = data.descripcion?.trim() || null
  }
  if (data.activo !== undefined) {
    updatePayload.activo = data.activo
  }
  if (data.laboratorioCodigo) {
    updatePayload.laboratorio_id = getLabId(data.laboratorioCodigo)
  }

  const { error } = await supabase
    .from('ubicaciones' as any)
    .update(updatePayload)
    .eq('id', id)

  if (error) {
    if ((error as any).code === '23505') {
      return { success: false, error: 'Ya existe una ubicación con ese nombre en ese laboratorio.' }
    }
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function eliminarUbicacionLaboratorio(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  const { data: ubic } = await supabase
    .from('ubicaciones' as any)
    .select('nombre, laboratorio_id')
    .eq('id', id)
    .single()

  if (ubic) {
    const { count } = await supabase
      .from('stock_reactivos')
      .select('id', { count: 'exact', head: true })
      .eq('laboratorio_id', (ubic as any).laboratorio_id)
      .eq('ubicacion_fisica', (ubic as any).nombre)

    if (count && count > 0) {
      return {
        success: false,
        error: `No se puede eliminar la ubicación "${(ubic as any).nombre}" porque hay ${count} reactivo(s) almacenados en ella. Reasigna los reactivos primero.`,
      }
    }
  }

  const { error } = await supabase
    .from('ubicaciones' as any)
    .delete()
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

// =========================================================================
// GESTIÓN DE USUARIOS (ADMIN CRUD)
// =========================================================================

export async function fetchUsuariosAdmin(): Promise<AdminUsuarioItem[]> {
  const { data, error } = await (supabase.rpc as any)('admin_listar_usuarios')

  if (error || !data) {
    console.error('Error al listar usuarios admin:', error)
    return []
  }

  return (data as any[]).map((row) => ({
    id: row.id,
    email: row.email,
    nombreCompleto: row.nombre_completo,
    cedula: row.cedula || 'S/C',
    contacto: row.contacto,
    rol: row.rol || 'investigador',
    laboratorioId: row.laboratorio_id,
    laboratorioCodigo: (row.laboratorio_codigo || 'LEPA') as LabOption,
    createdAt: row.created_at,
  }))
}

export async function crearUsuarioAdmin(
  formData: AdminUsuarioFormData,
): Promise<{ success: boolean; error?: string; id?: string }> {
  const { data, error } = await (supabase.rpc as any)('admin_crear_usuario', {
    p_email: formData.email.trim(),
    p_password: formData.password || '',
    p_nombre_completo: formData.nombreCompleto.trim(),
    p_cedula: formData.cedula.trim(),
    p_contacto: formData.contacto?.trim() || '',
    p_rol: formData.rol,
    p_laboratorio_codigo: formData.laboratorioCodigo,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  const res = data as { success?: boolean; id?: string } | null
  return { success: true, id: res?.id }
}

export async function actualizarUsuarioAdmin(
  userId: string,
  formData: Partial<AdminUsuarioFormData>,
): Promise<{ success: boolean; error?: string }> {
  const { error } = await (supabase.rpc as any)('admin_actualizar_usuario', {
    p_user_id: userId,
    p_nombre_completo: formData.nombreCompleto?.trim() || '',
    p_cedula: formData.cedula?.trim() || '',
    p_contacto: formData.contacto?.trim() || '',
    p_rol: formData.rol || 'investigador',
    p_laboratorio_codigo: formData.laboratorioCodigo || 'LEPA',
    p_password: formData.password?.trim() || undefined,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function eliminarUsuarioAdmin(
  userId: string,
): Promise<{ success: boolean; error?: string }> {
  const { error } = await (supabase.rpc as any)('admin_eliminar_usuario', {
    p_user_id: userId,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}
