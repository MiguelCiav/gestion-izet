import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Bell,
  ShieldAlert,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { InputField } from '@/components/ui/InputField'
import { RadioButton } from '@/components/ui/RadioButton'
import { Checkbox } from '@/components/ui/Checkbox'
import { IconWrapper } from '@/components/ui/IconWrapper'
import { FloatingButton } from '@/components/ui/FloatingButton'
import { SearchWrapper } from '@/components/ui/SearchWrapper'
import { Navbar } from '@/components/layout/Navbar'
import { Stepper, StepIndicator } from '@/components/ui/Stepper'
import { RomboBadge } from '@/components/ui/RomboBadge'
import { SectionCard, SectionHeader } from '@/components/ui/SectionCard'
import { ReactivoCard } from '@/components/ui/ReactivoCard'
import { Alert } from '@/components/ui/Alert'
import { AlertBitacora } from '@/components/ui/AlertBitacora'
import {
  ArchiveBoxIcon,
  ArrowRightIcon,
  ArrowsLeftRightIcon,
  BottleIcon,
  CheckIcon,
  ClipboardListIcon,
  DashboardBlocksIcon,
  EyeIcon,
  EyeOffIcon,
  FileTextIcon,
  FiltersIcon,
  FlaskIcon,
  MicroscopeIcon,
  MinusIcon,
  PlusIcon,
  RadioCheckIcon,
  RomboIcon,
  SearchIcon,
  SettingsIcon,
  ShoppingBagIcon,
  UserIcon,
} from '@/assets/icons'
import {
  DesktopCard,
  DesktopCardHeader,
  DesktopCardTitle,
  DesktopCardDescription,
  DesktopCardContent,
  DesktopCardFooter,
  DesktopTable,
  DesktopTableActionButton,
  type DesktopTableColumn,
  DesktopProfileIcon,
  DesktopActionButton,
  DesktopFilterButton,
  DesktopExportButton,
  DesktopNewButton,
  DesktopActionToolbar,
  DesktopSidebar,
  DesktopLayout,
} from '@/components/desktop'

interface DesktopSampleItem {
  id: string
  codigo: string
  nombre: string
  categoria: string
  stock: string
  estado: 'Disponible' | 'Por agotarse' | 'Crítico'
}

