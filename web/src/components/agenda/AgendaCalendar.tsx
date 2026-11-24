import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge, citaEstadoBadge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getPaciente } from '@/lib/mock-data'
import { useCitasStore } from '@/stores/citasStore'
import type { Cita } from '@/types/appointment'

const palette = ['#0ea5e9', '#22c55e', '#f97316', '#a855f7', '#ef4444', '#14b8a6']

function colorFor(cita: Cita) {
  let h = 0
  for (const ch of cita.pacienteId) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return palette[h % palette.length]
}

const fmtHora = (iso: string) =>
  new Date(iso).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: false })

type Vista = 'lista' | 'mensual' | 'semanal'
const vistaToFc = { mensual: 'dayGridMonth', semanal: 'timeGridWeek' } as const

export function AgendaCalendar() {
  const citas = useCitasStore((s) => s.citas)
  const updateCita = useCitasStore((s) => s.updateCita)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [vista, setVista] = useState<Vista>('semanal')
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
          const paciente = getPaciente(cita.pacienteId)
          return {
            id: cita.id,
            title: `${paciente?.nombres ?? 'Paciente'} ${paciente?.apellidos ?? ''}`.trim(),
            start: cita.fechaInicio,
            end: cita.fechaFin,
            extendedProps: { cita, color: colorFor(cita) },
          }
        }),
    [citas],
  )

  const sorted = useMemo(
    () => [...citas].sort((a, b) => a.fechaInicio.localeCompare(b.fechaInicio)),
    [citas],
  )

  const persistirFechas = (id: string, start: Date | null, end: Date | null) => {
    if (start && end)
      updateCita(id, { fechaInicio: start.toISOString(), fechaFin: end.toISOString() })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Calendario</CardTitle>
            <Tabs value={vista} onValueChange={(v) => setVista(v as Vista)}>
              <TabsList>
                <TabsTrigger value="lista">Lista</TabsTrigger>
                <TabsTrigger value="mensual">Mensual</TabsTrigger>
                <TabsTrigger value="semanal">Semanal</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            {vista === 'lista' ? (
              <ul className="space-y-2">
                {sorted.length === 0 && (
                  <li className="text-sm text-muted-foreground">No hay citas.</li>
                )}
                {sorted.map((cita) => {
                  const p = getPaciente(cita.pacienteId)
                  const d = new Date(cita.fechaInicio)
                  return (
                    <li key={cita.id}>
                      <button
                        onClick={() => setSelectedId(cita.id)}
                        className="flex w-full items-center gap-3 rounded-lg border border-border p-3 text-left transition hover:bg-muted"
                        style={{ borderLeft: `4px solid ${colorFor(cita)}` }}
                      >
                        <div className="w-28 text-xs text-muted-foreground">
                          <p className="font-semibold text-foreground">
                            {d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })}
                          </p>
                          {fmtHora(cita.fechaInicio)} - {fmtHora(cita.fechaFin)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {p?.nombres} {p?.apellidos}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {cita.tratamiento ?? cita.motivo} · {cita.consultorio}
                          </p>
                        </div>
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
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,timeGridWeek,timeGridDay',
                }}
                buttonText={{ today: 'Hoy', month: 'Mes', week: 'Semana', day: 'Día' }}
                slotMinTime="08:00:00"
                slotMaxTime="20:00:00"
                slotLabelFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
                eventTimeFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
                allDaySlot={false}
                locale="es"
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
                eventDrop={(i) => persistirFechas(i.event.id, i.event.start, i.event.end)}
                eventResize={(i) => persistirFechas(i.event.id, i.event.start, i.event.end)}
                eventClick={(info) => setSelectedId(info.event.id)}
                nowIndicator
              />
            )}
          </CardContent>
        </Card>
      </div>

      <div>
        {selectedCita ? (
          <CitaDetailPanel cita={selectedCita} onClose={() => setSelectedId(null)} />
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
  const updateCita = useCitasStore((s) => s.updateCita)
  const paciente = getPaciente(cita.pacienteId)
  const estado = citaEstadoBadge[cita.estado]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Detalle de cita</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
            {paciente?.nombres.charAt(0)}
          </div>
          <div>
            <p className="font-semibold">
              {paciente?.nombres} {paciente?.apellidos}
            </p>
            <p className="text-sm text-muted-foreground">{paciente?.email}</p>
          </div>
        </div>

        <Badge variant={estado?.variant}>{estado?.label}</Badge>

        <div className="space-y-1 text-sm">
          <p>
            <span className="text-muted-foreground">Tratamiento:</span> {cita.tratamiento}
          </p>
          <p>
            <span className="text-muted-foreground">Consultorio:</span> {cita.consultorio}
          </p>
          <p>
            <span className="text-muted-foreground">Hora:</span>{' '}
            {new Date(cita.fechaInicio).toLocaleString('es-PE')}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700"
            onClick={() => updateCita(cita.id, { estado: 'en_espera' })}
          >
            Llegó
          </Button>
          <Button size="sm" variant="outline">
            Reprogramar
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              updateCita(cita.id, { estado: 'cancelada' })
              onClose()
            }}
          >
            Cancelar
          </Button>
        </div>

        <Button variant="ghost" size="sm" onClick={onClose}>
          Cerrar
        </Button>
      </CardContent>
    </Card>
  )
}
