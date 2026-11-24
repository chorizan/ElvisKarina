import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { pacientes as mockPacientes } from '@/lib/mock-data'
import type { Paciente } from '@/types/patient'

// `getPaciente` (mock-data) lee del array `pacientes`; lo mantenemos sincronizado
// con el store para que todas las pantallas vean a los pacientes nuevos.
const sync = (list: Paciente[]) => mockPacientes.splice(0, mockPacientes.length, ...list)

interface PacientesState {
  pacientes: Paciente[]
  addPaciente: (data: Omit<Paciente, 'id' | 'codigo'>) => Paciente
}

export const usePacientesStore = create<PacientesState>()(
  persist(
    (set, get) => ({
      pacientes: mockPacientes,
      addPaciente: (data) => {
        const n = get().pacientes.length + 1
        const paciente: Paciente = {
          ...data,
          id: `p-${Date.now()}`,
          codigo: `P${String(n).padStart(6, '0')}`,
        }
        const list = [...get().pacientes, paciente]
        sync(list)
        set({ pacientes: list })
        return paciente
      },
    }),
    {
      name: 'dental-pacientes',
      onRehydrateStorage: () => (state) => {
        if (state) sync(state.pacientes)
      },
    },
  ),
)
