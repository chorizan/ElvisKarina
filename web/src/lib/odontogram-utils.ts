import type { ToothStateKey } from '@/lib/tooth-states'
import type { OdontogramaEntrada } from '@/types/consultation'

export function getToothState(
  pieza: number,
  entries: OdontogramaEntrada[],
): ToothStateKey {
  const list = entries.filter((e) => e.pieza === pieza)
  if (list.length === 0) return 'sin_registro'
  return list[list.length - 1].diagnostico
}

export function getEntryForTooth(pieza: number, entries: OdontogramaEntrada[]) {
  return entries.filter((e) => e.pieza === pieza).at(-1)
}

export function isAffected(state: ToothStateKey) {
  return state !== 'sin_registro' && state !== 'sano'
}

export function getAffectedTeethSummary(entries: OdontogramaEntrada[]) {
  const map = new Map<number, OdontogramaEntrada>()
  for (const e of entries) {
    if (isAffected(e.diagnostico)) map.set(e.pieza, e)
  }
  return [...map.entries()].map(([pieza, entry]) => ({ pieza, entry }))
}
