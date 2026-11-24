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

const STEPS = ['Datos clínicos', 'Odontograma y plan', 'Resumen']

const MOTIVOS_RAPIDOS = ['Dolor', 'Control', 'Limpieza', 'Urgencia', 'Estética']

export function ConsultaWizardPage() {
  const [searchParams] = useSearchParams()
  const pacienteId = searchParams.get('paciente') ?? 'p1'
  const paciente = getPaciente(pacienteId)
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [motivo, setMotivo] = useState('')
  const [evaluacion, setEvaluacion] = useState('')
  const [diagnostico, setDiagnostico] = useState('')
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
            <div className="space-y-5">
              <div>
                <Label>Motivo de consulta</Label>
                <div className="mb-2 mt-2 flex flex-wrap gap-2">
                  {MOTIVOS_RAPIDOS.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMotivo((prev) => (prev ? `${prev}, ${m.toLowerCase()}` : m))}
                      className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition hover:border-primary hover:text-primary"
                    >
                      + {m}
                    </button>
                  ))}
                </div>
                <Textarea
                  placeholder="Ej. Dolor en molar superior derecho desde hace 3 días"
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Evaluación clínica</Label>
                  <Textarea
                    placeholder="Examen extraoral e intraoral..."
                    value={evaluacion}
                    onChange={(e) => setEvaluacion(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Diagnóstico inicial</Label>
                  <Textarea
                    placeholder="Diagnósticos preliminares..."
                    value={diagnostico}
                    onChange={(e) => setDiagnostico(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <p className="mb-3 text-sm text-muted-foreground">
                  Toca las piezas afectadas; el plan se genera solo.{' '}
                  <Link to="/odontograma" className="text-primary underline">
                    Abrir editor completo
                  </Link>
                </p>
                <OdontogramCanvas
                  entries={odontograma}
                  selectedTooth={selectedTooth}
                  onToothSelect={setSelectedTooth}
                />
              </div>
              <div>
                <h3 className="mb-2 text-sm font-semibold">Plan y presupuesto</h3>
                <PresupuestoTable detalles={presupuestoLineas} editable />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Resumen de consulta</h3>
              <div className="grid gap-3 text-sm sm:grid-cols-2">
                <p><strong>Motivo:</strong> {motivo || '—'}</p>
                <p><strong>Evaluación:</strong> {evaluacion || '—'}</p>
                <p><strong>Diagnóstico:</strong> {diagnostico || '—'}</p>
                <p><strong>Tratamientos:</strong> {presupuestoLineas.length} ítem(s)</p>
              </div>
              <div className="max-w-xs">
                <Label>Agendar seguimiento (opcional)</Label>
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
