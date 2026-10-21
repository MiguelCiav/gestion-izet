# Gestión IZET - Frontend Design System

Sistema frontend y biblioteca de componentes para **Gestión IZET**, desarrollado con React 19, TypeScript, Vite y Tailwind CSS v3, fiel a los vectores y especificaciones de Figma.

---

## 📋 Componentes Oficiales Disponibles

Todos los componentes han sido creados siguiendo estrictamente sus especificaciones vectoriales SVG:

1. **[`Button`](./src/components/ui/Button.tsx)** (`COMPONENTE_BOTON.svg`): Botón de 60px con radio de 24px, variantes primary, outline y con flecha integrada.
2. **[`InputField`](./src/components/ui/InputField.tsx)** (`COMPONENT_INPUT_FIELD.svg`): Campo de entrada con variantes password (ojo sincronizado) y búsqueda (lupa integrada).
3. **[`RadioButton`](./src/components/ui/RadioButton.tsx)** (`COMPONENTE_RADIO_BUTTON.svg`): Radio button con un solo nivel de texto, círculo de 24px y check blanco institucional al activarse.
4. **[`Checkbox`](./src/components/ui/Checkbox.tsx)** (`COMPONENTE_CHECK.svg`): Casilla cuadrada de 18×18px con checkmark blanco y soporte indeterminado.
5. **[`SearchWrapper`](./src/components/ui/SearchWrapper.tsx)** (`COMPONENTE_SEARCH_WRAPPER.svg`): Barra de búsqueda táctil con botón de filtro (`FiltersIcon`).
6. **[`Stepper`](./src/components/ui/Stepper.tsx)** (`COMPONENTE_STEPPER.svg`): Selector de cantidad y asistente secuencial `StepIndicator`.
7. **[`Navbar`](./src/components/layout/Navbar.tsx)** (`COMPONENTE_NAVBAR.svg`): Barra de navegación móvil inferior de 88px con esquinas superiores redondeadas de 8px y fondo `#FAF6F0`.
8. **[`IconWrapper`](./src/components/ui/IconWrapper.tsx)** (`COMPONENTE_ICON_WRAPPER.svg`): Contenedor de íconos con pastilla activa verde al 10% de opacidad (`bg-primary/10`).
9. **[`FloatingButton`](./src/components/ui/FloatingButton.tsx)** (`COMPONENT_FLOATING_BUTTON.svg`): Botón circular de 56×56px en verde `#316342` con tarjeta opcional *"Registrar reactivo"*.
10. **[`RomboBadge`](./src/components/ui/RomboBadge.tsx)** (`COMPONENTE_ROMBO.svg`): Diamante de seguridad química NFPA 704 normalizado.
11. **[`SectionCard`](./src/components/ui/SectionCard.tsx)** (`COMPONENT_SECTION.svg`): Encabezado con tipografía Serif (`Literata`) y línea divisoria horizontal de 2px.
12. **[`ReactivoCard`](./src/components/ui/ReactivoCard.tsx)** (`COMPONENTE_REACTIVO.svg`): Tarjeta de reactivo limpia y plana (sin sombras) con acento verde institucional `#4A7C59` y rombo de seguridad.
13. **[`Alert`](./src/components/ui/Alert.tsx)** (`COMPONENTE_ALERT.svg`): Notificaciones de estado (`warning` y `danger`) con borde de 4px e ícono integrado, sin botón de descarte.
14. **[`AlertBitacora`](./src/components/ui/AlertBitacora.tsx)** (`COMPONENTE_ALERT_BITACORA.svg`): Tarjeta de auditoría e historial de laboratorio con usuario y fecha.

Para consultar los detalles técnicos y props de cada componente, revisa [`COMPONENTS.md`](./COMPONENTS.md).  
Para consultar las directrices de construcción de vistas, revisa [`SCREEN_RULES.md`](./SCREEN_RULES.md).

---

## 🏗️ Arquitectura Feature-Driven Development (FDD)

El proyecto organiza la lógica de negocio y módulos de la aplicación bajo una arquitectura guiada por características (**Feature-Driven Development**) dentro de [`src/features/`](./src/features). Cada módulo encapsula sus propios recursos para garantizar alta cohesión y bajo acoplamiento.

### Estructura General de Features

```text
src/features/
├── auth/         # Autenticación, registro por pasos y onboarding
├── inventario/   # Hub de inventario (Reactivos, Vidrios, Equipos, Reporte) y Detalle de Reactivo
├── bitacora/     # Bitácora histórica, movimientos de consumo, ajuste y préstamo
├── consumo/      # Dashboard principal con alertas de laboratorio y registro de consumo
└── prestamos/    # Catálogo de reactivos y solicitudes de préstamo con selector de cantidad
```

### 📱💻 Arquitectura Responsive Unificada por URL

Cada ruta canónica de la aplicación es **100% responsiva**. Al redimensionar la ventana o acceder desde distintos dispositivos, el sistema conmuta fluidamente entre la vista de escritorio (con barra lateral `DesktopSidebar`, topbar de perfil y tablas de datos) y la vista móvil (con `AppHeader`, tarjetas táctiles y barra inferior `Navbar`):

