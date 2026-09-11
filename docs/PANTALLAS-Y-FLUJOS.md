# Dental Studio — Pantallas, Wireframes y Flujos de Usuario

---

## 1. Mapa de rutas completo

```
/                           → Redirect a /dashboard
/login                      → Pantalla de inicio de sesión

/dashboard                  → Panel principal

/pacientes                  → Lista de pacientes
/pacientes/nuevo            → Registro
/pacientes/:id              → Perfil (tabs)
/pacientes/:id/editar       → Edición

/consultas                  → Lista consultas
/consultas/nueva            → Nueva consulta (wizard)
/consultas/:id              → Detalle consulta
/consultas/:id/odontograma  → Editor odontograma 2D
/consultas/:id/3d           → Vista 3D
/consultas/:id/presentar    → Modo presentación paciente

/presupuestos               → Lista
/presupuestos/:id           → Editor
/presupuestos/:id/proforma  → Preview proforma
/presupuestos/:id/folleto   → Folleto paciente

/agenda                     → Calendario (vista default: semanal)
/agenda/lista               → Vista lista
/agenda/mensual             → Vista mensual
/reservas/nueva             → Nueva reserva

/tratamientos               → Tratamientos en curso (global)
/catalogo                   → Catálogo de precios

/profesionales              → CRUD odontólogos
/consultorios               → CRUD consultorios

/reportes                   → Reportes y estadísticas
/configuracion              → Config clínica
/configuracion/usuarios     → Usuarios
/configuracion/backup       → Backup
/configuracion/plantillas   → Plantillas PDF
```

---

## 2. Wireframes textuales

