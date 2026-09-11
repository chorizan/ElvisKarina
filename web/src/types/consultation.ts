import type { ToothStateKey } from '@/lib/tooth-states'
import type { Surface } from '@/lib/fdi'

export type Prioridad = 'baja' | 'media' | 'alta' | 'urgente'

export interface OdontogramaEntrada {
  id: string
  pieza: number
  superficie?: Surface
  diagnostico: ToothStateKey
  tratamiento?: string
  prioridad: Prioridad
  observacion?: string
  enTratamiento: boolean
  precio?: number
}

export type EstadoConsulta = 'en_curso' | 'completada' | 'cancelada'

export interface Consulta {
  id: string
  pacienteId: string
  odontologoId: string
  fecha: string
  motivo?: string
  evaluacion?: string
  observaciones?: string
  estado: EstadoConsulta
  odontograma: OdontogramaEntrada[]
}
