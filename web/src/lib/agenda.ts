import type { Cita } from '@/types/appointment'

/** Horario de atención (debe coincidir con slotMinTime/slotMaxTime del calendario) */
export const HORA_APERTURA = 8
export const HORA_CIERRE = 20

/**
 * Valida un horario de cita. Devuelve un mensaje de error o null si es válido.
 * `excludeId` permite ignorar la propia cita al reprogramarla.
 */
export function validarHorarioCita(
  citas: Cita[],
  { inicio, fin, consultorio, excludeId }: { inicio: Date; fin: Date; consultorio?: string; excludeId?: string },
): string | null {
  if (Number.isNaN(inicio.getTime()) || Number.isNaN(fin.getTime())) return 'Fecha u hora no válida.'
  if (inicio.getTime() < Date.now() - 60_000) return 'No puedes programar una cita en el pasado.'

  const minutos = (d: Date) => d.getHours() * 60 + d.getMinutes()
  const mismoDia = inicio.toDateString() === fin.toDateString()
  if (
    minutos(inicio) < HORA_APERTURA * 60 ||
    !mismoDia ||
    minutos(fin) > HORA_CIERRE * 60
  ) {
    return `La cita debe estar dentro del horario de atención (${HORA_APERTURA}:00 – ${HORA_CIERRE}:00).`
  }

  const choque = citas.find(
    (c) =>
      c.id !== excludeId &&
      c.estado !== 'cancelada' &&
      (!consultorio || !c.consultorio || c.consultorio === consultorio) &&
      new Date(c.fechaInicio) < fin &&
      new Date(c.fechaFin) > inicio,
  )
  if (choque) {
    const h = (iso: string) =>
      new Date(iso).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: false })
    return `Ese horario se cruza con otra cita en ${choque.consultorio ?? 'el consultorio'} (${h(choque.fechaInicio)} – ${h(choque.fechaFin)}).`
  }
  return null
}
