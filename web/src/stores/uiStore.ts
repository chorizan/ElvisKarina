import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  isAuthenticated: boolean
  login: (email: string, password: string) => boolean
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      login: (email, password) => {
        if (email.trim() && password) {
          set({ isAuthenticated: true })
          return true
        }
        return false
      },
      logout: () => set({ isAuthenticated: false }),
    }),
    { name: 'dental-auth' },
  ),
)

interface UIState {
  sidebarOpen: boolean
  mobileSidebarOpen: boolean
  darkMode: boolean
  toggleSidebar: () => void
  setMobileSidebarOpen: (value: boolean) => void
  setDarkMode: (value: boolean) => void
  toggleDarkMode: () => void
}

const applyDark = (value: boolean) => document.documentElement.classList.toggle('dark', value)

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      sidebarOpen: true,
      mobileSidebarOpen: false,
      darkMode: false,
      toggleSidebar: () => set({ sidebarOpen: !get().sidebarOpen }),
      setMobileSidebarOpen: (value) => set({ mobileSidebarOpen: value }),
      setDarkMode: (value) => {
        applyDark(value)
        set({ darkMode: value })
      },
      toggleDarkMode: () => get().setDarkMode(!get().darkMode),
    }),
    {
      name: 'dental-ui',
      // El menú móvil no se persiste: siempre arranca cerrado.
      partialize: (s) => ({ sidebarOpen: s.sidebarOpen, darkMode: s.darkMode }),
      // Aplica el tema guardado al cargar la página.
      onRehydrateStorage: () => (state) => applyDark(state?.darkMode ?? false),
    },
  ),
)
