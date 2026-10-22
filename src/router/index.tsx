import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ResponsiveView } from '@/components/layout/ResponsiveView'
import { RootRoute } from './RootRoute'
import { ProtectedRoute } from './ProtectedRoute'
import HomePage from '@/pages/HomePage'
import {
  LoginPage,
  InicioPaso1Page,
  InicioPaso2Page,
  InicioPaso3Page,
  OnboardingWizardPage,
  DesktopLoginPage,
  DesktopOnboardingWizardPage,
  DesktopInicioPaso1Page,
  DesktopInicioPaso2Page,
  DesktopInicioPaso3Page,
} from '@/features/auth'
import {
  BitacoraPage,
  BitacoraAjustePage,
  BitacoraConsumoPage,
  BitacoraPrestamoPage,
  DesktopBitacoraPage,
  DesktopBitacoraAjustePage,
  DesktopBitacoraConsumoPage,
  DesktopBitacoraPrestamoPage,
} from '@/features/bitacora'
import {
  DashboardPage,
  ConsumoPage,
  ConsumoDetallePage,
  DesktopDashboardPage,
  DesktopConsumoPage,
  DesktopConsumoDetallePage,
} from '@/features/consumo'
import {
  InventarioHubPage,
  InventarioReactivosPage,
  InventarioReactivoDetallePage,
  DesktopInventarioPage,
  DesktopInventarioDetallePage,
  DesktopInventarioNuevoPage,
} from '@/features/inventario'
import {
  PrestamosPage,
  PrestamosDetallePage,
  DesktopPrestamosPage,
  DesktopPrestamosSolicitarPage,
} from '@/features/prestamos'
import { DesktopAdminPage } from '@/features/admin/pages/DesktopAdminPage'