### 2.1 Login

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│              🦷  DENTAL STUDIO                             │
│              Sistema de gestión odontológica               │
│                                                            │
│         ┌──────────────────────────────────┐               │
│         │  Email                           │               │
│         └──────────────────────────────────┘               │
│         ┌──────────────────────────────────┐               │
│         │  Contraseña                      │               │
│         └──────────────────────────────────┘               │
│                                                            │
│         [        Iniciar sesión        ]                 │
│                                                            │
│              Clínica Dental XYZ                            │
└────────────────────────────────────────────────────────────┘
```

---

### 2.2 Dashboard

```
┌──────────┬─────────────────────────────────────────────────────────────┐
│ SIDEBAR  │  Dashboard                              🔍  🔔  🌙  👤    │
│          ├─────────────────────────────────────────────────────────────┤
│ Dashboard│  Buenos días, Dr. Juan · Martes 8 Sep 2026                  │
│ Agenda   │                                                             │
│ Pacientes│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐         │
│ ...      │  │Citas hoy│ │Atendidos│ │Pendiente│ │Ingresos │         │
│          │  │    8    │ │   325   │ │   12    │ │S/12,564 │         │
│          │  └─────────┘ └─────────┘ └─────────┘ └─────────┘         │
│          │                                                             │
│          │  ┌─────────────────────────┐ ┌─────────────────────────┐   │
│          │  │ Agenda de hoy           │ │ Ingresos vs Gastos      │   │
│          │  │ 09:00 Juan - Endodoncia │ │ [Gráfico de barras]     │   │
│          │  │ 10:30 María - Evaluac.  │ │                         │   │
│          │  │ 12:00 ─ Disponible ─    │ └─────────────────────────┘   │
│          │  │ 15:00 Carlos - Limpieza │                               │
│          │  └─────────────────────────┘ ┌─────────────────────────┐   │
│          │                              │ Tratamientos populares  │   │
│          │                              │ [Donut: Scaling 125]    │   │
│          │                              └─────────────────────────┘   │
└──────────┴─────────────────────────────────────────────────────────────┘
```

---

### 2.3 Perfil de paciente

```
┌──────────┬─────────────────────────────────────────────────────────────┐
│ SIDEBAR  │  ← Pacientes / Juan Pérez García                          │
│          │                                                             │
│          │  ┌──────┐  Juan Pérez García          [Nueva consulta]    │
│          │  │ Foto │  DNI: 12345678 · 35 años                          │
│          │  └──────┘  📞 999-888-777 · ✉ juan@email.com               │
│          │            ⚠ ALERGIA: Penicilina                            │
│          │                                                             │
│          │  [Resumen] [Historial] [Odontograma] [Tratamientos]        │
│          │  [Presupuestos] [Documentos] [Pagos]                        │
│          │  ─────────────────────────────────────────────────          │
│          │                                                             │
│          │  Próxima cita: Lun 15 Sep · 10:00 · Endodoncia #26         │
│          │                                                             │
│          │  Tratamientos activos:                                      │
│          │  • Endodoncia pieza 26 — Sesión 2 de 3                      │
│          │  • Restauración pieza 16 — Pendiente                        │
│          │                                                             │
│          │  Último presupuesto: PRO-000125 · S/ 1,730 · Aceptado       │
└──────────┴─────────────────────────────────────────────────────────────┘
```

---

### 2.4 Consulta — Wizard

```
┌──────────┬─────────────────────────────────────────────────────────────┐
│ SIDEBAR  │  Nueva consulta — Juan Pérez                                │
│          │                                                             │
│          │  ● Motivo ─ Evaluación ─ Diagnóstico ─ Odontograma ─       │
│          │    Plan ─ Presupuesto ─ Documentos ─ Cierre                 │
│          │  ═══════════════════════════════════════════════════        │
│          │                                                             │
│          │  Motivo de consulta                                         │
│          │  ┌─────────────────────────────────────────────────────┐  │
│          │  │ Dolor en molar superior derecho desde hace 3 días   │  │
│          │  └─────────────────────────────────────────────────────┘  │
│          │                                                             │
│          │  Síntomas                                                   │
│          │  ☑ Dolor al masticar  ☑ Sensibilidad al frío  ☐ Sangrado  │
│          │                                                             │
│          │                              [Anterior]  [Siguiente →]     │
└──────────┴─────────────────────────────────────────────────────────────┘
```

---

### 2.5 Odontograma 2D

```
┌──────────┬─────────────────────────────────────────────────────────────┐
│ SIDEBAR  │  Odontograma — Consulta #0042 · Juan Pérez                  │
│          │  Última acción: Tratamiento RESTAURACIÓN agregado a #16     │
│          ├──────────────────┬──────────────────────────────────────────┤
│          │ DIAGNÓSTICOS     │  Arcada superior                           │
│          │ ───────────────  │  18 17 16 15 14 13 12 11 | 21 22 23...   │
│          │ 🔴 Caries #16    │  [diagramas dentales con superficies]      │
│          │ 🟣 Endo #26      │                                            │
│          │                  │  Arcada inferior                           │
│          │ PROCEDIMIENTOS   │  48 47 46 45 44 43 42 41 | 31 32 33...   │
│          │ ───────────────  │                                            │
│          │ Restauración #16 │  ┌─────────────────────────────────────┐   │
│          │ Endodoncia #26   │  │ Pieza seleccionada: 16              │   │
│          │                  │  │ Diagnóstico: [Caries        ▼]     │   │
│          │ [Guardar]        │  │ Tratamiento: [Restauración  ▼]     │   │
│          │                  │  │ Prioridad:   [Alta          ▼]     │   │
│          │                  │  │ Precio: S/ 180                      │   │
│          │                  │  │ Observación: [________________]     │   │
│          │                  │  │ [Agregar procedimiento]             │   │
│          │                  │  └─────────────────────────────────────┘   │
│          │                  │  [Ver en 3D]  [Presentar al paciente]        │
└──────────┴──────────────────┴──────────────────────────────────────────┘
```

---

### 2.6 Presupuesto

```
┌──────────┬─────────────────────────────────────────────────────────────┐
│ SIDEBAR  │  Presupuesto PRO-000125 · Juan Pérez                        │
│          │  Estado: [Borrador ▼]              [PDF] [Folleto] [Enviar]  │
│          │                                                             │
│          │  ┌───────────────────────────────────────────────────────┐  │
│          │  │ Tratamiento    │ Pieza │ Cant │ P. Unit │ Subtotal   │  │
│          │  ├────────────────┼───────┼──────┼─────────┼────────────┤  │
│          │  │ Restauración   │  16   │  1   │  180.00 │   180.00   │  │
│          │  │ Endodoncia     │  26   │  1   │  650.00 │   650.00   │  │
│          │  │ Corona         │  26   │  1   │  900.00 │   900.00   │  │
│          │  │ [+ Agregar línea manual]                              │  │
│          │  └───────────────────────────────────────────────────────┘  │
│          │                                                             │
│          │  Subtotal: S/ 1,730.00                                      │
│          │  Descuento: [ 0 ] %  → S/ 0.00                              │
│          │  TOTAL:     S/ 1,730.00                                     │
│          │  Adelanto:  S/ 500.00                                       │
│          │  Saldo:     S/ 1,230.00                                     │
│          │  Vigencia:  [15/10/2026]                                    │
│          │  Cuotas:    [3 ▼]  Forma pago: [Efectivo/Tarjeta ▼]        │
└──────────┴─────────────────────────────────────────────────────────────┘
```

---

### 2.7 Agenda semanal

```
┌──────────┬─────────────────────────────────────────────────────────────┐
│ SIDEBAR  │  Agenda    [Lista] [Mensual] [● Semanal]     [+ Nueva cita]│
│          │  ← Oct 23 - Oct 29, 2019 →                                  │
│          │  [Solicitar aprobación 6] [Actualizar] [Imprimir] [Filtro]  │
│          ├──────┬──────┬──────┬──────┬──────┬──────┬──────┬─────────────┤
│          │ Hora │ Lun  │ Mar  │ Mié  │ Jue  │ Vie  │ Sáb  │ Detalle     │
│          │      │  23  │  24  │  25  │  26  │  27  │  28  │             │
│          ├──────┼──────┼──────┼──────┼──────┼──────┼──────┼─────────────┤
│          │09:00 │ Juan │      │      │      │      │      │ Dimas Rome  │
│          │      │Scale │      │      │      │      │      │ Root Canal  │
│          ├──────┼──────┼──────┼──────┼──────┼──────┼──────┤ Member      │
│          │10:30 │      │Dimas │      │      │      │      │             │
│          │      │      │Root  │      │      │      │      │ [Llegó]     │
│          ├──────┼──────┼──────┼──────┼──────┼──────┼──────┤ [Reprogramar│
│          │ ...  │      │      │      │      │      │      │             │
│          │11:36 │══════════════ hora actual ═════════════════│ Timeline   │
│          │      │      │      │      │      │      │      │ tratamiento │
└──────────┴──────┴──────┴──────┴──────┴──────┴──────┴──────┴─────────────┘
```

---

### 2.8 Modo presentación al paciente

```
┌────────────────────────────────────────────────────────────────────────┐
│                                                                        │
│                         🦷  TU SONRISA                                 │
│                                                                        │
│                    Hemos encontrado 2 piezas                           │
│                    que requieren atención                              │
│                                                                        │
│                    ┌─────────────────────────┐                       │
│                    │   [Modelo 3D rotatable]  │                       │
│                    │   Piezas 16 y 26         │                       │
│                    │   resaltadas en rojo     │                       │
│                    └─────────────────────────┘                       │
│                                                                        │
│                    Tratamiento recomendado                             │
│                    ┌──────┐  ┌──────┐                                  │
│                    │  16  │  │  26  │                                  │
│                    └──────┘  └──────┘                                  │
│                                                                        │
│                    Inversión estimada: S/ 1,730                        │
│                                                                        │
│                    [ Ver plan de tratamiento ]                         │
│                                                                        │
│                                                    [Salir modo present.]│
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Flujos de usuario detallados

### 3.1 Flujo recepcionista — Nueva cita

1. Agenda → **+ Nueva cita**
2. Buscar paciente (autocomplete) o **Registrar nuevo**
3. Seleccionar odontólogo, consultorio, fecha/hora, duración
4. Motivo: "Primera consulta" / "Control" / tratamiento específico
5. Guardar → Estado: **Programada**
6. (Opcional) Imprimir recordatorio

---

### 3.2 Flujo odontólogo — Consulta completa

1. Dashboard → Cita de las 09:00 → **Iniciar consulta**
2. Wizard paso 1-3: Motivo, evaluación, diagnóstico inicial
3. Paso 4: **Odontograma**
   - Clic en pieza 16 → Caries → Restauración → Agregar
   - Clic en pieza 26 → Caries profunda → Endodoncia → Agregar
   - Sistema muestra preview del presupuesto en sidebar
4. Paso 5: Plan auto-generado (editable)
5. Paso 6: Presupuesto con totales
6. **Presentar al paciente** (modo 3D fullscreen)
7. Paciente acepta → Marcar presupuesto **Aceptado**
8. Paso 8: Agendar sesión endodoncia para el 15/09
9. Cerrar consulta → Estado **Completada**

---

### 3.3 Flujo presupuesto → proforma PDF

1. Presupuesto PRO-000125 → **Generar PDF**
2. Template incluye:
   - Logo y datos clínica
   - Datos paciente
   - Odontograma snapshot (imagen)
   - Tabla tratamientos
   - Total, descuento, condiciones
   - Espacio firma
3. Guardar en `storage/quotes/PRO-000125.pdf`
4. Vincular como Documento del paciente

---

### 3.4 Flujo folleto explicativo

1. Presupuesto → **Generar folleto paciente**
2. Sistema genera texto amigable:

```
🦷 Tu evaluación dental

Hola Juan,

Durante tu consulta identificamos:

• Pieza 16: Una pequeña lesión (caries) que puede 
  tratarse con una restauración dental.
  
• Pieza 26: Una lesión más profunda que requiere 
  tratamiento de conducto (endodoncia) y posterior 
  corona para proteger el diente.

¿Por qué es importante tratarlo?
...

Inversión estimada: S/ 1,730
```

3. Incluye imagen odontograma marcado
4. Exportar PDF o mostrar en pantalla

---

## 4. Componentes UI reutilizables

| Componente | Uso |
|------------|-----|
| `AppShell` | Layout con sidebar + header |
| `StatCard` | KPIs del dashboard |
| `PatientCard` | Tarjeta resumen paciente |
| `PatientSearch` | Autocomplete global |
| `ConsultaWizard` | Stepper multi-paso |
| `OdontogramCanvas` | SVG interactivo FDI |
| `ToothSurfaceSelector` | Selector D/O/M/V/P-L |
| `TreatmentCatalog` | Tabla diagnósticos/procedimientos |
| `PresupuestoTable` | Tabla editable líneas |
| `AgendaCalendar` | Wrapper FullCalendar |
| `CitaDetailPanel` | Panel lateral cita |
| `DentalModel3D` | Canvas Three.js |
| `PatientPresentationMode` | Modo fullscreen paciente |
| `PDFPreview` | Preview proforma |
| `StatusBadge` | Estados cita/presupuesto/consulta |
| `AlertBanner` | Alergias y alertas clínicas |
| `CommandPalette` | Búsqueda Cmd+K |

---

## 5. Estados y badges

### Citas
| Estado | Color | Label |
|--------|-------|-------|
| PROGRAMADA | Gris | Programada |
| CONFIRMADA | Azul | Confirmada |
| EN_ESPERA | Amarillo | En espera |
| ATENDIDA | Verde | Atendida |
| CANCELADA | Rojo | Cancelada |
| NO_ASISTIO | Naranja | No asistió |

### Presupuestos
| Estado | Color |
|--------|-------|
| BORRADOR | Gris |
| ENVIADO | Azul |
| ACEPTADO | Verde |
| RECHAZADO | Rojo |
| VENCIDO | Naranja |

---

## 6. Atajos de teclado

| Atajo | Acción |
|-------|--------|
| `Cmd+K` | Búsqueda global |
| `Cmd+N` | Nueva consulta |
| `Cmd+Shift+A` | Nueva cita |
| `Cmd+S` | Guardar (en formularios) |
| `Esc` | Cerrar panel/modal |
