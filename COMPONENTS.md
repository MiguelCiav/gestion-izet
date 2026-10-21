# Catálogo de Componentes - Gestión IZET

Este documento proporciona una descripción breve y técnica de cada componente disponible en la biblioteca del proyecto, sus variantes, propiedades clave y casos de uso previstos.

---

## 1. Componentes de Entrada y Formulario

### [`Button`](./src/components/ui/Button.tsx)
- **Origen de diseño**: `COMPONENTE_BOTON.svg`
- **Descripción**: Botón interactivo principal del sistema. Diseñado con una altura táctil de 60px y radio de curvatura de 24px (`rounded-3xl`). Admite flecha orientada a la derecha sincronizada vectorialmente.
- **Variantes**:
  - `primary`: Fondo verde institucional (`#446E53`), texto blanco.
  - `secondary`: Fondo verde suave (`#E2EAE3`), texto verde institucional.
  - `outline`: Borde sólido de 1px en `#2F2B28` sobre fondo blanco/transparente.
  - `ghost`: Fondo transparente con hover suave.
  - `danger`: Fondo de advertencia crítica con borde rojo.
- **Props destacadas**: `variant`, `size` (`default: 60px`, `sm`, `lg`, `icon`), `showArrow` (booleano para añadir `ArrowRightIcon`).

---

### [`InputField`](./src/components/ui/InputField.tsx)
- **Origen de diseño**: `COMPONENT_INPUT_FIELD.svg`
- **Descripción**: Campo de entrada con soporte integrado para etiquetas superiores, textos de ayuda, mensajes de error y widgets laterales. Incorpora de forma nativa la alternancia de visibilidad de contraseña (con los íconos sincronizados `EyeIcon` y `EyeOffIcon`).
- **Variantes**:
  - `variant="default"`: Campo de texto, email o numérico convencional.
  - `variant="password"`: Incluye alternador ocular sin desplazamiento visual ni distorsión de silueta.
  - `variant="search"`: Incorpora `SearchIcon` integrado en el margen izquierdo.
- **Props destacadas**: `label`, `error`, `helperText`, `variant`, `leftIcon`, `rightIcon`.

---

### [`RadioButton`](./src/components/ui/RadioButton.tsx)
- **Origen de diseño**: `COMPONENTE_RADIO_BUTTON.svg`
- **Descripción**: Botón de selección única con etiqueta en un solo nivel de texto (sin subtítulos secundarios). Diámetro de 24px con aro perimetral en `#655D52`. Al activarse, transiciona al color institucional `#4A7C59` y revela en su centro el ícono vectorial blanco [`RadioCheckIcon`](./src/assets/icons/radio-check.svg).
- **Props destacadas**: `label`, `name`, `value`, `checked`, `disabled`, `onChange`.

---

### [`Checkbox`](./src/components/ui/Checkbox.tsx)
- **Origen de diseño**: `COMPONENTE_CHECK.svg`
- **Descripción**: Casilla de verificación cuadrada de 18×18px con bordes sutiles redondeados (`rounded-[4px]`). En estado desmarcado presenta un borde neutro (`#C1C9BF`); al seleccionarse se rellena de verde `#446E53` desplegando el check blanco [`CheckIcon`](./src/assets/icons/check.svg).
- **Variantes / Estados**: Desmarcado, Marcado (`checked`), Indeterminado (`indeterminate` con guión horizontal).
- **Props destacadas**: `checked`, `indeterminate`, `label`, `description`, `disabled`, `onCheckedChange`.

---

### [`SearchWrapper`](./src/components/ui/SearchWrapper.tsx)
- **Origen de diseño**: `COMPONENTE_SEARCH_WRAPPER.svg`
- **Descripción**: Barra de búsqueda combinada de 48px de altura con campo de texto integrado y botón adyacente para filtros. El botón de filtros utiliza el ícono exclusivo [`FiltersIcon`](./src/assets/icons/filters.svg) y reacciona al tacto de forma plana sin sombras intrusivas.
- **Props destacadas**: `value`, `onChange`, `onFilterClick`, `filterActive`, `placeholder`.

