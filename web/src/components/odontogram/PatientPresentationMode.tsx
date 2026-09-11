import { Canvas } from '@react-three/fiber'
import { DentalMouth3D } from '@/components/odontogram/DentalMouth3D'
import { getAffectedTeethSummary } from '@/lib/odontogram-utils'
import { TOOTH_STATES } from '@/lib/tooth-states'
import type { OdontogramaEntrada } from '@/types/consultation'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { TRATAMIENTOS } from '@/lib/tooth-states'

interface PatientPresentationModeProps {
  open: boolean
  onClose: () => void
  pacienteNombre: string
  entries: OdontogramaEntrada[]
  total: number
}

export function PatientPresentationMode({
  open,
  onClose,
  pacienteNombre,
  entries,
  total,
}: PatientPresentationModeProps) {
  if (!open) return null

  const affected = getAffectedTeethSummary(entries)

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gradient-to-br from-slate-50 to-sky-50 dark:from-slate-900 dark:to-slate-800">
      <Button variant="ghost" size="icon" className="absolute right-6 top-6 z-10" onClick={onClose}>
        <X className="h-5 w-5" />
      </Button>

      <div className="flex shrink-0 flex-col items-center px-6 pt-8 text-center">
        <p className="text-4xl">🦷</p>
        <h1 className="mt-2 text-3xl font-bold">Tu sonrisa</h1>
        <p className="mt-1 max-w-md text-muted-foreground">
          Hola {pacienteNombre.split(' ')[0]}, hemos encontrado{' '}
          <strong>{affected.length}</strong> pieza(s) que requieren atención.
        </p>
      </div>

      <div className="relative min-h-0 flex-1 bg-gradient-to-b from-slate-100 to-slate-200">
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ position: [0, 1.25, 3.4], fov: 40 }}
          className="h-full w-full"
        >
          <DentalMouth3D entries={entries} showLabels autoRotate />
        </Canvas>
      </div>

      <div className="shrink-0 space-y-4 px-6 pb-8 text-center">
        <div className="flex flex-wrap justify-center gap-3">
          {affected.map(({ pieza, entry }) => (
            <span
              key={pieza}
              className="rounded-xl border-2 px-5 py-2 text-lg font-bold"
              style={{
                borderColor: TOOTH_STATES[entry.diagnostico].color,
                color: TOOTH_STATES[entry.diagnostico].color,
                background: `${TOOTH_STATES[entry.diagnostico].color}15`,
              }}
            >
              {pieza}
            </span>
          ))}
        </div>

        <div className="mx-auto max-w-lg space-y-1">
          {entries
            .filter((e) => e.tratamiento)
            .map((e) => {
              const trat = TRATAMIENTOS.find((t) => t.value === e.tratamiento)
              return (
                <p key={e.id} className="text-sm text-muted-foreground">
                  <strong>Pieza {e.pieza}:</strong> {trat?.label ?? e.tratamiento}
                </p>
              )
            })}
        </div>

        <p className="text-2xl font-bold text-primary">
          Inversión estimada: {formatCurrency(total)}
        </p>

        <Button size="lg">Ver plan de tratamiento</Button>
      </div>
    </div>
  )
}
