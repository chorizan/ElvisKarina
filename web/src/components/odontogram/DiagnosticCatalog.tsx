import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TOOTH_STATES } from '@/lib/tooth-states'
import type { OdontogramaEntrada } from '@/types/consultation'
import { formatCurrency } from '@/lib/utils'

interface DiagnosticCatalogProps {
  entries: OdontogramaEntrada[]
  onRemove: (id: string) => void
}

export function DiagnosticCatalog({ entries, onRemove }: DiagnosticCatalogProps) {
  const diagnosticos = entries.filter((e) => e.diagnostico)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Catálogo Diagnósticos</CardTitle>
      </CardHeader>
      <CardContent>
        {diagnosticos.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sin diagnósticos registrados.</p>
        ) : (
          <div className="space-y-2">
            {diagnosticos.map((e) => (
              <div
                key={e.id}
                className="flex items-start justify-between gap-2 rounded-lg border border-border p-2 text-sm"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: TOOTH_STATES[e.diagnostico].color }}
                    />
                    <span className="font-medium">{TOOTH_STATES[e.diagnostico].label}</span>
                    <span className="text-muted-foreground">#{e.pieza}</span>
                  </div>
                  {e.superficie && (
                    <p className="text-xs text-muted-foreground">Superficie: {e.superficie}</p>
                  )}
                  {e.observacion && (
                    <p className="text-xs text-muted-foreground">{e.observacion}</p>
                  )}
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => onRemove(e.id)}>
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function ProcedureCatalog({ entries, onRemove }: DiagnosticCatalogProps) {
  const procedimientos = entries.filter((e) => e.tratamiento)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Catálogo Procedimientos</CardTitle>
      </CardHeader>
      <CardContent>
        {procedimientos.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sin procedimientos registrados.</p>
        ) : (
          <div className="space-y-2">
            {procedimientos.map((e) => (
              <div
                key={e.id}
                className="flex items-center justify-between rounded-lg border border-border p-2 text-sm"
              >
                <div>
                  <p className="font-medium capitalize">{e.tratamiento?.replace('_', ' ')}</p>
                  <p className="text-xs text-muted-foreground">Pieza #{e.pieza}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-primary">
                    {formatCurrency(e.precio ?? 0)}
                  </span>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onRemove(e.id)}>
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