| Módulo | Funcionalidad | URL Canónica | Componente Desktop (≥1024px) | Componente Móvil (<1024px) |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | Iniciar Sesión | `/login` | [`DesktopLoginPage`](./src/features/auth/pages/DesktopLoginPage.tsx) | [`LoginPage`](./src/features/auth/pages/LoginPage.tsx) |
| **Auth** | Onboarding Paso 1 | `/auth/paso-1` | [`DesktopInicioPaso1Page`](./src/features/auth/pages/DesktopInicioPaso1Page.tsx) | [`InicioPaso1Page`](./src/features/auth/pages/InicioPaso1Page.tsx) |
| **Auth** | Onboarding Paso 2 | `/auth/paso-2` | [`DesktopInicioPaso2Page`](./src/features/auth/pages/DesktopInicioPaso2Page.tsx) | [`InicioPaso2Page`](./src/features/auth/pages/InicioPaso2Page.tsx) |
| **Auth** | Onboarding Paso 3 | `/auth/paso-3` | [`DesktopInicioPaso3Page`](./src/features/auth/pages/DesktopInicioPaso3Page.tsx) | [`InicioPaso3Page`](./src/features/auth/pages/InicioPaso3Page.tsx) |
| **Auth** | Wizard Completo | `/onboarding` | [`DesktopOnboardingWizardPage`](./src/features/auth/pages/DesktopOnboardingWizardPage.tsx) | [`OnboardingWizardPage`](./src/features/auth/pages/OnboardingWizardPage.tsx) |
| **Consumo** | Dashboard Principal | `/dashboard` | [`DesktopDashboardPage`](./src/features/consumo/pages/DesktopDashboardPage.tsx) | [`DashboardPage`](./src/features/consumo/pages/DashboardPage.tsx) |
| **Consumo** | Selección de Reactivo | `/consumo` | [`DesktopConsumoPage`](./src/features/consumo/pages/DesktopConsumoPage.tsx) | [`ConsumoPage`](./src/features/consumo/pages/ConsumoPage.tsx) |
| **Consumo** | Detalle de Consumo | `/consumo/detalle` | [`DesktopConsumoDetallePage`](./src/features/consumo/pages/DesktopConsumoDetallePage.tsx) | [`ConsumoDetallePage`](./src/features/consumo/pages/ConsumoDetallePage.tsx) |
| **Inventario** | Catálogo / Hub | `/inventario` | [`DesktopInventarioPage`](./src/features/inventario/pages/DesktopInventarioPage.tsx) | [`InventarioHubPage`](./src/features/inventario/pages/InventarioHubPage.tsx) |
| **Inventario** | Lista de Reactivos | `/inventario/reactivos` | [`DesktopInventarioPage`](./src/features/inventario/pages/DesktopInventarioPage.tsx) | [`InventarioReactivosPage`](./src/features/inventario/pages/InventarioReactivosPage.tsx) |
| **Inventario** | Ficha de Detalle | `/inventario/detalle` | [`DesktopInventarioDetallePage`](./src/features/inventario/pages/DesktopInventarioDetallePage.tsx) | [`InventarioReactivoDetallePage`](./src/features/inventario/pages/InventarioReactivoDetallePage.tsx) |
| **Inventario** | Registro Nuevo | `/inventario/nuevo` | [`DesktopInventarioNuevoPage`](./src/features/inventario/pages/DesktopInventarioNuevoPage.tsx) | [`InventarioReactivoDetallePage`](./src/features/inventario/pages/InventarioReactivoDetallePage.tsx) |
| **Bitácora** | Historial General | `/bitacora` | [`DesktopBitacoraPage`](./src/features/bitacora/pages/DesktopBitacoraPage.tsx) | [`BitacoraPage`](./src/features/bitacora/pages/BitacoraPage.tsx) |
| **Bitácora** | Registro de Ajuste | `/bitacora/ajuste` | [`DesktopBitacoraAjustePage`](./src/features/bitacora/pages/DesktopBitacoraAjustePage.tsx) | [`BitacoraAjustePage`](./src/features/bitacora/pages/BitacoraAjustePage.tsx) |
| **Bitácora** | Registro de Consumo | `/bitacora/consumo` | [`DesktopBitacoraConsumoPage`](./src/features/bitacora/pages/DesktopBitacoraConsumoPage.tsx) | [`BitacoraConsumoPage`](./src/features/bitacora/pages/BitacoraConsumoPage.tsx) |
| **Bitácora** | Registro de Préstamo | `/bitacora/prestamo` | [`DesktopBitacoraPrestamoPage`](./src/features/bitacora/pages/DesktopBitacoraPrestamoPage.tsx) | [`BitacoraPrestamoPage`](./src/features/bitacora/pages/BitacoraPrestamoPage.tsx) |
| **Préstamos** | Tabla de Préstamos | `/prestamos` | [`DesktopPrestamosPage`](./src/features/prestamos/pages/DesktopPrestamosPage.tsx) | [`PrestamosPage`](./src/features/prestamos/pages/PrestamosPage.tsx) |
| **Préstamos** | Solicitar Préstamo | `/prestamos/solicitar` | [`DesktopPrestamosSolicitarPage`](./src/features/prestamos/pages/DesktopPrestamosSolicitarPage.tsx) | [`PrestamosDetallePage`](./src/features/prestamos/pages/PrestamosDetallePage.tsx) |

> **Nota:** La ruta raíz `/` evalúa el estado de autenticación redirigiendo al `/dashboard` o al `/login`. La vitrina de componentes de desarrollo permanece disponible en `/showcase`. Todas las rutas previas con prefijo `/desktop/*` redirigen automáticamente a su equivalente canónico.

---

## 🛠️ Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Verificación de tipos estática
npm run typecheck

# Linteo con Oxlint
npm run lint

# Compilación de producción
npm run build
```
