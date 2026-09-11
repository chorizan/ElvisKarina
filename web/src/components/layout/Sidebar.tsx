import {
  Activity,
  BarChart3,
  Building,
  Calendar,
  CreditCard,
  FileText,
  LayoutDashboard,
  List,
  Settings,
  Smile,
  Stethoscope,
  UserCog,
  Users,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { usuarioActual } from '@/lib/mock-data'
import { useSettingsStore } from '@/stores/settingsStore'

const navSections = [
  {
    title: 'CLÍNICA',
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/agenda', label: 'Agenda', icon: Calendar },
      { to: '/pacientes', label: 'Pacientes', icon: Users },
      { to: '/consultas', label: 'Consultas', icon: Stethoscope },
      { to: '/odontograma', label: 'Odontograma', icon: Smile },
      { to: '/tratamientos', label: 'Tratamientos', icon: Activity },
    ],
  },
  {
    title: 'FINANZAS',
    items: [
      { to: '/presupuestos', label: 'Presupuestos', icon: FileText },
      { to: '/pagos', label: 'Pagos', icon: CreditCard },
      { to: '/catalogo', label: 'Catálogo', icon: List },
    ],
  },
  {
    title: 'RECURSOS',
    items: [
      { to: '/profesionales', label: 'Profesionales', icon: UserCog },
      { to: '/consultorios', label: 'Consultorios', icon: Building },
    ],
  },
  {
    title: 'SISTEMA',
    items: [
      { to: '/reportes', label: 'Reportes', icon: BarChart3 },
      { to: '/configuracion', label: 'Configuración', icon: Settings },
    ],
  },
]

export function Sidebar() {
  const clinica = useSettingsStore((s) => s.clinica)

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-border bg-card">
      <div className="border-b border-border p-5">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🦷</span>
          <div>
            <p className="font-semibold">Dental Studio</p>
            <p className="text-xs text-muted-foreground">{clinica.nombre}</p>
          </div>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">{clinica.direccion}</p>
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        {navSections.map((section) => (
          <div key={section.title} className="mb-4">
            <p className="mb-2 px-3 text-[10px] font-semibold tracking-wider text-muted-foreground">
              {section.title}
            </p>
            <ul className="space-y-0.5">
              {section.items.map(({ to, label, icon: Icon }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                      )
                    }
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-border p-4">
        <p className="mb-2 text-xs text-primary">? Ayuda</p>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            {usuarioActual.nombre.charAt(4)}
          </div>
          <div>
            <p className="text-sm font-medium">{usuarioActual.nombre}</p>
            <p className="text-xs capitalize text-muted-foreground">{usuarioActual.rol}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
