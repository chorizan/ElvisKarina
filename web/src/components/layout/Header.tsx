import { Bell, Menu, Moon, Plus, Search, Sun } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { clinica, usuarioActual } from '@/lib/mock-data'
import { useUIStore } from '@/stores/uiStore'

interface HeaderProps {
  title: string
  onSearchOpen?: () => void
}

export function Header({ title, onSearchOpen }: HeaderProps) {
  const navigate = useNavigate()
  const { toggleSidebar, darkMode, toggleDarkMode } = useUIStore()

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>

      <div className="hidden max-w-md flex-1 px-8 md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar pacientes, citas... (Ctrl+K)"
            className="pl-9"
            onFocus={onSearchOpen}
            readOnly
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => navigate('/consultas/nueva')}>
          <Plus className="h-4 w-4" />
          Nueva consulta
        </Button>
        <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
          {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <Button variant="ghost" size="icon">
          <Bell className="h-4 w-4" />
        </Button>
        <div className="hidden items-center gap-2 pl-2 sm:flex">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
            {usuarioActual.nombre.charAt(4)}
          </div>
          <div className="text-right text-xs">
            <p className="font-medium">{usuarioActual.nombre}</p>
            <p className="text-muted-foreground">{clinica.nombre}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
