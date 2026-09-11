import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import type { PresupuestoDetalle } from '@/types/budget'
import { formatCurrency } from '@/lib/utils'

interface PresupuestoTableProps {
  detalles: PresupuestoDetalle[]
  descuento?: number
  adelanto?: number
  editable?: boolean
}

export function PresupuestoTable({
  detalles,
  descuento = 0,
  adelanto = 0,
  editable = false,
}: PresupuestoTableProps) {
  const subtotal = detalles.reduce((s, d) => s + d.subtotal, 0)
  const total = subtotal - descuento
  const saldo = total - adelanto

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium">Tratamiento</th>
                <th className="px-4 py-3 text-center font-medium">Pieza</th>
                <th className="px-4 py-3 text-center font-medium">Cant.</th>
                <th className="px-4 py-3 text-right font-medium">P. Unit.</th>
                <th className="px-4 py-3 text-right font-medium">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {detalles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    Sin líneas. Agrega tratamientos desde el odontograma.
                  </td>
                </tr>
              ) : (
                detalles.map((d) => (
                  <tr key={d.id} className="border-b border-border">
                    <td className="px-4 py-3">{d.tratamiento}</td>
                    <td className="px-4 py-3 text-center">{d.pieza ?? '—'}</td>
                    <td className="px-4 py-3 text-center">{d.cantidad}</td>
                    <td className="px-4 py-3 text-right">{formatCurrency(d.precioUnitario)}</td>
                    <td className="px-4 py-3 text-right font-medium">{formatCurrency(d.subtotal)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="space-y-2 border-t border-border p-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          {editable && (
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-muted-foreground">Descuento</span>
              <Input type="number" className="h-8 w-24 text-right" defaultValue={descuento} />
            </div>
          )}
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-primary">{formatCurrency(total)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Adelanto</span>
            <span>{formatCurrency(adelanto)}</span>
          </div>
          <div className="flex justify-between text-sm font-medium">
            <span>Saldo</span>
            <span>{formatCurrency(saldo)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
