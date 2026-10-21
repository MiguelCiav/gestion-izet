import * as React from 'react'
import { Button } from '@/components/ui/Button'
import { InputField } from '@/components/ui/InputField'
import type { LoginCredentials } from '../types'

export interface LoginFormProps {
  onSubmit?: (credentials: LoginCredentials) => void
  onRegisterClick?: () => void
  onGuestClick?: () => void
  isLoading?: boolean
  errorMessage?: string
}

export function LoginForm({
  onSubmit,
  onRegisterClick,
  isLoading = false,
  errorMessage,
}: LoginFormProps) {
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.({ username, password })
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      {errorMessage && (
        <div
          role="alert"
          className="p-3 text-xs font-medium rounded-input bg-alert-danger-bg text-alert-danger-border border border-alert-danger-border text-center"
        >
          {errorMessage}
        </div>
      )}

      {/* Campos de Entrada */}
      <div className="space-y-4">
        <InputField
          name="username"
          placeholder="Usuario, cédula o correo"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          disabled={isLoading}
          autoComplete="username"
        />

        <InputField
          name="password"
          variant="password"
          placeholder="Ingrese su contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
          autoComplete="current-password"
        />
      </div>

      {/* Botones de Acción */}
      <div className="space-y-4 pt-2">
        <Button
          type="submit"
          size="lg"
          fullWidth
          disabled={isLoading}
        >
          {isLoading ? 'Verificando...' : 'Iniciar Sesión'}
        </Button>

        <Button
          type="button"
          variant="outline"
          size="lg"
          fullWidth
          disabled={isLoading}
          onClick={onRegisterClick}
        >
          Registrarse
        </Button>
      </div>
    </form>
  )
}
