# PROMPT MAESTRO — Generación del Frontend Dental Studio

> Copia este prompt completo en una IA de código (Cursor, v0, Claude, etc.) para generar el frontend del sistema odontológico.

---

## INSTRUCCIONES PARA LA IA

Genera el frontend completo de **Dental Studio**, un sistema de gestión odontológica local con interfaz premium tipo SaaS clínico moderno. Todo el código debe estar en **español** (UI, labels, mensajes, comentarios de negocio). El código técnico (nombres de variables, tipos) puede estar en inglés siguiendo convenciones React.

---

## CONTEXTO DEL PROYECTO

Dental Studio es una aplicación para clínicas odontológicas que cubre el flujo clínico completo:

**Consulta → Diagnóstico → Odontograma → Tratamiento → Presupuesto → Proforma → Reserva → Seguimiento**

No es un CRUD simple: el odontograma está conectado al presupuesto. Al marcar una pieza dental con diagnóstico y tratamiento, el sistema agrega automáticamente la línea al plan de tratamiento con precio del catálogo.

---

## STACK TÉCNICO OBLIGATORIO

```
- React 18 + Vite + TypeScript
- Tailwind CSS
- shadcn/ui (instalar componentes: button, card, input, table, tabs, dialog, dropdown-menu, badge, avatar, calendar, select, textarea, sheet, command, popover, separator, skeleton, toast)
- Lucide React (iconos)
- Framer Motion (animaciones de entrada suaves)
- React Router v6
- Zustand (estado UI: sidebar, tema, paciente activo)
- TanStack Query (mock API con datos fake por ahora)
- FullCalendar (@fullcalendar/react) para agenda
- Recharts para gráficos del dashboard
- @react-three/fiber + @react-three/drei para odontograma 3D (fase 5, preparar estructura)
```

---

## DISEÑO VISUAL

### Estética
- Software SaaS premium médico (referencias: Dentlo, Zendenta)
- Sidebar izquierdo fijo, minimalista, con iconos Lucide
- Tarjetas con `rounded-xl`, sombras suaves (`shadow-sm`)
- Mucho espacio en blanco, tipografía clara
- Modo claro Y oscuro con toggle en header
- Responsive: desktop first, colapsar sidebar en móvil

### Paleta
```css
--primary: #0ea5e9;      /* sky-500 */
--primary-dark: #0284c7;
--background-light: #f8fafc;
--background-dark: #0f172a;
--card-light: #ffffff;
--card-dark: #1e293b;
--success: #22c55e;
--danger: #ef4444;
--warning: #f59e0b;
```

### Tipografía
- Font: Inter (Google Fonts)
- Títulos: font-semibold
- Labels secundarios: text-muted-foreground text-sm

---

## ESTRUCTURA DE CARPETAS

```
src/
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── CommandPalette.tsx
│   ├── dashboard/
│   │   ├── StatCard.tsx
│   │   ├── TodayAgenda.tsx
│   │   ├── RevenueChart.tsx
│   │   └── PopularTreatments.tsx
│   ├── patients/
│   │   ├── PatientList.tsx
│   │   ├── PatientForm.tsx
│   │   ├── PatientProfile.tsx
│   │   └── PatientTabs/
│   ├── consultations/
│   │   ├── ConsultaWizard.tsx
│   │   └── ConsultaSteps/
│   ├── odontogram/
│   │   ├── OdontogramCanvas.tsx      # SVG interactivo FDI
│   │   ├── ToothDiagram.tsx
│   │   ├── SurfaceSelector.tsx
│   │   ├── DiagnosticCatalog.tsx
│   │   ├── ProcedureCatalog.tsx
│   │   └── ToothDetailPanel.tsx
│   ├── odontogram-3d/
│   │   ├── DentalModel3D.tsx
│   │   └── PatientPresentationMode.tsx
│   ├── budgets/
│   │   ├── PresupuestoEditor.tsx
│   │   ├── PresupuestoTable.tsx
│   │   └── ProformaPreview.tsx
│   ├── agenda/
│   │   ├── AgendaCalendar.tsx
│   │   ├── CitaDetailPanel.tsx
│   │   └── NuevaReservaForm.tsx
│   └── ui/                           # shadcn components
├── pages/
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   ├── PatientsPage.tsx
│   ├── PatientDetailPage.tsx
│   ├── ConsultationsPage.tsx
│   ├── ConsultaWizardPage.tsx
│   ├── OdontogramPage.tsx
│   ├── BudgetsPage.tsx
│   ├── BudgetDetailPage.tsx
│   ├── AgendaPage.tsx
│   ├── CatalogPage.tsx
│   └── SettingsPage.tsx
├── hooks/
├── stores/
│   ├── uiStore.ts
│   └── consultaStore.ts
├── types/
│   ├── patient.ts
│   ├── consultation.ts
│   ├── odontogram.ts
│   ├── budget.ts
│   └── appointment.ts
├── lib/
│   ├── fdi.ts                        # Utilidades notación FDI
│   ├── tooth-states.ts               # Colores y estados dentales
│   └── mock-data.ts                  # Datos de demostración
├── routes/
│   └── index.tsx
└── App.tsx
```

