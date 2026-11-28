import { lazy } from 'react'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { useAuthStore } from '@/stores/uiStore'
import { LoginPage } from '@/pages/LoginPage'
import { PatientsPage } from '@/pages/PatientsPage'
import { PatientDetailPage } from '@/pages/PatientDetailPage'
import { ConsultationsPage } from '@/pages/ConsultationsPage'
import { BudgetsPage } from '@/pages/BudgetsPage'
import { NuevaReservaPage } from '@/pages/NuevaReservaPage'
import { CatalogPage } from '@/pages/CatalogPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { PlaceholderPage } from '@/pages/PlaceholderPage'

// Páginas pesadas (three.js, FullCalendar, recharts) se cargan bajo demanda
const DashboardPage = lazy(() => import('@/pages/DashboardPage').then((m) => ({ default: m.DashboardPage })))
const ConsultaWizardPage = lazy(() => import('@/pages/ConsultaWizardPage').then((m) => ({ default: m.ConsultaWizardPage })))
const OdontogramPage = lazy(() => import('@/pages/OdontogramPage').then((m) => ({ default: m.OdontogramPage })))
const Odontogram3DPage = lazy(() => import('@/pages/Odontogram3DPage').then((m) => ({ default: m.Odontogram3DPage })))
const BudgetDetailPage = lazy(() => import('@/pages/BudgetDetailPage').then((m) => ({ default: m.BudgetDetailPage })))
const AgendaPage = lazy(() => import('@/pages/AgendaPage').then((m) => ({ default: m.AgendaPage })))

function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <Outlet />
}

function LoginRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginRoute />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="pacientes" element={<PatientsPage />} />
          <Route path="pacientes/nuevo" element={<Navigate to="/pacientes" replace />} />
          <Route path="pacientes/:id" element={<PatientDetailPage />} />
          <Route path="consultas" element={<ConsultationsPage />} />
          <Route path="consultas/nueva" element={<ConsultaWizardPage />} />
          <Route path="odontograma" element={<OdontogramPage />} />
          <Route path="odontograma/3d" element={<Odontogram3DPage />} />
          <Route path="tratamientos" element={<PlaceholderPage title="Tratamientos en curso" />} />
          <Route path="presupuestos" element={<BudgetsPage />} />
          <Route path="presupuestos/:id" element={<BudgetDetailPage />} />
          <Route path="pagos" element={<PlaceholderPage title="Pagos" />} />
          <Route path="catalogo" element={<CatalogPage />} />
          <Route path="profesionales" element={<PlaceholderPage title="Profesionales" />} />
          <Route path="consultorios" element={<PlaceholderPage title="Consultorios" />} />
          <Route path="reportes" element={<PlaceholderPage title="Reportes y estadísticas" />} />
          <Route path="configuracion" element={<SettingsPage />} />
          <Route path="agenda" element={<AgendaPage />} />
          <Route path="reservas/nueva" element={<NuevaReservaPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
