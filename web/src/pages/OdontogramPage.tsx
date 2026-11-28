import { motion } from 'framer-motion'
import { Box, Check, Presentation } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  DiagnosticCatalog,
  ProcedureCatalog,
} from '@/components/odontogram/DiagnosticCatalog'
import { OdontogramCanvas } from '@/components/odontogram/OdontogramCanvas'
import { PatientPresentationMode } from '@/components/odontogram/PatientPresentationMode'
import { ToothDetailPanel } from '@/components/odontogram/ToothDetailPanel'
import { Button } from '@/components/ui/button'
import { getPaciente, presupuestos } from '@/lib/mock-data'
import { useConsultasStore } from '@/stores/consultasStore'
import { TRATAMIENTOS } from '@/lib/tooth-states'
import type { Prioridad } from '@/types/consultation'
import type { ToothStateKey } from '@/lib/tooth-states'
import { useConsultaStore } from '@/stores/consultaStore'
import { formatDate } from '@/lib/utils'

export function OdontogramPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const consultas = useConsultasStore((s) => s.consultas)
  const updateConsulta = useConsultasStore((s) => s.updateConsulta)
  const {
    consultaId,
    odontograma,
    presupuestoLineas,
    lastAction,
    dirty,
    loadConsulta,
    addOdontogramaEntry,
    removeOdontogramaEntry,
    removeTratamiento,
    markSaved,
  } = useConsultaStore()

  // Consulta a mostrar: la del parámetro ?consulta=, si no la que ya está cargada, si no la primera.
  const consulta =
    consultas.find((c) => c.id === searchParams.get('consulta')) ??
    consultas.find((c) => c.id === consultaId) ??
    consultas[0]
  const paciente = consulta ? getPaciente(consulta.pacienteId) : undefined
  const presupuesto = consulta ? presupuestos.find((p) => p.consultaId === consulta.id) : undefined

  useEffect(() => {
    if (consulta && consulta.id !== consultaId) loadConsulta(consulta.id, consulta.odontograma)
  }, [consulta, consultaId, loadConsulta])

  const handleSave = () => {
    if (!consulta) return
    updateConsulta(consulta.id, { odontograma })
    markSaved()
  }

  const [selectedTooth, setSelectedTooth] = useState<number | null>(null)
  const [diagnostico, setDiagnostico] = useState('')
  const [tratamiento, setTratamiento] = useState('')
  const [prioridad, setPrioridad] = useState<Prioridad>('media')
  const [observacion, setObservacion] = useState('')
  const [presentMode, setPresentMode] = useState(false)

  const handleAdd = () => {
    if (!selectedTooth || !diagnostico) return
    const precio = TRATAMIENTOS.find((t) => t.value === tratamiento)?.precio
    addOdontogramaEntry({
      id: `o-${Date.now()}`,
      pieza: selectedTooth,
      diagnostico: diagnostico as ToothStateKey,
      tratamiento: tratamiento || undefined,
      prioridad,
      observacion: observacion || undefined,
      enTratamiento: !!tratamiento,
      precio,
    })
    setObservacion('')
    setTratamiento('')
  }

  const total = presupuestoLineas.reduce((s, l) => s + l.subtotal, 0)

  if (!consulta) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
        <p className="text-muted-foreground">No hay consultas registradas todavía.</p>
        <Button onClick={() => navigate('/consultas/nueva')}>Nueva consulta</Button>
      </div>
    )
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex h-full min-h-0 flex-col"
      >
        {/* Barra superior compacta */}
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
          <div>
            <h2 className="text-lg font-bold leading-tight">Odontograma clínico</h2>
            <p className="text-sm text-muted-foreground">
              {paciente?.nombres} {paciente?.apellidos} · Consulta del {formatDate(consulta.fecha)}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/odontograma/3d">
                <Box className="h-4 w-4" />
                Ver en 3D
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={() => setPresentMode(true)}>
              <Presentation className="h-4 w-4" />
              Presentar al paciente
            </Button>
            <Button size="sm" onClick={handleSave} disabled={!dirty}>
              {dirty ? (
                'Guardar odontograma'
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Guardado
                </>
              )}
            </Button>
          </div>
        </div>

        {lastAction && (
          <div className="shrink-0 border-b border-primary/20 bg-primary/5 px-4 py-2 text-sm">
            Última acción: {lastAction}
          </div>
        )}

        {/* Área principal a pantalla completa */}
        <div className="flex min-h-0 flex-1">
          {/* Panel izquierdo */}
          <aside className="hidden w-64 shrink-0 flex-col gap-3 overflow-y-auto border-r border-border bg-muted/20 p-3 xl:flex xl:w-72">
            <DiagnosticCatalog entries={odontograma} onRemove={removeOdontogramaEntry} />
            <ProcedureCatalog entries={odontograma} onRemove={removeTratamiento} />
            {presupuestoLineas.length > 0 && (
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="font-medium">Presupuesto vinculado</p>
                <p className="text-muted-foreground">{presupuestoLineas.length} tratamiento(s)</p>
                <Button variant="ghost" size="sm" className="h-auto p-0 text-primary" asChild>
                  <Link to={presupuesto ? `/presupuestos/${presupuesto.id}` : '/presupuestos'}>
                    Ver presupuesto →
                  </Link>
                </Button>
              </div>
            )}
          </aside>

          {/* Odontograma — ocupa todo el espacio central */}
          <div className="min-w-0 flex-1 p-3">
            <OdontogramCanvas
              entries={odontograma}
              selectedTooth={selectedTooth}
              onToothSelect={setSelectedTooth}
              fullSize
              className="h-full"
            />
          </div>

          {/* Panel derecho */}
          <aside className="w-72 shrink-0 overflow-y-auto border-l border-border bg-muted/20 p-3 lg:w-80">
            <ToothDetailPanel
              pieza={selectedTooth}
              diagnostico={diagnostico}
              tratamiento={tratamiento}
              prioridad={prioridad}
              observacion={observacion}
              onDiagnosticoChange={setDiagnostico}
              onTratamientoChange={setTratamiento}
              onPrioridadChange={setPrioridad}
              onObservacionChange={setObservacion}
              onAdd={handleAdd}
            />
          </aside>
        </div>
      </motion.div>

      <PatientPresentationMode
        open={presentMode}
        onClose={() => setPresentMode(false)}
        pacienteNombre={`${paciente?.nombres ?? ''} ${paciente?.apellidos ?? ''}`.trim()}
        onVerPlan={() => {
          setPresentMode(false)
          navigate(presupuesto ? `/presupuestos/${presupuesto.id}` : '/presupuestos')
        }}
        entries={odontograma}
        total={total}
      />
    </>
  )
}