---

## MENÚ SIDEBAR (generar exactamente así)

```
CLÍNICA
  - Dashboard          (LayoutDashboard)
  - Agenda             (Calendar)
  - Pacientes          (Users)
  - Consultas          (Stethoscope)
  - Odontograma        (Smile)
  - Tratamientos       (Activity)

FINANZAS
  - Presupuestos       (FileText)
  - Pagos              (CreditCard)
  - Catálogo           (List)

RECURSOS
  - Profesionales      (UserCog)
  - Consultorios       (Building)

SISTEMA
  - Reportes           (BarChart3)
  - Configuración      (Settings)
```

Footer sidebar: avatar usuario + nombre + rol + "Ayuda"

Header: logo clínica, búsqueda global (Cmd+K), botón "+", notificaciones, toggle tema, avatar.

---

## PANTALLAS A GENERAR (Fase 1 completa)

### 1. LoginPage
- Centrado, logo 🦷 Dental Studio
- Email + contraseña
- Botón "Iniciar sesión"
- Fondo degradado sutil

### 2. DashboardPage
KPIs en grid 4 columnas:
- Citas de hoy: 8
- Pacientes atendidos (mes): 325 (-16% badge rojo)
- Citas pendientes: 12
- Ingresos mes: S/ 12,563.95 (+20% badge verde)

Widgets:
- Agenda de hoy (lista con hora, paciente, tratamiento)
- Gráfico barras ingresos vs gastos (Recharts)
- Tratamientos populares (donut: Scaling 125, Extracción 15, etc.)
- Alertas: presupuestos sin respuesta, citas sin confirmar

### 3. PatientsPage
- Tabla con: Avatar, Nombre, DNI, Teléfono, Última visita, Acciones
- Búsqueda y filtros
- Botón "Nuevo paciente"
- Paginación

### 4. PatientDetailPage
Header: foto, nombre, DNI, edad, contacto, banner alergia rojo si existe.

Tabs:
- Resumen (próxima cita, tratamientos activos, último presupuesto)
- Historial clínico (timeline)
- Odontograma (último estado, link a editor)
- Tratamientos
- Presupuestos
- Documentos
- Pagos

Botón prominente: "Nueva consulta"

### 5. ConsultaWizardPage
Stepper horizontal 8 pasos:
1. Motivo
2. Evaluación
3. Diagnóstico
4. Odontograma (embed OdontogramCanvas)
5. Plan de tratamiento (tabla auto-generada)
6. Presupuesto (PresupuestoEditor)
7. Documentos (upload zone)
8. Cierre (resumen + agendar seguimiento)

Navegación Anterior/Siguiente. Guardar borrador.

### 6. OdontogramPage (pantalla dedicada)
Layout 2 columnas:

**Izquierda (30%):**
- Tabla "Catálogo Diagnósticos" (pieza, diagnóstico, superficie, obs, eliminar)
- Tabla "Catálogo Procedimientos" (tratamiento, pieza, precio)
- Botón "Guardar odontograma"