const DESKTOP_SAMPLE_COLUMNS: DesktopTableColumn<DesktopSampleItem>[] = [
  {
    key: 'codigo',
    header: 'Código',
    width: '120px',
    render: (row) => (
      <span className="font-mono font-medium text-xs text-text-muted bg-surface-card px-2 py-1 rounded border border-border-subtle">
        {row.codigo}
      </span>
    ),
  },
  {
    key: 'nombre',
    header: 'Reactivo',
    render: (row) => (
      <span className="font-serif font-bold text-text-main">
        {row.nombre}
      </span>
    ),
  },
  {
    key: 'categoria',
    header: 'Categoría',
    render: (row) => (
      <span className="text-text-muted">{row.categoria}</span>
    ),
  },
  {
    key: 'stock',
    header: 'Stock',
    render: (row) => (
      <span className="font-semibold text-text-main">{row.stock}</span>
    ),
  },
  {
    key: 'estado',
    header: 'Estado',
    render: (row) => (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
          row.estado === 'Disponible'
            ? 'bg-primary-light text-primary'
            : row.estado === 'Por agotarse'
            ? 'bg-alert-warning-bg text-alert-warning-border'
            : 'bg-alert-danger-bg text-alert-danger-border'
        }`}
      >
        {row.estado}
      </span>
    ),
  },
  {
    key: 'acciones',
    header: 'Acciones',
    align: 'right',
    width: '90px',
    render: (row) => (
      <DesktopTableActionButton
        aria-label={`Opciones de ${row.nombre}`}
        onClick={() => alert(`Acción para: ${row.nombre}`)}
      />
    ),
  },
]

const DESKTOP_SAMPLE_ROWS: DesktopSampleItem[] = [
  {
    id: '1',
    codigo: 'HCL-37',
    nombre: 'Ácido Clorhídrico 37%',
    categoria: 'Ácidos',
    stock: '2.5 L',
    estado: 'Disponible',
  },
  {
    id: '2',
    codigo: 'ACT-01',
    nombre: 'Acetona Grado Analítico',
    categoria: 'Solventes',
    stock: '500 ml',
    estado: 'Por agotarse',
  },
  {
    id: '3',
    codigo: 'NAOH-99',
    nombre: 'Hidróxido de Sodio',
    categoria: 'Bases',
    stock: '50 g',
    estado: 'Crítico',
  },
  {
    id: '4',
    codigo: 'ETOH-96',
    nombre: 'Etanol 96°',
    categoria: 'Alcoholes',
    stock: '5.0 L',
    estado: 'Disponible',
  },
]

export default function HomePage() {
  const [passwordValue, setPasswordValue] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const [wrapperSearch, setWrapperSearch] = useState('')
  const [filterActive, setFilterActive] = useState(false)
  const [activeNavTab, setActiveNavTab] = useState('inventario')
  const [navbarActive, setNavbarActive] = useState('inventario')
  const [stepperCount, setStepperCount] = useState(1)
  const [wizardStep, setWizardStep] = useState(2)
  const [selectedRadio, setSelectedRadio] = useState('comprobante')
  const [checkboxState, setCheckboxState] = useState({
    muestras: true,
    notificaciones: false,
  })

  const customIcons = [
    { name: 'Search', Icon: SearchIcon },
    { name: 'Filters', Icon: FiltersIcon },
    { name: 'Settings', Icon: SettingsIcon },
    { name: 'Eye', Icon: EyeIcon },
    { name: 'EyeOff', Icon: EyeOffIcon },
    { name: 'ArrowRight', Icon: ArrowRightIcon },
    { name: 'RadioCheck', Icon: RadioCheckIcon },
    { name: 'Check', Icon: CheckIcon },
    { name: 'Plus', Icon: PlusIcon },
    { name: 'Minus', Icon: MinusIcon },
    { name: 'User', Icon: UserIcon },
    { name: 'Arrows', Icon: ArrowsLeftRightIcon },
    { name: 'ArchiveBox', Icon: ArchiveBoxIcon },
    { name: 'Dashboard', Icon: DashboardBlocksIcon },
    { name: 'Clipboard', Icon: ClipboardListIcon },
    { name: 'ShoppingBag', Icon: ShoppingBagIcon },
    { name: 'Flask', Icon: FlaskIcon },
    { name: 'Microscope', Icon: MicroscopeIcon },
    { name: 'Bottle', Icon: BottleIcon },
    { name: 'Rombo', Icon: RomboIcon },
    { name: 'FileText', Icon: FileTextIcon },
  ]

  return (
    <main className="min-h-screen bg-background p-6 md:p-12 space-y-12 max-w-6xl mx-auto pb-32">
      {/* Encabezado Principal */}
      <header className="space-y-3 border-b border-border-subtle pb-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-primary font-semibold">
              Design System Showcase
            </span>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-text-main mt-1">
              Gestión IZET
            </h1>
          </div>
          <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary-light text-primary">
            Theme Active
          </span>
        </div>
        <p className="text-text-muted font-sans text-base md:text-lg max-w-2xl">
          Verificación visual de la paleta institucional, componentes solicitados e interacciones del sistema.
        </p>
      </header>

      {/* FEATURE: Autenticación & Onboarding */}
      <section className="rounded-card border-2 border-primary/30 bg-primary-light/20 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-subtle/50 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-primary font-bold">
                Feature Implementado
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-primary text-white">
                FDD • src/features/auth
              </span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-text-main mt-1">
              Pantallas de Autenticación y Onboarding
            </h2>
            <p className="font-sans text-xs md:text-sm text-text-muted mt-1">
              Implementadas fielmente según los diseños de <code>src/features/auth/AUTH/</code>.
            </p>
          </div>
          <Link
            to="/onboarding"
            className="inline-flex items-center justify-center h-10 px-5 rounded-full bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors"
          >
            Iniciar Asistente Completo →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <Link
            to="/login"
            className="group flex flex-col p-4 rounded-input border border-border-subtle bg-surface-card hover:border-primary hover:bg-primary-light/10 transition-all shadow-sm"
          >
            <span className="text-[11px] font-bold text-primary uppercase">Pantalla 1</span>
            <span className="font-serif text-lg font-bold text-text-main group-hover:text-primary transition-colors">
              Iniciar Sesión
            </span>
            <span className="text-xs text-text-muted mt-1">
              <code>INICIAR_SESION.svg</code>
            </span>
            <span className="mt-3 text-xs font-semibold text-primary inline-flex items-center gap-1">
              Ver pantalla &rarr;
            </span>
          </Link>

          <Link
            to="/auth/paso-1"
            className="group flex flex-col p-4 rounded-input border border-border-subtle bg-surface-card hover:border-primary hover:bg-primary-light/10 transition-all shadow-sm"
          >
            <span className="text-[11px] font-bold text-primary uppercase">Pantalla 2</span>
            <span className="font-serif text-lg font-bold text-text-main group-hover:text-primary transition-colors">
              Inicio Paso 1
            </span>
            <span className="text-xs text-text-muted mt-1">
              <code>INICIO_PASO_1.svg</code> (Laboratorio)
            </span>
            <span className="mt-3 text-xs font-semibold text-primary inline-flex items-center gap-1">
              Ver pantalla &rarr;
            </span>
          </Link>

          <Link
            to="/auth/paso-2"
            className="group flex flex-col p-4 rounded-input border border-border-subtle bg-surface-card hover:border-primary hover:bg-primary-light/10 transition-all shadow-sm"
          >
            <span className="text-[11px] font-bold text-primary uppercase">Pantalla 3</span>
            <span className="font-serif text-lg font-bold text-text-main group-hover:text-primary transition-colors">
              Inicio Paso 2
            </span>
            <span className="text-xs text-text-muted mt-1">
              <code>INICIO_PASO_2.svg</code> (Datos)
            </span>
            <span className="mt-3 text-xs font-semibold text-primary inline-flex items-center gap-1">
              Ver pantalla &rarr;
            </span>
          </Link>

          <Link
            to="/auth/paso-3"
            className="group flex flex-col p-4 rounded-input border border-border-subtle bg-surface-card hover:border-primary hover:bg-primary-light/10 transition-all shadow-sm"
          >
            <span className="text-[11px] font-bold text-primary uppercase">Pantalla 4</span>
            <span className="font-serif text-lg font-bold text-text-main group-hover:text-primary transition-colors">
              Inicio Paso 3
            </span>
            <span className="text-xs text-text-muted mt-1">
              <code>INICIO_PASO_3.svg</code> (Confirmación)
            </span>
            <span className="mt-3 text-xs font-semibold text-primary inline-flex items-center gap-1">
              Ver pantalla &rarr;
            </span>
          </Link>
        </div>

        {/* Desktop Auth Screens */}
        <div className="pt-4 border-t border-border-subtle/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                Vistas de Escritorio (Desktop)
              </span>
              <h3 className="font-serif text-lg font-bold text-text-main">
                Pantallas Desktop de Autenticación y Onboarding
              </h3>
              <p className="font-sans text-xs text-text-muted">
                Diseñadas para escritorio sobre fondo <code>#FAF6F0</code> utilizando <code>DesktopCard</code> y <code>StepIndicator</code>.
              </p>
            </div>
            <Link
              to="/desktop/onboarding"
              className="inline-flex items-center justify-center h-9 px-4 rounded-full bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors"
            >
              Asistente Desktop Completo →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/desktop/login"
              className="group flex flex-col p-4 rounded-input border border-border-subtle bg-surface-card hover:border-primary hover:bg-primary-light/10 transition-all shadow-sm"
            >
              <span className="text-[11px] font-bold text-primary uppercase">Desktop 1</span>
              <span className="font-serif text-base font-bold text-text-main group-hover:text-primary transition-colors">
                Desktop Login
              </span>
              <span className="text-xs text-text-muted mt-1">
                <code>INICIO DE SESIÓN.svg</code>
              </span>
              <span className="mt-3 text-xs font-semibold text-primary inline-flex items-center gap-1">
                Ver pantalla desktop &rarr;
              </span>
            </Link>

            <Link
              to="/desktop/auth/paso-1"
              className="group flex flex-col p-4 rounded-input border border-border-subtle bg-surface-card hover:border-primary hover:bg-primary-light/10 transition-all shadow-sm"
            >
              <span className="text-[11px] font-bold text-primary uppercase">Desktop 2</span>
              <span className="font-serif text-base font-bold text-text-main group-hover:text-primary transition-colors">
                Configuración Inicial 1
              </span>
              <span className="text-xs text-text-muted mt-1">
                <code>CONFIGURACIÓN INICIAL 1.svg</code>
              </span>
              <span className="mt-3 text-xs font-semibold text-primary inline-flex items-center gap-1">
                Ver pantalla desktop &rarr;
              </span>
            </Link>

            <Link
              to="/desktop/auth/paso-2"
              className="group flex flex-col p-4 rounded-input border border-border-subtle bg-surface-card hover:border-primary hover:bg-primary-light/10 transition-all shadow-sm"
            >
              <span className="text-[11px] font-bold text-primary uppercase">Desktop 3</span>
              <span className="font-serif text-base font-bold text-text-main group-hover:text-primary transition-colors">
                Configuración Inicial 2
              </span>
              <span className="text-xs text-text-muted mt-1">
                <code>CONFIGURACIÓN INICIAL 2.svg</code>
              </span>
              <span className="mt-3 text-xs font-semibold text-primary inline-flex items-center gap-1">
                Ver pantalla desktop &rarr;
              </span>
            </Link>

            <Link
              to="/desktop/auth/paso-3"
              className="group flex flex-col p-4 rounded-input border border-border-subtle bg-surface-card hover:border-primary hover:bg-primary-light/10 transition-all shadow-sm"
            >
              <span className="text-[11px] font-bold text-primary uppercase">Desktop 4</span>
              <span className="font-serif text-base font-bold text-text-main group-hover:text-primary transition-colors">
                Configuración Inicial 3
              </span>
              <span className="text-xs text-text-muted mt-1">
                <code>CONFIGURACIÓN INICIAL 3.svg</code>
              </span>
              <span className="mt-3 text-xs font-semibold text-primary inline-flex items-center gap-1">
                Ver pantalla desktop &rarr;
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES: Módulos Principales de la Aplicación */}
      <section className="rounded-card border-2 border-primary/20 bg-surface-card p-6 space-y-4">
        <div className="border-b border-border-subtle/50 pb-3">
          <span className="text-xs uppercase tracking-wider text-primary font-bold">
            Navegación del Sistema
          </span>
          <h2 className="font-serif text-2xl font-bold text-text-main mt-1">
            Features Principales de Gestión IZET
          </h2>
          <p className="font-sans text-xs md:text-sm text-text-muted mt-1">
            Acceso directo a las pantallas de los 4 módulos implementados en paralelo por los agentes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {/* Módulo 1: Inventario */}
          <div className="group flex flex-col p-5 rounded-input border border-border-subtle bg-surface hover:border-primary transition-all">
            <span className="text-[11px] font-bold text-primary uppercase">Módulo 1</span>
            <span className="font-serif text-xl font-bold text-text-main group-hover:text-primary transition-colors">
              Inventario
            </span>
            <span className="text-xs text-text-muted mt-1">
              Hub y reactivos (móvil) / Tabla completa con Rombo NFPA y drawers (desktop).
            </span>
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <Link
                to="/inventario"
                className="text-xs font-semibold text-primary inline-flex items-center gap-1 hover:underline"
              >
                Móvil &rarr;
              </Link>
              <span className="text-border-subtle/70">&bull;</span>
              <Link
                to="/desktop/inventario"
                className="text-xs font-semibold text-primary inline-flex items-center gap-1 hover:underline"
              >
                Desktop &rarr;
              </Link>
            </div>
          </div>

          {/* Módulo 2: Bitácora */}
          <div className="group flex flex-col p-5 rounded-input border border-border-subtle bg-surface hover:border-primary transition-all">
            <span className="text-[11px] font-bold text-primary uppercase">Módulo 2</span>
            <span className="font-serif text-xl font-bold text-text-main group-hover:text-primary transition-colors">
              Bitácora
            </span>
            <span className="text-xs text-text-muted mt-1">
              Historial de movimientos, ajustes, consumos y préstamos registrados.
            </span>
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <Link
                to="/bitacora"
                className="text-xs font-semibold text-primary inline-flex items-center gap-1 hover:underline"
              >
                Móvil &rarr;
              </Link>
              <span className="text-border-subtle/70">&bull;</span>
              <Link
                to="/desktop/bitacora"
                className="text-xs font-semibold text-primary inline-flex items-center gap-1 hover:underline"
              >
                Desktop &rarr;
              </Link>
            </div>
          </div>

          {/* Módulo 3: Dashboard / Consumo */}
          <div className="group flex flex-col p-5 rounded-input border border-border-subtle bg-surface hover:border-primary transition-all">
            <span className="text-[11px] font-bold text-primary uppercase">Módulo 3</span>
            <span className="font-serif text-xl font-bold text-text-main group-hover:text-primary transition-colors">
              Dashboard / Consumo
            </span>
            <span className="text-xs text-text-muted mt-1">
              Alertas de reactivos y equipos, registro de consumo con Stepper.
            </span>
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <Link
                to="/dashboard"
                className="text-xs font-semibold text-primary inline-flex items-center gap-1 hover:underline"
              >
                Móvil &rarr;
              </Link>
              <span className="text-border-subtle/70">&bull;</span>
              <Link
                to="/desktop/dashboard"
                className="text-xs font-semibold text-primary inline-flex items-center gap-1 hover:underline"
              >
                Desktop &rarr;
              </Link>
              <span className="text-border-subtle/70">&bull;</span>
              <Link
                to="/desktop/consumo"
                className="text-xs font-semibold text-primary inline-flex items-center gap-1 hover:underline"
              >
                Consumo &rarr;
              </Link>
            </div>
          </div>

          {/* Módulo 4: Préstamos */}
          <div className="group flex flex-col p-5 rounded-input border border-border-subtle bg-surface hover:border-primary transition-all">
            <span className="text-[11px] font-bold text-primary uppercase">Módulo 4</span>
            <span className="font-serif text-xl font-bold text-text-main group-hover:text-primary transition-colors">
              Préstamos
            </span>
            <span className="text-xs text-text-muted mt-1">
              Catálogo de reactivos y solicitud de préstamo con cantidad y confirmación.
            </span>
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <Link
                to="/prestamos"
                className="text-xs font-semibold text-primary inline-flex items-center gap-1 hover:underline"
              >
                Móvil &rarr;
              </Link>
              <span className="text-border-subtle/70">&bull;</span>
              <Link
                to="/desktop/prestamos"
                className="text-xs font-semibold text-primary inline-flex items-center gap-1 hover:underline"
              >
                Desktop &rarr;
              </Link>
              <span className="text-border-subtle/70">&bull;</span>
              <Link
                to="/desktop/prestamos/solicitar"
                className="text-xs font-semibold text-primary inline-flex items-center gap-1 hover:underline"
              >
                Solicitar &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* COMPONENTE: SearchWrapper */}
      <section className="rounded-card border border-border-subtle bg-surface-card p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-subtle/50 pb-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-text-main">
              Componente Global: SearchWrapper
            </h2>
            <p className="font-sans text-xs md:text-sm text-text-muted mt-1">
              Extraído de <code>COMPONENTE_SEARCH_WRAPPER.svg</code>. Barra de búsqueda y botón de filtro con toque limpio sin sombreados de fondo.
            </p>
          </div>
          <span className="self-start sm:self-auto px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-light text-primary">
            COMPONENTE_SEARCH_WRAPPER
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
              Búsqueda con Filtro (Toque Limpio)
            </h4>
            <SearchWrapper
              value={wrapperSearch}
              onChange={(e) => setWrapperSearch(e.target.value)}
              onFilterClick={() => setFilterActive((prev) => !prev)}
              placeholder="Buscar..."
            />
            <p className="text-xs text-text-muted">
              Consulta actual: <code>{wrapperSearch || '(vacío)'}</code>
              {filterActive && ' • Filtro presionado'}
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
              Estado Deshabilitado
            </h4>
            <SearchWrapper
              disabled
              defaultValue="Filtro no disponible"
              placeholder="Buscar..."
            />
            <p className="text-xs text-text-muted">
              Deshabilita tanto el input como el disparador del panel de filtros.
            </p>
          </div>
        </div>
      </section>

      {/* COMPONENTE: RadioButton con Texto */}
      <section className="rounded-card border border-border-subtle bg-surface-card p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-subtle/50 pb-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-text-main">
              Componente Global: RadioButton con Texto
            </h2>
            <p className="font-sans text-xs md:text-sm text-text-muted mt-1">
              Refinado según las especificaciones de <code>COMPONENTE_RADIO_BUTTON.svg</code> y <code>COMPONENTE_RADIO_BUTTON_TEXT.svg</code>: un solo nivel de texto, círculo de 24px, estado base <code>#655D52</code> y estado activo en verde <code>#4A7C59</code> con el <strong>check blanco interior original</strong>.
            </p>
          </div>
          <span className="self-start sm:self-auto px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-light text-primary">
            COMPONENTE_RADIO_BUTTON
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
              Grupo de Opciones (Un solo nivel de texto)
            </h4>
            <div className="space-y-3 rounded-input border border-border-subtle bg-surface p-5">
              <RadioButton
                name="tipo-comprobante"
                value="comprobante"
                checked={selectedRadio === 'comprobante'}
                onChange={() => setSelectedRadio('comprobante')}
                label="Registrar otro comprobante de pago"
              />

              <div className="border-t border-border-subtle/60 pt-3">
                <RadioButton
                  name="tipo-comprobante"
                  value="tramite"
                  checked={selectedRadio === 'tramite'}
                  onChange={() => setSelectedRadio('tramite')}
                  label="Asociar a trámite existente"
                />
              </div>

              <div className="border-t border-border-subtle/60 pt-3">
                <RadioButton
                  name="tipo-comprobante"
                  value="deshabilitado"
                  disabled
                  label="Opción deshabilitada en este ciclo"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
              Estados Visuales Fieles al SVG
            </h4>
            <div className="flex flex-col gap-4 p-5 rounded-input border border-border-subtle bg-surface-card">
              <div className="flex items-center gap-3">
                <RadioButton name="demo-uncheck" defaultChecked={false} label="Estado 1: No Seleccionado (fill: #655D52)" />
              </div>

              <div className="flex items-center gap-3">
                <RadioButton name="demo-check" defaultChecked={true} label="Estado 2: Seleccionado (#4A7C59 + check blanco)" />
              </div>

              <div className="pt-2 text-xs text-text-muted">
                Opción activa seleccionada:&nbsp;
                <strong className="text-primary font-semibold">{selectedRadio}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMPONENTE: Checkbox (COMPONENTE_CHECK.svg) */}
      <section className="rounded-card border border-border-subtle bg-surface-card p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-subtle/50 pb-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-text-main">
              Componente Global: Checkbox
            </h2>
            <p className="font-sans text-xs md:text-sm text-text-muted mt-1">
              Basado en <code>COMPONENTE_CHECK.svg</code>: caja cuadrada de 18x18px, esquinas redondeadas <code>rx: 3px / rounded-[4px]</code>, borde de 2px con color <code>#C1C9BF</code> en estado no seleccionado y fondo verde primary <code>#446E53</code> con check blanco centrado en estado seleccionado. Soporta CVA, estados interactivos e indeterminado.
            </p>
          </div>
          <span className="self-start sm:self-auto px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-light text-primary">
            COMPONENTE_CHECK
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
              Interactivo y Opciones
            </h4>
            <div className="space-y-3 rounded-input border border-border-subtle bg-surface p-5">
              <Checkbox
                id="check-muestras"
                checked={checkboxState.muestras}
                onChange={(e) =>
                  setCheckboxState((prev) => ({ ...prev, muestras: e.target.checked }))
                }
                label="Registratorio de muestras para análisis"
                description="Habilita el seguimiento de reactivos e inventario."
              />

              <div className="border-t border-border-subtle/60 pt-3">
                <Checkbox
                  id="check-notificaciones"
                  checked={checkboxState.notificaciones}
                  onChange={(e) =>
                    setCheckboxState((prev) => ({ ...prev, notificaciones: e.target.checked }))
                  }
                  label="Recibir notificaciones por correo electrónico"
                />
              </div>

              <div className="border-t border-border-subtle/60 pt-3">
                <Checkbox
                  id="check-disabled"
                  disabled
                  label="Opción no disponible para este usuario"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
              Estados Visuales
            </h4>
            <div className="flex flex-col gap-4 p-5 rounded-input border border-border-subtle bg-surface-card">
              <div className="flex items-center gap-3">
                <Checkbox defaultChecked={false} label="No seleccionado: 18x18px, borde 2px #C1C9BF" />
              </div>

              <div className="flex items-center gap-3">
                <Checkbox defaultChecked={true} label="Seleccionado: Fondo #446E53 + check blanco" />
              </div>

              <div className="flex items-center gap-3">
                <Checkbox indeterminate label="Indeterminado: Fondo #446E53 + guión blanco" />
              </div>

              <div className="flex items-center gap-3">
                <Checkbox disabled defaultChecked={true} label="Deshabilitado seleccionado" />
              </div>

              <div className="flex items-center gap-3">
                <Checkbox error="Campo obligatorio" label="Con error de validación" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMPONENTE: BOTONES (COMPONENTE_BOTON.svg) */}
      <section className="rounded-card border border-border-subtle bg-surface-card p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-subtle/50 pb-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-text-main">
              Componente Global: Button
            </h2>
            <p className="font-sans text-xs md:text-sm text-text-muted mt-1">
              Fielmente adaptado a las especificaciones de <code>COMPONENTE_BOTON.svg</code>: altura de 60px, esquinas redondeadas <code>rx: 24px</code>, variantes <strong>Primary</strong>, <strong>Primary con Icono</strong> y <strong>Outline</strong>.
            </p>
          </div>
          <span className="self-start sm:self-auto px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-light text-primary">
            COMPONENTE_BOTON
          </span>
        </div>

        <div className="space-y-8">
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
              Variantes Principales del SVG (h=60px, rx=24px)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <span className="text-xs text-text-muted block font-mono">1. Primary (Default)</span>
                <Button size="lg" fullWidth>
                  Iniciar Sesión
                </Button>
              </div>

              <div className="space-y-2">
                <span className="text-xs text-text-muted block font-mono">2. Primary con Arrow Icon</span>
                <Button size="lg" fullWidth rightIcon={<ArrowRightIcon className="h-4 w-4" />}>
                  Iniciar Sesión
                </Button>
              </div>

              <div className="space-y-2">
                <span className="text-xs text-text-muted block font-mono">3. Outline (Border #4A4E4A)</span>
                <Button size="lg" variant="outline" fullWidth>
                  Iniciar Sesión
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-border-subtle">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
              Tamaños y Estados Complementarios
            </h4>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="default" variant="secondary">Secundario</Button>
              <Button size="default" variant="ghost">Ghost</Button>
              <Button
                size="default"
                variant="danger"
                leftIcon={<ShieldAlert className="h-4 w-4" />}
              >
                Eliminar
              </Button>
              <Button size="icon" variant="outline" aria-label="Notificaciones">
                <Bell className="h-4 w-4" />
              </Button>
              <Button size="default" disabled>
                Deshabilitado
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* COMPONENTE: InputField (Clave y Búsqueda) */}
      <section className="rounded-card border border-border-subtle bg-surface-card p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-subtle/50 pb-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-text-main">
              Componente Global: InputField
            </h2>
            <p className="font-sans text-xs md:text-sm text-text-muted mt-1">
              Extraído fielmente de <code>COMPONENT_INPUT_FIELD.svg</code>. Soporta variantes <strong>Clave (password con toggle de ojo alineado)</strong> y <strong>Búsqueda (con icono de lupa)</strong>.
            </p>
          </div>
          <span className="self-start sm:self-auto px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-light text-primary">
            COMPONENT_INPUT_FIELD
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
              Variante 1: Clave (Password)
            </h4>
            <InputField
              label="Contraseña de Acceso"
              variant="password"
              placeholder="Ingresa tu contraseña"
              value={passwordValue}
              onChange={(e) => setPasswordValue(e.target.value)}
              hint="Haz clic en el icono del ojo para alternar la visibilidad."
            />

            <InputField
              label="Contraseña con Error"
              variant="password"
              defaultValue="123456"
              error="La contraseña debe tener al menos 8 caracteres."
            />
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
              Variante 2: Búsqueda (Search)
            </h4>
            <InputField
              label="Búsqueda de Registros"
              variant="search"
              placeholder="Buscar..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              hint="Incluye la lupa fija al extremo derecho según la especificación visual."
            />

            <InputField
              label="Búsqueda Deshabilitada"
              variant="search"
              disabled
              value="Filtro no disponible en este momento"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between border-t border-border-subtle pt-4 text-xs text-text-muted">
          <span>Clave actual: {passwordValue ? '••••••••' : '(vacío)'}</span>
          <span>Búsqueda actual: {searchValue || '(vacío)'}</span>
        </div>
      </section>

      {/* Grid de Íconos Extraídos de Assets */}
      <section className="rounded-card border border-border-subtle bg-surface-card p-6 space-y-6">
        <div className="border-b border-border-subtle/50 pb-4">
          <h2 className="font-serif text-xl font-bold text-text-main">
            Íconos Personalizados del Sistema
          </h2>
          <p className="font-sans text-xs md:text-sm text-text-muted mt-1">
            Íconos vectoriales SVG separados individualmente en <code>src/assets/icons/</code> y consumibles directamente como componentes React.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {customIcons.map(({ name, Icon }) => (
            <div
              key={name}
              className="flex flex-col items-center justify-center p-4 rounded-input border border-border-subtle bg-surface hover:bg-primary-light/30 transition-colors group cursor-pointer"
            >
              <Icon className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
              <span className="mt-2 text-xs font-medium text-text-muted group-hover:text-text-main">
                {name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* COMPONENTE: IconWrapper (COMPONENTE_ICON_WRAPPER.svg) */}
      <section className="rounded-card border border-border-subtle bg-surface-card p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-subtle/50 pb-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-text-main">
              Componente Global: IconWrapper
            </h2>
            <p className="font-sans text-xs md:text-sm text-text-muted mt-1">
              Basado en <code>COMPONENTE_ICON_WRAPPER.svg</code>: contenedor de ícono con píldora superior (52x24px, <code>rx: 12px</code>) y etiqueta inferior. En estado activo muestra fondo verde con 10% de opacidad (<code>#4A7C591A / bg-primary/10</code>) y texto/ícono en color primary; en estado inactivo se muestra transparente con tono neutro <code>#655D52</code>.
            </p>
          </div>
          <span className="self-start sm:self-auto px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-light text-primary">
            COMPONENTE_ICON_WRAPPER
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Comparación directa de estados de Figma */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
              Estados de Figma (Inactivo vs Activo)
            </h4>
            <div className="flex items-center gap-10 p-6 rounded-input border border-border-subtle bg-surface">
              <div className="flex flex-col items-center">
                <span className="text-[11px] font-semibold text-text-muted uppercase mb-2">Inactivo (#655D52)</span>
                <IconWrapper
                  icon={<ArrowsLeftRightIcon />}
                  label="Inventario"
                  active={false}
                />
              </div>

              <div className="flex flex-col items-center">
                <span className="text-[11px] font-semibold text-primary uppercase mb-2">Activo (#4A7C59 / 10%)</span>
                <IconWrapper
                  icon={<ArrowsLeftRightIcon />}
                  label="Inventario"
                  active={true}
                />
              </div>

              <div className="flex flex-col items-center">
                <span className="text-[11px] font-semibold text-text-muted uppercase mb-2">Con Badge</span>
                <IconWrapper
                  icon={<Bell className="h-4 w-4" />}
                  label="Alertas"
                  badge="3"
                  active={true}
                />
              </div>
            </div>
          </div>

          {/* Barra de Navegación Interactiva */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
              Ejemplo en Barra de Navegación (Interactiva)
            </h4>
            <div className="flex items-center justify-around p-3 rounded-input border border-border-subtle bg-[#FAF6F0]">
              <IconWrapper
                icon={<ShoppingBagIcon />}
                label="Inventario"
                active={activeNavTab === 'inventario'}
                onClick={() => setActiveNavTab('inventario')}
              />
              <IconWrapper
                icon={<ClipboardListIcon />}
                label="Bitácora"
                active={activeNavTab === 'bitacora'}
                onClick={() => setActiveNavTab('bitacora')}
              />
              <IconWrapper
                icon={<ArrowsLeftRightIcon />}
                label="Préstamos"
                active={activeNavTab === 'prestamos'}
                onClick={() => setActiveNavTab('prestamos')}
              />
              <IconWrapper
                icon={<DashboardBlocksIcon />}
                label="Dashboard"
                active={activeNavTab === 'dashboard'}
                onClick={() => setActiveNavTab('dashboard')}
              />
            </div>
          </div>
        </div>
      </section>

      {/* COMPONENTE: FloatingButton (COMPONENT_FLOATING_BUTTON.svg) */}
      <section className="rounded-card border border-border-subtle bg-surface-card p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-subtle/50 pb-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-text-main">
              Componente Global: FloatingButton
            </h2>
            <p className="font-sans text-xs md:text-sm text-text-muted mt-1">
              Basado en <code>COMPONENT_FLOATING_BUTTON.svg</code>: botón de acción flotante circular de 56x56px (color <code>#316342</code> e ícono Plus blanco) acompañado opcionalmente por una tarjeta de etiqueta (<code>rx: 4px</code>, 30px de alto) alineada a su izquierda.
            </p>
          </div>
          <span className="self-start sm:self-auto px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-light text-primary">
            COMPONENT_FLOATING_BUTTON
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Disposición exacta de Figma */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
              Diseño Original Figma (Tarjeta + Botón 56x56)
            </h4>
            <div className="flex items-center justify-center p-8 rounded-input border border-border-subtle bg-surface">
              <FloatingButton
                label="Registrar reactivo"
                onClick={() => alert('Acción: Registrar reactivo')}
              />
            </div>
          </div>

          {/* Variantes y Tamaños */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
              Variantes y Opciones
            </h4>
            <div className="flex flex-wrap items-center justify-around gap-6 p-6 rounded-input border border-border-subtle bg-surface-card">
              {/* Botón circular solo */}
              <div className="flex flex-col items-center gap-2">
                <FloatingButton
                  aria-label="Agregar ítem"
                  size="default"
                  onClick={() => {}}
                />
                <span className="text-xs text-text-muted font-medium">Solo Botón (56px)</span>
              </div>

              {/* Variante Primary */}
              <div className="flex flex-col items-center gap-2">
                <FloatingButton
                  variant="primary"
                  size="default"
                  aria-label="Nuevo elemento"
                  onClick={() => {}}
                />
                <span className="text-xs text-text-muted font-medium">Primary (#446E53)</span>
              </div>

              {/* Variante Pequeña */}
              <div className="flex flex-col items-center gap-2">
                <FloatingButton
                  size="sm"
                  label="Nuevo"
                  labelPosition="right"
                  onClick={() => {}}
                />
                <span className="text-xs text-text-muted font-medium">Tamaño SM (44px)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMPONENTE: Alert (COMPONENTE_ALERT.svg) */}
      <section className="rounded-card border border-border-subtle bg-surface-card p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-subtle/50 pb-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-text-main">
              Componente Global: Alert
            </h2>
            <p className="font-sans text-xs md:text-sm text-text-muted mt-1">
              Basado en <code>COMPONENTE_ALERT.svg</code>: borde izquierdo de 4px, tokens <code>colors.alert</code> e ícono a la derecha. Sin opciones de borrado o descarte para asegurar visibilidad crítica.
            </p>
          </div>
          <span className="self-start sm:self-auto px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-light text-primary">
            COMPONENTE_ALERT
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Alert
            variant="warning"
            title="DCA03 Escasea"
          />

          <Alert
            variant="danger"
            title="DCA03 Escasea"
          />

          <Alert
            variant="warning"
            title="Atención requerida"
            description="El período de registro cierra en 48 horas hábiles."
          />

          <Alert
            variant="danger"
            title="Error crítico"
            description="No se pudo sincronizar el archivo con el servidor central."
          />
        </div>
      </section>

      {/* COMPONENTE: AlertBitacora (COMPONENTE_ALERT_BITACORA.svg) */}
      <section className="rounded-card border border-border-subtle bg-surface-card p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-subtle/50 pb-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-text-main">
              Componente Global: AlertBitacora
            </h2>
            <p className="font-sans text-xs md:text-sm text-text-muted mt-1">
              Basado en <code>COMPONENTE_ALERT_BITACORA.svg</code>: tarjeta de registro para eventos y bitácora de laboratorio (fondo blanco, borde izquierdo de 4px, soporte para usuario, fecha e indicador de variación).
            </p>
          </div>
          <span className="self-start sm:self-auto px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-light text-primary">
            COMPONENTE_ALERT_BITACORA
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Diseño original exacto de Figma */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Diseño Original Figma
            </h4>
            <AlertBitacora
              variant="warning"
              title="Consumo de Reactivo A18"
            />
            <AlertBitacora
              variant="danger"
              title="Merma de Solución Buffer PH 7"
            />
          </div>

          {/* Con metadatos completos */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Con Metadatos, Usuario e Indicadores
            </h4>
            <AlertBitacora
              variant="warning"
              title="Consumo de Reactivo A18"
              description="Utilizado en prueba de cromatografía líquida"
              user="Dra. Mariana Ramos"
              timestamp="Hace 15 min"
              badge={
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-alert-warning-bg text-alert-warning-border">
                  -50 ml
                </span>
              }
              isInteractive
              onClick={() => alert('Detalle de bitácora: Reactivo A18')}
            />

            <AlertBitacora
              variant="success"
              title="Ingreso de Ácido Clorhídrico"
              description="Registro N° 884-B recibido en almacén central"
              user="Lic. Carlos Mendoza"
              timestamp="Hoy, 10:45 AM"
              badge={
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-primary-light text-primary font-semibold">
                  +2500 ml
                </span>
              }
              isInteractive
              onClick={() => alert('Detalle de ingreso de Ácido')}
            />
          </div>
        </div>
      </section>

      {/* COMPONENTE: Stepper (COMPONENTE_STEPPER.svg) */}
      <section className="rounded-card border border-border-subtle bg-surface-card p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-subtle/50 pb-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-text-main">
              Componente Global: Stepper
            </h2>
            <p className="font-sans text-xs md:text-sm text-text-muted mt-1">
              Extraído de <code>COMPONENTE_STEPPER.svg</code>. Selector de cantidad con botones circulares de 48px, caja numérica de 96px con tipografía serif y bordes definidos.
            </p>
          </div>
          <span className="self-start sm:self-auto px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-light text-primary">
            COMPONENTE_STEPPER
          </span>
        </div>

        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Tamaño Grande / Principal del SVG */}
            <div className="space-y-3 flex flex-col items-center p-6 rounded-input border border-border-subtle bg-surface-card text-center">
              <span className="text-xs uppercase tracking-wider text-text-muted font-semibold">
                Tamaño LG (Figma: 224x96px)
              </span>
              <Stepper
                value={stepperCount}
                onChange={setStepperCount}
                min={0}
                max={99}
                size="lg"
              />
              <p className="text-xs text-text-muted mt-2">
                Valor actual: <strong>{stepperCount}</strong>
              </p>
            </div>

            {/* Tamaño Normal / Default */}
            <div className="space-y-3 flex flex-col items-center p-6 rounded-input border border-border-subtle bg-surface-card text-center">
              <span className="text-xs uppercase tracking-wider text-text-muted font-semibold">
                Tamaño Regular (72px alto)
              </span>
              <Stepper
                value={stepperCount}
                onChange={setStepperCount}
                min={0}
                max={99}
                size="md"
              />
              <p className="text-xs text-text-muted mt-2">
                Ajustado para formularios compactos
              </p>
            </div>

            {/* Deshabilitado */}
            <div className="space-y-3 flex flex-col items-center p-6 rounded-input border border-border-subtle bg-surface-card text-center">
              <span className="text-xs uppercase tracking-wider text-text-muted font-semibold">
                Deshabilitado / Solo Lectura
              </span>
              <Stepper value={0} disabled min={0} max={10} size="lg" />
              <p className="text-xs text-text-muted mt-2">
                Botones y campo de entrada bloqueados
              </p>
            </div>
          </div>

          {/* Stepper de Pasos Secuenciales / Wizard */}
          <div className="space-y-3 pt-4 border-t border-border-subtle/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
                Línea de Tiempo de Pasos Secuenciales (StepIndicator)
              </h4>
              <span className="text-xs text-primary font-medium">
                Diseño unificado Figma
              </span>
            </div>
            <div className="p-6 rounded-input border border-border-subtle bg-surface-card max-w-xl mx-auto space-y-4">
              <StepIndicator
                currentStep={wizardStep}
                onStepClick={(step) => setWizardStep(step)}
                steps={[
                  { title: 'Reactivo' },
                  { title: 'Cantidad' },
                  { title: 'Revisión' },
                  { title: 'Confirmar' },
                ]}
              />
              <p className="text-center text-xs text-text-muted pt-2">
                Paso actual: <strong className="text-primary font-semibold">Paso {wizardStep}</strong> (Haz clic en cualquier círculo para alternar el progreso)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* COMPONENTE: Navbar (COMPONENTE_NAVBAR.svg & COMPONENTE_ICON_WRAPPER.svg) */}
      <section className="rounded-card border border-border-subtle bg-surface-card p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-subtle/50 pb-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-text-main">
              Componente Global: Navbar
            </h2>
            <p className="font-sans text-xs md:text-sm text-text-muted mt-1">
              Extraído de <code>COMPONENTE_NAVBAR.svg</code> y <code>COMPONENTE_ICON_WRAPPER.svg</code>. Barra de navegación móvil inferior de 88px, bordes redondeados y pastilla activa con 10% de opacidad.
            </p>
          </div>
          <span className="self-start sm:self-auto px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-light text-primary">
            COMPONENTE_NAVBAR
          </span>
        </div>

        <div className="space-y-4">
          <div className="flex justify-center p-6 bg-surface rounded-input border border-border-subtle">
            <div className="w-[323px] max-w-full overflow-hidden rounded-t-[8px] border border-border-subtle">
              <Navbar
                activeId={navbarActive}
                onItemChange={(id) => setNavbarActive(id)}
              />
            </div>
          </div>
          <p className="text-xs text-text-muted text-center">
            Pestaña activa actual: <strong className="text-primary uppercase">{navbarActive}</strong>
          </p>
        </div>
      </section>

      {/* COMPONENTE: RomboBadge / RomboIcon */}
      <section className="rounded-card border border-border-subtle bg-surface-card p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-subtle/50 pb-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-text-main">
              Componente Global: RomboBadge / RomboIcon
            </h2>
            <p className="font-sans text-xs md:text-sm text-text-muted mt-1">
              Extraído de <code>COMPONENTE_ROMBO.svg</code>. Diamante de seguridad NFPA 704 con cuadrantes normalizados (Inflamabilidad en rojo, Salud en azul, Reactividad en amarillo y Riesgo Específico en blanco con soporte para W tachada <s>W</s>).
            </p>
          </div>
          <span className="self-start sm:self-auto px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-light text-primary">
            COMPONENTE_ROMBO
          </span>
        </div>

        <div className="space-y-8">
          {/* Tamaños y Modos */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
              Escala de Tamaños (xs: 28px, sm: 44px, md: 68px original, lg: 92px)
            </h4>
            <div className="flex flex-wrap items-end gap-8 p-6 bg-surface rounded-input border border-border-subtle">
              <div className="flex flex-col items-center gap-2">
                <span className="text-[11px] font-semibold text-text-muted uppercase">xs (28px)</span>
                <RomboBadge size="xs" salud={2} inflamabilidad={3} reactividad={0} especial="W" />
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-[11px] font-semibold text-text-muted uppercase">sm (44px)</span>
                <RomboBadge size="sm" salud={2} inflamabilidad={3} reactividad={0} especial="W" />
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-[11px] font-semibold text-primary uppercase">md (68px - SVG base)</span>
                <RomboBadge size="md" salud={3} inflamabilidad={2} reactividad={1} especial="OX" />
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-[11px] font-semibold text-text-muted uppercase">lg (92px)</span>
                <RomboBadge size="lg" salud={4} inflamabilidad={4} reactividad={2} especial="W" />
              </div>
            </div>
          </div>

          {/* Variantes: Limpio y con Leyenda */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border-subtle/60">
            <div className="space-y-3">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
                Versión Pura (Idéntica a COMPONENTE_ROMBO.svg crudo)
              </h4>
              <div className="flex items-center gap-6 p-5 bg-surface rounded-input border border-border-subtle">
                <RomboBadge size={68} />
                <div className="text-xs text-text-muted font-sans space-y-1">
                  <p>• Cuadrantes limpios vectoriales sin números.</p>
                  <p>• Compatible con <code>RomboIcon</code> exportado en <code>@/assets/icons</code>.</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
                Con Leyenda Explicativa de Seguridad
              </h4>
              <div className="p-4 bg-surface rounded-input border border-border-subtle">
                <RomboBadge
                  size={56}
                  salud={3}
                  inflamabilidad={0}
                  reactividad={1}
                  especial="COR"
                  showLegend={true}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMPONENTE: SectionCard */}
      <section className="rounded-card border border-border-subtle bg-surface-card p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-subtle/50 pb-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-text-main">
              Componente Global: SectionCard / SectionHeader
            </h2>
            <p className="font-sans text-xs md:text-sm text-text-muted mt-1">
              Extraído de <code>COMPONENT_SECTION.svg</code>. Encabezado en fuente Serif (Literata) en mayúsculas con línea divisoria horizontal de 2px (#181C1B / 20%) y opciones de agrupamiento, contador y colapsado.
            </p>
          </div>
          <span className="self-start sm:self-auto px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-light text-primary">
            COMPONENT_SECTION
          </span>
        </div>

        <div className="space-y-6">
          {/* Encabezado Aislado */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
              Línea Divisoria y Encabezado Fiel al SVG (342px de ancho de referencia)
            </h4>
            <div className="p-5 bg-surface rounded-input border border-border-subtle space-y-4 max-w-xl">
              <SectionHeader title="SECCIÓN" />
              <SectionHeader title="SECCIÓN A" count="8 reactivos" action={<Button variant="ghost" size="sm">Ver todos</Button>} />
              <SectionHeader title="ÁCIDOS Y BASES" subtitle="Área de almacenamiento de sustancias corrosivas" />
            </div>
          </div>

          {/* Variante Contenedora Colapsable */}
          <div className="space-y-3 pt-4 border-t border-border-subtle/60">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
              SectionCard Colapsable (Interactivo)
            </h4>
            <SectionCard
              variant="card"
              title="SECCIÓN INVENTARIO GENERAL"
              count="3 elementos"
              collapsible={true}
              defaultExpanded={true}
              action={<span className="text-xs text-text-muted">Laboratorio 01</span>}
            >
              <p className="text-sm text-text-muted font-sans py-2">
                Este contenedor agrupa elementos visuales bajo una misma sección, permitiendo colapsar o expandir su contenido manteniendo la identidad tipográfica y la línea divisoria.
              </p>
            </SectionCard>
          </div>
        </div>
      </section>

      {/* COMPONENTE: ReactivoCard */}
      <section className="rounded-card border border-border-subtle bg-surface-card p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-subtle/50 pb-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-text-main">
              Componente Global: ReactivoCard
            </h2>
            <p className="font-sans text-xs md:text-sm text-text-muted mt-1">
              Extraído de <code>COMPONENTE_REACTIVO.svg</code>. Tarjeta de reactivo (342x92px) limpia y sin sombras, con barra lateral verde oficial (<code>#4A7C59</code>), tipografía Literata/Nunito y rombo NFPA 704 integrado.
            </p>
          </div>
          <span className="self-start sm:self-auto px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-light text-primary">
            COMPONENTE_REACTIVO
          </span>
        </div>

        <div className="p-6 bg-surface rounded-input border border-border-subtle flex flex-wrap gap-6 items-center justify-center sm:justify-start">
          <ReactivoCard
            name="Reactivo Name"
            code="XX-123"
            stock="500ml"
            salud={2}
            inflamabilidad={3}
            reactividad={0}
            especial="W"
          />
          <div className="text-xs text-text-muted space-y-1">
            <p>• Dimensión exacta de referencia: 342px de ancho x 92px de altura.</p>
            <p>• Barra verde lateral izquierda: <code>#4A7C59</code>.</p>
            <p>• Tarjeta limpia <strong>sin sombras</strong> según especificación.</p>
            <p>• Tipografía: Título en <strong>Literata (Serif)</strong>, datos en <strong>Nunito (Sans)</strong>.</p>
            <p>• Rombo NFPA 704 integrado con cuadrantes de seguridad.</p>
          </div>
        </div>
      </section>

      {/* SECCIONES AGRUPADAS: Demostración Completa con SectionCard + ReactivoCard */}
      <section className="rounded-card border border-border-subtle bg-surface-card p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-subtle/50 pb-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-text-main">
              Demostración Integrada: Secciones Agrupadas de Reactivos
            </h2>
            <p className="font-sans text-xs md:text-sm text-text-muted mt-1">
              Composición completa de <code>SectionCard</code> organizando colecciones de <code>ReactivoCard</code> con sus respectivos <code>RomboBadge</code>.
            </p>
          </div>
          <span className="self-start sm:self-auto px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-light text-primary">
            SECCIONES AGRUPADAS
          </span>
        </div>

        <SectionCard
          title="SECCIÓN A: REACTIVOS"
          count="3 reactivos"
          action={
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-light text-primary">
              Área A
            </span>
          }
          variant="plain"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ReactivoCard
              name="Ácido Clorhídrico 37%"
              code="HCL-37"
              stock="2.5"
              unit="L"
              salud={3}
              inflamabilidad={0}
              reactividad={1}
              especial="COR"
              location="Gabinete de Ácidos"
            />
            <ReactivoCard
              name="Acetona Grado Analítico"
              code="ACT-01"
              stock="1000"
              unit="ml"
              salud={1}
              inflamabilidad={3}
              reactividad={0}
              location="Armario Inflamables"
            />
            <ReactivoCard
              name="Nitrato de Plata"
              code="AGNO3"
              stock="100"
              unit="g"
              salud={2}
              inflamabilidad={0}
              reactividad={0}
              especial="OX"
              location="Cajón de Sales"
            />
          </div>
        </SectionCard>
      </section>

      {/* ========================================================= */}
      {/* SECCIÓN: COMPONENTES DESKTOP                             */}
      {/* ========================================================= */}
      <section className="bg-surface-card rounded-card p-6 md:p-8 border border-border-subtle shadow-sm space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border-subtle gap-2">
          <div>
            <h2 className="font-serif text-2xl font-bold text-text-main">
              Suite de Componentes Desktop
            </h2>
            <p className="font-sans text-xs md:text-sm text-text-muted mt-1">
              Componentes especializados para la interfaz de escritorio basados en los requerimientos oficiales: <code>DesktopCard</code>, <code>DesktopTable</code>, <code>DesktopActionButtons</code>, <code>DesktopProfileIcon</code>, <code>DesktopSidebar</code> y <code>DesktopLayout</code>.
            </p>
          </div>
          <span className="self-start sm:self-auto px-3 py-1 rounded-full text-xs font-semibold bg-primary text-white">
            NUEVOS COMPONENTES DESKTOP
          </span>
        </div>

        {/* 1. DESKTOP ACTION BUTTONS */}
        <div className="space-y-4">
          <div className="border-b border-border-subtle pb-2">
            <h3 className="font-serif text-lg font-bold text-primary">
              1. Botones de Acción Desktop (<code>DesktopActionButtons</code>)
            </h3>
            <p className="font-sans text-xs text-text-muted mt-0.5">
              Botones con altura 48px, esquinas redondeadas de 15px, borde verde institucional <code>#4A7C59</code> e íconos especializados para filtrado, exportación y creación.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <DesktopFilterButton
              onClick={() => alert('Acción de Filtrar activada')}
            />
            <DesktopExportButton
              onClick={() => alert('Exportando reporte de laboratorio...')}
            />
            <DesktopNewButton
              label="Nuevo Reactivo"
              onClick={() => alert('Abrir modal de nuevo reactivo')}
            />
            <DesktopActionButton
              variant="filter"
              label="Filtro Avanzado"
              bgVariant="surface"
            />
          </div>

          <div className="p-4 rounded-input bg-background-base/60 border border-border-subtle">
            <span className="text-xs font-semibold text-text-muted uppercase block mb-2">Toolbar agrupada (DesktopActionToolbar):</span>
            <DesktopActionToolbar align="between" className="w-full">
              <div className="flex gap-3">
                <DesktopFilterButton />
                <DesktopExportButton />
              </div>
              <DesktopNewButton label="Crear Solicitud" />
            </DesktopActionToolbar>
          </div>
        </div>

        {/* 2. DESKTOP PROFILE ICON */}
        <div className="space-y-4">
          <div className="border-b border-border-subtle pb-2">
            <h3 className="font-serif text-lg font-bold text-primary">
              2. Perfil de Usuario para Navbar Desktop (<code>DesktopProfileIcon</code>)
            </h3>
            <p className="font-sans text-xs text-text-muted mt-0.5">
              Componente de perfil con nombre a la izquierda y avatar con ícono institucional verde institucional <code>#4A7C59</code> a la derecha (126×40px).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2 items-center">
            <div className="p-4 rounded-input bg-background-base/60 border border-border-subtle flex flex-col gap-2">
              <span className="text-xs text-text-muted font-medium">Predeterminado (Default):</span>
              <DesktopProfileIcon name="John Doe" onClick={() => alert('Perfil clickeado')} />
            </div>

            <div className="p-4 rounded-input bg-background-base/60 border border-border-subtle flex flex-col gap-2">
              <span className="text-xs text-text-muted font-medium">Con Rol / Cargo:</span>
              <DesktopProfileIcon
                name="Dra. María Pérez"
                role="Jefa de Laboratorio LEPA"
                onClick={() => alert('Perfil de Dra. María')}
              />
            </div>

            <div className="p-4 rounded-input bg-background-base/60 border border-border-subtle flex flex-col gap-2">
              <span className="text-xs text-text-muted font-medium">Tamaño Grande (lg):</span>
              <DesktopProfileIcon
                name="Prof. Carlos Ruiz"
                role="Investigador Principal"
                size="lg"
              />
            </div>
          </div>
        </div>

        {/* 3. DESKTOP CARD */}
        <div className="space-y-4">
          <div className="border-b border-border-subtle pb-2">
            <h3 className="font-serif text-lg font-bold text-primary">
              3. Tarjeta Contenedora Genérica Desktop (<code>DesktopCard</code>)
            </h3>
            <p className="font-sans text-xs text-text-muted mt-0.5">
              Contenedor institucional para escritorio con ancho amplio, radio de 16px, fondo <code>#FAF6F0</code>, borde nítido <code>#655D52/40</code> y sombra proyectada exacta de Figma.
            </p>
          </div>

          <div className="flex justify-center p-4 bg-background-base/50 rounded-card border border-border-subtle">
            <DesktopCard maxWidth="default" className="w-full">
              <DesktopCardHeader>
                <DesktopCardTitle>Iniciar Sesión</DesktopCardTitle>
                <DesktopCardDescription>
                  Ingresa tus credenciales para acceder al sistema institucional de laboratorio
                </DesktopCardDescription>
              </DesktopCardHeader>

              <DesktopCardContent className="space-y-4">
                <InputField
                  label="Correo Electrónico"
                  placeholder="ejemplo@izet.edu.ve"
                />
                <InputField
                  label="Contraseña"
                  placeholder="••••••••"
                  variant="password"
                />
              </DesktopCardContent>

              <DesktopCardFooter className="pt-6">
                <Button variant="default" size="default" className="w-full">
                  Ingresar al Sistema
                </Button>
                <Button variant="outline" size="default" className="w-full">
                  Registrarse
                </Button>
              </DesktopCardFooter>
            </DesktopCard>
          </div>
        </div>

        {/* 4. DESKTOP TABLA */}
        <div className="space-y-4">
          <div className="border-b border-border-subtle pb-2">
            <h3 className="font-serif text-lg font-bold text-primary">
              4. Tabla de Datos Desktop (<code>DesktopTable</code>)
            </h3>
            <p className="font-sans text-xs text-text-muted mt-0.5">
              Tabla con esquinas redondeadas de 20px, encabezado con fondo <code>#FAF6F0</code> de 59px de altura, filas de 60px con separadores y columna de acciones.
            </p>
          </div>

          <div className="w-full">
            <DesktopTable
              columns={DESKTOP_SAMPLE_COLUMNS}
              data={DESKTOP_SAMPLE_ROWS}
              keyExtractor={(row) => row.id}
              onRowClick={(row) => alert(`Fila seleccionada: ${row.nombre}`)}
            />
          </div>
        </div>

        {/* 5. DESKTOP SIDEBAR */}
        <div className="space-y-4">
          <div className="border-b border-border-subtle pb-2">
            <h3 className="font-serif text-lg font-bold text-primary">
              5. Barra Lateral Desktop (<code>DesktopSidebar</code>)
            </h3>
            <p className="font-sans text-xs text-text-muted mt-0.5">
              Barra lateral fija de 206px con logotipo oficial, badge de laboratorio, píldora activa rellena en <code>#4A7C59</code>, botón de acción rápida y opciones inferiores.
            </p>
          </div>

          <div className="p-4 bg-background-base/50 rounded-card border border-border-subtle flex justify-center">
            <div className="h-[480px] border border-[#655D52]/40 rounded-xl overflow-hidden bg-[#FAF6F0] shadow-sm">
              <DesktopSidebar
                activeId="dashboard"
                labLabel="Lab 1"
                className="h-full min-h-0"
              />
            </div>
          </div>
        </div>

        {/* 6. DESKTOP LAYOUT COMPLETO */}
        <div className="space-y-4">
          <div className="border-b border-border-subtle pb-2">
            <h3 className="font-serif text-lg font-bold text-primary">
              6. Maqueta de Layout Completo Desktop (<code>DesktopLayout</code>)
            </h3>
            <p className="font-sans text-xs text-text-muted mt-0.5">
              Layout con sidebar fijo de 206px a la izquierda con línea divisoria vertical <code>border-r border-[#655D52]/40</code>, barra superior fija de 88px con línea divisoria horizontal <code>border-b border-[#655D52]/40</code> y área de contenido modular a la derecha.
            </p>
          </div>

          <div className="w-full border-2 border-border-subtle rounded-card overflow-hidden shadow-md">
            {/* Marco de visualización de la maqueta DesktopLayout */}
            <div className="h-[480px] w-full overflow-hidden relative">
              <DesktopLayout
                activeNavId="dashboard"
                topbarLeft={
                  <div className="flex items-center gap-3">
                    <span className="font-serif text-xl font-bold text-primary">Panel de Control</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary-light text-primary font-medium">Laboratorio Activo</span>
                  </div>
                }
                topbarRight={
                  <DesktopProfileIcon
                    name="John Doe"
                    role="Coordinador LEPA"
                    onClick={() => alert('Menú de usuario')}
                  />
                }
              >
                <div className="space-y-6">
                  {/* Barra de herramientas superior dentro del layout */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif text-xl font-bold text-text-main">
                        Resumen de Reactivos en Existencia
                      </h4>
                      <p className="font-sans text-xs text-text-muted">
                        Última sincronización: Hoy a las 11:00 AM
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <DesktopFilterButton />
                      <DesktopExportButton />
                    </div>
                  </div>

                  {/* Tarjetas de estadísticas */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-white border border-[#655D52]/30 shadow-xs">
                      <span className="text-xs text-text-muted uppercase font-bold">Total Reactivos</span>
                      <p className="font-serif text-2xl font-bold text-primary mt-1">142</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white border border-[#655D52]/30 shadow-xs">
                      <span className="text-xs text-text-muted uppercase font-bold">Por Agotarse</span>
                      <p className="font-serif text-2xl font-bold text-alert-warning-border mt-1">8</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white border border-[#655D52]/30 shadow-xs">
                      <span className="text-xs text-text-muted uppercase font-bold">Nivel Crítico</span>
                      <p className="font-serif text-2xl font-bold text-alert-danger-border mt-1">3</p>
                    </div>
                  </div>
                </div>
              </DesktopLayout>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
