import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge, citaEstadoBadge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { citas, getPaciente } from '@/lib/mock-data'
import type { Cita } from '@/types/appointment'

const borderColors = ['#ef4444', '#0ea5e9', '#f97316', '#22c55e', '#a855f7']

export function AgendaCalendar() {
  const [selectedCita, setSelectedCita] = useState<Cita | null>(null)

  const events = useMemo(
    () =>
      citas.map((cita, i) => {
        const paciente = getPaciente(cita.pacienteId)
        return {
          id: cita.id,
          title: `${paciente?.nombres ?? 'Paciente'} — ${cita.tratamiento ?? cita.motivo ?? 'Cita'}`,
          start: cita.fechaInicio,
          end: cita.fechaFin,
          backgroundColor: '#ffffff',
          borderColor: borderColors[i % borderColors.length],
          textColor: '#0f172a',
          extendedProps: { cita },
        }
      }),
    [],
  )

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Calendario</CardTitle>
            <Tabs defaultValue="semanal">
              <TabsList>
                <TabsTrigger value="lista">Lista</TabsTrigger>
                <TabsTrigger value="mensual">Mensual</TabsTrigger>
                <TabsTrigger value="semanal">Semanal</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay',
              }}
              slotMinTime="08:00:00"
              slotMaxTime="20:00:00"
              allDaySlot={false}
              locale="es"
              height="auto"
              events={events}
              editable
              selectable
              eventClick={(info) => setSelectedCita(info.event.extendedProps.cita as Cita)}
              nowIndicator
            />
          </CardContent>
        </Card>
      </div>

      <div>
        {selectedCita ? (
          <CitaDetailPanel cita={selectedCita} onClose={() => setSelectedCita(null)} />
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
          <Button size="sm" className="bg-green-600 hover:bg-green-700">
            Llegó
          </Button>
          <Button size="sm" variant="outline">
            Reprogramar
          </Button>
          <Button size="sm" variant="outline">
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
