import { Canvas } from '@react-three/fiber'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { DentalMouth3D } from '@/components/odontogram/DentalMouth3D'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { consultas } from '@/lib/mock-data'
import { getAffectedTeethSummary, getToothState } from '@/lib/odontogram-utils'
import { TOOTH_STATES } from '@/lib/tooth-states'
import { useConsultaStore } from '@/stores/consultaStore'

export function Odontogram3DPage() {
  const { odontograma } = useConsultaStore()
  const entries = odontograma.length > 0 ? odontograma : consultas[0].odontograma
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null)
  const affected = getAffectedTeethSummary(entries)
  const selectedEntry = selectedTooth
    ? entries.filter((e) => e.pieza === selectedTooth).at(-1)
    : null

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-3">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/odontograma">
            <ArrowLeft className="h-4 w-4" />
            Volver al odontograma 2D
          </Link>
        </Button>
        <p className="text-sm text-muted-foreground">
          {affected.length} pieza(s) afectada(s) · Arrastra para rotar · Scroll para zoom
        </p>
      </div>

      <div className="flex min-h-0 flex-1">
        <div className="relative min-w-0 flex-1 bg-gradient-to-b from-slate-100 to-slate-200">
          <Canvas
            shadows
            dpr={[1, 2]}
            camera={{ position: [0, 1.35, 3.5], fov: 40 }}
            className="h-full w-full"
          >
            <DentalMouth3D
              entries={entries}
              selectedTooth={selectedTooth}
              onToothSelect={setSelectedTooth}
              showLabels
            />
          </Canvas>

          <div className="absolute bottom-4 left-4 flex flex-wrap gap-2 rounded-xl border border-border bg-card/90 p-3 shadow-sm backdrop-blur-sm">
            {Object.entries(TOOTH_STATES)
              .filter(([k]) => k !== 'sin_registro')
              .map(([key, { color, label }]) => (
                <span key={key} className="flex items-center gap-1.5 text-xs">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
                  {label}
                </span>
              ))}
          </div>
        </div>

        <aside className="w-72 shrink-0 overflow-y-auto border-l border-border bg-muted/20 p-4 lg:w-80">
          <h3 className="mb-1 font-semibold">Piezas afectadas</h3>
          <p className="mb-4 text-xs text-muted-foreground">
            Marcadas previamente en el odontograma 2D
          </p>

          {affected.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No hay piezas marcadas. Registra diagnósticos en el odontograma 2D.
            </p>
          ) : (
            <div className="space-y-2">
              {affected.map(({ pieza, entry }) => {
                const state = getToothState(pieza, entries)
                const info = TOOTH_STATES[state]
                return (
                  <button
                    key={pieza}
                    type="button"
                    onClick={() => setSelectedTooth(pieza)}
                    className={`w-full rounded-lg border p-3 text-left text-sm transition-colors ${
                      selectedTooth === pieza
                        ? 'border-primary bg-primary/5'
                        : 'border-border bg-card hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold">Pieza {pieza}</span>
                      <Badge variant="default" style={{ background: info.color, color: '#fff' }}>
                        {info.label}
                      </Badge>
                    </div>
                    {entry.tratamiento && (
                      <p className="mt-1 capitalize text-muted-foreground">
                        Tratamiento: {entry.tratamiento.replace('_', ' ')}
                      </p>
                    )}
                  </button>
                )
              })}
            </div>
          )}

          {selectedEntry && selectedTooth && (
            <Card className="mt-4">
              <CardContent className="space-y-2 p-4 text-sm">
                <p className="font-semibold">Pieza {selectedTooth}</p>
                <p>
                  <span className="text-muted-foreground">Diagnóstico:</span>{' '}
                  {TOOTH_STATES[selectedEntry.diagnostico].label}
                </p>
                {selectedEntry.tratamiento && (
                  <p>
                    <span className="text-muted-foreground">Tratamiento:</span>{' '}
                    <span className="capitalize">
                      {selectedEntry.tratamiento.replace('_', ' ')}
                    </span>
                  </p>
                )}
                {selectedEntry.observacion && (
                  <p>
                    <span className="text-muted-foreground">Nota:</span>{' '}
                    {selectedEntry.observacion}
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </aside>
      </div>
    </div>
  )
}
