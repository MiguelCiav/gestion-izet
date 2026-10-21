import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthLogo, LoginForm } from '../components'
import { useAuth } from '../hooks'
import type { LoginCredentials } from '../types'

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | undefined>(undefined)

  const handleLogin = async (credentials: LoginCredentials) => {
    setIsLoading(true)
    setErrorMessage(undefined)
    try {
      const success = await login(credentials)
      if (success) {
        navigate('/')
      } else {
        setErrorMessage('Credenciales incorrectas. Verifica tu usuario y contraseña.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = () => {
    navigate('/auth/paso-1')
  }

  return (
    <div className="min-h-screen w-full bg-[#FAF6F0] flex flex-col items-center justify-between px-8 py-10 sm:py-16">
      <div className="w-full max-w-[348px] flex flex-col items-center space-y-8 my-auto">
        {/* Logotipo Vectorial Oficial */}
        <div className="flex justify-center">
          <AuthLogo size={128} />
        </div>

        {/* Título de Bienvenida en Serif institucional */}
        <h1 className="font-serif text-[32px] sm:text-4xl font-bold text-primary text-center tracking-tight">
          ¡Bienvenido!
        </h1>

        {/* Formulario de Acceso */}
        <LoginForm
          onSubmit={(creds) => void handleLogin(creds)}
          onRegisterClick={handleRegister}
          isLoading={isLoading}
          errorMessage={errorMessage}
        />
      </div>
    </div>
  )
}

export default LoginPage
