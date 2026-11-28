import { create } from 'zustand'
import type { OdontogramaEntrada } from '@/types/consultation'
import type { PresupuestoDetalle } from '@/types/budget'
import { TRATAMIENTOS } from '@/lib/tooth-states'

/**
 * Estado de trabajo del odontograma que se está editando.
 * `consultaId` indica qué consulta está cargada (null = consulta nueva del asistente).
 */
interface ConsultaState {
  consultaId: string | null
  odontograma: OdontogramaEntrada[]
  presupuestoLineas: PresupuestoDetalle[]
  lastAction: string
  dirty: boolean
  loadConsulta: (consultaId: string | null, entries: OdontogramaEntrada[]) => void
  setOdontograma: (entries: OdontogramaEntrada[]) => void
  addOdontogramaEntry: (entry: OdontogramaEntrada) => void
  removeOdontogramaEntry: (id: string) => void
  removeTratamiento: (id: string) => void
  markSaved: () => void
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
  consultaId: null,
  odontograma: [],
  presupuestoLineas: [],
  lastAction: '',
  dirty: false,
  loadConsulta: (consultaId, entries) => {
    set({ consultaId, odontograma: entries, lastAction: '', dirty: false })
    get().syncPresupuestoFromOdontograma()
  },
  setOdontograma: (entries) => {
    set({ odontograma: entries, dirty: true })
    get().syncPresupuestoFromOdontograma()
  },
  addOdontogramaEntry: (entry) => {
    const current = get().odontograma.filter(
      (e) => !(e.pieza === entry.pieza && e.tratamiento === entry.tratamiento),
    )
    set({
      odontograma: [...current, entry],
      dirty: true,
      lastAction: entry.tratamiento
        ? `Tratamiento ${entry.tratamiento.toUpperCase()} agregado a pieza #${entry.pieza}`
        : `Diagnóstico ${entry.diagnostico.toUpperCase()} registrado en pieza #${entry.pieza}`,
    })
    get().syncPresupuestoFromOdontograma()
  },
  removeOdontogramaEntry: (id) => {
    const entry = get().odontograma.find((e) => e.id === id)
    set({
      odontograma: get().odontograma.filter((e) => e.id !== id),
      dirty: true,
      lastAction: entry ? `Diagnóstico eliminado de pieza #${entry.pieza}` : get().lastAction,
    })
    get().syncPresupuestoFromOdontograma()
  },
  removeTratamiento: (id) => {
    const entry = get().odontograma.find((e) => e.id === id)
    set({
      odontograma: get().odontograma.map((e) =>
        e.id === id ? { ...e, tratamiento: undefined, precio: undefined, enTratamiento: false } : e,
      ),
      dirty: true,
      lastAction: entry ? `Procedimiento eliminado de pieza #${entry.pieza}` : get().lastAction,
    })
    get().syncPresupuestoFromOdontograma()
  },
  markSaved: () => set({ dirty: false, lastAction: 'Odontograma guardado' }),
  syncPresupuestoFromOdontograma: () => {
    const lineas = get()
      .odontograma.map(entryToLinea)
      .filter((l): l is PresupuestoDetalle => l !== null)
    set({ presupuestoLineas: lineas })
  },
  setPresupuestoLineas: (lineas) => set({ presupuestoLineas: lineas }),
  setLastAction: (action) => set({ lastAction: action }),
  reset: () =>
    set({ consultaId: null, odontograma: [], presupuestoLineas: [], lastAction: '', dirty: false }),
}))
