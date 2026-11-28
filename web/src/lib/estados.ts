import type { BadgeVariant } from '@/components/ui/badge'

export const citaEstadoBadge: Record<string, { label: string; variant: BadgeVariant }> = {
  programada: { label: 'Programada', variant: 'default' },
  confirmada: { label: 'Confirmada', variant: 'info' },
  en_espera: { label: 'En espera', variant: 'warning' },
  atendida: { label: 'Atendida', variant: 'success' },
  cancelada: { label: 'Cancelada', variant: 'danger' },
  no_asistio: { label: 'No asistió', variant: 'warning' },
  reprogramada: { label: 'Reprogramada', variant: 'info' },
}

export const presupuestoEstadoBadge: Record<string, { label: string; variant: BadgeVariant }> = {
  borrador: { label: 'Borrador', variant: 'default' },
  enviado: { label: 'Enviado', variant: 'info' },
  aceptado: { label: 'Aceptado', variant: 'success' },
  rechazado: { label: 'Rechazado', variant: 'danger' },
  vencido: { label: 'Vencido', variant: 'warning' },
}
