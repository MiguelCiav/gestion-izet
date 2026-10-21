# Reglas para la Creación y Modificación de Pantallas

Este documento define las directrices arquitectónicas, de diseño y de tipado que deben cumplirse de forma obligatoria al crear o modificar cualquier pantalla o vista en el proyecto **Gestión IZET**.

---

## Regla 1: Uso Estricto de Componentes Existentes y Manejo de Pendientes

1. **Solo componentes existentes**:
   - Está terminantemente prohibido inventar componentes ad-hoc o importar componentes de bibliotecas no aprobadas para elementos principales de interfaz.
   - Toda pantalla debe construirse empleando exclusivamente los componentes registrados en [`COMPONENTS.md`](./COMPONENTS.md) y ubicados en `@/components/ui/` y `@/components/layout/`.

2. **Componentes faltantes o no desarrollados (Placeholder de "Pendiente")**:
   - Si una vista requiere un elemento, widget o componente que **aún no ha sido desarrollado** (por ejemplo: gráficos estadísticos, tablas de amortización, escáner QR, etc.), **no se debe improvisar su diseño ni codificar componentes preliminares complejos**.
   - En su lugar, se debe insertar un **contenedor neutro de reemplazo (Placeholder)** que cumpla con los siguientes requisitos:
     - Ocupar el área correspondiente con dimensiones o proporción estimada.
     - Mostrar de forma visible la palabra **`Pendiente`** o **`[Componente Pendiente]`**.
     - Indicar de manera concisa y clara qué componente o funcionalidad se necesita.
   - **Patrón estándar para placeholders**:
     ```tsx
     <div
       role="region"
       aria-label="Componente pendiente"
       className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border-subtle rounded-card bg-surface-card/60 text-center min-h-[140px] w-full"
     >
       <span className="font-serif text-sm font-semibold text-text-main uppercase tracking-wider">
         [Pendiente]
       </span>
       <p className="font-sans text-xs text-text-muted mt-1 max-w-sm">
         Se requiere: <strong>Nombre del componente o descripción de la funcionalidad</strong>
       </p>
     </div>
     ```

---

## Regla 2: Apego Estricto a la Configuración de TypeScript y Tokens de Diseño

Toda propiedad visual (colores, fuentes, bordes, radios, espaciados y dimensiones) debe derivarse **exclusivamente** de los tokens configurados en [`tailwind.config.ts`](./tailwind.config.ts) y los tipos definidos en TypeScript. Está prohibido el uso de valores arbitrarios (*hardcoded*) como `bg-[#...]` o clases genéricas de Tailwind no sincronizadas con la paleta oficial.

### 1. Paleta de Colores Autorizada
Utilizar únicamente las clases de color correspondientes al tema:

| Token Tailwind | Variable / Valor Hex | Uso Autorizado |
| :--- | :--- | :--- |
| `bg-background` | `#FAF7F2` | Fondo general de la aplicación y páginas |
| `bg-surface` / `bg-surface-card` | `#FAF7F2` / `#FFFFFF` | Fondos de tarjetas, paneles y contenedores modales |
| `bg-primary` / `text-primary` | `#446E53` (Verde Institucional) | Acciones principales, estados activos y acentos |
| `bg-primary-hover` | `#375A44` | Hover en botones y elementos interactivos primarios |
| `bg-primary-light` | `#E2EAE3` | Fondos de selección, insignias y rellenos sutiles |
| `text-text-main` | `#2F2B28` (Tierra oscuro) | Títulos, textos de alta jerarquía y datos principales |
| `text-text-muted` | `#6B655F` (Gris cálido) | Subtítulos, etiquetas secundarias, metadatos y placeholders |
| `border-border` | `#2F2B28` | Bordes principales de alto contraste o botones delimitados |
| `border-border-subtle` | `#D9D3C7` | Líneas divisorias, bordes de tarjetas e inputs estándar |
| `bg-alert-warning-bg` / `border-alert-warning-border` | `#F6EAD2` / `#6E5522` | Notificaciones y estados de advertencia |
| `bg-alert-danger-bg` / `border-alert-danger-border` | `#FDE8E3` / `#A82D24` | Notificaciones críticas, alertas de stock y errores |

### 2. Tipografías y Jerarquía de Títulos Estandarizada

Toda pantalla debe respetar rigurosamente la escala tipográfica institucional para asegurar una apariencia homogénea en toda la aplicación:

