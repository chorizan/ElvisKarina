import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { citas as mockCitas } from '@/lib/mock-data'
import type { Cita } from '@/types/appointment'

interface CitasState {
  citas: Cita[]
  addCita: (data: Omit<Cita, 'id'>) => Cita
  updateCita: (id: string, data: Partial<Cita>) => void
}

export const useCitasStore = create<CitasState>()(
  persist(
    (set, get) => ({
      citas: mockCitas,
      addCita: (data) => {
        const cita: Cita = { ...data, id: `c-${Date.now()}` }
        set({ citas: [...get().citas, cita] })
        return cita
      },
      updateCita: (id, data) =>
        set({ citas: get().citas.map((c) => (c.id === id ? { ...c, ...data } : c)) }),
    }),
    { name: 'dental-citas' },
  ),
)