---

### [`Stepper`](./src/components/ui/Stepper.tsx)
- **Origen de diseño**: `COMPONENTE_STEPPER.svg`
- **Descripción**: Selector de cantidad de dos variantes:
  1. **Contador de unidades**: Botones circulares de 48px con signos [`MinusIcon`](./src/assets/icons/minus.svg) y [`PlusIcon`](./src/assets/icons/plus.svg), acompañando una caja de valor central de 96px con tipografía Serif (`Literata`).
  2. **`StepIndicator`**: Línea de tiempo secuencial de flujo (asistente de pasos o wizard) con barra continua, círculos de 24px con checkmark institucional (`#4A7C59`) y etiquetas inferiores.
- **Props destacadas (`Stepper`)**: `value`, `onChange`, `min`, `max`, `step`, `size` (`sm`, `default`, `lg`), `disabled`.
- **Props destacadas (`StepIndicator`)**: `steps`, `currentStep`, `onStepClick`.

---

## 2. Componentes de Navegación e Iconografía

### [`Navbar`](./src/components/layout/Navbar.tsx)
- **Origen de diseño**: `COMPONENTE_NAVBAR.svg`
- **Descripción**: Barra de navegación móvil inferior de 88px de altura que en vista móvil se extiende de extremo a extremo (`w-full left-0 right-0`) hasta tocar los bordes del dispositivo, con esquinas superiores redondeadas (`rounded-t-[8px]`), borde superior delimitador y fondo `#FAF6F0`. Aloja las cuatro secciones principales del sistema mediante botones con pastillas de ícono activas de 52×24px (`bg-primary/10`).
- **Secciones predeterminadas**:
  1. *Inventario* ([`ArchiveBoxIcon`](./src/assets/icons/archive-box.svg))
  2. *Bitácora* ([`ClipboardListIcon`](./src/assets/icons/clipboard-list.svg))
  3. *Préstamos* ([`ArrowsLeftRightIcon`](./src/assets/icons/arrows-left-right.svg))
  4. *Dashboard* ([`DashboardBlocksIcon`](./src/assets/icons/dashboard-blocks.svg))
- **Props destacadas**: `items`, `activeId`, `defaultActiveId`, `onItemChange`, `fixed`.

---

### [`IconWrapper`](./src/components/ui/IconWrapper.tsx)
- **Origen de diseño**: `COMPONENTE_ICON_WRAPPER.svg`
- **Descripción**: Píldora contenedora de íconos de navegación (52×24px) con texto inferior. En estado inactivo es neutra y transparente; al activarse resalta con fondo verde al 10% de opacidad (`bg-primary/10`) y texto institucional en negrita.
- **Props destacadas**: `icon`, `label`, `active`, `badge`, `size`.

---

### [`FloatingButton`](./src/components/ui/FloatingButton.tsx)
- **Origen de diseño**: `COMPONENT_FLOATING_BUTTON.svg`
- **Descripción**: Botón flotante circular de acción rápida (56×56px) en color verde `#316342` con el ícono blanco [`PlusIcon`](./src/assets/icons/plus.svg). Puede presentarse aislado o acompañado de su tarjeta informativa lateral izquierda (*"Registrar reactivo"*).
- **Props destacadas**: `label`, `showLabel`, `icon`, `onClick`, `position` (`bottom-right`, `bottom-left`, `inline`).

---

## 3. Tarjetas, Secciones y Visualización de Datos

### [`ReactivoCard`](./src/components/ui/ReactivoCard.tsx)
- **Origen de diseño**: `COMPONENTE_REACTIVO.svg`
- **Descripción**: Tarjeta de reactivo de laboratorio (342×92px de referencia) con diseño plano sin sombras, borde sutil y barra lateral izquierda de acento verde (`#4A7C59`). Muestra el nombre en tipografía Serif (`Literata`), detalles de código y stock en tipografía Sans (`Nunito`), e integra a la derecha el rombo NFPA 704.
- **Props destacadas**: `name`, `code`, `stock`, `unit`, `location`, `expirationDate`, `salud`, `inflamabilidad`, `reactividad`, `especial`, `showRombo`, `romboSize`, `onClick`.

