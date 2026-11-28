import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { PresupuestoTable } from '@/components/budgets/PresupuestoTable'
import { DiagnosticCatalog } from '@/components/odontogram/DiagnosticCatalog'
import { OdontogramCanvas } from '@/components/odontogram/OdontogramCanvas'
import { ToothDetailPanel } from '@/components/odontogram/ToothDetailPanel'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input, Label, Select, Textarea } from '@/components/ui/input'
import { usuarioActual } from '@/lib/mock-data'
import { TRATAMIENTOS, type ToothStateKey } from '@/lib/tooth-states'
import { cn, toDateInput } from '@/lib/utils'
import { useCitasStore } from '@/stores/citasStore'
import { useConsultaStore } from '@/stores/consultaStore'
import { useConsultasStore } from '@/stores/consultasStore'
import { usePacientesStore } from '@/stores/pacientesStore'
import type { Prioridad } from '@/types/consultation'

const STEPS = ['Datos clínicos', 'Odontograma y plan', 'Resumen']

const MOTIVOS_RAPIDOS = ['Dolor', 'Control', 'Limpieza', 'Urgencia', 'Estética']

export function ConsultaWizardPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const pacientes = usePacientesStore((s) => s.pacientes)
  const addConsulta = useConsultasStore((s) => s.addConsulta)
  const addCita = useCitasStore((s) => s.addCita)
  const {
    odontograma,
    presupuestoLineas,
    reset,
    addOdontogramaEntry,
    removeOdontogramaEntry,
  } = useConsultaStore()

  const [pacienteId, setPacienteId] = useState(searchParams.get('paciente') ?? '')
  const paciente = pacientes.find((p) => p.id === pacienteId)
  const [step, setStep] = useState(0)
  const [motivo, setMotivo] = useState('')
  const [evaluacion, setEvaluacion] = useState('')
  const [diagnosticoTexto, setDiagnosticoTexto] = useState('')
  const [seguimiento, setSeguimiento] = useState('')
  const [seguimientoHora, setSeguimientoHora] = useState('09:00')
  const [error, setError] = useState('')

  // Panel de pieza
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null)
  const [dxPieza, setDxPieza] = useState('')
  const [tratamiento, setTratamiento] = useState('')
  const [prioridad, setPrioridad] = useState<Prioridad>('media')
  const [observacion, setObservacion] = useState('')

  // Cada consulta nueva empieza con un odontograma vacío.
  useEffect(() => {
    reset()
  }, [reset])

  const next = () => {
    if (step === 0 && !pacienteId) {
      setError('Selecciona un paciente para continuar.')
      return
    }
    setError('')
    setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }
  const prev = () => setStep((s) => Math.max(s - 1, 0))
  const goTo = (i: number) => {
    if (i > 0 && !pacienteId) {
      setError('Selecciona un paciente para continuar.')
      return
    }
    setError('')
    setStep(i)
  }

  const handleAddPieza = () => {
    if (!selectedTooth || !dxPieza) return
    addOdontogramaEntry({
      id: `o-${Date.now()}`,
      pieza: selectedTooth,
      diagnostico: dxPieza as ToothStateKey,
      tratamiento: tratamiento || undefined,
      prioridad,
      observacion: observacion || undefined,
      enTratamiento: !!tratamiento,
      precio: TRATAMIENTOS.find((t) => t.value === tratamiento)?.precio,
    })
    setObservacion('')
    setTratamiento('')
  }

  const finalizar = () => {
    if (!pacienteId) {
      setStep(0)
      setError('Selecciona un paciente para continuar.')
      return
    }
    const consulta = addConsulta({
      pacienteId,
      odontologoId: usuarioActual.id,
      fecha: new Date().toISOString(),
      motivo: motivo.trim() || undefined,
      evaluacion: [evaluacion.trim(), diagnosticoTexto.trim() && `Dx: ${diagnosticoTexto.trim()}`]
        .filter(Boolean)
        .join(' · ') || undefined,
      estado: 'completada',
      odontograma,
    })
    if (seguimiento) {
      const inicio = new Date(`${seguimiento}T${seguimientoHora || '09:00'}`)
      addCita({
        pacienteId,
        odontologoId: usuarioActual.id,
        consultorio: 'Consultorio 1',
        fechaInicio: inicio.toISOString(),
        fechaFin: new Date(inicio.getTime() + 30 * 60000).toISOString(),
        tratamiento: 'Control / seguimiento',
        motivo: `Seguimiento de consulta ${consulta.id}`,
        estado: 'programada',
      })
    }
    reset()
    navigate('/consultas')
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-5xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Nueva consulta</h2>
        <p className="text-muted-foreground">
          {paciente ? `${paciente.nombres} ${paciente.apellidos}` : 'Selecciona un paciente'}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {STEPS.map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => goTo(i)}
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
              <div className="max-w-md">
                <Label>Paciente *</Label>
                <Select value={pacienteId} onChange={(e) => setPacienteId(e.target.value)}>
                  <option value="">Seleccionar paciente...</option>
                  {pacientes.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombres} {p.apellidos} · {p.codigo}
                    </option>
                  ))}
                </Select>
                {paciente?.alergias && (
                  <p className="mt-2 text-sm font-medium text-destructive">
                    ⚠ Alergia: {paciente.alergias}
                  </p>
                )}
              </div>
              <div>
                <Label>Motivo de consulta</Label>
                <div className="mb-2 mt-2 flex flex-wrap gap-2">
                  {MOTIVOS_RAPIDOS.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() =>
                        setMotivo((prev) => (prev ? `${prev}, ${m.toLowerCase()}` : m))
                      }
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
                    value={diagnosticoTexto}
                    onChange={(e) => setDiagnosticoTexto(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <p className="text-sm text-muted-foreground">
                Toca una pieza, elige diagnóstico y tratamiento y pulsa “Agregar”. El plan se
                genera solo.{' '}
                <Link to="/odontograma" className="text-primary underline">
                  Abrir editor completo
                </Link>
              </p>
              <div className="grid gap-4 lg:grid-cols-[1fr_18rem]">
                <OdontogramCanvas
                  entries={odontograma}
                  selectedTooth={selectedTooth}
                  onToothSelect={setSelectedTooth}
                />
                <div className="space-y-4">
                  <ToothDetailPanel
                    pieza={selectedTooth}
                    diagnostico={dxPieza}
                    tratamiento={tratamiento}
                    prioridad={prioridad}
                    observacion={observacion}
                    onDiagnosticoChange={setDxPieza}
                    onTratamientoChange={setTratamiento}
                    onPrioridadChange={setPrioridad}
                    onObservacionChange={setObservacion}
                    onAdd={handleAddPieza}
                  />
                  <DiagnosticCatalog entries={odontograma} onRemove={removeOdontogramaEntry} />
                </div>
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
                <p>
                  <strong>Paciente:</strong> {paciente?.nombres} {paciente?.apellidos}
                </p>
                <p>
                  <strong>Motivo:</strong> {motivo || '—'}
                </p>
                <p>
                  <strong>Evaluación:</strong> {evaluacion || '—'}
                </p>
                <p>
                  <strong>Diagnóstico:</strong> {diagnosticoTexto || '—'}
                </p>
                <p>
                  <strong>Piezas registradas:</strong> {odontograma.length}
                </p>
                <p>
                  <strong>Tratamientos:</strong> {presupuestoLineas.length} ítem(s)
                </p>
              </div>
              <div className="grid max-w-md grid-cols-2 gap-3">
                <div>
                  <Label>Agendar seguimiento (opcional)</Label>
                  <Input
                    type="date"
                    min={toDateInput(new Date())}
                    value={seguimiento}
                    onChange={(e) => setSeguimiento(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Hora</Label>
                  <Input
                    type="time"
                    min="08:00"
                    max="19:30"
                    value={seguimientoHora}
                    onChange={(e) => setSeguimientoHora(e.target.value)}
                    disabled={!seguimiento}
                  />
                </div>
              </div>
            </div>
          )}

          {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={prev} disabled={step === 0}>
          Anterior
        </Button>
        {step < STEPS.length - 1 ? (
          <Button onClick={next}>Siguiente</Button>
        ) : (
          <Button onClick={finalizar}>Finalizar consulta</Button>
        )}
      </div>
    </motion.div>
  )
}
