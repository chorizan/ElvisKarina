import { motion } from 'framer-motion'
import { Box, Presentation } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  DiagnosticCatalog,
  ProcedureCatalog,
} from '@/components/odontogram/DiagnosticCatalog'
import { OdontogramCanvas } from '@/components/odontogram/OdontogramCanvas'
import { PatientPresentationMode } from '@/components/odontogram/PatientPresentationMode'
import { ToothDetailPanel } from '@/components/odontogram/ToothDetailPanel'
import { Button } from '@/components/ui/button'
import { consultas, getPaciente } from '@/lib/mock-data'
import { TRATAMIENTOS } from '@/lib/tooth-states'
import type { Prioridad } from '@/types/consultation'
import type { ToothStateKey } from '@/lib/tooth-states'
import { useConsultaStore } from '@/stores/consultaStore'

export function OdontogramPage() {
  const consulta = consultas[0]
  const paciente = getPaciente(consulta.pacienteId)
  const {
    odontograma,
    presupuestoLineas,
    lastAction,
    setOdontograma,
    addOdontogramaEntry,
    removeOdontogramaEntry,
  } = useConsultaStore()

  const [selectedTooth, setSelectedTooth] = useState<number | null>(null)
  const [diagnostico, setDiagnostico] = useState('')
  const [tratamiento, setTratamiento] = useState('')
  const [prioridad, setPrioridad] = useState<Prioridad>('media')
  const [observacion, setObservacion] = useState('')
  const [presentMode, setPresentMode] = useState(false)

  useEffect(() => {
    if (odontograma.length === 0 && consulta.odontograma.length > 0) {
      setOdontograma(consulta.odontograma)
    }
  }, [consulta.odontograma, odontograma.length, setOdontograma])

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
  }

  const total = presupuestoLineas.reduce((s, l) => s + l.subtotal, 0)

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
              {paciente?.nombres} {paciente?.apellidos} · Consulta #{consulta.id}
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
            <Button size="sm">Guardar odontograma</Button>
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
          <aside className="hidden w-56 shrink-0 flex-col gap-3 overflow-y-auto border-r border-border bg-muted/20 p-3 xl:flex xl:w-64">
            <DiagnosticCatalog entries={odontograma} onRemove={removeOdontogramaEntry} />
            <ProcedureCatalog entries={odontograma} onRemove={removeOdontogramaEntry} />
            {presupuestoLineas.length > 0 && (
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="font-medium">Presupuesto vinculado</p>
                <p className="text-muted-foreground">{presupuestoLineas.length} tratamiento(s)</p>
                <Button variant="ghost" size="sm" className="h-auto p-0 text-primary" asChild>
                  <Link to="/presupuestos/b1">Ver presupuesto →</Link>
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
        pacienteNombre={`${paciente?.nombres} ${paciente?.apellidos}`}
        entries={odontograma}
        total={total}
      />
    </>
  )
}