---

### [`RomboBadge`](./src/components/ui/RomboBadge.tsx)
- **Origen de diseño**: `COMPONENTE_ROMBO.svg`
- **Descripción**: Diamante de seguridad NFPA 704 para clasificación de riesgos químicos con sus cuatro cuadrantes normalizados:
  - Arriba: Inflamabilidad (Rojo)
  - Izquierda: Salud (Azul)
  - Derecha: Reactividad (Amarillo)
  - Abajo: Riesgo Específico (Blanco, con soporte para `W` tachada, `OX`, `COR`, `BIO`, `RAD`).
- **Props destacadas**: `size` (`xs: 28px`, `sm: 44px`, `md: 68px`, `lg: 92px`), `health`, `flammability`, `reactivity`, `special`, `showLegend`.

---

### [`SectionCard`](./src/components/ui/SectionCard.tsx)
- **Origen de diseño**: `COMPONENT_SECTION.svg`
- **Descripción**: Encabezado y contenedor de sección compuesto por dos utilidades:
  1. **`SectionHeader`**: Título en fuente Serif (`Literata`) en mayúsculas, acompañado de una línea divisoria horizontal de 2px con esquinas redondeadas y badge opcional.
  2. **`SectionCard`**: Contenedor de sección que agrupa listas de reactivos o datos, con soporte para modo colapsable / expandible interactivo.
- **Props destacadas**: `title`, `count`, `collapsible`, `defaultExpanded`, `action`, `variant` (`plain`, `card`).

---

## 4. Alertas y Notificaciones

### [`Alert`](./src/components/ui/Alert.tsx)
- **Origen de diseño**: `COMPONENTE_ALERT.svg`
- **Descripción**: Banner de notificación informativa o de alerta con borde izquierdo grueso de 4px y sin opción de descarte/cierre para asegurar la visibilidad de advertencias críticas de laboratorio.
- **Variantes**:
  - `warning`: Fondo `#F6EAD2`, borde izquierdo `#6E5522`, ícono `AlertTriangleIcon`.
  - `danger`: Fondo `#FDE8E3`, borde izquierdo `#A82D24`, ícono `AlertCircleIcon`.
- **Props destacadas**: `variant`, `title`, `description`, `iconPosition` (`left`, `right`), `showIcon`.

---

### [`AlertBitacora`](./src/components/ui/AlertBitacora.tsx)
- **Origen de diseño**: `COMPONENTE_ALERT_BITACORA.svg`
- **Descripción**: Tarjeta de registro especializada para bitácora, historial de auditoría y movimientos de inventario. Incluye soporte para avatar de usuario, sello de tiempo relativo, badge de consumo/ingreso y callback interactivo al hacer clic.
- **Props destacadas**: `title`, `description`, `user`, `timestamp`, `badge`, `variant` (`warning`, `danger`, `success`, `info`), `isInteractive`, `onClick`.

---

## 5. Íconos Vectoriales Disponibles

Ubicados en [`src/assets/icons/index.ts`](./src/assets/icons/index.ts) y optimizados como componentes SVG React:

| Ícono | Componente React | Caso de Uso Habitual |
| :--- | :--- | :--- |
| 🔍 | `SearchIcon` | Barra de búsqueda general y SearchWrapper |
| ⚙️ | `FiltersIcon` | Botón lateral de filtros en SearchWrapper |
| 👁️ | `EyeIcon` | Visibilidad de contraseña (activo) |
| 👁️‍🗨️ | `EyeOffIcon` | Visibilidad de contraseña (oculto) |
| ➡️ | `ArrowRightIcon` | Botones de acción con flecha de avance |
| 🔘 | `RadioCheckIcon` | Checkmark interno del RadioButton |
| ✔️ | `CheckIcon` | Checkmark del Checkbox |
| ➕ | `PlusIcon` | Stepper incremento y FloatingButton |
| ➖ | `MinusIcon` | Stepper decremento |
| 📦 | `ArchiveBoxIcon` | Pestaña Inventario del Navbar |
| 📋 | `ClipboardListIcon` | Pestaña Bitácora del Navbar |
| ⇄ | `ArrowsLeftRightIcon` | Pestaña Préstamos del Navbar |
| ⊞ | `DashboardBlocksIcon` | Pestaña Dashboard del Navbar |
| 👤 | `UserIcon` | Perfil de usuario y autor en bitácora |
| 🧪 | `FlaskIcon` / `BottleIcon` | Reactivos químicos y soluciones |
| 🔬 | `MicroscopeIcon` | Ensayos y laboratorio biológico |
| ⚠️ | `AlertTriangleIcon` | Alertas de advertencia (warning) |
| 🛑 | `AlertCircleIcon` | Alertas críticas (danger) |
| 🪪 | `FileTextIcon` | Documentación y reportes de laboratorio |
| 🏷️ | `RomboIcon` | Diamante NFPA 704 aislado |

