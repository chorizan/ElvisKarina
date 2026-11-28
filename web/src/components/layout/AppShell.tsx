import { Suspense, useEffect } from 'react'
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
  const { sidebarOpen, mobileSidebarOpen, setMobileSidebarOpen } = useUIStore()
  const isFullBleed =
    location.pathname === '/odontograma' || location.pathname.startsWith('/odontograma/')

  // Cierra el menú móvil al navegar.
  useEffect(() => {
    setMobileSidebarOpen(false)
  }, [location.pathname, setMobileSidebarOpen])

  return (
    <div className="flex h-screen overflow-hidden bg-background print:h-auto print:overflow-visible">
      <div className={cn('hidden print:hidden', sidebarOpen && 'lg:block')}>
        <Sidebar />
      </div>

      {/* Menú lateral en móvil */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden print:hidden">
          <button
            type="button"
            aria-label="Cerrar menú"
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative h-full w-64 shadow-xl">
            <Sidebar />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="print:hidden">
          <Header title={getTitle(location.pathname)} />
        </div>
        <main
          className={cn(
            'flex-1 print:overflow-visible print:p-0',
            isFullBleed ? 'min-h-0 overflow-hidden' : 'overflow-y-auto p-4 sm:p-6',
          )}
        >
          <Suspense
            fallback={
              <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
                Cargando…
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
