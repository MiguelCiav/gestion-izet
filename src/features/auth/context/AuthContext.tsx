import * as React from 'react'
import { supabase } from '@/lib/supabase'
import { getLabCodeById } from '@/lib/izetService'
import type { AuthUser, LabOption, LoginCredentials, RegisterStepData } from '../types'

export interface AuthContextType {
  user: AuthUser | null
  activeLab: LabOption
  setActiveLab: (lab: LabOption) => void
  isAuthenticated: boolean
  onboardingData: RegisterStepData
  setOnboardingData: React.Dispatch<React.SetStateAction<RegisterStepData>>
  login: (credentials: LoginCredentials) => Promise<boolean>
  registerUser: (data?: RegisterStepData) => Promise<{ success: boolean; error?: string }>
  loginAsGuest: () => void
  logout: () => Promise<void>
}

export const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY_USER = 'izet_auth_user'
const STORAGE_KEY_ONBOARDING = 'izet_onboarding_data'
const STORAGE_KEY_ACTIVE_LAB = 'izet_active_lab'

function buildAuthEmail(username: string, contacto?: string): string {
  const cleanContacto = (contacto || '').trim().toLowerCase()
  if (cleanContacto.includes('@')) {
    return cleanContacto
  }
  const cleanUser = username.trim().toLowerCase()
  if (cleanUser.includes('@')) {
    return cleanUser
  }
  const slug = cleanUser
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/^\.+|\.+$/g, '')
  return `${slug || 'usuario'}@izet.ucv.ve`
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER)
      if (!saved) return null
      const parsed = JSON.parse(saved) as AuthUser
      if (!parsed.id) return null
      return {
        ...parsed,
        lab: parsed.lab === 'LEM' ? 'LEM' : 'LEPA',
      }
    } catch {
      return null
    }
  })

  const [activeLab, setActiveLabState] = React.useState<LabOption>(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEY_USER)
      if (savedUser) {
        const parsed = JSON.parse(savedUser) as AuthUser
        if (parsed.rol !== 'admin' && (parsed.lab === 'LEM' || parsed.lab === 'LEPA')) {
          return parsed.lab
        }
      }
      const savedLab = localStorage.getItem(STORAGE_KEY_ACTIVE_LAB)
      if (savedLab === 'LEM' || savedLab === 'LEPA') return savedLab
      return 'LEPA'
    } catch {
      return 'LEPA'
    }
  })

  const [onboardingData, setOnboardingData] = React.useState<RegisterStepData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ONBOARDING)
      return saved ? JSON.parse(saved) : { lab: 'LEPA' }
    } catch {
      return { lab: 'LEPA' }
    }
  })

  const setActiveLab = React.useCallback(
    (lab: LabOption) => {
      // Un usuario regular (no admin) solo puede operar en su laboratorio asignado (HU01)
      if (user && user.rol !== 'admin') {
        setActiveLabState(user.lab)
        return
      }
      setActiveLabState(lab)
      try {
        localStorage.setItem(STORAGE_KEY_ACTIVE_LAB, lab)
      } catch {
        // Ignore storage error
      }
    },
    [user],
  )

  React.useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user))
        localStorage.setItem(STORAGE_KEY_ACTIVE_LAB, user.lab)
      } else {
        localStorage.removeItem(STORAGE_KEY_USER)
      }
    } catch {
      // Storage unavailable
    }
  }, [user])

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ONBOARDING, JSON.stringify(onboardingData))
    } catch {
      // Storage unavailable
    }
  }, [onboardingData])

  // Sincronizar sesión activa real de Supabase Auth al montar
  React.useEffect(() => {
    let mounted = true

    async function syncSession() {
      const { data } = await supabase.auth.getSession()
      const sessionUser = data.session?.user
      if (!mounted) return

      if (!sessionUser) {
        setUser(null)
        return
      }

      const { data: perfil } = await supabase
        .from('perfiles')
        .select('id, email, nombre_completo, cedula, contacto, rol, laboratorio_id')
        .eq('id', sessionUser.id)
        .maybeSingle()

      if (!mounted) return

      const resolvedLab: LabOption = perfil?.laboratorio_id
        ? getLabCodeById(perfil.laboratorio_id)
        : ((sessionUser.user_metadata?.laboratorio_codigo as LabOption) || 'LEPA')

      const authUser: AuthUser = {
        id: sessionUser.id,
        username:
          perfil?.nombre_completo ||
          (sessionUser.user_metadata?.nombre_completo as string) ||
          sessionUser.email?.split('@')[0] ||
          'Usuario',
        email: perfil?.email || sessionUser.email || '',
        cedula:
          perfil?.cedula ||
          (sessionUser.user_metadata?.cedula as string) ||
          undefined,
        contacto:
          perfil?.contacto ||
          (sessionUser.user_metadata?.contacto as string) ||
          undefined,
        rol: (perfil?.rol as AuthUser['rol']) || 'investigador',
        lab: resolvedLab,
      }

      setUser(authUser)
      setActiveLabState(resolvedLab)
    }

    void syncSession()

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return
      if (session?.user) {
        void syncSession()
      } else {
        setUser(null)
      }
    })

    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [])

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    const rawIdentifier = credentials.username.trim()
    if (!rawIdentifier || !credentials.password) return false

    // 1. Resolver el correo registrado en Supabase para el usuario/cédula/correo ingresado
    let emailToTry = rawIdentifier.toLowerCase()
    const { data: resolvedEmail } = await supabase.rpc('resolver_email_login', {
      p_identificador: rawIdentifier,
    })

    if (resolvedEmail) {
      emailToTry = resolvedEmail
    } else if (!emailToTry.includes('@')) {
      emailToTry = buildAuthEmail(rawIdentifier)
    }

    // 2. Autenticación estricta contra Supabase Auth (sin fallback local)
    const { data, error } = await supabase.auth.signInWithPassword({
      email: emailToTry,
      password: credentials.password,
    })

    if (error || !data.user) {
      return false
    }

    const { data: perfil } = await supabase
      .from('perfiles')
      .select('id, email, nombre_completo, cedula, contacto, rol, laboratorio_id')
      .eq('id', data.user.id)
      .maybeSingle()

    const resolvedLab: LabOption = perfil?.laboratorio_id
      ? getLabCodeById(perfil.laboratorio_id)
      : ((data.user.user_metadata?.laboratorio_codigo as LabOption) || 'LEPA')

    const loggedUser: AuthUser = {
      id: data.user.id,
      username:
        perfil?.nombre_completo ||
        (data.user.user_metadata?.nombre_completo as string) ||
        rawIdentifier,
      email: perfil?.email || data.user.email || emailToTry,
      cedula:
        perfil?.cedula ||
        (data.user.user_metadata?.cedula as string) ||
        undefined,
      contacto:
        perfil?.contacto ||
        (data.user.user_metadata?.contacto as string) ||
        undefined,
      rol:
        (perfil?.rol as AuthUser['rol']) ||
        ((data.user.user_metadata?.rol as AuthUser['rol']) ?? 'investigador'),
      lab: resolvedLab,
    }

    setUser(loggedUser)
    setActiveLabState(resolvedLab)
    return true
  }

  const registerUser = async (
    customData?: RegisterStepData,
  ): Promise<{ success: boolean; error?: string }> => {
    const target = customData ?? onboardingData
    const lab: LabOption = target.lab === 'LEM' ? 'LEM' : 'LEPA'
    const rawUsername = target.username?.trim() || ''
    const rawCedula = target.cedula?.trim() || ''
    const rawContacto = target.contacto?.trim() || ''
    const password = target.password || ''

    if (!rawUsername) {
      return { success: false, error: 'El nombre o usuario es obligatorio.' }
    }
    if (!rawCedula) {
      return { success: false, error: 'La cédula de identidad es obligatoria.' }
    }
    if (!rawContacto) {
      return { success: false, error: 'El teléfono o correo de contacto es obligatorio.' }
    }
    if (password.length < 6) {
      return { success: false, error: 'La clave debe tener al menos 6 caracteres.' }
    }

    const email = buildAuthEmail(rawUsername, rawContacto)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nombre_completo: rawUsername,
          cedula: rawCedula,
          contacto: rawContacto,
          rol: 'investigador',
          laboratorio_codigo: lab,
        },
      },
    })

    if (error || !data.user) {
      return {
        success: false,
        error: error?.message || 'No se pudo completar el registro en Supabase Auth.',
      }
    }

    await supabase.rpc('actualizar_perfil_registro', {
      p_user_id: data.user.id,
      p_email: email,
      p_nombre_completo: rawUsername,
      p_cedula: rawCedula,
      p_contacto: rawContacto,
      p_laboratorio_codigo: lab,
    })

    // Cerrar sesión temporal tras el registro para que el usuario ingrese formalmente en /login
    await supabase.auth.signOut()
    setUser(null)
    setActiveLabState(lab)
    return { success: true }
  }

  const loginAsGuest = () => {
    // Deshabilitado: solo usuarios autenticados en Supabase Auth pueden acceder
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
    } catch {
      // Ignore network signOut error
    }
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        activeLab: user && user.rol !== 'admin' ? user.lab : activeLab,
        setActiveLab,
        isAuthenticated: Boolean(user?.id),
        onboardingData,
        setOnboardingData,
        login,
        registerUser,
        loginAsGuest,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
