import { create } from 'zustand'
import type { OdontogramaEntrada } from '@/types/consultation'
import type { PresupuestoDetalle } from '@/types/budget'
import { TRATAMIENTOS } from '@/lib/tooth-states'

interface ConsultaState {
  odontograma: OdontogramaEntrada[]
  presupuestoLineas: PresupuestoDetalle[]
  lastAction: string
  setOdontograma: (entries: OdontogramaEntrada[]) => void
  addOdontogramaEntry: (entry: OdontogramaEntrada) => void
  removeOdontogramaEntry: (id: string) => void
  syncPresupuestoFromOdontograma: () => void
  setPresupuestoLineas: (lineas: PresupuestoDetalle[]) => void
  setLastAction: (action: string) => void
  reset: () => void
}

function entryToLinea(entry: OdontogramaEntrada): PresupuestoDetalle | null {
  if (!entry.tratamiento) return null
  const trat = TRATAMIENTOS.find((t) => t.value === entry.tratamiento)
  const precio = entry.precio ?? trat?.precio ?? 0
  const label = trat?.label ?? entry.tratamiento
  return {
    id: entry.id,
    tratamiento: label,
    pieza: entry.pieza,
    cantidad: 1,
    precioUnitario: precio,
    subtotal: precio,
  }
}

export const useConsultaStore = create<ConsultaState>((set, get) => ({
  odontograma: [],
  presupuestoLineas: [],
  lastAction: '',
  setOdontograma: (entries) => {
    set({ odontograma: entries })
    get().syncPresupuestoFromOdontograma()
  },
  addOdontogramaEntry: (entry) => {
    const current = get().odontograma.filter(
      (e) => !(e.pieza === entry.pieza && e.tratamiento === entry.tratamiento),
    )
    const next = [...current, entry]
    set({
      odontograma: next,
      lastAction: `Tratamiento ${entry.tratamiento?.toUpperCase()} agregado a pieza #${entry.pieza}`,
    })
    get().syncPresupuestoFromOdontograma()
  },
  removeOdontogramaEntry: (id) => {
    set({ odontograma: get().odontograma.filter((e) => e.id !== id) })
    get().syncPresupuestoFromOdontograma()
  },
  syncPresupuestoFromOdontograma: () => {
    const lineas = get()
      .odontograma.map(entryToLinea)
      .filter((l): l is PresupuestoDetalle => l !== null)
    set({ presupuestoLineas: lineas })
  },
  setPresupuestoLineas: (lineas) => set({ presupuestoLineas: lineas }),
  setLastAction: (action) => set({ lastAction: action }),
  reset: () =>
    set({ odontograma: [], presupuestoLineas: [], lastAction: '' }),
}))
