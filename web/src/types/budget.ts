export type EstadoPresupuesto =
  | 'borrador'
  | 'enviado'
  | 'aceptado'
  | 'rechazado'
  | 'vencido'

export interface PresupuestoDetalle {
  id: string
  tratamiento: string
  pieza?: number
  cantidad: number
  precioUnitario: number
  subtotal: number
}

export interface Presupuesto {
  id: string
  numero: string
  pacienteId: string
  consultaId?: string
  fecha: string
  vigencia?: string
  subtotal: number
  descuento: number
  total: number
  adelanto: number
  saldo: number
  estado: EstadoPresupuesto
  observaciones?: string
  detalles: PresupuestoDetalle[]
}
