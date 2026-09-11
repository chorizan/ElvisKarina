# 🦷 Dental Studio

Sistema de gestión odontológica local completo. Flujo clínico integrado:

**Consulta → Diagnóstico → Odontograma → Tratamiento → Presupuesto → Proforma → Reserva → Seguimiento**

## Inicio rápido

```bash
cd web
npm install
npm run dev
```

Abre http://localhost:5173 — credenciales demo: cualquier email/contraseña.

## Módulos implementados

| Módulo | Estado |
|--------|--------|
| Login + layout premium | ✅ |
| Dashboard (KPIs, gráficos) | ✅ |
| Pacientes (lista + perfil) | ✅ |
| Consultas (wizard 8 pasos) | ✅ |
| Odontograma 2D interactivo (FDI) | ✅ |
| Odontograma 3D + modo presentación | ✅ |
| Presupuestos + proforma preview | ✅ |
| Agenda FullCalendar | ✅ |
| Catálogo de precios | ✅ |
| Configuración + modo oscuro | ✅ |
| Backend NestJS + SQLite | 🔜 Fase 2 |

## Documentación

| Documento | Descripción |
|-----------|-------------|
| [docs/ARQUITECTURA.md](docs/ARQUITECTURA.md) | Arquitectura técnica, modelo de datos, API |
| [docs/PANTALLAS-Y-FLUJOS.md](docs/PANTALLAS-Y-FLUJOS.md) | Wireframes, rutas, flujos de usuario |
| [docs/PROMPT-MAESTRO-FRONTEND.md](docs/PROMPT-MAESTRO-FRONTEND.md) | Prompt para extender el frontend |

## Stack

- **Frontend:** React + Vite + TypeScript + Tailwind + shadcn-style UI
- **Estado:** Zustand + TanStack Query
- **Calendario:** FullCalendar
- **3D:** Three.js + React Three Fiber
- **Backend (próximo):** NestJS + Prisma + SQLite

## Estructura

```
ElvisKarina/
├── web/                 # Frontend React (ejecutable)
├── docs/                # Arquitectura y documentación
└── README.md
```
