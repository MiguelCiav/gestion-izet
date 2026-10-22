import * as React from 'react'
import {
  MapPin,
  Users,
  Plus,
  Pencil,
  Trash2,
  KeyRound,
  Shield,
  Building2,
  AlertTriangle,
  CheckCircle2,
  X,
} from 'lucide-react'
import {
  DesktopLayout,
  DesktopCard,
  DesktopTable,
  type DesktopTableColumn,
} from '@/components/desktop'
import { Button, InputField } from '@/components/ui'
import { useAuth } from '@/features/auth/hooks'
import {
  fetchUbicacionesLaboratorio,
  crearUbicacionLaboratorio,
  actualizarUbicacionLaboratorio,
  eliminarUbicacionLaboratorio,
  fetchUsuariosAdmin,
  crearUsuarioAdmin,
  actualizarUsuarioAdmin,
  eliminarUsuarioAdmin,
  type LaboratorioCodigo,
} from '@/lib/izetService'
import type { UbicacionItem } from '@/features/inventario/types'
import type { AdminUsuarioItem, UserRole } from '../types'
import { cn } from '@/lib/utils'

export function DesktopAdminPage(): React.JSX.Element {
  const { user, activeLab } = useAuth()
  const [activeTab, setActiveTab] = React.useState<'ubicaciones' | 'usuarios'>('ubicaciones')

  // Feedback notifications
  const [feedback, setFeedback] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // =========================================================================
  // ESTADO: UBICACIONES
  // =========================================================================
  const [ubicaciones, setUbicaciones] = React.useState<UbicacionItem[]>([])
  const [isLoadingUbicaciones, setIsLoadingUbicaciones] = React.useState<boolean>(true)
  const [searchUbicacion, setSearchUbicacion] = React.useState<string>('')
  const [filterLabUbicacion, setFilterLabUbicacion] = React.useState<'TODOS' | 'LEPA' | 'LEM'>('TODOS')

  // Modal Ubicación
  const [isUbicacionModalOpen, setIsUbicacionModalOpen] = React.useState<boolean>(false)
  const [editingUbicacion, setEditingUbicacion] = React.useState<UbicacionItem | null>(null)
  const [ubicacionForm, setUbicacionForm] = React.useState<{
    nombre: string
    descripcion: string
    laboratorioCodigo: LaboratorioCodigo
    activo: boolean
  }>({
    nombre: '',
    descripcion: '',
    laboratorioCodigo: activeLab,
    activo: true,
  })
  const [isSubmittingUbicacion, setIsSubmittingUbicacion] = React.useState<boolean>(false)

  // Modal Eliminar Ubicación
  const [deletingUbicacion, setDeletingUbicacion] = React.useState<UbicacionItem | null>(null)
  const [isDeletingUbicacion, setIsDeletingUbicacion] = React.useState<boolean>(false)

  // =========================================================================
  // ESTADO: USUARIOS
  // =========================================================================
  const [usuarios, setUsuarios] = React.useState<AdminUsuarioItem[]>([])
  const [isLoadingUsuarios, setIsLoadingUsuarios] = React.useState<boolean>(true)
  const [searchUsuario, setSearchUsuario] = React.useState<string>('')
  const [filterRolUsuario, setFilterRolUsuario] = React.useState<string>('TODOS')
  const [filterLabUsuario, setFilterLabUsuario] = React.useState<'TODOS' | 'LEPA' | 'LEM'>('TODOS')

  // Modal Usuario (Crear / Editar)
  const [isUsuarioModalOpen, setIsUsuarioModalOpen] = React.useState<boolean>(false)
  const [editingUsuario, setEditingUsuario] = React.useState<AdminUsuarioItem | null>(null)
  const [usuarioForm, setUsuarioForm] = React.useState<{
    nombreCompleto: string
    cedula: string
    email: string
    password: string
    rol: UserRole
    laboratorioCodigo: LaboratorioCodigo
    contacto: string
  }>({
    nombreCompleto: '',
    cedula: '',
    email: '',
    password: '',
    rol: 'investigador',
    laboratorioCodigo: activeLab,
    contacto: '',
  })
  const [isSubmittingUsuario, setIsSubmittingUsuario] = React.useState<boolean>(false)

  // Modal Eliminar Usuario
  const [deletingUsuario, setDeletingUsuario] = React.useState<AdminUsuarioItem | null>(null)
  const [isDeletingUsuario, setIsDeletingUsuario] = React.useState<boolean>(false)

  // =========================================================================
  // CARGA DE DATOS
  // =========================================================================
  const loadUbicaciones = React.useCallback(async () => {
    setIsLoadingUbicaciones(true)
    const list = await fetchUbicacionesLaboratorio()
    setUbicaciones(list)
    setIsLoadingUbicaciones(false)
  }, [])

  const loadUsuarios = React.useCallback(async () => {
    setIsLoadingUsuarios(true)
    const list = await fetchUsuariosAdmin()
    setUsuarios(list)
    setIsLoadingUsuarios(false)
  }, [])

  React.useEffect(() => {
    void loadUbicaciones()
    void loadUsuarios()
  }, [loadUbicaciones, loadUsuarios])

  // =========================================================================
  // HANDLERS: UBICACIONES
  // =========================================================================
  const handleOpenNuevaUbicacion = () => {
    setEditingUbicacion(null)
    setUbicacionForm({
      nombre: '',
      descripcion: '',
      laboratorioCodigo: activeLab,
      activo: true,
    })
    setIsUbicacionModalOpen(true)
  }

  const handleOpenEditarUbicacion = (item: UbicacionItem) => {
    setEditingUbicacion(item)
    setUbicacionForm({
      nombre: item.nombre,
      descripcion: item.descripcion || '',
      laboratorioCodigo: item.laboratorioCodigo || 'LEPA',
      activo: item.activo,
    })
    setIsUbicacionModalOpen(true)
  }

  const handleGuardarUbicacion = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!ubicacionForm.nombre.trim()) {
      setFeedback({ type: 'error', message: 'El nombre de la ubicación es obligatorio.' })
      return
    }

    setIsSubmittingUbicacion(true)
    if (editingUbicacion) {
      const res = await actualizarUbicacionLaboratorio(editingUbicacion.id, {
        nombre: ubicacionForm.nombre,
        descripcion: ubicacionForm.descripcion,
        activo: ubicacionForm.activo,
        laboratorioCodigo: ubicacionForm.laboratorioCodigo,
      })
      setIsSubmittingUbicacion(false)
      if (!res.success) {
        setFeedback({ type: 'error', message: res.error || 'Error al actualizar ubicación.' })
        return
      }
      setFeedback({ type: 'success', message: `Ubicación "${ubicacionForm.nombre}" actualizada exitosamente.` })
    } else {
      const res = await crearUbicacionLaboratorio(
        ubicacionForm.laboratorioCodigo,
        ubicacionForm.nombre,
        ubicacionForm.descripcion,
      )
      setIsSubmittingUbicacion(false)
      if (!res.success) {
        setFeedback({ type: 'error', message: res.error || 'Error al crear ubicación.' })
        return
      }
      setFeedback({ type: 'success', message: `Ubicación "${ubicacionForm.nombre}" creada para ${ubicacionForm.laboratorioCodigo}.` })
    }

    setIsUbicacionModalOpen(false)
    await loadUbicaciones()
  }

  const handleConfirmarEliminarUbicacion = async () => {
    if (!deletingUbicacion) return
    setIsDeletingUbicacion(true)
    const res = await eliminarUbicacionLaboratorio(deletingUbicacion.id)
    setIsDeletingUbicacion(false)

    if (!res.success) {
      setFeedback({ type: 'error', message: res.error || 'No se pudo eliminar la ubicación.' })
      setDeletingUbicacion(null)
      return
    }

    setFeedback({ type: 'success', message: `Ubicación "${deletingUbicacion.nombre}" eliminada.` })
    setDeletingUbicacion(null)
    await loadUbicaciones()
  }

  // =========================================================================
  // HANDLERS: USUARIOS
  // =========================================================================
  const handleOpenNuevoUsuario = () => {
    setEditingUsuario(null)
    setUsuarioForm({
      nombreCompleto: '',
      cedula: '',
      email: '',
      password: '',
      rol: 'investigador',
      laboratorioCodigo: activeLab,
      contacto: '',
    })
    setIsUsuarioModalOpen(true)
  }

  const handleOpenEditarUsuario = (item: AdminUsuarioItem) => {
    setEditingUsuario(item)
    setUsuarioForm({
      nombreCompleto: item.nombreCompleto,
      cedula: item.cedula || '',
      email: item.email,
      password: '',
      rol: item.rol,
      laboratorioCodigo: item.laboratorioCodigo || 'LEPA',
      contacto: item.contacto || '',
    })
    setIsUsuarioModalOpen(true)
  }

  const handleGuardarUsuario = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!usuarioForm.nombreCompleto.trim() || !usuarioForm.cedula.trim() || !usuarioForm.email.trim()) {
      setFeedback({ type: 'error', message: 'Nombre, cédula y correo son campos obligatorios.' })
      return
    }

    if (!editingUsuario && (!usuarioForm.password || usuarioForm.password.length < 6)) {
      setFeedback({ type: 'error', message: 'La contraseña temporal debe tener al menos 6 caracteres.' })
      return
    }

    setIsSubmittingUsuario(true)
    if (editingUsuario) {
      const res = await actualizarUsuarioAdmin(editingUsuario.id, {
        nombreCompleto: usuarioForm.nombreCompleto,
        cedula: usuarioForm.cedula,
        rol: usuarioForm.rol,
        laboratorioCodigo: usuarioForm.laboratorioCodigo,
        contacto: usuarioForm.contacto,
        password: usuarioForm.password.trim() ? usuarioForm.password : undefined,
      })
      setIsSubmittingUsuario(false)
      if (!res.success) {
        setFeedback({ type: 'error', message: res.error || 'Error al actualizar usuario.' })
        return
      }
      setFeedback({ type: 'success', message: `Usuario "${usuarioForm.nombreCompleto}" actualizado correctamente.` })
    } else {
      const res = await crearUsuarioAdmin({
        nombreCompleto: usuarioForm.nombreCompleto,
        cedula: usuarioForm.cedula,
        email: usuarioForm.email,
        password: usuarioForm.password,
        rol: usuarioForm.rol,
        laboratorioCodigo: usuarioForm.laboratorioCodigo,
        contacto: usuarioForm.contacto,
      })
      setIsSubmittingUsuario(false)
      if (!res.success) {
        setFeedback({ type: 'error', message: res.error || 'Error al registrar nuevo usuario.' })
        return
      }
      setFeedback({ type: 'success', message: `Usuario "${usuarioForm.nombreCompleto}" creado con éxito.` })
    }

    setIsUsuarioModalOpen(false)
    await loadUsuarios()
  }

  const handleConfirmarEliminarUsuario = async () => {
    if (!deletingUsuario) return
    if (deletingUsuario.id === user?.id) {
      setFeedback({ type: 'error', message: 'No puedes eliminar tu propia cuenta de administrador en uso.' })
      setDeletingUsuario(null)
      return
    }

    setIsDeletingUsuario(true)
    const res = await eliminarUsuarioAdmin(deletingUsuario.id)
    setIsDeletingUsuario(false)

    if (!res.success) {
      setFeedback({ type: 'error', message: res.error || 'No se pudo eliminar el usuario.' })
      setDeletingUsuario(null)
      return
    }

    setFeedback({ type: 'success', message: `Usuario "${deletingUsuario.nombreCompleto}" eliminado del sistema.` })
    setDeletingUsuario(null)
    await loadUsuarios()
  }

  // =========================================================================
  // FILTRADOS
  // =========================================================================
  const filteredUbicaciones = React.useMemo(() => {
    return ubicaciones.filter((item) => {
      if (filterLabUbicacion !== 'TODOS' && item.laboratorioCodigo !== filterLabUbicacion) {
        return false
      }
      if (!searchUbicacion.trim()) return true
      const q = searchUbicacion.toLowerCase().trim()
      return (
        item.nombre.toLowerCase().includes(q) ||
        (item.descripcion && item.descripcion.toLowerCase().includes(q))
      )
    })
  }, [ubicaciones, filterLabUbicacion, searchUbicacion])

  const filteredUsuarios = React.useMemo(() => {
    return usuarios.filter((item) => {
      if (filterLabUsuario !== 'TODOS' && item.laboratorioCodigo !== filterLabUsuario) {
        return false
      }
      if (filterRolUsuario !== 'TODOS' && item.rol !== filterRolUsuario) {
        return false
      }
      if (!searchUsuario.trim()) return true
      const q = searchUsuario.toLowerCase().trim()
      return (
        item.nombreCompleto.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        item.cedula.toLowerCase().includes(q) ||
        (item.contacto && item.contacto.toLowerCase().includes(q))
      )
    })
  }, [usuarios, filterLabUsuario, filterRolUsuario, searchUsuario])

  // =========================================================================
  // COLUMNAS TABLA UBICACIONES
  // =========================================================================
  const ubicacionesColumns: DesktopTableColumn<UbicacionItem>[] = [
    {
      key: 'nombre',
      header: 'Ubicación Física',
      width: '32%',
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <span className="font-serif font-bold text-text-main text-sm block">
              {row.nombre}
            </span>
            {row.descripcion && (
              <span className="font-sans text-xs text-text-muted block truncate max-w-xs">
                {row.descripcion}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'laboratorioCodigo',
      header: 'Laboratorio',
      width: '18%',
      render: (row) => (
        <span
          className={cn(
            'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border',
            row.laboratorioCodigo === 'LEPA'
              ? 'bg-[#4A7C59]/15 text-[#4A7C59] border-[#4A7C59]/30'
              : 'bg-[#B45309]/15 text-[#B45309] border-[#B45309]/30',
          )}
        >
          <Building2 className="w-3.5 h-3.5 mr-1" />
          {row.laboratorioCodigo ?? 'LEPA'}
        </span>
      ),
    },
    {
      key: 'activo',
      header: 'Estado',
      width: '18%',
      align: 'center',
      render: (row) => (
        <span
          className={cn(
            'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold',
            row.activo
              ? 'bg-[#EBF7EE] text-[#2E7D32] border border-[#2E7D32]/25'
              : 'bg-black/5 text-[#655D52] border border-[#655D52]/20',
          )}
        >
          <span
            className={cn(
              'w-1.5 h-1.5 rounded-full mr-1.5',
              row.activo ? 'bg-[#2E7D32]' : 'bg-[#655D52]',
            )}
          />
          {row.activo ? 'Activa' : 'Inactiva'}
        </span>
      ),
    },
    {
      key: 'acciones',
      header: 'Acciones',
      width: '16%',
      align: 'center',
      render: (row) => (
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            title={`Editar ${row.nombre}`}
            onClick={() => handleOpenEditarUbicacion(row)}
            className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            type="button"
            title={`Eliminar ${row.nombre}`}
            onClick={() => setDeletingUbicacion(row)}
            className="p-1.5 text-alert-danger-border hover:bg-alert-danger-bg rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ]

  // =========================================================================
  // COLUMNAS TABLA USUARIOS
  // =========================================================================
  const usuariosColumns: DesktopTableColumn<AdminUsuarioItem>[] = [
    {
      key: 'nombreCompleto',
      header: 'Nombre del Usuario',
      width: '28%',
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-bold text-xs">
            {row.nombreCompleto.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <span className="font-serif font-bold text-text-main text-sm block truncate">
              {row.nombreCompleto}
            </span>
            <span className="font-sans text-xs text-text-muted block truncate">
              {row.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'cedula',
      header: 'Cédula',
      width: '16%',
      render: (row) => (
        <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-white border border-[#655D52]/30 text-text-main">
          {row.cedula}
        </span>
      ),
    },
    {
      key: 'rol',
      header: 'Rol',
      width: '16%',
      render: (row) => {
        const roleLabels: Record<UserRole, { label: string; badgeClass: string }> = {
          admin: {
            label: 'Administrador',
            badgeClass: 'bg-primary text-white border-primary',
          },
          investigador: {
            label: 'Investigador',
            badgeClass: 'bg-[#4A7C59]/15 text-[#4A7C59] border-[#4A7C59]/30',
          },
          analista: {
            label: 'Analista',
            badgeClass: 'bg-[#B45309]/15 text-[#B45309] border-[#B45309]/30',
          },
          invitado: {
            label: 'Invitado',
            badgeClass: 'bg-black/5 text-[#655D52] border-[#655D52]/20',
          },
        }
        const cfg = roleLabels[row.rol] || roleLabels.investigador
        return (
          <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border', cfg.badgeClass)}>
            <Shield className="w-3 h-3 mr-1" />
            {cfg.label}
          </span>
        )
      },
    },
    {
      key: 'laboratorioCodigo',
      header: 'Laboratorio',
      width: '14%',
      render: (row) => (
        <span className="font-sans text-xs font-semibold text-text-main">
          {row.laboratorioCodigo ?? 'LEPA'}
        </span>
      ),
    },
    {
      key: 'contacto',
      header: 'Contacto',
      width: '14%',
      render: (row) => (
        <span className="font-sans text-xs text-text-muted truncate block">
          {row.contacto || '—'}
        </span>
      ),
    },
    {
      key: 'acciones',
      header: 'Acciones',
      width: '12%',
      align: 'center',
      render: (row) => (
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            title={`Editar datos y clave de ${row.nombreCompleto}`}
            onClick={() => handleOpenEditarUsuario(row)}
            className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            type="button"
            title={`Eliminar ${row.nombreCompleto}`}
            disabled={row.id === user?.id}
            onClick={() => setDeletingUsuario(row)}
            className={cn(
              'p-1.5 rounded-lg transition-colors cursor-pointer',
              row.id === user?.id
                ? 'opacity-30 cursor-not-allowed text-[#655D52]'
                : 'text-alert-danger-border hover:bg-alert-danger-bg',
            )}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <DesktopLayout activeNavId="admin">
      <div className="w-full max-w-[1240px] mx-auto flex flex-col space-y-6">
        {/* Banner de Feedback */}
        {feedback && (
          <div
            role="status"
            className={cn(
              'flex items-center justify-between rounded-input border px-5 py-3.5 text-sm shadow-sm animate-in fade-in',
              feedback.type === 'success'
                ? 'border-primary/25 bg-primary-light text-text-main'
                : 'border-alert-danger-border bg-alert-danger-bg text-alert-danger-border font-semibold',
            )}
          >
            <div className="flex items-center gap-2.5">
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-alert-danger-border shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setFeedback(null)}
              className="text-text-muted hover:text-text-main p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Encabezado Principal */}
        <div className="flex items-center justify-between flex-wrap gap-4 select-none">
          <div>
            <h1 className="font-serif text-[32px] sm:text-4xl font-bold text-primary tracking-tight">
              Módulo de Administración
            </h1>
            <p className="font-sans text-sm text-text-muted mt-1">
              Gestión centralizada de ubicaciones físicas de almacenamiento y cuentas de usuario.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {activeTab === 'ubicaciones' ? (
              <Button
                variant="default"
                size="default"
                onClick={handleOpenNuevaUbicacion}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Nueva Ubicación
              </Button>
            ) : (
              <Button
                variant="default"
                size="default"
                onClick={handleOpenNuevoUsuario}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Nuevo Usuario
              </Button>
            )}
          </div>
        </div>

        {/* Pestañas de Navegación del Módulo */}
        <div className="flex border-b border-[#655D52]/30 gap-6 select-none">
          <button
            type="button"
            onClick={() => setActiveTab('ubicaciones')}
            className={cn(
              'pb-3 font-serif font-bold text-base flex items-center gap-2 transition-all border-b-2 -mb-[2px] cursor-pointer',
              activeTab === 'ubicaciones'
                ? 'border-primary text-primary'
                : 'border-transparent text-text-muted hover:text-text-main',
            )}
          >
            <MapPin className="w-4 h-4" />
            Ubicaciones Físicas ({ubicaciones.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('usuarios')}
            className={cn(
              'pb-3 font-serif font-bold text-base flex items-center gap-2 transition-all border-b-2 -mb-[2px] cursor-pointer',
              activeTab === 'usuarios'
                ? 'border-primary text-primary'
                : 'border-transparent text-text-muted hover:text-text-main',
            )}
          >
            <Users className="w-4 h-4" />
            Usuarios y Credenciales ({usuarios.length})
          </button>
        </div>

        {/* CONTENIDO DE PESTAÑA: UBICACIONES */}
        {activeTab === 'ubicaciones' && (
          <div className="flex flex-col space-y-4">
            {/* Barra de Filtros */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="max-w-md w-full">
                <InputField
                  variant="search"
                  value={searchUbicacion}
                  onChange={(e) => setSearchUbicacion(e.target.value)}
                  placeholder="Buscar ubicación por nombre o descripción..."
                  className="bg-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-text-muted">Laboratorio:</span>
                <div className="inline-flex rounded-xl border border-[#655D52]/30 bg-white p-1">
                  {(['TODOS', 'LEPA', 'LEM'] as const).map((lab) => (
                    <button
                      key={lab}
                      type="button"
                      onClick={() => setFilterLabUbicacion(lab)}
                      className={cn(
                        'px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer',
                        filterLabUbicacion === lab
                          ? 'bg-primary text-white'
                          : 'text-text-muted hover:text-text-main',
                      )}
                    >
                      {lab}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tabla */}
            <DesktopCard variant="default" padding="none" maxWidth="full" className="overflow-hidden">
              <DesktopTable<UbicacionItem>
                columns={ubicacionesColumns}
                data={filteredUbicaciones}
                keyExtractor={(item) => item.id}
                loading={isLoadingUbicaciones}
                emptyMessage="No se encontraron ubicaciones físicas registradas con ese criterio."
              />
            </DesktopCard>
          </div>
        )}

        {/* CONTENIDO DE PESTAÑA: USUARIOS */}
        {activeTab === 'usuarios' && (
          <div className="flex flex-col space-y-4">
            {/* Barra de Filtros */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="max-w-md w-full">
                <InputField
                  variant="search"
                  value={searchUsuario}
                  onChange={(e) => setSearchUsuario(e.target.value)}
                  placeholder="Buscar por nombre, cédula o correo..."
                  className="bg-white"
                />
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-text-muted">Rol:</span>
                  <select
                    value={filterRolUsuario}
                    onChange={(e) => setFilterRolUsuario(e.target.value)}
                    className="h-9 rounded-lg border border-[#655D52]/30 bg-white px-2.5 text-xs text-text-main"
                  >
                    <option value="TODOS">Todos los roles</option>
                    <option value="admin">Administrador</option>
                    <option value="investigador">Investigador</option>
                    <option value="analista">Analista</option>
                    <option value="invitado">Invitado</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-text-muted">Lab:</span>
                  <div className="inline-flex rounded-xl border border-[#655D52]/30 bg-white p-1">
                    {(['TODOS', 'LEPA', 'LEM'] as const).map((lab) => (
                      <button
                        key={lab}
                        type="button"
                        onClick={() => setFilterLabUsuario(lab)}
                        className={cn(
                          'px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer',
                          filterLabUsuario === lab
                            ? 'bg-primary text-white'
                            : 'text-text-muted hover:text-text-main',
                        )}
                      >
                        {lab}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Tabla */}
            <DesktopCard variant="default" padding="none" maxWidth="full" className="overflow-hidden">
              <DesktopTable<AdminUsuarioItem>
                columns={usuariosColumns}
                data={filteredUsuarios}
                keyExtractor={(item) => item.id}
                loading={isLoadingUsuarios}
                emptyMessage="No se encontraron usuarios registrados con ese criterio."
              />
            </DesktopCard>
          </div>
        )}

        {/* MODAL: CREAR / EDITAR UBICACIÓN */}
        {isUbicacionModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-[#FAF6F0] rounded-2xl border border-[#655D52]/40 shadow-xl max-w-md w-full p-6 space-y-5 animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-[#655D52]/20 pb-3">
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-5 h-5 text-primary" />
                  <h3 className="font-serif text-xl font-bold text-text-main">
                    {editingUbicacion ? 'Editar Ubicación' : 'Nueva Ubicación Física'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsUbicacionModalOpen(false)}
                  className="text-text-muted hover:text-text-main p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleGuardarUbicacion} className="space-y-4">
                <InputField
                  id="modal-ubicacion-nombre"
                  label="Nombre de la ubicación *"
                  placeholder="Ej. Estante C - Solventes Especiales"
                  value={ubicacionForm.nombre}
                  onChange={(e) => setUbicacionForm((p) => ({ ...p, nombre: e.target.value }))}
                  required
                />

                <div>
                  <label htmlFor="modal-ubicacion-lab" className="block text-sm font-medium text-text-main mb-1.5">
                    Laboratorio *
                  </label>
                  <select
                    id="modal-ubicacion-lab"
                    value={ubicacionForm.laboratorioCodigo}
                    onChange={(e) =>
                      setUbicacionForm((p) => ({
                        ...p,
                        laboratorioCodigo: e.target.value as LaboratorioCodigo,
                      }))
                    }
                    className="h-11 w-full rounded-input border border-[#4A4E4A] bg-white px-3.5 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="LEPA">LEPA - Ecología de Plantas Acuáticas</option>
                    <option value="LEM">LEM - Ecología de Microorganismos</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="modal-ubicacion-desc" className="block text-sm font-medium text-text-main mb-1.5">
                    Descripción / Observaciones (opcional)
                  </label>
                  <textarea
                    id="modal-ubicacion-desc"
                    rows={2}
                    placeholder="Detalles sobre temperatura, estante o gabinete..."
                    value={ubicacionForm.descripcion}
                    onChange={(e) => setUbicacionForm((p) => ({ ...p, descripcion: e.target.value }))}
                    className="w-full rounded-input border border-[#4A4E4A] bg-white p-3 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    id="modal-ubicacion-activo"
                    type="checkbox"
                    checked={ubicacionForm.activo}
                    onChange={(e) => setUbicacionForm((p) => ({ ...p, activo: e.target.checked }))}
                    className="rounded border-[#655D52]/40 text-primary focus:ring-primary h-4 w-4"
                  />
                  <label htmlFor="modal-ubicacion-activo" className="text-xs font-semibold text-text-main">
                    Ubicación activa y disponible para seleccionar
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#655D52]/20">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsUbicacionModalOpen(false)}
                    disabled={isSubmittingUbicacion}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" variant="default" disabled={isSubmittingUbicacion}>
                    {isSubmittingUbicacion ? 'Guardando...' : editingUbicacion ? 'Actualizar' : 'Crear Ubicación'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: CONFIRMAR ELIMINAR UBICACIÓN */}
        {deletingUbicacion && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-[#FAF6F0] rounded-2xl border border-[#655D52]/40 shadow-xl max-w-sm w-full p-6 space-y-4 animate-in zoom-in-95 text-center">
              <div className="w-12 h-12 rounded-full bg-alert-danger-bg text-alert-danger-border flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-text-main">
                ¿Eliminar ubicación física?
              </h3>
              <p className="font-sans text-xs text-text-muted">
                Se eliminará <strong>{deletingUbicacion.nombre}</strong> de {deletingUbicacion.laboratorioCodigo}. Esta acción no se puede deshacer.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDeletingUbicacion(null)}
                  disabled={isDeletingUbicacion}
                >
                  Cancelar
                </Button>
                <button
                  type="button"
                  onClick={handleConfirmarEliminarUbicacion}
                  disabled={isDeletingUbicacion}
                  className="px-4 py-2 rounded-btn bg-[#B83230] hover:bg-[#8F2725] text-white font-sans text-xs font-semibold transition-colors cursor-pointer"
                >
                  {isDeletingUbicacion ? 'Eliminando...' : 'Sí, eliminar'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: CREAR / EDITAR USUARIO */}
        {isUsuarioModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-[#FAF6F0] rounded-2xl border border-[#655D52]/40 shadow-xl max-w-lg w-full p-6 space-y-5 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-[#655D52]/20 pb-3">
                <div className="flex items-center gap-2.5">
                  <KeyRound className="w-5 h-5 text-primary" />
                  <h3 className="font-serif text-xl font-bold text-text-main">
                    {editingUsuario ? `Editar Usuario: ${editingUsuario.nombreCompleto}` : 'Nuevo Usuario del Sistema'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsUsuarioModalOpen(false)}
                  className="text-text-muted hover:text-text-main p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleGuardarUsuario} className="space-y-4">
                <InputField
                  id="modal-user-nombre"
                  label="Nombre Completo *"
                  placeholder="Ej. Dr. Andrés Bello"
                  value={usuarioForm.nombreCompleto}
                  onChange={(e) => setUsuarioForm((p) => ({ ...p, nombreCompleto: e.target.value }))}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <InputField
                    id="modal-user-cedula"
                    label="Cédula de Identidad *"
                    placeholder="Ej. V-18234567"
                    value={usuarioForm.cedula}
                    onChange={(e) => setUsuarioForm((p) => ({ ...p, cedula: e.target.value }))}
                    required
                  />

                  <InputField
                    id="modal-user-email"
                    type="email"
                    label="Correo electrónico *"
                    placeholder="Ej. andres.bello@ucv.ve"
                    value={usuarioForm.email}
                    disabled={Boolean(editingUsuario)}
                    onChange={(e) => setUsuarioForm((p) => ({ ...p, email: e.target.value }))}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="modal-user-rol" className="block text-sm font-medium text-text-main mb-1.5">
                      Rol de acceso *
                    </label>
                    <select
                      id="modal-user-rol"
                      value={usuarioForm.rol}
                      onChange={(e) => setUsuarioForm((p) => ({ ...p, rol: e.target.value as UserRole }))}
                      className="h-11 w-full rounded-input border border-[#4A4E4A] bg-white px-3.5 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="investigador">Investigador (Uso general)</option>
                      <option value="admin">Administrador (Control total)</option>
                      <option value="analista">Analista (Laboratorio)</option>
                      <option value="invitado">Invitado (Solo consulta)</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="modal-user-lab" className="block text-sm font-medium text-text-main mb-1.5">
                      Laboratorio adscrito *
                    </label>
                    <select
                      id="modal-user-lab"
                      value={usuarioForm.laboratorioCodigo}
                      onChange={(e) =>
                        setUsuarioForm((p) => ({
                          ...p,
                          laboratorioCodigo: e.target.value as LaboratorioCodigo,
                        }))
                      }
                      className="h-11 w-full rounded-input border border-[#4A4E4A] bg-white px-3.5 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="LEPA">LEPA - Plantas Acuáticas</option>
                      <option value="LEM">LEM - Microorganismos</option>
                    </select>
                  </div>
                </div>

                <InputField
                  id="modal-user-contacto"
                  label="Teléfono / Contacto (opcional)"
                  placeholder="Ej. 0412-1234567"
                  value={usuarioForm.contacto}
                  onChange={(e) => setUsuarioForm((p) => ({ ...p, contacto: e.target.value }))}
                />

                <div className="border-t border-[#655D52]/20 pt-3">
                  <InputField
                    id="modal-user-password"
                    variant="password"
                    label={editingUsuario ? 'Nueva Contraseña (dejar en blanco para mantener actual)' : 'Contraseña de Acceso *'}
                    placeholder={editingUsuario ? '••••••••' : 'Mínimo 6 caracteres'}
                    value={usuarioForm.password}
                    onChange={(e) => setUsuarioForm((p) => ({ ...p, password: e.target.value }))}
                    required={!editingUsuario}
                  />
                  {editingUsuario && (
                    <p className="text-[11px] text-text-muted mt-1">
                      Si se deja en blanco, la clave de acceso del usuario no se modificará.
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#655D52]/20">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsUsuarioModalOpen(false)}
                    disabled={isSubmittingUsuario}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" variant="default" disabled={isSubmittingUsuario}>
                    {isSubmittingUsuario ? 'Guardando...' : editingUsuario ? 'Actualizar Usuario' : 'Crear Usuario'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: CONFIRMAR ELIMINAR USUARIO */}
        {deletingUsuario && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-[#FAF6F0] rounded-2xl border border-[#655D52]/40 shadow-xl max-w-sm w-full p-6 space-y-4 animate-in zoom-in-95 text-center">
              <div className="w-12 h-12 rounded-full bg-alert-danger-bg text-alert-danger-border flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-text-main">
                ¿Eliminar usuario del sistema?
              </h3>
              <p className="font-sans text-xs text-text-muted">
                Se eliminará el acceso y perfil de <strong>{deletingUsuario.nombreCompleto}</strong> ({deletingUsuario.email}).
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDeletingUsuario(null)}
                  disabled={isDeletingUsuario}
                >
                  Cancelar
                </Button>
                <button
                  type="button"
                  onClick={handleConfirmarEliminarUsuario}
                  disabled={isDeletingUsuario}
                  className="px-4 py-2 rounded-btn bg-[#B83230] hover:bg-[#8F2725] text-white font-sans text-xs font-semibold transition-colors cursor-pointer"
                >
                  {isDeletingUsuario ? 'Eliminando...' : 'Sí, eliminar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DesktopLayout>
  )
}

export default DesktopAdminPage
