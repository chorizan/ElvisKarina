import { motion } from 'framer-motion'
import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { PresupuestoTable } from '@/components/budgets/PresupuestoTable'
import { OdontogramCanvas } from '@/components/odontogram/OdontogramCanvas'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input, Label, Textarea } from '@/components/ui/input'
import { getPaciente } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { useConsultaStore } from '@/stores/consultaStore'

const STEPS = [
  'Motivo',
  'Evaluación',
  'Diagnóstico',
  'Odontograma',
  'Plan',
  'Presupuesto',
  'Documentos',
  'Cierre',
]

export function ConsultaWizardPage() {
  const [searchParams] = useSearchParams()
  const pacienteId = searchParams.get('paciente') ?? 'p1'
  const paciente = getPaciente(pacienteId)
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [motivo, setMotivo] = useState('')
  const [evaluacion, setEvaluacion] = useState('')
  const { odontograma, presupuestoLineas, setOdontograma } = useConsultaStore()
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null)

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1))
  const prev = () => setStep((s) => Math.max(s - 1, 0))

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-4xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Nueva consulta</h2>
        <p className="text-muted-foreground">
          {paciente?.nombres} {paciente?.apellidos}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {STEPS.map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => setStep(i)}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-medium transition-colors',
              i === step
                ? 'bg-primary text-primary-foreground'
                : i < step
                  ? 'bg-primary/20 text-primary'
                  : 'bg-muted text-muted-foreground',
            )}
          >
            {i + 1}. {label}
          </button>
        ))}
      </div>

      <Card>
        <CardContent className="p-6">
          {step === 0 && (
            <div className="space-y-4">
              <div>
                <Label>Motivo de consulta</Label>
                <Textarea
                  placeholder="Ej. Dolor en molar superior derecho desde hace 3 días"
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label>Evaluación clínica</Label>
                <Textarea
                  placeholder="Examen extraoral e intraoral..."
                  value={evaluacion}
                  onChange={(e) => setEvaluacion(e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <Label>Diagnóstico inicial</Label>
                <Textarea placeholder="Diagnósticos preliminares..." />
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <p className="mb-4 text-sm text-muted-foreground">
                Marca las piezas afectadas. Para el editor completo,{' '}
                <Link to="/odontograma" className="text-primary underline">
                  abre el odontograma
                </Link>
                .
              </p>
              <OdontogramCanvas
                entries={odontograma}
                selectedTooth={selectedTooth}
                onToothSelect={setSelectedTooth}
              />
            </div>
          )}

          {step === 4 && (
            <div>
              <p className="mb-4 text-sm text-muted-foreground">
                Plan auto-generado desde el odontograma:
              </p>
              <PresupuestoTable detalles={presupuestoLineas} />
            </div>
          )}

          {step === 5 && <PresupuestoTable detalles={presupuestoLineas} editable />}

          {step === 6 && (
            <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed border-border">
              <p className="text-sm text-muted-foreground">
                Arrastra fotos o radiografías aquí (próximamente)
              </p>
            </div>
          )}

          {step === 7 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Resumen de consulta</h3>
              <p className="text-sm">
                <strong>Motivo:</strong> {motivo || '—'}
              </p>
              <p className="text-sm">
                <strong>Evaluación:</strong> {evaluacion || '—'}
              </p>
              <p className="text-sm">
                <strong>Tratamientos:</strong> {presupuestoLineas.length} ítem(s)
              </p>
              <div>
                <Label>Agendar seguimiento</Label>
                <Input type="date" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={prev} disabled={step === 0}>
          Anterior
        </Button>
        {step < STEPS.length - 1 ? (
          <Button onClick={next}>Siguiente</Button>
        ) : (
          <Button
            onClick={() => {
              setOdontograma([])
              navigate('/consultas')
            }}
          >
            Finalizar consulta
          </Button>
        )}
      </div>
    </motion.div>
  )
}
