import * as React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks'

export interface ProtectedRouteProps {
  children: React.ReactNode
  /** Si es true, solo el administrador del sistema puede acceder a esta ruta */
  adminOnly?: boolean
}

export function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (adminOnly && user?.rol !== 'admin') {
    return <Navigate to="/consumo" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
