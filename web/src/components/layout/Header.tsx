import { Bell, LogOut, Menu, Moon, Plus, Search, Sun } from 'lucide-react'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { usuarioActual } from '@/lib/mock-data'
import { inicialUsuario } from '@/lib/utils'
import { useSettingsStore } from '@/stores/settingsStore'
import { useAuthStore, useUIStore } from '@/stores/uiStore'

interface HeaderProps {
  title: string
}

export function Header({ title }: HeaderProps) {
  const navigate = useNavigate()
  const { toggleSidebar, setMobileSidebarOpen, darkMode, toggleDarkMode } = useUIStore()
  const logout = useAuthStore((s) => s.logout)
  const clinica = useSettingsStore((s) => s.clinica)
  const [query, setQuery] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)

  // Ctrl+K / Cmd+K enfoca el buscador
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const handleMenu = () => {
    if (window.matchMedia('(min-width: 1024px)').matches) toggleSidebar()
    else setMobileSidebarOpen(true)
  }

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    navigate(q ? `/pacientes?q=${encodeURIComponent(q)}` : '/pacientes')
    setQuery('')
    searchRef.current?.blur()
  }

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="flex h-16 items-center justify-between gap-2 border-b border-border bg-card px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-2 sm:gap-4">
        <Button variant="ghost" size="icon" onClick={handleMenu} aria-label="Menú">
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="truncate text-lg font-semibold sm:text-xl">{title}</h1>
      </div>

      <form onSubmit={handleSearch} className="hidden max-w-md flex-1 px-8 md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={searchRef}
            placeholder="Buscar pacientes por nombre, DNI o código... (Ctrl+K)"
            className="pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </form>

      <div className="flex items-center gap-1 sm:gap-2">
        <Button variant="outline" size="sm" onClick={() => navigate('/consultas/nueva')}>
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Nueva consulta</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleDarkMode}
          aria-label={darkMode ? 'Modo claro' : 'Modo oscuro'}
        >
          {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <Button variant="ghost" size="icon" aria-label="Notificaciones" className="hidden sm:inline-flex">
          <Bell className="h-4 w-4" />
        </Button>
        <div className="hidden items-center gap-2 pl-2 sm:flex">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
            {inicialUsuario(usuarioActual.nombre)}
          </div>
          <div className="text-right text-xs">
            <p className="font-medium">{usuarioActual.nombre}</p>
            <p className="text-muted-foreground">{clinica.nombre}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Cerrar sesión" title="Cerrar sesión">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