- **Títulos Principales de Pantalla (`h1`)**:
  - **Clase obligatoria**: `font-serif text-[32px] sm:text-4xl font-bold text-primary tracking-tight`
  - Aplica a todas las pantallas de módulo (`Bitácora`, `Consumo`, `Inventario`, `Préstamos`, `Auth`).
  - Tamaño: **32px** (`text-[32px]`) en vista móvil (`< 640px`) y **36px** (`sm:text-4xl`) en pantallas medianas o mayores.
  - Color: `text-primary` (`#4A7C59`).
  - Interletraje: `tracking-tight`.
  - **Prohibido**: Emplear tamaños dispares o arbitrarios como `text-xl`, `text-2xl` o `text-[28px]` para títulos de pantalla.

- **Títulos de Sección (`h2` / [`SectionHeader`](./src/components/ui/SectionCard.tsx))**:
  - **Clase obligatoria**: `font-serif font-bold text-lg md:text-xl tracking-wider uppercase text-text-main`
  - Para encabezados de subsecciones (ej. "ALERTAS DE REACTIVOS", "ALERTAS DE EQUIPOS").

- **Logotipo de Cabecera ([`AppHeader`](./src/components/layout/AppHeader.tsx))**:
  - `font-serif text-[26px] font-bold text-primary tracking-tight`

- **Títulos de Tarjetas / Reactivos**:
  - `font-serif font-semibold text-base text-text-main`

- **Tipografía Institucional `font-serif` (`"Literata", serif`)**:
  - Exclusiva para títulos principales (`h1`), secciones en mayúsculas (`h2`), nombres de reactivos y contadores de Stepper.

- **Tipografía General `font-sans` (`"Nunito", sans-serif`)**:
  - Cuerpo de texto general, párrafos y descripciones.
  - Botones ([`Button`](./src/components/ui/Button.tsx)) e inputs ([`InputField`](./src/components/ui/InputField.tsx)).
  - Etiquetas de navegación ([`Navbar`](./src/components/layout/Navbar.tsx)), radios y checkboxes.
  - Metadatos secundarios (código, fechas, stock).

### 3. Radios de Curvatura y Bordes
- **`rounded-card` (`16px`)**: Tarjetas principales de contenido, contenedores de módulo y modales.
- **`rounded-input` (`12px`)**: Botones, campos de formulario, banners de alerta y cajas de selección.
- **`rounded-full`**: Botones flotantes ([`FloatingButton`](./src/components/ui/FloatingButton.tsx)), círculos numéricos ([`StepIndicator`](./src/components/ui/Stepper.tsx)), cápsulas activas ([`IconWrapper`](./src/components/ui/IconWrapper.tsx)) y badges.
- **Bordes limpios sin sombras**: Toda tarjeta o componente debe mantener una estética limpia y delimitada mediante `border border-border-subtle`. No agregar sombras arbitrarias (`shadow-md`, `shadow-lg`, etc.).

### 4. Directrices de Íconos y Grosor de Línea
- **Grosor natural y proporcionado**: Los íconos vectoriales SVG extraídos de Figma con relleno (`fill="currentColor"`) no deben llevar clases como `stroke-current` o propiedades de trazo artificiales, ya que duplican el grosor visual de los vectores.
- **Dimensiones estándar**:
  - Botones de categorías o hubs: ícono de `24x24px` (`w-6 h-6`) centrado en contenedor de `w-8 h-8`.
  - Acciones y barras de navegación: `20x20px` (`w-5 h-5`).
  - Botones flotantes (`FloatingButton`): `20x20px` (`w-5 h-5`).

### 5. Estructura de Navegación y Layout
- **Diseño Móvil y Navegación**:
  - Diseñar con mentalidad *Mobile-First*. Si la vista incluye navegación inferior, reservar el margen inferior adecuado (`pb-28`) para evitar que el [`Navbar`](./src/components/layout/Navbar.tsx) fijo solape información crítica.
- **Comportamiento del [`Navbar`](./src/components/layout/Navbar.tsx)**:
  - En la vista móvil (`< 640px` / ancho teléfono), el navbar se extiende **de extremo a extremo** (`w-full left-0 right-0 bottom-0`) tocando los bordes de la pantalla con `border-t border-border-subtle/80` y esquinas superiores `rounded-t-[8px]`.
  - El contenedor interno de las 4 pestañas mantiene `max-w-[412px] mx-auto` para garantizar ergonomía táctil y alineación con el contenido principal.
