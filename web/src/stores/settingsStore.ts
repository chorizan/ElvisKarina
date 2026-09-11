import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { clinica as defaultClinica } from '@/lib/mock-data'
import type { Clinica } from '@/types/patient'

interface SettingsState {
  clinica: Clinica
  updateClinica: (data: Partial<Clinica>) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      clinica: defaultClinica,
      updateClinica: (data) => set({ clinica: { ...get().clinica, ...data } }),
    }),
    { name: 'dental-settings' },
  ),
)
