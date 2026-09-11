import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input, Label, Select, Textarea } from '@/components/ui/input'
import { DIAGNOSTICOS, TRATAMIENTOS } from '@/lib/tooth-states'
import type { Prioridad } from '@/types/consultation'
import { formatCurrency } from '@/lib/utils'

interface ToothDetailPanelProps {
  pieza: number | null
  diagnostico: string
  tratamiento: string
  prioridad: Prioridad
  observacion: string
  onDiagnosticoChange: (v: string) => void
  onTratamientoChange: (v: string) => void
  onPrioridadChange: (v: Prioridad) => void
  onObservacionChange: (v: string) => void
  onAdd: () => void
}

export function ToothDetailPanel({
  pieza,
  diagnostico,
  tratamiento,
  prioridad,
  observacion,
  onDiagnosticoChange,
  onTratamientoChange,
  onPrioridadChange,
  onObservacionChange,
  onAdd,
}: ToothDetailPanelProps) {
  const precio = TRATAMIENTOS.find((t) => t.value === tratamiento)?.precio ?? 0

  if (!pieza) {
    return (
      <Card>
        <CardContent className="flex h-64 items-center justify-center p-6">
          <p className="text-center text-sm text-muted-foreground">
            Haz clic en un diente del odontograma para registrar diagnóstico y tratamiento.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Pieza {pieza}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Diagnóstico</Label>
          <Select value={diagnostico} onChange={(e) => onDiagnosticoChange(e.target.value)}>
            <option value="">Seleccionar...</option>
            {DIAGNOSTICOS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label>Tratamiento</Label>
          <Select value={tratamiento} onChange={(e) => onTratamientoChange(e.target.value)}>
            <option value="">Seleccionar...</option>
            {TRATAMIENTOS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label} — {formatCurrency(t.precio)}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label>Prioridad</Label>
          <Select
            value={prioridad}
            onChange={(e) => onPrioridadChange(e.target.value as Prioridad)}
          >
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
            <option value="urgente">Urgente</option>
          </Select>
        </div>
        <div>
          <Label>Precio estimado</Label>
          <Input value={formatCurrency(precio)} readOnly />
        </div>
        <div>
          <Label>Observación</Label>
          <Textarea
            placeholder="Ej. Caries oclusal, programar resina."
            value={observacion}
            onChange={(e) => onObservacionChange(e.target.value)}
          />
        </div>
        <Button className="w-full" onClick={onAdd} disabled={!diagnostico}>
          Agregar procedimiento
        </Button>
      </CardContent>
    </Card>
  )
}
