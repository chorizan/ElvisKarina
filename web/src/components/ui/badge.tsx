import type * as React from 'react'
import { cn } from '@/lib/utils'

const variants: Record<string, string> = {
  default: 'bg-secondary text-secondary-foreground',
  success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  danger: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  info: 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400',
}

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof variants
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className,
      )}
      {...props}
    />
  )
}

export const citaEstadoBadge: Record<string, { label: string; variant: BadgeProps['variant'] }> = {
  programada: { label: 'Programada', variant: 'default' },
  confirmada: { label: 'Confirmada', variant: 'info' },
  en_espera: { label: 'En espera', variant: 'warning' },
  atendida: { label: 'Atendida', variant: 'success' },
  cancelada: { label: 'Cancelada', variant: 'danger' },
  no_asistio: { label: 'No asistió', variant: 'warning' },
  reprogramada: { label: 'Reprogramada', variant: 'info' },
}

export const presupuestoEstadoBadge: Record<string, { label: string; variant: BadgeProps['variant'] }> = {
  borrador: { label: 'Borrador', variant: 'default' },
  enviado: { label: 'Enviado', variant: 'info' },
  aceptado: { label: 'Aceptado', variant: 'success' },
  rechazado: { label: 'Rechazado', variant: 'danger' },
  vencido: { label: 'Vencido', variant: 'warning' },
}
