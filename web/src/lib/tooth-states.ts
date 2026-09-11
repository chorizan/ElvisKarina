export type ToothStateKey =
  | 'sin_registro'
  | 'sano'
  | 'caries'
  | 'restauracion'
  | 'endodoncia'
  | 'extraccion'
  | 'implante'
  | 'corona'
  | 'fractura'
  | 'ausente'

export const TOOTH_STATES: Record<
  ToothStateKey,
  { color: string; label: string }
> = {
  sin_registro: { color: '#94a3b8', label: 'Sin registro' },
  sano: { color: '#22c55e', label: 'Sano' },
  caries: { color: '#ef4444', label: 'Caries' },
  restauracion: { color: '#3b82f6', label: 'Restauración' },
  endodoncia: { color: '#a855f7', label: 'Endodoncia' },
  extraccion: { color: '#475569', label: 'Extracción' },
  implante: { color: '#f97316', label: 'Implante' },
  corona: { color: '#14b8a6', label: 'Corona' },
  fractura: { color: '#ec4899', label: 'Fractura' },
  ausente: { color: '#1e293b', label: 'Ausente' },
}

export const DIAGNOSTICOS = Object.entries(TOOTH_STATES)
  .filter(([key]) => key !== 'sin_registro')
  .map(([value, { label }]) => ({ value, label }))

export const TRATAMIENTOS = [
  { value: 'restauracion', label: 'Restauración', precio: 180 },
  { value: 'endodoncia', label: 'Endodoncia', precio: 650 },
  { value: 'corona', label: 'Corona', precio: 900 },
  { value: 'extraccion', label: 'Extracción', precio: 120 },
  { value: 'limpieza', label: 'Limpieza dental', precio: 150 },
  { value: 'blanqueamiento', label: 'Blanqueamiento', precio: 450 },
  { value: 'implante', label: 'Implante', precio: 2800 },
  { value: 'resina', label: 'Resina compleja', precio: 220 },
]
