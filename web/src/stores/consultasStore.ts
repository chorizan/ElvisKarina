import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { consultas as mockConsultas } from '@/lib/mock-data'
import type { Consulta } from '@/types/consultation'

// Igual que en pacientesStore: mantiene el array de mock-data sincronizado
// para que los helpers getConsulta/getConsultasPaciente vean los cambios.
const sync = (list: Consulta[]) => mockConsultas.splice(0, mockConsultas.length, ...list)

interface ConsultasState {
  consultas: Consulta[]
  addConsulta: (data: Omit<Consulta, 'id'>) => Consulta
  updateConsulta: (id: string, data: Partial<Consulta>) => void
}

export const useConsultasStore = create<ConsultasState>()(
  persist(
    (set, get) => ({
      consultas: mockConsultas,
      addConsulta: (data) => {
        const consulta: Consulta = { ...data, id: `c-${Date.now()}` }
        const list = [consulta, ...get().consultas]
        sync(list)
        set({ consultas: list })
        return consulta
      },
      updateConsulta: (id, data) => {
        const list = get().consultas.map((c) => (c.id === id ? { ...c, ...data } : c))
        sync(list)
        set({ consultas: list })
      },
    }),
    {
      name: 'dental-consultas',
      onRehydrateStorage: () => (state) => {
        if (state) sync(state.consultas)
      },
    },
  ),
)
