import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin, { type EventResizeDoneArg } from '@fullcalendar/interaction'
import type { EventDropArg } from '@fullcalendar/core'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { citaEstadoBadge } from '@/lib/estados'
import { Input, Label } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { HORA_APERTURA, HORA_CIERRE, validarHorarioCita } from '@/lib/agenda'
import { getPaciente } from '@/lib/mock-data'
import { toDateInput } from '@/lib/utils'
import { useCitasStore } from '@/stores/citasStore'
import { usePacientesStore } from '@/stores/pacientesStore'
import type { Cita } from '@/types/appointment'

const palette = ['#0ea5e9', '#22c55e', '#f97316', '#a855f7', '#ef4444', '#14b8a6']

function colorFor(cita: Cita) {
  let h = 0
  for (const ch of cita.pacienteId) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return palette[h % palette.length]
}

const pad = (n: number) => String(n).padStart(2, '0')
const slot = (h: number) => `${pad(h)}:00:00`
const fmtHora = (iso: string) =>
  new Date(iso).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: false })

type Vista = 'lista' | 'dia' | 'semanal' | 'mensual'
const vistaToFc = { dia: 'timeGridDay', semanal: 'timeGridWeek', mensual: 'dayGridMonth' } as const

export function AgendaCalendar() {
  const navigate = useNavigate()
  const pacientes = usePacientesStore((s) => s.pacientes)
  const citas = useCitasStore((s) => s.citas)
  const updateCita = useCitasStore((s) => s.updateCita)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [vista, setVista] = useState<Vista>('semanal')
  const [aviso, setAviso] = useState('')
  const calRef = useRef<FullCalendar>(null)
  const selectedCita = citas.find((c) => c.id === selectedId) ?? null

  useEffect(() => {
    if (vista !== 'lista') calRef.current?.getApi().changeView(vistaToFc[vista])
  }, [vista])

  const events = useMemo(
    () =>
      citas
        .filter((c) => c.estado !== 'cancelada')
        .map((cita) => {
          const paciente = pacientes.find((p) => p.id === cita.pacienteId)
          return {
            id: cita.id,
            title: paciente ? `${paciente.nombres} ${paciente.apellidos}` : 'Paciente',
            start: cita.fechaInicio,
            end: cita.fechaFin,
            extendedProps: { cita, color: colorFor(cita) },
          }
        }),
    [citas, pacientes],
  )

  const sorted = useMemo(
    () => [...citas].sort((a, b) => a.fechaInicio.localeCompare(b.fechaInicio)),
    [citas],
  )

  // Guarda el nuevo horario al arrastrar/redimensionar, o lo revierte si no es válido.
  const persistirFechas = (info: EventDropArg | EventResizeDoneArg) => {
    const { start, end, id } = info.event
    const cita = citas.find((c) => c.id === id)
    if (!start || !end || !cita) {
      info.revert()
      return
    }
    const err = validarHorarioCita(citas, {
      inicio: start,
      fin: end,
      consultorio: cita.consultorio,
      excludeId: id,
    })
    if (err) {
      info.revert()
      setAviso(err)
      return
    }
    setAviso('')
    updateCita(id, { fechaInicio: start.toISOString(), fechaFin: end.toISOString() })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="min-w-0 lg:col-span-2">
        <Card>
          <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
            <CardTitle>Calendario</CardTitle>
            <Tabs value={vista} onValueChange={(v) => setVista(v as Vista)}>
              <TabsList>
                <TabsTrigger value="lista">Lista</TabsTrigger>
                <TabsTrigger value="dia">Día</TabsTrigger>
                <TabsTrigger value="semanal">Semana</TabsTrigger>
                <TabsTrigger value="mensual">Mes</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            {aviso && (
              <div className="mb-3 flex items-start justify-between gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-900/20 dark:text-red-300">
                <span>{aviso}</span>
                <button type="button" className="text-xs underline" onClick={() => setAviso('')}>
                  Cerrar
                </button>
              </div>
            )}

            {vista === 'lista' ? (
              <ul className="space-y-2">
                {sorted.length === 0 && (
                  <li className="text-sm text-muted-foreground">No hay citas.</li>
                )}
                {sorted.map((cita) => {
                  const p = getPaciente(cita.pacienteId)
                  const d = new Date(cita.fechaInicio)
                  const estado = citaEstadoBadge[cita.estado]
                  return (
                    <li key={cita.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(cita.id)}
                        className={`flex w-full items-center gap-3 rounded-lg border border-border p-3 text-left transition hover:bg-muted ${
                          cita.estado === 'cancelada' ? 'opacity-50' : ''
                        } ${selectedId === cita.id ? 'ring-2 ring-primary' : ''}`}
                        style={{ borderLeft: `4px solid ${colorFor(cita)}` }}
                      >
                        <div className="w-28 shrink-0 text-xs text-muted-foreground">
                          <p className="font-semibold text-foreground">
                            {d.toLocaleDateString('es-PE', {
                              weekday: 'short',
                              day: '2-digit',
                              month: 'short',
                            })}
                          </p>
                          {fmtHora(cita.fechaInicio)} – {fmtHora(cita.fechaFin)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {p ? `${p.nombres} ${p.apellidos}` : 'Paciente'}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {cita.tratamiento ?? cita.motivo ?? 'Cita'}
                            {cita.consultorio && ` · ${cita.consultorio}`}
                          </p>
                        </div>
                        <Badge variant={estado?.variant}>{estado?.label}</Badge>
                      </button>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <FullCalendar
                ref={calRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView={vistaToFc[vista]}
                headerToolbar={{ left: 'prev,next today', center: 'title', right: '' }}
                buttonText={{ today: 'Hoy' }}
                slotMinTime={slot(HORA_APERTURA)}
                slotMaxTime={slot(HORA_CIERRE)}
                slotLabelFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
                eventTimeFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
                allDaySlot={false}
                locale="es"
                firstDay={1}
                height="auto"
                events={events}
                eventContent={(arg) => {
                  const c = arg.event.extendedProps.cita as Cita
                  return (
                    <div className="cita-ev">
                      <div className="cita-ev-time">{arg.timeText}</div>
                      <div className="cita-ev-title">{arg.event.title}</div>
                      <div className="cita-ev-sub">{c.tratamiento ?? c.motivo}</div>
                    </div>
                  )
                }}
                eventDidMount={(info) => {
                  info.el.style.setProperty('--ev-color', info.event.extendedProps.color as string)
                }}
                editable
                eventDrop={persistirFechas}
                eventResize={persistirFechas}
                eventClick={(info) => setSelectedId(info.event.id)}
                dateClick={(info) => {
                  // En la vista mensual no hay hora: se deja vacía para elegirla.
                  const fecha = toDateInput(info.date)
                  const hora = info.allDay
                    ? ''
                    : `${pad(info.date.getHours())}:${pad(info.date.getMinutes())}`
                  navigate(`/reservas/nueva?fecha=${fecha}${hora ? `&hora=${hora}` : ''}`)
                }}
                nowIndicator
              />
            )}
            {vista !== 'lista' && (
              <p className="mt-3 text-xs text-muted-foreground">
                Haz clic en un espacio libre para crear una cita · Arrastra una cita para moverla
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div>
        {selectedCita ? (
          <CitaDetailPanel
            key={selectedCita.id}
            cita={selectedCita}
            onClose={() => setSelectedId(null)}
          />
        ) : (
          <Card>
            <CardContent className="flex h-64 items-center justify-center p-6">
              <p className="text-center text-sm text-muted-foreground">
                Selecciona una cita para ver el detalle.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

function CitaDetailPanel({ cita, onClose }: { cita: Cita; onClose: () => void }) {
  const citas = useCitasStore((s) => s.citas)
  const updateCita = useCitasStore((s) => s.updateCita)
  const paciente = getPaciente(cita.pacienteId)
  const estado = citaEstadoBadge[cita.estado]
  const inicioActual = new Date(cita.fechaInicio)
  const cancelada = cita.estado === 'cancelada'

  const [reprogramando, setReprogramando] = useState(false)
  const [fecha, setFecha] = useState(toDateInput(inicioActual))
  const [hora, setHora] = useState(
    `${pad(inicioActual.getHours())}:${pad(inicioActual.getMinutes())}`,
  )
  const [error, setError] = useState('')

  const guardarReprogramacion = () => {
    const duracion = new Date(cita.fechaFin).getTime() - inicioActual.getTime()
    const inicio = new Date(`${fecha}T${hora}`)
    const fin = new Date(inicio.getTime() + duracion)
    const err = validarHorarioCita(citas, {
      inicio,
      fin,
      consultorio: cita.consultorio,
      excludeId: cita.id,
    })
    if (err) {
      setError(err)
      return
    }
    updateCita(cita.id, {
      fechaInicio: inicio.toISOString(),
      fechaFin: fin.toISOString(),
      estado: 'reprogramada',
    })
    setError('')
    setReprogramando(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Detalle de cita</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
            {paciente?.nombres.charAt(0) ?? '?'}
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold">
              {paciente ? `${paciente.nombres} ${paciente.apellidos}` : 'Paciente no encontrado'}
            </p>
            <p className="truncate text-sm text-muted-foreground">
              {paciente?.email ?? paciente?.telefono ?? ''}
            </p>
          </div>
        </div>

        <Badge variant={estado?.variant}>{estado?.label}</Badge>

        {paciente?.alergias && (
          <p className="text-sm font-medium text-destructive">⚠ Alergia: {paciente.alergias}</p>
        )}

        <div className="space-y-1 text-sm">
          <p>
            <span className="text-muted-foreground">Tratamiento:</span>{' '}
            {cita.tratamiento ?? cita.motivo ?? '—'}
          </p>
          <p>
            <span className="text-muted-foreground">Consultorio:</span> {cita.consultorio ?? '—'}
          </p>
          <p className="capitalize">
            <span className="normal-case text-muted-foreground">Fecha:</span>{' '}
            {inicioActual.toLocaleDateString('es-PE', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </p>
          <p>
            <span className="text-muted-foreground">Hora:</span> {fmtHora(cita.fechaInicio)} –{' '}
            {fmtHora(cita.fechaFin)}
          </p>
        </div>

        {reprogramando && (
          <div className="space-y-3 rounded-lg border border-border p-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Fecha</Label>
                <Input
                  type="date"
                  min={toDateInput(new Date())}
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                />
              </div>
              <div>
                <Label>Hora</Label>
                <Input type="time" value={hora} onChange={(e) => setHora(e.target.value)} />
              </div>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="flex gap-2">
              <Button size="sm" onClick={guardarReprogramacion}>
                Guardar
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setReprogramando(false)
                  setError('')
                }}
              >
                Volver
              </Button>
            </div>
          </div>
        )}

        {!cancelada && !reprogramando && (
          <div className="flex flex-wrap gap-2">
            {cita.estado === 'en_espera' ? (
              <Button
                size="sm"
                className="bg-green-600 text-white hover:bg-green-700"
                onClick={() => updateCita(cita.id, { estado: 'atendida' })}
              >
                Marcar atendida
              </Button>
            ) : cita.estado !== 'atendida' ? (
              <Button
                size="sm"
                className="bg-green-600 text-white hover:bg-green-700"
                onClick={() => updateCita(cita.id, { estado: 'en_espera' })}
              >
                Llegó
              </Button>
            ) : null}
            <Button size="sm" variant="outline" onClick={() => setReprogramando(true)}>
              Reprogramar
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                if (window.confirm('¿Cancelar esta cita?')) {
                  updateCita(cita.id, { estado: 'cancelada' })
                  onClose()
                }
              }}
            >
              Cancelar cita
            </Button>
          </div>
        )}

        {cancelada && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => updateCita(cita.id, { estado: 'programada' })}
          >
            Restaurar cita
          </Button>
        )}

        <Button variant="ghost" size="sm" onClick={onClose}>
          Cerrar
        </Button>
      </CardContent>
    </Card>
  )
}