**Derecha (70%):**
- Banner última acción
- SVG odontograma: arcada superior (18-11, 21-28) y arcada inferior (48-41, 31-38)
- Cada diente: diagrama anatómico + 5 círculos superficie (D, O, M, V, P/L)
- Clic en diente → panel lateral con selects: Diagnóstico, Tratamiento, Prioridad, Precio, Observación
- Botón "Agregar procedimiento"
- Botones: "Ver en 3D", "Presentar al paciente"

**Estados dentales con colores:**
```typescript
const TOOTH_STATES = {
  sin_registro: { color: '#94a3b8', label: 'Sin registro' },
  sano:         { color: '#22c55e', label: 'Sano' },
  caries:       { color: '#ef4444', label: 'Caries' },
  restauracion: { color: '#3b82f6', label: 'Restauración' },
  endodoncia:   { color: '#a855f7', label: 'Endodoncia' },
  extraccion:   { color: '#475569', label: 'Extracción' },
  implante:     { color: '#f97316', label: 'Implante' },
  corona:       { color: '#14b8a6', label: 'Corona' },
  fractura:     { color: '#ec4899', label: 'Fractura' },
  ausente:      { color: '#1e293b', label: 'Ausente' },
};
```

**Lógica clave:** al agregar procedimiento, sincronizar con presupuesto mock:
```typescript
// Auto-agregar línea presupuesto
addBudgetLine({
  tratamiento: selectedTreatment,
  pieza: selectedTooth,
  cantidad: 1,
  precioUnitario: catalogPrice,
  subtotal: catalogPrice,
});
```

### 7. BudgetsPage + BudgetDetailPage
Lista presupuestos: número, paciente, fecha, total, estado (badge), acciones.

Editor:
- Tabla editable líneas
- Subtotal, descuento, total, adelanto, saldo
- Vigencia, cuotas, forma pago
- Botones: Generar PDF, Generar folleto, Enviar, Aceptar

### 8. AgendaPage
FullCalendar vista semanal default.

Header: tabs Lista/Mensual/Semanal, navegación fechas, botones filtro/imprimir.

Eventos de cita con:
- Nombre paciente
- Tratamiento
- Hora
- Badge "Member" si aplica
- Borde color por tipo

Panel lateral (Sheet) al clic:
- Foto y datos paciente
- Botones: Llegó (verde), Reprogramar, Cancelar
- Tabs: Info básica, Timeline tratamiento, Notas, Historial

Línea hora actual azul.

Drag & drop para reprogramar (mock).

### 9. SettingsPage
Tabs: Clínica, Usuarios, Horarios, Plantillas, Backup, Apariencia

---

## DATOS MOCK (generar en lib/mock-data.ts)

```typescript
// 5 pacientes de ejemplo
// 3 consultas en curso/completadas
// Odontograma con entradas para paciente 1 (piezas 16 caries, 26 endodoncia)
// 2 presupuestos (1 aceptado, 1 borrador)
// 10 citas esta semana
// Catálogo 15 tratamientos con precios en soles (PEN)
// KPIs dashboard
// Usuario logueado: Dr. Juan Pérez, Odontólogo
// Clínica: "Clínica Dental Sonrisa", Lima, Perú
```

---

## TIPOS TYPESCRIPT (generar en types/)

```typescript
interface Paciente {
  id: string;
  codigo: string;
  dni?: string;
  nombres: string;
  apellidos: string;
  fechaNacimiento?: string;
  telefono?: string;
  email?: string;
  alergias?: string;
  antecedentes?: string;
  foto?: string;
}

interface OdontogramaEntrada {
  id: string;
  pieza: number;           // FDI 11-48
  superficie?: 'D' | 'O' | 'M' | 'V' | 'P' | 'L';
  diagnostico: string;
  tratamiento?: string;
  prioridad: 'baja' | 'media' | 'alta' | 'urgente';
  observacion?: string;
  enTratamiento: boolean;
}

interface Presupuesto {
  id: string;
  numero: string;
  pacienteId: string;
  fecha: string;
  subtotal: number;
  descuento: number;
  total: number;
  adelanto: number;
  saldo: number;
  estado: 'borrador' | 'enviado' | 'aceptado' | 'rechazado' | 'vencido';
  detalles: PresupuestoDetalle[];
}

interface Cita {
  id: string;
  pacienteId: string;
  odontologoId: string;
  fechaInicio: string;
  fechaFin: string;
  motivo?: string;
  tratamiento?: string;
  estado: 'programada' | 'confirmada' | 'en_espera' | 'atendida' | 'cancelada' | 'no_asistio';
}
```

