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
      login: (email, _password) => {
        if (email) {
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
  darkMode: boolean
  toggleSidebar: () => void
  setDarkMode: (value: boolean) => void
  toggleDarkMode: () => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      sidebarOpen: true,
      darkMode: false,
      toggleSidebar: () => set({ sidebarOpen: !get().sidebarOpen }),
      setDarkMode: (value) => {
        document.documentElement.classList.toggle('dark', value)
        set({ darkMode: value })
      },
      toggleDarkMode: () => {
        const next = !get().darkMode
        document.documentElement.classList.toggle('dark', next)
        set({ darkMode: next })
      },
    }),
    { name: 'dental-ui' },
  ),
)