---

## 6. Componentes Desktop

### [`DesktopCard`](./src/components/desktop/DesktopCard.tsx)
- **Origen de diseño**: `src/DESKTOP_CARD/COMPONENTE_CARD.svg` y `COMPONENTE_CARD.png`
- **Descripción**: Tarjeta y contenedor genérico para vistas de escritorio. En el diseño de referencia ilustra un formulario, pero el componente es el contenedor reutilizable. Presenta esquinas redondeadas (`rounded-[16px]`), fondo institucional cálido `#FAF6F0`, borde nítido de 2px en `#655D52`/40 y sombra suave proyectada y translúcida (`shadow-[4px_4px_6px_0px_rgba(0,0,0,0.08)]`). Se compone modularmente mediante subcomponentes especializados:
  - `DesktopCard`: Contenedor principal con props `variant`, `padding`, `maxWidth` y `className`.
  - `DesktopCardHeader`: Contenedor de cabecera con espaciado vertical y centrado.
  - `DesktopCardTitle`: Título en fuente Serif (`Literata`, `font-serif text-2xl font-bold text-primary tracking-tight`).
  - `DesktopCardDescription`: Subtítulo o descripción (`font-sans text-sm text-[#4A4E4A]`).
  - `DesktopCardContent`: Contenedor central de elementos (`space-y-4`).
  - `DesktopCardFooter`: Espacio inferior para botones de acción (`flex flex-col gap-3 pt-6 w-full items-center`).
- **Variantes**: `default`, `flat`, `outline`, `elevated`.
- **Props destacadas**: `variant`, `padding` (`none`, `sm`, `default`, `lg`), `maxWidth` (`default: 540px`, `sm`, `lg`, `xl`, `full`).

---

### [`DesktopTable`](./src/components/desktop/DesktopTable.tsx)
- **Origen de diseño**: `src/DESKTOP_TABLA/Frame 58.svg` y `Frame 58.png`
- **Descripción**: Tabla de datos genérica para vistas de escritorio con esquinas redondeadas (`rounded-[20px]`), borde perimetral en `#655D52`/40, fondo blanco y estructura con tipado fuerte `<T>` (cero `any`). Incluye:
  - **Header**: Altura de 59px, fondo institucional suave `#FAF6F0`, borde inferior `#655D52`/30 y tipografía `font-sans font-semibold text-sm text-[#181C1B] tracking-wider uppercase`.
  - **Filas de datos**: Altura de 60px por fila, fondo blanco, separadores horizontales `#655D52`/20 y hover sutil `#FAF6F0`/40.
  - **Soporte de Acciones**: Compatible con renderizado de botones de acción en columnas y utilidades `DesktopTableActionButton` / `DesktopTableMenuIcon`.
  - **Estados especiales**: Manejo de carga con skeleton rows pulsantes de 60px y mensaje para estado vacío (`emptyMessage`).
- **Props destacadas**: `columns: DesktopTableColumn<T>[]`, `data: T[]`, `keyExtractor`, `onRowClick`, `loading`, `skeletonRowCount`, `emptyMessage`, `className`, `tableClassName`, `rowClassName`.

---