export const router = createBrowserRouter([
  // 1. Ruta Raíz
  {
    path: '/',
    element: <RootRoute />,
  },

  // 2. Auth & Onboarding (Responsive)
  {
    path: '/login',
    element: <ResponsiveView desktop={DesktopLoginPage} mobile={LoginPage} />,
  },
  {
    path: '/auth/login',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/auth/paso-1',
    element: <ResponsiveView desktop={DesktopInicioPaso1Page} mobile={InicioPaso1Page} />,
  },
  {
    path: '/auth/paso-2',
    element: <ResponsiveView desktop={DesktopInicioPaso2Page} mobile={InicioPaso2Page} />,
  },
  {
    path: '/auth/paso-3',
    element: <ResponsiveView desktop={DesktopInicioPaso3Page} mobile={InicioPaso3Page} />,
  },
  {
    path: '/onboarding',
    element: <ResponsiveView desktop={DesktopOnboardingWizardPage} mobile={OnboardingWizardPage} />,
  },
  {
    path: '/auth/onboarding',
    element: <Navigate to="/onboarding" replace />,
  },

  // 3. Dashboard (Exclusivo para Administrador)
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute adminOnly>
        <ResponsiveView desktop={DesktopDashboardPage} mobile={DashboardPage} />
      </ProtectedRoute>
    ),
  },

  // 4. Consumo (Accesible para todos los usuarios autenticados)
  {
    path: '/consumo',
    element: (
      <ProtectedRoute>
        <ResponsiveView desktop={DesktopConsumoPage} mobile={ConsumoPage} />
      </ProtectedRoute>
    ),
  },
  {
    path: '/consumo/detalle',
    element: (
      <ProtectedRoute>
        <ResponsiveView desktop={DesktopConsumoDetallePage} mobile={ConsumoDetallePage} />
      </ProtectedRoute>
    ),
  },

  // 5. Inventario (Exclusivo para Administrador)
  {
    path: '/inventario',
    element: (
      <ProtectedRoute adminOnly>
        <ResponsiveView desktop={DesktopInventarioPage} mobile={InventarioHubPage} />
      </ProtectedRoute>
    ),
  },
  {
    path: '/inventario/reactivos',
    element: (
      <ProtectedRoute adminOnly>
        <ResponsiveView desktop={DesktopInventarioPage} mobile={InventarioReactivosPage} />
      </ProtectedRoute>
    ),
  },
  {
    path: '/inventario/reactivos/detalle',
    element: (
      <ProtectedRoute adminOnly>
        <ResponsiveView desktop={DesktopInventarioDetallePage} mobile={InventarioReactivoDetallePage} />
      </ProtectedRoute>
    ),
  },
  {
    path: '/inventario/detalle',
    element: (
      <ProtectedRoute adminOnly>
        <ResponsiveView desktop={DesktopInventarioDetallePage} mobile={InventarioReactivoDetallePage} />
      </ProtectedRoute>
    ),
  },
  {
    path: '/inventario/nuevo',
    element: (
      <ProtectedRoute adminOnly>
        <ResponsiveView desktop={DesktopInventarioNuevoPage} mobile={InventarioReactivoDetallePage} />
      </ProtectedRoute>
    ),
  },
  {
    path: '/inventario/reactivos/nuevo',
    element: (
      <ProtectedRoute adminOnly>
        <ResponsiveView desktop={DesktopInventarioNuevoPage} mobile={InventarioReactivoDetallePage} />
      </ProtectedRoute>
    ),
  },
  {
    path: '/inventario/vidrios',
    element: (
      <ProtectedRoute adminOnly>
        <ResponsiveView desktop={DesktopInventarioPage} mobile={InventarioReactivosPage} />
      </ProtectedRoute>
    ),
  },
  {
    path: '/inventario/equipos',
    element: (
      <ProtectedRoute adminOnly>
        <ResponsiveView desktop={DesktopInventarioPage} mobile={InventarioReactivosPage} />
      </ProtectedRoute>
    ),
  },
  {
    path: '/inventario/reporte',
    element: (
      <ProtectedRoute adminOnly>
        <ResponsiveView desktop={DesktopInventarioPage} mobile={InventarioReactivosPage} />
      </ProtectedRoute>
    ),
  },

  // 6. Bitácora (Exclusivo para Administrador - HU06)
  {
    path: '/bitacora',
    element: (
      <ProtectedRoute adminOnly>
        <ResponsiveView desktop={DesktopBitacoraPage} mobile={BitacoraPage} />
      </ProtectedRoute>
    ),
  },
  {
    path: '/bitacora/ajuste',
    element: (
      <ProtectedRoute adminOnly>
        <ResponsiveView desktop={DesktopBitacoraAjustePage} mobile={BitacoraAjustePage} />
      </ProtectedRoute>
    ),
  },
  {
    path: '/bitacora/consumo',
    element: (
      <ProtectedRoute adminOnly>
        <ResponsiveView desktop={DesktopBitacoraConsumoPage} mobile={BitacoraConsumoPage} />
      </ProtectedRoute>
    ),
  },
  {
    path: '/bitacora/prestamo',
    element: (
      <ProtectedRoute adminOnly>
        <ResponsiveView desktop={DesktopBitacoraPrestamoPage} mobile={BitacoraPrestamoPage} />
      </ProtectedRoute>
    ),
  },

  // 7. Préstamos (Usuarios regulares solo solicitan; Administrador gestiona todo)
  {
    path: '/prestamos',
    element: (
      <ProtectedRoute>
        <ResponsiveView desktop={DesktopPrestamosPage} mobile={PrestamosPage} />
      </ProtectedRoute>
    ),
  },
  {
    path: '/prestamos/detalle',
    element: (
      <ProtectedRoute>
        <ResponsiveView desktop={DesktopPrestamosSolicitarPage} mobile={PrestamosDetallePage} />
      </ProtectedRoute>
    ),
  },
  {
    path: '/prestamos/solicitar',
    element: (
      <ProtectedRoute>
        <ResponsiveView desktop={DesktopPrestamosSolicitarPage} mobile={PrestamosDetallePage} />
      </ProtectedRoute>
    ),
  },

  // 8. Módulo de Administración (Solo Administradores)
  {
    path: '/admin',
    element: (
      <ProtectedRoute adminOnly>
        <DesktopAdminPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/desktop/admin',
    element: <Navigate to="/admin" replace />,
  },

  // 9. Rutas Alias Desktop
  {
    path: '/desktop/login',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/desktop/onboarding',
    element: <Navigate to="/onboarding" replace />,
  },
  {
    path: '/desktop/auth/paso-1',
    element: <Navigate to="/auth/paso-1" replace />,
  },
  {
    path: '/desktop/auth/paso-2',
    element: <Navigate to="/auth/paso-2" replace />,
  },
  {
    path: '/desktop/auth/paso-3',
    element: <Navigate to="/auth/paso-3" replace />,
  },
  {
    path: '/desktop/dashboard',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/desktop/consumo',
    element: <Navigate to="/consumo" replace />,
  },
  {
    path: '/desktop/consumo/detalle',
    element: <Navigate to="/consumo/detalle" replace />,
  },
  {
    path: '/desktop/inventario',
    element: <Navigate to="/inventario" replace />,
  },
  {
    path: '/desktop/inventario/detalle',
    element: <Navigate to="/inventario/detalle" replace />,
  },
  {
    path: '/desktop/inventario/nuevo',
    element: <Navigate to="/inventario/nuevo" replace />,
  },
  {
    path: '/desktop/inventario/reactivos',
    element: <Navigate to="/inventario/reactivos" replace />,
  },
  {
    path: '/desktop/inventario/reactivos/detalle',
    element: <Navigate to="/inventario/detalle" replace />,
  },
  {
    path: '/desktop/inventario/reactivos/nuevo',
    element: <Navigate to="/inventario/nuevo" replace />,
  },
  {
    path: '/desktop/bitacora',
    element: <Navigate to="/bitacora" replace />,
  },
  {
    path: '/desktop/bitacora/ajuste',
    element: <Navigate to="/bitacora/ajuste" replace />,
  },
  {
    path: '/desktop/bitacora/consumo',
    element: <Navigate to="/bitacora/consumo" replace />,
  },
  {
    path: '/desktop/bitacora/prestamo',
    element: <Navigate to="/bitacora/prestamo" replace />,
  },
  {
    path: '/desktop/prestamos',
    element: <Navigate to="/prestamos" replace />,
  },
  {
    path: '/desktop/prestamos/solicitar',
    element: <Navigate to="/prestamos/solicitar" replace />,
  },

  // 9. Vitrina de Componentes / Pruebas de Desarrollo
  {
    path: '/showcase',
    element: <HomePage />,
  },

  // 10. Fallback global
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])