---

## COMPONENTE ODONTOGRAMA SVG (especificación detallada)

Genera `OdontogramCanvas.tsx` como SVG React:

1. Dos filas: arcada superior e inferior
2. 16 dientes permanentes por arcada en notación FDI
3. Cada diente es un `<g>` clickeable con:
   - Número FDI arriba
   - Silueta simplificada del diente (path SVG)
   - 5 círculos pequeños para superficies debajo
4. Al hacer clic: highlight borde azul + callback `onToothSelect(pieza)`
5. Colorear diente según estado dominante en entradas odontograma
6. Colorear superficie individual si tiene diagnóstico específico
7. Tooltip hover: "Pieza 16 — Caries"

Arcada superior adulto FDI:
`[18,17,16,15,14,13,12,11] | [21,22,23,24,25,26,27,28]`

Arcada inferior adulto FDI:
`[48,47,46,45,44,43,42,41] | [31,32,33,34,35,36,37,38]`

---

## MODO PRESENTACIÓN PACIENTE

`PatientPresentationMode.tsx`:
- Fullscreen overlay
- Fondo gradient suave
- Título "🦷 Tu sonrisa"
- Texto amigable generado dinámicamente desde entradas odontograma
- Chips con números de piezas afectadas
- Placeholder 3D (cubo o esfera por ahora con @react-three/fiber)
- Total tratamiento grande
- Botón "Ver plan de tratamiento"
- Botón "Salir" esquina superior

---

## ANIMACIONES (Framer Motion)

- Páginas: fade + slide up (`initial={{ opacity: 0, y: 10 }}`)
- Tarjetas dashboard: stagger children
- Sidebar items: hover scale sutil
- Modales: scale in

---

## RUTAS

```typescript
/login
/dashboard
/pacientes
/pacientes/nuevo
/pacientes/:id
/consultas
/consultas/nueva
/consultas/:id
/consultas/:id/odontograma
/consultas/:id/presentar
/presupuestos
/presupuestos/:id
/agenda
/reservas/nueva
/catalogo
/configuracion
```

Proteger rutas con auth mock (redirect a /login si no autenticado).

---

## REQUISITOS DE CALIDAD

1. **Todo label UI en español**
2. Código TypeScript estricto, sin `any`
3. Componentes pequeños y reutilizables
4. Responsive básico
5. Modo oscuro funcional con class `dark` en html
6. Datos mock realistas (nombres peruanos, precios en S/)
7. Odontograma funcional con selección y catálogo lateral
8. Conexión mock odontograma → presupuesto
9. Agenda con FullCalendar y panel detalle
10. Dashboard con gráficos Recharts

---

## ORDEN DE GENERACIÓN SUGERIDO

1. Setup Vite + Tailwind + shadcn
2. Types + mock data
3. AppShell (Sidebar + Header)
4. Login + routing
5. Dashboard
6. Pacientes (lista + detalle)
7. Odontograma (componente central)
8. Consulta wizard
9. Presupuestos
10. Agenda
11. Configuración
12. Modo presentación
13. Pulido animaciones y dark mode

---

## NO GENERAR (por ahora)

- Backend NestJS
- Prisma / SQLite
- Electron
- Generación PDF real
- Autenticación real
- Tests

Usar mock data y simular API con TanStack Query + funciones async que retornan datos fake con delay 300ms.

---

## RESULTADO ESPERADO

Una aplicación React funcional, navegable, visualmente premium, con odontograma interactivo SVG, dashboard con gráficos, agenda semanal, flujo consulta→presupuesto conectado, y modo presentación paciente. Lista para conectar backend NestJS en fase 2.