### [`DesktopSidebar`](./src/components/desktop/DesktopSidebar.tsx)
- **Origen de diseño**: `src/DESKTOP_SIDEBAR/SIDEBAR.svg`, `SIDEBAR@4x.png` y `src/DESKTOP_LAYOUT_EJEMPLO_DASHBOARD/DASHBOARD.svg`
- **Descripción**: Barra lateral de navegación principal para la interfaz de escritorio. Presenta un ancho fijo de 206px (`w-[206px] min-w-[206px] max-w-[206px]`), altura completa (`h-full min-h-screen`), fondo beige `#FAF6F0` y línea divisoria a la derecha `border-r border-[#655D52]/40`.
- **Estructura y Elementos**:
  - **Cabecera**: Logotipo institucional "Logo" en tipografía Serif (`font-serif text-[26px] font-bold text-primary tracking-tight`) e insignia de laboratorio debajo de 56×19px con borde `#4A4E4A`, texto secundario (por defecto "Lab 1") y círculo indicador verde `#4A7C59`.
  - **Menú de Navegación**: Aloja los módulos principales mediante píldoras de 39px de altura con radio completo (`rounded-full h-[39px] px-4 font-medium`).
    - *Dashboard* ([`DashboardBlocksIcon`](./src/assets/icons/dashboard-blocks.svg))
    - *Inventario* ([`ArchiveBoxIcon`](./src/assets/icons/archive-box.svg))
    - *Bitácora* ([`ClipboardListIcon`](./src/assets/icons/clipboard-list.svg))
    - *Préstamos* ([`ArrowsLeftRightIcon`](./src/assets/icons/arrows-left-right.svg))
  - **Estados visuales**:
    - *Activo*: Píldora rellena en verde institucional (`bg-[#4A7C59] text-white rounded-full h-[39px] px-4 font-medium`) con ícono y texto blancos.
    - *Inactivo*: Texto en gris neutro (`text-[#655D52] hover:text-primary hover:bg-primary/5 rounded-full h-[39px] px-4 font-medium`) con transición suave.
  - **Botón de Acción Rápida**: Botón opcional de 39px de altura en verde `#4A7C59` (*"Registrar reactivo"*).
  - **Pie / Footer**: Acciones inferiores con ícono de configuración ([`SettingsIcon`](./src/assets/icons/settings.svg)) o cerrar sesión (`LogoutIcon`).
- **Props destacadas**: `items`, `activeId`, `defaultActiveId`, `onItemChange`, `labLabel`, `logoHref`, `showActionButton`, `actionLabel`, `onActionClick`, `actionHref`, `actionButton`, `onLogoutClick`, `onSettingsClick`, `settingsHref`, `settingsLabel`, `logoutLabel`, `footerAction`, `footerContent`, `className`.

---

### [`DesktopProfileIcon`](./src/components/desktop/DesktopProfileIcon.tsx)
- **Origen de diseño**: `src/DESKTOP_PROFILE_ICON/NAVBAR.svg` y `NAVBAR@4x.png`
- **Descripción**: Componente de perfil de usuario y avatar para la barra de navegación de escritorio (126×40px de referencia). En el lateral izquierdo presenta el nombre del usuario (por defecto "John Doe") y rol/email opcional en tipografía Sans (`font-sans font-medium text-sm text-[#181C1B]`). En el lateral derecho incorpora el avatar circular con el ícono institucional oficial estilizado en trazo verde institucional `#4A7C59` (stroke-width 3.5), o avatar con fotografía cuando se proporciona `avatarUrl`. Soporta interacción accesible completa (`role="button"`, `tabIndex`, eventos de teclado).
- **Variantes / Tamaños**:
  - `sm`: 32px de altura, ícono 32×32px, texto `text-xs`.
  - `default`: 40px de altura (referencia oficial), ícono 40×40px, texto `text-sm`.
  - `lg`: 48px de altura, ícono 48×48px, texto `text-base`.
- **Props destacadas**: `name`, `role`, `email`, `avatarUrl`, `onClick`, `showName`, `size`, `className`.

---

