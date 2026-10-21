import * as React from 'react'
import { AuthContext, type AuthContextType } from '../context/AuthContext'

export function useAuth(): AuthContextType {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe utilizarse dentro de un AuthProvider')
  }
  return context
}
