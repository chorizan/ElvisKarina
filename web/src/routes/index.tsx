import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { useAuthStore } from '@/stores/uiStore'
import { LoginPage } from '@/pages/LoginPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { PatientsPage } from '@/pages/PatientsPage'
import { PatientDetailPage } from '@/pages/PatientDetailPage'
import { ConsultationsPage } from '@/pages/ConsultationsPage'
import { ConsultaWizardPage } from '@/pages/ConsultaWizardPage'
import { OdontogramPage } from '@/pages/OdontogramPage'
import { Odontogram3DPage } from '@/pages/Odontogram3DPage'
import { BudgetsPage } from '@/pages/BudgetsPage'
import { BudgetDetailPage } from '@/pages/BudgetDetailPage'
import { AgendaPage } from '@/pages/AgendaPage'
import { NuevaReservaPage } from '@/pages/NuevaReservaPage'
import { CatalogPage } from '@/pages/CatalogPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { PlaceholderPage } from '@/pages/PlaceholderPage'

function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <Outlet />
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="pacientes" element={<PatientsPage />} />
          <Route path="pacientes/nuevo" element={<PlaceholderPage title="Nuevo paciente" description="Formulario de registro" />} />
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
