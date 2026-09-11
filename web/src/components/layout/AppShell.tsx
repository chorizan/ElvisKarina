import { Outlet, useLocation } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores/uiStore'

const titles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/agenda': 'Agenda',
  '/pacientes': 'Pacientes',
  '/consultas': 'Consultas',
  '/odontograma': 'Odontograma',
  '/tratamientos': 'Tratamientos',
  '/presupuestos': 'Presupuestos',
  '/pagos': 'Pagos',
  '/catalogo': 'Catálogo de precios',
  '/profesionales': 'Profesionales',
  '/consultorios': 'Consultorios',
  '/reportes': 'Reportes',
  '/configuracion': 'Configuración',
  '/reservas/nueva': 'Nueva reserva',
}

function getTitle(pathname: string) {
  if (pathname.startsWith('/pacientes/')) return 'Perfil del paciente'
  if (pathname.startsWith('/consultas/')) return 'Consulta'
  if (pathname.startsWith('/presupuestos/')) return 'Presupuesto'
  if (pathname.startsWith('/odontograma/')) return 'Odontograma'
  return titles[pathname] ?? 'Dental Studio'
}

export function AppShell() {
  const location = useLocation()
  const { sidebarOpen } = useUIStore()
  const isFullBleed =
    location.pathname === '/odontograma' || location.pathname.startsWith('/odontograma/')

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className={cn('hidden lg:block', !sidebarOpen && 'lg:hidden')}>
        <Sidebar />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <Header title={getTitle(location.pathname)} />
        <main
          className={cn(
            'flex-1',
            isFullBleed ? 'min-h-0 overflow-hidden' : 'overflow-y-auto p-6',
          )}
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}
