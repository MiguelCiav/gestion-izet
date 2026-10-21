import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  DesktopCard,
  DesktopCardHeader,
  DesktopCardTitle,
  DesktopCardDescription,
  DesktopCardContent,
  DesktopCardFooter,
} from '@/components/desktop'
import { Button, InputField } from '@/components/ui'
import { AuthLogo } from '../components'
import { useAuth } from '../hooks'
import type { LoginCredentials } from '../types'

export interface DesktopLoginPageProps {
  onSubmit?: (credentials: LoginCredentials) => void | Promise<void>
  onRegisterClick?: () => void
  onGuestClick?: () => void
  isLoading?: boolean
  errorMessage?: string
}

export function DesktopLoginPage({
  onSubmit,
  onRegisterClick,
  isLoading = false,
  errorMessage,
}: DesktopLoginPageProps) {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [localError, setLocalError] = React.useState<string | null>(null)
  const [internalLoading, setInternalLoading] = React.useState(false)

  const effectiveLoading = isLoading || internalLoading
  const displayedError = errorMessage || localError

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!username.trim()) {
      setLocalError('Por favor ingrese su usuario, cédula o correo.')
      return
    }
    if (!password) {
      setLocalError('Por favor ingrese su contraseña.')
      return
    }

    setLocalError(null)

    if (onSubmit) {
      await onSubmit({ username, password })
      return
    }

    setInternalLoading(true)
    try {
      const success = await login({ username, password })
      if (success) {
        navigate('/')
      } else {
        setLocalError('Credenciales incorrectas. Verifique su usuario y contraseña.')
      }
    } finally {
      setInternalLoading(false)
    }
  }

  const handleRegister = () => {
    if (onRegisterClick) {
      onRegisterClick()
    } else {
      navigate('/auth/paso-1')
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#FAF6F0] flex flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8 select-none">
      {/* Logotipo Vectorial Institucional Centrado */}
      <div className="mb-6 flex justify-center">
        <AuthLogo size={112} />
      </div>

      {/* Contenedor Oficial DesktopCard */}
      <DesktopCard maxWidth="default" className="w-full max-w-[560px] bg-[#FAF6F0]">
        <DesktopCardHeader className="mb-6 text-center">
          <DesktopCardTitle className="font-serif text-3xl font-bold text-primary tracking-tight">
            Iniciar Sesión
          </DesktopCardTitle>
          <DesktopCardDescription className="text-sm sm:text-base text-[#4A4E4A] mt-1.5 leading-relaxed">
            Ingresa tus credenciales para acceder al sistema
          </DesktopCardDescription>
        </DesktopCardHeader>

        {displayedError && (
          <div
            role="alert"
            className="mb-4 p-3.5 text-xs font-medium rounded-input bg-alert-danger-bg text-alert-danger-border border border-alert-danger-border text-center"
          >
            {displayedError}
          </div>
        )}

        <form onSubmit={(e) => void handleSubmit(e)} className="w-full space-y-4">
          <DesktopCardContent className="space-y-4 p-0">
            <InputField
              label="Usuario, cédula o correo"
              name="username"
              placeholder="Ingrese su usuario, cédula o correo"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                setLocalError(null)
              }}
              required
              autoComplete="username"
              disabled={effectiveLoading}
            />

            <InputField
              label="Contraseña"
              name="password"
              variant="password"
              placeholder="Ingrese su contraseña"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setLocalError(null)
              }}
              required
              autoComplete="current-password"
              disabled={effectiveLoading}
            />
          </DesktopCardContent>

          <DesktopCardFooter className="pt-4 space-y-3 w-full">
            <Button
              type="submit"
              size="lg"
              fullWidth
              disabled={effectiveLoading}
            >
              {effectiveLoading ? 'Verificando...' : 'Iniciar Sesión'}
            </Button>

            <Button
              type="button"
              variant="outline"
              size="lg"
              fullWidth
              disabled={effectiveLoading}
              onClick={handleRegister}
            >
              Registrarse
            </Button>
          </DesktopCardFooter>
        </form>
      </DesktopCard>
    </div>
  )
}

export default DesktopLoginPage
