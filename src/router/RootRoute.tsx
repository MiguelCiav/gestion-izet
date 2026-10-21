import { Navigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks'

/**
 * RootRoute - Redirige al dashboard si el usuario es administrador,
 * a consumo si es un usuario regular autenticado, o al login si no ha iniciado sesión.
 */
export function RootRoute() {
  const { isAuthenticated, user } = useAuth()
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  const isAdmin = user?.rol === 'admin'
  return <Navigate to={isAdmin ? '/dashboard' : '/consumo'} replace />
}

export default RootRoute