### [`DesktopActionButtons`](./src/components/desktop/DesktopActionButtons.tsx)
- **Origen de diseño**: `src/DESKTOP_COMPONENTES_FILTRAR/COMPONENT_FILTRAR.svg` y `COMPONENT_FILTRAR@4x.png`
- **Descripción**: Conjunto de botones de acción rápida especializados para la vista de escritorio en tareas de filtrado, exportación y creación. Presentan una altura de 48px (`h-12`), esquinas redondeadas de 15px (`rounded-[15px]`), borde de 2px en verde institucional `#4A7C59`, tipografía Sans en negrita (`font-sans font-semibold text-base text-[#4A7C59]`), y efectos interactivos `hover:bg-[#4A7C59]/10`, `active:scale-[0.98]` y foco accesible `focus-visible:ring-2 focus-visible:ring-primary`.
- **Variantes de botón**:
  - `variant="filter"` (`DesktopFilterButton`): Ancho mín. 130px, ícono de sliders de filtro en `#4A7C59`, etiqueta por defecto "Filtrar".
  - `variant="export"` (`DesktopExportButton`): Ancho mín. 207px, ícono de reporte/documento en `#4A7C59`, etiqueta por defecto "Exportar reporte".
  - `variant="new"` (`DesktopNewButton`): Ancho mín. 130px, ícono de suma circular en `#4A7C59`, etiqueta por defecto "Nuevo" o configurable.
- **Componentes exportados**:
  - `DesktopActionButton`: Componente unificado con prop `variant: 'filter' | 'export' | 'new'`.
  - `DesktopFilterButton`: Botón de filtrado listo para usar.
  - `DesktopExportButton`: Botón de exportación de reporte listo para usar.
  - `DesktopNewButton`: Botón de creación/nuevo elemento listo para usar.
  - `DesktopActionToolbar`: Contenedor flex con `gap-4` y roles semánticos para agrupar botones de acción en barras de herramientas.
  - `DesktopFilterIcon`, `DesktopExportIcon`, `DesktopNewIcon`: Íconos vectoriales SVG extraídos fielmente de Figma.
- **Props destacadas (`DesktopActionButton`)**: `variant`, `label`, `icon`, `showIcon`, `bgVariant` (`transparent`, `surface`), `fullWidth`, `disabled`, `onClick`, `className`.

---

### [`DesktopLayout`](./src/components/desktop/DesktopLayout.tsx)
- **Origen de diseño**: `src/DESKTOP_LAYOUT_EJEMPLO_DASHBOARD/DASHBOARD.svg` y `DASHBOARD@4x.png`
- **Descripción**: Estructura general de pantalla completa para la interfaz de escritorio de Gestión IZET. Organiza la aplicación en tres zonas arquitectónicas delimitadas: barra lateral izquierda fija de 206px de ancho, cabecera superior fija de 88px de altura con fondo `#FAF6F0` y perfil institucional, y área principal de contenido dinámico desplazable en la parte inferior derecha. Incorpora las líneas divisorias exactas del diseño vectorial (`border-[#655D52]/40`).
- **Estructura y subcomponentes**:
  - `DesktopLayout`: Contenedor raíz a pantalla completa (`h-screen overflow-hidden`) que orquesta la barra lateral (`DesktopSidebar`), cabecera superior (`DesktopTopbar`) y el contenedor de página (`DesktopContent`).
  - `DesktopTopbar`: Cabecera superior fija de 88px con línea divisoria inferior `border-b border-[#655D52]/40`, slot izquierdo/central (`topbarLeft` para buscadores o títulos) y slot derecho (`topbarRight` / `profile`, por defecto con `DesktopProfileIcon`).
  - `DesktopContent`: Área dinámica desplazable (`flex-1 overflow-y-auto p-8 bg-[#FAF6F0]`) que aloja la funcionalidad o módulo seleccionado.
- **Props destacadas (`DesktopLayout`)**: `sidebar` (opcional; si se omite usa `DesktopSidebar`), `activeNavId`, `onNavChange`, `topbarLeft`, `topbarRight`, `profile`, `topbar`, `topbarClassName`, `sidebarClassName`, `contentClassName`, `children`, `className`.

