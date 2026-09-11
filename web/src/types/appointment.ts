export type EstadoCita =
  | 'programada'
  | 'confirmada'
  | 'en_espera'
  | 'atendida'
  | 'reprogramada'
  | 'cancelada'
  | 'no_asistio'

export interface Cita {
  id: string
  pacienteId: string
  odontologoId: string
  consultorio?: string
  fechaInicio: string
  fechaFin: string
  motivo?: string
  tratamiento?: string
  estado: EstadoCita
  notas?: string
}

export interface CatalogoTratamiento {
  id: string
  codigo: string
  nombre: string
  categoria: string
  precioBase: number
  duracionMin?: number
}
